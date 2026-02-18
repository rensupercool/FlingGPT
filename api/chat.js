// api/chat.js
const https = require('https');

module.exports = async (req, res) => {
  // 1. Get the API Key from Vercel's hidden environment variables
  const API_KEY = process.env.GEMINI_API_KEY;
  
  // 2. Get the message from your index.html
  const { message } = req.body;

  // 3. Check if the API key is actually there
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API Key in Vercel Environment Variables." });
  }

  // 4. Prepare the data to send to Google AI
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

  // 5. Make the request to Google
  const request = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => { data += chunk; });
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.error) {
          // If Google sends back an error (like an invalid key)
          res.status(500).json({ error: json.error.message });
        } else {
          // If everything is good, send the AI's answer back to the website
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
