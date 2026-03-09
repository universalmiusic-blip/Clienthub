import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.VITE_DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { freelancerId } = req.query;

  if (req.method === 'GET') {
    const result = await pool.query('SELECT * FROM invoices WHERE freelancer_id = $1 ORDER BY created_at DESC', [freelancerId]);
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    const { freelancer_id, client_id, project_id, amount, due_date } = req.body;
    const countResult = await pool.query('SELECT COUNT(*) FROM invoices WHERE freelancer_id = $1', [freelancer_id]);
    const num = `INV-${String(parseInt(countResult.rows[0].count)+1).padStart(3,'0')}`;
    const result = await pool.query(
      'INSERT INTO invoices (freelancer_id, client_id, project_id, number, amount, status, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [freelancer_id, client_id, project_id||null, num, amount||0, 'pending', due_date||'2026-03-30']
    );
    return res.status(201).json(result.rows[0]);
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body;
    const result = await pool.query('UPDATE invoices SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
    return res.status(200).json(result.rows[0]);
  }
}
