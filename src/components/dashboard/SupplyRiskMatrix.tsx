import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Info,
  Maximize2,
  ArrowUpRight,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { StatusPill } from '../common/StatusPill';
import { toPersianDigits, formatPersianNumber, formatPersianCurrency } from '../../utils/formatters';
import { PageId } from '../../types';

export interface SupplyRiskItem {
  id: string;
  title: string;
  category: 'لجستیک' | 'ارزی' | 'تأمین‌کننده' | 'فصلی';
  likelihood: number; // 0 to 100 (احتمال وقوع)
  impact: number; // 0 to 100 (تأثیر بر کسب‌وکار)
  financialExposureUSD: number; // خسارت بالقوه مالی
  bubbleRadius: number; // visual size
  mitigation: string;
  affectedItem: string;
  quadrant: 'بحرانی' | 'پایش ویژه' | 'عملیاتی' | 'کم‌خطر';
}

const DEFAULT_RISKS: SupplyRiskItem[] = [
  {
    id: 'r1',
    title: 'نوسان کرایه کانتینری مسیر شانگهای-بندرعباس (+۱۸٫۷٪)',
    category: 'لجستیک',
    likelihood: 85,
    impact: 78,
    financialExposureUSD: 42000,
    bubbleRadius: 28,
    mitigation: 'انتقال ۳۰٪ از سهم سفارش‌ها به خط کشتیرانی مستقیم هایفونگ ویتنام و هند',
    affectedItem: 'ورق فولادی گالوانیزه ۷۲۱۰٫۴۹',
    quadrant: 'بحرانی',
  },
  {
    id: 'r2',
    title: 'ریسک اصالت شرکت‌های واسطه (شرکت‌های صوری کاغذی)',
    category: 'تأمین‌کننده',
    likelihood: 32,
    impact: 92,
    financialExposureUSD: 85000,
    bubbleRadius: 34,
    mitigation: 'الزام بازرسی میدانی SGS و تطبیق نام حساب بانکی سوئیفت پیش از پیش‌پرداخت',
    affectedItem: 'قراردادهای بازرگانی شرق آسیا',
    quadrant: 'پایش ویژه',
  },
  {
    id: 'r3',
    title: 'تعطیلات سال نوی چینی و کاهش ظرفیت بارگیری بنادر',
    category: 'فصلی',
    likelihood: 94,
    impact: 45,
    financialExposureUSD: 18500,
    bubbleRadius: 20,
    mitigation: 'ثبت سفارش‌های سه‌ماهه اول پیش از دسامبر و ترانزیت زمینی از مرز ترکیه',
    affectedItem: 'تمام اقلام وارداتی از چین',
    quadrant: 'عملیاتی',
  },
  {
    id: 'r4',
    title: 'نوسان کارمزد حواله و تسعیر ارز درهم امارات',
    category: 'ارزی',
    likelihood: 62,
    impact: 40,
    financialExposureUSD: 14000,
    bubbleRadius: 18,
    mitigation: 'تسویه با سازوکار یوآن مستقیم و اعتبارات اسنادی دیداری بانک‌های منطقه‌ای',
    affectedItem: 'تسویه مالی قراردادهای خارجی',
    quadrant: 'عملیاتی',
  },
  {
    id: 'r5',
    title: 'معطلی ترانشیپ لنگرگاه کلمبو ناشی از شرایط فصلی اقیانوس هند',
    category: 'لجستیک',
    likelihood: 42,
    impact: 28,
    financialExposureUSD: 9200,
    bubbleRadius: 15,
    mitigation: 'انتخاب خطوط کشتیرانی با مسیر مستقیم بدون ترانشیپ میانی',
    affectedItem: 'لوله‌های بدون درز کربن‌استیل',
    quadrant: 'کم‌خطر',
  },
];

interface SupplyRiskMatrixProps {
  onNavigate?: (page: PageId, targetId?: string) => void;
  className?: string;
}

