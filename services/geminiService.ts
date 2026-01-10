import Peer from 'peerjs';

type EventType = 'chat' | 'typing' | 'signal';
interface P2PEvent { type: EventType; payload: any; }

let peer: Peer | null = null;
let connection: any = null;
let heartbeatInterval: any = null;
let isSessionActive = false;

let onMessageCallback: ((text: string) => void) | null = null;
let onTypingCallback: ((isTyping: boolean) => void) | null = null;
let onDisconnectCallback: (() => void) | null = null;
let onConnectCallback: (() => void) | null = null;

const STUN_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun.ekiga.net' },
    { urls: 'stun:stun.ideasip.com' },
    { urls: 'stun:stun.rixtelecom.se' },
    { urls: 'stun:stun.schlund.de' },
];

export const initializePeerSession = async (
    onConnect: () => void,
    onMessage: (text: string) => void,
    onTyping: (isTyping: boolean) => void,
    onDisconnect: () => void
): Promise<void> => {
    terminateSession();
    isSessionActive = true;
    onConnectCallback = onConnect;
    onMessageCallback = onMessage;
    onTypingCallback = onTyping;
    onDisconnectCallback = onDisconnect;

    return new Promise((resolve, reject) => {
        peer = new Peer({
            debug: 0,
            config: { iceServers: STUN_SERVERS }
        });

        const timer = setTimeout(() => {
            terminateSession();
            reject(new Error("Connection timed out. Check network."));
        }, 20000);

        peer.on('open', (id) => {
            clearTimeout(timer);
            startHeartbeat(id);
            pollForMatch(id);
            resolve();
        });

        peer.on('error', (err) => {
            console.error("PeerJS Error:", err.type);
            if (['network', 'server-error', 'peer-unavailable'].includes(err.type)) {
                terminateSession();
                onDisconnectCallback?.();
            }
        });

        peer.on('connection', (conn) => {
            if (connection?.open) { conn.close(); return; }
            setupConnection(conn);
        });
    });
};

const startHeartbeat = (peerId: string) => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    const send = () => {
        if (!isSessionActive) return;
        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ peerId, action: 'heartbeat' })
        }).catch(() => {});
    };
    send();
    heartbeatInterval = setInterval(send, 5000);
};

const pollForMatch = async (myPeerId: string) => {
    while (isSessionActive && !connection) {
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peerId: myPeerId, action: 'join' })
            });
            const data = await res.json();
            if (data.status === 'matched' && data.matchPeerId && peer) {
                const conn = peer.connect(data.matchPeerId, { reliable: true });
                setupConnection(conn);
                break;
            }
        } catch (e) {}
        await new Promise(r => setTimeout(r, 2000));
    }
};

const setupConnection = (conn: any) => {
    connection = conn;
    connection.on('open', () => onConnectCallback?.());
    connection.on('data', (data: P2PEvent) => {
        if (data.type === 'chat') onMessageCallback?.(data.payload);
        else if (data.type === 'typing') onTypingCallback?.(data.payload);
        else if (data.type === 'signal' && data.payload === 'TIMEOUT') onMessageCallback?.("__TIMEOUT_SIGNAL__");
    });
    connection.on('close', () => { terminateSession(); onDisconnectCallback?.(); });
    connection.on('error', () => { terminateSession(); onDisconnectCallback?.(); });
};

export const sendMessageToStranger = async (message: string) => {
    if (connection?.open) connection.send({ type: 'chat', payload: message });
};

export const sendTypingStatus = async (isTyping: boolean) => {
    if (connection?.open) connection.send({ type: 'typing', payload: isTyping });
};

export const sendSignal = async (signal: string) => {
    if (connection?.open) connection.send({ type: 'signal', payload: signal });
};

export const terminateSession = () => {
    isSessionActive = false;
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    if (connection) { connection.close(); connection = null; }
    if (peer) {
        const id = peer.id;
        if (id) fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ peerId: id, action: 'leave' }) }).catch(() => {});
        peer.destroy();
        peer = null;
    }
    onMessageCallback = null; onTypingCallback = null; onDisconnectCallback = null; onConnectCallback = null;
};
