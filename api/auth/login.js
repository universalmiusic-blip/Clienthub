import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.VITE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    // Check freelancer
    const frResult = await pool.query(
      'SELECT id, name, title, email, monthly_goal, plan FROM freelancers WHERE email = $1 AND password = $2',
      [email.toLowerCase(), password]
    );
    
    if (frResult.rows.length > 0) {
      return res.status(200).json({ role: 'freelancer', user: frResult.rows[0] });
    }

    // Check client
    const clResult = await pool.query(
      'SELECT c.id, c.name, c.company, c.email, c.avatar_color as color, c.freelancer_id FROM clients c WHERE c.email = $1 AND c.password = $2',
      [email.toLowerCase(), password]
    );
    
    if (clResult.rows.length > 0) {
      return res.status(200).json({ role: 'client', user: clResult.rows[0] });
    }

    return res.status(401).json({ error: 'Credenciales incorrectas' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
