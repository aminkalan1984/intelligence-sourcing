import React, { useState, useMemo } from 'react';
import {
  X,
  Scale,
  Sparkles,
  Ship,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Check,
  Info,
} from 'lucide-react';
import { Incoterm2020, normalizeQuoteToCIF } from '../../utils/tradeAnalytics';
import { toPersianDigits, formatPersianCurrency, formatPersianNumber } from '../../utils/formatters';

interface IncotermsNormalizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToComparison?: (term: Incoterm2020, normalizedPrice: number) => void;
}

const INCOTERMS_LIST: { term: Incoterm2020; nameFa: string; category: string }[] = [
  { term: 'EXW', nameFa: 'تحویل درب کارخانه (Ex Works)', category: 'هر نوع روش حمل' },
  { term: 'FCA', nameFa: 'تحویل به متصدی حمل (Free Carrier)', category: 'هر نوع روش حمل' },
  { term: 'FAS', nameFa: 'تحویل کنار کشتی (Free Alongside Ship)', category: 'حمل دریایی' },
  { term: 'FOB', nameFa: 'تحویل روی عرشه کشتی (Free On Board)', category: 'حمل دریایی' },
  { term: 'CFR', nameFa: 'هزینه و کرایه حمل (Cost and Freight)', category: 'حمل دریایی' },
  { term: 'CIF', nameFa: 'هزینه، بیمه و کرایه حمل (Cost, Insurance & Freight)', category: 'حمل دریایی' },
  { term: 'CPT', nameFa: 'کرایه حمل پرداخت‌شده تا مقصد (Carriage Paid To)', category: 'هر نوع روش حمل' },
  { term: 'CIP', nameFa: 'کرایه و بیمه پرداخت‌شده تا مقصد (Carriage & Insurance Paid)', category: 'هر نوع روش حمل' },
  { term: 'DAP', nameFa: 'تحویل در محل مقصد (Delivered at Place)', category: 'هر نوع روش حمل' },
  { term: 'DPU', nameFa: 'تحویل در محل تخلیه‌شده (Delivered at Place Unloaded)', category: 'هر نوع روش حمل' },
  { term: 'DDP', nameFa: 'تحویل با پرداخت حقوق گمرکی (Delivered Duty Paid)', category: 'هر نوع روش حمل' },
];

export const IncotermsNormalizerModal: React.FC<IncotermsNormalizerModalProps> = ({
  isOpen,
  onClose,
  onApplyToComparison,
}) => {
  const [selectedTerm, setSelectedTerm] = useState<Incoterm2020>('FOB');
  const [quotedPrice, setQuotedPrice] = useState<number>(685);
  const [oceanFreight, setOceanFreight] = useState<number>(38);
  const [inlandFreight, setInlandFreight] = useState<number>(15);
  const [originTHC, setOriginTHC] = useState<number>(8);
  const [destinationPort, setDestinationPort] = useState('بندر شهید رجایی (بندر عباس)');

  const result = useMemo(() => {
    return normalizeQuoteToCIF(quotedPrice, selectedTerm, {
      inlandOriginFreight: inlandFreight,
      originTHC,
      oceanFreight,
      marineInsuranceRate: 0.0035,
    });
  }, [quotedPrice, selectedTerm, oceanFreight, inlandFreight, originTHC]);

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
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#F3F94A] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111111]">
                موتور هوشمند نرمال‌سازی شرایط اینکوترمز ۲۰۲۰ (Incoterms Normalizer)
              </h3>
              <p className="text-xs text-[#73726E]">
                تبدیل استاندارد کلیه مظنه‌ها به بهای همسان CIF بندر مقصد برای مقایسه عادلانه
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Incoterms Selector Tabs */}
          <div>
            <label className="font-bold text-[#111111] block mb-2">
              ۱. شرط تحویل اعلامی تأمین‌کننده (Incoterm مندرج در پروفرما):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {INCOTERMS_LIST.map((item) => (
                <button
                  key={item.term}
                  type="button"
                  onClick={() => setSelectedTerm(item.term)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedTerm === item.term
                      ? 'bg-[#111111] text-[#F3F94A] border-black shadow-xs'
                      : 'bg-[#F5F4EE] text-[#73726E] border-[#E5E3DC] hover:border-black'
                  }`}
                >
                  {item.term}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#111111]">قیمت اعلام‌شده فروشنده ($)</label>
              <input
                type="number"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] font-bold text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#111111]">کرایه حمل دریایی هر تن ($)</label>
              <input
                type="number"
                value={oceanFreight}
                onChange={(e) => setOceanFreight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-xs font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#111111]">بندر مقصد تحویل</label>
              <select
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-xs font-medium"
              >
                <option value="بندر شهید رجایی (بندر عباس)">بندر شهید رجایی (بندر عباس)</option>
                <option value="بندر امام خمینی (BIK)">بندر امام خمینی (BIK)</option>
                <option value="گمرک بازرگان (مرز ترکیه)">گمرک بازرگان (ترانزیت زمینی)</option>
              </select>
            </div>
          </div>

          {/* Normalization Result Hero Box */}
          <div className="p-5 rounded-2xl bg-[#F3F94A] border border-[#E5E3DC] text-[#111111] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black bg-[#111111] text-[#F3F94A] px-3 py-1 rounded-full">
                نتیجه معادل‌سازی CIF
              </span>
              <span className="text-xs font-bold text-[#111111]">
                بر مبنای اتاق بازرگانی بین‌المللی (ICC 2020)
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <div>
                <span className="text-xs font-medium block">
                  قیمت معادل CIF {destinationPort} به ازای هر تن:
                </span>
                <div className="text-4xl font-black tracking-tight mt-1">
                  {toPersianDigits(result.normalizedCifPrice)} $
                </div>
              </div>
              <div className="text-left text-xs space-y-0.5">
                <div>قیمت پایه: {toPersianDigits(quotedPrice)} $</div>
                <div>حمل دریایی افزوده: +{toPersianDigits(result.estimatedOceanFreight)} $</div>
                <div>بیمه دریایی (Clause C): +{toPersianDigits(result.estimatedMarineInsurance)} $</div>
              </div>
            </div>
          </div>

          {/* Incoterms 2020 Risk & Responsibility Breakdown */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#111111] text-xs">
              مسئولیت‌ها و نقاط انتقال ریسک طبق اینکوترمز ۲۰۲۰ ({selectedTerm}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                  <Ship className="w-4 h-4 text-[#2D7D32]" />
                  <span>نقطه انتقال ریسک به خریدار:</span>
                </div>
                <p className="text-[11px] text-[#73726E] leading-relaxed">
                  {result.buyerRiskPoint}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                  <ShieldCheck className="w-4 h-4 text-[#111111]" />
                  <span>تعهدات هزینه و سرفصل فروشنده:</span>
                </div>
                <p className="text-[11px] text-[#73726E] leading-relaxed">
                  {result.sellerResponsibility}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E3DC] flex items-center justify-between bg-[#F5F4EE]">
          <span className="text-[11px] text-[#73726E]">
            پایگاه داده کرایه‌های حمل کانتینری SCFI و چارتر هفتگی
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#E5E3DC] text-xs font-semibold text-[#73726E] hover:bg-white"
            >
              بستن
            </button>
            {onApplyToComparison && (
              <button
                onClick={() => {
                  onApplyToComparison(selectedTerm, result.normalizedCifPrice);
                  onClose();
                }}
                className="px-5 py-2 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5"
              >
                <span>اعمال در جدول مقایسه</span>
                <Check className="w-3.5 h-3.5 text-[#F3F94A]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
