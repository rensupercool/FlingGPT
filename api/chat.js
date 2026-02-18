// api/chat.js
module.exports = async (req, res) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  const { message } = req.body;

  if (!API_KEY) {
    return res.status(500).json({ error: "API Key is missing in Vercel settings." });
  }

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

    // Check if the response structure is what we expect
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      res.status(200).json(data);
    } else {
      res.status(500).json({ error: "Unexpected AI response structure", raw: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
