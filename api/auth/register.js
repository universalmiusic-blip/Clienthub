import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });

  try {
    const existing = await pool.query('SELECT id FROM freelancers WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Este correo ya está registrado' });

    const result = await pool.query(
      'INSERT INTO freelancers (name, email, password, title, monthly_goal, plan) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, title, monthly_goal, plan',
      [name, email.toLowerCase(), password, 'Freelancer', 5000, 'starter']
    );

    res.status(201).json({ role: 'freelancer', user: result.rows[0] });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
