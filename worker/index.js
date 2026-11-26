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
  if (!env.INVOKER?.check) return [];
  const url = new URL(request.url);
  const headers = {};
  request.headers.forEach((v, k) => {
    headers[k] = v;
  });
  return await env.INVOKER.check({
    method: request.method,
    path: url.pathname,
    query: url.search.replace(/^\?/, ""),
    host: url.hostname,
    headers,
    body: await readBody(request),
    ip: request.headers.get("cf-connecting-ip") ?? "unknown",
    port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
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
