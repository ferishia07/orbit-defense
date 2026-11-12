const topScores = "SELECT name, score FROM scores ORDER BY score DESC, created_at ASC, id ASC LIMIT 10";
const json = (value, status = 200) => Response.json(value, {
  status, headers: { "Cache-Control": "no-store" }
});

function validScore(entry) {
  if (!entry || typeof entry !== "object") return false;
  const { id, name, score, wave, kills } = entry;
  return typeof id === "string" && /^[a-zA-Z0-9-]{10,64}$/.test(id)
    && typeof name === "string" && name.trim().length >= 1 && name.trim().length <= 16
    && !/[\u0000-\u001f\u007f]/u.test(name)
    && Number.isSafeInteger(kills) && kills > 0 && kills <= 100000
    && Number.isSafeInteger(score) && score >= kills * 100 && score <= kills * 200
    && score % 100 === 0 && wave === 1 + Math.floor(kills / 12);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    if (url.pathname !== "/api/scores") return new Response("Not found", { status: 404 });
    try {
      if (request.method === "GET") return json((await env.DB.prepare(topScores).all()).results);
      if (request.method !== "POST") return json({ error: "Method unavailable" }, 405);
      if (!request.headers.get("Content-Type")?.startsWith("application/json")) {
        return json({ error: "Expected JSON" }, 415);
      }
      const body = await request.text();
      if (body.length > 1024) return json({ error: "Score submission is too large" }, 413);
      let entry;
      try { entry = JSON.parse(body); } catch { return json({ error: "Invalid JSON" }, 400); }
      if (!validScore(entry)) return json({ error: "Invalid score" }, 400);
      const insert = env.DB.prepare(
        "INSERT INTO scores (id, name, score, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO NOTHING"
      ).bind(entry.id, entry.name.trim(), entry.score, Date.now());
      const [, leaderboard] = await env.DB.batch([insert, env.DB.prepare(topScores)]);
      return json(leaderboard.results);
    } catch (error) {
      console.error("Leaderboard request failed", error);
      return json({ error: "Leaderboard unavailable" }, 503);
    }
  }
};
