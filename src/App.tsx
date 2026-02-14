import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "@/components/ui/icon";
import { Info } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Tooltip as RTooltip,
} from "@/components/ui/recharts";

const MONTHS = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

const clamp0 = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const round0 = (n: number) => Math.round(n + Number.EPSILON);

type IncomeMode = "ANNUAL" | "FIXED_MONTHLY" | "MONTHLY_LIST";

type PersonInput = {
  name: string;
  mode: IncomeMode;
  annualGross: number;
  fixedMonthlyGross: number;
  monthlyGross: number[];
  pit2MonthlyReduction: number;
  kupMonthly: number;
  enablePpk: boolean;
  ppkEmployeePct: number;
  ppkEmployerPct: number;
};

type Settings = {
  year: 2026;
  jointSettlement: boolean;
  enableJointAwareWithholding: boolean;
  threshold12: number;
  freeAmount: number;
  taxRate1: number;
  taxRate2: number;
  monthlyTaxReductionMax: number;
  zusEmerytalna: number;
  zusRentowa: number;
  zusChorobowa: number;
  zusCapAnnual: number;
  healthRate: number;
  savingsBufferPct: number;
};

type MonthRow = {
  m: number;
  month: string;
  grossA: number;
  grossB: number;
  grossTotal: number;
  socialA: number;
  socialB: number;
  socialTotal: number;
  healthBaseA: number;
  healthBaseB: number;
  healthA: number;
  healthB: number;
  ppkEmpA: number;
  ppkEmpB: number;
  ppkErA: number;
  ppkErB: number;
  taxBaseA: number;
  taxBaseB: number;
  taxBaseCumA: number;
  taxBaseCumB: number;
  taxBaseCumTotal: number;
  pitA: number;
  pitB: number;
  pitTotal: number;
  netA: number;
  netB: number;
  netTotal: number;
  status: "KWOTA_WOLNA" | "12" | "POZYCZONY_12" | "32";
};

function buildMonthlyGross(p: PersonInput): number[] {
  if (p.mode === "ANNUAL") {
    const m = round2((p.annualGross || 0) / 12);
    return Array.from({ length: 12 }, () => m);
  }
  if (p.mode === "FIXED_MONTHLY") {
    const m = round2(p.fixedMonthlyGross || 0);
    return Array.from({ length: 12 }, () => m);
  }
  return (p.monthlyGross?.length === 12 ? p.monthlyGross : Array(12).fill(0)).map((x) => round2(x || 0));
}

function calcEmployeeSocial(gross: number, cumPensionBase: number, s: Settings) {
  const grossClamped = clamp0(gross);
  const remainingCap = Math.max(0, s.zusCapAnnual - cumPensionBase);
  const pensionBaseThisMonth = Math.min(grossClamped, remainingCap);
  const emerytalna = pensionBaseThisMonth * s.zusEmerytalna;
  const rentowa = pensionBaseThisMonth * s.zusRentowa;
  const chorobowa = grossClamped * s.zusChorobowa;
  return {
    emerytalna,
    rentowa,
    chorobowa,
    pensionBaseThisMonth,
    socialTotal: emerytalna + rentowa + chorobowa,
  };
}

function calcHealth(healthBase: number, s: Settings) {
  return clamp0(healthBase) * s.healthRate;
}

function annualTaxForBase(taxBaseAnnual: number, s: Settings) {
  const base = clamp0(taxBaseAnnual);
  const free = s.freeAmount;
  const thr = s.threshold12;
  const rate1 = s.taxRate1;
  const rate2 = s.taxRate2;
  if (base <= free) return 0;
  if (base <= thr) return (base - free) * rate1;
  return (thr - free) * rate1 + (base - thr) * rate2;
}

