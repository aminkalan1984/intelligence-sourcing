/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ship,
  Clock,
  ShieldAlert,
  BarChart3,
  Layers,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Building2,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { Sparkline } from '../common/Sparkline';
import { StatusPill } from '../common/StatusPill';
import { HatchedProgressBar } from '../common/HatchedBar';
import { toPersianDigits, formatPersianNumber, formatPersianPercent } from '../../utils/formatters';

interface LiveMarketMatrixProps {
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

type PillarTab = 'commodities' | 'fx' | 'freight' | 'leadtimes' | 'risks' | 'calculator';

export const LiveMarketMatrix: React.FC<LiveMarketMatrixProps> = ({ onShowToast }) => {
  const { snapshot, isSyncing, refreshMarketData, calculateLandedCost } = useMarketData();
  const [activeTab, setActiveTab] = useState<PillarTab>('commodities');

  // Interactive Live Landed Cost Simulator State
  const [simOrigin, setSimOrigin] = useState<'ویتنام' | 'چین' | 'هند' | 'ترکیه'>('ویتنام');
  const [simVolumeMT, setSimVolumeMT] = useState<number>(100);
  const [simFobUSD, setSimFobUSD] = useState<number>(685);
  const [simTariffPct, setSimTariffPct] = useState<number>(5);

  const tabs: { id: PillarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'commodities', label: 'قیمت کالاها و بورس‌های جهانی', icon: <BarChart3 className="w-3.5 h-3.5" />, badge: `${snapshot.commodities.length} قلم` },
    { id: 'fx', label: 'نرخ ارز و حواله تجاری', icon: <DollarSign className="w-3.5 h-3.5" />, badge: `${snapshot.exchangeRates.length} نرخ` },
    { id: 'freight', label: 'هزینه حمل و کریدورهای کانتینری', icon: <Ship className="w-3.5 h-3.5" />, badge: '۴ مسیر' },
    { id: 'leadtimes', label: 'زمان تأمین و ترانزیت', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'risks', label: 'شاخص‌های ریسک به‌روز', icon: <ShieldAlert className="w-3.5 h-3.5" />, badge: 'هوشمند' },
    { id: 'calculator', label: 'ماشین‌حساب قیمت تمام‌شده زنده', icon: <Calculator className="w-3.5 h-3.5" /> },
  ];

