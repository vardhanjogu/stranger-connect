// Production-Ready Matchmaking Logic
// NOTE: For massive scaling, replace Map with Redis.

let waitingUser: string | null = null;
let waitingUserTimestamp: number = 0;
const activeUsers = new Map<string, number>();

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const cleanActiveUsers = () => {
    const now = Date.now();
    for (const [id, lastSeen] of activeUsers.entries()) {
        if (now - lastSeen > 20000) activeUsers.delete(id); // 20s timeout
    }
    if (waitingUser && (Date.now() - waitingUserTimestamp > 20000)) waitingUser = null;
  };

  try {
    const { peerId, action } = req.body;
    cleanActiveUsers();

    if (action === 'stats') {
        return res.status(200).json({ onlineCount: Math.max(1, activeUsers.size) });
    }

    if (!peerId) return res.status(400).json({ error: 'Missing peerId' });

    if (action === 'heartbeat') {
        activeUsers.set(peerId, Date.now());
        if (waitingUser === peerId) waitingUserTimestamp = Date.now();
        return res.status(200).json({ onlineCount: activeUsers.size });
    }

    if (action === 'join') {
        activeUsers.set(peerId, Date.now());

        // Basic locking logic
        if (waitingUser && waitingUser !== peerId) {
            const matchId = waitingUser;
            waitingUser = null;
            waitingUserTimestamp = 0;
            return res.status(200).json({ status: 'matched', matchPeerId: matchId, role: 'initiator' });
        } else {
            waitingUser = peerId;
            waitingUserTimestamp = Date.now();
            return res.status(200).json({ status: 'waiting', role: 'receiver' });
        }
    }
    
    if (action === 'leave') {
        activeUsers.delete(peerId);
        if (waitingUser === peerId) waitingUser = null;
        return res.status(200).json({ status: 'ok' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}