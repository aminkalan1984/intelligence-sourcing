import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
  Send,
  AlertCircle,
  FileText,
  Clock,
  Printer,
} from 'lucide-react';
import { Supplier } from '../../types';
import { toPersianDigits, formatPersianCurrency } from '../../utils/formatters';

interface InspectionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
  onConfirmOrder: (agency: string, type: string) => void;
}

const AGENCIES = [
  { id: 'sgs', name: 'SGS International (سوئیس)', accredited: 'معتبر در گمرک ایران', feeUSD: 650, speed: '۴ روز کاری' },
  { id: 'bv', name: 'Bureau Veritas (فرانسه)', accredited: 'تأییدیه بانک مرکزی', feeUSD: 700, speed: '۵ روز کاری' },
  { id: 'tuv', name: 'TÜV Rheinland (آلمان)', accredited: 'استاندارد DIN/CE', feeUSD: 750, speed: '۵ روز کاری' },
  { id: 'iei', name: 'شرکت بازرسی مهندسی ایران (IEI)', accredited: 'سازمان ملی استاندارد', feeUSD: 520, speed: '۳ روز کاری' },
];

export const InspectionOrderModal: React.FC<InspectionOrderModalProps> = ({
  isOpen,
  onClose,
  supplier,
  onConfirmOrder,
}) => {
  const [selectedAgency, setSelectedAgency] = useState('sgs');
  const [inspectionType, setInspectionType] = useState('pre_shipment');
  const [scheduledDate, setScheduledDate] = useState('۱۴۰۳/۰۸/۲۲');
  const [selectedTests, setSelectedTests] = useState<string[]>([
    'تست چسبندگی و ضخامت پوشش روی Z275 با میکرومتر مغناطیسی',
    'آزمون کشش متالورژی (Tensile Test) و تنش تسلیم',
    'بررسی صافی سطح و عدم وجود موج کلاف',
    'بازرسی بسته‌بندی ضدزنگ دریایی و پالت‌های چوبی',
  ]);

  if (!isOpen) return null;

  const agency = AGENCIES.find((a) => a.id === selectedAgency) || AGENCIES[0];

  const testOptions = [
    'تست چسبندگی و ضخامت پوشش روی Z275 با میکرومتر مغناطیسی',
    'آزمون کشش متالورژی (Tensile Test) و تنش تسلیم',
    'بررسی صافی سطح و عدم وجود موج کلاف',
    'بازرسی بسته‌بندی ضدزنگ دریایی و پالت‌های چوبی',
    'نمونه‌برداری تصادفی بر اساس استاندارد ISO 2859-1 (AQL)',
    'آزمون مقاومت در برابر مه‌نمکی (Salt Spray Test)',
  ];

  const toggleTest = (test: string) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmOrder(agency.name, inspectionType);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-3xl border border-[#E5E3DC] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between bg-[#F5F4EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#F3F94A] flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111111]">
                سفارش رسمی بازرسی فیزیکی شخص ثالث (Pre-shipment Inspection)
              </h3>
              <p className="text-xs text-[#73726E]">
                کارخانه هدف: {supplier.name} ({supplier.country}، شهر {supplier.city})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E3DC] flex items-center justify-center text-[#73726E] hover:text-[#111111]"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Agency Picker */}
          <div>
            <label className="font-bold text-[#111111] block mb-2">
              ۱. انتخاب شرکت بازرسی بین‌المللی معتمد (Accredited Inspection Agency):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AGENCIES.map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => setSelectedAgency(ag.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedAgency === ag.id
                      ? 'bg-[#111111] text-white border-black'
                      : 'bg-[#F5F4EE] text-[#111111] border-[#E5E3DC] hover:border-black'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold">{ag.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedAgency === ag.id ? 'bg-[#F3F94A] text-black font-bold' : 'bg-white text-[#73726E]'}`}>
                      {toPersianDigits(ag.speed)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] opacity-80 pt-1">
                    <span>{ag.accredited}</span>
                    <span className="font-bold">{toPersianDigits(ag.feeUSD)} $</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Scope & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#111111]">نوع بازرسی و ممیزی</label>
              <select
                value={inspectionType}
                onChange={(e) => setInspectionType(e.target.value)}
                className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] font-medium"
              >
                <option value="pre_shipment">بازرسی پیش از بارگیری کالا (PSI)</option>
                <option value="factory_audit">ممیزی کامل کارخانه و خطوط نورد (Factory Audit)</option>
                <option value="loading_supervision">نظارت بر بارگیری کانتینر در اسکله (CLS)</option>
                <option value="lab_test">آزمون متالورژی آزمایشگاهی نمونه کالا</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#111111]">تاریخ پیشنهادی حضور بازرس در کارخانه</label>
              <input
                type="text"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] font-medium"
              />
            </div>
          </div>

          {/* Tests Checklist */}
          <div>
            <label className="font-bold text-[#111111] block mb-2">
              سرفصل‌های الزامی در چک‌لیست بازرس میدانی ({toPersianDigits(selectedTests.length)} آزمون انتخاب شده):
            </label>
            <div className="space-y-2">
              {testOptions.map((test) => {
                const checked = selectedTests.includes(test);
                return (
                  <label
                    key={test}
                    onClick={() => toggleTest(test)}
                    className="p-3 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer hover:border-black transition-all"
                  >
                    <span className="text-xs font-semibold text-[#111111]">{test}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        checked ? 'bg-[#111111] border-black text-[#F3F94A]' : 'bg-white border-[#E5E3DC]'
                      }`}
                    >
                      {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Certificate Output Notice */}
          <div className="p-4 rounded-2xl bg-[#FDFDE8] border border-[#F3F94A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#111111]" />
              <div>
                <span className="font-bold text-[#111111] block">صدور گواهی بازرسی رسمی (COI):</span>
                <span className="text-[11px] text-[#73726E]">
                  گواهی نهایی جهت ارائه به بانک عامل برای پرداخت اسنادی (LC) صادر خواهد شد.
                </span>
              </div>
            </div>
            <span className="font-black text-sm text-[#111111]">
              هزینه کل: {toPersianDigits(agency.feeUSD)} $
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E3DC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#E5E3DC] text-[#73726E] hover:bg-white"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#111111] text-white hover:bg-black font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#F3F94A] -scale-x-100" />
              <span>ثبت سفارش و اعزام بازرس</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
