import React, { useState, useMemo } from 'react';
import {
  Scale,
  Sparkles,
  Download,
  Sliders,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { LandedCostBreakdown, RankingWeights, PageId } from '../../types';
import { calculateLandedCost, computeSupplierRankings, ScenarioType } from '../../utils/calculations';
import { toPersianDigits, formatPersianNumber, formatPersianCurrency } from '../../utils/formatters';
import { StatusPill } from '../common/StatusPill';

interface ComparisonPageProps {
  baseItems: LandedCostBreakdown[];
  rankingWeights: RankingWeights;
  onUpdateWeights: (weights: RankingWeights) => void;
  onNavigate: (page: PageId, targetId?: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  baseItems,
  rankingWeights,
  onUpdateWeights,
  onNavigate,
  onShowToast,
}) => {
  const [scenario, setScenario] = useState<ScenarioType>('base');
  const [sliders, setSliders] = useState<RankingWeights>(rankingWeights);

  // Recalculate 4 supplier costs under current scenario
  const calculatedItems = useMemo(() => {
    return baseItems.map((item) => calculateLandedCost(item, scenario));
  }, [baseItems, scenario]);

  // Compute live multi-criteria rankings using the 8 sliders
  const liveRankings = useMemo(() => {
    const metrics = calculatedItems.map((item, idx) => {
      // Mock metrics for demo realism
      const trustScores = [88, 84, 79, 42];
      const qualityScores = [92, 85, 78, 50];
      const capacityScores = [85, 75, 95, 30];
      const paymentScores = [80, 90, 75, 20];
      const countryRiskScores = [15, 28, 20, 55]; // lower is safer
      const respScores = [95, 88, 80, 60];

      return {
        supplierId: item.supplierId,
        supplierName: item.supplierName,
        unitLandedCost: item.unitLandedCost,
        trustScore: trustScores[idx % trustScores.length],
        qualityScore: qualityScores[idx % qualityScores.length],
        capacityScore: capacityScores[idx % capacityScores.length],
        leadTimeDays: item.leadTimeDays,
        paymentScore: paymentScores[idx % paymentScores.length],
        countryRiskScore: countryRiskScores[idx % countryRiskScores.length],
        responsivenessScore: respScores[idx % respScores.length],
      };
    });

    return computeSupplierRankings(metrics, sliders);
  }, [calculatedItems, sliders]);

  const handleSliderChange = (key: keyof RankingWeights, value: number) => {
    const updated = { ...sliders, [key]: value };
    setSliders(updated);
    onUpdateWeights(updated);
  };

  const resetDefaultWeights = () => {
    const def: RankingWeights = {
      landedCost: 30,
      trustScore: 20,
      quality: 15,
      capacity: 10,
      leadTime: 10,
      paymentTerms: 5,
      countryRisk: 5,
      responsiveness: 5,
    };
    setSliders(def);
    onUpdateWeights(def);
    onShowToast('وزن‌های پیش‌فرض بازنشانی شدند', '', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Scenarios & Formula Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Scenario Segmented Control Card (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-[#111111]">تحلیل حساسیت و سناریوهای ریسک</h3>
                <p className="text-xs text-[#73726E] mt-0.5">
                  تغییر پارامترها و محاسبه بی‌درنگ هزینه‌های نهایی (Landed Cost)
                </p>
              </div>
              <StatusPill label="محاسبه بلادرنگ" variant="ai" />
            </div>

            {/* Segmented Control: پایه | ارز +۵٪ | حمل +۲۰٪ */}
            <div className="inline-flex p-1.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] w-full mb-3">
              {[
                { id: 'base', label: 'سناریوی پایه (موجود)' },
                { id: 'fx_plus_5', label: 'افزایش نرخ ارز (+۵٪)' },
                { id: 'freight_plus_20', label: 'جهش کرایه حمل (+۲۰٪)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id as ScenarioType)}
                  className={`flex-1 py-2.5 px-3 rounded-full text-xs font-bold transition-all text-center ${
                    scenario === s.id
                      ? 'bg-[#111111] text-white shadow-none'
                      : 'text-[#73726E] hover:text-[#111111]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#73726E] leading-relaxed">
            {scenario === 'base' && 'در سناریوی پایه، تعرفه‌های جاری گمرکی و کرایه‌های کانتینری رسمی بدون تغییر اعمال شده‌اند.'}
            {scenario === 'fx_plus_5' && 'با افزایش ۵ درصدی ارزش دلار یا تسعیر ارز، قیمت پایه اقلام FOB افزایش یافته و تأمین‌کنندگانی با هزینه‌های ریالی ترخیص برتری نسبی می‌یابند.'}
            {scenario === 'freight_plus_20' && 'با رشد ۲۰ درصدی کرایه حمل دریایی کانتینری، گزینه‌های با مسیر دریایی کوتاه‌تر (مانند ویتنام و هند) یا ترانزیت جاده‌ای (ترکیه) مزیت بالایی پیدا می‌کنند.'}
          </p>
        </div>

        {/* Formula Card (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
              <h4 className="text-sm font-bold text-[#111111]">فرمول استاندارد محاسبه هزینه نهایی واحد</h4>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] text-xs font-medium text-[#111111] leading-relaxed mb-3">
              هزینه نهایی هر واحد = (قیمت کالا + حمل داخلی و خارجی + بیمه + عوارض گمرکی + ترخیص + هزینه‌های جانبی) ÷ تعداد واحد قابل‌تحویل
            </div>
            <p className="text-xs text-[#73726E] leading-relaxed">
              این مدل تمام هزینه‌های پنهان خرید خارجی (شامل انبارداری بندری، کارمزد حواله و دموراژ احتمالی) را محاسبه می‌کند تا سود واقعی واردکننده شفاف باشد.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E5E3DC] text-xs">
            <span className="text-[#73726E]">واحد سنجش: تن متری | بندر مقصد: شهید رجایی</span>
            <button
              onClick={() => onShowToast('جدول محاسبات به تفکیک ردیف‌های هزینه اکسپورت شد', '', 'success')}
              className="font-bold text-[#111111] hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>خروجی اکسل محاسبات</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Supplier Columns with Stacked Cost Bars & Big Final Unit Cost */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" aria-label="مقایسه تأمین‌کنندگان">
        {calculatedItems.map((item, idx) => {
          const isBest = item.isBestOption;
          const isRisky = item.isCheapestRisky;

          // Breakdown proportions
          const goodsCost = item.unitPrice * item.quantity;
          const freightCost = item.inlandFreight + item.internationalFreight;
          const customsCost = item.duties + item.customsClearance;
          const extraCost = item.insurance + item.otherExpenses;
          const total = item.totalLandedCost;

          const pctGoods = Math.round((goodsCost / total) * 100);
          const pctFreight = Math.round((freightCost / total) * 100);
          const pctCustoms = Math.round((customsCost / total) * 100);
          const pctExtra = 100 - pctGoods - pctFreight - pctCustoms;

          return (
            <div
              key={item.supplierId}
              className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                isBest
                  ? 'bg-[#FFFFFF] border-[#111111] ring-2 ring-[#F3F94A]'
                  : isRisky
                  ? 'bg-[#FFFFFF] border-[#F5DFCB]'
                  : 'bg-[#FFFFFF] border-[#E5E3DC]'
              }`}
            >
              <div>
                {/* Column Header & Badges */}
                <div className="flex items-start justify-between mb-3">
                  {isBest && (
                    <span className="px-3 py-1 rounded-full bg-[#F3F94A] text-[#111111] text-xs font-black">
                      بهترین گزینه
                    </span>
                  )}
                  {isRisky && (
                    <span className="px-3 py-1 rounded-full bg-[#F5DFCB] text-[#C05621] text-xs font-black">
                      ارزان‌ترین ولی پرریسک
                    </span>
                  )}
                  {!isBest && !isRisky && (
                    <span className="px-3 py-1 rounded-full bg-[#F5F4EE] text-[#73726E] text-xs font-bold">
                      گزینه ردیف {toPersianDigits(idx + 1)}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#73726E]">{item.incoterm}</span>
                </div>

                <h4 className="font-bold text-sm text-[#111111] leading-tight mb-2">
                  {item.supplierName}
                </h4>

                {/* Big Final Landed Cost Per Unit */}
                <div className="my-4 p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] text-center">
                  <span className="text-[11px] text-[#73726E] block font-semibold mb-1">
                    هزینه نهایی هر واحد (Landed Cost)
                  </span>
                  <div className="text-4xl font-black text-[#111111] tracking-tight">
                    {toPersianDigits(item.unitLandedCost)}
                    <span className="text-sm font-semibold text-[#73726E] mr-1">$ / تن</span>
                  </div>
                  <span className="text-[11px] text-[#73726E] mt-1 block">
                    کل هزینه محموله: {formatPersianNumber(item.totalLandedCost)} دلار
                  </span>
                </div>

                {/* Stacked Cost Bar using hatched and solid segments */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-semibold text-[#73726E]">
                    <span>ترکیب بهای تمام‌شده:</span>
                    <span>۱۰۰٪</span>
                  </div>

                  <div className="h-6 w-full rounded-full overflow-hidden flex border border-[#D0CEBE]">
                    {/* Goods cost (solid black or solid yellow if best) */}
                    <div
                      style={{ width: `${pctGoods}%` }}
                      title={`قیمت کالا: ${pctGoods}٪`}
                      className={isBest ? 'bg-[#F3F94A]' : 'bg-[#111111]'}
                    />
                    {/* Freight (diagonal hatch) */}
                    <div
                      style={{ width: `${pctFreight}%` }}
                      title={`حمل: ${pctFreight}٪`}
                      className="bg-hatched-pattern bg-[#F5F4EE]"
                    />
                    {/* Customs / duties (neutral gray) */}
                    <div
                      style={{ width: `${pctCustoms}%` }}
                      title={`گمرک و عوارض: ${pctCustoms}٪`}
                      className="bg-[#D0CEBE]"
                    />
                    {/* Other (solid) */}
                    <div
                      style={{ width: `${pctExtra}%` }}
                      title={`بیمه و سایر: ${pctExtra}٪`}
                      className="bg-[#8C897B]"
                    />
                  </div>

                  {/* Legend below bar */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#73726E] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${isBest ? 'bg-[#F3F94A]' : 'bg-[#111111]'}`} />
                      <span>کالا ({toPersianDigits(pctGoods)}٪)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-hatched-pattern border border-[#D0CEBE]" />
                      <span>حمل ({toPersianDigits(pctFreight)}٪)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D0CEBE]" />
                      <span>گمرک ({toPersianDigits(pctCustoms)}٪)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8C897B]" />
                      <span>سایر ({toPersianDigits(pctExtra)}٪)</span>
                    </div>
                  </div>
                </div>

                {/* Key Quick Attributes */}
                <div className="space-y-2 text-xs border-t border-[#E5E3DC] pt-3">
                  <div className="flex justify-between">
                    <span className="text-[#73726E]">زمان تحویل:</span>
                    <strong className="text-[#111111]">{toPersianDigits(item.leadTimeDays)} روز</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#73726E]">شرایط پرداخت:</span>
                    <span className="text-[#111111] truncate">{item.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#73726E]">ریسک ارزی:</span>
                    <StatusPill
                      label={item.fxRisk}
                      variant={item.fxRisk === 'پایین' ? 'green' : item.fxRisk === 'متوسط' ? 'orange' : 'alert'}
                      showDot={false}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onNavigate('verification', item.supplierId);
                }}
                className={`w-full mt-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  isBest
                    ? 'bg-[#111111] text-white hover:bg-black'
                    : 'bg-[#F5F4EE] text-[#111111] hover:bg-[#E5E3DC]'
                }`}
              >
                بررسی پروفایل و سوابق
              </button>
            </div>
          );
        })}
      </section>

      {/* Full Comparison Table */}
      <section className="bg-[#FFFFFF] rounded-3xl border border-[#E5E3DC] overflow-hidden">
        <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-[#111111]">جدول ماتریس هزینه‌های تمام‌شده به تفکیک اجزا</h4>
            <p className="text-xs text-[#73726E] mt-0.5">تفکیک شفاف هزینه‌های مستقیم کالا، لجستیک و عوارض ورودی</p>
          </div>
          <span className="text-xs font-bold bg-[#F5F4EE] px-3 py-1.5 rounded-full border border-[#E5E3DC]">
            محاسبه بر مبنای ۱۰۰ تن محموله
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F4EE] border-b border-[#E5E3DC] text-[11px] font-bold text-[#73726E]">
                <th className="py-3 px-5">مؤلفه هزینه / شرایط</th>
                {calculatedItems.map((item) => (
                  <th key={item.supplierId} className="py-3 px-4 font-bold text-[#111111]">
                    {item.supplierName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              <tr>
                <td className="py-3 px-5 font-bold text-[#111111]">قیمت پایه واحد کالا (FOB)</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4 font-black">
                    {toPersianDigits(item.unitPrice)} $
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-[#73726E]">اینکوترمز و محل تحویل</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4">
                    {item.incoterm} ({item.deliveryPoint})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-[#73726E]">بسته‌بندی و پالت چوبی</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4">
                    {formatPersianCurrency(item.packaging)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-[#73726E]">حمل داخلی در کشور مبدأ</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4">
                    {formatPersianCurrency(item.inlandFreight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-[#73726E]">حمل بین‌المللی کانتینری به ایران</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4 font-bold text-[#111111]">
                    {formatPersianCurrency(item.internationalFreight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-[#73726E]">حق بیمه حمل بار دریایی/زمینی</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4">
                    {formatPersianCurrency(item.insurance)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-[#73726E]">حقوق و عوارض گمرکی ۵٪</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4">
                    {formatPersianCurrency(item.duties)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-[#73726E]">هزینه‌های ترخیص و بندری (THC)</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4">
                    {formatPersianCurrency(item.customsClearance)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-[#73726E]">هزینه بازرسی شخص ثالث (Inspection)</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3 px-4">
                    {formatPersianCurrency(item.inspectionCost)}
                  </td>
                ))}
              </tr>
              <tr className="bg-[#F5F4EE]/50 font-bold">
                <td className="py-3.5 px-5 text-[#111111] text-sm">هزینه نهایی کل (Landed Cost)</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3.5 px-4 text-sm font-black text-[#111111]">
                    {formatPersianCurrency(item.totalLandedCost)}
                  </td>
                ))}
              </tr>
              <tr className="bg-[#FDFDE8] font-bold">
                <td className="py-3.5 px-5 text-[#111111] text-sm">هزینه نهایی هر واحد (هر تن)</td>
                {calculatedItems.map((item) => (
                  <td key={item.supplierId} className="py-3.5 px-4 text-base font-black text-[#111111]">
                    {toPersianDigits(item.unitLandedCost)} $
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Weighted Ranking Card with 8 Adjustable Sliders and Live Recomputed Ranking */}
      <section className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC]">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#111111]" />
              <h3 className="text-base font-bold text-[#111111]">
                رتبه‌بندی وزنی چندمعیاره با ۸ اسلایدر تنظیم‌شونده
              </h3>
            </div>
            <p className="text-xs text-[#73726E] mt-0.5">
              تغییر اوزان فوراً رتبه و امتیاز ترکیبی هر تأمین‌کننده را مجدداً محاسبه می‌کند
            </p>
          </div>
          <button
            onClick={resetDefaultWeights}
            className="px-4 py-1.5 rounded-full bg-[#F5F4EE] hover:bg-[#E5E3DC] border border-[#E5E3DC] text-xs font-bold text-[#111111] flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بازنشانی پیش‌فرض</span>
          </button>
        </div>

        {/* 8 Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { key: 'landedCost', label: 'هزینه نهایی (Landed Cost)', val: sliders.landedCost },
            { key: 'trustScore', label: 'امتیاز اعتبار و ممیزی', val: sliders.trustScore },
            { key: 'quality', label: 'کیفیت و استاندارد متالورژی', val: sliders.quality },
            { key: 'capacity', label: 'ظرفیت و توان عملیاتی', val: sliders.capacity },
            { key: 'leadTime', label: 'زمان تحویل و سرعت بارگیری', val: sliders.leadTime },
            { key: 'paymentTerms', label: 'شرایط پرداخت و LC', val: sliders.paymentTerms },
            { key: 'countryRisk', label: 'امنیت سیاسی و ریسک کشور', val: sliders.countryRisk },
            { key: 'responsiveness', label: 'سرعت پاسخگویی و پشتیبانی', val: sliders.responsiveness },
          ].map((slider) => (
            <div key={slider.key} className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
              <div className="flex justify-between text-xs font-bold text-[#111111] mb-2">
                <span className="truncate pl-1">{slider.label}</span>
                <span className="bg-white px-2 py-0.5 rounded-full border border-[#E5E3DC] shrink-0">
                  {toPersianDigits(slider.val)}٪
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={slider.val}
                onChange={(e) => handleSliderChange(slider.key as any, Number(e.target.value))}
                className="w-full accent-[#111111] cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Live Recomputed Ranking Results Box */}
        <div className="p-4 rounded-2xl bg-[#111111] text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#F3F94A]">
              نتیجه رتبه‌بندی وزنی زنده (Live Composite Ranking):
            </span>
            <span className="text-[11px] text-white/70">مجموع اوزان: ۱۰۰٪</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {liveRankings.map((res) => {
              const isFirst = res.rank === 1;
              return (
                <div
                  key={res.supplierId}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isFirst
                      ? 'bg-[#F3F94A] text-black border-[#F3F94A]'
                      : 'bg-white/10 text-white border-white/10'
                  }`}
                >
                  <div>
                    <div className="text-xs font-black truncate">{res.supplierName}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      امتیاز ترکیبی: {toPersianDigits(res.totalScore)} از ۱۰۰
                    </div>
                  </div>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      isFirst ? 'bg-black text-[#F3F94A]' : 'bg-white/20 text-white'
                    }`}
                  >
                    #{toPersianDigits(res.rank)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