export const SupplyRiskMatrix: React.FC<SupplyRiskMatrixProps> = ({
  onNavigate,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [activeHoveredRisk, setActiveHoveredRisk] = useState<SupplyRiskItem | null>(
    DEFAULT_RISKS[0]
  );

  const filteredRisks = DEFAULT_RISKS.filter((r) => {
    if (selectedCategory === 'همه') return true;
    return r.category === selectedCategory;
  });

  // Calculate coordinates in SVG viewBox (620 x 375)
  // X-axis: احتمال وقوع (Likelihood: 0 to 100, mapped to 65px -> 585px)
  // Y-axis: تأثیر بر کسب‌وکار (Impact: 0 to 100, mapped from bottom 305px -> top 45px)
  const mapLikelihoodToX = (val: number) => 65 + (val / 100) * 520;
  const mapImpactToY = (val: number) => 305 - (val / 100) * 255;

  return (
    <div
      className={`p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex flex-col justify-between ${className}`}
    >
      {/* Top Header & Category Filter */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C53030] animate-ping" />
            <h3 className="text-base font-bold text-[#111111]">
              ماتریس ریسک تأمین (Supply Risk Matrix)
            </h3>
            <span className="text-xs bg-[#F5F4EE] px-2.5 py-0.5 rounded-full font-bold text-[#73726E] border border-[#E5E3DC]">
              نمودار حبابی ۲ بعدی
            </span>
          </div>
          <p className="text-xs text-[#73726E] mt-0.5">
            سنجش توأمان «احتمال وقوع» و «تأثیر بر کسب‌وکار» همراه با برآورد مواجهه مالی
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['همه', 'لجستیک', 'تأمین‌کننده', 'ارزی', 'فصلی'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#111111] text-[#F3F94A]'
                  : 'bg-[#F5F4EE] text-[#73726E] hover:text-[#111111]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visual SVG Bubble Chart + Detail Side Inset */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* SVG Interactive Bubble Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[#F5F4EE] rounded-2xl border border-[#E5E3DC] p-3 relative select-none">
          <svg
            viewBox="0 0 620 375"
            className="w-full h-auto overflow-hidden select-none"
            aria-label="نمودار ماتریس ریسک"
          >
            {/* 4 Quadrants Background Zones */}
            {/* Top-Right: Critical Zone (High Likelihood + High Impact) */}
            <rect
              x="320"
              y="40"
              width="270"
              height="125"
              fill="#FDEBE6"
              opacity="0.85"
              rx="12"
            />
            {/* Top-Left: Special Monitoring (Low Likelihood + High Impact) */}
            <rect
              x="65"
              y="40"
              width="250"
              height="125"
              fill="#F5DFCB"
              opacity="0.6"
              rx="12"
            />
            {/* Bottom-Right: Operational Risks (High Likelihood + Low Impact) */}
            <rect
              x="320"
              y="175"
              width="270"
              height="125"
              fill="#EAE8DD"
              opacity="0.6"
              rx="12"
            />
            {/* Bottom-Left: Low Risk Zone (Low Likelihood + Low Impact) */}
            <rect
              x="65"
              y="175"
              width="250"
              height="125"
              fill="#D5E8D4"
              opacity="0.5"
              rx="12"
            />

            {/* Grid Dividing Lines */}
            <line
              x1="320"
              y1="35"
              x2="320"
              y2="305"
              stroke="#D0CEBE"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <line
              x1="60"
              y1="170"
              x2="595"
              y2="170"
              stroke="#D0CEBE"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Quadrant Badge Labels */}
            {/* Critical */}
            <g>
              <rect x="445" y="48" width="135" height="22" rx="11" fill="#C53030" />
              <text x="512" y="63" fontSize="11" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                بحرانی (اقدام فوری)
              </text>
            </g>

            {/* Special Monitoring */}
            <g>
              <rect x="75" y="48" width="120" height="22" rx="11" fill="#FFFFFF" stroke="#C05621" strokeWidth="1" />
              <text x="135" y="63" fontSize="10.5" fontWeight="bold" fill="#C05621" textAnchor="middle">
                پایش ویژه (بیمه‌ای)
              </text>
            </g>

            {/* Operational */}
            <g>
              <rect x="455" y="268" width="125" height="22" rx="11" fill="#FFFFFF" stroke="#8C7355" strokeWidth="1" />
              <text x="517" y="283" fontSize="10.5" fontWeight="bold" fill="#73726E" textAnchor="middle">
                عملیاتی و تکرارشونده
              </text>
            </g>

            {/* Low risk */}
            <g>
              <rect x="75" y="268" width="120" height="22" rx="11" fill="#FFFFFF" stroke="#2D7D32" strokeWidth="1" />
              <text x="135" y="283" fontSize="10.5" fontWeight="bold" fill="#2D7D32" textAnchor="middle">
                ناحیه کم‌خطر و پایدار
              </text>
            </g>

            {/* Axes */}
            {/* Y-axis: تأثیر بر کسب‌وکار (Impact) */}
            <line x1="65" y1="35" x2="65" y2="305" stroke="#111111" strokeWidth="2" />
            <polygon points="65,26 61,36 69,36" fill="#111111" />
            <text
              x="220"
              y="26"
              fontSize="11"
              fontWeight="900"
              fill="#111111"
              textAnchor="end"
            >
              تأثیر بر کسب‌وکار (Impact) ↑
            </text>

            {/* X-axis: احتمال وقوع (Likelihood) */}
            <line x1="65" y1="305" x2="595" y2="305" stroke="#111111" strokeWidth="2" />
            <polygon points="603,305 593,301 593,309" fill="#111111" />

            {/* X-axis Title (centered below axis) */}
            <text
              x="330"
              y="358"
              fontSize="11"
              fontWeight="900"
              fill="#111111"
              textAnchor="middle"
            >
              احتمال وقوع رویداد (Likelihood) →
            </text>

            {/* X-axis Tick Labels */}
            <text x="65" y="325" fontSize="10" fontWeight="bold" fill="#73726E" textAnchor="middle">۰٪</text>
            <text x="195" y="325" fontSize="10" fontWeight="bold" fill="#73726E" textAnchor="middle">۲۵٪</text>
            <text x="320" y="325" fontSize="10" fontWeight="bold" fill="#73726E" textAnchor="middle">۵۰٪</text>
            <text x="450" y="325" fontSize="10" fontWeight="bold" fill="#73726E" textAnchor="middle">۷۵٪</text>
            <text x="585" y="325" fontSize="10" fontWeight="bold" fill="#73726E" textAnchor="middle">۱۰۰٪</text>

            {/* Interactive Risk Bubbles */}
            {filteredRisks.map((risk) => {
              const cx = mapLikelihoodToX(risk.likelihood);
              const cy = mapImpactToY(risk.impact);
              const isSelected = activeHoveredRisk?.id === risk.id;

              // Color based on quadrant
              let fillColor = '#F3F94A';
              let strokeColor = '#111111';
              if (risk.quadrant === 'بحرانی') {
                fillColor = isSelected ? '#C53030' : '#E04848';
                strokeColor = '#111111';
              } else if (risk.quadrant === 'پایش ویژه') {
                fillColor = isSelected ? '#C05621' : '#F5DFCB';
                strokeColor = '#C05621';
              } else if (risk.quadrant === 'کم‌خطر') {
                fillColor = isSelected ? '#2D7D32' : '#D5E8D4';
                strokeColor = '#2D7D32';
              } else {
                fillColor = isSelected ? '#111111' : '#F3F94A';
                strokeColor = '#111111';
              }

              return (
                <g
                  key={risk.id}
                  onClick={() => setActiveHoveredRisk(risk)}
                  onMouseEnter={() => setActiveHoveredRisk(risk)}
                  className="cursor-pointer"
                >
                  {/* Subtle outer static ring for selected or critical bubble */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={risk.bubbleRadius + 6}
                      fill="none"
                      stroke={risk.quadrant === 'بحرانی' ? '#C53030' : '#111111'}
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      opacity="0.8"
                    />
                  )}

                  {/* Main Bubble */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={risk.bubbleRadius}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 3 : 1.5}
                    style={{
                      transformOrigin: `${cx}px ${cy}px`,
                      transition: 'transform 0.2s ease, fill 0.2s ease',
                    }}
                  />

                  {/* Bubble text: Exposure in USD (k) with Persian numerals */}
                  <text
                    x={cx}
                    y={cy + 4}
                    fontSize={risk.bubbleRadius > 22 ? '11' : '9'}
                    fontWeight="900"
                    fill={
                      risk.quadrant === 'بحرانی' || (isSelected && risk.quadrant !== 'عملیاتی')
                        ? '#FFFFFF'
                        : '#111111'
                    }
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {toPersianDigits(Math.round(risk.financialExposureUSD / 1000))}k$
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick legend under the chart */}
          <div className="flex items-center justify-between text-[11px] text-[#73726E] pt-2 border-t border-[#E5E3DC]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C53030]" />
                بحرانی
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5DFCB] border border-[#C05621]" />
                پایش ویژه
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F3F94A] border border-black" />
                عملیاتی
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D5E8D4] border border-[#2D7D32]" />
                کم‌خطر
              </span>
            </div>
            <span>قطر حباب = مواجهه مالی تقریبی ریسک (دلار)</span>
          </div>
        </div>

        {/* Selected Risk Detailed Insight Inset (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
          {activeHoveredRisk ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <StatusPill
                  label={`ناحیه ${activeHoveredRisk.quadrant}`}
                  variant={
                    activeHoveredRisk.quadrant === 'بحرانی'
                      ? 'alert'
                      : activeHoveredRisk.quadrant === 'پایش ویژه'
                      ? 'orange'
                      : activeHoveredRisk.quadrant === 'کم‌خطر'
                      ? 'green'
                      : 'neutral'
                  }
                />
                <span className="text-[11px] text-[#73726E] font-bold">
                  دسته‌بندی: {activeHoveredRisk.category}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-black text-[#111111] leading-snug">
                  {activeHoveredRisk.title}
                </h4>
                <div className="text-[10px] text-[#73726E] mt-0.5">
                  کالای مرتبط: {activeHoveredRisk.affectedItem}
                </div>
              </div>

              {/* Metrics Inset */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#73726E] block">احتمال وقوع:</span>
                  <span className="text-base font-black text-[#111111]">
                    {toPersianDigits(activeHoveredRisk.likelihood)}٪
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#73726E] block">تأثیر بر کسب‌وکار:</span>
                  <span className="text-base font-black text-[#C53030]">
                    {toPersianDigits(activeHoveredRisk.impact)}٪
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFDE8] border border-[#F3F94A] flex justify-between items-center text-xs">
                <span className="text-[#111111] font-medium">مواجهه مالی بالقوه:</span>
                <span className="text-sm font-black text-[#111111]">
                  {formatPersianCurrency(activeHoveredRisk.financialExposureUSD)}
                </span>
              </div>

              {/* Mitigation Strategy */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#111111] block">راهکار کاهش ریسک و اقدام پیشنهادی:</span>
                <p className="text-[11px] text-[#73726E] leading-relaxed p-2.5 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC]">
                  {activeHoveredRisk.mitigation}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-[#73726E]">
              یکی از حباب‌های ماتریس را برای مشاهده سناریو و اقدام پیشنهادی انتخاب کنید.
            </div>
          )}

          <div className="pt-3 border-t border-[#E5E3DC] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#73726E]">مجموع مواجهه مالی: ۱۶۹٬۲۰۰ $</span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('monitoring')}
                className="font-bold text-[#111111] hover:underline flex items-center gap-1"
              >
                <span>پرونده‌های پایش</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
