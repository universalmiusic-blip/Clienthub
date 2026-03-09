import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.VITE_DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { freelancerId } = req.query;

  if (req.method === 'GET') {
    const result = await pool.query('SELECT * FROM clients WHERE freelancer_id = $1 ORDER BY created_at DESC', [freelancerId]);
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    const { name, company, email, phone, freelancer_id } = req.body;
    const avatar = (name||'NC').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    const colors = ['#7c3aed','#0ea5e9','#ec4899','#10b981','#f59e0b','#ef4444'];
    const color = colors[Math.floor(Math.random()*colors.length)];
    const result = await pool.query(
      'INSERT INTO clients (freelancer_id, name, company, email, phone, avatar_color, password) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [freelancer_id, name, company||'', email||'', phone||'', color, '1234']
    );
    return res.status(201).json(result.rows[0]);
  }
}