  // Run dynamic calculation for simulator
  const simResult = calculateLandedCost({
    unitPriceFOB: simFobUSD,
    quantityMT: simVolumeMT,
    originCountry: simOrigin,
    marketSnapshot: snapshot,
    tariffPercent: simTariffPct,
  });

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E3DC] rounded-3xl p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#E5E3DC]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[#111111]">
              اتصال زنده داده‌های بازار بین‌المللی (SourcingIQ Market Engine)
            </h3>
            <span className="text-[10px] font-bold bg-[#111111] text-[#F3F94A] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span>همگام با بورس‌های جهانی</span>
            </span>
          </div>
          <p className="text-xs text-[#73726E] mt-0.5">
            پایش مستمر نرخ برابری ارز، کرایه‌های دریایی، قیمت فوب و زمان ترانزیت مبادی وارداتی ایران
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#73726E]">
            آخرین سینک: <strong className="text-[#111111]">{snapshot.lastSyncFormattedFa}</strong>
          </span>
          <button
            onClick={() => refreshMarketData()}
            disabled={isSyncing}
            className="p-2 rounded-full bg-[#F5F4EE] hover:bg-[#ECEBE5] text-[#111111] border border-[#E5E3DC] transition-all disabled:opacity-50"
            title="به‌روزرسانی لحظه‌ای"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#111111]' : 'text-[#111111]'}`} />
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-[#F5F4EE] text-[#73726E] hover:text-[#111111] hover:bg-[#ECEBE5]'
              }`}
            >
              <span className={isActive ? 'text-[#F3F94A]' : 'text-[#73726E]'}>{t.icon}</span>
              <span>{t.label}</span>
              {t.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#F3F94A] text-[#111111]' : 'bg-[#E5E3DC] text-[#111111]'
                  }`}
                >
                  {toPersianDigits(t.badge)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Commodities */}
      {activeTab === 'commodities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {snapshot.commodities.map((c) => {
              const isPositive = c.changePercent >= 0;
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] hover:border-[#111111]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#73726E]">{c.code}</span>
                        <h4 className="text-xs font-bold text-[#111111] mt-0.5">{c.name}</h4>
                      </div>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full flex items-center ${
                          isPositive
                            ? 'bg-[#D5E8D4] text-[#2D7D32]'
                            : 'bg-[#FDEBE6] text-[#C53030]'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3 h-3 ml-0.5" /> : <TrendingDown className="w-3 h-3 ml-0.5" />}
                        {formatPersianPercent(Math.abs(c.changePercent))}
                      </span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#111111]">
                        ${toPersianDigits(c.currentPriceUSD)}
                      </span>
                      <span className="text-[11px] text-[#73726E] font-medium">{c.unit}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5E3DC] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#73726E] block truncate max-w-[130px]">
                        {c.marketExchange}
                      </span>
                      <span className="text-[9px] text-[#73726E]">{c.lastUpdatedFa}</span>
                    </div>
                    <div className="w-24">
                      <Sparkline
                        data={c.history14d}
                        color={isPositive ? '#2D7D32' : '#111111'}
                        width={95}
                        height={26}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FDFDE8] border border-[#F3F94A] flex items-center justify-between text-xs text-[#111111] flex-wrap gap-2">
            <span className="font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#111111]" />
              <span>تحلیل روند هوشمند: قیمت ورق گالوانیزه فوب ویتنام (۶۸۵$) به دلیل کاهش نرخ سنگ‌آهن استرالیا در ثبات نسبی قرار دارد.</span>
            </span>
            <button
              onClick={() => {
                setSimFobUSD(685);
                setSimOrigin('ویتنام');
                setActiveTab('calculator');
                onShowToast?.('قیمت فوب به ماشین‌حساب قیمت تمام‌شده منتقل شد', '', 'info');
              }}
              className="px-3 py-1 rounded-full bg-[#111111] text-white hover:bg-black font-bold text-xs"
            >
              محاسبه قیمت تمام‌شده
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Exchange Rates & Remittance */}
      {activeTab === 'fx' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F4EE] border-b border-[#E5E3DC] text-[11px] font-bold text-[#73726E]">
                  <th className="py-3 px-4">عنوان ارز و حواله تجاری</th>
                  <th className="py-3 px-4">دسته‌بندی</th>
                  <th className="py-3 px-4">نرخ برابری (تومان)</th>
                  <th className="py-3 px-4">تغییر روزانه</th>
                  <th className="py-3 px-4">کارمزد صرافی تراستی</th>
                  <th className="py-3 px-4">میانگین روزهای تخصیص</th>
                  <th className="py-3 px-4">آخرین به‌روزرسانی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DC]">
                {snapshot.exchangeRates.map((fx) => (
                  <tr key={fx.id} className="hover:bg-[#F5F4EE]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#111111]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#ECEBE5] text-[#111111]">
                          {fx.currencyCode}
                        </span>
                        <span>{fx.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-[#73726E] bg-[#F5F4EE] px-2.5 py-0.5 rounded-full border border-[#E5E3DC]">
                        {fx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm text-[#111111]">
                      {formatPersianNumber(fx.rateToman)} تومان
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold flex items-center ${
                          fx.changePercent >= 0 ? 'text-[#2D7D32]' : 'text-[#C53030]'
                        }`}
                      >
                        {fx.changePercent >= 0 ? '+' : ''}
                        {formatPersianPercent(fx.changePercent)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#111111]">
                      {toPersianDigits(fx.trusteeFeePercent)}٪
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#73726E]">
                      {toPersianDigits(fx.settlementLeadTimeDays)} روز کاری
                    </td>
                    <td className="py-3.5 px-4 text-[#73726E] text-[11px]">
                      {fx.lastUpdatedFa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
              <h4 className="text-xs font-black text-[#111111] mb-2 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#111111]" />
                <span>فرمول تطبیق پرداخت ارز با تأمین‌کنندگان چینی و ویتنامی</span>
              </h4>
              <p className="text-xs text-[#73726E] leading-relaxed">
                اکثر قراردادهای فولادی ویتنام بر پایه دلار آمریکا یا حواله درهم امارات (AED) با نرخ ثابت ۳٫۶۷۲۵ منعقد می‌شوند. برای تسویه از طریق صرافی‌های تراستی دبی، احتساب ۱٫۵٪ کارمزد انتقال بین‌المللی الزامی است.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
              <h4 className="text-xs font-black text-[#111111] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#111111]" />
                <span>مدیریت ریسک صف تخصیص ارز بانک مرکزی</span>
              </h4>
              <p className="text-xs text-[#73726E] leading-relaxed">
                به دلیل فاصله ۲۴ روزه میان ثبت سفارش تا تخصیص ارز نیما، پیشنهاد می‌شود در متن استعلام (RFQ) شرط پرداخت TT مرحله‌ای یا LC مدت‌دار با ۳۰ روز مهلت تسویه قید گردد.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Freight Corridors */}
      {activeTab === 'freight' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snapshot.freightCorridors.map((fc) => {
              const isBest = fc.id === 'hph-bnd';
              return (
                <div
                  key={fc.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isBest
                      ? 'bg-[#FDFDE8] border-2 border-[#F3F94A]'
                      : 'bg-[#F5F4EE] border-[#E5E3DC]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#111111]">{fc.originCountry}</span>
                        <span className="text-[11px] text-[#73726E]">به {fc.destinationPort}</span>
                        {isBest && (
                          <span className="text-[10px] font-bold bg-[#111111] text-[#F3F94A] px-2 py-0.2 rounded-full">
                            بهترین مزیت کرایه
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-[#73726E] mt-0.5 block">
                        مبدأ: {fc.originPort}
                      </span>
                    </div>

                    <div className="text-left">
                      <div className="text-xl font-black text-[#111111]">
                        ${toPersianDigits(fc.currentRateUSD)}
                      </div>
                      <span
                        className={`text-[10px] font-bold block ${
                          fc.changePercent > 0
                            ? 'text-[#C53030]'
                            : fc.changePercent < 0
                            ? 'text-[#2D7D32]'
                            : 'text-[#73726E]'
                        }`}
                      >
                        {fc.changePercent > 0 ? '+' : ''}
                        {formatPersianPercent(fc.changePercent)}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E5E3DC] text-[11px]">
                    <div>
                      <span className="text-[#73726E] block">نوع بارگیر:</span>
                      <strong className="text-[#111111]">{fc.mode}</strong>
                    </div>
                    <div>
                      <span className="text-[#73726E] block">مدت ترانزیت:</span>
                      <strong className="text-[#111111]">{toPersianDigits(fc.transitDays)} روز دریایی</strong>
                    </div>
                    <div>
                      <span className="text-[#73726E] block">معطلی اسکله:</span>
                      <strong className="text-[#111111]">{toPersianDigits(fc.portDwellDays)} روز</strong>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E5E3DC]/60 flex items-center justify-between text-[11px] text-[#73726E]">
                    <span>خط کشتیرانی: <strong className="text-[#111111]">{fc.carrierName}</strong></span>
                    <span className="font-semibold text-[#111111]">ضریب قابلیت اطمینان: {toPersianDigits(fc.reliabilityScore)}٪</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Ship className="w-5 h-5 text-[#111111]" />
              <div>
                <span className="text-xs font-bold text-[#111111]">شاخص کرایه کانتینری شانگهای (SCFI):</span>
                <span className="text-sm font-black text-[#111111] mr-2">
                  {formatPersianNumber(snapshot.globalIndices.scfiContainerIndex)} واحد
                </span>
                <span className="text-xs font-bold text-[#C53030] mr-2">
                  (+{formatPersianPercent(snapshot.globalIndices.scfiDeltaPercent)})
                </span>
              </div>
            </div>
            <span className="text-xs text-[#73726E]">
              افزایش تقاضای فصلی خطوط دریایی شرق آسیا به خاورمیانه
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Lead Times */}
      {activeTab === 'leadtimes' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {snapshot.leadTimes.map((lt) => (
              <div key={lt.corridorId} className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#111111]">{lt.countryName}</span>
                    <span className="text-[11px] bg-[#FFFFFF] border border-[#E5E3DC] px-2 py-0.5 rounded-full font-bold">
                      قابلیت اطمینان زمان‌بندی: {toPersianDigits(lt.reliabilityPercent)}٪
                    </span>
                  </div>
                  <div className="text-xs font-black text-[#111111]">
                    مجموع زمان چرخه: <span className="text-base text-[#111111]">{toPersianDigits(lt.totalLeadTimeDays)} روز</span>
                  </div>
                </div>

                {/* Stacked Visual Timeline Bar */}
                <div className="w-full bg-[#E5E3DC] rounded-full h-3 overflow-hidden flex my-2">
                  <div
                    style={{ width: `${(lt.factoryProductionDays / lt.totalLeadTimeDays) * 100}%` }}
                    className="bg-[#111111] h-full"
                    title={`تولید در کارخانه: ${lt.factoryProductionDays} روز`}
                  />
                  <div
                    style={{ width: `${(lt.inlandTransitDays / lt.totalLeadTimeDays) * 100}%` }}
                    className="bg-[#8C7355] h-full"
                    title={`حمل داخلی مبدأ: ${lt.inlandTransitDays} روز`}
                  />
                  <div
                    style={{ width: `${(lt.oceanRoadTransitDays / lt.totalLeadTimeDays) * 100}%` }}
                    className="bg-[#F3F94A] h-full"
                    title={`سیر دریایی / جاده‌ای: ${lt.oceanRoadTransitDays} روز`}
                  />
                  <div
                    style={{ width: `${(lt.customsClearanceDays / lt.totalLeadTimeDays) * 100}%` }}
                    className="bg-[#2D7D32] h-full"
                    title={`ترخیص گمرکی مقصد: ${lt.customsClearanceDays} روز`}
                  />
                </div>

                {/* Sub-breakdown legend */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-[#73726E] pt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#111111]" />
                    تولید: {toPersianDigits(lt.factoryProductionDays)} روز
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#8C7355]" />
                    حمل داخلی مبدأ: {toPersianDigits(lt.inlandTransitDays)} روز
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#F3F94A] border border-black/30" />
                    ترانزیت بین‌المللی: {toPersianDigits(lt.oceanRoadTransitDays)} روز
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#2D7D32]" />
                    ترخیص گمرک شهید رجایی: {toPersianDigits(lt.customsClearanceDays)} روز
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-[#73726E] bg-[#FFFFFF] p-2 rounded-xl border border-[#E5E3DC]">
                  گلوگاه اصلی مسیر: <strong className="text-[#111111]">{lt.mainBottleneckFa}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Risk Indices */}
      {activeTab === 'risks' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snapshot.riskIndices.map((r) => {
              const isAlert = r.level === 'بحرانی' || r.level === 'زیاد';
              return (
                <div
                  key={r.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isAlert ? 'bg-[#FDEBE6]/40 border-[#C53030]/30' : 'bg-[#F5F4EE] border-[#E5E3DC]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-[#73726E] font-bold block">{r.category}</span>
                      <h4 className="text-xs font-black text-[#111111] mt-0.5">{r.name}</h4>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black text-[#111111]">
                        {toPersianDigits(r.score)}<span className="text-xs font-normal text-[#73726E]">/۱۰۰</span>
                      </div>
                      <StatusPill
                        label={`ریسک ${r.level}`}
                        variant={
                          r.level === 'کم' ? 'green' : r.level === 'متوسط' ? 'orange' : 'alert'
                        }
                      />
                    </div>
                  </div>

                  <p className="text-xs text-[#73726E] mt-3 leading-relaxed">
                    {r.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#E5E3DC] text-[11px] text-[#111111] font-medium bg-[#FFFFFF] p-2.5 rounded-xl border">
                    <strong>ارزیابی اثر: </strong>{r.impactAssessment}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 6: Live Landed Cost Simulator */}
      {activeTab === 'calculator' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
            <h4 className="text-xs font-black text-[#111111] mb-3">
              پارامترهای محاسبه زنده قیمت تمام‌شده (Live Landed Cost Calculator)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Origin Country */}
              <div>
                <label className="text-[11px] font-bold text-[#73726E] block mb-1">کشور مبدأ سورسینگ</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['ویتنام', 'چین', 'هند', 'ترکیه'] as const).map((country) => (
                    <button
                      key={country}
                      onClick={() => setSimOrigin(country)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        simOrigin === country
                          ? 'bg-[#111111] text-white border-black'
                          : 'bg-[#FFFFFF] text-[#73726E] border-[#E5E3DC] hover:text-[#111111]'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume (Tons) */}
              <div>
                <label className="text-[11px] font-bold text-[#73726E] block mb-1">
                  حجم سفارش: <strong className="text-[#111111]">{toPersianDigits(simVolumeMT)} تن متری</strong>
                </label>
                <input
                  type="range"
                  min="25"
                  max="500"
                  step="25"
                  value={simVolumeMT}
                  onChange={(e) => setSimVolumeMT(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <span className="text-[10px] text-[#73726E] block mt-1">
                  معادل {toPersianDigits(Math.ceil(simVolumeMT / 25))} کانتینر ۴۰ فوت
                </span>
              </div>

              {/* FOB Unit Price (USD) */}
              <div>
                <label className="text-[11px] font-bold text-[#73726E] block mb-1">
                  قیمت فوب پیشنهادی (FOB USD)
                </label>
                <div className="flex items-center bg-[#FFFFFF] border border-[#E5E3DC] rounded-xl px-3 py-1.5">
                  <span className="text-xs text-[#73726E] ml-1.5">$</span>
                  <input
                    type="number"
                    value={simFobUSD}
                    onChange={(e) => setSimFobUSD(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-[#111111] outline-none text-left font-mono"
                  />
                </div>
              </div>

              {/* Customs Tariff % */}
              <div>
                <label className="text-[11px] font-bold text-[#73726E] block mb-1">
                  حقوق ورودی گمرکی: <strong className="text-[#111111]">{toPersianDigits(simTariffPct)}٪</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={simTariffPct}
                  onChange={(e) => setSimTariffPct(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <span className="text-[10px] text-[#73726E] block mt-1">کد تعرفه ۷۲۱۰٫۴۹</span>
              </div>
            </div>
          </div>

          {/* Results Bento Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Result Card (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FDFDE8] border-2 border-[#F3F94A] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#73726E]">قیمت تمام‌شده هر تن در انبار بندرعباس:</span>
                  <div className="text-3xl font-black text-[#111111] mt-1">
                    ${toPersianDigits(simResult.unitLandedCostUSD)}
                    <span className="text-xs font-normal text-[#73726E] mr-2">
                      (معادل {formatPersianNumber(simResult.unitLandedCostToman)} تومان / تن)
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-[#73726E] block">مجموع فاکتور واردات:</span>
                  <span className="text-base font-black text-[#111111]">
                    ${formatPersianNumber(simResult.totalLandedCostUSD)}
                  </span>
                </div>
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#111111]/10 text-xs text-[#111111]">
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span>ارزش کالا در مبدأ (FOB Total):</span>
                  <strong>${formatPersianNumber(simResult.fobTotalUSD)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span>
                    کرایه حمل بین‌المللی ({simResult.appliedFreightCorridor.originPort} به رجایی):
                  </span>
                  <strong className="text-[#C05621]">+${formatPersianNumber(simResult.freightTotalUSD)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span>بیمه باربری دریایی (Clause A):</span>
                  <strong>+${formatPersianNumber(simResult.marineInsuranceUSD)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span>حقوق و عوارض گمرکی ({toPersianDigits(simTariffPct)}٪):</span>
                  <strong>+${formatPersianNumber(simResult.dutiesUSD)}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>ترخیص، THC و هزینه‌های بندری شهید رجایی:</span>
                  <strong>+${formatPersianNumber(simResult.customsClearanceUSD)}</strong>
                </div>
              </div>
            </div>

            {/* Market Context Side Card (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#F5F4EE] border border-[#E5E3DC] flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-black text-[#111111] mb-3">نرخ‌های بازار مبنای محاسبه</h5>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#73726E]">کرایه هر کانتینر ۴۰ فوت:</span>
                    <strong className="text-[#111111]">${toPersianDigits(simResult.appliedFreightCorridor.currentRateUSD)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#73726E]">نرخ تسویه دلار نیما:</span>
                    <strong className="text-[#111111]">{formatPersianNumber(simResult.appliedNimaRate)} تومان</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#73726E]">نرخ دلار آزاد تجاری:</span>
                    <strong className="text-[#111111]">{formatPersianNumber(simResult.appliedFreeRate)} تومان</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#73726E]">خط حمل اعمال‌شده:</span>
                    <strong className="text-[#111111]">{simResult.appliedFreightCorridor.carrierName.slice(0, 25)}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E3DC]">
                <button
                  onClick={() => {
                    onShowToast?.(
                      'محاسبه در پیش‌نویس استعلام ذخیره شد',
                      `مبنای قیمت تمام‌شده برای ${simOrigin} لحاظ گردید.`,
                      'success'
                    );
                  }}
                  className="w-full py-2.5 rounded-full bg-[#111111] text-white hover:bg-black font-bold text-xs transition-all text-center"
                >
                  افزودن این سناریو به مقایسه استعلام‌ها
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
