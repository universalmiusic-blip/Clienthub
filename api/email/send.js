export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, to, name } = req.body;
  if (!to || !name) return res.status(400).json({ error: 'Faltan datos' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return res.status(500).json({ error: 'Email no configurado' });

  let subject, html;

  if (type === 'welcome') {
    subject = '¡Bienvenido a Sympra! 🚀';
    html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#080810;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:32px;font-weight:800;color:#fff;margin:0;">Sym<em style="color:#a855f7;font-style:normal;">pra</em></h1>
    </div>
    <div style="background:#0e0e1a;border:1px solid #1e1e30;border-radius:20px;padding:40px;">
      <h2 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 16px;">¡Hola, ${name}! 👋</h2>
      <p style="color:#a0a0c0;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Tu cuenta en Sympra está lista. Ahora puedes gestionar tus clientes, proyectos y facturas desde un solo lugar.
      </p>
      <div style="background:#13131f;border:1px solid #1e1e30;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="color:#60607a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Lo que puedes hacer ahora:</p>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="font-size:16px;">👥</span>
          <span style="color:#f0f0fa;font-size:14px;">Agregar tus primeros clientes</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="font-size:16px;">🚀</span>
          <span style="color:#f0f0fa;font-size:14px;">Crear un proyecto y asignarlo</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:16px;">🧾</span>
          <span style="color:#f0f0fa;font-size:14px;">Generar tu primera factura</span>
        </div>
      </div>
      <a href="https://sympra.app/app" style="display:block;background:#7c3aed;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:100px;font-size:16px;font-weight:700;">
        Entrar a Sympra →
      </a>
    </div>
    <p style="text-align:center;color:#60607a;font-size:12px;margin-top:24px;">
      © 2026 Sympra · Anthony Daniel Paulino Castillo<br/>
      <a href="https://sympra.app" style="color:#a855f7;">sympra.app</a>
    </p>
  </div>
</body>
</html>`;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Sympra <onboarding@resend.dev>',
        to: [to],
        subject,
        html
      })
    });

    const data = await response.json();
    if (response.ok) {
      res.status(200).json({ success: true, id: data.id });
    } else {
      res.status(400).json({ error: data.message || 'Error enviando email' });
    }
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
