import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  PieChart,
  Clock,
  Layers,
  Sparkles,
  Mail,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { PageId } from '../../types';
import { HatchedFunnelStep } from '../common/HatchedBar';
import { StatusPill } from '../common/StatusPill';
import { toPersianDigits, formatPersianNumber, formatPersianPercent } from '../../utils/formatters';

interface ReportsPageProps {
  onTriggerDownload: (filename: string, format: 'PDF' | 'XLSX' | 'CSV') => void;
  onNavigate: (page: PageId) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  onTriggerDownload,
  onNavigate,
  onShowToast,
}) => {
  const [autoSendEmail, setAutoSendEmail] = useState(true);
  const [autoSendWeekly, setAutoSendWeekly] = useState(true);

  // Sourcing Funnel numbers
  const funnelSteps = [
    { title: 'کالاهای تعریف‌شده', count: '۲۴', isKey: false },
    { title: 'تأمین‌کنندگان یافت‌شده', count: '۳۱۲', isKey: false },
    { title: 'تأییدشده', count: '۱۴۸', isKey: false },
    { title: 'درخواست‌های ارسالی', count: '۴۱', isKey: false },
    { title: 'سفارش‌های نهایی', count: '۹', isKey: true },
  ];

  // Monthly savings bars
  const monthlySavings = [
    { month: 'اردیبهشت', savings: 14000 },
    { month: 'خرداد', savings: 22000 },
    { month: 'تیر', savings: 28000 },
    { month: 'مرداد', savings: 34000 },
    { month: 'شهریور', savings: 38000 },
    { month: 'مهر (جاری)', savings: 48000, isCurrent: true },
  ];
  const maxSavings = 50000;

  // Spend by country breakdown
  const spendByCountry = [
    { country: 'چین', share: 62, spendUSD: '۱٬۲۴۰٬۰۰۰', color: '#111111' },
    { country: 'ویتنام', share: 18, spendUSD: '۳۶۰٬۰۰۰', color: '#F3F94A' },
    { country: 'ترکیه', share: 12, spendUSD: '۲۴۰٬۰۰۰', color: '#8C897B' },
    { country: 'هند', share: 8, spendUSD: '۱۶۰٬۰۰۰', color: '#D0CEBE' },
  ];

  // Top supplier ranking
  const topRankedSuppliers = [
    { rank: 1, name: 'Hanoi Steel Works', country: 'ویتنام', orders: 4, spend: '۲۸۰٬۰۰۰ $', onTime: '۹۸٪', qualityScore: '۹۶٪' },
    { rank: 2, name: 'Anatolia Metal Corp.', country: 'ترکیه', orders: 3, spend: '۲۱۰٬۰۰۰ $', onTime: '۹۴٪', qualityScore: '۹۲٪' },
    { rank: 3, name: 'Shandong Coil Co.', country: 'چین', orders: 2, spend: '۳۴۰٬۰۰۰ $', onTime: '۸۹٪', qualityScore: '۸۸٪' },
  ];

  // Ready downloadable reports
  const readyReports = [
    { id: 'rep-1', title: 'سند ممیزی و تحلیل ریسک زنجیره تأمین ۲۰۲۶', date: '۱۴۰۳/۰۸/۰۱', pages: '۲۸ صفحه', size: '۴٫۲ MB' },
    { id: 'rep-2', title: 'گزارش مقایسه بهای تمام‌شده Landed Cost ورق فولادی', date: '۱۴۰۳/۰۷/۲۸', pages: '۱۶ صفحه', size: '۲٫۸ MB' },
    { id: 'rep-3', title: 'تحلیل ژئوپلیتیک بنادر آسیایی و تعرفه‌های گمرکی ۱۴۰۳', date: '۱۴۰۳/۰۷/۱۵', pages: '۱۲ صفحه', size: '۱٫۹ MB' },
  ];

  return (
    <div className="space-y-6">
      {/* Sourcing Funnel (Full Width Bento Card) */}
      <section className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3DC]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#111111]">قیف کلان سورسینگ بازرگانی (Sourcing Funnel)</h3>
            <p className="text-xs text-[#73726E] mt-0.5">تبدیل اقلام تعریف‌شده به سفارش‌های خرید موفق در بازارهای بین‌المللی</p>
          </div>
          <span className="text-xs font-bold bg-[#F5F4EE] px-3 py-1 rounded-full border border-[#E5E3DC]">
            عملکرد سالانه
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {funnelSteps.map((step, idx) => (
            <HatchedFunnelStep
              key={idx}
              title={step.title}
              count={step.count}
              isKey={step.isKey}
            />
          ))}
        </div>
      </section>

      {/* Middle Row: Yellow Hero Savings Card + Supply Concentration + Delivery Performance */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Yellow Hero Realized Savings Card (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#F3F94A] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black bg-[#111111] text-[#F3F94A] px-3 py-1 rounded-full">
                صرفه‌جویی خالص تجاری
              </span>
              <span className="text-xs font-bold text-[#111111]">سال مالی ۱۴۰۳</span>
            </div>

            <div className="my-4">
              <span className="text-xs font-semibold text-[#111111] block mb-1">
                مجموع صرفه‌جویی محقق‌شده:
              </span>
              <div className="text-4xl font-black text-[#111111] tracking-tight">
                ۱۸۴ هزار دلار
              </div>
              <p className="text-xs text-[#111111]/80 mt-2 font-medium leading-relaxed">
                حاصل از جایگزینی خرید مستقیم از کارخانجات معتبر ویتنام و ترکیه به جای دلالان واسطه در مبدأ چین.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-black/10 flex justify-between text-xs text-[#111111] font-bold">
            <span>بازگشت سرمایه ابزار سورسینگ:</span>
            <span>۱۲٫۴ برابر</span>
          </div>
        </div>

        {/* Supply Concentration (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#111111]">تراکم و ریسک تمرکز تأمین (Concentration)</h4>
              <StatusPill label="ریسک متوسط" variant="orange" />
            </div>
            <p className="text-xs text-[#73726E] mb-4">میزان وابستگی زنجیره تأمین به یک کشور یا شرکت واحد</p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex justify-between items-center">
                <span className="text-xs text-[#73726E]">سهم کشور برتر (چین):</span>
                <span className="text-base font-black text-[#111111]">۶۲٪</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex justify-between items-center">
                <span className="text-xs text-[#73726E]">میانگین تأمین‌کننده در هر کالا:</span>
                <span className="text-base font-black text-[#111111]">۳٫۴ شرکت</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex justify-between items-center">
                <span className="text-xs text-[#73726E]">اقلام تک‌منبعی (Single-Source):</span>
                <span className="text-base font-black text-[#C53030]">۵ قلم کالا</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E3DC] text-xs text-[#73726E]">
            هدف استراتژیک: کاهش سهم چین به زیر ۴۵٪ تا پایان سال
          </div>
        </div>

        {/* Delivery Performance (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#111111]">شاخص‌های عملکرد تحویل و کیفیت</h4>
              <StatusPill label="عملکرد عالی" variant="green" />
            </div>
            <p className="text-xs text-[#73726E] mb-4">پایش تعهدات زمانی و انطباق کیفی سفارش‌ها</p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex justify-between items-center">
                <span className="text-xs text-[#73726E]">تحویل به‌موقع در بندر (On-time):</span>
                <span className="text-base font-black text-[#2D7D32]">۹۴٪</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex justify-between items-center">
                <span className="text-xs text-[#73726E]">میانگین زمان چرخه تحویل:</span>
                <span className="text-base font-black text-[#111111]">۳۸ روز کاری</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex justify-between items-center">
                <span className="text-xs text-[#73726E]">قبولی در آزمون کیفیت (QC Pass):</span>
                <span className="text-base font-black text-[#2D7D32]">۹۷٪</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E3DC] text-xs text-[#73726E]">
            عدم انطباق متالورژی: صفر پرونده مرجوعی در ۶ ماه گذشته
          </div>
        </div>
      </section>

      {/* Monthly Savings Bars & Spend Distribution Donut */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Monthly Savings Bars (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#111111]">روند رشد ماهانه صرفه‌جویی خرید خارجی</h4>
                <p className="text-xs text-[#73726E] mt-0.5">افزایش بهره‌وری با گسترش استعلام‌های چندکشوری (دلار)</p>
              </div>
              <span className="text-xs font-bold bg-[#F5F4EE] px-3 py-1 rounded-full border border-[#E5E3DC]">
                رشد پیوسته ۶ ماهه
              </span>
            </div>

            <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2">
              {monthlySavings.map((item, idx) => {
                const heightPct = Math.round((item.savings / maxSavings) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#111111] mb-1">
                      {formatPersianNumber(item.savings / 1000)}k
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-2xl transition-all border border-[#D0CEBE] ${
                        item.isCurrent
                          ? 'bg-[#F3F94A] border-[#111111]'
                          : 'bg-hatched-pattern bg-[#F5F4EE]'
                      }`}
                    />
                    <span className={`text-[11px] mt-2 whitespace-nowrap ${item.isCurrent ? 'font-bold text-[#111111]' : 'text-[#73726E]'}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E3DC] flex justify-between text-xs text-[#73726E]">
            <span>بیشترین صرفه‌جویی در ماه جاری: ۴۸ هزار دلار</span>
            <span className="font-bold text-[#111111]">رشد +۲۴۲٪ نسبت به ماه اول</span>
          </div>
        </div>

        {/* Spend by Country Donut / Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-[#111111]">توزیع حجم پرداخت‌های ارزی بر حسب کشور مبدأ</h4>
              <PieChart className="w-4 h-4 text-[#73726E]" />
            </div>
            <p className="text-xs text-[#73726E] mb-4">کل پرداخت‌های گشایش یافته: ۲٬۰۰۰٬۰۰۰ دلار</p>

            <div className="space-y-3">
              {spendByCountry.map((item) => (
                <div key={item.country} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.country}</span>
                    </div>
                    <span className="text-[#111111]">
                      {item.spendUSD} $ ({toPersianDigits(item.share)}٪)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#E5E3DC] overflow-hidden">
                    <div
                      style={{ width: `${item.share}%`, backgroundColor: item.color }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E3DC] text-xs text-[#73726E]">
            سهم ویتنام در سه ماه اخیر از ۰٪ به ۱۸٪ افزایش یافته است.
          </div>
        </div>
      </section>

      {/* Supplier Ranking Table */}
      <section className="bg-[#FFFFFF] rounded-3xl border border-[#E5E3DC] overflow-hidden">
        <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between">
          <h4 className="text-base font-bold text-[#111111]">رتبه‌بندی عملکرد شرکای تجاری و تأمین‌کنندگان برتر</h4>
          <span className="text-xs font-semibold bg-[#F5F4EE] px-3 py-1 rounded-full border border-[#E5E3DC]">
            بر اساس انطباق با تعهدات قرارداد
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F4EE] border-b border-[#E5E3DC] text-[11px] font-bold text-[#73726E]">
                <th className="py-3 px-5">رتبه</th>
                <th className="py-3 px-4">تأمین‌کننده</th>
                <th className="py-3 px-4">کشور</th>
                <th className="py-3 px-4">سفارش‌های محقق‌شده</th>
                <th className="py-3 px-4">مجموع خرید ارزی</th>
                <th className="py-3 px-4">تحویل به‌موقع</th>
                <th className="py-3 px-4">امتیاز آزمون آزمایشگاهی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {topRankedSuppliers.map((s) => (
                <tr key={s.rank} className="hover:bg-[#F5F4EE]/50 transition-colors">
                  <td className="py-3.5 px-5 font-black text-sm">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-[#F3F94A] inline-flex items-center justify-center text-xs">
                      {toPersianDigits(s.rank)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#111111]">{s.name}</td>
                  <td className="py-3.5 px-4">{s.country}</td>
                  <td className="py-3.5 px-4">{toPersianDigits(s.orders)} سفارش</td>
                  <td className="py-3.5 px-4 font-bold">{toPersianDigits(s.spend)}</td>
                  <td className="py-3.5 px-4 text-[#2D7D32] font-semibold">{toPersianDigits(s.onTime)}</td>
                  <td className="py-3.5 px-4 font-black">{toPersianDigits(s.qualityScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ready Reports List with PDF/XLSX/CSV Buttons & Auto-send Toggles */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Ready Reports (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC]">
          <h4 className="text-base font-bold text-[#111111] mb-1">گزارش‌های آماده برای ارائه به هیئت مدیره</h4>
          <p className="text-xs text-[#73726E] mb-4">اسناد رسمی تحلیلی تدوین‌شده با استانداردهای مدیریت خرید</p>

          <div className="space-y-3">
            {readyReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between flex-wrap gap-3"
              >
                <div>
                  <h5 className="font-bold text-xs text-[#111111]">{rep.title}</h5>
                  <div className="text-[11px] text-[#73726E] mt-1">
                    تاریخ صدور: {toPersianDigits(rep.date)} | {toPersianDigits(rep.pages)} | حجم فایل: {rep.size}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTriggerDownload(rep.title, 'PDF')}
                    className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F3F94A]" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => onTriggerDownload(rep.title, 'XLSX')}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#E5E3DC] border border-[#E5E3DC] text-xs font-bold text-[#111111] flex items-center gap-1 transition-all"
                  >
                    <span>XLSX</span>
                  </button>
                  <button
                    onClick={() => onTriggerDownload(rep.title, 'CSV')}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#E5E3DC] border border-[#E5E3DC] text-xs font-bold text-[#111111] flex items-center gap-1 transition-all"
                  >
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Auto-Send Toggles (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#111111] mb-1">ارسال خودکار گزارش‌ها (Auto-Send)</h4>
            <p className="text-xs text-[#73726E] mb-4">زمان‌بندی ارسال کارپوشه به مدیران ارشد شرکت</p>

            <div className="space-y-3">
              <div
                onClick={() => setAutoSendEmail(!autoSendEmail)}
                className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#111111]">ارسال ایمیلی گزارش ماهانه</div>
                  <div className="text-[10px] text-[#73726E]">به مدیرعامل و امور مالی</div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                    autoSendEmail ? 'bg-[#111111] justify-end' : 'bg-[#D0CEBE] justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              <div
                onClick={() => setAutoSendWeekly(!autoSendWeekly)}
                className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#111111]">خلاصه عملکرد هفتگی در شنبه‌ها</div>
                  <div className="text-[10px] text-[#73726E]">به کارتابل مدیر خرید</div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                    autoSendWeekly ? 'bg-[#111111] justify-end' : 'bg-[#D0CEBE] justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onShowToast('زمان‌بندی ارسال گزارش‌ها به‌روزرسانی شد', '', 'success')}
            className="w-full mt-4 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold transition-all"
          >
            ذخیره تنظیمات ارسال خودکار
          </button>
        </div>
      </section>
    </div>
  );
};
