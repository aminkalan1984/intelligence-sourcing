import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeQuoteToCIF,
  evaluateSupplierFraudRisk,
  AntiFraudChecklist,
} from './tradeAnalytics';

test('normalizeQuoteToCIF converts FOB to CIF accurately with freight and marine insurance', () => {
  const result = normalizeQuoteToCIF(680, 'FOB', {
    inlandOriginFreight: 15,
    originTHC: 8,
    oceanFreight: 38,
    marineInsuranceRate: 0.0035,
  });

  // FOB + 38 freight = 718. Insurance: 718 * 0.0035 = 2.5. Total ~ 720.5
  assert.equal(result.incoterm, 'FOB');
  assert.equal(result.estimatedOceanFreight, 38);
  assert.ok(result.normalizedCifPrice > 718);
  assert.ok(result.buyerRiskPoint.includes('روی عرشه کشتی'));
});

test('normalizeQuoteToCIF keeps CIF unchanged except zero extra add-ons', () => {
  const result = normalizeQuoteToCIF(725, 'CIF', {
    inlandOriginFreight: 15,
    originTHC: 8,
    oceanFreight: 38,
    marineInsuranceRate: 0.0035,
  });

  assert.equal(result.normalizedCifPrice, 725);
  assert.equal(result.estimatedOceanFreight, 0);
  assert.equal(result.estimatedInlandOriginFreight, 0);
});

test('evaluateSupplierFraudRisk detects high risk shell companies', () => {
  const fakeCompanyChecklist: AntiFraudChecklist = {
    domainAgeYears: 0.2, // 2 months old
    hasGovernmentBusinessLicense: false,
    bankAccountMatchesLegalName: false,
    physicalFactorySatelliteVerified: false,
    hasCustomsExportRecords: false,
    noDisputesInArbitration: true,
    sampleDeliveryAccepted: false,
    unrealisticLowPrice: true,
  };

  const evalResult = evaluateSupplierFraudRisk(fakeCompanyChecklist);
  assert.ok(evalResult.riskScore >= 70);
  assert.equal(evalResult.riskCategory, 'بسیار بالا (احتمال بالای شرکت جعلی)');
  assert.ok(evalResult.flags.length >= 4);
});

test('evaluateSupplierFraudRisk certifies legitimate manufacturers', () => {
  const legitManufacturer: AntiFraudChecklist = {
    domainAgeYears: 14,
    hasGovernmentBusinessLicense: true,
    bankAccountMatchesLegalName: true,
    physicalFactorySatelliteVerified: true,
    hasCustomsExportRecords: true,
    noDisputesInArbitration: true,
    sampleDeliveryAccepted: true,
    unrealisticLowPrice: false,
  };

  const evalResult = evaluateSupplierFraudRisk(legitManufacturer);
  assert.equal(evalResult.riskScore, 0);
  assert.equal(evalResult.riskCategory, 'بسیار کم (تولیدکننده معتبر)');
  assert.equal(evalResult.flags.length, 0);
});
