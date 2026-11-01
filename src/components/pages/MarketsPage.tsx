import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Search,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Ship,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { MarketAlternative, PageId } from '../../types';
import { Sparkline } from '../common/Sparkline';
import { StatusPill } from '../common/StatusPill';
import { HatchedProgressBar } from '../common/HatchedBar';
import { toPersianDigits, formatPersianNumber, formatPersianPercent } from '../../utils/formatters';

interface MarketsPageProps {
  markets: MarketAlternative[];
  onNavigate: (page: PageId, targetId?: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({
  markets,
  onNavigate,
  onShowToast,
}) => {
  const [timeframe, setTimeframe] = useState<'12m' | '24m'>('24m');
  const [selectedCountry, setSelectedCountry] = useState<string>('Vietnam');

  const topMarket = markets.find((m) => m.country === 'Vietnam') || markets[0];
  const activeMarket = markets.find((m) => m.country === selectedCountry) || topMarket;

  // Key world map coordinate pins (stylized geographical layout)
  // [name, x%, y%, isTop, isCurrent]
  const mapNodes = [
    { id: 'VN', name: 'ویتنام', x: 74, y: 56, isTop: true, savings: '−۸٫۷٪', color: '#F3F94A' },
    { id: 'CN', name: 'چین', x: 76, y: 44, isCurrent: true, savings: 'مبدأ فعلی', color: '#111111' },
    { id: 'TR', name: 'ترکیه', x: 53, y: 42, isAlt: true, savings: '−۵٫۲٪', color: '#8C897B' },
    { id: 'IN', name: 'هند', x: 67, y: 52, isAlt: true, savings: '−۴٫۱٪', color: '#8C897B' },
    { id: 'KR', name: 'کره جنوبی', x: 81, y: 43, isAlt: true, savings: '+۴٫۰٪', color: '#8C897B' },
    { id: 'AE', name: 'امارات', x: 58, y: 49, isAlt: true, savings: '−۲٫۰٪', color: '#8C897B' },
    { id: 'IR', name: 'ایران (مقصد)', x: 56, y: 45, isDest: true, color: '#2D7D32' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Timeframe Toggle */}
      <section className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3DC] flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-[#111111]">نقشه جامع بازارهای جایگزین و مسیرهای بهینه سورسینگ</h2>
          <p className="text-xs text-[#73726E] mt-0.5">
            تحلیل جریان‌های صادراتی جهانی فولاد و کشف تأمین‌کنندگان خارج از کانون‌های گران‌قیمت
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 12m | 24m Toggle */}
          <div className="inline-flex p-1 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]">
            <button
              onClick={() => setTimeframe('12m')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                timeframe === '12m' ? 'bg-[#111111] text-white' : 'text-[#73726E]'
              }`}
            >
              ۱۲ ماه اخیر
            </button>
            <button
              onClick={() => setTimeframe('24m')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                timeframe === '24m' ? 'bg-[#111111] text-white' : 'text-[#73726E]'
              }`}
            >
              ۲۴ ماه اخیر
            </button>
          </div>

          <button
            onClick={() => onNavigate('suppliers')}
            className="px-5 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black font-semibold text-xs transition-all flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5 text-[#F3F94A]" />
            <span>بررسی تأمین‌کنندگان</span>
          </button>
        </div>
      </section>

      {/* Stylized Dotted World Map & Yellow Hero Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* World Map Card (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-[#111111]">جغرافیای صادرات و مسیرهای بهینه ترانزیت</h3>
              <p className="text-xs text-[#73726E]">کشورهای صادرکننده با بافت راه‌راه و بهترین جایگزین در زرد فسفری</p>
            </div>
            <span className="text-xs font-bold bg-[#F5F4EE] px-3 py-1 rounded-full border border-[#E5E3DC]">
              مقصد: مجتمع بندری شهید رجایی
            </span>
          </div>

          {/* Dotted Stylized SVG World Map */}
          <div className="relative w-full h-80 my-2 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] overflow-hidden flex items-center justify-center p-4">
            <svg
              viewBox="0 0 900 450"
              className="w-full h-full opacity-80"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <pattern
                  id="map-hatch"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#D0CEBE" strokeWidth="2" />
                </pattern>
                <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#D0CEBE" opacity="0.6" />
                </pattern>
              </defs>

              {/* Background dot mesh */}
              <rect width="900" height="450" fill="url(#dot-grid)" />

              {/* Simplified world continent outlines (Eurasia & Africa focus) */}
              {/* Europe/Asia landmass */}
              <path
                d="M 400 120 Q 480 90 560 110 T 680 100 T 780 130 T 820 220 Q 750 250 700 240 T 600 280 T 520 240 T 450 210 Z"
                fill="url(#map-hatch)"
                stroke="#D0CEBE"
                strokeWidth="1.5"
              />
              {/* Africa */}
              <path
                d="M 420 220 Q 470 240 480 300 T 460 380 T 420 400 T 380 320 T 400 250 Z"
                fill="#EAE8DD"
                stroke="#D0CEBE"
                strokeWidth="1"
              />
              {/* Americas outline indicator */}
              <path
                d="M 120 100 Q 180 120 190 200 T 160 350 T 220 420"
                fill="none"
                stroke="#D0CEBE"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Trade shipping sea route from Haiphong (Vietnam) to Bandar Abbas (Iran) */}
              <path
                d="M 680 250 Q 620 270 560 220 T 504 202"
                fill="none"
                stroke="#111111"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />

