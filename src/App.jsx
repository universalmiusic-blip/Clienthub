import { useState, useEffect, useRef, useCallback } from "react";

// ════════════════════════════════════════════════════════════
//  NOTIFICATION TYPES & INITIAL DATA
// ════════════════════════════════════════════════════════════
const NOTIF_TYPES = {
  MSG_NEW:        { icon: "💬", label: "Mensaje nuevo",         color: "#6d28d9" },
  INVOICE_PAID:   { icon: "💰", label: "Factura pagada",        color: "#15803d" },
  INVOICE_OVERDUE:{ icon: "⚠️", label: "Factura vencida",       color: "#b91c1c" },
  DEL_APPROVED:   { icon: "✅", label: "Entregable aprobado",   color: "#15803d" },
  DEL_REVIEW:     { icon: "👁",  label: "Entregable en revisión",color: "#92400e" },
  TASK_DUE:       { icon: "🔔", label: "Tarea por vencer",      color: "#1d4ed8" },
  PROJECT_NEW:    { icon: "🚀", label: "Proyecto creado",       color: "#0ea5e9" },
  CLIENT_MSG:     { icon: "💬", label: "Mensaje de cliente",    color: "#be185d" },
};

const DB = {
  freelancer: { name: "Carlos Rivera", title: "Diseñador & Desarrollador", avatar: "CR", email: "carlos@sympra.app", password: "admin", monthlyGoal: 8000 },
  clients: [
    { id: 1, name: "Ana Martínez",  company: "Estudio Forma",   avatar: "AM", email: "ana@empresa.com",  password: "1234", color: "#7c3aed", status: "active",   totalBilled: 14500 },
    { id: 2, name: "John Peterson", company: "TechStart Inc.",  avatar: "JP", email: "john@company.com", password: "5678", color: "#0ea5e9", status: "active",   totalBilled: 12000 },
    { id: 3, name: "Lucía Herrera", company: "Bloom Studio",    avatar: "LH", email: "lucia@bloom.co",   password: "9999", color: "#ec4899", status: "active",   totalBilled: 3200  },
    { id: 4, name: "Marco Rossi",   company: "Architettura MR", avatar: "MR", email: "marco@arch.it",    password: "0000", color: "#10b981", status: "inactive", totalBilled: 6800  },
  ],
  projects: [
    { id: 1, clientId: 1, name: "Rediseño Web Corporativo", status: "active",    progress: 65, phase: "Diseño UI",  budget: 4500,  paid: 2250, dueDate: "2026-04-15", color: "#7c3aed", priority: "high"   },
    { id: 2, clientId: 1, name: "App Mobile — Prototipo",   status: "planning",  progress: 15, phase: "Briefing",   budget: 7200,  paid: 1440, dueDate: "2026-06-01", color: "#0ea5e9", priority: "medium" },
    { id: 3, clientId: 1, name: "Identidad Visual 2024",    status: "completed", progress: 100,phase: "Completado", budget: 2800,  paid: 2800, dueDate: "2026-01-30", color: "#10b981", priority: "low"    },
    { id: 4, clientId: 2, name: "SaaS Platform MVP",        status: "active",    progress: 42, phase: "Desarrollo", budget: 12000, paid: 4800, dueDate: "2026-05-01", color: "#0ea5e9", priority: "high"   },
    { id: 5, clientId: 3, name: "Branding Bloom Studio",    status: "active",    progress: 30, phase: "Conceptos",  budget: 3200,  paid: 800,  dueDate: "2026-04-30", color: "#ec4899", priority: "medium" },
  ],
  deliverables: [
    { id: 1, projectId: 1, name: "Wireframes",           status: "approved", date: "2026-02-10" },
    { id: 2, projectId: 1, name: "Diseño Homepage",      status: "review",   date: "2026-03-01" },
    { id: 3, projectId: 1, name: "Páginas interiores",   status: "pending",  date: "2026-03-25" },
    { id: 4, projectId: 2, name: "Brief del proyecto",   status: "approved", date: "2026-03-01" },
    { id: 5, projectId: 2, name: "Arquitectura info",    status: "pending",  date: "2026-03-25" },
    { id: 6, projectId: 3, name: "Logo principal",       status: "approved", date: "2026-01-10" },
    { id: 7, projectId: 3, name: "Manual de marca",      status: "approved", date: "2026-01-28" },
    { id: 8, projectId: 4, name: "Arquitectura técnica", status: "approved", date: "2026-02-15" },
    { id: 9, projectId: 4, name: "Auth & Onboarding",    status: "review",   date: "2026-03-08" },
    { id:10, projectId: 5, name: "Moodboard",            status: "approved", date: "2026-02-20" },
    { id:11, projectId: 5, name: "Propuestas de logo",   status: "review",   date: "2026-03-06" },
  ],
  tasks: [
    { id: 1, projectId: 1, text: "Revisar feedback homepage",     done: false, priority: "high",   due: "2026-03-10" },
    { id: 2, projectId: 1, text: "Entregar páginas interiores",   done: false, priority: "high",   due: "2026-03-20" },
    { id: 3, projectId: 4, text: "Code review módulo Auth",       done: false, priority: "high",   due: "2026-03-09" },
    { id: 4, projectId: 2, text: "Enviar arquitectura de info",   done: false, priority: "medium", due: "2026-03-25" },
    { id: 5, projectId: 5, text: "Presentar 3 conceptos de logo", done: true,  priority: "medium", due: "2026-03-05" },
    { id: 6, projectId: 4, text: "Configurar entorno staging",    done: true,  priority: "low",    due: "2026-03-01" },
  ],
  messages: [
    { id: 1, clientId: 1, from: "client",     text: "¡Hola Carlos! ¿Cuándo tendremos lista la homepage?",      date: "2026-03-06T10:20:00" },
    { id: 2, clientId: 1, from: "freelancer", text: "Hola Ana, ya casi está. Te la mando mañana para revisión.", date: "2026-03-06T11:05:00" },
    { id: 3, clientId: 1, from: "client",     text: "Perfecto, muchas gracias 🙌",                              date: "2026-03-06T11:10:00" },
    { id: 4, clientId: 2, from: "client",     text: "El módulo de auth se ve increíble, buen trabajo.",         date: "2026-03-07T09:00:00" },
    { id: 5, clientId: 2, from: "freelancer", text: "Gracias John! Esta semana subo el staging.",               date: "2026-03-07T09:30:00" },
  ],
  invoices: [
    { id: 1, clientId: 1, projectId: 3, number: "INV-001", amount: 2800, status: "paid",    date: "2026-01-28", due: "2026-02-11" },
    { id: 2, clientId: 2, projectId: 4, number: "INV-002", amount: 4800, status: "paid",    date: "2026-02-01", due: "2026-02-15" },
    { id: 3, clientId: 1, projectId: 1, number: "INV-003", amount: 2250, status: "paid",    date: "2026-02-10", due: "2026-02-24" },
    { id: 4, clientId: 3, projectId: 5, number: "INV-004", amount: 800,  status: "overdue", date: "2026-02-20", due: "2026-03-06" },
    { id: 5, clientId: 1, projectId: 2, number: "INV-005", amount: 1440, status: "pending", date: "2026-03-01", due: "2026-03-15" },
    { id: 6, clientId: 2, projectId: 4, number: "INV-006", amount: 3600, status: "pending", date: "2026-03-05", due: "2026-03-19" },
  ],
  revenue: [
    { month: "Oct", amount: 3200 }, { month: "Nov", amount: 5400 },
    { month: "Dic", amount: 4100 }, { month: "Ene", amount: 7800 },
    { month: "Feb", amount: 9850 }, { month: "Mar", amount: 4490 },
  ],
  // ── INITIAL NOTIFICATIONS ──────────────────────────────────
  notifications: [
    { id: 1,  type: "CLIENT_MSG",     read: false, ts: "2026-03-08T09:15:00", title: "Mensaje de Ana Martínez",        body: "¿Cuándo tendremos lista la homepage?",            link: "messages",  clientId: 1 },
    { id: 2,  type: "DEL_REVIEW",     read: false, ts: "2026-03-08T08:40:00", title: "Entregable en revisión",         body: "Auth & Onboarding — SaaS Platform MVP",           link: "projects",  projectId: 4 },
    { id: 3,  type: "INVOICE_OVERDUE",read: false, ts: "2026-03-07T07:00:00", title: "Factura vencida — INV-004",      body: "Lucía Herrera · $800 · vencida el 6 Mar",         link: "invoices" },
    { id: 4,  type: "TASK_DUE",       read: false, ts: "2026-03-07T06:00:00", title: "Tarea por vencer mañana",        body: "Code review módulo Auth · SaaS MVP",              link: "tasks" },
    { id: 5,  type: "CLIENT_MSG",     read: true,  ts: "2026-03-07T09:00:00", title: "Mensaje de John Peterson",       body: "El módulo de auth se ve increíble, buen trabajo.", link: "messages",  clientId: 2 },
    { id: 6,  type: "DEL_APPROVED",   read: true,  ts: "2026-03-06T14:00:00", title: "Entregable aprobado",            body: "Wireframes aprobados — Rediseño Web",             link: "projects",  projectId: 1 },
    { id: 7,  type: "INVOICE_PAID",   read: true,  ts: "2026-03-05T11:30:00", title: "Pago recibido — INV-003",        body: "Ana Martínez · $2,250 cobrado ✓",                 link: "invoices" },
  ],
  media: [
    { id: 1, clientId: 1, projectId: 1, name: "Demo Reel 2026",         type: "video", ext: "mp4", size: "245 MB", url: "https://www.w3schools.com/html/mov_bbb.mp4",  thumb: "🎬", date: "2026-03-01", note: "Versión final para aprobación" },
    { id: 2, clientId: 1, projectId: 1, name: "Soundtrack Principal",   type: "audio", ext: "mp3", size: "8.2 MB", url: "https://www.w3schools.com/html/horse.mp3",    thumb: "🎵", date: "2026-03-03", note: "Mezcla final corregida" },
    { id: 3, clientId: 2, projectId: 4, name: "Presentación de Marca",  type: "video", ext: "mp4", size: "120 MB", url: "https://www.w3schools.com/html/mov_bbb.mp4",  thumb: "🎬", date: "2026-02-28", note: "Cut para redes sociales" },
    { id: 4, clientId: 1, projectId: 3, name: "Manual de Marca PDF",    type: "pdf",   ext: "pdf", size: "4.1 MB", url: "https://www.africau.edu/images/general/sample.pdf", thumb: "📄", date: "2026-01-28", note: "Versión imprimible" },
    { id: 5, clientId: 3, projectId: 5, name: "Fotos del Producto",     type: "image", ext: "jpg", size: "18 MB",  url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", thumb: "🖼", date: "2026-03-05", note: "Pack completo retocado" },
  ],
};

// ════════════════════════════════════════════════════════════
//  UTILS
// ════════════════════════════════════════════════════════════
const fmt    = (n) => `$${Number(n).toLocaleString("en-US")}`;
const fmtD   = (s) => new Date(s).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
const fmtT   = (s) => new Date(s).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
const fmtAgo = (s) => {
  const diff = Date.now() - new Date(s).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
};
const isOverdue = (d) => new Date(d) < new Date();
const uid = () => Date.now() + Math.random();

// ════════════════════════════════════════════════════════════
//  STYLES
// ════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Geist:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#0f0e0c;--ink2:#4a4840;--ink3:#9a9690;--ink4:#ccc9c3;
  --paper:#faf9f6;--paper2:#f2f0eb;--paper3:#e8e5de;--paper4:#dedad2;
  --accent:#1d4ed8;--accent-l:#eff6ff;
  --green:#15803d;--green-l:#f0fdf4;
  --red:#b91c1c;--red-l:#fef2f2;
  --amber:#92400e;--amber-l:#fffbeb;
  --violet:#6d28d9;--violet-l:#f5f3ff;
  --pink:#be185d;--pink-l:#fdf2f8;
  --r:14px;--rs:9px;--sh:0 1px 4px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.05);--sh2:0 4px 24px rgba(0,0,0,.12);
}
body{background:var(--paper);color:var(--ink);font-family:'Geist',sans-serif;}
.H{font-family:'Bricolage Grotesque',sans-serif;}

/* ── SHELL ── */
.shell{display:grid;grid-template-columns:220px 1fr;min-height:100vh;}
@media(max-width:860px){
  .shell{grid-template-columns:1fr;}
  .side{display:none!important;}
  .topbar{padding:12px 16px;gap:8px;flex-wrap:wrap;}
  .topbar-title{font-size:18px;}
  .main{padding-bottom:80px;}
  .pg{padding:14px 16px;}
  .stats{grid-template-columns:repeat(2,1fr);gap:10px;}
  .stat-card{padding:14px 16px;border-radius:14px;}
  .stat-val{font-size:26px;}
  .card{padding:16px;border-radius:16px;}
  .card-hd{margin-bottom:12px;}
  .two-col{grid-template-columns:1fr;}
  .modal{padding:20px;border-radius:16px;margin:16px;}
  .modal-overlay{align-items:flex-end;padding:0;}
  .modal{border-radius:20px 20px 0 0;max-width:100%;}
  .btn-sm{font-size:12px;padding:7px 12px;}
  .mobile-nav{display:flex!important;}
}
@media(max-width:480px){
  .stats{grid-template-columns:1fr 1fr;}
  .stat-val{font-size:22px;}
  .topbar-title{font-size:16px;}
  .card-title{font-size:13px;}
}
.side{background:var(--ink);color:#fff;padding:24px 16px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;}
.side-logo{font-family:'Bricolage Grotesque',sans-serif;font-size:21px;font-weight:800;letter-spacing:-.5px;color:#fff;margin-bottom:4px;}
.side-logo em{color:#86efac;font-style:normal;}
.side-pill{display:inline-block;background:rgba(134,239,172,.15);border:1px solid rgba(134,239,172,.25);color:#86efac;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:3px 8px;border-radius:20px;margin-bottom:28px;}
.nav-sep{font-size:10px;font-weight:600;color:rgba(255,255,255,.25);letter-spacing:1.5px;text-transform:uppercase;padding:0 10px;margin:20px 0 6px;}
.ni{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:9px;color:rgba(255,255,255,.5);font-size:13.5px;cursor:pointer;transition:all .15s;margin-bottom:2px;border:1px solid transparent;position:relative;}
.ni:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.85);}
.ni.on{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.1);}
.ni-ic{font-size:15px;width:19px;text-align:center;}
.ni-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px;}
.side-bot{margin-top:auto;}
.side-user{display:flex;align-items:center;gap:9px;padding:11px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);margin-bottom:8px;}
.side-uname{font-size:13px;font-weight:600;color:#fff;}
.side-uemail{font-size:11px;color:rgba(255,255,255,.35);}
.logout-b{width:100%;padding:9px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.4);font-size:13px;cursor:pointer;transition:all .15s;font-family:'Geist',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;}
.logout-b:hover{background:rgba(239,68,68,.15);color:#fca5a5;border-color:rgba(239,68,68,.3);}

/* ── TOPBAR ── */
.main{background:var(--paper);overflow-y:auto;}
.topbar{background:#fff;border-bottom:1px solid var(--paper3);padding:16px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:20;box-shadow:var(--sh);}
.topbar-title{font-family:'Bricolage Grotesque',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.4px;}
.topbar-sub{font-size:12px;color:var(--ink3);margin-top:1px;}
.topbar-r{display:flex;align-items:center;gap:8px;}

/* ── NOTIF BELL ── */
.bell-wrap{position:relative;}
.bell-btn{
  width:38px;height:38px;border-radius:10px;border:1px solid var(--paper3);
  background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;
  font-size:17px;transition:all .15s;position:relative;
}
.bell-btn:hover{background:var(--paper2);}
.bell-dot{
  position:absolute;top:6px;right:6px;
  width:9px;height:9px;border-radius:50%;
  background:#ef4444;border:2px solid #fff;
  animation:pulse 2s infinite;
}
@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.3);}}
.bell-count{
  position:absolute;top:-4px;right:-4px;
  min-width:18px;height:18px;border-radius:9px;
  background:#ef4444;color:#fff;
  font-size:10px;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  padding:0 4px;border:2px solid #fff;
  font-family:'Bricolage Grotesque',sans-serif;
}

