import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

type FakeEl = {
  id?: string;
  innerHTML: string;
  value: string;
  checked: boolean;
  type: string;
  tagName: string;
  dataset: Record<string, string>;
  classList: { toggle: (_cls: string, _on?: boolean) => void };
};

function createFakeEl(id?: string): FakeEl {
  return {
    id,
    innerHTML: "",
    value: "",
    checked: false,
    type: "text",
    tagName: "DIV",
    dataset: {},
    classList: { toggle: () => undefined },
  };
}

function loadStandaloneRuntime() {
  const html = fs.readFileSync("standalone-kalkulator/index.html", "utf8");
  const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
  assert.ok(scriptMatch, "inline <script> not found in standalone-kalkulator/index.html");

  let script = scriptMatch![1];
  script = script.replace(/\n\s*render\(\);\s*\n?\s*$/, "\n");
  script += "\n;globalThis.__exports = { compute, render, renderResults, renderLineChart, renderStackedBarChart, clampFormValues, setByPath, state, YEAR_RULES };\n";

  const ids = [
    "personA",
    "personB",
    "settings",
    "summary",
    "yearRulesInfo",
    "lineChart",
    "barChart",
    "resultTable",
  ];

  const elements = new Map<string, FakeEl>();
  for (const id of ids) elements.set(id, createFakeEl(id));

  const document = {
    getElementById(id: string) {
      if (!elements.has(id)) elements.set(id, createFakeEl(id));
      return elements.get(id);
    },
    querySelectorAll(_selector: string) {
      return [] as FakeEl[];
    },
    querySelector(_selector: string) {
      return null;
    },
  };

  const context = vm.createContext({
    document,
    window: {},
    console,
    Number,
    Math,
    Array,
    Object,
    String,
    Boolean,
    Date,
    JSON,
  });

  vm.runInContext(script, context);

  const exp = (context as any).__exports;
  assert.ok(exp, "failed to expose runtime exports from standalone script");

  return {
    ...exp,
    elements,
  };
}

function sumBy<T>(items: T[], pick: (v: T) => number) {
  return items.reduce((acc, x) => acc + pick(x), 0);
}

test("standalone: PIT/roczne reguły 2025 vs 2026 wpływają na limit ZUS i wynik", () => {
  const rt = loadStandaloneRuntime();

  rt.state.A.fixedMonthlyGross = 60000;
  rt.state.B.fixedMonthlyGross = 60000;
  rt.state.A.mode = "FIXED_MONTHLY";
  rt.state.B.mode = "FIXED_MONTHLY";
  rt.state.A.pit2MonthlyReduction = 300;
  rt.state.B.pit2MonthlyReduction = 300;
  rt.state.s.finalSettlementMode = "SEPARATE";

  rt.state.s.year = 2025;
  const y2025 = rt.compute(rt.state.A, rt.state.B, rt.state.s);
  const social2025 = sumBy(y2025.rows, (r: any) => r.socialTotal);

  rt.state.s.year = 2026;
  const y2026 = rt.compute(rt.state.A, rt.state.B, rt.state.s);
  const social2026 = sumBy(y2026.rows, (r: any) => r.socialTotal);

  assert.ok(social2026 > social2025, "for very high salaries, 2026 ZUS cap should produce higher social contributions than 2025");
  assert.ok(y2026.taxDue < y2025.taxDue, "higher social contributions in 2026 should reduce annual PIT tax due");
});

test("standalone: miesięczne zaliczki PIT są stabilne po wykorzystaniu kwoty wolnej", () => {
  const rt = loadStandaloneRuntime();

  rt.state.s.year = 2026;
  rt.state.s.finalSettlementMode = "SEPARATE";

  rt.state.A.mode = "FIXED_MONTHLY";
  rt.state.B.mode = "FIXED_MONTHLY";
  rt.state.A.fixedMonthlyGross = 10000;
  rt.state.B.fixedMonthlyGross = 10000;
  rt.state.A.pit2MonthlyReduction = 300;
  rt.state.B.pit2MonthlyReduction = 300;

  const result = rt.compute(rt.state.A, rt.state.B, rt.state.s);

  assert.equal(result.rows.length, 12);
  assert.ok(result.rows[0].pitTotal === 0, "first month should still be inside annual free amount for this setup");

  const month4Pit = Number(result.rows[3].pitTotal.toFixed(2));
  assert.ok(month4Pit > 0, "PIT should be deducted after crossing free amount");

  const fromMonth5 = result.rows.slice(4).map((r: any) => Number(r.pitTotal.toFixed(2)));
  const stablePit = fromMonth5[0];
  for (const pit of fromMonth5) {
    assert.equal(pit, stablePit, "after crossing free amount, PIT cashflow should stay stable month-to-month for fixed salaries below 32% threshold");
  }
});

test("standalone: UI renderuje ustawienia, tabelę i oba wykresy", () => {
  const rt = loadStandaloneRuntime();

  rt.render();

  const settingsHTML = rt.elements.get("settings")!.innerHTML;
  assert.match(settingsHTML, /Rok podatkowy/);
  assert.match(settingsHTML, />2025</);
  assert.match(settingsHTML, />2026</);
  assert.match(settingsHTML, /Rozliczenie roczne/);

  const summaryHTML = rt.elements.get("summary")!.innerHTML;
  assert.match(summaryHTML, /Podatek należny/);

  const tableHTML = rt.elements.get("resultTable")!.innerHTML;
  assert.match(tableHTML, /<thead>/);
  assert.match(tableHTML, /PIT A/);

  const lineChartSVG = rt.elements.get("lineChart")!.innerHTML;
  assert.match(lineChartSVG, /<path/);
  assert.match(lineChartSVG, /kwota wolna/);

  const barChartSVG = rt.elements.get("barChart")!.innerHTML;
  assert.match(barChartSVG, /<rect/);
});

