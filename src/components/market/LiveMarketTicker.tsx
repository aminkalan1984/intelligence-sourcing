/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Activity,
  Layers,
  Ship,
  DollarSign,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { toPersianDigits, formatPersianNumber, formatPersianPercent } from '../../utils/formatters';

interface LiveMarketTickerProps {
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
  showScenarioPills?: boolean;
}

export const LiveMarketTicker: React.FC<LiveMarketTickerProps> = ({
  onShowToast,
  showScenarioPills = true,
}) => {
  const {
    snapshot,
    isSyncing,
    refreshMarketData,
    applyScenario,
    resetToDefaults,
    activeScenario,
  } = useMarketData();

  const handleManualRefresh = async () => {
    await refreshMarketData();
    if (onShowToast) {
      onShowToast(
        'داده‌های بازار به‌روزرسانی شد',
        'قیمت کامودیتی‌ها، نرخ حواله نیما و آزاد، و کرایه کانتینری بنادر همگام شدند.',
        'success'
      );
    }
  };

  const handleScenarioChange = (scenario: any, label: string) => {
    if (scenario === 'baseline') {
      resetToDefaults();
      onShowToast?.('بازگشت به مقادیر پایه بازار', 'سناریوهای نوسانی ریست شدند.', 'info');
    } else {
      applyScenario(scenario);
      onShowToast?.(`سناریوی «${label}» اعمال شد`, 'تأثیر شوک بر هزینه‌ها و ریسک محاسبه شد.', 'warning');
    }
  };

  const hdg = snapshot.commodities.find((c) => c.id === 'hdg-z275') || snapshot.commodities[0];
  const hrc = snapshot.commodities.find((c) => c.id === 'hrc-shfe') || snapshot.commodities[1];
  const nimaUSD = snapshot.exchangeRates.find((r) => r.id === 'nima-usd');
  const freeUSD = snapshot.exchangeRates.find((r) => r.id === 'free-usd');
  const aed = snapshot.exchangeRates.find((r) => r.currencyCode === 'AED');
  const shaFreight = snapshot.freightCorridors.find((f) => f.id === 'sha-bnd');
  const hphFreight = snapshot.freightCorridors.find((f) => f.id === 'hph-bnd');

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E3DC] rounded-3xl p-4 shadow-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E5E3DC]/70">
        <div className="flex items-center gap-2.5">
          {/* Live pulsing green indicator */}
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D7D32] opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2D7D32]"></span>
          </div>

          <span className="text-xs font-black text-[#111111] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#111111]" />
            <span>فید لحظه‌ای بازار بین‌المللی سورسینگ</span>
          </span>

          <span className="text-[11px] font-medium text-[#73726E] bg-[#F5F4EE] px-2.5 py-0.5 rounded-full border border-[#E5E3DC]">
            {snapshot.lastSyncFormattedFa}
          </span>
        </div>

        {/* Action button & Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleManualRefresh}
            disabled={isSyncing}
            className="px-3.5 py-1.5 rounded-full bg-[#F5F4EE] hover:bg-[#ECEBE5] text-[#111111] border border-[#E5E3DC] text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            title="همگام‌سازی لحظه‌ای با فید بازارهای جهانی"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#111111]' : 'text-[#73726E]'}`} />
            <span>{isSyncing ? 'در حال همگام‌سازی...' : 'به‌روزرسانی داده‌ها'}</span>
          </button>
        </div>
      </div>

      {/* Ticker Stream Cards (Grid of Key Highlights) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3">
        {/* 1. HDG Steel */}
        <div className="p-2.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] hover:border-[#111111]/30 transition-all">
          <div className="text-[10px] text-[#73726E] font-medium flex items-center justify-between">
            <span>ورق گالوانیزه Z275</span>
            <span className="font-mono text-[9px] uppercase">FOB</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-black text-[#111111]">
              ${toPersianDigits(hdg.currentPriceUSD)}
            </span>
            <span
              className={`text-[10px] font-bold flex items-center ${
                hdg.changePercent >= 0 ? 'text-[#2D7D32]' : 'text-[#C53030]'
              }`}
            >
              {hdg.changePercent >= 0 ? (
                <TrendingUp className="w-2.5 h-2.5 ml-0.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 ml-0.5" />
              )}
              {formatPersianPercent(Math.abs(hdg.changePercent))}
            </span>
          </div>
          <div className="text-[9px] text-[#73726E] mt-0.5 truncate">فوب شرق آسیا و ویتنام</div>
        </div>

        {/* 2. HRC Hot Rolled */}
        <div className="p-2.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] hover:border-[#111111]/30 transition-all">
          <div className="text-[10px] text-[#73726E] font-medium flex items-center justify-between">
            <span>ورق گرم HRC</span>
            <span className="font-mono text-[9px]">SHFE</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-black text-[#111111]">
              ${toPersianDigits(hrc.currentPriceUSD)}
            </span>
            <span
              className={`text-[10px] font-bold flex items-center ${
                hrc.changePercent >= 0 ? 'text-[#2D7D32]' : 'text-[#C53030]'
              }`}
            >
              {hrc.changePercent >= 0 ? (
                <TrendingUp className="w-2.5 h-2.5 ml-0.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 ml-0.5" />
              )}
              {formatPersianPercent(Math.abs(hrc.changePercent))}
            </span>
          </div>
          <div className="text-[9px] text-[#73726E] mt-0.5 truncate">بورس آتی شانگهای</div>
        </div>

        {/* 3. NIMA USD */}
        <div className="p-2.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] hover:border-[#111111]/30 transition-all">
          <div className="text-[10px] text-[#73726E] font-medium flex items-center justify-between">
            <span>دلار حواله نیما</span>
            <span className="text-[9px] text-[#2D7D32] font-bold">رسمی</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-black text-[#111111]">
              {formatPersianNumber(nimaUSD?.rateToman || 68450)}
            </span>
            <span className="text-[9px] text-[#73726E] font-bold">تومان</span>
          </div>
          <div className="text-[9px] text-[#73726E] mt-0.5 flex justify-between">
            <span>تخصیص: {toPersianDigits(nimaUSD?.settlementLeadTimeDays || 24)} روز</span>
            <span className="text-[#2D7D32]">+{formatPersianPercent(nimaUSD?.changePercent || 0.18)}</span>
          </div>
        </div>

        {/* 4. AED Dirham */}
        <div className="p-2.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] hover:border-[#111111]/30 transition-all">
          <div className="text-[10px] text-[#73726E] font-medium flex items-center justify-between">
            <span>حواله درهم دبی</span>
            <span className="font-mono text-[9px]">AED</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-black text-[#111111]">
              {formatPersianNumber(aed?.rateToman || 19950)}
            </span>
            <span className="text-[9px] text-[#73726E] font-bold">تومان</span>
          </div>
          <div className="text-[9px] text-[#73726E] mt-0.5 flex justify-between">
            <span>کارمزد: {toPersianDigits(aed?.trusteeFeePercent || 1.5)}٪</span>
            <span className="text-[#2D7D32]">+{formatPersianPercent(aed?.changePercent || 0.25)}</span>
          </div>
        </div>

        {/* 5. Shanghai Freight */}
        <div className="p-2.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] hover:border-[#111111]/30 transition-all">
          <div className="text-[10px] text-[#73726E] font-medium flex items-center justify-between">
            <span>حمل شانگهای-رجایی</span>
            <Ship className="w-2.5 h-2.5 text-[#73726E]" />
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-black text-[#111111]">
              ${toPersianDigits(shaFreight?.currentRateUSD || 2850)}
            </span>
            <span className="text-[10px] text-[#C53030] font-bold">
              +{formatPersianPercent(shaFreight?.changePercent || 4.7)}
            </span>
          </div>
          <div className="text-[9px] text-[#73726E] mt-0.5 flex justify-between">
            <span>کانتینر ۴۰ فوت</span>
            <span>{toPersianDigits(shaFreight?.transitDays || 18)} روز</span>
          </div>
        </div>

        {/* 6. Vietnam Freight */}
        <div className="p-2.5 rounded-2xl bg-[#FDFDE8] border-2 border-[#F3F94A] hover:border-[#111111]/40 transition-all relative">
          <div className="text-[10px] text-[#111111] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#111111]" />
              <span>حمل هایفونگ-رجایی</span>
            </span>
            <span className="text-[8px] bg-[#111111] text-[#F3F94A] px-1 rounded">بهینه</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-black text-[#111111]">
              ${toPersianDigits(hphFreight?.currentRateUSD || 2200)}
            </span>
            <span className="text-[10px] text-[#2D7D32] font-bold">
              {formatPersianPercent(hphFreight?.changePercent || -3.1)}
            </span>
          </div>
          <div className="text-[9px] text-[#111111] font-semibold mt-0.5 flex justify-between">
            <span>صرفه‌جویی ۶۵۰$</span>
            <span>{toPersianDigits(hphFreight?.transitDays || 12)} روز</span>
          </div>
        </div>
      </div>

      {/* Scenario Shock Buttons (Simulation Controls) */}
      {showScenarioPills && (
        <div className="mt-3 pt-2.5 border-t border-[#E5E3DC]/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#73726E]">
            <Layers className="w-3.5 h-3.5 text-[#111111]" />
            <span className="font-bold text-[#111111]">شبیه‌سازی و تست شوک بازار:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleScenarioChange('baseline', 'مقادیر پایه')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeScenario === 'baseline'
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F5F4EE] text-[#73726E] hover:text-[#111111]'
              }`}
            >
              حالت جاری (پایه)
            </button>
            <button
              onClick={() => handleScenarioChange('freight_spike_china', 'جهش کرایه کانتینری چین')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeScenario === 'freight_spike_china'
                  ? 'bg-[#C53030] text-white'
                  : 'bg-[#FDEBE6] text-[#C53030] hover:bg-[#fbdcd5]'
              }`}
            >
              +۱۸٪ جهش کرایه شانگهای
            </button>
            <button
              onClick={() => handleScenarioChange('vietnam_cost_advantage', 'تخفیف فوب و کرایه ویتنام')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeScenario === 'vietnam_cost_advantage'
                  ? 'bg-[#111111] text-[#F3F94A]'
                  : 'bg-[#FDFDE8] text-[#111111] border border-[#F3F94A]'
              }`}
            >
              کاهش قیمت فوب ویتنام
            </button>
            <button
              onClick={() => handleScenarioChange('fx_dirham_jump', 'نوسان حواله درهم')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeScenario === 'fx_dirham_jump'
                  ? 'bg-[#C05621] text-white'
                  : 'bg-[#F5DFCB] text-[#C05621] hover:bg-[#eed3be]'
              }`}
            >
              +۳٫۵٪ جهش حواله درهم
            </button>
            <button
              onClick={() => handleScenarioChange('risk_cooling', 'آرامش زنجیره تأمین')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeScenario === 'risk_cooling'
                  ? 'bg-[#2D7D32] text-white'
                  : 'bg-[#D5E8D4] text-[#2D7D32] hover:bg-[#c2e2c0]'
              }`}
            >
              کاهش ریسک لجستیک
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
