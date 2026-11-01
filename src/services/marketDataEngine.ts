/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CommodityPrice,
  ExchangeRateItem,
  FreightCorridorRate,
  LeadTimeCorridor,
  RiskIndexMetric,
  MarketDataSnapshot,
} from '../types/market';

export const INITIAL_COMMODITIES: CommodityPrice[] = [
  {
    id: 'hdg-z275',
    name: 'ورق فولادی گالوانیزه Z275 (ضخامت ۰٫۸)',
    code: 'HDG-Z275-DX51D',
    unit: 'دلار / تن متری',
    currentPriceUSD: 685,
    previousPriceUSD: 692,
    changePercent: -1.01,
    trend: 'down',
    history14d: [710, 705, 702, 698, 695, 692, 690, 688, 685, 686, 684, 685, 687, 685],
    marketExchange: 'بورس فلزات شانگهای (SHFE) و متال بولتن آسیایی',
    lastUpdatedFa: 'امروز، ساعت ۱۱:۴۵',
  },
  {
    id: 'hrc-shfe',
    name: 'کلاف ورق گرم کربنی (Hot-Rolled Coil)',
    code: 'HRC-Q235B',
    unit: 'دلار / تن متری',
    currentPriceUSD: 538,
    previousPriceUSD: 532,
    changePercent: 1.13,
    trend: 'up',
    history14d: [520, 522, 525, 528, 530, 527, 529, 532, 534, 535, 533, 536, 535, 538],
    marketExchange: 'بورس آتی شانگهای (SHFE Futures)',
    lastUpdatedFa: 'امروز، ساعت ۱۱:۴۰',
  },
  {
    id: 'seamless-pipe',
    name: 'لوله‌های بدون درز نفت و گاز API 5L Gr.B',
    code: 'SEAMLESS-API-5L',
    unit: 'دلار / تن متری',
    currentPriceUSD: 890,
    previousPriceUSD: 890,
    changePercent: 0.0,
    trend: 'stable',
    history14d: [895, 895, 892, 890, 890, 888, 890, 892, 890, 890, 890, 890, 890, 890],
    marketExchange: 'متال بولتن تیانجین و هوانگ‌پو',
    lastUpdatedFa: 'امروز، ساعت ۱۰:۳۰',
  },
  {
    id: 'lme-zinc',
    name: 'فلز روی تصفیه‌شده (Special High Grade Zinc)',
    code: 'LME-ZN-SHG',
    unit: 'دلار / تن متری',
    currentPriceUSD: 2845,
    previousPriceUSD: 2815,
    changePercent: 1.07,
    trend: 'up',
    history14d: [2750, 2765, 2780, 2790, 2810, 2805, 2820, 2815, 2830, 2840, 2825, 2835, 2840, 2845],
    marketExchange: 'بورس فلزات لندن (London Metal Exchange - LME)',
    lastUpdatedFa: 'امروز، ساعت ۱۱:۵۰',
  },
  {
    id: 'pet-resin',
    name: 'گرانول پلی‌اتیلن ترفتالات گرید بطری (PET BG781)',
    code: 'PET-BOTTLE-BG781',
    unit: 'دلار / تن متری',
    currentPriceUSD: 940,
    previousPriceUSD: 955,
    changePercent: -1.57,
    trend: 'down',
    history14d: [970, 965, 960, 958, 955, 952, 950, 948, 945, 946, 942, 945, 942, 940],
    marketExchange: 'پلتفرم ICIS خاورمیانه و شرق آسیا',
    lastUpdatedFa: 'امروز، ساعت ۰۹:۱۵',
  },
  {
    id: 'steel-slab',
    name: 'اسلب فولادی فوب بنادر صادراتی آسیا',
    code: 'SLAB-CARBON-COMM',
    unit: 'دلار / تن متری',
    currentPriceUSD: 472,
    previousPriceUSD: 480,
    changePercent: -1.67,
    trend: 'down',
    history14d: [495, 492, 490, 488, 485, 482, 480, 482, 478, 475, 476, 474, 475, 472],
    marketExchange: 'فوب بنادر چین و دریای سیاه',
    lastUpdatedFa: 'امروز، ساعت ۰۹:۴۰',
  },
];

