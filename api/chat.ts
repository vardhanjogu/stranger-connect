// MATCHMAKING SERVER
// This replaces the AI logic. It pairs two real users together.
// NOTE: In a serverless production environment (like Vercel), this in-memory variable
// will reset. For local testing, it works. For production, use Redis/Database.

let waitingUser: string | null = null;
let waitingUserTimestamp: number = 0;
const activeUsers = new Map<string, number>();

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const cleanActiveUsers = () => {
    const now = Date.now();
    for (const [id, lastSeen] of activeUsers.entries()) {
        // Increased to 30s to accommodate mobile network latency
        if (now - lastSeen > 30000) { 
            activeUsers.delete(id);
        }
    }
  };

  try {
    const { peerId, action } = req.body;
    
    // Maintenance
    cleanActiveUsers();

    if (action === 'stats') {
        return res.status(200).json({ onlineCount: Math.max(1, activeUsers.size) });
    }

    if (action === 'heartbeat' && peerId) {
        activeUsers.set(peerId, Date.now());
        
        // CRITICAL FIX: If the user sending the heartbeat is the one currently waiting,
        // refresh the waiting timestamp so they don't get timed out from the queue.
        if (waitingUser === peerId) {
            waitingUserTimestamp = Date.now();
        }

        return res.status(200).json({ onlineCount: activeUsers.size });
    }

    if (action === 'join') {
        if (peerId) activeUsers.set(peerId, Date.now());

        // Clean up stale waiting user (older than 30 seconds - matching the heartbeat/active timeout)
        if (waitingUser && (Date.now() - waitingUserTimestamp > 30000)) {
            waitingUser = null;
        }

        if (waitingUser && waitingUser !== peerId) {
            // MATCH FOUND!
            const matchId = waitingUser;
            
            // Clear the waiting room
            waitingUser = null; 
            waitingUserTimestamp = 0;

            return res.status(200).json({ 
                status: 'matched', 
                matchPeerId: matchId,
                role: 'initiator' // This user will call .connect()
            });
        } else {
            // NO MATCH, ADD TO WAITING ROOM
            waitingUser = peerId;
            waitingUserTimestamp = Date.now();
            
            return res.status(200).json({ 
                status: 'waiting',
                role: 'receiver' // This user will wait for connection
            });
        }
    }
    
    // Explicit leave
    if (action === 'leave') {
        if (peerId) activeUsers.delete(peerId);
        if (waitingUser === peerId) {
            waitingUser = null;
        }
        return res.status(200).json({ status: 'ok' });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error: any) {
    console.error("Matchmaking Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}