import { LandedCostBreakdown, RankingWeights } from '../types';

export type ScenarioType = 'base' | 'fx_plus_5' | 'freight_plus_20';

/**
 * Calculates landed cost with sensitivity scenario adjustments.
 */
export function calculateLandedCost(
  base: LandedCostBreakdown,
  scenario: ScenarioType
): LandedCostBreakdown {
  let unitPrice = base.unitPrice;
  let internationalFreight = base.internationalFreight;
  let inlandFreight = base.inlandFreight;

  if (scenario === 'fx_plus_5') {
    // Foreign exchange rate increases costs by 5%
    unitPrice = Math.round(base.unitPrice * 1.05 * 10) / 10;
  } else if (scenario === 'freight_plus_20') {
    // International shipping / freight surges by 20%
    internationalFreight = Math.round(base.internationalFreight * 1.2 * 10) / 10;
  }

  // Insurance is typically proportional to goods value (approx 0.35%)
  const insurance = Math.round((unitPrice * base.quantity * 0.0035 + base.insurance * 0.5) * 10) / 10;
  
  // Total cost formula as specified:
  // (قیمت کالا + حمل + بیمه + عوارض + ترخیص + هزینه‌های جانبی)
  const totalLandedCost = Math.round(
    (unitPrice * base.quantity) +
    inlandFreight +
    internationalFreight +
    insurance +
    base.duties +
    base.customsClearance +
    base.otherExpenses
  );

  const unitLandedCost = Math.round((totalLandedCost / (base.quantity || 1)) * 10) / 10;

  return {
    ...base,
    unitPrice,
    internationalFreight,
    inlandFreight,
    insurance,
    totalLandedCost,
    unitLandedCost,
  };
}

export interface SupplierRankingResult {
  supplierId: string;
  supplierName: string;
  totalScore: number; // 0-100
  rank: number;
}

export interface RawSupplierMetric {
  supplierId: string;
  supplierName: string;
  unitLandedCost: number;
  trustScore: number;
  qualityScore: number;
  capacityScore: number;
  leadTimeDays: number;
  paymentScore: number;
  countryRiskScore: number; // lower is safer
  responsivenessScore: number;
}

/**
 * Computes multi-criteria weighted ranking based on 8 user-adjustable slider weights.
 */
export function computeSupplierRankings(
  metrics: RawSupplierMetric[],
  weights: RankingWeights
): SupplierRankingResult[] {
  if (!metrics || metrics.length === 0) return [];

  // Normalize weights so they sum to 100
  const totalWeight =
    weights.landedCost +
    weights.trustScore +
    weights.quality +
    weights.capacity +
    weights.leadTime +
    weights.paymentTerms +
    weights.countryRisk +
    weights.responsiveness || 100;

  // Find min and max for normalizing
  const minCost = Math.min(...metrics.map((m) => m.unitLandedCost));
  const maxCost = Math.max(...metrics.map((m) => m.unitLandedCost));
  const minLeadTime = Math.min(...metrics.map((m) => m.leadTimeDays));
  const maxLeadTime = Math.max(...metrics.map((m) => m.leadTimeDays));

  const scored = metrics.map((m) => {
    // Cost score: lower is better (100 if min, 50 if max, or scaled)
    const costScore =
      maxCost === minCost ? 100 : 100 - ((m.unitLandedCost - minCost) / (maxCost - minCost)) * 50;

    // Trust: 0 to 100
    const trust = m.trustScore;

    // Quality: 0 to 100
    const quality = m.qualityScore;

    // Capacity: 0 to 100
    const capacity = m.capacityScore;

    // Lead time: lower is better
    const leadTimeScore =
      maxLeadTime === minLeadTime
        ? 100
        : 100 - ((m.leadTimeDays - minLeadTime) / (maxLeadTime - minLeadTime)) * 50;

    // Payment: 0 to 100
    const payment = m.paymentScore;

    // Country risk: lower risk is better score
    const countryScore = Math.max(0, 100 - m.countryRiskScore);

    // Responsiveness: 0 to 100
    const resp = m.responsivenessScore;

    const weightedScore =
      (costScore * weights.landedCost +
        trust * weights.trustScore +
        quality * weights.quality +
        capacity * weights.capacity +
        leadTimeScore * weights.leadTime +
        payment * weights.paymentTerms +
        countryScore * weights.countryRisk +
        resp * weights.responsiveness) /
      totalWeight;

    return {
      supplierId: m.supplierId,
      supplierName: m.supplierName,
      totalScore: Math.round(weightedScore * 10) / 10,
      rank: 1,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.totalScore - a.totalScore);

  // Assign ranks
  return scored.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

/**
 * Computes product specification completeness percentage based on active form fields.
 */
export function calculateProductCompleteness(fields: {
  name?: string;
  hsCode?: string;
  usage?: string;
  standardsCount?: number;
  material?: string;
  dimensions?: string;
  qualityGrade?: string;
  moq?: number;
  volume?: number;
  countriesCount?: number;
  leadTime?: number;
  budget?: number;
  paymentTerms?: string;
  destination?: string;
  incoterm?: string;
}): number {
  let score = 0;
  const weights: [boolean, number][] = [
    [Boolean(fields.name?.trim()), 10],
    [Boolean(fields.hsCode?.trim()), 10],
    [Boolean(fields.usage?.trim()), 5],
    [Boolean(fields.standardsCount && fields.standardsCount > 0), 10],
    [Boolean(fields.material?.trim()), 10],
    [Boolean(fields.dimensions?.trim()), 5],
    [Boolean(fields.qualityGrade?.trim()), 5],
    [Boolean(fields.moq && fields.moq > 0), 10],
    [Boolean(fields.volume && fields.volume > 0), 10],
    [Boolean(fields.countriesCount && fields.countriesCount > 0), 10],
    [Boolean(fields.leadTime && fields.leadTime > 0), 5],
    [Boolean(fields.budget && fields.budget > 0), 5],
    [Boolean(fields.paymentTerms?.trim()), 5],
    [Boolean(fields.destination?.trim()), 5],
  ];

  for (const [valid, pts] of weights) {
    if (valid) score += pts;
  }

  return Math.min(100, Math.max(0, score));
}
