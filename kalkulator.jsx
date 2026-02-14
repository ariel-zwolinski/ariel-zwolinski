const { useMemo, useState } = React;

const PIT_RATES = {
  skala: { firstRate: 0.12, secondRate: 0.32, threshold: 120000, kwotaZmniejszajaca: 3600 },
  liniowy: { rate: 0.19 },
};

function currency(value) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);
}

function calculateSkala(income, costs) {
  const base = Math.max(0, income - costs);
  const { firstRate, secondRate, threshold, kwotaZmniejszajaca } = PIT_RATES.skala;

  let tax;
  if (base <= threshold) {
    tax = base * firstRate - kwotaZmniejszajaca;
  } else {
    tax = threshold * firstRate + (base - threshold) * secondRate - kwotaZmniejszajaca;
  }

  return { base, tax: Math.max(0, tax) };
}

function calculateLiniowy(income, costs) {
  const base = Math.max(0, income - costs);
  const tax = base * PIT_RATES.liniowy.rate;
  return { base, tax };
}

function KalkulatorPIT() {
  const [income, setIncome] = useState(150000);
  const [costs, setCosts] = useState(10000);
  const [mode, setMode] = useState('skala');

  const result = useMemo(() => {
    if (mode === 'skala') return calculateSkala(income, costs);
    return calculateLiniowy(income, costs);
  }, [income, costs, mode]);

  return (
    <main className="container">
      <section className="card">
        <h1>Kalkulator PIT</h1>
        <p>Prosty kalkulator poglądowy dla skali podatkowej i podatku liniowego.</p>

        <div className="form-grid">
          <div>
            <label htmlFor="mode">Forma opodatkowania</label>
            <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="skala">Skala podatkowa (12% / 32%)</option>
              <option value="liniowy">Podatek liniowy (19%)</option>
            </select>
          </div>

          <div>
            <label htmlFor="income">Przychód roczny (PLN)</label>
            <input
              id="income"
              type="number"
              min="0"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <label htmlFor="costs">Koszty uzyskania przychodu (PLN)</label>
            <input
              id="costs"
              type="number"
              min="0"
              value={costs}
              onChange={(e) => setCosts(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="result">
          <p className="small">Podstawa opodatkowania</p>
          <p className="big">{currency(result.base)}</p>
          <p className="small">Szacowany PIT roczny</p>
          <p className="big">{currency(result.tax)}</p>
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<KalkulatorPIT />);
