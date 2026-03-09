import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.VITE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const ADMIN_EMAIL = 'universalmiusic@gmail.com';
const ADMIN_PASSWORD = 'Sympra2026!';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Login admin
  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, role: 'admin' });
    }
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  // Get all data
  if (req.method === 'GET') {
    const token = req.headers['x-admin-token'];
    if (token !== 'sympra-admin-2026') {
      return res.status(401).json({ error: 'No autorizado' });
    }

    try {
      const freelancers = await pool.query(`
        SELECT 
          f.id, f.name, f.email, f.plan, f.created_at,
          COUNT(DISTINCT c.id) as client_count,
          COUNT(DISTINCT p.id) as project_count,
          COALESCE(SUM(i.amount), 0) as total_invoiced
        FROM freelancers f
        LEFT JOIN clients c ON c.freelancer_id = f.id
        LEFT JOIN projects p ON p.freelancer_id = f.id
        LEFT JOIN invoices i ON i.freelancer_id = f.id
        GROUP BY f.id
        ORDER BY f.created_at DESC
      `);

      const stats = await pool.query(`
        SELECT 
          COUNT(DISTINCT f.id) as total_freelancers,
          COUNT(DISTINCT c.id) as total_clients,
          COUNT(DISTINCT p.id) as total_projects,
          COALESCE(SUM(i.amount), 0) as total_invoiced
        FROM freelancers f
        LEFT JOIN clients c ON c.freelancer_id = f.id
        LEFT JOIN projects p ON p.freelancer_id = f.id
        LEFT JOIN invoices i ON i.freelancer_id = f.id
      `);

      res.status(200).json({
        freelancers: freelancers.rows,
        stats: stats.rows[0]
      });
    } catch (err) {
      console.error('Admin error:', err);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
}