/* ── NOTIF PANEL ── */
.notif-panel{
  position:absolute;top:calc(100% + 10px);right:0;
  width:360px;
  background:#fff;border:1px solid var(--paper3);border-radius:16px;
  box-shadow:0 8px 40px rgba(0,0,0,.14),0 2px 8px rgba(0,0,0,.06);
  z-index:200;overflow:hidden;
  animation:panelIn .2s cubic-bezier(.34,1.2,.64,1);
}
@keyframes panelIn{from{opacity:0;transform:translateY(-8px) scale(.97);}to{opacity:1;transform:none;}}
.np-header{
  padding:16px 18px 12px;
  display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--paper3);
}
.np-title{font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:800;letter-spacing:-.3px;}
.np-actions{display:flex;gap:6px;}
.np-action{font-size:11.5px;color:var(--accent);cursor:pointer;font-weight:500;padding:3px 8px;border-radius:6px;border:none;background:transparent;font-family:'Geist',sans-serif;transition:background .15s;}
.np-action:hover{background:var(--accent-l);}
.np-tabs{display:flex;padding:10px 14px 0;gap:4px;border-bottom:1px solid var(--paper3);}
.np-tab{padding:6px 12px;border-radius:7px 7px 0 0;font-size:12px;font-weight:500;cursor:pointer;color:var(--ink3);border:none;background:transparent;font-family:'Geist',sans-serif;border-bottom:2px solid transparent;transition:all .15s;}
.np-tab.on{color:var(--ink);border-bottom-color:var(--ink);font-weight:600;}
.np-list{max-height:380px;overflow-y:auto;}
.np-list::-webkit-scrollbar{width:4px;}
.np-list::-webkit-scrollbar-track{background:transparent;}
.np-list::-webkit-scrollbar-thumb{background:var(--paper3);border-radius:2px;}
.notif-row{
  display:flex;align-items:flex-start;gap:12px;
  padding:13px 16px;
  cursor:pointer;transition:background .15s;
  border-bottom:1px solid var(--paper2);
  position:relative;
}
.notif-row:last-child{border-bottom:none;}
.notif-row:hover{background:var(--paper2);}
.notif-row.unread{background:rgba(29,78,216,.03);}
.notif-row.unread:hover{background:rgba(29,78,216,.06);}
.notif-unread-dot{
  position:absolute;left:6px;top:50%;transform:translateY(-50%);
  width:5px;height:5px;border-radius:50%;background:var(--accent);
}
.notif-icon{
  width:36px;height:36px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-size:16px;flex-shrink:0;
}
.notif-body{flex:1;min-width:0;}
.notif-title{font-size:13px;font-weight:600;color:var(--ink);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.notif-text{font-size:12px;color:var(--ink3);line-height:1.4;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.notif-ts{font-size:11px;color:var(--ink4);}
.notif-dismiss{
  width:20px;height:20px;border-radius:5px;border:none;background:transparent;
  color:var(--ink4);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;transition:all .15s;margin-top:1px;
}
.notif-dismiss:hover{background:var(--paper3);color:var(--ink2);}
.np-empty{text-align:center;padding:36px 20px;color:var(--ink3);font-size:13px;}
.np-empty-ic{font-size:28px;margin-bottom:8px;}
.np-footer{padding:10px 14px;border-top:1px solid var(--paper3);text-align:center;}
.np-footer-btn{font-size:12px;color:var(--accent);cursor:pointer;font-weight:500;background:none;border:none;font-family:'Geist',sans-serif;}

/* ── TOAST NOTIFICATIONS ── */
.toast-stack{
  position:fixed;bottom:24px;right:24px;
  display:flex;flex-direction:column;gap:10px;
  z-index:9999;pointer-events:none;
}
.toast{
  display:flex;align-items:center;gap:12px;
  background:#fff;border:1px solid var(--paper3);
  border-radius:12px;padding:14px 16px;
  box-shadow:0 8px 32px rgba(0,0,0,.14);
  pointer-events:all;
  min-width:300px;max-width:380px;
  animation:toastIn .35s cubic-bezier(.34,1.4,.64,1);
  position:relative;overflow:hidden;
}
@keyframes toastIn{from{opacity:0;transform:translateX(40px) scale(.95);}to{opacity:1;transform:none;}}
.toast.out{animation:toastOut .25s ease forwards;}
@keyframes toastOut{to{opacity:0;transform:translateX(40px) scale(.95);}}
.toast-bar{position:absolute;bottom:0;left:0;height:3px;border-radius:0 0 0 12px;animation:shrink linear forwards;}
@keyframes shrink{from{width:100%;}to{width:0%;}}
.toast-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.toast-body{flex:1;min-width:0;}
.toast-title{font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:2px;font-family:'Bricolage Grotesque',sans-serif;}
.toast-text{font-size:12px;color:var(--ink3);line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.toast-close{width:22px;height:22px;border-radius:5px;border:none;background:transparent;color:var(--ink4);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;}
.toast-close:hover{background:var(--paper2);color:var(--ink2);}

/* ── NOTIF PAGE ── */
.notif-page-row{
  display:flex;align-items:flex-start;gap:14px;padding:16px 20px;
  border-bottom:1px solid var(--paper2);cursor:pointer;transition:background .15s;
}
.notif-page-row:hover{background:var(--paper2);}
.notif-page-row.unread{border-left:3px solid var(--accent);padding-left:17px;}
.notif-page-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.notif-page-title{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:3px;}
.notif-page-body{font-size:13px;color:var(--ink2);line-height:1.45;margin-bottom:4px;}
.notif-page-ts{font-size:11.5px;color:var(--ink4);}
.notif-page-tag{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10.5px;font-weight:600;margin-left:6px;}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:var(--rs);font-family:'Bricolage Grotesque',sans-serif;font-size:13.5px;font-weight:700;cursor:pointer;transition:all .15s;border:none;letter-spacing:-.2px;}
.btn-dark{background:var(--ink);color:#fff;}.btn-dark:hover{background:#2d2c29;transform:translateY(-1px);box-shadow:var(--sh2);}
.btn-outline{background:transparent;border:1px solid var(--paper3);color:var(--ink2);}.btn-outline:hover{background:var(--paper2);}
.btn-sm{padding:6px 13px;font-size:12.5px;}
.btn-xs{padding:4px 10px;font-size:11.5px;border-radius:7px;}

/* ── GENERAL ── */
.pg{padding:26px 28px;}
@media(max-width:600px){.pg{padding:14px 16px;}}
.mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--paper3);padding:8px 0 max(8px,env(safe-area-inset-bottom));z-index:200;gap:0;}
.mobile-nav{box-shadow:0 -4px 20px rgba(0,0,0,.08);}
.mnav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 4px;cursor:pointer;color:var(--ink3);transition:.2s;}
.mnav-item.active{color:var(--accent);}
.mnav-icon{font-size:20px;line-height:1;}
.mnav-label{font-size:9px;font-weight:600;letter-spacing:.3px;text-transform:uppercase;}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;}
@media(max-width:1100px){.stats{grid-template-columns:repeat(2,1fr);}}
.scard{background:#fff;border:1px solid var(--paper3);border-radius:var(--r);padding:20px 22px;box-shadow:var(--sh);position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;}
.scard:hover{transform:translateY(-2px);box-shadow:var(--sh2);}
.scard-bar{position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r) var(--r) 0 0;}
.scard-label{font-size:11px;color:var(--ink3);letter-spacing:.3px;text-transform:uppercase;font-weight:500;margin-bottom:10px;}
.scard-val{font-family:'Bricolage Grotesque',sans-serif;font-size:32px;font-weight:800;letter-spacing:-1.5px;color:var(--ink);line-height:1;margin-bottom:5px;}
.scard-sub{font-size:12px;color:var(--ink3);}
.scard-sub .up{color:var(--green);font-weight:600;}.scard-sub .dn{color:var(--red);font-weight:600;}
.card{background:#fff;border:1px solid var(--paper3);border-radius:var(--r);padding:22px;box-shadow:var(--sh);}
.card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.card-title{font-family:'Bricolage Grotesque',sans-serif;font-size:14.5px;font-weight:800;letter-spacing:-.3px;display:flex;align-items:center;gap:7px;}
.card-link{font-size:12px;color:var(--accent);cursor:pointer;font-weight:500;}
.two-col{display:grid;grid-template-columns:1fr 340px;gap:18px;margin-bottom:18px;}
@media(max-width:1080px){.two-col{grid-template-columns:1fr;}}
.rchart{height:140px;display:flex;align-items:flex-end;gap:6px;}
.rbar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;}
.rbar-wrap{width:100%;flex:1;display:flex;align-items:flex-end;}
.rbar{width:100%;border-radius:5px 5px 0 0;cursor:pointer;transition:filter .15s;}
.rbar:hover{filter:brightness(1.08);}
.rbar-now{background:var(--ink)!important;}
.rbar-past{background:var(--paper3);}
.rbar-lbl{font-size:11px;color:var(--ink3);font-weight:500;}
.goal-row{margin-bottom:14px;}
.goal-hd{display:flex;justify-content:space-between;margin-bottom:6px;}
.goal-lbl{font-size:12px;color:var(--ink3);}
.goal-val{font-size:12px;font-weight:700;color:var(--ink);font-family:'Bricolage Grotesque',sans-serif;}
.goal-track{height:7px;background:var(--paper2);border-radius:4px;overflow:hidden;}
.goal-fill{height:100%;border-radius:4px;background:var(--ink);transition:width 1s ease;}
.goal-fill.hit{background:var(--green);}
.prow{display:flex;align-items:center;padding:12px 8px;border-bottom:1px solid var(--paper2);gap:11px;cursor:pointer;border-radius:9px;margin:0 -8px;transition:background .15s;}
.prow:last-child{border-bottom:none;}.prow:hover{background:var(--paper2);}
.pdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.pinfo{flex:1;min-width:0;}
.pname{font-size:13.5px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.psub{font-size:11.5px;color:var(--ink3);margin-top:1px;}
.pmbar{width:56px;height:4px;background:var(--paper3);border-radius:2px;overflow:hidden;}
.pmfill{height:100%;border-radius:2px;}
.ppct{font-family:'Bricolage Grotesque',sans-serif;font-size:14px;font-weight:800;color:var(--ink);width:34px;text-align:right;flex-shrink:0;}
.trow{display:flex;align-items:flex-start;gap:10px;padding:11px 0;border-bottom:1px solid var(--paper2);}
.trow:last-child{border-bottom:none;}
.tchk{width:17px;height:17px;border-radius:5px;border:1.5px solid var(--paper3);background:transparent;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s;margin-top:1px;font-size:10px;color:transparent;}
.tchk.on{background:var(--ink);border-color:var(--ink);color:#fff;}
.ttxt{font-size:13px;color:var(--ink);flex:1;line-height:1.4;}
.ttxt.done{text-decoration:line-through;color:var(--ink4);}
.tdue{font-size:11px;color:var(--ink3);margin-top:2px;}
.tdue.late{color:var(--red);font-weight:600;}
.pdot-sm{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.ph{background:#ef4444;}.pm{background:#f59e0b;}.pl{background:#10b981;}
.irow{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid var(--paper2);}
.irow:last-child{border-bottom:none;}
.inum{font-family:'Bricolage Grotesque',sans-serif;font-size:12.5px;font-weight:700;color:var(--ink);width:68px;flex-shrink:0;}
.iname{font-size:13px;color:var(--ink2);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.iamt{font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:800;color:var(--ink);flex-shrink:0;}
.ibadge{padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;flex-shrink:0;}
.ib-paid{background:var(--green-l);color:var(--green);}
.ib-pending{background:var(--accent-l);color:var(--accent);}
.ib-overdue{background:var(--red-l);color:var(--red);}
.sh-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.sh{font-family:'Bricolage Grotesque',sans-serif;font-size:21px;font-weight:800;letter-spacing:-.5px;}
.ptabs{display:flex;gap:5px;margin-bottom:16px;flex-wrap:wrap;}
.ptab{padding:6px 14px;border-radius:20px;border:1px solid var(--paper3);background:transparent;color:var(--ink3);font-size:12.5px;font-weight:500;cursor:pointer;transition:all .15s;font-family:'Geist',sans-serif;}
.ptab.on{background:var(--ink);color:#fff;border-color:var(--ink);}
.ptab:hover:not(.on){background:var(--paper2);color:var(--ink);}
.av{border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;color:#fff;flex-shrink:0;}
.av-sm{width:30px;height:30px;font-size:11px;border-radius:8px;}
.av-md{width:38px;height:38px;font-size:14px;border-radius:10px;}
.av-lg{width:46px;height:46px;font-size:17px;border-radius:13px;}
.av-fr{background:linear-gradient(135deg,#86efac,#16a34a);color:#0f172a!important;}
.moverlay{position:fixed;inset:0;background:rgba(0,0,0,.35);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;animation:fin .2s ease;}
@keyframes fin{from{opacity:0;}to{opacity:1;}}
.modal{background:#fff;border-radius:20px;padding:30px;width:100%;max-width:420px;box-shadow:0 20px 80px rgba(0,0,0,.18);animation:sup .25s cubic-bezier(.34,1.56,.64,1);}
@keyframes sup{from{opacity:0;transform:translateY(18px) scale(.97);}to{opacity:1;transform:none;}}
.modal-title{font-family:'Bricolage Grotesque',sans-serif;font-size:20px;font-weight:800;letter-spacing:-.5px;margin-bottom:22px;}
.mfield{margin-bottom:14px;}
.mlbl{display:block;font-size:11.5px;font-weight:500;color:var(--ink2);margin-bottom:5px;letter-spacing:.3px;text-transform:uppercase;}
.minp{width:100%;padding:10px 13px;border:1.5px solid var(--paper3);border-radius:9px;background:var(--paper);color:var(--ink);font-family:'Geist',sans-serif;font-size:13.5px;outline:none;transition:border-color .15s,box-shadow .15s;}
.minp:focus{border-color:var(--ink);box-shadow:0 0 0 3px rgba(15,14,12,.07);}
.mactions{display:flex;gap:9px;margin-top:22px;}
.m-cancel{flex:1;padding:11px;border-radius:9px;border:1px solid var(--paper3);background:transparent;color:var(--ink2);font-size:13.5px;cursor:pointer;font-family:'Bricolage Grotesque',sans-serif;font-weight:700;transition:all .15s;}
.m-cancel:hover{background:var(--paper2);}
.m-save{flex:2;padding:11px;border-radius:9px;border:none;background:var(--ink);color:#fff;font-size:13.5px;font-weight:700;cursor:pointer;font-family:'Bricolage Grotesque',sans-serif;transition:all .15s;}
.m-save:hover{background:#2d2c29;}
.login-wrap{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;background:var(--paper);}
@media(max-width:740px){.login-wrap{grid-template-columns:1fr;}.login-art{display:none!important;}}
.login-art{background:var(--ink);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;}
.art-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:36px 36px;}
.art-orb{position:absolute;border-radius:50%;filter:blur(70px);}
.o1{width:320px;height:320px;background:rgba(134,239,172,.18);top:-80px;right:-60px;}
.o2{width:200px;height:200px;background:rgba(96,165,250,.12);bottom:60px;left:30px;}
.art-inner{position:relative;z-index:1;padding:48px;text-align:center;}
.art-logo{font-family:'Bricolage Grotesque',sans-serif;font-size:30px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:10px;}
.art-logo em{color:#86efac;font-style:normal;}
.art-sub{color:rgba(255,255,255,.45);font-size:14px;max-width:260px;margin:0 auto 44px;line-height:1.6;}
.art-cards{display:flex;flex-direction:column;gap:10px;width:270px;}
.acard{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:13px 16px;display:flex;align-items:center;gap:10px;animation:flt 6s ease-in-out infinite;}
.acard:nth-child(2){animation-delay:2s;margin-left:18px;}
.acard:nth-child(3){animation-delay:4s;}
@keyframes flt{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
.acard-ic{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
.acard-txt{font-size:12px;color:rgba(255,255,255,.5);}
.acard-txt strong{color:rgba(255,255,255,.9);font-size:12px;display:block;}
.login-side{display:flex;align-items:center;justify-content:center;padding:40px;}
.login-inner{width:100%;max-width:380px;}
.lang-row{display:flex;gap:6px;margin-bottom:40px;}
.lbtn{padding:5px 13px;border-radius:20px;border:1px solid var(--paper3);background:transparent;color:var(--ink3);font-family:'Geist',sans-serif;font-size:12.5px;cursor:pointer;transition:all .2s;}
.lbtn.on{background:var(--ink);border-color:var(--ink);color:#fff;}
.login-eyebrow{font-size:11.5px;font-weight:600;color:var(--accent);letter-spacing:2px;text-transform:uppercase;margin-bottom:7px;}
.login-h{font-family:'Bricolage Grotesque',sans-serif;font-size:34px;font-weight:800;letter-spacing:-1.5px;color:var(--ink);margin-bottom:6px;line-height:1.1;}
.login-desc{font-size:13.5px;color:var(--ink3);margin-bottom:32px;line-height:1.5;}
.fgroup{margin-bottom:16px;}
.flbl{display:block;font-size:11.5px;font-weight:500;color:var(--ink2);margin-bottom:6px;letter-spacing:.3px;text-transform:uppercase;}
.finp{width:100%;background:var(--paper);border:1.5px solid var(--paper3);border-radius:9px;padding:12px 14px;color:var(--ink);font-family:'Geist',sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s;}
.finp:focus{border-color:var(--ink);box-shadow:0 0 0 3px rgba(15,14,12,.07);}
.finp::placeholder{color:var(--ink4);}
.lerror{background:var(--red-l);border:1px solid rgba(185,28,28,.2);border-radius:9px;padding:11px 14px;color:var(--red);font-size:13px;margin-top:12px;text-align:center;}
.demo-box{margin-top:28px;padding:14px;background:var(--accent-l);border:1px solid rgba(29,78,216,.1);border-radius:9px;}
.demo-ttl{font-size:10.5px;color:var(--accent);font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:9px;}
.demo-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(29,78,216,.08);cursor:pointer;}
.demo-row:last-child{border-bottom:none;padding-bottom:0;}
.demo-row:hover .demo-use{opacity:1;}
.demo-em{font-size:12.5px;color:var(--ink2);}
.demo-use{font-size:11px;color:var(--accent);opacity:.4;transition:opacity .2s;}
.tag{padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;}
.tag-active{background:var(--violet-l);color:var(--violet);}
.tag-planning{background:var(--amber-l);color:var(--amber);}
.tag-completed{background:var(--green-l);color:var(--green);}
.det-grid{display:grid;grid-template-columns:1fr 320px;gap:18px;}
@media(max-width:960px){.det-grid{grid-template-columns:1fr;}}
.fin-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--paper2);}
.fin-row:last-child{border-bottom:none;}
.fin-lbl{font-size:13px;color:var(--ink3);}
.fin-val{font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:800;color:var(--ink);}
.fin-val.g{color:var(--green);}.fin-val.a{color:var(--amber);}
.drow{display:flex;align-items:center;padding:13px 0;border-bottom:1px solid var(--paper2);gap:11px;}
.drow:last-child{border-bottom:none;}
.ddot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.ddot-approved{background:#15803d;box-shadow:0 0 8px rgba(21,128,61,.4);}
.ddot-review{background:#f59e0b;box-shadow:0 0 8px rgba(245,158,11,.4);}
.ddot-pending{background:var(--ink4);}
.dname{font-size:13.5px;font-weight:500;color:var(--ink);flex:1;}
.ddate{font-size:11.5px;color:var(--ink3);}
.del-approved{background:var(--green-l);color:var(--green);}
.del-review{background:var(--amber-l);color:var(--amber);}
.del-pending{background:var(--paper2);color:var(--ink3);}
.big-prog{margin:14px 0;}
.big-prog-bar{height:9px;background:var(--paper2);border-radius:5px;overflow:hidden;}
.big-prog-fill{height:100%;border-radius:5px;transition:width .8s ease;}
.msg-bubble{max-width:72%;padding:11px 15px;border-radius:14px;font-size:13.5px;line-height:1.5;}
.msg-from-me{align-self:flex-end;background:var(--ink);color:#fff;border-bottom-right-radius:4px;}
.msg-from-other{align-self:flex-start;background:#fff;color:var(--ink);border:1px solid var(--paper3);border-bottom-left-radius:4px;}
.msg-time{font-size:10.5px;opacity:.5;margin-top:3px;}
.msg-inp{flex:1;padding:11px 14px;border:1.5px solid var(--paper3);border-radius:9px;background:var(--paper);color:var(--ink);font-family:'Geist',sans-serif;font-size:13.5px;outline:none;transition:border-color .15s;}
.msg-inp:focus{border-color:var(--ink);}
.crow{display:flex;align-items:center;gap:12px;padding:13px 8px;border-bottom:1px solid var(--paper2);cursor:pointer;border-radius:9px;margin:0 -8px;transition:background .15s;}
.crow:last-child{border-bottom:none;}.crow:hover{background:var(--paper2);}
.cav{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:13px;color:#fff;flex-shrink:0;}
.cname{font-size:14px;font-weight:600;color:var(--ink);}
.cco{font-size:12px;color:var(--ink3);margin-top:1px;}
.cright{margin-left:auto;text-align:right;flex-shrink:0;}
.cbilled{font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:800;color:var(--ink);}
.cstat{font-size:11px;margin-top:2px;}
.ca{color:var(--green);}.ci{color:var(--ink3);}
.empty{text-align:center;padding:36px 20px;color:var(--ink3);font-size:13.5px;}
.empty-ic{font-size:30px;margin-bottom:8px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
.fu{animation:fadeUp .35s ease both;}
.d1{animation-delay:.05s;}.d2{animation-delay:.1s;}.d3{animation-delay:.15s;}.d4{animation-delay:.2s;}

/* ── NOTIF SETTINGS ── */
.pref-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--paper2);}
.pref-row:last-child{border-bottom:none;}
.pref-left{display:flex;align-items:center;gap:12px;}
.pref-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.pref-name{font-size:13.5px;font-weight:600;color:var(--ink);}
.pref-desc{font-size:12px;color:var(--ink3);margin-top:1px;}
.toggle{width:42px;height:24px;border-radius:12px;cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0;}
.toggle.on{background:var(--ink);}
.toggle.off{background:var(--paper3);}
.toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:9px;background:#fff;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.2);}
.toggle.on .toggle-knob{left:21px;}
.toggle.off .toggle-knob{left:3px;}

/* CLIENT PORTAL */
.cp-shell{display:grid;grid-template-columns:210px 1fr;min-height:100vh;background:var(--paper);}
@media(max-width:860px){.cp-shell{grid-template-columns:1fr;}.cp-side{display:none!important;}}
.cp-side{background:var(--ink);padding:24px 16px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;}
.cp-main{overflow-y:auto;}
.cp-topbar{background:#fff;border-bottom:1px solid var(--paper3);padding:16px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:20;box-shadow:var(--sh);}
.cp-content{padding:26px 28px;}
`;

// ════════════════════════════════════════════════════════════
//  TOAST SYSTEM
// ════════════════════════════════════════════════════════════
function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => {
        const nt = NOTIF_TYPES[t.type] || NOTIF_TYPES.MSG_NEW;
        return (
          <div key={t.id} className={`toast ${t.out ? "out" : ""}`}>
            <div className="toast-bar" style={{ background: nt.color, animationDuration: `${t.duration}ms` }} />
            <div className="toast-icon" style={{ background: nt.color + "18" }}>{nt.icon}</div>
            <div className="toast-body">
              <div className="toast-title">{t.title}</div>
              <div className="toast-text">{t.body}</div>
            </div>
            <button className="toast-close" onClick={() => onDismiss(t.id)}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  BELL + PANEL
// ════════════════════════════════════════════════════════════
function NotifBell({ notifications, onRead, onReadAll, onDismiss, onViewAll }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const ref = useRef(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const shown = tab === "all" ? notifications : notifications.filter(n => !n.read);

  return (
    <div className="bell-wrap" ref={ref}>
      <button className="bell-btn" onClick={() => setOpen(o => !o)}>
        🔔
        {unread > 0 && <span className="bell-count">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && (
        <div className="notif-panel">
          <div className="np-header">
            <div className="np-title">Notificaciones</div>
            <div className="np-actions">
              {unread > 0 && <button className="np-action" onClick={onReadAll}>Marcar todo leído</button>}
            </div>
          </div>
          <div className="np-tabs">
            <button className={`np-tab ${tab === "all" ? "on" : ""}`} onClick={() => setTab("all")}>Todas</button>
            <button className={`np-tab ${tab === "unread" ? "on" : ""}`} onClick={() => setTab("unread")}>Sin leer {unread > 0 && `(${unread})`}</button>
          </div>
          <div className="np-list">
            {shown.length === 0 && (
              <div className="np-empty"><div className="np-empty-ic">🎉</div>Todo al día</div>
            )}
            {shown.map(n => {
              const nt = NOTIF_TYPES[n.type] || NOTIF_TYPES.MSG_NEW;
              return (
                <div key={n.id} className={`notif-row ${!n.read ? "unread" : ""}`} onClick={() => { onRead(n.id); setOpen(false); }}>
                  {!n.read && <div className="notif-unread-dot" />}
                  <div className="notif-icon" style={{ background: nt.color + "18" }}>{nt.icon}</div>
                  <div className="notif-body">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-text">{n.body}</div>
                    <div className="notif-ts">{fmtAgo(n.ts)}</div>
                  </div>
                  <button className="notif-dismiss" onClick={e => { e.stopPropagation(); onDismiss(n.id); }}>✕</button>
                </div>
              );
            })}
          </div>
          <div className="np-footer">
            <button className="np-footer-btn" onClick={() => { setOpen(false); onViewAll(); }}>Ver todas las notificaciones →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  NOTIFICATIONS PAGE
// ════════════════════════════════════════════════════════════
function NotificationsPage({ notifications, onRead, onReadAll, onDismiss, dispatch }) {
  const [tab, setTab] = useState("all");
  const [prefOpen, setPrefOpen] = useState(false);
  const [prefs, setPrefs] = useState({
    MSG_NEW: true, INVOICE_PAID: true, INVOICE_OVERDUE: true,
    DEL_APPROVED: true, DEL_REVIEW: true, TASK_DUE: true,
    PROJECT_NEW: true, CLIENT_MSG: true,
  });

  const unread = notifications.filter(n => !n.read).length;
  const shown  = tab === "all" ? notifications
    : tab === "unread" ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.read);

  const togglePref = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const prefItems = [
    { key: "CLIENT_MSG",     label: "Mensajes de clientes",      desc: "Cuando un cliente te escribe" },
    { key: "DEL_REVIEW",     label: "Entregables en revisión",   desc: "Cuando un cliente pide revisión" },
    { key: "DEL_APPROVED",   label: "Entregables aprobados",     desc: "Cuando aprueban tu trabajo" },
    { key: "INVOICE_PAID",   label: "Pagos recibidos",           desc: "Cuando se marca una factura pagada" },
    { key: "INVOICE_OVERDUE",label: "Facturas vencidas",         desc: "Cuando una factura pasa su fecha límite" },
    { key: "TASK_DUE",       label: "Tareas por vencer",         desc: "24h antes de la fecha límite" },
    { key: "PROJECT_NEW",    label: "Proyectos creados",         desc: "Cuando creas un nuevo proyecto" },
  ];

  return (
    <div className="pg">
      <div className="sh-row">
        <div>
          <div className="sh">Notificaciones</div>
          {unread > 0 && <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 2 }}>{unread} sin leer</div>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {unread > 0 && <button className="btn btn-outline btn-sm" onClick={onReadAll}>✓ Marcar todo leído</button>}
          <button className="btn btn-dark btn-sm" onClick={() => setPrefOpen(true)}>⚙ Preferencias</button>
        </div>
      </div>

      <div className="ptabs">
        {[{ k: "all", l: `Todas (${notifications.length})` }, { k: "unread", l: `Sin leer (${unread})` }, { k: "read", l: "Leídas" }].map(t => (
          <button key={t.k} className={`ptab ${tab === t.k ? "on" : ""}`} onClick={() => setTab(t.k)}>{t.l}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {shown.length === 0 && <div className="empty"><div className="empty-ic">🎉</div>Sin notificaciones aquí</div>}
        {shown.map(n => {
          const nt = NOTIF_TYPES[n.type] || NOTIF_TYPES.MSG_NEW;
          return (
            <div key={n.id} className={`notif-page-row ${!n.read ? "unread" : ""}`}
              onClick={() => { onRead(n.id); if (n.link) dispatch({ type: "view", v: n.link }); }}>
              <div className="notif-page-icon" style={{ background: nt.color + "15" }}>{nt.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div className="notif-page-title">{n.title}</div>
                  {!n.read && <span style={{ background: "var(--accent)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6, letterSpacing: .5, textTransform: "uppercase" }}>NUEVO</span>}
                  <span className="notif-page-tag" style={{ background: nt.color + "15", color: nt.color }}>{nt.label}</span>
                </div>
                <div className="notif-page-body">{n.body}</div>
                <div className="notif-page-ts">{fmtAgo(n.ts)} · {new Date(n.ts).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              <button className="notif-dismiss" onClick={e => { e.stopPropagation(); onDismiss(n.id); }} style={{ width: 28, height: 28 }}>✕</button>
            </div>
          );
        })}
      </div>

      {/* PREFERENCES MODAL */}
      {prefOpen && (
        <div className="moverlay" onClick={e => e.target === e.currentTarget && setPrefOpen(false)}>
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-title">⚙ Preferencias de notificaciones</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>Elige qué notificaciones quieres recibir en tiempo real.</div>
            {prefItems.map(p => {
              const nt = NOTIF_TYPES[p.key];
              return (
                <div className="pref-row" key={p.key}>
                  <div className="pref-left">
                    <div className="pref-icon" style={{ background: (nt?.color || "#888") + "18" }}>{nt?.icon}</div>
                    <div>
                      <div className="pref-name">{p.label}</div>
                      <div className="pref-desc">{p.desc}</div>
                    </div>
                  </div>
                  <button className={`toggle ${prefs[p.key] ? "on" : "off"}`} onClick={() => togglePref(p.key)}>
                    <div className="toggle-knob" />
                  </button>
                </div>
              );
            })}
            <div className="mactions" style={{ marginTop: 24 }}>
              <button className="m-cancel" onClick={() => setPrefOpen(false)}>Cancelar</button>
              <button className="m-save" onClick={() => setPrefOpen(false)}>Guardar preferencias</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  AVATAR + MODAL + FORM ENGINE (same as v1)
// ════════════════════════════════════════════════════════════
function Avatar({ initials, color, size = "md", fr = false }) {
  return <div className={`av av-${size}${fr ? " av-fr" : ""}`} style={fr ? {} : { background: color || "#6366f1" }}>{initials}</div>;
}
function ModalWrap({ title, onClose, children }) {
  return (
    <div className="moverlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal"><div className="modal-title">{title}</div>{children}</div>
    </div>
  );
}
function RevenueChart({ data, goal }) {
  const max = Math.max(...data.map(d => d.amount), goal);
  return (
    <div className="rchart">
      {data.map((d, i) => {
        const now = i === data.length - 1;
        const h = Math.round((d.amount / max) * 110);
        return (
          <div className="rbar-col" key={d.month} title={`${d.month}: ${fmt(d.amount)}`}>
            <div className="rbar-wrap" style={{ height: 120 }}>
              <div className={`rbar ${now ? "rbar-now" : "rbar-past"}`} style={{ height: h }} />
            </div>
            <div className="rbar-lbl">{d.month}</div>
          </div>
        );
      })}
    </div>
  );
}
const MODAL_CFGS = {
  project:     { title: "Nuevo Proyecto",  fields: [{ key:"name", label:"Nombre", ph:"Rediseño Web..." },{ key:"clientId", label:"Cliente", type:"select", opts:d=>d.clients.map(c=>({v:c.id,l:c.name})) },{ key:"budget", label:"Presupuesto $", ph:"5000" },{ key:"due", label:"Entrega", type:"date" }] },
  client:      { title: "Nuevo Cliente",   fields: [{ key:"name", label:"Nombre completo", ph:"Ana García" },{ key:"company", label:"Empresa", ph:"Estudio X" },{ key:"email", label:"Email", ph:"ana@empresa.com" }] },
  invoice:     { title: "Nueva Factura",   fields: [{ key:"clientId", label:"Cliente", type:"select", opts:d=>d.clients.map(c=>({v:c.id,l:c.name})) },{ key:"projectId", label:"Proyecto", type:"select", opts:d=>d.projects.map(p=>({v:p.id,l:p.name})) },{ key:"amount", label:"Monto $", ph:"2500" },{ key:"due", label:"Vencimiento", type:"date" }] },
  task:        { title: "Nueva Tarea",     fields: [{ key:"text", label:"Descripción", ph:"Entregar maquetas..." },{ key:"projectId", label:"Proyecto", type:"select", opts:d=>d.projects.map(p=>({v:p.id,l:p.name})) },{ key:"priority", label:"Prioridad", type:"select", opts:()=>[{v:"high",l:"Alta"},{v:"medium",l:"Media"},{v:"low",l:"Baja"}] },{ key:"due", label:"Fecha límite", type:"date" }] },
  deliverable: { title: "Nuevo Entregable",fields: [{ key:"name", label:"Nombre", ph:"Maquetas homepage..." },{ key:"projectId", label:"Proyecto", type:"select", opts:d=>d.projects.map(p=>({v:p.id,l:p.name})) },{ key:"date", label:"Fecha", type:"date" }] },
};
function FormModal({ cfg, data, onClose, onSave }) {
  const [form, setForm] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <ModalWrap title={cfg.title} onClose={onClose}>
      {cfg.fields.map(f => (
        <div className="mfield" key={f.key}>
          <label className="mlbl">{f.label}</label>
          {f.type === "select"
            ? <select className="minp" value={form[f.key]||""} onChange={e=>set(f.key,e.target.value)}><option value="">Seleccionar...</option>{f.opts(data).map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>
            : <input className="minp" type={f.type||"text"} placeholder={f.ph||""} value={form[f.key]||""} onChange={e=>set(f.key,e.target.value)} />}
        </div>
      ))}
      <div className="mactions">
        <button className="m-cancel" onClick={onClose}>Cancelar</button>
        <button className="m-save" onClick={()=>onSave(form)}>Guardar</button>
      </div>
    </ModalWrap>
  );
}

// ════════════════════════════════════════════════════════════
//  MEDIA MODULE
// ════════════════════════════════════════════════════════════
const FILE_ICONS = { video:"🎬", audio:"🎵", image:"🖼", pdf:"📄", other:"📎" };
const FILE_COLORS = { video:"#7c3aed", audio:"#0ea5e9", image:"#ec4899", pdf:"#dc2626", other:"#6b7280" };

function MediaPlayer({ item, onClose }) {
  return (
    <div className="moverlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:700,padding:0,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid var(--paper3)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>{FILE_ICONS[item.type]}</span>
            <div>
              <div style={{fontWeight:800,fontSize:15,fontFamily:"'Bricolage Grotesque',sans-serif"}}>{item.name}</div>
              <div style={{fontSize:11,color:"var(--ink3)"}}>{item.ext.toUpperCase()} · {item.size}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <a href={item.url} download target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{textDecoration:"none"}}>⬇ Descargar</a>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"var(--paper2)",cursor:"pointer",fontSize:13}}>✕</button>
          </div>
        </div>
        <div style={{padding:20,background:"#111",minHeight:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {item.type==="video" && <video controls style={{maxWidth:"100%",maxHeight:400,borderRadius:8}} src={item.url}><source src={item.url} type="video/mp4"/>Tu navegador no soporta video.</video>}
          {item.type==="audio" && <div style={{width:"100%",padding:"30px 0"}}><div style={{fontSize:48,textAlign:"center",marginBottom:16}}>🎵</div><audio controls style={{width:"100%"}} src={item.url}><source src={item.url} type="audio/mpeg"/>Tu navegador no soporta audio.</audio></div>}
          {item.type==="image" && <img src={item.url} alt={item.name} style={{maxWidth:"100%",maxHeight:400,borderRadius:8,objectFit:"contain"}}/>}
          {item.type==="pdf"   && <div style={{textAlign:"center",color:"#fff"}}><div style={{fontSize:64,marginBottom:12}}>📄</div><a href={item.url} target="_blank" rel="noreferrer" className="btn btn-dark" style={{textDecoration:"none"}}>Abrir PDF →</a></div>}
        </div>
        {item.note && <div style={{padding:"12px 20px",borderTop:"1px solid var(--paper3)",fontSize:12,color:"var(--ink3)"}}>💬 {item.note}</div>}
      </div>
    </div>
  );
}

function AddMediaModal({ clients, projects, onClose, onSave }) {
  const [form, setForm] = useState({ clientId:"", projectId:"", name:"", type:"video", note:"", source:"upload", url:"" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const filteredProjects = projects.filter(p => p.clientId === +form.clientId);

  const handleSave = async () => {
    if(!form.name||!form.clientId) return;
    
    // If link, save directly
    if(form.source==="link") {
      const ext = form.url.split(".").pop().split("?")[0]||form.type;
      onSave({ id: Date.now(), clientId:+form.clientId, projectId:+form.projectId||null, name:form.name, type:form.type, ext, size:"—", url:form.url, thumb:FILE_ICONS[form.type], date:new Date().toISOString().split("T")[0], note:form.note });
      onClose();
      return;
    }

    // Upload to Cloudinary
    if(file) {
      setUploading(true);
      try {
        // Get signature from our API
        const sigRes = await fetch("/api/upload/sign", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ folder: "sympra" })
        });
        const { signature, timestamp, apiKey, cloudName, folder } = await sigRes.json();

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp);
        formData.append("api_key", apiKey);
        formData.append("folder", folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method:"POST", body: formData
        });
        const uploadData = await uploadRes.json();

        if(uploadData.secure_url) {
          const ext = file.name.split(".").pop()||form.type;
          const size = `${(file.size/1024/1024).toFixed(1)} MB`;
          onSave({ id: Date.now(), clientId:+form.clientId, projectId:+form.projectId||null, name:form.name, type:form.type, ext, size, url:uploadData.secure_url, thumb:FILE_ICONS[form.type], date:new Date().toISOString().split("T")[0], note:form.note });
          onClose();
        } else {
          alert("Error subiendo archivo. Intenta de nuevo.");
        }
      } catch(e) {
        // Fallback to local URL if Cloudinary fails
        const url = URL.createObjectURL(file);
        const ext = file.name.split(".").pop()||form.type;
        const size = `${(file.size/1024/1024).toFixed(1)} MB`;
        onSave({ id: Date.now(), clientId:+form.clientId, projectId:+form.projectId||null, name:form.name, type:form.type, ext, size, url, thumb:FILE_ICONS[form.type], date:new Date().toISOString().split("T")[0], note:form.note });
        onClose();
      } finally {
        setUploading(false);
      }
    }
  };
  return (
    <div className="moverlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:520}}>
        <div className="modal-title">📎 Subir archivo</div>
        <div className="mfield"><label className="mlbl">Tipo de archivo</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["video","audio","image","pdf"].map(t=>(
              <button key={t} onClick={()=>set("type",t)} style={{padding:"6px 14px",borderRadius:20,border:`2px solid ${form.type===t?FILE_COLORS[t]:"var(--paper3)"}`,background:form.type===t?`${FILE_COLORS[t]}15`:"var(--paper)",cursor:"pointer",fontSize:12,fontWeight:600,color:form.type===t?FILE_COLORS[t]:"var(--ink3)",transition:"all .2s"}}>
                {FILE_ICONS[t]} {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="mfield"><label className="mlbl">Nombre</label><input className="minp" placeholder="Demo Reel Marzo 2026..." value={form.name} onChange={e=>set("name",e.target.value)}/></div>
        <div className="mfield"><label className="mlbl">Cliente</label>
          <select className="minp" value={form.clientId} onChange={e=>set("clientId",e.target.value)}>
            <option value="">Seleccionar cliente...</option>
            {clients.filter(c=>c.status==="active").map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {form.clientId && <div className="mfield"><label className="mlbl">Proyecto (opcional)</label>
          <select className="minp" value={form.projectId} onChange={e=>set("projectId",e.target.value)}>
            <option value="">Sin proyecto específico</option>
            {filteredProjects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>}
        <div className="mfield"><label className="mlbl">Fuente</label>
          <div style={{display:"flex",gap:8}}>
            {[{v:"upload",l:"📁 Subir archivo"},{v:"link",l:"🔗 Pegar link"}].map(o=>(
              <button key={o.v} onClick={()=>set("source",o.v)} style={{flex:1,padding:"8px",borderRadius:10,border:`2px solid ${form.source===o.v?"var(--ink)":"var(--paper3)"}`,background:form.source===o.v?"var(--ink)":"var(--paper)",cursor:"pointer",fontSize:12,fontWeight:600,color:form.source===o.v?"#fff":"var(--ink3)"}}>
                {o.l}
              </button>
            ))}
          </div>
        </div>
        {form.source==="upload" && <div className="mfield"><label className="mlbl">Archivo</label><input type="file" accept="video/*,audio/*,image/*,.pdf" onChange={e=>setFile(e.target.files[0])} style={{fontSize:13,color:"var(--ink)"}}/>{file&&<div style={{fontSize:11,color:"var(--green)",marginTop:4}}>✓ {file.name} ({(file.size/1024/1024).toFixed(1)} MB)</div>}</div>}
        {form.source==="link"   && <div className="mfield"><label className="mlbl">URL (YouTube, Vimeo, Drive, directo...)</label><input className="minp" placeholder="https://..." value={form.url} onChange={e=>set("url",e.target.value)}/></div>}
        <div className="mfield"><label className="mlbl">Nota para el cliente (opcional)</label><input className="minp" placeholder="Versión final para aprobación..." value={form.note} onChange={e=>set("note",e.target.value)}/></div>
        <div className="mactions">
          <button className="m-cancel" onClick={onClose}>Cancelar</button>
          <button className="m-save" onClick={handleSave} disabled={!form.name||!form.clientId||uploading}>{uploading?"Subiendo...":"Subir archivo"}</button>
        </div>
      </div>
    </div>
  );
}

function FMedia({ db, dispatch }) {
  const [playing, setPlaying]   = useState(null);
  const [adding, setAdding]     = useState(false);
  const [filter, setFilter]     = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const media = db.media || [];
  const filtered = media.filter(m => (filter==="all"||m.type===filter) && (clientFilter==="all"||m.clientId===+clientFilter));
  const types = ["all","video","audio","image","pdf"];
  return (
    <div className="pg">
      {playing && <MediaPlayer item={playing} onClose={()=>setPlaying(null)}/>}
      {adding  && <AddMediaModal clients={db.clients} projects={db.projects} onClose={()=>setAdding(false)} onSave={item=>dispatch({type:"addMedia",item})}/>}
      <div className="sh-row">
        <div className="sh">Archivos multimedia</div>
        <button className="btn btn-dark btn-sm" onClick={()=>setAdding(true)}>+ Subir archivo</button>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:6}}>
          {types.map(t=>(
            <button key={t} onClick={()=>setFilter(t)} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${filter===t?"var(--ink)":"var(--paper3)"}`,background:filter===t?"var(--ink)":"var(--paper)",cursor:"pointer",fontSize:12,fontWeight:600,color:filter===t?"#fff":"var(--ink3)",transition:"all .15s"}}>
              {t==="all"?"Todos":FILE_ICONS[t]+" "+t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        <select style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid var(--paper3)",background:"var(--paper)",fontSize:12,color:"var(--ink3)",cursor:"pointer"}} value={clientFilter} onChange={e=>setClientFilter(e.target.value)}>
          <option value="all">Todos los clientes</option>
          {db.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {filtered.length===0 && <div className="empty"><div className="empty-ic">📁</div>No hay archivos aún</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        {filtered.map(item=>{
          const cl = db.clients.find(c=>c.id===item.clientId);
          const pr = db.projects.find(p=>p.id===item.projectId);
          return (
            <div key={item.id} className="card" style={{cursor:"pointer",transition:"transform .15s,box-shadow .15s"}} onClick={()=>setPlaying(item)}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
              <div style={{height:120,background:`${FILE_COLORS[item.type]}15`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,position:"relative",overflow:"hidden"}}>
                {item.type==="image" ? <img src={item.url} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}}/> : <span style={{fontSize:48}}>{FILE_ICONS[item.type]}</span>}
                <div style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.5)",color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700}}>{item.ext.toUpperCase()}</div>
                <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,transition:"background .2s"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,opacity:0.8}}>▶</div>
                </div>
              </div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:4,color:"var(--ink)"}}>{item.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <Avatar initials={cl?.avatar||"?"} color={cl?.color} size="sm"/>
                <span style={{fontSize:11,color:"var(--ink3)"}}>{cl?.name}</span>
                {pr && <span style={{fontSize:10,color:"var(--ink4)",background:"var(--paper2)",borderRadius:4,padding:"1px 6px"}}>{pr.name}</span>}
              </div>
              {item.note && <div style={{fontSize:11,color:"var(--ink3)",marginBottom:6,fontStyle:"italic"}}>"{item.note}"</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                <span style={{fontSize:10,color:"var(--ink4)"}}>{item.size} · {fmtD(item.date)}</span>
                <a href={item.url} download target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:11,color:"var(--ink3)",textDecoration:"none",padding:"3px 8px",border:"1px solid var(--paper3)",borderRadius:6}}>⬇</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── CLIENT PORTAL MEDIA VIEW ──────────────────────────────────
function ClientMedia({ clientId, db, dispatch }) {
  const [playing, setPlaying] = useState(null);
  const [filter, setFilter]   = useState("all");
  const media = (db.media||[]).filter(m => m.clientId === clientId);
  const filtered = filter==="all" ? media : media.filter(m=>m.type===filter);
  const types = [...new Set(media.map(m=>m.type))];
  return (
    <div className="cp-content">
      {playing && <MediaPlayer item={playing} onClose={()=>setPlaying(null)}/>}
      <div className="sh-row"><div className="sh">Mis archivos</div></div>
      {types.length>0 && <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        <button onClick={()=>setFilter("all")} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${filter==="all"?"var(--ink)":"var(--paper3)"}`,background:filter==="all"?"var(--ink)":"var(--paper)",cursor:"pointer",fontSize:12,fontWeight:600,color:filter==="all"?"#fff":"var(--ink3)"}}>Todos</button>
        {types.map(t=><button key={t} onClick={()=>setFilter(t)} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${filter===t?FILE_COLORS[t]:"var(--paper3)"}`,background:filter===t?`${FILE_COLORS[t]}15`:"var(--paper)",cursor:"pointer",fontSize:12,fontWeight:600,color:filter===t?FILE_COLORS[t]:"var(--ink3)"}}>{FILE_ICONS[t]} {t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>}
      {filtered.length===0 && <div className="empty"><div className="empty-ic">📁</div>No hay archivos compartidos aún</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
        {filtered.map(item=>{
          const pr = db.projects.find(p=>p.id===item.projectId);
          return (
            <div key={item.id} className="card" style={{cursor:"pointer"}} onClick={()=>setPlaying(item)}>
              <div style={{height:110,background:`${FILE_COLORS[item.type]}15`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,position:"relative",overflow:"hidden"}}>
                {item.type==="image" ? <img src={item.url} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}}/> : <span style={{fontSize:44}}>{FILE_ICONS[item.type]}</span>}
                <div style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.5)",color:"#fff",borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:700}}>{item.ext.toUpperCase()}</div>
              </div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{item.name}</div>
              {pr && <div style={{fontSize:11,color:"var(--ink3)",marginBottom:4}}>📁 {pr.name}</div>}
              {item.note && <div style={{fontSize:11,color:"var(--ink3)",fontStyle:"italic",marginBottom:8}}>"{item.note}"</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,color:"var(--ink4)"}}>{item.size} · {fmtD(item.date)}</span>
                <a href={item.url} download target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:11,color:"var(--ink3)",textDecoration:"none",padding:"3px 8px",border:"1px solid var(--paper3)",borderRadius:6}}>⬇ Descargar</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  LEGAL DOCS
// ════════════════════════════════════════════════════════════
const LEGAL_DOCS = {
  terms: `TÉRMINOS Y CONDICIONES DE USO — CLIENTHUB\n\nÚltima actualización: marzo 2026\n\n1. ACEPTACIÓN DE LOS TÉRMINOS\n\nAl acceder o usar Sympra ("el Servicio"), usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo, no podrá acceder al Servicio.\n\n2. DESCRIPCIÓN DEL SERVICIO\n\nSympra es una plataforma de gestión de proyectos, clientes y facturación diseñada para freelancers y profesionales independientes.\n\n3. CUENTAS DE USUARIO\n\n• Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.\n• Usted es responsable de todas las actividades que ocurran bajo su cuenta.\n• Debe notificarnos inmediatamente de cualquier uso no autorizado.\n• Debe tener al menos 18 años para usar este Servicio.\n\n4. USO ACEPTABLE\n\nUsted acepta NO usar Sympra para actividades ilegales, enviar spam, violar derechos de terceros, transmitir virus o interferir con el funcionamiento del Servicio.\n\n5. PROPIEDAD INTELECTUAL\n\nSympra y todo su contenido son propiedad exclusiva de Anthony Daniel Paulino Castillo y están protegidos por las leyes de derechos de autor de los Estados Unidos.\n\n6. FACTURACIÓN Y PAGOS\n\nLos precios están sujetos a cambios con previo aviso de 30 días. Los pagos no son reembolsables salvo política específica.\n\n7. LIMITACIÓN DE RESPONSABILIDAD\n\nEn ningún caso Anthony Daniel Paulino Castillo será responsable por daños indirectos o consecuentes que resulten del uso del Servicio.\n\n8. LEY APLICABLE\n\nEstos Términos se rigen por las leyes del Estado de Nueva York, Estados Unidos.\n\n9. CONTACTO\n\nAnthony Daniel Paulino Castillo · Sympra · Estados Unidos\nsupport@sympra.app`,

  privacy: `POLÍTICA DE PRIVACIDAD — CLIENTHUB\n\nÚltima actualización: marzo 2026\n\n1. INTRODUCCIÓN\n\nAnthony Daniel Paulino Castillo opera Sympra. Esta Política explica cómo recopilamos, usamos y protegemos su información personal.\n\n2. INFORMACIÓN QUE RECOPILAMOS\n\n• Nombre completo y correo electrónico\n• Información de su empresa o negocio\n• Datos de facturación y pagos\n• Contenido que sube al Servicio (proyectos, mensajes, archivos)\n• Dirección IP, tipo de navegador y datos de uso\n\n3. CÓMO USAMOS SU INFORMACIÓN\n\n• Proveer y mejorar el Servicio\n• Procesar pagos y transacciones\n• Enviar notificaciones del Servicio\n• Responder consultas y soporte\n• Cumplir obligaciones legales\n\n4. COMPARTIR INFORMACIÓN\n\nNo vendemos ni compartimos su información personal con terceros, excepto con su consentimiento, por obligación legal o con proveedores bajo acuerdos de confidencialidad.\n\n5. SEGURIDAD\n\nImplementamos encriptación SSL, acceso restringido y monitoreo continuo para proteger sus datos.\n\n6. SUS DERECHOS\n\nUsted tiene derecho a acceder, corregir, eliminar y exportar su información personal en cualquier momento.\n\n7. CONTACTO\n\nAnthony Daniel Paulino Castillo · Sympra · Estados Unidos\nprivacy@sympra.app`,

  copyright: `DERECHOS DE AUTOR — CLIENTHUB\n\n© 2026 Anthony Daniel Paulino Castillo. Todos los derechos reservados.\n\nAVISO DE DERECHOS DE AUTOR\n\nSympra, incluyendo su nombre, logotipo, diseño, código fuente, interfaces, contenido y documentación, son propiedad intelectual exclusiva de Anthony Daniel Paulino Castillo, protegida bajo las leyes de derechos de autor de los Estados Unidos (United States Copyright Act, 17 U.S.C.) y tratados internacionales.\n\nPROHIBICIONES\n\nQueda estrictamente prohibido sin autorización escrita previa:\n\n• Copiar, reproducir o duplicar cualquier parte del Servicio\n• Modificar, adaptar o crear obras derivadas\n• Distribuir, vender o sublicenciar el Servicio\n• Realizar ingeniería inversa del código fuente\n• Eliminar o alterar avisos de derechos de autor\n• Usar el nombre "Sympra" o sus logotipos sin autorización\n\nMARCAS COMERCIALES\n\n"Sympra" es marca comercial de Anthony Daniel Paulino Castillo en los Estados Unidos.\n\nCONTACTO POR INFRACCIONES\n\nAnthony Daniel Paulino Castillo · Sympra · Estados Unidos\nlegal@sympra.app\n\nVigente desde enero 2026.`
};

function LegalModal({ doc, onClose }) {
  const titles = { terms:"Términos y Condiciones", privacy:"Política de Privacidad", copyright:"Derechos de Autor © " };
  return (
    <div className="moverlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:600,maxHeight:"80vh",display:"flex",flexDirection:"column",padding:0,overflow:"hidden"}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid var(--paper3)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div className="modal-title" style={{margin:0}}>{titles[doc]}</div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"var(--paper2)",cursor:"pointer",fontSize:13,color:"var(--ink3)"}}>✕</button>
        </div>
        <div style={{padding:"20px 24px",overflowY:"auto",flex:1,fontSize:13,lineHeight:1.8,color:"var(--ink2)",whiteSpace:"pre-wrap",fontFamily:"'Geist',sans-serif"}}>
          {LEGAL_DOCS[doc]}
        </div>
        <div style={{padding:"14px 24px",borderTop:"1px solid var(--paper3)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontSize:11,color:"var(--ink3)"}}>© 2026 Anthony Daniel Paulino Castillo</div>
          <button className="btn btn-dark btn-sm" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function LegalFooter({ onOpen }) {
  return (
    <div style={{padding:"14px 24px",borderTop:"1px solid var(--paper3)",display:"flex",alignItems:"center",justifyContent:"center",gap:20,flexWrap:"wrap",background:"var(--paper)"}}>
      <span style={{fontSize:11,color:"var(--ink3)"}}>© 2026 Anthony Daniel Paulino Castillo</span>
      {[{k:"terms",l:"Términos de Uso"},{k:"privacy",l:"Privacidad"},{k:"copyright",l:"Derechos de Autor"}].map(item=>(
        <button key={item.k} onClick={()=>onOpen(item.k)} style={{background:"none",border:"none",fontSize:11,color:"var(--ink3)",cursor:"pointer",textDecoration:"underline",fontFamily:"'Geist',sans-serif",padding:0}}>{item.l}</button>
      ))}
    </div>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────
function SettingsPage({ db, onLogout, onOpenLegal }) {
  const [saved, setSaved] = useState(false);
  const [name, setName]   = useState(db.freelancer.name);
  const [title, setTitle] = useState(db.freelancer.title);
  const [goal, setGoal]   = useState(db.freelancer.monthlyGoal);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2500); };
  return (
    <div className="pg">
      <div className="sh-row"><div className="sh">Ajustes</div></div>
      <div style={{display:"flex",flexDirection:"column",gap:18,maxWidth:600}}>
        <div className="card">
          <div className="card-title" style={{marginBottom:18}}>👤 Perfil</div>
          <div className="mfield"><label className="mlbl">Nombre completo</label><input className="minp" value={name} onChange={e=>setName(e.target.value)}/></div>
          <div className="mfield"><label className="mlbl">Título profesional</label><input className="minp" value={title} onChange={e=>setTitle(e.target.value)}/></div>
          <div className="mfield"><label className="mlbl">Meta mensual ($)</label><input className="minp" type="number" value={goal} onChange={e=>setGoal(e.target.value)}/></div>
          <button className="btn btn-dark" onClick={save} style={{marginTop:8}}>{saved ? "✓ Guardado" : "Guardar cambios"}</button>
        </div>
        <div className="card">
          <div className="card-title" style={{marginBottom:18}}>🔐 Cuenta</div>
          <div style={{fontSize:13,color:"var(--ink3)",marginBottom:14}}>Correo: <strong style={{color:"var(--ink)"}}>{db.freelancer.email}</strong></div>
          <div style={{fontSize:13,color:"var(--ink3)",marginBottom:18}}>Plan: <strong style={{color:"var(--ink)"}}>Starter</strong> · <a href="https://buy.stripe.com/test_cNibJ34V7eos7Ll7NMgYU00" target="_blank" rel="noreferrer" style={{color:"var(--accent)",cursor:"pointer",fontWeight:600,textDecoration:"none"}}>Actualizar a Pro $19/mes →</a></div>
          <div style={{fontSize:13,color:"var(--ink3)",marginBottom:18}}>¿Más capacidad? · <a href="https://buy.stripe.com/test_dRm8wR5Zb5RWaXx2tsgYU01" target="_blank" rel="noreferrer" style={{color:"var(--ink3)",cursor:"pointer",fontWeight:600,textDecoration:"none"}}>Agency $49/mes →</a></div>
          <button className="btn btn-outline btn-sm" style={{color:"var(--red)",borderColor:"var(--red)"}} onClick={onLogout}>↩ Cerrar sesión</button>
        </div>
        <div className="card">
          <div className="card-title" style={{marginBottom:18}}>📄 Legal</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[{k:"terms",l:"Términos y Condiciones de Uso"},{k:"privacy",l:"Política de Privacidad"},{k:"copyright",l:"Derechos de Autor"}].map(item=>(
              <button key={item.k} className="btn btn-outline btn-sm" style={{justifyContent:"flex-start"}} onClick={()=>onOpenLegal(item.k)}>📋 {item.l}</button>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--ink3)",marginTop:14}}>© 2026 Anthony Daniel Paulino Castillo · Todos los derechos reservados</div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  FREELANCER VIEWS (condensed — same logic as v1)
// ════════════════════════════════════════════════════════════
function FOverview({ db, dispatch }) {
  const active = db.projects.filter(p => p.status === "active");
  const pendInv = db.invoices.filter(i => i.status !== "paid");
  const rev = db.revenue[db.revenue.length - 1].amount;
  const revPrev = db.revenue[db.revenue.length - 2].amount;
  const diff = ((rev - revPrev) / revPrev * 100).toFixed(0);
  const goalPct = Math.min((rev / DB.freelancer.monthlyGoal) * 100, 100).toFixed(0);
  const openTasks = db.tasks.filter(t => !t.done).length;
  const lateTasks = db.tasks.filter(t => !t.done && isOverdue(t.due)).length;
  const stats = [
    { lbl:"Ingresos este mes", val:fmt(rev), sub:`${diff>0?"+":""}${diff}% vs mes anterior`, pos:diff>0, bar:"#0f0e0c" },
    { lbl:"Proyectos activos", val:active.length, sub:`${db.projects.filter(p=>p.status==="planning").length} en planificación`, bar:"#6d28d9" },
    { lbl:"Por cobrar", val:fmt(pendInv.reduce((s,i)=>s+i.amount,0)), sub:`${pendInv.length} facturas pendientes`, bar:"#92400e" },
    { lbl:"Tareas abiertas", val:openTasks, sub:lateTasks>0?`${lateTasks} vencidas`:"Al día ✓", bar:lateTasks>0?"#b91c1c":"#15803d" },
  ];
  return (
    <div className="pg">
      <div className="stats">
        {stats.map((s,i) => (
          <div className={`scard fu d${i+1}`} key={i}>
            <div className="scard-bar" style={{background:s.bar}}/>
            <div className="scard-label">{s.lbl}</div>
            <div className="scard-val">{s.val}</div>
            <div className="scard-sub">{s.pos!==undefined?<><span className={s.pos?"up":"dn"}>{s.sub.split(" ")[0]}</span>{" "}{s.sub.split(" ").slice(1).join(" ")}</>:s.sub}</div>
          </div>
        ))}
      </div>
      <div className="two-col">
        <div className="card fu d2">
          <div className="card-hd"><div className="card-title">📈 Ingresos 6 meses</div></div>
          <div className="goal-row">
            <div className="goal-hd"><span className="goal-lbl">Meta mensual</span><span className="goal-val">{goalPct}% · {fmt(rev)} / {fmt(DB.freelancer.monthlyGoal)}</span></div>
            <div className="goal-track"><div className={`goal-fill${parseInt(goalPct)>=100?" hit":""}`} style={{width:`${goalPct}%`}}/></div>
          </div>
          <RevenueChart data={db.revenue} goal={DB.freelancer.monthlyGoal}/>
        </div>
        <div className="card fu d3">
          <div className="card-hd"><div className="card-title">✅ Tareas urgentes</div><span className="card-link" onClick={()=>dispatch({type:"view",v:"tasks"})}>Ver todas →</span></div>
          {db.tasks.filter(t=>!t.done).slice(0,5).map(t=>{
            const late=isOverdue(t.due);
            return (<div className="trow" key={t.id}><div className={`tchk${t.done?" on":""}`} onClick={()=>dispatch({type:"toggleTask",id:t.id})}>✓</div><div style={{flex:1}}><div className={`ttxt${t.done?" done":""}`}>{t.text}</div><div className={`tdue${late?" late":""}`}>{late?"⚠ ":""}{fmtD(t.due)}</div></div><div className={`pdot-sm p${t.priority[0]}`}/></div>);
          })}
          {db.tasks.filter(t=>!t.done).length===0&&<div className="empty"><div className="empty-ic">🎉</div>Sin tareas</div>}
        </div>
      </div>
      <div className="two-col">
        <div className="card fu d2">
          <div className="card-hd"><div className="card-title">🚀 Proyectos activos</div><span className="card-link" onClick={()=>dispatch({type:"view",v:"projects"})}>Ver todos →</span></div>
          {active.map(p=>{const cl=db.clients.find(c=>c.id===p.clientId);return(<div className="prow" key={p.id} onClick={()=>dispatch({type:"viewProject",id:p.id})}><div className="pdot" style={{background:p.color}}/><div className="pinfo"><div className="pname">{p.name}</div><div className="psub">{cl?.company}</div></div><div className="pmbar"><div className="pmfill" style={{width:`${p.progress}%`,background:p.color}}/></div><div className="ppct">{p.progress}%</div></div>);})}
        </div>
        <div className="card fu d3">
          <div className="card-hd"><div className="card-title">💳 Facturas recientes</div><span className="card-link" onClick={()=>dispatch({type:"view",v:"invoices"})}>Ver todas →</span></div>
          {db.invoices.slice(0,4).map(inv=>{const cl=db.clients.find(c=>c.id===inv.clientId);return(<div className="irow" key={inv.id}><div className="inum">{inv.number}</div><div className="iname">{cl?.name}</div><div className="iamt">{fmt(inv.amount)}</div><span className={`ibadge ib-${inv.status}`}>{inv.status==="paid"?"✓ Pagado":inv.status==="pending"?"Pendiente":"⚠ Vencido"}</span></div>);})}
        </div>
      </div>
    </div>
  );
}
function FProjects({db,dispatch}){const[tab,setTab]=useState("all");const list=tab==="all"?db.projects:db.projects.filter(p=>p.status===tab);return(<div className="pg"><div className="sh-row"><div className="sh">Proyectos</div><button className="btn btn-dark btn-sm" onClick={()=>dispatch({type:"modal",m:"project"})}>+ Nuevo</button></div><div className="ptabs">{[{k:"all",l:"Todos"},{k:"active",l:"Activos"},{k:"planning",l:"Planificación"},{k:"completed",l:"Completados"}].map(t=><button key={t.k} className={`ptab${tab===t.k?" on":""}`} onClick={()=>setTab(t.k)}>{t.l}</button>)}</div><div className="card">{list.length===0&&<div className="empty"><div className="empty-ic">📂</div>Sin proyectos</div>}{list.map(p=>{const cl=db.clients.find(c=>c.id===p.clientId);return(<div key={p.id} style={{padding:"16px 0",borderBottom:"1px solid var(--paper2)",display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"center",cursor:"pointer"}} onClick={()=>dispatch({type:"viewProject",id:p.id})}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:11,height:11,borderRadius:"50%",background:p.color,flexShrink:0}}/><div><div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{p.name}</div><div style={{fontSize:12,color:"var(--ink3)",display:"flex",alignItems:"center",gap:8}}>{cl?.company}·{p.phase}<span className={`tag tag-${p.status}`}>{p.status==="active"?"Activo":p.status==="planning"?"Planificación":"Completado"}</span></div><div style={{marginTop:9,display:"flex",alignItems:"center",gap:9}}><div style={{width:160,height:5,background:"var(--paper2)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:p.color,width:`${p.progress}%`}}/></div><span style={{fontSize:12,color:"var(--ink3)",fontWeight:600}}>{p.progress}%</span></div></div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:18,fontWeight:800}}>{fmt(p.paid)}</div><div style={{fontSize:11,color:"var(--ink3)"}}>de {fmt(p.budget)}</div>{p.budget-p.paid>0&&<div style={{fontSize:11,color:"var(--amber)",fontWeight:600,marginTop:2}}>{fmt(p.budget-p.paid)} pendiente</div>}</div></div>);})}</div></div>);}
function FProjectDetail({db,projectId,dispatch}){const p=db.projects.find(x=>x.id===projectId);if(!p)return null;const cl=db.clients.find(c=>c.id===p.clientId);const dels=db.deliverables.filter(d=>d.projectId===projectId);const tasks=db.tasks.filter(t=>t.projectId===projectId);return(<div className="pg fu"><button className="btn btn-outline btn-sm" style={{marginBottom:18}} onClick={()=>dispatch({type:"view",v:"projects"})}>← Volver</button><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:6,flexWrap:"wrap"}}><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:26,fontWeight:800,letterSpacing:"-.7px"}}>{p.name}</div><span className={`tag tag-${p.status}`}>{p.status==="active"?"Activo":p.status==="planning"?"Planificación":"Completado"}</span></div><div style={{fontSize:13,color:"var(--ink3)",marginBottom:14}}>{cl?.company}·Entrega {fmtD(p.dueDate)}</div><div className="big-prog" style={{marginBottom:22}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:12,color:"var(--ink3)"}}>{p.phase}</span><span style={{fontSize:12,fontWeight:700}}>{p.progress}%</span></div><div className="big-prog-bar"><div className="big-prog-fill" style={{width:`${p.progress}%`,background:p.color}}/></div></div><div className="det-grid"><div style={{display:"flex",flexDirection:"column",gap:16}}><div className="card"><div className="card-hd"><div className="card-title">📦 Entregables</div><button className="btn btn-dark btn-xs" onClick={()=>dispatch({type:"modal",m:"deliverable",extra:{projectId}})}>+ Añadir</button></div>{dels.length===0&&<div className="empty"><div className="empty-ic">📭</div>Sin entregables</div>}{dels.map(d=>(<div className="drow" key={d.id}><div className={`ddot ddot-${d.status}`}/><div style={{flex:1}}><div className="dname">{d.name}</div><div className="ddate">{fmtD(d.date)}</div></div><span className={`tag del-${d.status}`}>{d.status==="approved"?"Aprobado":d.status==="review"?"En revisión":"Pendiente"}</span>{d.status==="review"&&<button className="btn btn-xs" style={{background:"var(--green-l)",color:"var(--green)",border:"none",marginLeft:6}} onClick={()=>dispatch({type:"approveDeliverable",id:d.id})}>✓ Aprobar</button>}</div>))}</div><div className="card"><div className="card-hd"><div className="card-title">✅ Tareas</div></div>{tasks.map(t=>(<div className="trow" key={t.id}><div className={`tchk${t.done?" on":""}`} onClick={()=>dispatch({type:"toggleTask",id:t.id})}>✓</div><div style={{flex:1}}><div className={`ttxt${t.done?" done":""}`}>{t.text}</div><div className={`tdue${isOverdue(t.due)&&!t.done?" late":""}`}>{fmtD(t.due)}</div></div><div className={`pdot-sm p${t.priority[0]}`}/></div>))}</div></div><div style={{display:"flex",flexDirection:"column",gap:16}}><div className="card"><div className="card-hd"><div className="card-title">👤 Cliente</div></div><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><Avatar initials={cl?.avatar} color={cl?.color} size="lg"/><div><div style={{fontWeight:700,fontSize:14}}>{cl?.name}</div><div style={{fontSize:12,color:"var(--ink3)"}}>{cl?.company}</div></div></div><button className="btn btn-outline" style={{width:"100%",justifyContent:"center"}} onClick={()=>dispatch({type:"openChat",clientId:cl?.id})}>💬 Enviar mensaje</button></div><div className="card"><div className="card-hd"><div className="card-title">💰 Financiero</div></div>{[{l:"Presupuesto",v:fmt(p.budget),cls:""},{l:"Cobrado",v:fmt(p.paid),cls:"g"},{l:"Pendiente",v:fmt(p.budget-p.paid),cls:p.budget-p.paid>0?"a":""}].map((r,i)=>(<div className="fin-row" key={i}><span className="fin-lbl">{r.l}</span><span className={`fin-val ${r.cls}`}>{r.v}</span></div>))}</div></div></div></div>);}
function FClients({db,dispatch}){return(<div className="pg"><div className="sh-row"><div className="sh">Clientes</div><button className="btn btn-dark btn-sm" onClick={()=>dispatch({type:"modal",m:"client"})}>+ Nuevo</button></div><div className="card">{db.clients.map(c=>{const ap=db.projects.filter(p=>p.clientId===c.id&&p.status==="active").length;return(<div className="crow" key={c.id}><Avatar initials={c.avatar} color={c.color} size="lg"/><div><div className="cname">{c.name}</div><div className="cco">{c.company}·{ap} activo{ap!==1?"s":""}</div></div><div className="cright"><div className="cbilled">{fmt(c.totalBilled)}</div><div className={`cstat ${c.status==="active"?"ca":"ci"}`}>{c.status==="active"?"● Activo":"○ Inactivo"}</div></div></div>);})}</div></div>);}
function FInvoices({db,dispatch}){const[tab,setTab]=useState("all");const list=tab==="all"?db.invoices:db.invoices.filter(i=>i.status===tab);const paid=db.invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);const pend=db.invoices.filter(i=>i.status==="pending").reduce((s,i)=>s+i.amount,0);const over=db.invoices.filter(i=>i.status==="overdue").reduce((s,i)=>s+i.amount,0);return(<div className="pg"><div className="sh-row"><div className="sh">Facturación</div><button className="btn btn-dark btn-sm" onClick={()=>dispatch({type:"modal",m:"invoice"})}>+ Nueva</button></div><div className="stats" style={{marginBottom:18}}>{[{lbl:"Cobrado",val:fmt(paid),bar:"#15803d"},{lbl:"Por cobrar",val:fmt(pend),bar:"#1d4ed8"},{lbl:"Vencido",val:fmt(over),bar:"#b91c1c"},{lbl:"Total",val:fmt(paid+pend+over),bar:"#0f0e0c"}].map((s,i)=>(<div className="scard fu" key={i}><div className="scard-bar" style={{background:s.bar}}/><div className="scard-label">{s.lbl}</div><div className="scard-val" style={{fontSize:22}}>{s.val}</div></div>))}</div><div className="ptabs">{[{k:"all",l:"Todas"},{k:"pending",l:"Pendientes"},{k:"overdue",l:"Vencidas"},{k:"paid",l:"Pagadas"}].map(t=><button key={t.k} className={`ptab${tab===t.k?" on":""}`} onClick={()=>setTab(t.k)}>{t.l}</button>)}</div><div className="card">{list.length===0&&<div className="empty"><div className="empty-ic">🧾</div>Sin facturas</div>}{list.map(inv=>{const cl=db.clients.find(c=>c.id===inv.clientId);return(<div className="irow" key={inv.id}><div className="inum">{inv.number}</div><div style={{flex:1,minWidth:0}}><div className="iname" style={{color:"var(--ink)",fontWeight:600}}>{cl?.name}</div><div style={{fontSize:11,color:"var(--ink4)"}}>Vence {fmtD(inv.due)}</div></div><div className="iamt">{fmt(inv.amount)}</div><span className={`ibadge ib-${inv.status}`}>{inv.status==="paid"?"✓ Pagado":inv.status==="pending"?"Pendiente":"⚠ Vencido"}</span>{inv.status!=="paid"&&<button className="btn btn-xs btn-outline" onClick={()=>dispatch({type:"markPaid",id:inv.id})}>Marcar pagado</button>}</div>);})}</div></div>);}
function FTasks({db,dispatch}){const[tab,setTab]=useState("open");const open=db.tasks.filter(t=>!t.done);const done=db.tasks.filter(t=>t.done);const list=tab==="open"?open:done;return(<div className="pg"><div className="sh-row"><div className="sh">Tareas</div><button className="btn btn-dark btn-sm" onClick={()=>dispatch({type:"modal",m:"task"})}>+ Nueva</button></div><div className="ptabs"><button className={`ptab${tab==="open"?" on":""}`} onClick={()=>setTab("open")}>Pendientes ({open.length})</button><button className={`ptab${tab==="done"?" on":""}`} onClick={()=>setTab("done")}>Completadas ({done.length})</button></div><div className="card">{list.length===0&&<div className="empty"><div className="empty-ic">🎉</div>{tab==="open"?"¡Sin pendientes!":"Sin completadas"}</div>}{list.map(t=>{const pr=db.projects.find(p=>p.id===t.projectId);const late=!t.done&&isOverdue(t.due);return(<div className="trow" key={t.id}><div className={`tchk${t.done?" on":""}`} onClick={()=>dispatch({type:"toggleTask",id:t.id})}>✓</div><div style={{flex:1}}><div className={`ttxt${t.done?" done":""}`}>{t.text}</div><div style={{display:"flex",gap:8,marginTop:2}}><div className={`tdue${late?" late":""}`}>{late?"⚠ ":""}{fmtD(t.due)}</div>{pr&&<div style={{fontSize:11,color:"var(--ink4)"}}>·{pr.name}</div>}</div></div><div className={`pdot-sm p${t.priority[0]}`}/></div>);})}</div></div>);}
function FMessages({db,dispatch,activeChatId}){const[text,setText]=useState("");const[chatId,setChatId]=useState(activeChatId||db.clients[0]?.id);const msgs=db.messages.filter(m=>m.clientId===chatId);const cl=db.clients.find(c=>c.id===chatId);const send=()=>{if(!text.trim())return;dispatch({type:"sendMsg",clientId:chatId,from:"freelancer",text:text.trim()});setText("");};return(<div className="pg" style={{height:"calc(100vh - 70px)",display:"flex",flexDirection:"column"}}><div className="sh-row" style={{marginBottom:12}}><div className="sh">Mensajes</div></div><div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:16,flex:1,minHeight:0}}><div className="card" style={{padding:"12px 10px",overflow:"auto"}}>{db.clients.map(c=>(<div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:9,cursor:"pointer",background:chatId===c.id?"var(--paper2)":"transparent",marginBottom:2}} onClick={()=>setChatId(c.id)}><Avatar initials={c.avatar} color={c.color} size="sm"/><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:chatId===c.id?700:500,color:"var(--ink)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div><div style={{fontSize:11,color:"var(--ink3)"}}>{c.company}</div></div></div>))}</div><div className="card" style={{display:"flex",flexDirection:"column",minHeight:0}}><div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:14,borderBottom:"1px solid var(--paper2)",marginBottom:12}}><Avatar initials={cl?.avatar} color={cl?.color} size="md"/><div><div style={{fontWeight:700,fontSize:14}}>{cl?.name}</div><div style={{fontSize:12,color:"var(--ink3)"}}>{cl?.company}</div></div></div><div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,minHeight:0}}>{msgs.length===0&&<div className="empty"><div className="empty-ic">💬</div>Inicia la conversación</div>}{msgs.map(m=>(<div key={m.id} style={{maxWidth:"70%",alignSelf:m.from==="freelancer"?"flex-end":"flex-start"}}><div className={`msg-bubble ${m.from==="freelancer"?"msg-from-me":"msg-from-other"}`}>{m.text}<div className="msg-time">{fmtT(m.date)}</div></div></div>))}</div><div style={{display:"flex",gap:9,paddingTop:12,borderTop:"1px solid var(--paper3)"}}><input className="msg-inp" placeholder="Escribe un mensaje..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="btn btn-dark btn-sm" onClick={send}>Enviar →</button></div></div></div></div>);}

// ════════════════════════════════════════════════════════════
//  CLIENT PORTAL (same as v1 — condensed)
// ════════════════════════════════════════════════════════════
function ClientPortal({ client, db, dispatch, onLogout, lang, setLang }) {
  const [view, setView] = useState("dashboard");
  const [selProj, setSelProj] = useState(null);
  const [chatText, setChatText] = useState("");
  const T = { es: { projects:"Proyectos",messages:"Mensajes",invoices:"Facturas",dashboard:"Resumen",logout:"Salir",progress:"Progreso",phase:"Fase",due:"Entrega",budget:"Presupuesto",paid:"Pagado",pending:"Pendiente",deliverables:"Entregables",yourPro:"Tu profesional",approved:"Aprobado",review:"En revisión",pendingDel:"Pendiente",approve:"Aprobar",sendMsg:"Enviar mensaje",back:"← Volver"}, en:{projects:"Projects",messages:"Messages",invoices:"Invoices",dashboard:"Overview",logout:"Sign out",progress:"Progress",phase:"Phase",due:"Due date",budget:"Budget",paid:"Paid",pending:"Pending",deliverables:"Deliverables",yourPro:"Your professional",approved:"Approved",review:"In review",pendingDel:"Pending",approve:"Approve",sendMsg:"Send message",back:"← Back"}};
  const t = T[lang];
  const clientProjects = db.projects.filter(p => p.clientId === client.id);
  const msgs = db.messages.filter(m => m.clientId === client.id);
  const sendMsg = () => { if(!chatText.trim())return; dispatch({type:"sendMsg",clientId:client.id,from:"client",text:chatText.trim()}); setChatText(""); };
  const navItems = [{k:"dashboard",ic:"⊞",l:t.dashboard},{k:"media",ic:"🎬",l:lang==="es"?"Mis archivos":"My files"},{k:"messages",ic:"💬",l:t.messages},{k:"invoices",ic:"📄",l:t.invoices}];
  return (
    <div className="cp-shell">
      <div className="cp-side">
        <div className="side-logo">Sym<em style={{color:"#86efac",fontStyle:"normal"}}>pra</em></div>
        <div className="side-pill">Portal de Cliente</div>
        {navItems.map(n=>(<div key={n.k} className={`ni${view===n.k||(view==="project"&&n.k==="dashboard")?" on":""}`} onClick={()=>{setView(n.k);setSelProj(null);}}><span className="ni-ic">{n.ic}</span>{n.l}</div>))}
        <div className="side-bot">
          <div style={{display:"flex",gap:4,marginBottom:8}}>{["es","en"].map(l=><button key={l} className={`logout-b${lang===l?" on":""}`} style={lang===l?{background:"rgba(255,255,255,.12)",color:"#fff"}:{}} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
          <div className="side-user"><Avatar initials={client.avatar} color={client.color} size="md"/><div><div className="side-uname">{client.name}</div><div className="side-uemail">{client.company}</div></div></div>
          <button className="logout-b" onClick={onLogout}>↩ {t.logout}</button>
        </div>
      </div>
      <div className="cp-main">
        <div className="cp-topbar">
          <div><div className="topbar-title">{view==="project"&&selProj?selProj.name:`Hola, ${client.name.split(" ")[0]}`}</div><div className="topbar-sub">{client.company}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{display:"flex",alignItems:"center",gap:7,background:"var(--paper2)",border:"1px solid var(--paper3)",borderRadius:40,padding:"5px 12px 5px 6px",fontSize:12,color:"var(--ink3)"}}><Avatar initials={DB.freelancer.avatar} size="sm" fr/><strong style={{color:"var(--ink)"}}>{DB.freelancer.name}</strong></div></div>
        </div>
        {view==="dashboard"&&!selProj&&(<div className="cp-content"><div className="stats" style={{gridTemplateColumns:"repeat(3,1fr)"}}>{[{lbl:lang==="es"?"Proyectos activos":"Active projects",val:clientProjects.filter(p=>p.status==="active").length,bar:"#6d28d9"},{lbl:lang==="es"?"Por aprobar":"Pending approval",val:db.deliverables.filter(d=>clientProjects.find(p=>p.id===d.projectId)&&d.status==="review").length,bar:"#92400e"},{lbl:lang==="es"?"Total invertido":"Total invested",val:fmt(clientProjects.reduce((s,p)=>s+p.paid,0)),bar:"#0f0e0c"}].map((s,i)=>(<div className={`scard fu d${i+1}`} key={i}><div className="scard-bar" style={{background:s.bar}}/><div className="scard-label">{s.lbl}</div><div className="scard-val" style={{fontSize:28}}>{s.val}</div></div>))}</div><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:17,fontWeight:800,letterSpacing:"-.3px",marginBottom:16}}>{t.projects}</div><div style={{display:"flex",flexDirection:"column",gap:12}}>{clientProjects.map(p=>(<div key={p.id} className="card" style={{cursor:"pointer",position:"relative",overflow:"hidden"}} onClick={()=>{setSelProj(p);setView("project");}}><div style={{position:"absolute",top:0,left:0,right:0,height:3,background:p.color,borderRadius:"14px 14px 0 0"}}/><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:15}}>{p.name}</div><span className={`tag tag-${p.status}`}>{p.status==="active"?(lang==="es"?"Activo":"Active"):p.status==="planning"?(lang==="es"?"Planificación":"Planning"):(lang==="es"?"Completado":"Completed")}</span></div><div style={{display:"flex",gap:20,marginBottom:12,fontSize:12,color:"var(--ink3)"}}><span><strong style={{color:"var(--ink)"}}>{t.phase}:</strong>{p.phase}</span><span><strong style={{color:"var(--ink)"}}>{t.due}:</strong>{fmtD(p.dueDate)}</span><span><strong style={{color:"var(--ink)"}}>{t.paid}:</strong>{fmt(p.paid)}/{fmt(p.budget)}</span></div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1,height:6,background:"var(--paper2)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:p.color,width:`${p.progress}%`}}/></div><span style={{fontSize:13,fontWeight:700}}>{p.progress}%</span></div></div>))}</div></div>)}
        {view==="project"&&selProj&&(()=>{const dels=db.deliverables.filter(d=>d.projectId===selProj.id);return(<div className="cp-content fu"><button className="btn btn-outline btn-sm" style={{marginBottom:18}} onClick={()=>{setView("dashboard");setSelProj(null);}}>{t.back}</button><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:24,fontWeight:800,letterSpacing:"-.7px",marginBottom:4}}>{selProj.name}</div><div className="big-prog" style={{marginBottom:22}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:12,color:"var(--ink3)"}}>{selProj.phase}</span><span style={{fontSize:12,fontWeight:700}}>{selProj.progress}%</span></div><div className="big-prog-bar"><div className="big-prog-fill" style={{width:`${selProj.progress}%`,background:selProj.color}}/></div></div><div className="det-grid"><div className="card"><div className="card-hd"><div className="card-title">📦{t.deliverables}</div></div>{dels.map(d=>(<div className="drow" key={d.id}><div className={`ddot ddot-${d.status}`}/><div style={{flex:1}}><div className="dname">{d.name}</div><div className="ddate">{fmtD(d.date)}</div></div><span className={`tag del-${d.status}`}>{d.status==="approved"?t.approved:d.status==="review"?t.review:t.pendingDel}</span>{d.status==="review"&&<button className="btn btn-xs" style={{background:"var(--green-l)",color:"var(--green)",border:"none",marginLeft:6}} onClick={()=>dispatch({type:"approveDeliverable",id:d.id})}>{t.approve}</button>}</div>))}</div><div style={{display:"flex",flexDirection:"column",gap:14}}><div className="card"><div className="card-hd"><div className="card-title">👤{t.yourPro}</div></div><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><Avatar initials={DB.freelancer.avatar} size="lg" fr/><div><div style={{fontWeight:700,fontSize:14}}>{DB.freelancer.name}</div><div style={{fontSize:12,color:"var(--ink3)"}}>{DB.freelancer.title}</div></div></div><button className="btn btn-outline" style={{width:"100%",justifyContent:"center"}} onClick={()=>setView("messages")}>💬{t.sendMsg}</button></div><div className="card"><div className="card-hd"><div className="card-title">💰{lang==="es"?"Financiero":"Financials"}</div></div>{[{l:t.budget,v:fmt(selProj.budget),cls:""},{l:t.paid,v:fmt(selProj.paid),cls:"g"},{l:t.pending,v:fmt(selProj.budget-selProj.paid),cls:selProj.budget-selProj.paid>0?"a":""}].map((r,i)=>(<div className="fin-row" key={i}><span className="fin-lbl">{r.l}</span><span className={`fin-val ${r.cls}`}>{r.v}</span></div>))}</div></div></div></div>);})()} 
        {view==="messages"&&(<div className="cp-content" style={{height:"calc(100vh - 70px)",display:"flex",flexDirection:"column"}}><div className="sh-row" style={{marginBottom:10}}><div className="sh">{t.messages}</div></div><div className="card" style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}><div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,minHeight:0,paddingBottom:8}}>{msgs.length===0&&<div className="empty"><div className="empty-ic">💬</div>{lang==="es"?"Sin mensajes aún":"No messages yet"}</div>}{msgs.map(m=>(<div key={m.id} style={{maxWidth:"70%",alignSelf:m.from==="client"?"flex-end":"flex-start"}}><div className={`msg-bubble ${m.from==="client"?"msg-from-me":"msg-from-other"}`}>{m.text}<div className="msg-time">{fmtT(m.date)}</div></div></div>))}</div><div style={{display:"flex",gap:9,paddingTop:12,borderTop:"1px solid var(--paper3)"}}><input className="msg-inp" placeholder={lang==="es"?"Escribe un mensaje...":"Type a message..."} value={chatText} onChange={e=>setChatText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/><button className="btn btn-dark btn-sm" onClick={sendMsg}>{lang==="es"?"Enviar →":"Send →"}</button></div></div></div>)}
        {view==="media"&&<ClientMedia clientId={client.id} db={db} dispatch={dispatch}/>}
        {view==="invoices"&&(<div className="cp-content"><div className="sh-row"><div className="sh">{t.invoices}</div></div><div className="card">{db.invoices.filter(i=>i.clientId===client.id).map(inv=>(<div className="irow" key={inv.id}><div className="inum">{inv.number}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{db.projects.find(p=>p.id===inv.projectId)?.name}</div><div style={{fontSize:11,color:"var(--ink4)"}}>Vence {fmtD(inv.due)}</div></div><div className="iamt">{fmt(inv.amount)}</div><span className={`ibadge ib-${inv.status}`}>{inv.status==="paid"?"✓ Pagado":inv.status==="pending"?"Pendiente":"⚠ Vencido"}</span></div>))}</div></div>)}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  LOGIN
// ════════════════════════════════════════════════════════════
function Login({ onLogin, lang, setLang }) {
  const [mode, setMode]         = useState("login"); // "login" | "register"
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [name, setName]         = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(false);

  const TL = {
    es:{ welcome:"Bienvenido a tu", portal:"Portal", sub:"El hub de trabajo entre freelancers y sus clientes.", emailL:"Correo electrónico", passL:"Contraseña", nameL:"Tu nombre completo", enter:"Ingresar", register:"Crear cuenta", loading:"Verificando...", registering:"Creando cuenta...", err:"Credenciales incorrectas", errReg:"Error al crear la cuenta", demo:"Cuentas demo", use:"Usar →", noAcc:"¿No tienes cuenta?", hasAcc:"¿Ya tienes cuenta?", signUp:"Regístrate gratis", signIn:"Inicia sesión" },
    en:{ welcome:"Welcome to your", portal:"Portal", sub:"The workspace hub for freelancers and their clients.", emailL:"Email address", passL:"Password", nameL:"Your full name", enter:"Sign in", register:"Create account", loading:"Verifying...", registering:"Creating account...", err:"Incorrect credentials", errReg:"Error creating account", demo:"Demo accounts", use:"Use →", noAcc:"Don't have an account?", hasAcc:"Already have an account?", signUp:"Sign up free", signIn:"Sign in" }
  };
  const t = TL[lang];
  const demos = [{label:"Freelancer",email:"carlos@sympra.app",pass:"admin"},{label:"Ana (cliente)",email:"ana@empresa.com",pass:"1234"},{label:"John (cliente)",email:"john@company.com",pass:"5678"},{label:"Lucía (cliente)",email:"lucia@bloom.co",pass:"9999"}];

  const doLogin = async () => {
    if(!email||!pass) return;
    setLoading(true); setErr("");
    // Check admin FIRST before API call
    if(email==="universalmiusic@gmail.com"&&pass==="Sympra2026!"){onLogin("admin",null);return;}
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password: pass })
      });
      const data = await res.json();
      if (res.ok) { onLogin(data.role, data.user); }
      else { setErr(data.error || t.err); setLoading(false); }
    } catch(e) {
      if(email===DB.freelancer.email&&pass===DB.freelancer.password){onLogin("freelancer",null);return;}
      const cl=DB.clients.find(c=>c.email===email.toLowerCase()&&c.password===pass);
      if(cl){onLogin("client",cl);return;}
      setErr(t.err); setLoading(false);
    }
  };

  const doRegister = async () => {
    if(!name||!email||!pass) return;
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.toLowerCase(), password: pass })
      });
      const data = await res.json();
      if (res.ok) { onLogin(data.role, data.user); }
      else { setErr(data.error || t.errReg); setLoading(false); }
    } catch(e) {
      setErr(t.errReg); setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-art"><div className="art-grid"/><div className="art-orb o1"/><div className="art-orb o2"/><div className="art-inner"><div className="art-logo">Sym<em>pra</em></div><div className="art-sub">{t.sub}</div><div className="art-cards">{[{ic:"🎨",col:"#7c3aed",l:"Rediseño Web",s:lang==="es"?"65% completado":"65% done"},{ic:"⚡",col:"#0ea5e9",l:"SaaS MVP",s:lang==="es"?"En desarrollo":"In progress"},{ic:"✅",col:"#10b981",l:"Branding",s:lang==="es"?"Entregado":"Delivered"}].map((c,i)=>(<div className="acard" key={i}><div className="acard-ic" style={{background:`${c.col}22`}}>{c.ic}</div><div className="acard-txt"><strong>{c.l}</strong>{c.s}</div></div>))}</div></div></div>
      <div className="login-side"><div className="login-inner">
        <div className="lang-row">{["es","en"].map(l=><button key={l} className={`lbtn${lang===l?" on":""}`} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
        <div className="login-eyebrow">{mode==="login"?t.welcome:"Sympra"}</div>
        <div className="login-h">{mode==="login"?t.portal:t.register}</div>
        <div className="login-desc">{t.sub}</div>
        {mode==="register" && <div className="fgroup"><label className="flbl">{t.nameL}</label><input className="finp" type="text" placeholder="Anthony Paulino" value={name} onChange={e=>{setName(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&doRegister()}/></div>}
        <div className="fgroup"><label className="flbl">{t.emailL}</label><input className="finp" type="email" placeholder="tu@email.com" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key===(mode==="login"?"Enter":"")&&doLogin()}/></div>
        <div className="fgroup"><label className="flbl">{t.passL}</label><input className="finp" type="password" placeholder="••••••••" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?doLogin():doRegister())}/></div>
        <button className="btn btn-dark" style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:15}} onClick={mode==="login"?doLogin:doRegister} disabled={loading||!email||!pass||(mode==="register"&&!name)}>
          {loading?(mode==="login"?t.loading:t.registering):(mode==="login"?t.enter:t.register)}
        </button>
        {err&&<div className="lerror">{err}</div>}
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"var(--ink3)"}}>
          {mode==="login"?t.noAcc:t.hasAcc}{" "}
          <span style={{color:"var(--accent)",fontWeight:700,cursor:"pointer"}} onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}}>
            {mode==="login"?t.signUp:t.signIn}
          </span>
        </div>
        {mode==="login" && <div className="demo-box"><div className="demo-ttl">{t.demo}</div>{demos.map(d=>(<div className="demo-row" key={d.email} onClick={()=>{setEmail(d.email);setPass(d.pass);setErr("");}}><span className="demo-em">{d.label}·{d.email}/{d.pass}</span><span className="demo-use">{t.use}</span></div>))}</div>}
      </div></div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  FREELANCER SHELL
// ════════════════════════════════════════════════════════════
function FreelancerShell({ db, dispatch, onLogout }) {
  const [view, setView]         = useState("overview");
  const [projId, setProjId]     = useState(null);
  const [chatId, setChatId]     = useState(null);
  const [legalDoc, setLegalDoc] = useState(null);

  const unreadNotifs = db.notifications.filter(n => !n.read).length;

  const doDispatch = (action) => {
    if (action.type === "viewProject") { setProjId(action.id); setView("projectDetail"); return; }
    if (action.type === "view")        { setView(action.v); setProjId(null); return; }
    if (action.type === "openChat")    { setChatId(action.clientId); setView("messages"); return; }
    dispatch(action);
  };

  const navItems = [
    { k:"overview",     ic:"⊞", l:"Resumen" },
    { k:"projects",     ic:"🚀", l:"Proyectos",   badge: db.projects.filter(p=>p.status==="active").length },
    { k:"clients",      ic:"👥", l:"Clientes" },
    { k:"invoices",     ic:"💳", l:"Facturación", badge: db.invoices.filter(i=>i.status!=="paid").length },
    { k:"tasks",        ic:"✅", l:"Tareas",       badge: db.tasks.filter(t=>!t.done&&isOverdue(t.due)).length },
    { k:"messages",     ic:"💬", l:"Mensajes" },
    { k:"notifications",ic:"🔔", l:"Notificaciones", badge: unreadNotifs },
    { k:"media",        ic:"🎬", l:"Multimedia" },
  ];

  const titles = { overview:"Resumen", projects:"Proyectos", clients:"Clientes", invoices:"Facturación", tasks:"Tareas", messages:"Mensajes", projectDetail:"Detalle del proyecto", notifications:"Notificaciones", media:"Multimedia", settings:"Ajustes" };

  return (
    <div className="shell">
      {legalDoc && <LegalModal doc={legalDoc} onClose={()=>setLegalDoc(null)}/>}
      <div className="side">
        <div className="side-logo">Sym<em style={{color:"#86efac",fontStyle:"normal"}}>pra</em></div>
        <div className="side-pill">✦ Freelancer Pro</div>
        <div className="nav-sep">Principal</div>
        {navItems.map(n => (
          <div key={n.k} className={`ni ${(view===n.k||(view==="projectDetail"&&n.k==="projects"))?"on":""}`}
            onClick={() => { setView(n.k); setProjId(null); }}>
            <span className="ni-ic">{n.ic}</span>{n.l}
            {n.badge > 0 && <span className="ni-badge">{n.badge > 9 ? "9+" : n.badge}</span>}
          </div>
        ))}
        <div className="nav-sep">Config</div>
        <div className={`ni${view==="settings"?" on":""}`} onClick={()=>setView("settings")}><span className="ni-ic">⚙</span>Ajustes</div>
        <div className="side-bot">
          <div className="side-user">
            <Avatar initials={(db.freelancer.name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)} size="md" fr />
            <div><div className="side-uname">{db.freelancer.name}</div><div className="side-uemail">{db.freelancer.email}</div></div>
          </div>
          <button className="logout-b" onClick={onLogout}>↩ Cerrar sesión</button>
        </div>
      </div>
      <div className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">{titles[view]||"Sympra"}</div>
            <div className="topbar-sub">{new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}</div>
          </div>
          <div className="topbar-r">
            {view==="projects"   && <button className="btn btn-dark btn-sm" onClick={()=>dispatch({type:"modal",m:"project"})}>+ Nuevo proyecto</button>}
            {view==="clients"    && <button className="btn btn-dark btn-sm" onClick={()=>dispatch({type:"modal",m:"client"})}>+ Nuevo cliente</button>}
            {view==="invoices"   && <button className="btn btn-dark btn-sm" onClick={()=>dispatch({type:"modal",m:"invoice"})}>+ Nueva factura</button>}
            {view==="tasks"      && <button className="btn btn-dark btn-sm" onClick={()=>dispatch({type:"modal",m:"task"})}>+ Nueva tarea</button>}
            <NotifBell
              notifications={db.notifications}
              onRead={id => dispatch({ type:"readNotif", id })}
              onReadAll={() => dispatch({ type:"readAllNotifs" })}
              onDismiss={id => dispatch({ type:"dismissNotif", id })}
              onViewAll={() => setView("notifications")}
            />
          </div>
        </div>
        {view==="overview"      && <FOverview db={db} dispatch={doDispatch}/>}
        {view==="projects"      && <FProjects db={db} dispatch={doDispatch}/>}
        {view==="projectDetail" && <FProjectDetail db={db} projectId={projId} dispatch={doDispatch}/>}
        {view==="clients"       && <FClients  db={db} dispatch={doDispatch}/>}
        {view==="invoices"      && <FInvoices db={db} dispatch={doDispatch}/>}
        {view==="tasks"         && <FTasks    db={db} dispatch={doDispatch}/>}
        {view==="messages"      && <FMessages db={db} dispatch={doDispatch} activeChatId={chatId}/>}
        {view==="notifications" && (
          <NotificationsPage
            notifications={db.notifications}
            onRead={id => dispatch({ type:"readNotif", id })}
            onReadAll={() => dispatch({ type:"readAllNotifs" })}
            onDismiss={id => dispatch({ type:"dismissNotif", id })}
            dispatch={doDispatch}
          />
        )}
        {view==="media"    && <FMedia db={db} dispatch={doDispatch}/>}
        {view==="settings" && <SettingsPage db={db} onLogout={onLogout} onOpenLegal={setLegalDoc}/>}
        <LegalFooter onOpen={setLegalDoc}/>
      </div>
      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobile-nav" style={{display:"flex"}}>
        {[
          {v:"overview",  icon:"🏠", label:"Inicio"},
          {v:"clients",   icon:"👥", label:"Clientes"},
          {v:"projects",  icon:"🚀", label:"Proyectos"},
          {v:"invoices",  icon:"🧾", label:"Facturas"},
          {v:"settings",  icon:"⚙️",  label:"Ajustes"},
        ].map(item=>(
          <div key={item.v} className={`mnav-item${view===item.v?" active":""}`} onClick={()=>setView(item.v)}>
            <span className="mnav-icon">{item.icon}</span>
            <span className="mnav-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}


// ════════════════════════════════════════════════════════════
//  ADMIN PANEL
// ════════════════════════════════════════════════════════════
function AdminPanel({ onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fmt = v => "$" + Number(v||0).toLocaleString();

  useEffect(() => {
    fetch("/api/admin", { headers: { "x-admin-token": "sympra-admin-2026" } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#080810",color:"#fff",fontFamily:"sans-serif"}}>Cargando panel...</div>;

  return (
    <div style={{minHeight:"100vh",background:"#080810",color:"#f0f0fa",fontFamily:"'DM Sans',sans-serif",padding:0}}>
      <div style={{background:"#0e0e1a",borderBottom:"1px solid #1e1e30",padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:22,fontWeight:800}}>Sym<em style={{color:"#a855f7",fontStyle:"normal"}}>pra</em> <span style={{fontSize:13,color:"#60607a",fontWeight:400}}>Admin</span></div>
        <button onClick={onLogout} style={{background:"rgba(255,255,255,.08)",border:"1px solid #1e1e30",color:"#a0a0c0",padding:"8px 16px",borderRadius:100,cursor:"pointer",fontSize:13}}>Cerrar sesión</button>
      </div>
      <div style={{padding:"32px"}}>
        <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:28,fontWeight:800,marginBottom:8}}>Panel de Control</h1>
        <p style={{color:"#60607a",fontSize:14,marginBottom:32}}>Visión general de Sympra</p>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
          {[
            {label:"Freelancers",value:data?.stats?.total_freelancers||0,icon:"👥",color:"#7c3aed"},
            {label:"Clientes",value:data?.stats?.total_clients||0,icon:"🤝",color:"#06b6d4"},
            {label:"Proyectos",value:data?.stats?.total_projects||0,icon:"🚀",color:"#f59e0b"},
            {label:"Total Facturado",value:fmt(data?.stats?.total_invoiced),icon:"💰",color:"#10b981"},
          ].map((s,i)=>(
            <div key={i} style={{background:"#0e0e1a",border:"1px solid #1e1e30",borderRadius:16,padding:24}}>
              <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
              <div style={{fontSize:28,fontWeight:800,fontFamily:"'Bricolage Grotesque',sans-serif",color:s.color}}>{s.value}</div>
              <div style={{fontSize:12,color:"#60607a",marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Freelancers table */}
        <div style={{background:"#0e0e1a",border:"1px solid #1e1e30",borderRadius:16,overflow:"hidden"}}>
          <div style={{padding:"20px 24px",borderBottom:"1px solid #1e1e30",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontWeight:700,fontSize:16}}>Freelancers registrados</div>
            <div style={{fontSize:13,color:"#60607a"}}>{data?.freelancers?.length||0} usuarios</div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"1px solid #1e1e30"}}>
                  {["Nombre","Email","Plan","Clientes","Proyectos","Facturado","Registrado"].map(h=>(
                    <th key={h} style={{padding:"12px 24px",textAlign:"left",fontSize:11,color:"#60607a",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.freelancers||[]).map((f,i)=>(
                  <tr key={f.id} style={{borderBottom:"1px solid rgba(255,255,255,.03)",background:i%2===0?"transparent":"rgba(255,255,255,.01)"}}>
                    <td style={{padding:"14px 24px",fontWeight:600,fontSize:14}}>{f.name}</td>
                    <td style={{padding:"14px 24px",color:"#a0a0c0",fontSize:13}}>{f.email}</td>
                    <td style={{padding:"14px 24px"}}>
                      <span style={{background:f.plan==="pro"?"rgba(124,58,237,.2)":f.plan==="agency"?"rgba(6,182,212,.2)":"rgba(255,255,255,.08)",color:f.plan==="pro"?"#a855f7":f.plan==="agency"?"#06b6d4":"#60607a",padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:700,textTransform:"uppercase"}}>{f.plan||"starter"}</span>
                    </td>
                    <td style={{padding:"14px 24px",color:"#f0f0fa",fontWeight:600}}>{f.client_count||0}</td>
                    <td style={{padding:"14px 24px",color:"#f0f0fa",fontWeight:600}}>{f.project_count||0}</td>
                    <td style={{padding:"14px 24px",color:"#10b981",fontWeight:700}}>{fmt(f.total_invoiced)}</td>
                    <td style={{padding:"14px 24px",color:"#60607a",fontSize:12}}>{new Date(f.created_at).toLocaleDateString("es-ES")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  ROOT — STATE + TOAST ENGINE
// ════════════════════════════════════════════════════════════
export default function SympraApp() {
  const [session, setSession]   = useState(null);
  const [lang, setLang]         = useState("es");
  const [db, setDb]             = useState({ ...DB });
  const [modalType, setModalType] = useState(null);
  const [toasts, setToasts]     = useState([]);
  const toastRef = useRef({});

  // ── TOAST ENGINE ──────────────────────────────────────────
  const addToast = useCallback((notif) => {
    const id = uid();
    const duration = 5000;
    setToasts(ts => [...ts, { ...notif, id, duration }]);
    toastRef.current[id] = setTimeout(() => dismissToast(id), duration + 300);
  }, []);

  const dismissToast = (id) => {
    clearTimeout(toastRef.current[id]);
    setToasts(ts => ts.map(t => t.id === id ? { ...t, out: true } : t));
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 300);
  };

  // ── LOAD REAL DATA FROM NEON ─────────────────────────────
  useEffect(() => {
    if (!session || session.role !== "freelancer" || !session.user?.id) return;
    const freelancerId = session.user.id;
    // Update freelancer name in DB
    setDb(d => ({
      ...d,
      freelancer: {
        ...d.freelancer,
        name: session.user.name || d.freelancer.name,
        email: session.user.email || d.freelancer.email,
        monthlyGoal: session.user.monthly_goal || d.freelancer.monthlyGoal,
      }
    }));
    // Load clients from Neon
    fetch(`/api/clients?freelancerId=${freelancerId}`)
      .then(r => r.json())
      .then(clients => {
        if (Array.isArray(clients) && clients.length > 0) {
          const mapped = clients.map(c => ({
            id: c.id, name: c.name, company: c.company || "", email: c.email || "",
            avatar: (c.name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2),
            color: c.avatar_color || "#6366f1", status: c.status || "active",
            totalBilled: parseFloat(c.total_billed) || 0, password: c.password || "1234"
          }));
          setDb(d => ({ ...d, clients: mapped }));
        } else {
          setDb(d => ({ ...d, clients: [] }));
        }
      }).catch(() => {});
    // Load projects from Neon
    fetch(`/api/projects?freelancerId=${freelancerId}`)
      .then(r => r.json())
      .then(projects => {
        if (Array.isArray(projects) && projects.length > 0) {
          const mapped = projects.map(p => ({
            id: p.id, clientId: p.client_id, name: p.name,
            status: p.status || "planning", progress: p.progress || 0,
            phase: p.phase || "Briefing", budget: parseFloat(p.budget) || 0,
            paid: parseFloat(p.paid) || 0, dueDate: p.due_date || "2026-06-30",
            color: p.color || "#6366f1", priority: p.priority || "medium"
          }));
          setDb(d => ({ ...d, projects: mapped }));
        } else {
          setDb(d => ({ ...d, projects: [] }));
        }
      }).catch(() => {});
    // Load invoices from Neon
    fetch(`/api/invoices?freelancerId=${freelancerId}`)
      .then(r => r.json())
      .then(invoices => {
        if (Array.isArray(invoices) && invoices.length > 0) {
          const mapped = invoices.map(i => ({
            id: i.id, clientId: i.client_id, projectId: i.project_id,
            number: i.number, amount: parseFloat(i.amount) || 0,
            status: i.status || "pending", date: i.created_at?.slice(0,10) || "2026-03-01",
            due: i.due_date || "2026-03-30"
          }));
          setDb(d => ({ ...d, invoices: mapped }));
        } else {
          setDb(d => ({ ...d, invoices: [] }));
        }
      }).catch(() => {});
  }, [session]);

  // ── SIMULATE INCOMING EVENTS ──────────────────────────────
  useEffect(() => {
    if (!session || session.role !== "freelancer") return;
    const events = [
      { delay: 5000,  type:"CLIENT_MSG",      title:"Mensaje de Ana Martínez",    body:"¿Ya tienes las maquetas listas?" },
      { delay: 12000, type:"INVOICE_OVERDUE",  title:"Factura vencida — INV-004",  body:"Lucía Herrera · $800 · sin pagar" },
      { delay: 20000, type:"DEL_APPROVED",     title:"Entregable aprobado",        body:"Ana aprobó: Diseño Homepage ✓" },
      { delay: 30000, type:"TASK_DUE",         title:"Tarea vence hoy",            body:"Code review módulo Auth — SaaS MVP" },
    ];
    const timers = events.map(ev =>
      setTimeout(() => {
        const newNotif = { id: uid(), type: ev.type, read: false, ts: new Date().toISOString(), title: ev.title, body: ev.body, link: "notifications" };
        setDb(d => ({ ...d, notifications: [newNotif, ...d.notifications] }));
        addToast(newNotif);
      }, ev.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [session]);

  const dispatch = (action) => {
    switch(action.type) {
      case "toggleTask":
        setDb(d => ({ ...d, tasks: d.tasks.map(t => t.id===action.id ? {...t,done:!t.done} : t) }));
        break;
      case "markPaid":
        setDb(d => ({ ...d, invoices: d.invoices.map(i => i.id===action.id ? {...i,status:"paid"} : i) }));
        addToast({ type:"INVOICE_PAID", title:"Factura marcada como pagada", body:"Cobrado ✓" });
        fetch("/api/invoices", {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:action.id,status:"paid"})}).catch(()=>{});
        break;
      case "approveDeliverable":
        setDb(d => ({ ...d, deliverables: d.deliverables.map(del => del.id===action.id ? {...del,status:"approved"} : del) }));
        break;
      case "sendMsg":
        setDb(d => ({ ...d, messages: [...d.messages, {id:uid(),clientId:action.clientId,from:action.from,text:action.text,date:new Date().toISOString()}] }));
        if (action.from === "client" && session?.role === "freelancer") {
          const cl = db.clients.find(c => c.id === action.clientId);
          addToast({ type:"CLIENT_MSG", title:`Mensaje de ${cl?.name}`, body: action.text });
        }
        break;
      case "readNotif":
        setDb(d => ({ ...d, notifications: d.notifications.map(n => n.id===action.id ? {...n,read:true} : n) }));
        break;
      case "readAllNotifs":
        setDb(d => ({ ...d, notifications: d.notifications.map(n => ({...n,read:true})) }));
        break;
      case "dismissNotif":
        setDb(d => ({ ...d, notifications: d.notifications.filter(n => n.id!==action.id) }));
        break;
      case "addMedia":
        setDb(d => ({ ...d, media: [action.item, ...(d.media||[])] }));
        break;
      case "modal":
        setModalType(action.m);
        break;
      case "saveNew": {
        const f = action.form;
        const freelancerId = session?.user?.id;
        if(modalType==="task") {
          setDb(d=>({...d,tasks:[...d.tasks,{id:uid(),projectId:f.projectId||1,text:f.text||"Nueva tarea",done:false,priority:f.priority||"medium",due:f.due||"2026-04-30"}]}));
        } else if(modalType==="client") {
          const avatar = (f.name||"NC").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
          const colors = ["#7c3aed","#0ea5e9","#ec4899","#10b981","#f59e0b"];
          const color = colors[Math.floor(Math.random()*colors.length)];
          const newClient = {id:uid(),name:f.name||"Nuevo Cliente",company:f.company||"",avatar,email:f.email||"",color,status:"active",totalBilled:0};
          setDb(d=>({...d,clients:[...d.clients,newClient]}));
          if(freelancerId) {
            fetch("/api/clients", {method:"POST",headers:{"Content-Type":"application/json"},
              body:JSON.stringify({name:f.name,company:f.company,email:f.email,freelancer_id:freelancerId})
            }).then(r=>r.json()).then(saved=>{
              setDb(d=>({...d,clients:d.clients.map(c=>c.id===newClient.id?{...c,id:saved.id}:c)}));
            }).catch(()=>{});
          }
        } else if(modalType==="project") {
          const colors = ["#7c3aed","#0ea5e9","#ec4899","#10b981","#f59e0b"];
          const color = colors[Math.floor(Math.random()*colors.length)];
          const newProject = {id:uid(),clientId:f.clientId,name:f.name||"Nuevo Proyecto",status:"planning",progress:0,phase:"Briefing",budget:+f.budget||0,paid:0,dueDate:f.due||"2026-06-30",color,priority:"medium"};
          setDb(d=>({...d,projects:[...d.projects,newProject]}));
          const cl = db.clients.find(c=>c.id===f.clientId);
          addToast({ type:"PROJECT_NEW", title:"Proyecto creado", body:`${f.name||"Nuevo Proyecto"} · ${cl?.name||""}` });
          if(freelancerId) {
            fetch("/api/projects", {method:"POST",headers:{"Content-Type":"application/json"},
              body:JSON.stringify({name:f.name,client_id:f.clientId,freelancer_id:freelancerId,budget:+f.budget||0,due_date:f.due})
            }).then(r=>r.json()).then(saved=>{
              setDb(d=>({...d,projects:d.projects.map(p=>p.id===newProject.id?{...p,id:saved.id}:p)}));
            }).catch(()=>{});
          }
        } else if(modalType==="invoice") {
          const newInvoice = {id:uid(),clientId:f.clientId,projectId:f.projectId,number:`INV-${String(db.invoices.length+1).padStart(3,"0")}`,amount:+f.amount||0,status:"pending",date:new Date().toISOString().slice(0,10),due:f.due||"2026-03-30"};
          setDb(d=>({...d,invoices:[...d.invoices,newInvoice]}));
          if(freelancerId) {
            fetch("/api/invoices", {method:"POST",headers:{"Content-Type":"application/json"},
              body:JSON.stringify({freelancer_id:freelancerId,client_id:f.clientId,project_id:f.projectId,amount:+f.amount||0,due_date:f.due})
            }).then(r=>r.json()).then(saved=>{
              setDb(d=>({...d,invoices:d.invoices.map(i=>i.id===newInvoice.id?{...i,id:saved.id,number:saved.number}:i)}));
            }).catch(()=>{});
          }
        } else if(modalType==="deliverable") {
          setDb(d=>({...d,deliverables:[...d.deliverables,{id:uid(),projectId:f.projectId||action.extra?.projectId,name:f.name||"Entregable",status:"pending",date:f.date||"2026-04-01"}]}));
        }
        setModalType(null);
        break;
      }
      default: break;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      {!session && <Login lang={lang} setLang={setLang} onLogin={(role,user)=>setSession({role,user,client:user})}/>}
      {session?.role==="freelancer" && <FreelancerShell db={db} dispatch={dispatch} onLogout={()=>setSession(null)}/>}
      {session?.role==="client"     && <ClientPortal client={session.client} db={db} dispatch={dispatch} onLogout={()=>setSession(null)} lang={lang} setLang={setLang}/>}
      {session?.role==="admin"      && <AdminPanel onLogout={()=>setSession(null)}/>}
      {modalType && MODAL_CFGS[modalType] && <FormModal cfg={MODAL_CFGS[modalType]} data={db} onClose={()=>setModalType(null)} onSave={form=>dispatch({type:"saveNew",form})}/>}
      <ToastStack toasts={toasts} onDismiss={dismissToast}/>
    </>
  );
}
