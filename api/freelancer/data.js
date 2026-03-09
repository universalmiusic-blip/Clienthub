import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { freelancerId } = req.query;
  if (!freelancerId) return res.status(400).json({ error: 'freelancerId requerido' });

  try {
    const [clients, projects, tasks, invoices, messages, notifications] = await Promise.all([
      pool.query('SELECT * FROM clients WHERE freelancer_id = $1 ORDER BY created_at DESC', [freelancerId]),
      pool.query('SELECT * FROM projects WHERE freelancer_id = $1 ORDER BY created_at DESC', [freelancerId]),
      pool.query('SELECT t.* FROM tasks t JOIN projects p ON t.project_id = p.id WHERE p.freelancer_id = $1 ORDER BY t.due_date ASC', [freelancerId]),
      pool.query('SELECT * FROM invoices WHERE freelancer_id = $1 ORDER BY created_at DESC', [freelancerId]),
      pool.query('SELECT m.* FROM messages m JOIN clients c ON m.client_id = c.id WHERE c.freelancer_id = $1 ORDER BY m.created_at ASC', [freelancerId]),
      pool.query('SELECT * FROM notifications WHERE freelancer_id = $1 ORDER BY created_at DESC LIMIT 20', [freelancerId]),
    ]);

    res.status(200).json({
      clients: clients.rows,
      projects: projects.rows,
      tasks: tasks.rows,
      invoices: invoices.rows,
      messages: messages.rows,
      notifications: notifications.rows,
    });
  } catch (err) {
    console.error('Data error:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
