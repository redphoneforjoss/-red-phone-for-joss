const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
export async function onRequestGet({ env }) {
  if (!env.DB) return reply({ error: "Database binding DB is missing." }, 503);
  try { const result = await env.DB.prepare("SELECT id, category, message, status, created_at FROM messages ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, id DESC LIMIT 200").all(); return reply({ messages: result.results || [] }); }
  catch { return reply({ error: "Could not load messages." }, 500); }
}
export async function onRequestPost({ request, env }) {
  if (!env.DB) return reply({ error: "Database binding DB is missing." }, 503);
  let data; try { data = await request.json(); } catch { return reply({ error: "Invalid request." }, 400); }
  const id = Number(data.id), status = data.status;
  if (!Number.isSafeInteger(id) || id < 1 || !["approved", "rejected", "pending"].includes(status)) return reply({ error: "Invalid message or status." }, 400);
  try { const result = await env.DB.prepare("UPDATE messages SET status = ? WHERE id = ?").bind(status, id).run(); if (!result.meta?.changes) return reply({ error: "Message not found." }, 404); return reply({ ok: true }); }
  catch { return reply({ error: "Could not update message." }, 500); }
}
function reply(data, status = 200) { return new Response(JSON.stringify(data), { status, headers }); }
