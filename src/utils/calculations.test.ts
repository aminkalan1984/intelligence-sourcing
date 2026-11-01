import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLandedCost,
  computeSupplierRankings,
  calculateProductCompleteness,
  RawSupplierMetric,
} from './calculations';
import { toPersianDigits, formatPersianNumber, formatPersianPercent } from './formatters';
import { LandedCostBreakdown, RankingWeights } from '../types';

test('toPersianDigits converts ASCII numbers to Persian numerals', () => {
  assert.equal(toPersianDigits(12345), '۱۲۳۴۵');
  assert.equal(toPersianDigits('RFQ-0142'), 'RFQ-۰۱۴۲');
  assert.equal(toPersianDigits('7210.49'), '۷۲۱۰.۴۹');
});

test('formatPersianNumber formats thousand separators and decimals', () => {
  assert.equal(formatPersianNumber(184000), '۱۸۴٬۰۰۰');
  assert.equal(formatPersianNumber(8.7, 1), '۸٫۷');
});

test('formatPersianPercent produces signed and unsigned Persian percentages', () => {
  assert.equal(formatPersianPercent(-8.7, true), '−۸٫۷٪');
  assert.equal(formatPersianPercent(5.2, true), '+۵٫۲٪');
  assert.equal(formatPersianPercent(83, false), '۸۳٫۰٪');
});

test('calculateLandedCost computes total and unit costs accurately for base scenario', () => {
  const base: LandedCostBreakdown = {
    supplierId: 'hanoi-steel',
    supplierName: 'Hanoi Steel Works',
    unitPrice: 680,
    quantity: 100,
    currency: 'USD',
    deliveryPoint: 'بندر عباس',
    incoterm: 'FOB',
    packaging: 800,
    inlandFreight: 1200,
    internationalFreight: 4500,
    insurance: 350,
    duties: 3200,
    customsClearance: 1100,
    otherExpenses: 650,
    totalLandedCost: 0,
    unitLandedCost: 0,
    leadTimeDays: 28,
    paymentTerms: 'LC 60 روزه',
    fxRisk: 'پایین',
    inspectionCost: 750,
  };

  const calculated = calculateLandedCost(base, 'base');
  // Goods: 680 * 100 = 68,000
  // Freight & extras: 1200 + 4500 + insurance + 3200 + 1100 + 650 = 10,650 + insurance
  assert.ok(calculated.totalLandedCost > 78000);
  assert.equal(calculated.unitLandedCost, Math.round((calculated.totalLandedCost / 100) * 10) / 10);
});

test('calculateLandedCost adjusts freight in freight_plus_20 scenario', () => {
  const base: LandedCostBreakdown = {
    supplierId: 'hanoi-steel',
    supplierName: 'Hanoi Steel Works',
    unitPrice: 680,
    quantity: 100,
    currency: 'USD',
    deliveryPoint: 'بندر عباس',
    incoterm: 'FOB',
    packaging: 500,
    inlandFreight: 1000,
    internationalFreight: 4000,
    insurance: 300,
    duties: 3000,
    customsClearance: 1000,
    otherExpenses: 500,
    totalLandedCost: 0,
    unitLandedCost: 0,
    leadTimeDays: 28,
    paymentTerms: 'LC 60 روزه',
    fxRisk: 'پایین',
    inspectionCost: 700,
  };

  const resultBase = calculateLandedCost(base, 'base');
  const resultFreightSurge = calculateLandedCost(base, 'freight_plus_20');

  assert.equal(resultFreightSurge.internationalFreight, 4800); // 4000 * 1.2
  assert.ok(resultFreightSurge.totalLandedCost > resultBase.totalLandedCost);
});

test('computeSupplierRankings ranks suppliers according to weights', () => {
  const metrics: RawSupplierMetric[] = [
    {
      supplierId: 's1',
      supplierName: 'Hanoi Steel',
      unitLandedCost: 780,
      trustScore: 88,
      qualityScore: 90,
      capacityScore: 85,
      leadTimeDays: 28,
      paymentScore: 80,
      countryRiskScore: 20,
      responsivenessScore: 92,
    },
    {
      supplierId: 's2',
      supplierName: 'Risky Cheap Metal',
      unitLandedCost: 720,
      trustScore: 50,
      qualityScore: 65,
      capacityScore: 60,
      leadTimeDays: 45,
      paymentScore: 40,
      countryRiskScore: 60,
      responsivenessScore: 55,
    },
  ];

  const weights: RankingWeights = {
    landedCost: 30,
    trustScore: 20,
    quality: 15,
    capacity: 10,
    leadTime: 10,
    paymentTerms: 5,
    countryRisk: 5,
    responsiveness: 5,
  };

  const ranked = computeSupplierRankings(metrics, weights);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked[1].rank, 2);
  assert.equal(ranked[0].supplierId, 's1');
});

test('calculateProductCompleteness calculates accurate percentage', () => {
  const emptyScore = calculateProductCompleteness({});
  assert.equal(emptyScore, 0);

  const fullScore = calculateProductCompleteness({
    name: 'ورق گالوانیزه',
    hsCode: '7210.49',
    usage: 'صنایع خودرو و لوازم خانگی',
    standardsCount: 3,
    material: 'فولاد نورد سرد DX51D+Z',
    dimensions: 'عرض ۱۲۵۰ میلیمتر، ضخامت ۰٫۸',
    qualityGrade: 'درجه یک تجاری Prime',
    moq: 50,
    volume: 500,
    countriesCount: 4,
    leadTime: 30,
    budget: 350000,
    paymentTerms: 'اعتبار اسنادی LC',
    destination: 'بندر شهید رجایی',
    incoterm: 'CIF',
  });
  assert.equal(fullScore, 100);
});
