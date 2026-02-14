import test from "node:test";
import assert from "node:assert/strict";

import { compute, type PersonInput, type Settings } from "../src/lib/compute.ts";

function baseSettings(): Settings {
  return {
    year: 2026,
    jointSettlement: false,
    enableJointAwareWithholding: false,
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
  };
}

function person(name: string, gross: number): PersonInput {
  return {
    name,
    mode: "FIXED_MONTHLY",
    annualGross: 0,
    fixedMonthlyGross: gross,
    monthlyGross: Array(12).fill(0),
    pit2MonthlyReduction: 0,
    kupMonthly: 250,
    enablePpk: false,
    ppkEmployeePct: 2,
    ppkEmployerPct: 1.5,
  };
}

test("compute returns 12 rows and positive totals for simple fixed salaries", () => {
  const result = compute({
    A: person("A", 10000),
    B: person("B", 8000),
    s: baseSettings(),
  });

  assert.equal(result.rows.length, 12);
  assert.ok(result.annualBaseTotal > 0);
  assert.ok(result.taxDue >= 0);
});

test("compute handles zero gross incomes without NaN", () => {
  const result = compute({
    A: person("A", 0),
    B: person("B", 0),
    s: baseSettings(),
  });

  assert.equal(result.taxDue, 0);
  assert.equal(result.underpayment, 0);
  assert.ok(result.rows.every((row) => Number.isFinite(row.netTotal) && row.netTotal === 0));
});