export const INITIAL_EXCHANGE_RATES: ExchangeRateItem[] = [
  {
    id: 'nima-usd',
    name: 'دلار حواله مرکز مبادله / نیما',
    currencyCode: 'USD',
    category: 'حواله رسمی / نیما',
    rateToman: 68450,
    rateUSD: 1.0,
    changePercent: 0.18,
    trusteeFeePercent: 1.2,
    settlementLeadTimeDays: 24,
    lastUpdatedFa: 'امروز، ساعت ۱۱:۵۵',
  },
  {
    id: 'free-usd',
    name: 'دلار توافقی / بازار آزاد تجاری',
    currencyCode: 'USD',
    category: 'بازار توافقی / آزاد',
    rateToman: 73200,
    rateUSD: 1.0,
    changePercent: 0.45,
    trusteeFeePercent: 2.2,
    settlementLeadTimeDays: 2,
    lastUpdatedFa: 'امروز، ساعت ۱۱:۵۵',
  },
  {
    id: 'aed-transfer',
    name: 'حواله درهم امارات (مبنای تسویه با چین)',
    currencyCode: 'AED',
    category: 'حواله صرافی تجاری',
    rateToman: 19950,
    rateUSD: 3.6725,
    changePercent: 0.25,
    trusteeFeePercent: 1.5,
    settlementLeadTimeDays: 3,
    lastUpdatedFa: 'امروز، ساعت ۱۱:۵۰',
  },
  {
    id: 'cny-transfer',
    name: 'حواله یوان چین (کنلون و سیستم CIPS)',
    currencyCode: 'CNY',
    category: 'حواله رسمی / نیما',
    rateToman: 9480,
    rateUSD: 7.23,
    changePercent: -0.12,
    trusteeFeePercent: 1.8,
    settlementLeadTimeDays: 14,
    lastUpdatedFa: 'امروز، ساعت ۱۱:۴۵',
  },
  {
    id: 'eur-official',
    name: 'یورو حواله تجاری اروپا و ترکیه',
    currencyCode: 'EUR',
    category: 'حواله رسمی / نیما',
    rateToman: 74200,
    rateUSD: 1.085,
    changePercent: 0.32,
    trusteeFeePercent: 1.9,
    settlementLeadTimeDays: 18,
    lastUpdatedFa: 'امروز، ساعت ۱۱:۴۰',
  },
];

