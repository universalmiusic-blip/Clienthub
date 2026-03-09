import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.VITE_DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { freelancerId } = req.query;

  if (req.method === 'GET') {
    const result = await pool.query('SELECT * FROM projects WHERE freelancer_id = $1 ORDER BY created_at DESC', [freelancerId]);
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    const { name, client_id, freelancer_id, budget, due_date } = req.body;
    const colors = ['#7c3aed','#0ea5e9','#ec4899','#10b981','#f59e0b'];
    const color = colors[Math.floor(Math.random()*colors.length)];
    const result = await pool.query(
      'INSERT INTO projects (freelancer_id, client_id, name, status, progress, budget, paid, due_date, color) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [freelancer_id, client_id, name, 'planning', 0, budget||0, 0, due_date||'2026-06-30', color]
    );
    return res.status(201).json(result.rows[0]);
  }
}
