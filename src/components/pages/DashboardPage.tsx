import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { PageId, Supplier, RFQItem, MonitoringAlert } from '../../types';
import { Sparkline } from '../common/Sparkline';
import { StatusPill } from '../common/StatusPill';
import { toPersianDigits, formatPersianNumber } from '../../utils/formatters';
import { SupplyRiskMatrix } from '../dashboard/SupplyRiskMatrix';
import { LiveMarketTicker } from '../market/LiveMarketTicker';

interface DashboardPageProps {
  onNavigate: (page: PageId, targetId?: string) => void;
  suppliers: Supplier[];
  rfqs: RFQItem[];
  alerts: MonitoringAlert[];
  onTriggerDownload: (filename: string, format: 'PDF' | 'XLSX') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  suppliers,
  rfqs,
  alerts,
  onTriggerDownload,
}) => {
  // 7 KPIs
  const kpis = [
    { label: 'کالاهای تحت پایش', value: '۲۴', trend: '+۲', isPositive: true, sub: 'اقلام فعال وارداتی' },
    { label: 'تأمین‌کنندگان فعال', value: '۵۸', trend: '+۵', isPositive: true, sub: 'احراز صلاحیت شده' },
    { label: 'پیشنهادهای جدید', value: '۱۲', trend: '+۳', isPositive: true, sub: 'نیازمند بررسی مدیر' },
    { label: 'صرفه‌جویی احتمالی', value: '۱۸۴', unit: 'هزار دلار', trend: '+۱۲٪', isPositive: true, sub: 'در سناریوی بهینه' },
    { label: 'ریسک‌های فعال', value: '۵', trend: '−۱', isPositive: false, isAlert: true, sub: '۲ مورد اولویت بالا' },
    { label: 'درخواست‌های باز (RFQ)', value: '۷', trend: '+۲', isPositive: true, sub: 'در گردش استعلام' },
    { label: 'نمونه‌ها در کنترل کیفیت', value: '۴', trend: 'عادی', isPositive: true, sub: 'در مرحله آزمون متالورژی' },
  ];

  // 6 hatched monthly bars + 1 black bar for price changes
  const monthlyPriceTrends = [
    { month: 'اردیبهشت', value: 760, isCurrent: false },
    { month: 'خرداد', value: 745, isCurrent: false },
    { month: 'تیر', value: 730, isCurrent: false },
    { month: 'مرداد', value: 715, isCurrent: false },
    { month: 'شهریور', value: 698, isCurrent: false },
    { month: 'مهر', value: 690, isCurrent: false },
    { month: 'آبان (جاری)', value: 685, isCurrent: true },
  ];

  const maxPrice = 800;
  const sparklineData = [760, 750, 742, 730, 715, 700, 690, 685];

  return (
    <div className="space-y-6">
      {/* Live Market Indicators Ticker Bar */}
      <LiveMarketTicker showScenarioPills={false} />

      {/* 7 KPI Cards in Bento-grid row */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5" aria-label="شاخص‌های کلیدی عملکرد">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between min-h-[130px] hover:border-[#111111] transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-[#73726E] leading-tight">
                {kpi.label}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  kpi.isAlert
                    ? 'bg-[#FDEBE6] text-[#C53030]'
                    : kpi.isPositive
                    ? 'bg-[#D5E8D4] text-[#2D7D32]'
                    : 'bg-[#F5DFCB] text-[#C05621]'
                }`}
              >
                {kpi.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {toPersianDigits(kpi.trend)}
              </span>
            </div>

            <div className="mt-2">
              <div className="text-3xl font-black text-[#111111] tracking-tight flex items-baseline gap-1">
                <span>{kpi.value}</span>
                {kpi.unit && <span className="text-xs font-semibold text-[#73726E]">{kpi.unit}</span>}
              </div>
              <p className="text-[11px] text-[#73726E] mt-1 truncate">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Middle Row: Hero Yellow Card + Monthly Price Bars + Alternative Markets */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Yellow Hero KPI Card (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#F3F94A] p-6 border border-[#E5E3DC] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-black text-[#F3F94A] px-3 py-1 rounded-full">
                بهینه‌سازی هوشمند
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-[#111111]">
                <Sparkles className="w-3.5 h-3.5" />
                سورسینگ مستقیم
              </span>
            </div>
            <span className="text-xs text-[#111111] font-semibold bg-white/70 px-2.5 py-1 rounded-full border border-black/10">
              آبان ۱۴۰۳
            </span>
          </div>

          <div className="my-6">
            <span className="text-sm font-semibold text-[#111111] block mb-1">
              صرفه‌جویی احتمالی هزینه نهایی (Landed Cost)
            </span>
            <div className="text-5xl font-black text-[#111111] tracking-tight">
              ۸٫۷٪
            </div>
            <p className="text-xs text-[#111111]/80 mt-2 font-medium leading-relaxed">
              با تغییر مبدأ خرید ورق فولادی از چین به تولیدکننده معتبر در ویتنام (Hanoi Steel Works)
            </p>
          </div>

          {/* Sparkline ending in crisp black dot */}
          <div className="pt-2 border-t border-black/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#111111] block">روند نزولی بهای تمام‌شده</span>
              <span className="text-[11px] text-[#111111]/70">۲۴ ماه گذشته</span>
            </div>
            <Sparkline data={sparklineData} width={150} height={42} strokeWidth={2.8} />
          </div>
        </div>

        {/* Monthly Price Trend Card with 6 Hatched Bars and 1 Solid Black Bar (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#FFFFFF] p-6 border border-[#E5E3DC] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#111111]">تغییرات قیمت کلاف فولادی (تن / دلار)</h3>
              <p className="text-xs text-[#73726E] mt-0.5">۶ ماه اخیر با بافت راه‌راه معکوس و ماه جاری در مشکی مات</p>
            </div>
            <span className="text-xs font-bold bg-[#F5F4EE] px-3 py-1 rounded-full border border-[#E5E3DC]">
              −۹٫۸٪ در ۶ ماه
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {monthlyPriceTrends.map((bar, idx) => {
              const heightPercent = Math.round((bar.value / maxPrice) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#111111] mb-1 opacity-80 group-hover:opacity-100">
                    {toPersianDigits(bar.value)}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-2xl transition-all duration-300 relative border border-[#D0CEBE] ${
                      bar.isCurrent
                        ? 'bg-[#111111] border-[#111111] shadow-none'
                        : 'bg-hatched-pattern bg-[#F5F4EE] hover:border-[#111111]'
                    }`}
                  >
                    {bar.isCurrent && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F3F94A]" />
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-2 whitespace-nowrap ${
                      bar.isCurrent ? 'font-bold text-[#111111]' : 'text-[#73726E]'
                    }`}
                  >
                    {bar.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E5E3DC] flex items-center justify-between text-xs text-[#73726E]">
            <span>شاخص قیمت بنادر شرق آسیا (FOB)</span>
            <button
              onClick={() => onNavigate('markets')}
              className="text-[#111111] font-semibold hover:underline flex items-center gap-1"
            >
              <span>تحلیل ۲۴ ماهه بازارها</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Alternative Markets List (3 cols) */}
        <div className="lg:col-span-3 rounded-3xl bg-[#FFFFFF] p-6 border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#111111]">بازارهای جایگزین</h3>
              <StatusPill label="فرصت‌های فعال" variant="ai" />
            </div>
            <p className="text-xs text-[#73726E] mb-4">
              مقایسه کاهش هزینه نسبت به مبدأ فعلی (چین)
            </p>

            <div className="space-y-3">
              {[
                { country: 'ویتنام', delta: '−۸٫۷٪', lead: '۲۸ روز', risk: 'ریسک پایین', bg: 'bg-[#FDFDE8] border-[#F3F94A]' },
                { country: 'ترکیه', delta: '−۵٫۲٪', lead: '۱۸ روز', risk: 'حمل زمینی سریع', bg: 'bg-[#F5F4EE] border-[#E5E3DC]' },
                { country: 'هند', delta: '−۴٫۱٪', lead: '۲۴ روز', risk: 'تسویه روپیه', bg: 'bg-[#F5F4EE] border-[#E5E3DC]' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('markets')}
                  className={`p-3 rounded-2xl border ${item.bg} flex items-center justify-between cursor-pointer hover:border-[#111111] transition-all`}
                >
                  <div>
                    <div className="font-bold text-sm text-[#111111]">{item.country}</div>
                    <div className="text-[11px] text-[#73726E] mt-0.5">
                      زمان تحویل: {toPersianDigits(item.lead)} | {item.risk}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-black text-[#2D7D32] bg-[#D5E8D4] px-2.5 py-1 rounded-full">
                      {item.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('markets')}
            className="w-full mt-4 py-2.5 rounded-full bg-[#F5F4EE] hover:bg-[#E5E3DC] text-xs font-bold text-[#111111] border border-[#E5E3DC] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>مشاهده نقشه و تحلیل کامل بازارها</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Bottom Section: Bento Grid with Open RFQs, AI Alerts, QC Inspections, and Manager Reports */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Open RFQs List (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-[#FFFFFF] p-6 border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111111]">درخواست‌های قیمت باز (RFQs)</h3>
                <p className="text-xs text-[#73726E] mt-0.5">وضعیت پاسخ‌دهی و پیشرفت استعلام‌های کالا</p>
              </div>
              <button
                onClick={() => onNavigate('rfq')}
                className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
              >
                <span>همه استعلام‌ها</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {rfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  onClick={() => onNavigate('rfq')}
                  className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] hover:border-[#111111] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-[#111111] text-white px-2.5 py-0.5 rounded-full">
                        {toPersianDigits(rfq.code)}
                      </span>
                      <h4 className="text-sm font-bold text-[#111111]">{rfq.title}</h4>
                    </div>
                    <StatusPill
                      label={rfq.status}
                      variant={rfq.status === 'فعال' ? 'green' : 'neutral'}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#73726E] mt-3 pt-2 border-t border-[#E5E3DC]">
                    <div className="flex items-center gap-4">
                      <span>ارسال: {toPersianDigits(rfq.sentCount)}</span>
                      <span>پاسخ: {toPersianDigits(rfq.respondedCount)} از {toPersianDigits(rfq.sentCount)}</span>
                      <span className="font-semibold text-[#111111]">منتخب: {toPersianDigits(rfq.shortlistedCount)}</span>
                    </div>
                    <span className="text-[11px]">مهلت: {toPersianDigits(rfq.deadlineDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E3DC] flex items-center justify-between">
            <span className="text-xs text-[#73726E]">میانگین زمان پاسخگویی تأمین‌کنندگان: ۴٫۲ روز</span>
            <button
              onClick={() => onNavigate('rfq')}
              className="text-xs font-bold text-[#111111] hover:underline"
            >
              مدیریت مذاکرات قیمت →
            </button>
          </div>
        </div>

        {/* AI Alerts to Review (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-[#FFFFFF] p-6 border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111111]">هشدارهای هوشمند نیازمند اقدام</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F3F94A] animate-pulse" />
              </div>
              <button
                onClick={() => onNavigate('monitoring')}
                className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
              >
                <span>مشاهده پرونده پایش</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alert.isFeatured
                      ? 'bg-[#FDFDE8] border-[#F3F94A]'
                      : 'bg-[#F5F4EE] border-[#E5E3DC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <StatusPill
                      label={alert.type}
                      variant={alert.isFeatured ? 'ai' : 'neutral'}
                    />
                    <span className="text-[11px] text-[#73726E]">{alert.date} - {alert.time}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[#111111] mb-1">{alert.title}</h4>
                  <p className="text-xs text-[#73726E] leading-relaxed line-clamp-2">
                    {alert.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#E5E3DC]/70">
                    <span className="text-[11px] text-[#73726E]">{alert.productName}</span>
                    <button
                      onClick={() => onNavigate(alert.targetPage, alert.targetId)}
                      className="px-3 py-1 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold transition-all"
                    >
                      بررسی
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reports Bar for Procurement Manager */}
          <div className="mt-4 pt-4 border-t border-[#E5E3DC] bg-[#F5F4EE] p-3 rounded-2xl flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#111111]" />
              <span className="text-xs font-bold text-[#111111]">گزارش خلاصه هفتگی خرید تجاری</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTriggerDownload('گزارش_خرید_هفتگی_آبان_۱۴۰۳', 'PDF')}
                className="px-3 py-1 rounded-full bg-white hover:bg-[#E5E3DC] text-[11px] font-bold text-[#111111] border border-[#E5E3DC] flex items-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => onTriggerDownload('ماتریس_قیمت_تأمین‌کنندگان', 'XLSX')}
                className="px-3 py-1 rounded-full bg-white hover:bg-[#E5E3DC] text-[11px] font-bold text-[#111111] border border-[#E5E3DC] flex items-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>XLSX</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Supply Risk Matrix (Visual 2D Bubble Chart: Likelihood vs Impact) */}
      <section aria-label="ماتریس ریسک تأمین">
        <SupplyRiskMatrix onNavigate={onNavigate} />
      </section>

      {/* Samples & Active Risks Bar */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Samples & QC */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2D7D32]" />
              <h4 className="text-sm font-bold text-[#111111]">نمونه‌ها در مرحله کنترل کیفیت (QC)</h4>
            </div>
            <span className="text-xs font-semibold text-[#73726E]">۴ نمونه فعال</span>
          </div>
          <div className="space-y-2">
            {[
              { company: 'Hanoi Steel Works (ویتنام)', sample: 'کلاف آزمایشی ورق Z275 ضخامت ۰٫۸', status: 'قبولی در آزمون کشش و چسبندگی روی', date: '۱۴۰۳/۰۸/۰۲' },
              { company: 'Anatolia Metal (ترکیه)', sample: 'ورق DX51D عرض ۱۲۵۰', status: 'در حال آزمایش در آزمایشگاه متالورژی رازی', date: '۱۴۰۳/۰۷/۲۸' },
            ].map((s, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#F5F4EE] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#111111]">{s.company}</div>
                  <div className="text-[11px] text-[#73726E] mt-0.5">{s.sample}</div>
                </div>
                <div className="text-left shrink-0">
                  <span className="font-medium text-[#2D7D32] bg-[#D5E8D4] px-2 py-0.5 rounded-full text-[10px]">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Risks Quick Summary */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C53030]" />
                <h4 className="text-sm font-bold text-[#111111]">اقدامات اضطراری کاهش ریسک (Action Plan)</h4>
              </div>
              <StatusPill label="۵ ریسک رصد شده" variant="alert" />
            </div>
            <div className="space-y-2">
              {[
                { title: 'نوسان کرایه کانتینری مسیر شانگهای-بندرعباس (+۱۸٫۷٪)', level: 'بحرانی', sol: 'انتقال ۳۰٪ بار به خط مستقیم هایفونگ ویتنام' },
                { title: 'احتمال واسطه‌گری کاغذی در معاملات هنگ‌کنگ', level: 'پایش ویژه', sol: 'الزام بازرسی میدانی و انطباق حساب بانکی سوئیفت' },
              ].map((r, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#FDEBE6] border border-[#FADCD5] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#C53030]">{r.title}</div>
                    <div className="text-[11px] text-[#73726E] mt-0.5">راهکار مصوب: {r.sol}</div>
                  </div>
                  <span className="font-bold text-[#C53030] shrink-0 text-[11px]">
                    {r.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 text-[11px] text-[#73726E] flex justify-between items-center">
            <span>تحلیل ریسک متصل به ماژول پایش مستمر بازار</span>
            <button
              onClick={() => onNavigate('monitoring')}
              className="text-[#111111] font-bold hover:underline"
            >
              مدیریت پرونده‌های پایش →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
