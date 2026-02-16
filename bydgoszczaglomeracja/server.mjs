import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, 'public');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4174;
const DANE_API_BASE = 'https://api.dane.gov.pl/1.4/datasets';

const neighboringPowiats = [
  'bydgoszcz',
  'powiat bydgoski',
  'powiat inowrocławski',
  'powiat nakielski',
  'powiat świecki',
  'powiat chełmiński',
  'powiat toruński',
  'powiat żniński'
];

function json(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function getMime(path) {
  const ext = extname(path);
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function datasetText(item) {
  const attrs = item?.attributes ?? item;
  const title = attrs?.title ?? attrs?.name ?? '';
  const notes = attrs?.notes ?? attrs?.description ?? '';
  const tags = (attrs?.tags ?? []).map((t) => (typeof t === 'string' ? t : t?.name ?? '')).join(' ');
  return `${title} ${notes} ${tags}`.toLowerCase();
}

function normalizeDataset(item) {
  const attrs = item?.attributes ?? item;
  const resources = attrs?.resources ?? [];
  return {
    id: item?.id ?? attrs?.id,
    title: attrs?.title ?? attrs?.name ?? 'Bez tytułu',
    description: attrs?.notes ?? attrs?.description ?? '',
    updatedAt: attrs?.update_date ?? attrs?.metadata_modified ?? attrs?.modified,
    url:
      attrs?.frontend_link ??
      attrs?.url ??
      (attrs?.slug ? `https://dane.gov.pl/pl/dataset/${attrs.slug}` : null),
    resources: resources.map((resource) => {
      const r = resource?.attributes ?? resource;
      return {
        id: r?.id,
        title: r?.title ?? r?.name ?? 'Zasób',
        format: r?.format ?? 'n/d',
        url: r?.download_url ?? r?.link ?? r?.url
      };
    })
  };
}

async function fetchDatasets(query, perPage = 60) {
  const url = new URL(DANE_API_BASE);
  url.searchParams.set('q', query);
  url.searchParams.set('per_page', String(perPage));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Dane.gov API responded ${response.status}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.result?.results)) {
    return payload.result.results;
  }
  return [];
}

function applyLocalFilters(items, selectedPowiats) {
  if (!selectedPowiats?.length) return items;
  return items.filter((item) => {
    const text = datasetText(item);
    return selectedPowiats.some((powiat) => text.includes(powiat.toLowerCase()));
  });
}

const server = createServer(async (req, res) => {
  const reqUrl = new URL(req.url ?? '/', `http://${req.headers.host}`);

  if (reqUrl.pathname === '/api/powiats') {
    return json(res, 200, { powiats: neighboringPowiats });
  }

  if (reqUrl.pathname === '/api/datasets') {
    const query = reqUrl.searchParams.get('query') || 'budownictwo mieszkaniowe';
    const powiats = reqUrl.searchParams.getAll('powiat').filter(Boolean);

    try {
      const datasets = await fetchDatasets(query);
      const filtered = applyLocalFilters(datasets, powiats).map(normalizeDataset);

      return json(res, 200, {
        query,
        selectedPowiats: powiats,
        total: filtered.length,
        datasets: filtered.slice(0, 40)
      });
    } catch (error) {
      return json(res, 502, {
        error: 'Nie udało się pobrać danych z dane.gov.pl',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  const safePath = reqUrl.pathname === '/' ? '/index.html' : reqUrl.pathname;
  const filePath = normalize(join(publicDir, safePath));
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': getMime(filePath) });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Bydgoszcz Aglomeracja MVP listening on http://localhost:${PORT}`);
});