export const INITIAL_FREIGHT_CORRIDORS: FreightCorridorRate[] = [
  {
    id: 'sha-bnd',
    originCountry: 'چین',
    originPort: 'بندر شانگهای / نینگبو (CNSHA)',
    destinationPort: 'بندر شهید رجایی (IRBND)',
    mode: 'دریایی کانتینری ۴۰HC',
    currentRateUSD: 2850,
    previousRateUSD: 2720,
    changePercent: 4.78,
    transitDays: 18,
    portDwellDays: 4,
    carrierName: 'خط کشتیرانی جمهوری اسلامی (IRISL) + خطوط فیدر',
    bunkerAdjustmentUSD: 320,
    warRiskSurchargeUSD: 180,
    reliabilityScore: 86,
    lastUpdatedFa: 'امروز، ساعت ۱۰:۲۰',
  },
  {
    id: 'hph-bnd',
    originCountry: 'ویتنام',
    originPort: 'بندر هایفونگ / دا نانگ (VNHPH)',
    destinationPort: 'بندر شهید رجایی (IRBND)',
    mode: 'دریایی کانتینری ۴۰HC',
    currentRateUSD: 2200,
    previousRateUSD: 2270,
    changePercent: -3.08,
    transitDays: 12,
    portDwellDays: 2,
    carrierName: 'سرویس مستقیم والفجر / خطوط آسیایی',
    bunkerAdjustmentUSD: 240,
    warRiskSurchargeUSD: 140,
    reliabilityScore: 94,
    lastUpdatedFa: 'امروز، ساعت ۱۰:۱۵',
  },
  {
    id: 'nsa-bnd',
    originCountry: 'هند',
    originPort: 'بندر ناوا شیوا / موندرا (INNSA)',
    destinationPort: 'بندر شهید رجایی (IRBND)',
    mode: 'دریایی کانتینری ۴۰HC',
    currentRateUSD: 1450,
    previousRateUSD: 1450,
    changePercent: 0.0,
    transitDays: 6,
    portDwellDays: 2,
    carrierName: 'خط فیدر مستقیم خلیج فارس',
    bunkerAdjustmentUSD: 160,
    warRiskSurchargeUSD: 90,
    reliabilityScore: 91,
    lastUpdatedFa: 'امروز، ساعت ۰۹:۵۰',
  },
  {
    id: 'mer-bzg',
    originCountry: 'ترکیه',
    originPort: 'مرسین / بورسا / استانبول',
    destinationPort: 'گمرک بازرگان / انبار تهران',
    mode: 'جاده‌ای ترانزیتی',
    currentRateUSD: 2100,
    previousRateUSD: 2060,
    changePercent: 1.94,
    transitDays: 5,
    portDwellDays: 2,
    carrierName: 'ناوگان تیر (TIR Carnet) ترانزیت جاده‌ای بین‌المللی',
    bunkerAdjustmentUSD: 110,
    warRiskSurchargeUSD: 0,
    reliabilityScore: 95,
    lastUpdatedFa: 'امروز، ساعت ۱۱:۰۰',
  },
];

export const INITIAL_LEAD_TIMES: LeadTimeCorridor[] = [
  {
    corridorId: 'lead-vn',
    countryName: 'ویتنام (مسیر هایفونگ)',
    countryCode: 'VN',
    factoryProductionDays: 14,
    inlandTransitDays: 2,
    oceanRoadTransitDays: 10,
    customsClearanceDays: 4,
    totalLeadTimeDays: 28,
    reliabilityPercent: 96,
    activeVesselsPerWeek: 4,
    mainBottleneckFa: 'ترانزیت روان دریایی، زمان ترخیص گمرکی استاندارد در شهید رجایی',
  },
  {
    corridorId: 'lead-cn',
    countryName: 'چین (مسیر شانگهای/شاندونگ)',
    countryCode: 'CN',
    factoryProductionDays: 15,
    inlandTransitDays: 3,
    oceanRoadTransitDays: 16,
    customsClearanceDays: 5,
    totalLeadTimeDays: 35,
    reliabilityPercent: 84,
    activeVesselsPerWeek: 6,
    mainBottleneckFa: 'ازدحام بارگیری در بنادر چین، لزوم بازرسی مجدد در مبدأ و معطلی کانتینری',
  },
  {
    corridorId: 'lead-in',
    countryName: 'هند (مسیر ناوا شیوا)',
    countryCode: 'IN',
    factoryProductionDays: 12,
    inlandTransitDays: 2,
    oceanRoadTransitDays: 6,
    customsClearanceDays: 4,
    totalLeadTimeDays: 22,
    reliabilityPercent: 91,
    activeVesselsPerWeek: 5,
    mainBottleneckFa: 'سرعت بالای سیر دریایی، تشریفات تسویه اسناد روپیه‌ای',
  },
  {
    corridorId: 'lead-tr',
    countryName: 'ترکیه (مسیر جاده‌ای مرسین/بازرگان)',
    countryCode: 'TR',
    factoryProductionDays: 7,
    inlandTransitDays: 2,
    oceanRoadTransitDays: 4,
    customsClearanceDays: 3,
    totalLeadTimeDays: 14,
    reliabilityPercent: 95,
    activeVesselsPerWeek: 12,
    mainBottleneckFa: 'نوبت صف تریلی‌ها در پایانه مرزی بازرگان در روزهای اوج تردد',
  },
];

