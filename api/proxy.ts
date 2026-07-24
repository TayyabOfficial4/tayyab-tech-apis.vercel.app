export const config = { runtime: 'edge' }

// Upstream origin kept encoded so it never appears as plain text anywhere
const UPSTREAM = atob('aHR0cHM6Ly9wcmV4enlhcGlzLmNvbQ==')
// Upstream brand identifiers — sanitised out of any text response so the
// upstream brand never appears in user-facing JSON / text payloads
const N1 = 'prexzyapis'
const N2 = 'Prexzy APIs'
const N3 = 'prexzy'
const N4 = 'Prexzy'

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)

  // Path comes via rewrite as ?__p=ai/chatgpt (or "endpoints")
  const p = url.searchParams.get('__p') || ''
  url.searchParams.delete('__p')
  const qs = url.searchParams.toString()
  const target = UPSTREAM + '/' + p + (qs ? '?' + qs : '')

  let upstreamRes: Response
  try {
    upstreamRes = await fetch(target, {
      method: req.method,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        accept: req.headers.get('accept') || '*/*',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    })
  } catch {
    return new Response(
      JSON.stringify({ status: false, statusCode: 502, creator: 'Tayyab Tech', message: 'Upstream service unavailable' }),
      { status: 502, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' } }
    )
  }

  const contentType = upstreamRes.headers.get('content-type') || ''

  // Sanitize text-based responses so the upstream brand never leaks
  if (contentType.includes('json') || contentType.startsWith('text/')) {
    let text = await upstreamRes.text()
    text = text
      .replace(new RegExp('https?:\\/\\/(?:[a-z0-9-]+\\.)?' + N1 + '\\.com', 'gi'), url.origin + '/api')
      .replace(new RegExp('https?:\\/\\/apis\\.' + N1 + '\\.com', 'gi'), url.origin + '/api')
      .replace(new RegExp('\\b' + N2 + '\\b', 'g'), 'Tayyab Tech')
      .replace(new RegExp('\\b' + N3 + '\\b', 'g'), 'tayyabtech')
      .replace(new RegExp('\\b' + N4 + '\\b', 'g'), 'Tayyab')
    return new Response(text, {
      status: upstreamRes.status,
      headers: {
        'content-type': contentType,
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
        'x-powered-by': 'Tayyab Tech',
      },
    })
  }

  // Binary (images, audio, video) — stream through untouched
  const headers = new Headers()
  headers.set('content-type', contentType || 'application/octet-stream')
  headers.set('access-control-allow-origin', '*')
  headers.set('x-powered-by', 'Tayyab Tech')
  const len = upstreamRes.headers.get('content-length')
  if (len) headers.set('content-length', len)
  return new Response(upstreamRes.body, { status: upstreamRes.status, headers })
}