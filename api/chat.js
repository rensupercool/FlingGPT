// api/chat.js (Temporary Scanner)
export default async function handler(req, res) {
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    // This sends the list of models back to your website screen
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Scanner failed." });
  }
}