export const INITIAL_RISK_INDICES: RiskIndexMetric[] = [
  {
    id: 'risk-freight',
    name: 'شاخص نوسان و کمبود کانتینر دریایی (Freight Index)',
    score: 64,
    level: 'متوسط',
    trend: 'up',
    changePercent: 3.8,
    description: 'کمبود کانتینرهای ۴۰ فوت های‌کیوب در بنادر شرق آسیا به دلیل تغییر مسیر کشتی‌ها از دماغه امیدنیک.',
    impactAssessment: 'افزایش بالقوه ۸ تا ۱۲ درصدی کرایه حمل تا بندرعباس در سفارش‌های ماه آینده.',
    category: 'لجستیک و حمل',
  },
  {
    id: 'risk-fx-alloc',
    name: 'شاخص صف تخصیص ارز و تطبیق حواله (FX Allocation Risk)',
    score: 72,
    level: 'زیاد',
    trend: 'stable',
    changePercent: 0.5,
    description: 'میانگین زمان انتظار ثبت سفارش تا صدور فیش ارزی نیما در حال حاضر بین ۲۲ تا ۲۸ روز کاری است.',
    impactAssessment: 'لزوم لحاظ کردن بند انعطاف‌پذیر پرداخت (Grace Period) در قرارداد با تأمین‌کننده.',
    category: 'ارزی و پولی',
  },
  {
    id: 'risk-maritime',
    name: 'شاخص امنیت آبراه‌ها و حق بیمه جنگی (War Risk)',
    score: 38,
    level: 'کم',
    trend: 'down',
    changePercent: -2.1,
    description: 'مسیرهای ترانزیت شرق آسیا به خلیج فارس از طریق تنگه مالاکا با آرامش کامل و بدون اضافه بیمه بحرانی تردد دارند.',
    impactAssessment: 'حمل دریایی از ویتنام و هند بدون ریسک عبور از دریای سرخ انجام می‌شود.',
    category: 'ژئوپلیتیک و تنگه‌ها',
  },
  {
    id: 'risk-customs-tariff',
    name: 'شاخص ثبات تعرفه‌های گمرکی و استاندارد اجباری',
    score: 22,
    level: 'کم',
    trend: 'stable',
    changePercent: 0.0,
    description: 'حقوق ورودی ورق‌های گالوانیزه و کدهای HS مشمول طبق جدول تعرفه ۵ درصد تثبیت شده است.',
    impactAssessment: 'عدم وجود ریسک شوک ناگهانی عوارض گمرکی تا پایان سال مالی جاری.',
    category: 'قوانین و تعرفه',
  },
];

export function getInitialMarketSnapshot(): MarketDataSnapshot {
  return {
    lastSyncTimestamp: Date.now(),
    lastSyncFormattedFa: 'هم‌اکنون (لحظه‌ای)',
    isSyncing: false,
    connectionStatus: 'connected',
    commodities: INITIAL_COMMODITIES,
    exchangeRates: INITIAL_EXCHANGE_RATES,
    freightCorridors: INITIAL_FREIGHT_CORRIDORS,
    leadTimes: INITIAL_LEAD_TIMES,
    riskIndices: INITIAL_RISK_INDICES,
    globalIndices: {
      scfiContainerIndex: 2145,
      scfiDeltaPercent: 1.8,
      brentCrudeUSD: 74.8,
      brentDeltaPercent: -0.6,
      lmeIndex: 4120,
      lmeDeltaPercent: 0.8,
      fxVolatilityIndex: 28,
    },
  };
}

export type MarketShockType =
  | 'jitter'
  | 'freight_spike_china'
  | 'vietnam_cost_advantage'
  | 'fx_dirham_jump'
  | 'risk_cooling';

/**
 * Applies realistic market scenarios and shocks to test resilience and dynamic calculations.
 */
