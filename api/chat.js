// api/chat.js
const https = require('https');

module.exports = async (req, res) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  const { message } = req.body;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API Key in Vercel Environment Variables." });
  }

  const payload = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: message }] }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
    },
  };

  const request = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => { data += chunk; });
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.error) {
          res.status(500).json({ error: json.error.message });
        } else {
          res.status(200).json(json);
        }
      } catch (e) {
        res.status(500).json({ error: "Failed to parse AI response." });
      }
    });
  });

  request.on('error', (e) => {
    res.status(500).json({ error: "Network error calling Google AI." });
  });

  request.write(payload);
  request.end();
};