              {/* Destination Port: Bandar Abbas */}
              <circle cx="504" cy="202" r="6" fill="#111111" stroke="#F3F94A" strokeWidth="2" />
              <text x="495" y="190" fontSize="12" fontWeight="bold" fill="#111111">
                بندر عباس (مقصد)
              </text>

              {/* Vietnam highlighted glowing yellow node */}
              <circle cx="680" cy="250" r="10" fill="#F3F94A" stroke="#111111" strokeWidth="2.5" />
              <circle cx="680" cy="250" r="16" fill="none" stroke="#F3F94A" strokeWidth="1.5" className="animate-ping opacity-30" />
              <text x="695" y="255" fontSize="13" fontWeight="900" fill="#111111">
                ویتنام (−۸٫۷٪)
              </text>

              {/* China current origin */}
              <circle cx="700" cy="190" r="7" fill="#111111" stroke="#D0CEBE" strokeWidth="2" />
              <text x="715" y="195" fontSize="11" fontWeight="bold" fill="#73726E">
                چین (تأمین فعلی)
              </text>

              {/* Turkey alternative */}
              <circle cx="480" cy="175" r="7" fill="#D0CEBE" stroke="#111111" strokeWidth="1.5" />
              <text x="430" y="170" fontSize="11" fontWeight="bold" fill="#111111">
                ترکیه (−۵٫۲٪)
              </text>

