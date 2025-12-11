// CLIENT-SIDE SERVICE
// This file now strictly communicates with the Backend API.
// It does NOT access the AI directly, ensuring safety and compatibility.

interface ChatPart {
  text: string;
}

interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: ChatPart[];
}

let chatHistory: ChatHistoryItem[] = [];

// Fallback excuses if the server is unreachable
const FALLBACK_EXCUSES = [
  "__DISCONNECT__::connection error sry",
  "__DISCONNECT__::my wifi is dead",
  "__DISCONNECT__::lagging out bye",
  "__DISCONNECT__::server busy",
];

export const startNewChatSession = (): void => {
  // Reset local history for a new stranger
  chatHistory = [];
};

export const sendMessageToStranger = async (
  message: string
): Promise<string> => {
  
  // 1. Add User message to local history
  chatHistory.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    // 2. Send the Message + History to your Backend
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message, 
            history: chatHistory
        })
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.text || "";

    // 3. Add AI response to local history
    chatHistory.push({
      role: 'model',
      parts: [{ text: textResponse }]
    });

    return textResponse;

  } catch (error) {
    console.error("Chat Error:", error);
    
    // Return a realistic disconnect message so the UI doesn't break
    return FALLBACK_EXCUSES[Math.floor(Math.random() * FALLBACK_EXCUSES.length)];
  }
};

export const terminateSession = () => {
  chatHistory = [];
};