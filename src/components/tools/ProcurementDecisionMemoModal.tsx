import React from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { toPersianDigits, formatPersianCurrency, formatPersianNumber } from '../../utils/formatters';

interface ProcurementDecisionMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const ProcurementDecisionMemoModal: React.FC<ProcurementDecisionMemoModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFFFFF] w-full max-w-3xl rounded-3xl border border-[#E5E3DC] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-[#E5E3DC] flex items-center justify-between bg-[#F5F4EE]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#111111]" />
            <h3 className="font-bold text-sm text-[#111111]">
              صورت‌جلسه رسمی کمیسیون معاملات خارجی و توجیه انتخاب تأمین‌کننده
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-full bg-white border border-[#E5E3DC] text-xs font-bold text-[#111111] flex items-center gap-1 hover:bg-[#E5E3DC]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپ سند</span>
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-1.5 rounded-full bg-[#111111] text-white text-xs font-bold flex items-center gap-1 hover:bg-black"
            >
              <Download className="w-3.5 h-3.5 text-[#F3F94A]" />
              <span>دانلود PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-[#E5E3DC] flex items-center justify-center text-[#73726E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-[#111111] bg-white print:p-0">
          {/* Company Official Letterhead */}
          <div className="border-b-2 border-black pb-4 flex justify-between items-start">
            <div>
              <div className="text-base font-black tracking-tight">
                شرکت بازرگانی بین‌المللی اطلس واردات (سهامی خاص)
              </div>
              <div className="text-[11px] text-[#73726E] mt-0.5">
                شناسه ملی: ۱۰۱۰۳۴۸۵۹۲۰ | شماره ثبت: ۴۸۳۹۲ | واحد بازرگانی خارجی و سورسینگ
              </div>
            </div>
            <div className="text-left text-[11px] space-y-0.5">
              <div>شماره پرونده: <strong>MEMO-2024-0142</strong></div>
              <div>تاریخ جلسه: <strong>۱۴۰۳/۰۸/۰۸</strong></div>
              <div>پیوست: جدول ماتریس Landed Cost</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-2">
            <h2 className="text-base font-black">
              گزارش توجیهی خرید و انتخاب تأمین‌کننده منتخب محموله ۱۰۰ تن ورق گالوانیزه Z275
            </h2>
            <p className="text-xs text-[#73726E] mt-1">
              موضوع استعلام بین‌المللی کد RFQ-0142 | کد تعرفه گمرکی: ۷۲۱۰٫۴۹
            </p>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm border-r-4 border-black pr-2">
              ۱. خلاصه اجرایی و شرح استعلام
            </h4>
            <p className="text-xs text-[#73726E] leading-relaxed">
              پیرو برنامه تأمین مواد اولیه خطوط تولید و بررسی ۸ تأمین‌کننده معتبر در کشورهای ویتنام، ترکیه، چین و هند، استعلام رسمی صادر و پس از دریافت و استانداردسازی مظنه‌ها به شرایط یکسان CIF بندر شهید رجایی، ارزیابی چندمعیاره فنی، حقوقی و لجستیکی انجام گردید.
            </p>
          </div>

          {/* Section 2: Summary Matrix Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm border-r-4 border-black pr-2">
              ۲. جدول مقایسه نهایی و بهای تمام‌شده (Landed Cost)
            </h4>
            <div className="border border-[#E5E3DC] rounded-2xl overflow-hidden">
              <table className="w-full text-right border-collapse text-xs">
                <thead className="bg-[#F5F4EE] border-b border-[#E5E3DC] text-[11px] font-bold">
                  <tr>
                    <th className="p-2.5">نام شرکت / کشور</th>
                    <th className="p-2.5">قیمت FOB</th>
                    <th className="p-2.5">هزینه نهایی هر تن در مقصد</th>
                    <th className="p-2.5">زمان تحویل</th>
                    <th className="p-2.5">امتیاز اعتماد</th>
                    <th className="p-2.5">وضعیت تصمیم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3DC]">
                  <tr className="bg-[#FDFDE8] font-bold">
                    <td className="p-2.5">Hanoi Steel Works (ویتنام)</td>
                    <td className="p-2.5">۶۸۵ $</td>
                    <td className="p-2.5 text-black font-black">۷۸۷٫۴ $</td>
                    <td className="p-2.5">۲۸ روز</td>
                    <td className="p-2.5">۸۸٪</td>
                    <td className="p-2.5 text-[#2D7D32]">منتخب اول (توصیه کمیسیون)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Shandong Coil Co. (چین)</td>
                    <td className="p-2.5">۶۶۰ $</td>
                    <td className="p-2.5">۷۷۷٫۰ $</td>
                    <td className="p-2.5">۳۵ روز</td>
                    <td className="p-2.5">۷۹٪</td>
                    <td className="p-2.5 text-[#73726E]">جایگزین دوم</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Anatolia Metal (ترکیه)</td>
                    <td className="p-2.5">۷۱۰ $</td>
                    <td className="p-2.5">۸۰۴٫۸ $</td>
                    <td className="p-2.5">۱۸ روز</td>
                    <td className="p-2.5">۸۴٪</td>
                    <td className="p-2.5 text-[#73726E]">تحویل سریع اضطراری</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Apex Global Sourcing (واسطه)</td>
                    <td className="p-2.5">۶۱۰ $</td>
                    <td className="p-2.5">۷۴۴٫۶ $</td>
                    <td className="p-2.5">۴۵ روز</td>
                    <td className="p-2.5 text-[#C53030]">۴۲٪</td>
                    <td className="p-2.5 text-[#C53030]">مردود (عدم انطباق هویت)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Justification */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm border-r-4 border-black pr-2">
              ۳. دلایل فنی و اقتصادی انتخاب شرکت Hanoi Steel Works
            </h4>
            <div className="p-4 rounded-2xl bg-[#F5F4EE] space-y-1.5 text-xs text-[#73726E] leading-relaxed">
              <p>• <strong>صرفه‌جویی اقتصادی:</strong> تحقق صرفه‌جویی ۸٫۷ درصدی در بودجه خرید سالانه به مبلغ تقریبی ۱۸۴٬۰۰۰ دلار نسبت به میانگین قراردادهای گذشته با مبدأ چین.</p>
              <p>• <strong>اصالت تولیدکننده:</strong> کارخانه هانوی دارای پروانه بهره‌برداری با ظرفیت اسمی ۵۴۰ هزار تن و خطوط نورد مداوم تحت لیسانس دانیلی ایتالیا بوده و آزمون نمونه محصول در آزمایشگاه معتمد متالورژی با نمره ۹۶٫۴٪ مورد تأیید قرار گرفته است.</p>
              <p>• <strong>تسهیلات بانکی و تسویه:</strong> موافقت با پرداخت به شیوه اعتبار اسنادی (LC دیداری/مدت‌دار) بدون نیاز به پیش‌پرداخت ارزی نقدی، که ریسک مالی شرکت را به صفر می‌رساند.</p>
            </div>
          </div>

          {/* Signatures Box */}
          <div className="pt-6 border-t border-[#E5E3DC] grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-bold">سارا احمدی</div>
              <div className="text-[11px] text-[#73726E]">مدیر خرید و بازرگانی خارجی</div>
              <div className="mt-8 text-[11px] text-[#2D7D32] font-mono">امضا دیجیتال: Verified ✓</div>
            </div>
            <div>
              <div className="font-bold">کامران علوی</div>
              <div className="text-[11px] text-[#73726E]">مدیر امور لجستیک و گمرک</div>
              <div className="mt-8 text-[11px] text-[#2D7D32] font-mono">امضا دیجیتال: Verified ✓</div>
            </div>
            <div>
              <div className="font-bold">هیئت مدیره / مدیرعامل</div>
              <div className="text-[11px] text-[#73726E]">تصویب و ابلاغ نهایی خرید</div>
              <div className="mt-8 text-[11px] text-[#73726E]">محل مهر و امضا</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