              {/* India alternative */}
              <circle cx="600" cy="230" r="7" fill="#D0CEBE" stroke="#111111" strokeWidth="1.5" />
              <text x="615" y="235" fontSize="11" fontWeight="bold" fill="#111111">
                هند (−۴٫۱٪)
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-[#73726E] pt-2">
            <span>مسیر سبز دریایی: خط کشتیرانی مستقیم هایفونگ-بندر عباس (۲۴ تا ۲۸ روز)</span>
            <span className="font-semibold text-[#111111]">صرفه‌جویی خالص: ۱۸۴٬۰۰۰ دلار در سال</span>
          </div>
        </div>

        {/* Yellow Hero Alternative Market Card (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#F3F94A] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider bg-black text-[#F3F94A] px-3 py-1 rounded-full">
                فرصت طلایی سورسینگ
              </span>
              <span className="text-xs font-bold text-[#111111]">گرید ریسک A</span>
            </div>

            <div className="my-4">
              <span className="text-xs font-bold text-[#111111] block mb-1">
                بهترین بازار جایگزین:
              </span>
              <div className="text-4xl font-black text-[#111111] tracking-tight">
                ویتنام −۸٫۷٪
              </div>
              <p className="text-xs text-[#111111]/80 mt-2 font-medium leading-relaxed">
                تولیدکنندگان نورد ویتنام به دلیل دسترسی به سنگ‌آهن محلی و کوره‌های مدرن، بهای تمام‌شده پایین‌تری نسبت به کارخانجات مرکزی چین ارائه می‌دهند.
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#111111] border-t border-black/10 pt-3">
              <div className="flex justify-between">
                <span>میانگین قیمت صادراتی FOB:</span>
                <strong>۶۸۵ دلار / تن</strong>
              </div>
              <div className="flex justify-between">
                <span>تعداد کارخانجات معتبر ثبت‌شده:</span>
                <strong>۱۸ کارخانه ممیزی‌شده</strong>
              </div>
              <div className="flex justify-between">
                <span>تعرفه و محدودیت واردات:</span>
                <strong>بدون محدودیت تجاری</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onNavigate('suppliers');
              onShowToast('تأمین‌کنندگان ویتنام در دایرکتوری فیلتر شدند', '', 'info');
            }}
            className="w-full mt-4 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold transition-all text-center"
          >
            مشاهده تأمین‌کنندگان ویتنام
          </button>
        </div>
      </section>

      {/* Alternative Countries Table */}
      <section className="bg-[#FFFFFF] rounded-3xl border border-[#E5E3DC] overflow-hidden">
        <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-[#111111]">جدول مقایسه کشورهای صادرکننده ورق فولادی</h4>
            <p className="text-xs text-[#73726E] mt-0.5">حجم صادرات، روند قیمت ۲۴ ماهه، کرایه حمل و تراز صرفه‌جویی</p>
          </div>
          <span className="text-xs font-bold bg-[#F5F4EE] px-3 py-1.5 rounded-full border border-[#E5E3DC]">
            مرجع: آمار گمرک جهانی و شاخص پلاتس
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F4EE] border-b border-[#E5E3DC] text-[11px] font-bold text-[#73726E]">
                <th className="py-3 px-5">کشور صادرکننده</th>
                <th className="py-3 px-4">حجم صادرات سالانه</th>
                <th className="py-3 px-4">میانگین قیمت FOB</th>
                <th className="py-3 px-4">روند قیمت ۲۴ ماهه</th>
                <th className="py-3 px-4">کرایه کانتینری تا بندرعباس</th>
                <th className="py-3 px-4">شرایط تجاری و بانکی</th>
                <th className="py-3 px-4">سطح ریسک</th>
                <th className="py-3 px-4">صرفه‌جویی نسبت به چین</th>
                <th className="py-3 px-5 text-center">اقدام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {markets.map((m) => {
                const isSelected = m.country === selectedCountry;
                const isVN = m.country === 'Vietnam';
                return (
                  <tr
                    key={m.countryCode}
                    onClick={() => setSelectedCountry(m.country)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FDFDE8]' : 'hover:bg-[#F5F4EE]/50'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-bold text-[#111111]">
                      <div className="flex items-center gap-2">
                        <span>{m.countryFa}</span>
                        {isVN && <StatusPill label="بهترین جایگزین" variant="ai" showDot={false} />}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#111111]">
                      {formatPersianNumber(m.exportVolumeMT)} تن
                    </td>
                    <td className="py-3.5 px-4 font-black">
                      {toPersianDigits(m.avgExportPriceUSD)} $
                    </td>
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <Sparkline
                        data={m.priceTrend24m}
                        color={isVN ? '#111111' : '#73726E'}
                        width={110}
                        height={28}
                      />
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {toPersianDigits(m.freightToDestinationUSD)} $ / تن
                    </td>
                    <td className="py-3.5 px-4 text-[#73726E] max-w-xs truncate">
                      {m.tradeRestrictions}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusPill
                        label={`ریسک ${m.riskLevel}`}
                        variant={m.riskLevel === 'کم' ? 'green' : m.riskLevel === 'متوسط' ? 'orange' : 'alert'}
                      />
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm">
                      <span
                        className={
                          m.savingsPercentVsCurrent < 0
                            ? 'text-[#2D7D32]'
                            : m.savingsPercentVsCurrent === 0
                            ? 'text-[#73726E]'
                            : 'text-[#C53030]'
                        }
                      >
                        {formatPersianPercent(m.savingsPercentVsCurrent, true)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('suppliers');
                        }}
                        className="px-3 py-1 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold"
                      >
                        تأمین‌کنندگان ({toPersianDigits(m.topSuppliersCount)})
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* UN Comtrade & International Trade Flows Intelligence */}
      <section className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3DC]">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#111111]" />
            <div>
              <h4 className="text-base font-bold text-[#111111]">
                پایگاه جریان‌های تجارت بین‌المللی (UN Comtrade & Customs Intelligence)
              </h4>
              <p className="text-xs text-[#73726E] mt-0.5">
                داده‌های گمرکی رسمی مبادلات جهانی کالا طبق طبقه‌بندی سیستم هماهنگ‌شده (HS Code)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-[#F5F4EE] px-3 py-1.5 rounded-full border border-[#E5E3DC]">
            داده‌های رسمی سازمان ملل (UN Comtrade ۲۰۲۴-۲۰۲۶)
          </span>
        </div>

        {/* Bilateral Trade Flows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-1">
            <span className="text-xs text-[#73726E] font-medium">حجم کل تجارت جهانی کد تعرفه ۷۲۱۰٫۴۹:</span>
            <div className="text-2xl font-black text-[#111111]">۳۴٫۸ میلیارد دلار</div>
            <span className="text-[11px] text-[#2D7D32] font-semibold">رشد سالانه +۴٫۲٪ در مبادلات آسیایی</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-1">
            <span className="text-xs text-[#73726E] font-medium">سهم بنادر مقصد خاورمیانه و ایران:</span>
            <div className="text-2xl font-black text-[#111111]">۲٫۱ میلیون تن</div>
            <span className="text-[11px] text-[#73726E]">تخلیه عمده در بنادر شهید رجایی و جبل علی</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDFDE8] border border-[#F3F94A] space-y-1">
            <span className="text-xs text-[#111111] font-bold">بیشترین جهش سهم بازار صادراتی:</span>
            <div className="text-2xl font-black text-[#111111]">ویتنام (+۳۱٪)</div>
            <span className="text-[11px] text-[#111111]/80 font-medium">سریع‌ترین رشد ظرفیت نورد در جنوب شرق آسیا</span>
          </div>
        </div>

        {/* Detailed Bilateral Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F4EE] border-b border-[#E5E3DC] text-[11px] font-bold text-[#73726E]">
                <th className="py-2.5 px-4">کشور صادرکننده</th>
                <th className="py-2.5 px-4">کد تعرفه HS</th>
                <th className="py-2.5 px-4">ارزش صادرات سالانه به منطقه</th>
                <th className="py-2.5 px-4">حقوق ورودی گمرکی مقصد</th>
                <th className="py-2.5 px-4">زمان حمل دریایی/زمینی</th>
                <th className="py-2.5 px-4">معاهدات تجاری و اسناد مبدأ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              <tr className="hover:bg-[#F5F4EE]/50">
                <td className="py-3 px-4 font-bold text-[#111111]">ویتنام (Vietnam)</td>
                <td className="py-3 px-4 font-mono">7210.49.00</td>
                <td className="py-3 px-4 font-black">۴۸۰ میلیون دلار</td>
                <td className="py-3 px-4">۵٪ (بدون عوارض ضد دامپینگ)</td>
                <td className="py-3 px-4 text-[#2D7D32] font-semibold">۲۶ تا ۲۸ روز دریایی مستقیم</td>
                <td className="py-3 px-4">گواهی مبدأ Form A رسمی اتاق بازرگانی</td>
              </tr>
              <tr className="hover:bg-[#F5F4EE]/50">
                <td className="py-3 px-4 font-bold text-[#111111]">ترکیه (Turkey)</td>
                <td className="py-3 px-4 font-mono">7210.49.00</td>
                <td className="py-3 px-4 font-black">۳۴۰ میلیون دلار</td>
                <td className="py-3 px-4">۴٪ (تخفیف موافقت‌نامه تجارت ترجیحی PTA)</td>
                <td className="py-3 px-4 text-[#2D7D32] font-semibold">۶ تا ۱۸ روز ترانزیت جاده‌ای/ریلی</td>
                <td className="py-3 px-4">گواهی بازرسی مشترک و ترخیص مرز رازی/بازرگان</td>
              </tr>
              <tr className="hover:bg-[#F5F4EE]/50">
                <td className="py-3 px-4 font-bold text-[#111111]">چین (China)</td>
                <td className="py-3 px-4 font-mono">7210.49.00</td>
                <td className="py-3 px-4 font-black">۱٬۲۴۰ میلیون دلار</td>
                <td className="py-3 px-4">۵٪ عوارض گمرکی</td>
                <td className="py-3 px-4">۳۲ تا ۳۸ روز کانتینری</td>
                <td className="py-3 px-4">اسناد رسمی CCPIT و تراز تجاری یوان/ریال</td>
              </tr>
              <tr className="hover:bg-[#F5F4EE]/50">
                <td className="py-3 px-4 font-bold text-[#111111]">هند (India)</td>
                <td className="py-3 px-4 font-mono">7210.49.00</td>
                <td className="py-3 px-4 font-black">۲۹۰ میلیون دلار</td>
                <td className="py-3 px-4">۵٪ عوارض ورودی</td>
                <td className="py-3 px-4 text-[#2D7D32] font-semibold">۱۴ تا ۲۰ روز دریایی ناوا شیوا</td>
                <td className="py-3 px-4">کانال تسویه حساب بانکی Vostro با روپیه</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Risk Matrix & AI Recommendation Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Risk Matrix (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-[#111111]">
              ماتریس ریسک چهارگانه کشور منتخب ({activeMarket.countryFa})
            </h4>
            <span className="text-xs font-semibold text-[#73726E]">
              شاخص ریسک ترکیبی: {toPersianDigits(activeMarket.politicalRisk + activeMarket.fxRisk)}٪
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>ریسک سیاسی و تحریمی:</span>
                <span className="text-[#2D7D32]">{toPersianDigits(activeMarket.politicalRisk)}٪</span>
              </div>
              <HatchedProgressBar
                value={activeMarket.politicalRisk}
                isActive={activeMarket.politicalRisk <= 20}
                activeColor="black"
                height="h-2"
              />
              <p className="text-[10px] text-[#73726E]">ثبات روابط دیپلماتیک و عضویت در معاهدات بین‌المللی</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>ریسک نوسان ارزی (FX):</span>
                <span>{toPersianDigits(activeMarket.fxRisk)}٪</span>
              </div>
              <HatchedProgressBar
                value={activeMarket.fxRisk}
                isActive={false}
                height="h-2"
              />
              <p className="text-[10px] text-[#73726E]">پایداری نرخ برابری دانگ/لیر/روپیه در برابر دلار</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>ریسک لجستیک و بنادر:</span>
                <span>{toPersianDigits(activeMarket.logisticsRisk)}٪</span>
              </div>
              <HatchedProgressBar
                value={activeMarket.logisticsRisk}
                isActive={activeMarket.logisticsRisk <= 25}
                activeColor="black"
                height="h-2"
              />
              <p className="text-[10px] text-[#73726E]">ازدحام بارگیری کانتینری و زمان انتظار در لنگرگاه</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>ریسک تشریفات گمرکی:</span>
                <span>{toPersianDigits(activeMarket.customsRisk)}٪</span>
              </div>
              <HatchedProgressBar
                value={activeMarket.customsRisk}
                isActive={activeMarket.customsRisk <= 20}
                activeColor="black"
                height="h-2"
              />
              <p className="text-[10px] text-[#73726E]">سهولت صدور گواهی مبدأ Form A و ترخیص آزمایشی</p>
            </div>
          </div>
        </div>

        {/* AI Recommendation Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#111111]" />
              <h4 className="text-sm font-bold text-[#111111]">توصیه استراتژیک الگوریتم تنوع‌بخشی مبادی</h4>
            </div>
            <p className="text-xs text-[#73726E] leading-relaxed mb-4">
              وابستگی ۶۲ درصدی سبد واردات شرکت اطلس به یک کشور واحد (چین) ریسک عملیاتی بالایی در فصول افزایش کرایه کانتینری ایجاد می‌کند. انتقال ۳۰ درصد از سهم خرید به ویتنام و ترکیه بهای تمام‌شده را به طور میانگین ۶٫۸ درصد کاهش می‌دهد و دوره خواب سرمایه را ۸ روز کوتاه‌تر می‌کند.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FDFDE8] border border-[#F3F94A] text-xs space-y-1">
              <strong className="text-[#111111] block">اقدام پیشنهادی اولویت اول:</strong>
              <p className="text-[#73726E]">
                صدور یک محموله آزمایشی ۵۰ تنی با کارخانه Hanoi Steel Works با شرط اینکوترمز CIF بندرعباس.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onNavigate('rfq');
              onShowToast('پیش‌نویس استعلام آزمایشی آماده شد', '', 'info');
            }}
            className="w-full mt-4 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold transition-all"
          >
            ایجاد استعلام آزمایشی برای این بازار
          </button>
        </div>
      </section>
    </div>
  );
};
