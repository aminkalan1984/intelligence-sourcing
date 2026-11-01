import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Search,
  Building,
  Landmark,
  Globe,
  Award,
  Sparkles,
  Info,
} from 'lucide-react';
import { Supplier } from '../../types';
import { evaluateSupplierFraudRisk, AntiFraudChecklist } from '../../utils/tradeAnalytics';
import { toPersianDigits } from '../../utils/formatters';
import { StatusPill } from '../common/StatusPill';

interface FakeSupplierDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  onSelectSupplierToInspect?: (supplier: Supplier) => void;
}

export const FakeSupplierDetectorModal: React.FC<FakeSupplierDetectorModalProps> = ({
  isOpen,
  onClose,
  suppliers,
  onSelectSupplierToInspect,
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('fake-asia-trading');

  // Interactive Checklist states
  const [checklist, setChecklist] = useState<AntiFraudChecklist>({
    domainAgeYears: 0.5,
    hasGovernmentBusinessLicense: false,
    bankAccountMatchesLegalName: false,
    physicalFactorySatelliteVerified: false,
    hasCustomsExportRecords: false,
    noDisputesInArbitration: false,
    sampleDeliveryAccepted: false,
    unrealisticLowPrice: true,
  });

  const activeSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  // Sync checklist when supplier changes
  const handleSelectPreset = (id: string) => {
    setSelectedSupplierId(id);
    if (id === 'fake-asia-trading') {
      setChecklist({
        domainAgeYears: 0.4,
        hasGovernmentBusinessLicense: false,
        bankAccountMatchesLegalName: false,
        physicalFactorySatelliteVerified: false,
        hasCustomsExportRecords: false,
        noDisputesInArbitration: false,
        sampleDeliveryAccepted: false,
        unrealisticLowPrice: true,
      });
    } else if (id === 'hanoi-steel') {
      setChecklist({
        domainAgeYears: 16,
        hasGovernmentBusinessLicense: true,
        bankAccountMatchesLegalName: true,
        physicalFactorySatelliteVerified: true,
        hasCustomsExportRecords: true,
        noDisputesInArbitration: true,
        sampleDeliveryAccepted: true,
        unrealisticLowPrice: false,
      });
    } else {
      setChecklist({
        domainAgeYears: 12,
        hasGovernmentBusinessLicense: true,
        bankAccountMatchesLegalName: true,
        physicalFactorySatelliteVerified: true,
        hasCustomsExportRecords: true,
        noDisputesInArbitration: true,
        sampleDeliveryAccepted: true,
        unrealisticLowPrice: false,
      });
    }
  };

  const evaluation = evaluateSupplierFraudRisk(checklist);

  if (!isOpen) return null;

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
            <div className="w-10 h-10 rounded-2xl bg-[#C53030] text-white flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111111]">
                موتور هوشمند کشف شرکت‌های جعلی و کاغذی (Fake Supplier AI Detector)
              </h3>
              <p className="text-xs text-[#73726E]">
                ممیزی تطبیقی مدارک ثبتی، حساب‌های بانکی تراستی، شواهد ماهواره‌ای و بارنامه‌ها
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Quick preset selector */}
          <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-[#111111]">تست سریع با شرکت‌های موجود در پایگاه:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleSelectPreset('fake-asia-trading')}
                className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all ${
                  selectedSupplierId === 'fake-asia-trading'
                    ? 'bg-[#C53030] text-white'
                    : 'bg-white text-[#73726E] border border-[#E5E3DC]'
                }`}
              >
                Apex Global (واسطه مشکوک)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('hanoi-steel')}
                className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all ${
                  selectedSupplierId === 'hanoi-steel'
                    ? 'bg-[#111111] text-[#F3F94A]'
                    : 'bg-white text-[#73726E] border border-[#E5E3DC]'
                }`}
              >
                Hanoi Steel (کارخانه معتبر)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('anatolia-metal')}
                className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all ${
                  selectedSupplierId === 'anatolia-metal'
                    ? 'bg-[#111111] text-[#F3F94A]'
                    : 'bg-white text-[#73726E] border border-[#E5E3DC]'
                }`}
              >
                Anatolia Metal (تولیدکننده)
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              evaluation.riskScore >= 60
                ? 'bg-[#FDEBE6] border-[#FADCD5]'
                : evaluation.riskScore >= 25
                ? 'bg-[#F5DFCB] border-[#ECD1BA]'
                : 'bg-[#D5E8D4] border-[#C2DEC0]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${
                    evaluation.riskScore >= 60
                      ? 'bg-[#C53030] text-white'
                      : evaluation.riskScore >= 25
                      ? 'bg-[#C05621] text-white'
                      : 'bg-[#2D7D32] text-white'
                  }`}
                >
                  {evaluation.riskCategory}
                </span>
                <span className="text-xs font-bold text-[#111111]">
                  شاخص احتمال جعلی بودن: {toPersianDigits(evaluation.riskScore)} از ۱۰۰
                </span>
              </div>
            </div>

            <p className="text-xs text-[#111111] font-medium leading-relaxed mt-2">
              {evaluation.recommendation}
            </p>
          </div>

          {/* Red flags list if any */}
          {evaluation.flags.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC] space-y-2">
              <h4 className="font-bold text-[#C53030] text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>نشانه‌های ریسک کلاهبرداری یا شرکت کاغذی (Red Flags):</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-[#73726E] pr-2">
                {evaluation.flags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C53030] font-bold">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Checklist Toggles */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#111111] text-xs">
              ۸ شاخص ممیزی میدانی و تطبیقی (تنظیم مستقیم برای راستی‌آزمایی):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="p-3 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer hover:border-[#111111]">
                <div className="truncate pl-1">
                  <span className="font-bold text-[#111111] block">پروانه بهره‌برداری رسمی دولتی</span>
                  <span className="text-[10px] text-[#73726E]">استعلام کد ثبتی در اداره شرکت‌های مبدأ</span>
                </div>
                <input
                  type="checkbox"
                  checked={checklist.hasGovernmentBusinessLicense}
                  onChange={(e) => setChecklist({ ...checklist, hasGovernmentBusinessLicense: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer hover:border-[#111111]">
                <div className="truncate pl-1">
                  <span className="font-bold text-[#111111] block">تطابق نام حساب بانکی رسمی</span>
                  <span className="text-[10px] text-[#73726E]">نام حساب سوئیفت عیناً مطابق با ثبت شرکت</span>
                </div>
                <input
                  type="checkbox"
                  checked={checklist.bankAccountMatchesLegalName}
                  onChange={(e) => setChecklist({ ...checklist, bankAccountMatchesLegalName: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer hover:border-[#111111]">
                <div className="truncate pl-1">
                  <span className="font-bold text-[#111111] block">تأیید ماهواره‌ای کارخانه و کوره</span>
                  <span className="text-[10px] text-[#73726E]">انطباق مساحت سوله و خطوط نورد فیزیکی</span>
                </div>
                <input
                  type="checkbox"
                  checked={checklist.physicalFactorySatelliteVerified}
                  onChange={(e) => setChecklist({ ...checklist, physicalFactorySatelliteVerified: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer hover:border-[#111111]">
                <div className="truncate pl-1">
                  <span className="font-bold text-[#111111] block">سابقه بارنامه گمرکی رسمی</span>
                  <span className="text-[10px] text-[#73726E]">وجود سابقه ترخیص صادراتی در داده‌های بندری</span>
                </div>
                <input
                  type="checkbox"
                  checked={checklist.hasCustomsExportRecords}
                  onChange={(e) => setChecklist({ ...checklist, hasCustomsExportRecords: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer hover:border-[#111111]">
                <div className="truncate pl-1">
                  <span className="font-bold text-[#111111] block">آمادگی ارسال نمونه فیزیکی</span>
                  <span className="text-[10px] text-[#73726E]">پذیرش تست نمونه قبل از پرداخت وجه سفارش</span>
                </div>
                <input
                  type="checkbox"
                  checked={checklist.sampleDeliveryAccepted}
                  onChange={(e) => setChecklist({ ...checklist, sampleDeliveryAccepted: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between cursor-pointer hover:border-[#111111]">
                <div className="truncate pl-1">
                  <span className="font-bold text-[#C53030] block">قیمت غیرمنطقی زیر بهای مواد خام</span>
                  <span className="text-[10px] text-[#73726E]">قیمت بیش از ۲۰٪ کمتر از اسلب بورس فلزات</span>
                </div>
                <input
                  type="checkbox"
                  checked={checklist.unrealisticLowPrice}
                  onChange={(e) => setChecklist({ ...checklist, unrealisticLowPrice: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E3DC] flex items-center justify-between bg-[#F5F4EE]">
          <span className="text-[11px] text-[#73726E]">
            پایش هوشمند متصل به اتاق‌های بازرگانی بین‌المللی و داده‌های سوئیفت
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold"
          >
            بستن پنجره ممیزی
          </button>
        </div>
      </div>
    </div>
  );
};
