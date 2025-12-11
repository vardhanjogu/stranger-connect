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

            try {
                // Call our local Matchmaking API to find a partner
                await findMatch(id);
                resolve();
            } catch (e) {
                console.error("Matchmaking failed", e);
                reject(e);
            }
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
            setupConnection(conn);
        });
    });
};

const startHeartbeat = (peerId: string) => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    // Send heartbeat immediately
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId, action: 'heartbeat' })
    }).catch(() => {});

    // Then every 10 seconds
    heartbeatInterval = setInterval(() => {
        if (peer && !peer.destroyed) {
            fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peerId, action: 'heartbeat' })
            }).catch(() => {});
        }
    }, 10000);
};

const findMatch = async (myPeerId: string) => {
    // Poll the matchmaking endpoint
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId: myPeerId, action: 'join' })
    });

    if (!response.ok) {
        throw new Error("Matchmaking server unavailable");
    }

    const data = await response.json();

    if (data.status === 'matched') {
        console.log("Match found! Connecting to:", data.matchPeerId);
        // We are the initiator, so WE connect to THEM
        if (peer) {
            const conn = peer.connect(data.matchPeerId, {
                reliable: true
            });
            setupConnection(conn);
        }
    } else {
        console.log("Waiting for someone to connect to me...");
        // We do nothing, just wait for peer.on('connection')
    }
};

const setupConnection = (conn: any) => {
    connection = conn;

    connection.on('open', () => {
        console.log("Connection Established!");
        if (onConnectCallback) onConnectCallback();
    });

    connection.on('data', (data: P2PEvent) => {
        // console.log("Received event:", data); // verbose
        
        if (data.type === 'chat' && onMessageCallback) {
            onMessageCallback(data.payload);
        } else if (data.type === 'typing' && onTypingCallback) {
            onTypingCallback(data.payload);
        } else if (data.type === 'signal') {
            // Handle internal signals (like timeout)
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