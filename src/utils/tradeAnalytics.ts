/**
 * Trade Analytics & Incoterms 2020 Normalization Engine for SourcingIQ.
 */

export type Incoterm2020 =
  | 'EXW'
  | 'FCA'
  | 'FAS'
  | 'FOB'
  | 'CFR'
  | 'CIF'
  | 'CPT'
  | 'CIP'
  | 'DAP'
  | 'DPU'
  | 'DDP';

export interface IncotermBreakdown {
  incoterm: Incoterm2020;
  quotedPrice: number;
  // Estimated add-ons to reach normalized CIF (Cost, Insurance & Freight) at destination port
  estimatedInlandOriginFreight: number;
  estimatedOriginTerminalCharges: number;
  estimatedOceanFreight: number;
  estimatedMarineInsurance: number;
  normalizedCifPrice: number;
  buyerRiskPoint: string;
  sellerResponsibility: string;
}

/**
 * Normalizes any Incoterms 2020 quote into an equivalent CIF Destination Port price
 * so commercial importers can compare apple-to-apple quotes.
 */
export function normalizeQuoteToCIF(
  quotedPrice: number,
  term: Incoterm2020,
  defaults: {
    inlandOriginFreight: number; // e.g. $15/ton
    originTHC: number; // e.g. $8/ton
    oceanFreight: number; // e.g. $38/ton
    marineInsuranceRate: number; // e.g. 0.0035 (0.35%)
  }
): IncotermBreakdown {
  let inlandOriginFreight = 0;
  let originTHC = 0;
  let oceanFreight = 0;
  let insurance = 0;

  switch (term) {
    case 'EXW':
      inlandOriginFreight = defaults.inlandOriginFreight;
      originTHC = defaults.originTHC;
      oceanFreight = defaults.oceanFreight;
      insurance = Math.round((quotedPrice + inlandOriginFreight + originTHC + oceanFreight) * defaults.marineInsuranceRate * 10) / 10;
      break;

    case 'FCA':
    case 'FAS':
      originTHC = defaults.originTHC;
      oceanFreight = defaults.oceanFreight;
      insurance = Math.round((quotedPrice + originTHC + oceanFreight) * defaults.marineInsuranceRate * 10) / 10;
      break;

    case 'FOB':
      oceanFreight = defaults.oceanFreight;
      insurance = Math.round((quotedPrice + oceanFreight) * defaults.marineInsuranceRate * 10) / 10;
      break;

    case 'CFR':
    case 'CPT':
      insurance = Math.round(quotedPrice * defaults.marineInsuranceRate * 10) / 10;
      break;

    case 'CIF':
    case 'CIP':
      // Already includes ocean freight & marine insurance
      break;

    case 'DAP':
    case 'DPU':
    case 'DDP':
      // Deduct destination inland freight if quoted DAP destination door to get back to CIF port
      break;
  }

  const normalizedCifPrice = Math.round(
    (quotedPrice + inlandOriginFreight + originTHC + oceanFreight + insurance) * 10
  ) / 10;

  const riskNotes: Record<Incoterm2020, { risk: string; responsibility: string }> = {
    EXW: { risk: 'انتقال ریسک در درب کارخانه فروشنده', responsibility: 'خریدار مسئول بارگیری، تشریفات گمرکی صادرات، حمل و بیمه است' },
    FCA: { risk: 'تحویل به شرکت حمل در محل مقرر در کشور مبدأ', responsibility: 'فروشنده مسئول ترخیص صادراتی است' },
    FAS: { risk: 'در کنار کشتی در بندر بارگیری', responsibility: 'فروشنده کالا را در کنار کشتی مستقر می‌کند' },
    FOB: { risk: 'پس از قرار گرفتن کالا روی عرشه کشتی در بندر مبدأ', responsibility: 'فروشنده هزینه حمل داخلی و ترخیص صادراتی را می‌دهد' },
    CFR: { risk: 'روی عرشه کشتی (هزینه کرایه تا بندر مقصد با فروشنده است)', responsibility: 'فروشنده کرایه حمل را می‌پردازد اما بیمه با خریدار است' },
    CIF: { risk: 'روی عرشه کشتی در مبدأ (فروشنده بیمه و کرایه را تا مقصد تقبل می‌کند)', responsibility: 'فروشنده مسئول پرداخت کرایه حمل و حداقل پوشش بیمه دریایی است' },
    CPT: { risk: 'تحویل به متصدی حمل اول', responsibility: 'کرایه حمل تا مقصد بر عهده فروشنده' },
    CIP: { risk: 'تحویل به متصدی حمل اول (با پوشش بیمه کامل Clause A)', responsibility: 'فروشنده موظف به اخذ بیمه حداکثری است' },
    DAP: { risk: 'در وسیله نقلیه در مقصد آماده تخلیه', responsibility: 'فروشنده مسئول حمل تا محل خریدار در مقصد است' },
    DPU: { risk: 'در محل مقصد پس از تخلیه کامل بار', responsibility: 'فروشنده مسئولیت تخلیه فیزیکی بار در مقصد را به عهده دارد' },
    DDP: { risk: 'پس از ترخیص وارداتی در انبار خریدار', responsibility: 'فروشنده تمام عوارض گمرکی و مالیات واردات کشور مقصد را می‌پردازد' },
  };

  return {
    incoterm: term,
    quotedPrice,
    estimatedInlandOriginFreight: inlandOriginFreight,
    estimatedOriginTerminalCharges: originTHC,
    estimatedOceanFreight: oceanFreight,
    estimatedMarineInsurance: insurance,
    normalizedCifPrice,
    buyerRiskPoint: riskNotes[term].risk,
    sellerResponsibility: riskNotes[term].responsibility,
  };
}