export function applyMarketScenario(
  current: MarketDataSnapshot,
  scenario: MarketShockType
): MarketDataSnapshot {
  const next: MarketDataSnapshot = JSON.parse(JSON.stringify(current));
  next.lastSyncTimestamp = Date.now();
  next.lastSyncFormattedFa = 'چند لحظه پیش';

  if (scenario === 'jitter') {
    // Normal micro-fluctuation (+-0.5% to 1.5%)
    next.commodities = next.commodities.map((c) => {
      const delta = (Math.random() * 6 - 3); // -3 to +3 USD
      const newPrice = Math.max(50, Math.round(c.currentPriceUSD + delta));
      const pct = Math.round(((newPrice - c.previousPriceUSD) / c.previousPriceUSD) * 1000) / 10;
      return {
        ...c,
        currentPriceUSD: newPrice,
        changePercent: pct,
        trend: pct > 0 ? 'up' : pct < 0 ? 'down' : 'stable',
        history14d: [...c.history14d.slice(1), newPrice],
      };
    });

    next.exchangeRates = next.exchangeRates.map((r) => {
      const delta = Math.round((Math.random() * 100 - 40));
      const newRate = r.rateToman + delta;
      return {
        ...r,
        rateToman: newRate,
        changePercent: Math.round(((delta) / r.rateToman) * 1000) / 10,
      };
    });
  } else if (scenario === 'freight_spike_china') {
    // Shanghai freight surges +18% due to container shortage
    next.freightCorridors = next.freightCorridors.map((f) => {
      if (f.originCountry === 'چین') {
        const newRate = 3350;
        return {
          ...f,
          previousRateUSD: f.currentRateUSD,
          currentRateUSD: newRate,
          changePercent: 17.5,
          portDwellDays: 7,
          reliabilityScore: 78,
        };
      }
      return f;
    });
    next.globalIndices.scfiContainerIndex = 2380;
    next.globalIndices.scfiDeltaPercent = 10.9;
    next.riskIndices = next.riskIndices.map((r) =>
      r.id === 'risk-freight'
        ? { ...r, score: 85, level: 'بحرانی', trend: 'up', changePercent: 21.0 }
        : r
    );
  } else if (scenario === 'vietnam_cost_advantage') {
    // Vietnam offers promotional bulk discount & freight drops
    next.commodities = next.commodities.map((c) => {
      if (c.id === 'hdg-z275') {
        return {
          ...c,
          currentPriceUSD: 665,
          changePercent: -2.9,
          trend: 'down',
          history14d: [...c.history14d.slice(1), 665],
        };
      }
      return c;
    });
    next.freightCorridors = next.freightCorridors.map((f) => {
      if (f.originCountry === 'ویتنام') {
        return {
          ...f,
          currentRateUSD: 1980,
          changePercent: -10.0,
          transitDays: 10,
          reliabilityScore: 98,
        };
      }
      return f;
    });
  } else if (scenario === 'fx_dirham_jump') {
    // Dirham jumps 3.5%
    next.exchangeRates = next.exchangeRates.map((r) => {
      if (r.currencyCode === 'AED') {
        return {
          ...r,
          rateToman: 20650,
          changePercent: 3.5,
        };
      }
      if (r.id === 'free-usd') {
        return {
          ...r,
          rateToman: 75800,
          changePercent: 3.55,
        };
      }
      return r;
    });
    next.riskIndices = next.riskIndices.map((r) =>
      r.id === 'risk-fx-alloc'
        ? { ...r, score: 82, level: 'بحرانی', trend: 'up', changePercent: 10.2 }
        : r
    );
  } else if (scenario === 'risk_cooling') {
    // Supply chain stabilizes
    next.riskIndices = next.riskIndices.map((r) => ({
      ...r,
      score: Math.max(15, r.score - 15),
      level: r.score - 15 < 30 ? 'کم' : 'متوسط',
      trend: 'down',
    }));
    next.globalIndices.scfiContainerIndex = 1950;
    next.globalIndices.scfiDeltaPercent = -9.1;
  }

  return next;
}

