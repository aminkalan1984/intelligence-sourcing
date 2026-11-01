/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CommodityPrice {
  id: string;
  name: string;
  code: string;
  unit: string;
  currentPriceUSD: number;
  previousPriceUSD: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  history14d: number[];
  marketExchange: string;
  lastUpdatedFa: string;
}

export interface ExchangeRateItem {
  id: string;
  name: string;
  currencyCode: 'USD' | 'AED' | 'CNY' | 'EUR';
  category: 'حواله رسمی / نیما' | 'بازار توافقی / آزاد' | 'حواله صرافی تجاری';
  rateToman: number;
  rateUSD: number; // cross-rate vs 1 USD
  changePercent: number;
  trusteeFeePercent: number; // کارمزد صرافی تراستی
  settlementLeadTimeDays: number; // میانگین روزهای تخصیص و انتقال ارز
  lastUpdatedFa: string;
}

export interface FreightCorridorRate {
  id: string;
  originCountry: string;
  originPort: string;
  destinationPort: string;
  mode: 'دریایی کانتینری ۴۰HC' | 'دریایی کانتینری ۲۰FT' | 'جاده‌ای ترانزیتی' | 'دریایی فله (Breakbulk)';
  currentRateUSD: number;
  previousRateUSD: number;
  changePercent: number;
  transitDays: number;
  portDwellDays: number; // معطلی اسکله و بارگیری
  carrierName: string;
  bunkerAdjustmentUSD: number; // BAF
  warRiskSurchargeUSD: number; // WRS
  reliabilityScore: number; // 0-100
  lastUpdatedFa: string;
}

export interface LeadTimeCorridor {
  corridorId: string;
  countryName: string;
  countryCode: string;
  factoryProductionDays: number;
  inlandTransitDays: number;
  oceanRoadTransitDays: number;
  customsClearanceDays: number;
  totalLeadTimeDays: number;
  reliabilityPercent: number;
  activeVesselsPerWeek: number;
  mainBottleneckFa: string;
}

export interface RiskIndexMetric {
  id: string;
  name: string;
  score: number; // 0-100
  level: 'کم' | 'متوسط' | 'زیاد' | 'بحرانی';
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  description: string;
  impactAssessment: string;
  category: 'لجستیک و حمل' | 'ارزی و پولی' | 'ژئوپلیتیک و تنگه‌ها' | 'قوانین و تعرفه';
}

export interface MarketDataSnapshot {
  lastSyncTimestamp: number;
  lastSyncFormattedFa: string;
  isSyncing: boolean;
  connectionStatus: 'connected' | 'updating' | 'offline';
  commodities: CommodityPrice[];
  exchangeRates: ExchangeRateItem[];
  freightCorridors: FreightCorridorRate[];
  leadTimes: LeadTimeCorridor[];
  riskIndices: RiskIndexMetric[];
  globalIndices: {
    scfiContainerIndex: number; // Shanghai Containerized Freight Index
    scfiDeltaPercent: number;
    brentCrudeUSD: number;
    brentDeltaPercent: number;
    lmeIndex: number;
    lmeDeltaPercent: number;
    fxVolatilityIndex: number; // 0-100
  };
}
