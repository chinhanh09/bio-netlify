// netlify/functions/save-config.js
export default async (req, context) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  try {
    const { content } = await req.json();
    if (!Array.isArray(content)) {
      return new Response(JSON.stringify({ error: 'Invalid payload: content must be an array' }), { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    const repo  = process.env.GITHUB_REPO;     // e.g. 'username/repo'
    const branch= process.env.GITHUB_BRANCH||'main';
    const path  = process.env.CONFIG_PATH || 'config.json';
    if (!token || !repo) {
      return new Response(JSON.stringify({ error: 'Missing env GITHUB_TOKEN or GITHUB_REPO' }), { status: 500 });
    }

    const apiBase = 'https://api.github.com';
    const getUrl = `${apiBase}/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
    let sha = undefined;
    try {
      const r = await fetch(getUrl, { headers: { Authorization: `token ${token}`, 'User-Agent': 'netlify-fn' } });
      if (r.ok) { const j = await r.json(); sha = j.sha; }
    } catch (_) {}

    const putUrl = `${apiBase}/repos/${repo}/contents/${encodeURIComponent(path)}`;
    const res = await fetch(putUrl, {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, 'User-Agent': 'netlify-fn', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `chore: update ${path} via Netlify Function`,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        branch,
        sha
      })
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message || 'GitHub commit failed' }), { status: 500 });
    }

    const commitUrl = data.commit?.html_url || data.content?.html_url || null;
    return new Response(JSON.stringify({ ok: true, commitUrl }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
