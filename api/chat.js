// api/chat.js
export default async function handler(req, res) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const { message } = req.body;

  if (!API_KEY) {
    return res.status(500).json({ error: "API Key is missing in Vercel. Add GEMINI_API_KEY to Environment Variables." });
  }

  try {
    // Using gemini-1.5-flash-latest to bypass the "not found" error
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Network error: Server couldn't reach Google AI." });
  }
}
