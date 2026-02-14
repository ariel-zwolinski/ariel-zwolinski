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

export type IncomeMode = "ANNUAL" | "FIXED_MONTHLY" | "MONTHLY_LIST";

export type PersonInput = {
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

export type Settings = {
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

export type MonthRow = {
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

export function buildMonthlyGross(p: PersonInput): number[] {
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

export function compute({ A, B, s }: { A: PersonInput; B: PersonInput; s: Settings }) {
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
