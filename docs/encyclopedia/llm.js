// Shared Claude API setup for the tutor and smart search: key storage, models, message threads, usage and cost.
// All calls go through the site owner's proxy (Claude Haiku, rate and budget limits).
// Readers do not enter keys.
const PROXY_URL = 'https://bct-lab-proxy.brokenomics.workers.dev';
export const FREE_LINE = 'Free on this site, answered by Claude Haiku.';
const SDK_URL = 'https://esm.sh/@anthropic-ai/sdk@1.8.0';
export const MODELS = {
  'claude-opus-5-5': { label: 'Opus 5.5', effort: 'medium', fallback: true, in: 4, out: 20 },
  'claude-sonnet-5-5': { label: 'Sonnet 5.5', effort: 'medium', fallback: true, in: 2, out: 10 },
  'claude-haiku-5-5': { label: 'Haiku 5.5', effort: 'low', fallback: false, in: 0.1, out: 0.5 },
};

export const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
export const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
export const lsDel = (k) => { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } };

// One key for the tutor and Ask. Saved to localStorage 'kg.apikey' only when "remember" is on.
export const keys = {
  value: '',
  remember: false,
  init() { lsDel('kg.apikey'); this.value = ''; this.remember = false; },
  set() { /* no reader keys: the site's proxy is always used */ },
  setRemember(b) { this.remember = !!b; if (b) lsSet('kg.apikey', this.value); else lsDel('kg.apikey'); },
};

export const viaProxy = () => true;
// The model is always Claude Haiku.
export const modelFor = () => 'claude-haiku-5-5';

let sdk = null;
// An empty apiKey means the proxy: no retries (the proxy rate limits), a placeholder key, the owner's key is added server-side.
export async function client(apiKey) {
  if (!sdk) { const mod = await import(SDK_URL); sdk = mod.default || mod.Anthropic; }
  // SDK 1.8.0 sends the key as "Authorization: Bearer", which the proxy's CORS rules do not allow; send the placeholder as x-api-key instead.
  if (!apiKey) return new sdk({ apiKey: 'proxy', baseURL: PROXY_URL, dangerouslyAllowBrowser: true, maxRetries: 0, defaultHeaders: { Authorization: null, 'x-api-key': 'proxy' } });
  return new sdk({ apiKey, dangerouslyAllowBrowser: true });
}

// A server-side message thread (beta message-threads-2026-08-12) with prompt caching on the growing prefix.
// "seed" is earlier history to replay when the thread has to be created mid-conversation.
export function makeThread(cl, { model, system, max_tokens, seed, proxy }) {
  const cfg = MODELS[model];
  const params = {
    model,
    max_tokens,
    thinking: { type: 'adaptive' },
    output_config: { effort: cfg.effort },
    cache_control: { type: 'ephemeral' },
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    unsupportedRequestBehavior: 'continue_unthreaded',
  };
  if (cfg.fallback && !proxy) { params.betas = ['server-side-fallback-2026-07-01']; params.fallbacks = 'default'; }
  if (seed && seed.length) params.messages = seed;
  return cl.beta.messages.thread(params);
}

export function usageOf(final, model) {
  const u = (final && final.usage) || {};
  const r = { input: u.input_tokens || 0, output: u.output_tokens || 0, read: u.cache_read_input_tokens || 0, write: u.cache_creation_input_tokens || 0 };
  const p = MODELS[model] || MODELS['claude-haiku-5-5'];
  r.cost = ((r.input + 0.1 * r.read + 1.25 * r.write) * p.in + r.output * p.out) / 1e6;
  return r;
}
export const fmtUsage = (u) => `${u.input + u.read + u.write} in (${u.read} cached, ${u.write} written), ${u.output} out, about $${u.cost < 0.01 ? u.cost.toFixed(4) : u.cost.toFixed(3)}`;

// The proxy's own message (rate limit, daily budget) is shown plainly; direct errors get a short hint.
export function errorText(err, proxy) {
  const inner = err && err.error && (err.error.error || err.error);
  const msg = (inner && inner.message) || (err && err.message) || String(err);
  if (proxy && err && (err.status === 429 || err.status === 403 || err.status === 413)) return msg;
  const code = err.status ? ` (HTTP ${err.status})` : '';
  let hint = '';
  if (err.status === 401) hint = ' The site could not reach the model; try again later.';
  else if (err.status === 429) hint = ' Rate limited: wait a moment and try again.';
  return 'Error' + code + ': ' + msg + hint;
}