test("standalone: walidacja wejść w interakcji (clamp) działa poprawnie", () => {
  const rt = loadStandaloneRuntime();

  assert.equal(rt.clampFormValues("A.pit2MonthlyReduction", 999), 300);
  assert.equal(rt.clampFormValues("A.pit2MonthlyReduction", -4), 0);
  assert.equal(rt.clampFormValues("A.ppkEmployeePct", 40), 10);
  assert.equal(rt.clampFormValues("A.ppkEmployerPct", -3), 0);
  assert.equal(rt.clampFormValues("s.year", 2030), 2026);
  assert.equal(rt.clampFormValues("s.year", 2025), 2025);

  rt.setByPath("s.year", 2025);
  assert.equal(rt.state.s.year, 2025);
  rt.setByPath("A.fixedMonthlyGross", 12345);
  assert.equal(rt.state.A.fixedMonthlyGross, 12345);
});


test("standalone: compute wybiera reguły na podstawie s.year, nie globalnego state", () => {
  const rt = loadStandaloneRuntime();

  rt.state.s.year = 2026;
  rt.state.A.mode = "FIXED_MONTHLY";
  rt.state.B.mode = "FIXED_MONTHLY";
  rt.state.A.fixedMonthlyGross = 60000;
  rt.state.B.fixedMonthlyGross = 60000;

  const settings2025 = { ...rt.state.s, year: 2025 };
  const settings2026 = { ...rt.state.s, year: 2026 };

  const y2025 = rt.compute(rt.state.A, rt.state.B, settings2025);
  const y2026 = rt.compute(rt.state.A, rt.state.B, settings2026);

  assert.notEqual(Number(y2025.taxDue.toFixed(2)), Number(y2026.taxDue.toFixed(2)));
});

test("standalone: linie progów na wykresie są w skali łącznej podstawy", () => {
  const rt = loadStandaloneRuntime();

  rt.state.s.year = 2026;
  rt.state.s.finalSettlementMode = "SEPARATE";
  rt.render();

  const lineChartSVG = rt.elements.get("lineChart")!.innerHTML;
  assert.match(lineChartSVG, /kwota wolna \(łącznie\)/);
  assert.match(lineChartSVG, /próg 12%\/32% \(łącznie\)/);
});


test("standalone: roundTaxToPln zaokrągla miesięczną zaliczkę PIT dla 0,49/0,50", () => {
  const rt = loadStandaloneRuntime();

  rt.state.s.year = 2026;
  rt.state.s.finalSettlementMode = "SEPARATE";

  rt.state.A.mode = "FIXED_MONTHLY";
  rt.state.B.mode = "FIXED_MONTHLY";
  rt.state.B.fixedMonthlyGross = 0;
  rt.state.B.kupMonthly = 0;
  rt.state.B.pit2MonthlyReduction = 0;

  rt.state.A.kupMonthly = 0;
  rt.state.A.pit2MonthlyReduction = 0;

  const rules = rt.YEAR_RULES[2026];
  rules.freeAmount = 0;
  rules.threshold12 = 1_000_000;
  rules.taxRate1 = 0.12;
  rules.taxRate2 = 0.12;
  rules.zusEmerytalna = 0;
  rules.zusRentowa = 0;
  rules.zusChorobowa = 0;
  rules.healthRate = 0;

  rt.state.A.fixedMonthlyGross = 4.0833333333;
  const low = rt.compute(rt.state.A, rt.state.B, rt.state.s);

  rt.state.A.fixedMonthlyGross = 4.1666666667;
  const high = rt.compute(rt.state.A, rt.state.B, rt.state.s);

  assert.equal(low.rows[0].pitA, 0);
  assert.equal(high.rows[0].pitA, 1);
});

test("standalone: zaokrąglenia wpływają na niedopłatę i nadpłatę", () => {
  const rt = loadStandaloneRuntime();

  rt.state.s.year = 2026;
  rt.state.s.finalSettlementMode = "SEPARATE";

  rt.state.A.mode = "FIXED_MONTHLY";
  rt.state.B.mode = "FIXED_MONTHLY";
  rt.state.B.fixedMonthlyGross = 0;
  rt.state.B.kupMonthly = 0;
  rt.state.B.pit2MonthlyReduction = 0;

  rt.state.A.kupMonthly = 0;
  rt.state.A.pit2MonthlyReduction = 0;

  const rules = rt.YEAR_RULES[2026];
  rules.freeAmount = 0;
  rules.threshold12 = 1_000_000;
  rules.taxRate1 = 0.12;
  rules.taxRate2 = 0.12;
  rules.zusEmerytalna = 0;
  rules.zusRentowa = 0;
  rules.zusChorobowa = 0;
  rules.healthRate = 0;

  rt.state.A.fixedMonthlyGross = 837.4166666667;
  const under = rt.compute(rt.state.A, rt.state.B, rt.state.s);
  assert.equal(under.advancesPaid, 1200);
  assert.equal(under.taxDue, 1206);
  assert.equal(under.underpayment, 6);

  rt.state.A.fixedMonthlyGross = 837.5;
  const over = rt.compute(rt.state.A, rt.state.B, rt.state.s);
  assert.equal(over.advancesPaid, 1212);
  assert.equal(over.taxDue, 1206);
  assert.equal(over.underpayment, -6);
});
