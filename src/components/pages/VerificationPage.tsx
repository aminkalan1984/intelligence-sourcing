import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Factory,
  Ship,
  Award,
  FileCheck,
  Landmark,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Eye,
  Send,
  Star,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Supplier, PageId } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { HatchedProgressBar } from '../common/HatchedBar';
import { toPersianDigits, formatPersianNumber } from '../../utils/formatters';
import { InspectionOrderModal } from '../tools/InspectionOrderModal';
import { FakeSupplierDetectorModal } from '../tools/FakeSupplierDetectorModal';

interface VerificationPageProps {
  supplier: Supplier;
  allSuppliers: Supplier[];
  onSelectSupplier: (supplier: Supplier) => void;
  onNavigate: (page: PageId, targetId?: string) => void;
  onRequestSample: (supplier: Supplier) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  supplier,
  allSuppliers,
  onSelectSupplier,
  onNavigate,
  onRequestSample,
  onShowToast,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isFakeDetectorOpen, setIsFakeDetectorOpen] = useState(false);

  // 8 default verification layers if not explicitly present
  const layers = supplier.verificationLayers || [
    { id: '1', title: 'هویت حقوقی', status: 'تأیید شده' as const, score: 95, description: 'ثبت رسمی در اداره ثبت شرکت‌های کشور مبدأ و استعلام اتاق بازرگانی', iconName: 'ShieldCheck' },
    { id: '2', title: 'توان عملیاتی', status: 'تأیید شده' as const, score: 88, description: 'ظرفیت تولید واقعی کارخانه و تطابق خطوط فعال با پروانه', iconName: 'Factory' },
    { id: '3', title: 'توان صادراتی', status: 'تأیید شده' as const, score: 82, description: 'سابقه مداوم صادرات کانتینری و بررسی بارنامه‌های ترخیص شده', iconName: 'Ship' },
    { id: '4', title: 'کیفیت و استاندارد', status: 'تأیید شده' as const, score: 90, description: 'آزمون متالورژی آزمایشگاهی و انطباق با استانداردهای ASTM و DIN', iconName: 'Award' },
    { id: '5', title: 'اعتبار تجاری', status: 'تأیید شده' as const, score: 85, description: 'عدم وجود دعاوی حقوقی در مراجع بین‌المللی داوری و اتاق‌های بازرگانی', iconName: 'FileCheck' },
    { id: '6', title: 'مالکیت حساب بانکی', status: 'تأیید شده' as const, score: 92, description: 'حساب شرکتی تأیید شده در شبکه سوئیفت منطبق با شناسه ثبتی', iconName: 'Landmark' },
    { id: '7', title: 'عملکرد پلتفرم', status: 'تأیید شده' as const, score: 86, description: 'نرخ پاسخ‌دهی بالای ۹۰٪ به استعلام‌ها و پایبندی به برنامه زمان‌بندی', iconName: 'Zap' },
    { id: '8', title: 'اعتبار بیرونی', status: 'تأیید شده' as const, score: 80, description: 'بازرسی حضوری شخص ثالث (SGS / Bureau Veritas) در محل کارخانه', iconName: 'Building' },
  ];

  return (
    <div className="space-y-6">
      {/* Supplier Profile Header Card */}
      <section className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3DC] flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#111111] text-[#F3F94A] flex items-center justify-center font-black text-2xl shrink-0">
            {supplier.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-black text-[#111111]">{supplier.name}</h2>
              <span className="text-sm font-semibold text-[#73726E]">({supplier.faName})</span>
              <StatusPill
                label={supplier.type}
                variant={supplier.type === 'تولیدکننده' ? 'green' : 'neutral'}
                showDot={false}
              />
              {supplier.isBestMatch && <StatusPill label="بهترین تطابق" variant="ai" />}
            </div>
            <div className="flex items-center gap-3 text-xs text-[#73726E] mt-1.5 flex-wrap">
              <span>کشور مبدأ: <strong className="text-[#111111]">{supplier.country}</strong> ({supplier.city})</span>
              <span>•</span>
              <span>سال تأسیس: <strong className="text-[#111111]">{toPersianDigits(supplier.foundedYear)}</strong></span>
              <span>•</span>
              <span>مساحت کارخانه: <strong className="text-[#111111]">{supplier.factoryArea}</strong></span>
              <span>•</span>
              <span>تعداد پرسنل: <strong className="text-[#111111]">{supplier.employeesCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Supplier Selector & CTA */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={supplier.id}
            onChange={(e) => {
              const found = allSuppliers.find((s) => s.id === e.target.value);
              if (found) onSelectSupplier(found);
            }}
            className="py-2.5 px-4 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-xs font-bold text-[#111111] focus:outline-none"
            aria-label="تغییر تأمین‌کننده در حال ارزیابی"
          >
            {allSuppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.country})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsFakeDetectorOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E5E3DC] hover:border-black text-[#111111] font-bold text-xs transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#C05621]" />
            <span>سنجش ضد جعل</span>
          </button>

          <button
            onClick={() => setIsInspectionModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black font-semibold text-xs tracking-tight transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-[#F3F94A]" />
            <span>سفارش بازرسی حضوری (PSI)</span>
          </button>
        </div>
      </section>

      {/* Yellow Hero Trust Score Card with Plain-language explanation */}
      <section className="rounded-3xl bg-[#F3F94A] p-6 border border-[#E5E3DC]">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider bg-black text-[#F3F94A] px-3 py-1 rounded-full">
                گزارش اعتبارسنجی مستقل
              </span>
              <span className="text-xs font-bold text-[#111111]">سطح اعتماد تجاری A+</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#111111] tracking-tight">
                امتیاز اعتماد {toPersianDigits(supplier.trustScore)}
              </span>
              <span className="text-xl font-bold text-[#111111]/70">از ۱۰۰</span>
            </div>

            {/* Plain language explanation */}
            <p className="text-sm text-[#111111] mt-3 font-medium max-w-3xl leading-relaxed">
              ارزیابی جامع: احراز هویت حقوقی کامل، سابقه صادرات متوسط به خاورمیانه، بازرسی خطوط نورد کارخانه انجام‌شده
              توسط بازرس مستقل و نمونه محصول آزمایشی در آزمایشگاه متالورژی با موفقیت تأیید شده است.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-black/10 flex flex-col justify-center min-w-[200px]">
            <span className="text-xs font-semibold text-[#73726E] mb-1">شاخص انطباق استاندارد:</span>
            <span className="text-2xl font-black text-[#111111]">۹۶٫۴٪</span>
            <span className="text-[11px] text-[#2D7D32] font-semibold mt-1">تأییدیه عدم ریسک اعتباری</span>
          </div>
        </div>
      </section>

      {/* 8 Verification Layers Grid */}
      <section className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3DC]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#111111]">۸ لایه اعتبارسنجی تخصصی بازرگانی</h3>
            <p className="text-xs text-[#73726E] mt-0.5">بررسی مرحله‌ای شاخص‌های حقوقی، مالی و صنعتی</p>
          </div>
          <span className="text-xs font-semibold bg-[#F5F4EE] px-3 py-1 rounded-full border border-[#E5E3DC]">
            ۸ از ۸ لایه بازرسی شده
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#111111]">{layer.title}</span>
                  <StatusPill label={layer.status} variant="green" />
                </div>
                <p className="text-[11px] text-[#73726E] leading-relaxed line-clamp-2">
                  {layer.description}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-[#111111] mb-1">
                  <span>امتیاز لایه:</span>
                  <span>{toPersianDigits(layer.score)}٪</span>
                </div>
                <HatchedProgressBar
                  value={layer.score}
                  isActive={layer.score >= 90}
                  activeColor="black"
                  height="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Middle Row: Capacity Monthly Bars + Commercial Terms + Documents List */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Capacity Monthly Bars (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#FFFFFF] p-6 border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#111111] mb-1">ظرفیت واقعی تولید در ماه‌های گذشته</h4>
            <p className="text-xs text-[#73726E] mb-4">میزان بهره‌برداری از توان خطوط نورد (تن در ماه)</p>

            <div className="space-y-3">
              {[
                { month: 'اردیبهشت', tons: 42000, cap: 45000 },
                { month: 'خرداد', tons: 44000, cap: 45000 },
                { month: 'تیر', tons: 39000, cap: 45000 },
                { month: 'مرداد', tons: 45000, cap: 45000 },
                { month: 'شهریور', tons: 43500, cap: 45000 },
                { month: 'مهر (جاری)', tons: 44500, cap: 45000 },
              ].map((m, idx) => {
                const pct = Math.round((m.tons / m.cap) * 100);
                const isCurrent = idx === 5;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={isCurrent ? 'font-bold text-[#111111]' : 'text-[#73726E]'}>
                        {m.month}
                      </span>
                      <span className="font-bold text-[#111111]">
                        {formatPersianNumber(m.tons)} تن ({toPersianDigits(pct)}٪)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#E5E3DC] overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full ${
                          isCurrent ? 'bg-[#111111]' : 'bg-hatched-pattern bg-[#F5F4EE]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E3DC] text-xs text-[#73726E] flex justify-between">
            <span>ظرفیت اسمی سالانه:</span>
            <strong className="text-[#111111]">۵۴۰٬۰۰۰ تن در سال</strong>
          </div>
        </div>

        {/* Commercial Terms & Export Markets (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#FFFFFF] p-6 border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#111111] mb-1">شرایط تجاری و بازارهای صادراتی</h4>
            <p className="text-xs text-[#73726E] mb-4">ترم‌های فروش، شیوه‌های پرداخت و مقاصد ارسال</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#F5F4EE] flex justify-between">
                <span className="text-[#73726E]">اینکوترمز قابل قبول:</span>
                <span className="font-bold text-[#111111]">{supplier.incoterms.join(' ، ')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F4EE] flex justify-between">
                <span className="text-[#73726E]">حداقل سفارش (MOQ):</span>
                <span className="font-bold text-[#111111]">{toPersianDigits(supplier.moq)} تن</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F4EE] flex justify-between">
                <span className="text-[#73726E]">شرایط پرداخت:</span>
                <span className="font-bold text-[#111111]">{supplier.paymentTerms}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F4EE] flex justify-between">
                <span className="text-[#73726E]">زمان آماده‌سازی و بارگیری:</span>
                <span className="font-bold text-[#111111]">{toPersianDigits(supplier.leadTimeDays)} روز کاری</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs font-bold text-[#111111] block mb-2">بازارهای فعال صادراتی:</span>
              <div className="flex flex-wrap gap-1.5">
                {supplier.exportMarkets.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E5E3DC] text-xs font-semibold text-[#111111]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E3DC] flex items-center justify-between text-xs">
            <span className="text-[#73726E]">نمونه محصول:</span>
            <span className="font-bold text-[#2D7D32]">
              {supplier.sampleAvailable ? 'موجود (ارسال هوایی رایگان)' : 'نیازمند استعلام'}
            </span>
          </div>
        </div>

        {/* Documents List with View / Download (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#FFFFFF] p-6 border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-[#111111]">مدارک و اسناد بازرسی بارگذاری‌شده</h4>
              <span className="text-[11px] text-[#73726E]">
                {toPersianDigits(supplier.documents?.length || 4)} سند
              </span>
            </div>
            <p className="text-xs text-[#73726E] mb-4">گواهی‌نامه‌های رسمی و گزارش ممیزی شخص ثالث</p>

            <div className="space-y-2.5">
              {(supplier.documents || []).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between text-xs"
                >
                  <div className="truncate pl-2">
                    <div className="font-bold text-[#111111] truncate">{doc.name}</div>
                    <div className="text-[10px] text-[#73726E] mt-0.5">
                      {doc.category} | {toPersianDigits(doc.date)} | {doc.size}
                    </div>
                  </div>
                  <button
                    onClick={() => onShowToast(`پیش‌نمایش سند «${doc.name}» باز شد`, '', 'info')}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-[#E5E3DC] border border-[#E5E3DC] text-[11px] font-bold text-[#111111] shrink-0 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>مشاهده</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onShowToast('بسته جامع مدارک تأمین‌کننده در قالب فایل فشرده دانلود شد', '', 'success')}
            className="w-full mt-4 py-2.5 rounded-full bg-[#111111] hover:bg-black text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#F3F94A]" />
            <span>دانلود تمام مدارک ممیزی (ZIP)</span>
          </button>
        </div>
      </section>

      {/* Complaints History & Buyer Reviews */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Complaints / Delay History Timeline */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC]">
          <h4 className="text-sm font-bold text-[#111111] mb-1">
            تاریخچه شکایات، مغایرت‌ها و تأخیرات ثبت شده
          </h4>
          <p className="text-xs text-[#73726E] mb-4">گزارش شفاف حوادث زنجیره تأمین و نحوه پاسخگویی کارخانه</p>

          <div className="space-y-3">
            {(supplier.complaintsHistory || []).map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111111]">{c.type}</span>
                  <StatusPill label={c.status} variant="green" />
                </div>
                <div className="text-[11px] text-[#73726E]">
                  تاریخ رخداد: {toPersianDigits(c.date)}
                </div>
                <div className="text-[11px] text-[#111111] pt-1 border-t border-[#E5E3DC]">
                  نتیجه رسیدگی: {c.resolution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buyer Reviews */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC]">
          <h4 className="text-sm font-bold text-[#111111] mb-1">
            نظرات خریداران تجاری و شرکت‌های بازرگانی
          </h4>
          <p className="text-xs text-[#73726E] mb-4">بازخورد واردکنندگان دارای بارنامه ثبت شده با این تأمین‌کننده</p>

          <div className="space-y-3">
            {(supplier.reviews || []).map((rev) => (
              <div key={rev.id} className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-[#111111]">{rev.buyerName}</strong>
                    <span className="text-[#73726E]">({rev.country})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#111111] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#F3F94A] text-black" />
                    <span>{toPersianDigits(rev.rating)}</span>
                  </div>
                </div>
                <p className="text-[#73726E] text-[11px] leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="flex justify-between text-[10px] text-[#73726E] pt-1 border-t border-[#E5E3DC]">
                  <span>حجم خرید ثبت‌شده: {rev.orderVolume}</span>
                  <span>{toPersianDigits(rev.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandatory Human Inspection Warning Banner */}
      <section className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-[#F5DFCB] text-[#C05621] flex items-center justify-center shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-xs text-[#73726E] leading-relaxed">
          <strong className="text-[#111111]">یادآوری خط‌مشی سورسینگ:</strong> هوش مصنوعی و داده‌های پلتفرم به تنهایی تصمیم‌گیرنده نهایی نیستند. در قراردادهای بزرگ تجاری، تصمیم‌گیری‌های حساس مالی نیازمند اخذ نمونه فیزیکی، استعلام اصالت اسناد بانکی و بازرسی حضوری پیش از بارگیری (Pre-shipment Inspection) توسط بازرس شخص ثالث است.
        </p>
      </section>

      {/* Inspection Booking Modal */}
      <InspectionOrderModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        supplier={supplier}
        onConfirmOrder={(agency, type) => {
          onShowToast(
            `سفارش بازرسی رسمی ثبت شد`,
            `درخواست اعزام بازرس ${agency} به کارخانه ${supplier.name} در هایفونگ ارسال گردید. شماره رهگیری: PSI-${Math.floor(1000 + Math.random() * 9000)}`,
            'success'
          );
        }}
      />

      {/* Fake Supplier Detector Modal */}
      <FakeSupplierDetectorModal
        isOpen={isFakeDetectorOpen}
        onClose={() => setIsFakeDetectorOpen(false)}
        suppliers={allSuppliers}
      />
    </div>
  );
};
