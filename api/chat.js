export default async function handler(req, res) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  // We use "message" here to match the index.html
  const { message } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
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

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to Google AI" });
  }
}