/**
 * Calculates Landed Cost dynamically using live freight and currency rates.
 * Given quantity (MT), unit price (FOB USD), origin country, and live market snapshot.
 */
export function calculateLiveLandedCostForQuote(params: {
  unitPriceFOB: number;
  quantityMT: number;
  originCountry: string;
  marketSnapshot: MarketDataSnapshot;
  tariffPercent?: number; // default 5%
  vatPercent?: number; // default 10%
  inlandDeliveryPortUSDPerTon?: number; // default $8.5
}): {
  fobTotalUSD: number;
  freightPerTonUSD: number;
  freightTotalUSD: number;
  marineInsuranceUSD: number;
  cifTotalUSD: number;
  dutiesUSD: number;
  customsClearanceUSD: number;
  totalLandedCostUSD: number;
  unitLandedCostUSD: number;
  totalLandedCostToman: number;
  unitLandedCostToman: number;
  appliedFreightCorridor: FreightCorridorRate;
  appliedNimaRate: number;
  appliedFreeRate: number;
} {
  const {
    unitPriceFOB,
    quantityMT,
    originCountry,
    marketSnapshot,
    tariffPercent = 5,
    vatPercent = 10,
    inlandDeliveryPortUSDPerTon = 8.5,
  } = params;

  // Find matching corridor or default
  const corridor =
    marketSnapshot.freightCorridors.find(
      (c) => c.originCountry.toLowerCase() === originCountry.toLowerCase()
    ) || marketSnapshot.freightCorridors[0];

  // A 40ft HC container carries approx 25 MT of steel coil/pipes
  const containerCapacityMT = 25;
  const containersNeeded = Math.ceil(quantityMT / containerCapacityMT);
  const freightTotalUSD = containersNeeded * corridor.currentRateUSD;
  const freightPerTonUSD = Math.round((freightTotalUSD / quantityMT) * 10) / 10;

  const fobTotalUSD = unitPriceFOB * quantityMT;

  // Marine Insurance is approx 0.35% of (FOB + Freight) * 110%
  const insuranceBase = (fobTotalUSD + freightTotalUSD) * 1.1;
  const marineInsuranceUSD = Math.round(insuranceBase * 0.0035 * 10) / 10;

  const cifTotalUSD = fobTotalUSD + freightTotalUSD + marineInsuranceUSD;

  // Customs Tariff (e.g. 5%) on CIF
  const dutiesUSD = Math.round(cifTotalUSD * (tariffPercent / 100));

  // Port handling & customs clearance (THC + Dwell + admin)
  const customsClearanceUSD = Math.round(
    quantityMT * inlandDeliveryPortUSDPerTon + 650
  );

  const otherPortExpenses = Math.round(quantityMT * 3.5);

  const totalLandedCostUSD = Math.round(
    cifTotalUSD + dutiesUSD + customsClearanceUSD + otherPortExpenses
  );
  const unitLandedCostUSD = Math.round((totalLandedCostUSD / quantityMT) * 10) / 10;

  // FX Conversions
  const nimaRate =
    marketSnapshot.exchangeRates.find((r) => r.id === 'nima-usd')?.rateToman ||
    68450;
  const freeRate =
    marketSnapshot.exchangeRates.find((r) => r.id === 'free-usd')?.rateToman ||
    73200;

  const totalLandedCostToman = totalLandedCostUSD * nimaRate;
  const unitLandedCostToman = Math.round(unitLandedCostUSD * nimaRate);

  return {
    fobTotalUSD,
    freightPerTonUSD,
    freightTotalUSD,
    marineInsuranceUSD,
    cifTotalUSD,
    dutiesUSD,
    customsClearanceUSD,
    totalLandedCostUSD,
    unitLandedCostUSD,
    totalLandedCostToman,
    unitLandedCostToman,
    appliedFreightCorridor: corridor,
    appliedNimaRate: nimaRate,
    appliedFreeRate: freeRate,
  };
}
