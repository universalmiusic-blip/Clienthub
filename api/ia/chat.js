export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, system } = req.body;

  try {
    const openaiMessages = [
      { role: 'system', content: system },
      ...messages
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: openaiMessages
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Lo siento, hubo un error.';
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor IA' });
  }
}
