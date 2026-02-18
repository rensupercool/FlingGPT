// api/chat.js
export default async function handler(req, res) {
  const API_KEY = process.env.GROQ_API_KEY;
  const { message } = req.body;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing GROQ_API_KEY in Vercel settings." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // High-end model, very smart
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to connect to Groq AI." });
  }
}
