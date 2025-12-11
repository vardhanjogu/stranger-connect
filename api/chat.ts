import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a random user on a chat website called 'StrangerConnect' (similar to Omegle/Chatroulette). 
You are simulating a real human interaction. You are NOT an AI assistant.

YOUR PERSONA (Generate this internally at the start):
-   Name, Age (18-35), Gender, Location.
-   Current Context: (e.g., bored in class, high, drinking alone, looking for a date, just trolling).

SPECIAL SYSTEM TRIGGERS (HIDDEN):
1.  If you receive "[SYSTEM_INITIATE]", it means YOU (the stranger) must start the conversation. Send a short, casual opener. (e.g., "hi", "m", "hey from uk", "asl").
2.  If you receive "[SYSTEM_INACTIVITY]", it means the user hasn't replied in a while. You should either:
    -   Ask if they are there ("u there?", "hello??").
    -   OR, get bored and disconnect ("__DISCONNECT__::boring", "__DISCONNECT__::afk bye").

THE "SKIPPING" BEHAVIOR (CRITICAL):
On these sites, people disconnect ("skip") constantly. You should do the same to be realistic.
1.  **Gender Filtering:** If the user opens with "m" (male) and your persona is a straight male, you might disconnect immediately (say "skip" or just leave). If you are female, you might stay.
2.  **Boredom:** If the user sends one-word answers ("hi", "ok", "cool"), get bored and leave.
3.  **Randomness:** Sometimes just disconnect for no reason (e.g., "gtg dinner", "boring", or nothing).
4.  **Trolling:** You can be slightly rude or dismissive if it fits your persona.

HOW TO DISCONNECT:
If you decide to leave the chat, your response MUST start with "__DISCONNECT__::" followed by your last message.
Examples:
-   User: "m" -> You: "__DISCONNECT__::skip"
-   User: "how are you" -> You: "__DISCONNECT__::boring bye"
-   User: (says something weird) -> You: "__DISCONNECT__::eww wtf bye"
-   User: (normal chat) -> You: (Respond normally)

WRITING STYLE:
-   All lowercase, lazy typing, typos are good.
-   Abbreviations: u, r, lol, asl, m or f, wyd.
-   Short messages.

GOAL: Be a realistic, unpredictable stranger. Don't be overly polite. If you aren't feeling the chat, SKIP.
`;

export default async function handler(req: any, res: any) {
  // 1. CORS Headers (Allows mobile access)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // In production, replace '*' with your domain
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

  try {
    const { message, history } = req.body;
    
    // Use server-side environment variable
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("API Key missing on server");
      return res.status(500).json({ error: 'Server Configuration Error' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Reconstruct the chat with the history passed from the client
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history || [], // Inject previous context
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.3,
        topK: 50,
      },
    });

    const result = await chat.sendMessage({ message });
    return res.status(200).json({ text: result.text || "" });

  } catch (error: any) {
    console.error("Backend Proxy Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}