export interface AntiFraudChecklist {
  domainAgeYears: number;
  hasGovernmentBusinessLicense: boolean;
  bankAccountMatchesLegalName: boolean;
  physicalFactorySatelliteVerified: boolean;
  hasCustomsExportRecords: boolean;
  noDisputesInArbitration: boolean;
  sampleDeliveryAccepted: boolean;
  unrealisticLowPrice: boolean; // price > 20% lower than raw material cost is fraud indicator
}

export interface AntiFraudEvaluation {
  riskScore: number; // 0 (clean) to 100 (high probability fake)
  riskCategory: 'بسیار کم (تولیدکننده معتبر)' | 'متوسط (نیازمند ممیزی بیشتر)' | 'بسیار بالا (احتمال بالای شرکت جعلی)';
  flags: string[];
  recommendation: string;
}

/**
 * Heuristic anti-fraud evaluation for international B2B suppliers.
 */
export function evaluateSupplierFraudRisk(data: AntiFraudChecklist): AntiFraudEvaluation {
  let score = 0;
  const flags: string[] = [];

  if (!data.hasGovernmentBusinessLicense) {
    score += 35;
    flags.push('عدم انطباق پروانه بهره‌برداری و جواز صنعتی با سامانه دولتی');
  }

  if (!data.bankAccountMatchesLegalName) {
    score += 30;
    flags.push('عدم تطابق نام صاحب حساب بانکی با نام رسمی شرکت (ریسک حساب واسطه/صرافی شخصی)');
  }

  if (!data.physicalFactorySatelliteVerified) {
    score += 25;
    flags.push('عدم وجود تأسیسات فیزیکی یا کوره نورد در پایش ماهواره‌ای مختصات جغرافیایی');
  }

  if (data.domainAgeYears < 1) {
    score += 15;
    flags.push('دامنه اینترنتی و هویت آنلاین کمتر از یک سال پیش تأسیس شده است');
  }

  if (!data.hasCustomsExportRecords) {
    score += 15;
    flags.push('فاقد سابقه اظهارنامه صادراتی در داده‌های گمرکی رسمی بین‌المللی');
  }

  if (data.unrealisticLowPrice) {
    score += 20;
    flags.push('قیمت اعلام‌شده به طرز غیرمنطقی کمتر از بهای تمام‌شده شمش و اسلب جهانی است');
  }

  if (!data.sampleDeliveryAccepted) {
    score += 10;
    flags.push('امتناع از ارسال نمونه فیزیکی یا مشروط کردن آن به تسویه ۱۰۰٪ وجه کل');
  }

  const finalScore = Math.min(100, score);
  let riskCategory: AntiFraudEvaluation['riskCategory'] = 'بسیار کم (تولیدکننده معتبر)';
  let recommendation = 'تأمین‌کننده دارای احراز هویت مستحکم است؛ برای پیش‌پرداخت‌های ارزی مجاز ارزیابی می‌شود.';

  if (finalScore >= 60) {
    riskCategory = 'بسیار بالا (احتمال بالای شرکت جعلی)';
    recommendation = 'هشدار شدید: اکیداً از پرداخت پیش‌پرداخت یا حواله شخصی خودداری شود. احتمال شرکت کاغذی (Shell Company) وجود دارد.';
  } else if (finalScore >= 25) {
    riskCategory = 'متوسط (نیازمند ممیزی بیشتر)';
    recommendation = 'نیازمند استعلام مستقیم از اتاق بازرگانی کشور مبدأ و اعزام بازرس مستقل پیش از گشایش اعتبار.';
  }

  return {
    riskScore: finalScore,
    riskCategory,
    flags,
    recommendation,
  };
}
