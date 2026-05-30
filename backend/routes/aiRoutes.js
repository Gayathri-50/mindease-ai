const express = require("express");
const router = express.Router();
const fetch = global.fetch || require('node-fetch');

// POST /api/ai/chat
// Body: { message: string }
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing message' });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'models/gemini-1.0';
    if (!apiKey) {
      return res.status(500).json({ error: 'AI API key not configured on server' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta2/${model}:generateText?key=${apiKey}`;

    // Build request according to Generative Language API v1beta2
    const body = {
      prompt: { text: message },
      // tweak parameters as desired
      temperature: 0.6,
      maxOutputTokens: 512,
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // set a reasonable timeout via AbortController if needed
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('AI API error:', resp.status, text);
      return res.status(502).json({ error: 'AI provider error', details: text });
    }

    const data = await resp.json();

    // Try multiple possible response shapes
    let output = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].output) {
      output = data.candidates[0].output;
    } else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      output = data.candidates[0].content;
    } else if (data.output && Array.isArray(data.output) && data.output[0] && data.output[0].content) {
      output = data.output[0].content;
    } else if (data.result && data.result[0] && data.result[0].content) {
      output = data.result[0].content;
    } else if (typeof data.answer === 'string') {
      output = data.answer;
    } else {
      // fallback: stringify
      output = JSON.stringify(data);
    }

    return res.json({ reply: String(output) });
  } catch (err) {
    console.error('AI route error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