function formatPLN(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return v.toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

function bandLabel(status: MonthRow["status"]) {
  switch (status) {
    case "KWOTA_WOLNA":
      return "Kwota wolna";
    case "12":
      return "12%";
    case "POZYCZONY_12":
      return "Pożyczony limit 12%";
    case "32":
      return "32%";
  }
}

function bandBg(status: MonthRow["status"]) {
  switch (status) {
    case "KWOTA_WOLNA":
      return "bg-emerald-50";
    case "12":
      return "bg-sky-50";
    case "POZYCZONY_12":
      return "bg-amber-50";
    case "32":
      return "bg-rose-50";
  }
}

function help(text: string) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 text-muted-foreground cursor-help">
            <Info className="h-4 w-4" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[420px] text-sm leading-snug">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function NumberField({
  value,
  onChange,
  step = 1,
  min,
  max,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <Input
      inputMode="decimal"
      value={Number.isFinite(value) ? String(value) : ""}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value.replace(",", ".");
        const n = raw === "" ? 0 : Number(raw);
        const clamped = Number.isFinite(n)
          ? Math.max(min ?? -Infinity, Math.min(max ?? Infinity, n))
          : 0;
        onChange(clamped);
      }}
      step={step}
    />
  );
}

function PersonForm({
  person,
  onChange,
}: {
  person: PersonInput;
  onChange: (p: PersonInput) => void;
}) {
  const monthly = useMemo(() => buildMonthlyGross(person), [person]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label>Imię / etykieta</Label>
          <Input value={person.name} onChange={(e) => onChange({ ...person, name: e.target.value })} />
        </div>

        <div>
          <Label>Tryb wprowadzania brutto</Label>
          <Select value={person.mode} onValueChange={(v) => onChange({ ...person, mode: v as IncomeMode })}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANNUAL">Jedna kwota roczna</SelectItem>
              <SelectItem value="FIXED_MONTHLY">Stała kwota miesięczna</SelectItem>
              <SelectItem value="MONTHLY_LIST">Każdy miesiąc osobno</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>KUP miesięczne (koszty uzyskania)</Label>
          <div className="flex items-center gap-2">
            <NumberField
              value={person.kupMonthly}
              onChange={(v) => onChange({ ...person, kupMonthly: clamp0(v) })}
              step={10}
              min={0}
            />
            {help(
              "Uproszczenie: przyjmujemy stałe KUP miesięczne. Typowe wartości: 250 zł (standard) lub 300 zł (podwyższone)."
            )}
          </div>
        </div>
      </div>

      {person.mode === "ANNUAL" && (
        <div>
          <Label>Brutto roczne</Label>
          <NumberField value={person.annualGross} onChange={(v) => onChange({ ...person, annualGross: clamp0(v) })} />
        </div>
      )}

      {person.mode === "FIXED_MONTHLY" && (
        <div>
          <Label>Brutto miesięczne</Label>
          <NumberField
            value={person.fixedMonthlyGross}
            onChange={(v) => onChange({ ...person, fixedMonthlyGross: clamp0(v) })}
          />
        </div>
      )}

      {person.mode === "MONTHLY_LIST" && (
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label>Brutto w miesiącach</Label>
            <Button
              variant="secondary"
              onClick={() => {
                const avg = round2(
                  (person.monthlyGross.reduce((a, b) => a + (Number(b) || 0), 0) || 0) / 12
                );
                onChange({ ...person, monthlyGross: Array.from({ length: 12 }, () => avg) });
              }}
            >
              Wyrównaj do średniej
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MONTHS.map((m, i) => (
              <div key={m}>
                <Label className="text-xs">{m}</Label>
                <NumberField
                  value={person.monthlyGross[i] || 0}
                  onChange={(v) => {
                    const next = [...person.monthlyGross];
                    next[i] = clamp0(v);
                    onChange({ ...person, monthlyGross: next });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label>PIT-2: miesięczna kwota zmniejszająca</Label>
          <div className="flex items-center gap-2">
            <NumberField
              value={person.pit2MonthlyReduction}
              onChange={(v) => onChange({ ...person, pit2MonthlyReduction: Math.max(0, Math.min(300, v)) })}
              step={10}
              min={0}
              max={300}
            />
            {help("Uproszczenie: 0–300 zł/mies. W praktyce zależy od oświadczeń (PIT-2) i sytuacji podatnika.")}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border p-3">
          <div>
            <div className="font-medium">PPK</div>
            <div className="text-xs text-muted-foreground">
              wpłata pracownika po opodatkowaniu; wpłata pracodawcy opodatkowana PIT
            </div>
          </div>
          <Switch checked={person.enablePpk} onCheckedChange={(v) => onChange({ ...person, enablePpk: v })} />
        </div>

        {person.enablePpk ? (
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">PPK pracownik (%)</Label>
                <NumberField
                  value={person.ppkEmployeePct}
                  onChange={(v) => onChange({ ...person, ppkEmployeePct: Math.max(0, Math.min(10, v)) })}
                  step={0.5}
                  min={0}
                  max={10}
                />
              </div>
              <div>
                <Label className="text-xs">PPK pracodawca (%)</Label>
                <NumberField
                  value={person.ppkEmployerPct}
                  onChange={(v) => onChange({ ...person, ppkEmployerPct: Math.max(0, Math.min(10, v)) })}
                  step={0.5}
                  min={0}
                  max={10}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border p-3 text-sm text-muted-foreground">PPK wyłączone</div>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Podgląd brutto (miesięcznie):</div>
          <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            {monthly.map((v, i) => (
              <div key={i} className="rounded-lg border p-2">
                <div className="text-muted-foreground">{i + 1}</div>
                <div className="font-medium">{formatPLN(v)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function compute({ A, B, s }: { A: PersonInput; B: PersonInput; s: Settings }) {
  const grossA = buildMonthlyGross(A);
  const grossB = buildMonthlyGross(B);

  let cumPensionBaseA = 0;
  let cumPensionBaseB = 0;

  let cumTaxBaseA = 0;
  let cumTaxBaseB = 0;

  const rows: MonthRow[] = [];

  let cumJointBase = 0;

  const jointFree = s.jointSettlement ? 2 * s.freeAmount : s.freeAmount;
  const jointThr12 = s.jointSettlement ? 2 * s.threshold12 : s.threshold12;

  for (let m = 0; m < 12; m++) {
    const gA = clamp0(grossA[m]);
    const gB = clamp0(grossB[m]);

    const ppkEmpA = A.enablePpk ? gA * (A.ppkEmployeePct / 100) : 0;
    const ppkErA = A.enablePpk ? gA * (A.ppkEmployerPct / 100) : 0;
    const ppkEmpB = B.enablePpk ? gB * (B.ppkEmployeePct / 100) : 0;
    const ppkErB = B.enablePpk ? gB * (B.ppkEmployerPct / 100) : 0;

    const socA = calcEmployeeSocial(gA, cumPensionBaseA, s);
    const socB = calcEmployeeSocial(gB, cumPensionBaseB, s);
    cumPensionBaseA += socA.pensionBaseThisMonth;
    cumPensionBaseB += socB.pensionBaseThisMonth;

    const socialA = socA.socialTotal;
    const socialB = socB.socialTotal;

    const healthBaseA = gA - socialA;
    const healthBaseB = gB - socialB;
    const healthA = calcHealth(healthBaseA, s);
    const healthB = calcHealth(healthBaseB, s);

    const taxBaseA = clamp0(gA - socialA - (A.kupMonthly || 0) + ppkErA);
    const taxBaseB = clamp0(gB - socialB - (B.kupMonthly || 0) + ppkErB);

    const nextCumA = cumTaxBaseA + taxBaseA;
    const nextCumB = cumTaxBaseB + taxBaseB;

    let pitA = 0;
    let pitB = 0;

    if (s.jointSettlement && s.enableJointAwareWithholding) {
      const jointBaseThisMonth = taxBaseA + taxBaseB;
      const nextCumJoint = cumJointBase + jointBaseThisMonth;

      const jointTaxCum = annualTaxForBase(nextCumJoint, { ...s, freeAmount: jointFree, threshold12: jointThr12 });
      const jointTaxPrev = annualTaxForBase(cumJointBase, { ...s, freeAmount: jointFree, threshold12: jointThr12 });
      const jointIncrement = Math.max(0, jointTaxCum - jointTaxPrev);

      const denom = jointBaseThisMonth > 0 ? jointBaseThisMonth : 1;
      pitA = jointIncrement * (taxBaseA / denom);
      pitB = jointIncrement * (taxBaseB / denom);

      pitA = Math.max(0, pitA - (A.pit2MonthlyReduction || 0));
      pitB = Math.max(0, pitB - (B.pit2MonthlyReduction || 0));

      cumJointBase = nextCumJoint;
    } else {
      const taxCumA = annualTaxForBase(nextCumA, s);
      const taxPrevA = annualTaxForBase(cumTaxBaseA, s);
      pitA = Math.max(0, taxCumA - taxPrevA - (A.pit2MonthlyReduction || 0));

      const taxCumB = annualTaxForBase(nextCumB, s);
      const taxPrevB = annualTaxForBase(cumTaxBaseB, s);
      pitB = Math.max(0, taxCumB - taxPrevB - (B.pit2MonthlyReduction || 0));
    }

    cumTaxBaseA = nextCumA;
    cumTaxBaseB = nextCumB;

    const cumTotal = cumTaxBaseA + cumTaxBaseB;

    const pitTotal = pitA + pitB;

    const netA = clamp0(gA - socialA - healthA - pitA - ppkEmpA);
    const netB = clamp0(gB - socialB - healthB - pitB - ppkEmpB);

    let status: MonthRow["status"] = "12";
    if (s.jointSettlement) {
      if (cumTotal <= 2 * s.freeAmount) status = "KWOTA_WOLNA";
      else if (cumTotal <= 2 * s.threshold12) {
        const borrowed = cumTaxBaseA > s.threshold12 || cumTaxBaseB > s.threshold12;
        status = borrowed ? "POZYCZONY_12" : "12";
      } else status = "32";
    } else {
      if (cumTotal <= s.freeAmount) status = "KWOTA_WOLNA";
      else if (cumTotal <= s.threshold12) status = "12";
      else status = "32";
    }

    rows.push({
      m: m + 1,
      month: MONTHS[m],
      grossA: gA,
      grossB: gB,
      grossTotal: gA + gB,
      socialA,
      socialB,
      socialTotal: socialA + socialB,
      healthBaseA,
      healthBaseB,
      healthA,
      healthB,
      ppkEmpA,
      ppkEmpB,
      ppkErA,
      ppkErB,
      taxBaseA,
      taxBaseB,
      taxBaseCumA: cumTaxBaseA,
      taxBaseCumB: cumTaxBaseB,
      taxBaseCumTotal: cumTotal,
      pitA,
      pitB,
      pitTotal,
      netA,
      netB,
      netTotal: netA + netB,
      status,
    });
  }

  const annualBaseA = rows.reduce((a, r) => a + r.taxBaseA, 0);
  const annualBaseB = rows.reduce((a, r) => a + r.taxBaseB, 0);
  const annualBaseTotal = annualBaseA + annualBaseB;

  const annualTaxA = annualTaxForBase(annualBaseA, s);
  const annualTaxB = annualTaxForBase(annualBaseB, s);

  const annualTaxJoint = annualTaxForBase(annualBaseTotal, {
    ...s,
    freeAmount: s.jointSettlement ? 2 * s.freeAmount : s.freeAmount,
    threshold12: s.jointSettlement ? 2 * s.threshold12 : s.threshold12,
  });

  const advancesPaid = rows.reduce((a, r) => a + r.pitTotal, 0);

  const taxDue = s.jointSettlement ? annualTaxJoint : annualTaxA + annualTaxB;
  const underpayment = taxDue - advancesPaid;

  const netTotalAnnual = rows.reduce((a, r) => a + r.netTotal, 0);

  const target = Math.max(0, underpayment) * (1 + s.savingsBufferPct / 100);
  const suggestedMonthlySaving = target / 12;
  const savingsRate = netTotalAnnual > 0 ? suggestedMonthlySaving / (netTotalAnnual / 12) : 0;

  return {
    rows,
    annualBaseA,
    annualBaseB,
    annualBaseTotal,
    advancesPaid,
    taxDue,
    underpayment,
    target,
    suggestedMonthlySaving,
    savingsRate,
  };
}

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    year: 2026,
    jointSettlement: true,
    enableJointAwareWithholding: true,
    threshold12: 120000,
    freeAmount: 30000,
    taxRate1: 0.12,
    taxRate2: 0.32,
    monthlyTaxReductionMax: 300,
    zusEmerytalna: 0.0976,
    zusRentowa: 0.015,
    zusChorobowa: 0.0245,
    zusCapAnnual: 282600,
    healthRate: 0.09,
    savingsBufferPct: 10,
  });

  const [A, setA] = useState<PersonInput>({
    name: "Osoba A",
    mode: "FIXED_MONTHLY",
    annualGross: 0,
    fixedMonthlyGross: 15000,
    monthlyGross: Array(12).fill(0),
    pit2MonthlyReduction: 300,
    kupMonthly: 250,
    enablePpk: false,
    ppkEmployeePct: 2,
    ppkEmployerPct: 1.5,
  });

  const [B, setB] = useState<PersonInput>({
    name: "Osoba B",
    mode: "FIXED_MONTHLY",
    annualGross: 0,
    fixedMonthlyGross: 8000,
    monthlyGross: Array(12).fill(0),
    pit2MonthlyReduction: 300,
    kupMonthly: 250,
    enablePpk: false,
    ppkEmployeePct: 2,
    ppkEmployerPct: 1.5,
  });

  const result = useMemo(() => compute({ A, B, s: settings }), [A, B, settings]);

  const chartData = useMemo(
    () =>
      result.rows.map((r) => ({
        month: r.m,
        "Podstawa PIT narastająco (razem)": round0(r.taxBaseCumTotal),
      })),
    [result.rows]
  );

  const jointFree = settings.jointSettlement ? 2 * settings.freeAmount : settings.freeAmount;
  const jointThr12 = settings.jointSettlement ? 2 * settings.threshold12 : settings.threshold12;

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl grid gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold">Kalkulator wynagrodzeń 2026 (Polska) – małżeństwo</div>
            <div className="text-sm text-muted-foreground mt-1">
              Umowa o pracę • planowanie zaliczek PIT i progów (kwota wolna / 12% / pożyczony 12% / 32%)
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Tryb:</div>
            <div className="text-sm font-medium">{settings.jointSettlement ? "Wspólne rozliczenie" : "Osobno"}</div>
          </div>
        </div>

        <Tabs defaultValue="wynik" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="wynik">Wynik</TabsTrigger>
            <TabsTrigger value="osobaA">Osoba A</TabsTrigger>
            <TabsTrigger value="osobaB">Osoba B</TabsTrigger>
            <TabsTrigger value="ustawienia">Ustawienia</TabsTrigger>
          </TabsList>

          <TabsContent value="osobaA" className="mt-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <PersonForm person={A} onChange={setA} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="osobaB" className="mt-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <PersonForm person={B} onChange={setB} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ustawienia" className="mt-4">
            <Card>
              <CardContent className="p-4 md:p-6 grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">Wspólne rozliczenie</div>
                      <div className="text-xs text-muted-foreground">skala liczona łącznie (kwota wolna 60k, próg 240k)</div>
                    </div>
                    <Switch
                      checked={settings.jointSettlement}
                      onCheckedChange={(v) => setSettings((x) => ({ ...x, jointSettlement: v }))}
                    />
                  </div>

                  <div className="rounded-xl border p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">Pomniejszaj zaliczki „pod wspólne”</div>
                      <div className="text-xs text-muted-foreground">symuluje pożyczanie limitu 12% w trakcie roku</div>
                    </div>
                    <Switch
                      checked={settings.enableJointAwareWithholding}
                      onCheckedChange={(v) => setSettings((x) => ({ ...x, enableJointAwareWithholding: v }))}
                      disabled={!settings.jointSettlement}
                    />
                  </div>

                  <div>
                    <Label>Bufor oszczędzania (%)</Label>
                    <NumberField
                      value={settings.savingsBufferPct}
                      onChange={(v) => setSettings((x) => ({ ...x, savingsBufferPct: Math.max(0, Math.min(50, v)) }))}
                      step={1}
                      min={0}
                      max={50}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Kwota wolna (na osobę)</Label>
                    <NumberField
                      value={settings.freeAmount}
                      onChange={(v) => setSettings((x) => ({ ...x, freeAmount: Math.max(0, v) }))}
                      step={100}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label>Próg 12% (na osobę)</Label>
                    <NumberField
                      value={settings.threshold12}
                      onChange={(v) => setSettings((x) => ({ ...x, threshold12: Math.max(0, v) }))}
                      step={1000}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label>Limit 30-krotności ZUS (rocznie)</Label>
                    <NumberField
                      value={settings.zusCapAnnual}
                      onChange={(v) => setSettings((x) => ({ ...x, zusCapAnnual: Math.max(0, v) }))}
                      step={1000}
                      min={0}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wynik" className="mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Podatek należny (rocznie)</div>
                    <div className="text-2xl font-semibold mt-1">{formatPLN(result.taxDue)}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {settings.jointSettlement
                        ? `Wspólnie: kwota wolna ${formatPLN(jointFree)} • próg 12% do ${formatPLN(jointThr12)}`
                        : `Osobno: kwota wolna ${formatPLN(settings.freeAmount)} • próg 12% do ${formatPLN(
                            settings.threshold12
                          )}`}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Suma zaliczek PIT (w roku)</div>
                    <div className="text-2xl font-semibold mt-1">{formatPLN(result.advancesPaid)}</div>
                    <div className="text-xs text-muted-foreground mt-2">Różnica = niedopłata (+) / nadpłata (−)</div>
                    <div
                      className={`mt-2 text-sm font-medium ${
                        result.underpayment > 0 ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {formatPLN(result.underpayment)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Oszczędzanie na ewentualną niedopłatę</div>
                    <div className="text-2xl font-semibold mt-1">{formatPLN(result.suggestedMonthlySaving)} / mies.</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Cel (z buforem): {formatPLN(result.target)} • stopa: {(result.savingsRate * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">Wizualizacja progów (narastająca podstawa PIT)</div>
                      <div className="text-sm text-muted-foreground">
                        Zielone: kwota wolna • Niebieskie: 12% • Bursztynowe: pożyczony limit 12% • Czerwone: 32%
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickFormatter={(v) => String(v)} />
                        <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                        <RTooltip formatter={(v: any) => formatPLN(Number(v))} labelFormatter={(l) => `Miesiąc ${l}`} />
                        <Legend />
                        <ReferenceLine y={jointFree} strokeDasharray="4 4" label="kwota wolna" />
                        <ReferenceLine y={jointThr12} strokeDasharray="4 4" label="próg 12%" />
                        <Line type="monotone" dataKey="Podstawa PIT narastająco (razem)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background">
                      <tr className="border-b">
                        <th className="text-left p-3">Mies.</th>
                        <th className="text-right p-3">Brutto A</th>
                        <th className="text-right p-3">Brutto B</th>
                        <th className="text-right p-3">PIT A</th>
                        <th className="text-right p-3">PIT B</th>
                        <th className="text-right p-3">Netto A</th>
                        <th className="text-right p-3">Netto B</th>
                        <th className="text-right p-3">Podstawa PIT (razem) nar.</th>
                        <th className="text-left p-3">Strefa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((r) => (
                        <tr key={r.m} className={`border-b ${bandBg(r.status)}`}>
                          <td className="p-3 whitespace-nowrap">{r.m}</td>
                          <td className="p-3 text-right whitespace-nowrap">{formatPLN(r.grossA)}</td>
                          <td className="p-3 text-right whitespace-nowrap">{formatPLN(r.grossB)}</td>
                          <td className="p-3 text-right whitespace-nowrap">{formatPLN(r.pitA)}</td>
                          <td className="p-3 text-right whitespace-nowrap">{formatPLN(r.pitB)}</td>
                          <td className="p-3 text-right whitespace-nowrap">{formatPLN(r.netA)}</td>
                          <td className="p-3 text-right whitespace-nowrap">{formatPLN(r.netB)}</td>
                          <td className="p-3 text-right whitespace-nowrap">{formatPLN(r.taxBaseCumTotal)}</td>
                          <td className="p-3 whitespace-nowrap font-medium">{bandLabel(r.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
            <div className="font-medium text-foreground">Co dokładnie pokazuje „pożyczony limit 12%”</div>
            <div className="mt-1">
              Przy wspólnym rozliczeniu, próg 12% działa jak 240 000 zł łącznej podstawy. Jeśli jedna osoba przekroczy 120 000 zł,
              ale razem nadal jesteście ≤ 240 000 zł, to w ujęciu rocznym część dochodu tej osoby nadal „mieści się” w 12% – dzięki
              niewykorzystanej części progu drugiej osoby. Tę sytuację oznaczamy jako „pożyczony limit 12%”.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
