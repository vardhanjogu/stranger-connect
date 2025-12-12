import Peer from 'peerjs';

// Protocol Definition
type EventType = 'chat' | 'typing' | 'signal';

interface P2PEvent {
    type: EventType;
    payload: any;
}

// P2P State
let peer: Peer | null = null;
let connection: any = null;
let heartbeatInterval: any = null;
let isSessionActive = false; // Flag to control polling loops

// Callbacks
let onMessageCallback: ((text: string) => void) | null = null;
let onTypingCallback: ((isTyping: boolean) => void) | null = null;
let onDisconnectCallback: (() => void) | null = null;
let onConnectCallback: (() => void) | null = null;

// --- P2P Logic ---

export const initializePeerSession = async (
    onConnect: () => void,
    onMessage: (text: string) => void,
    onTyping: (isTyping: boolean) => void,
    onDisconnect: () => void
): Promise<void> => {
    
    // Cleanup previous session
    terminateSession();
    isSessionActive = true;

    onConnectCallback = onConnect;
    onMessageCallback = onMessage;
    onTypingCallback = onTyping;
    onDisconnectCallback = onDisconnect;

    return new Promise((resolve, reject) => {
        // Create a new PeerJS ID with Google STUN servers for better connectivity
        peer = new Peer({
            debug: 1,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                ],
            }
        });

        const connectionTimeout = setTimeout(() => {
            reject(new Error("Connection to PeerServer timed out."));
        }, 15000);

        peer.on('open', async (id) => {
            clearTimeout(connectionTimeout);
            console.log('My Peer ID:', id);
            
            // Start Heartbeat
            startHeartbeat(id);

            // Start Polling for Match
            // We resolve immediately so the UI shows "Searching...", 
            // but the search happens in background loop.
            pollForMatch(id).catch(console.error);
            resolve();
        });

        peer.on('error', (err) => {
            clearTimeout(connectionTimeout);
            console.error("PeerJS Error:", err);
            // If critical error, disconnect
            if (['peer-unavailable', 'network', 'webrtc'].includes(err.type)) {
                if (onDisconnectCallback) onDisconnectCallback();
            }
        });

        // Handle Incoming Connection (We are the 'receiver')
        peer.on('connection', (conn) => {
            // If we are already connected, close this new one (1-on-1 only)
            if (connection && connection.open) {
                conn.close();
                return;
            }
            console.log("Incoming connection received!");
            setupConnection(conn);
        });
    });
};

const startHeartbeat = (peerId: string) => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    
    const sendPulse = () => {
        if (!isSessionActive) return;
        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ peerId, action: 'heartbeat' })
        }).catch(() => {});
    };

    // Send immediately
    sendPulse();

    // Then every 5 seconds (more frequent for mobile reliability)
    heartbeatInterval = setInterval(sendPulse, 5000);
};

// Robust Polling Mechanism
const pollForMatch = async (myPeerId: string) => {
    let attempts = 0;
    
    while (isSessionActive) {
        // If we are already connected or connecting, stop looking
        if (connection || (peer && peer.disconnected)) {
            break;
        }

        try {
            // Poll the matchmaking endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peerId: myPeerId, action: 'join' })
            });

            if (response.ok) {
                const data = await response.json();

                if (data.status === 'matched' && data.matchPeerId) {
                    console.log("Match found via polling! Connecting to:", data.matchPeerId);
                    
                    if (peer) {
                        const conn = peer.connect(data.matchPeerId, {
                            reliable: true
                        });
                        setupConnection(conn);
                        return; // Stop polling
                    }
                } else {
                    console.log("Still waiting for partner...");
                }
            }
        } catch (e) {
            console.warn("Matchmaking poll failed, retrying...", e);
        }

        attempts++;
        // Wait 2 seconds before next poll to avoid spamming but keep it snappy
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
};

const setupConnection = (conn: any) => {
    if (connection) {
        // Already have a connection?
        // If the new one is open and old one is not, switch.
        if (!connection.open && conn.open) {
            connection = conn;
        } else if (connection.open) {
            // We are already chatting. Ignore.
            return;
        }
    }
    
    connection = conn;

    connection.on('open', () => {
        console.log("Connection Established!");
        if (onConnectCallback) onConnectCallback();
    });

    connection.on('data', (data: P2PEvent) => {
        if (data.type === 'chat' && onMessageCallback) {
            onMessageCallback(data.payload);
        } else if (data.type === 'typing' && onTypingCallback) {
            onTypingCallback(data.payload);
        } else if (data.type === 'signal') {
            if (data.payload === 'TIMEOUT' && onMessageCallback) {
                onMessageCallback("__TIMEOUT_SIGNAL__");
            }
        }
    });

    connection.on('close', () => {
        console.log("Connection Closed");
        if (onDisconnectCallback) onDisconnectCallback();
    });
    
    connection.on('error', (err: any) => {
        console.error("Connection Error:", err);
        if (onDisconnectCallback) onDisconnectCallback();
    });
};

// --- Unified Methods ---

export const sendMessageToStranger = async (message: string): Promise<void> => {
    if (connection && connection.open) {
        const event: P2PEvent = { type: 'chat', payload: message };
        connection.send(event);
    } else {
        console.warn("Cannot send message, P2P connection not open");
    }
};

export const sendTypingStatus = async (isTyping: boolean): Promise<void> => {
    if (connection && connection.open) {
        const event: P2PEvent = { type: 'typing', payload: isTyping };
        connection.send(event);
    }
};

export const sendSignal = async (signal: string): Promise<void> => {
    if (connection && connection.open) {
        const event: P2PEvent = { type: 'signal', payload: signal };
        connection.send(event);
    }
};

export const terminateSession = () => {
    isSessionActive = false; // Stop loops

    // P2P Cleanup
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
    
    // Clear callbacks
    onMessageCallback = null;
    onTypingCallback = null;
    onDisconnectCallback = null;
    onConnectCallback = null;

    if (connection) {
        connection.close();
        connection = null;
    }
    if (peer) {
        // Notify server we are leaving
        if (peer.id) {
            fetch('/api/chat', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peerId: peer.id, action: 'leave' }) 
            }).catch(() => {});
        }
        peer.destroy();
        peer = null;
    }
};