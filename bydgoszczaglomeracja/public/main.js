const powiatList = document.getElementById('powiatList');
const form = document.getElementById('searchForm');
const results = document.getElementById('results');
const statusBox = document.getElementById('status');

async function fetchJSON(url) {
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.details || body.error || 'Błąd API');
  }
  return body;
}

function selectedPowiats() {
  return [...powiatList.querySelectorAll('input[type="checkbox"]:checked')].map((el) => el.value);
}

function setStatus(text) {
  statusBox.textContent = text;
}

function renderDatasets(payload) {
  if (!payload.datasets.length) {
    results.innerHTML = '<div class="card">Brak wyników dla wybranych filtrów.</div>';
    return;
  }

  const html = payload.datasets
    .map((dataset) => {
      const resources = dataset.resources.length
        ? `<ul class="resources">${dataset.resources
            .slice(0, 5)
            .map(
              (r) =>
                `<li><a href="${r.url || '#'}" target="_blank" rel="noopener">${r.title}</a> (${r.format})</li>`
            )
            .join('')}</ul>`
        : '<p class="meta">Brak zasobów w zestawie.</p>';

      return `<article class="card">
        <h3>${dataset.title}</h3>
        <p class="meta">Aktualizacja: ${dataset.updatedAt || 'n/d'}</p>
        <p>${dataset.description || 'Brak opisu.'}</p>
        <p><a href="${dataset.url || '#'}" target="_blank" rel="noopener">Strona zbioru</a></p>
        ${resources}
      </article>`;
    })
    .join('');

  results.innerHTML = html;
}

async function loadPowiats() {
  setStatus('Ładowanie listy powiatów...');
  const { powiats } = await fetchJSON('/api/powiats');

  powiatList.innerHTML = powiats
    .map(
      (powiat) =>
        `<label><input type="checkbox" value="${powiat}" checked /> ${powiat}</label>`
    )
    .join('');

  setStatus('Gotowe. Kliknij „Odśwież dane”, aby pobrać aktualne wyniki.');
}

async function loadDatasets() {
  const query = document.getElementById('queryInput').value.trim();
  const params = new URLSearchParams({ query });
  selectedPowiats().forEach((powiat) => params.append('powiat', powiat));

  setStatus('Pobieranie danych z dane.gov.pl...');
  try {
    const payload = await fetchJSON(`/api/datasets?${params.toString()}`);
    setStatus(`Znaleziono ${payload.total} zbiorów.`);
    renderDatasets(payload);
  } catch (error) {
    setStatus(`Błąd połączenia z dane.gov.pl: ${error.message}`);
    results.innerHTML = '<div class="card">Nie udało się pobrać danych. Spróbuj ponownie później.</div>';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  await loadDatasets();
});

await loadPowiats();
await loadDatasets();
