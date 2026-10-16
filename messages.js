export async function onRequestPost({ request, env }) {
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return reply({ error: "Please submit the form normally." }, 415);
  }
  let data;
  try { data = await request.json(); } catch { return reply({ error: "Could not read that message. Please try again." }, 400); }
  if (typeof data.website === "string" && data.website.trim()) return reply({ ok: true });
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const categories = new Set(["Thought", "Vent", "Kindness", "Question", "Other"]);
  if (!message || message.length > 1500) return reply({ error: "Please enter a message under 1,500 characters." }, 400);
  if (data.consent !== true) return reply({ error: "Please check the consent box before submitting." }, 400);
  if (!env.DB) return reply({ error: "The form is not configured yet. The site owner needs to connect the private message database." }, 503);
  try {
    await env.DB.prepare("INSERT INTO messages (category, message, status, created_at) VALUES (?, ?, 'pending', datetime('now'))")
      .bind(categories.has(data.category) ? data.category : "Other", message).run();
    return reply({ ok: true }, 201);
  } catch {
    return reply({ error: "We couldn't save your message right now. Please try again later." }, 500);
  }
}
function reply(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
