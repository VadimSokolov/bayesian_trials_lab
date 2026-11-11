/* Proxy that lets visitors of the Bayesian Clinical Trials Lab call Claude with the site owner's key.
   The key lives only in the Worker secret ANTHROPIC_API_KEY. Guests get Haiku only, with size, output,
   rate and daily spending caps. Readers who bring their own key call Anthropic directly, not through here. */

const UPSTREAM = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-5-5';
const MAX_TOKENS = 1500;
const MAX_BODY = 120000;               // bytes per request
const ALLOWED_BETAS = new Set(['message-threads-2026-08-12']);
const FIELDS = new Set(['model', 'max_tokens', 'system', 'messages', 'thinking', 'output_config', 'cache_control', 'thread', 'stream', 'metadata', 'stop_sequences']);
// Haiku 5.5 prices in dollars per token
const PRICE = { input: 0.10e-6, output: 0.50e-6, cache_read: 0.01e-6, cache_write: 0.125e-6 };

function cors(origin, env, request) {
  const ok = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allow = ok.includes(origin) ? origin : ok[0] || '';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': (request && request.headers.get('Access-Control-Request-Headers')) || 'authorization, content-type, anthropic-version, anthropic-beta, x-api-key, user-agent',
    'Access-Control-Expose-Headers': 'request-id',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin, Access-Control-Request-Headers',
  };
}

function err(status, message, headers) {
  return new Response(JSON.stringify({ type: 'error', error: { type: 'proxy_error', message } }), { status, headers: { ...headers, 'content-type': 'application/json' } });
}

function today() { return new Date().toISOString().slice(0, 10); }

async function spent(env) { return parseFloat((await env.USAGE.get('spend:' + today())) || '0'); }

async function addSpend(env, usage) {
  if (!usage) return;
  const cost = (usage.input_tokens || 0) * PRICE.input + (usage.output_tokens || 0) * PRICE.output +
    (usage.cache_read_input_tokens || 0) * PRICE.cache_read + (usage.cache_creation_input_tokens || 0) * PRICE.cache_write;
  const key = 'spend:' + today();
  const cur = parseFloat((await env.USAGE.get(key)) || '0');
  await env.USAGE.put(key, String(cur + cost), { expirationTtl: 3 * 86400 });
}

// Read usage from a streamed response without blocking the client: tee the stream and parse SSE events.
async function meterStream(stream, env) {
  const reader = stream.getReader(), dec = new TextDecoder();
  let buf = '', usage = {};
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      try {
        const ev = JSON.parse(line.slice(5));
        if (ev.type === 'message_start' && ev.message && ev.message.usage) Object.assign(usage, ev.message.usage);
        if (ev.type === 'message_delta' && ev.usage) Object.assign(usage, ev.usage);
      } catch (e) { /* ignore partial lines */ }
    }
  }
  await addSpend(env, usage);
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const h = cors(origin, env, request);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    const url = new URL(request.url);
    if (request.method !== 'POST' || !url.pathname.endsWith('/v1/messages')) return err(404, 'Not found', h);
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    if (!allowed.includes(origin)) return err(403, 'This proxy only serves the Bayesian Clinical Trials Lab site.', h);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (env.RL) {
      const { success } = await env.RL.limit({ key: ip });
      if (!success) return err(429, 'Too many requests. Please wait a minute.', h);
    }
    const cap = parseFloat(env.DAILY_CAP_USD || '3');
    if (await spent(env) >= cap) return err(429, 'The free daily budget is used up. Try again tomorrow.', h);

    const raw = await request.text();
    if (raw.length > MAX_BODY) return err(413, 'Request too large.', h);
    let body;
    try { body = JSON.parse(raw); } catch (e) { return err(400, 'Bad JSON.', h); }
    for (const k of Object.keys(body)) if (!FIELDS.has(k)) delete body[k];
    body.model = MODEL;
    body.max_tokens = Math.min(parseInt(body.max_tokens || MAX_TOKENS, 10) || MAX_TOKENS, MAX_TOKENS);
    body.output_config = body.output_config && body.output_config.format ? { effort: 'low', format: body.output_config.format } : { effort: 'low' };

    const betas = (request.headers.get('anthropic-beta') || '').split(',').map(s => s.trim()).filter(b => ALLOWED_BETAS.has(b));
    const up = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': request.headers.get('anthropic-version') || '2023-06-01',
        ...(betas.length ? { 'anthropic-beta': betas.join(',') } : {}),
      },
      body: JSON.stringify(body),
    });
    const outHeaders = { ...h, 'content-type': up.headers.get('content-type') || 'application/json' };
    const rid = up.headers.get('request-id'); if (rid) outHeaders['request-id'] = rid;
    if (body.stream && up.body && up.ok) {
      const [a, b] = up.body.tee();
      ctx.waitUntil(meterStream(b, env));
      return new Response(a, { status: up.status, headers: outHeaders });
    }
    const text = await up.text();
    if (up.ok) { try { ctx.waitUntil(addSpend(env, JSON.parse(text).usage)); } catch (e) { /* ignore */ } }
    return new Response(text, { status: up.status, headers: outHeaders });
  },
};
