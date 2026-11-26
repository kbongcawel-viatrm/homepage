const BODY_CAP = 256 * 1024;

async function readBody(request) {
  try {
    const buf = await request.clone().arrayBuffer();
    if (buf.byteLength > BODY_CAP) return "";
    return new TextDecoder("utf-8", { fatal: false }).decode(buf);
  } catch {
    return "";
  }
}

async function agenticHits(request, env) {
  const url = new URL(request.url);
  const headers = {};
  request.headers.forEach((v, k) => {
    headers[k] = v;
  });
  const payload = {
    method: request.method,
    path: url.pathname,
    query: url.search.replace(/^\?/, ""),
    host: url.hostname,
    headers,
    body: await readBody(request),
    ip: request.headers.get("cf-connecting-ip") ?? "unknown",
    port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
  };
  const results = await Promise.allSettled(
    [env.INVOKER, env.MEEPO]
      .filter((b) => b?.check)
      .map((b) => b.check(payload))
  );
  return results.flatMap((r, i) => {
    if (r.status === "rejected") {
      console.log("agentic check failed", i, r.reason);
      return [];
    }
    return r.value ?? [];
  });
}

export default {
  async fetch(request, env) {
    try {
      const hits = await agenticHits(request, env);
      if (hits?.some?.((h) => h.confidence === "high")) {
        return new Response("Forbidden", { status: 403 });
      }
    } catch (e) {
      console.log("invoker check failed", e);
    }
    return env.ASSETS.fetch(request);
  }
};
