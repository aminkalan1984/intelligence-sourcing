import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building,
  Factory,
  Award,
  FileCheck,
  Landmark,
  Zap,
  Ship,
  FileText,
  Download,
  Upload,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Percent,
  Layers,
  Search,
} from 'lucide-react';
import { Supplier, SupplierDocument, CooperationRecord } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { HatchedProgressBar } from '../common/HatchedBar';
import {
  toPersianDigits,
  formatPersianNumber,
  formatPersianCurrency,
} from '../../utils/formatters';

interface SupplierManagementModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToRFQ?: (supplier: Supplier) => void;
  onOrderInspection?: (supplier: Supplier) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

type ManagementTab =
  | 'validation'
  | 'documents'
  | 'capacity'
  | 'performance'
  | 'risk'
  | 'cooperation';

export const SupplierManagementModal: React.FC<SupplierManagementModalProps> = ({
  supplier,
  isOpen,
  onClose,
  onAddToRFQ,
  onOrderInspection,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<ManagementTab>('validation');
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Local state for cooperation history to allow adding records dynamically
  const [cooperationList, setCooperationList] = useState<CooperationRecord[]>(
    supplier?.cooperationHistory || []
  );

  // Local state for documents list
  const [documentsList, setDocumentsList] = useState<SupplierDocument[]>(
    supplier?.documents || []
  );

  // New order form fields
  const [newOrderForm, setNewOrderForm] = useState({
    orderNumber: `PO-${supplier?.countryCode || 'INT'}-2024-${Math.floor(10 + Math.random() * 90)}`,
    productName: 'ورق فولادی گالوانیزه Z275 ضخامت ۰٫۸',
    volumeTons: 100,
    unitPriceUSD: supplier?.unitPriceUSD || 685,
    incoterm: 'CIF بندرعباس',
    notes: 'تحویل با خط کانتینری و رعایت شرایط بازرسی پیش از حمل',
  });

  // New document form fields
  const [newDocForm, setNewDocForm] = useState({
    name: '',
    category: 'حقوقی',
    date: '۱۴۰۳/۰۸/۱۰',
  });

  // Sync state if supplier changes
  React.useEffect(() => {
    if (supplier) {
      setCooperationList(supplier.cooperationHistory || []);
      setDocumentsList(supplier.documents || []);
    }
  }, [supplier]);

  if (!isOpen || !supplier) return null;

  // 8 default verification layers
  const verificationLayers = supplier.verificationLayers || [
    { id: '1', title: 'هویت حقوقی و ثبتی', status: 'تأیید شده' as const, score: 98, description: 'ثبت رسمی در اداره تجارت کشور مبدأ و استعلام اتاق بازرگانی', iconName: 'ShieldCheck' },
    { id: '2', title: 'توان عملیاتی و کارخانه', status: 'تأیید شده' as const, score: 92, description: 'ظرفیت تولید واقعی سالانه با خطوط فعال نورد', iconName: 'Factory' },
    { id: '3', title: 'توان صادراتی و بارنامه‌ها', status: 'تأیید شده' as const, score: 85, description: 'سابقه مداوم صادرات کانتینری به خاورمیانه و خلیج فارس', iconName: 'Ship' },
    { id: '4', title: 'کیفیت و استاندارد متالورژی', status: 'تأیید شده' as const, score: 94, description: 'گواهی‌نامه تست آزمایشگاهی SGS و انطباق با DIN EN 10346', iconName: 'Award' },
    { id: '5', title: 'اعتبار تجاری و داوری', status: 'تأیید شده' as const, score: 89, description: 'عدم وجود پرونده عدم ایفای تعهد در دادگاه‌های داوری بین‌المللی', iconName: 'FileCheck' },
    { id: '6', title: 'مالکیت حساب بانکی سوئیفت', status: 'تأیید شده' as const, score: 95, description: 'حساب بانکی تجاری تأیید شده منطبق با شناسه ثبتی شرکت', iconName: 'Landmark' },
    { id: '7', title: 'عملکرد پلتفرم و استعلام', status: 'تأیید شده' as const, score: 90, description: 'نرخ پاسخ‌دهی بالای ۹۵٪ به استعلام‌ها با میانگین ۴ ساعت', iconName: 'Zap' },
    { id: '8', title: 'اعتبار بیرونی و ممیزی میدانی', status: 'تأیید شده' as const, score: 82, description: 'ارزیابی میدانی توسط بازرس مستقل شخص ثالث (SGS/TÜV)', iconName: 'Building' },
  ];

  // Capacity fallback details
  const capacity = supplier.productionDetails || {
    annualCapacity: supplier.capacityMonthly * 12,
    monthlyCapacity: supplier.capacityMonthly,
    unit: supplier.capacityUnit,
    activeLinesCount: 3,
    utilizationRate: 82,
    factoryAreaM2: supplier.factoryArea,
    leadTimeDays: supplier.leadTimeDays,
    equipmentMakers: ['دانیلی (Danieli) ایتالیا', 'SMS Group آلمان'],
    warehouseCapacityTons: Math.round(supplier.capacityMonthly * 1.4),
  };

  // Performance Scorecard fallback details
  const performance = supplier.performanceScorecard || {
    overallScore: supplier.trustScore,
    onTimeDeliveryRate: 96.5,
    qualityPassRate: 98.8,
    rfqResponseHours: 4.2,
    priceStabilityScore: 88,
    sampleApprovalRate: 98,
    historicalOrdersCount: cooperationList.length,
  };

  // Risk Assessment fallback details
  const risk = supplier.riskAssessment || {
    overallRiskLevel: supplier.trustScore >= 80 ? 'کم‌خطر' : supplier.trustScore >= 60 ? 'ریسک متوسط' : 'بحرانی',
    financialStabilityScore: supplier.trustScore,
    fraudShellRiskScore: supplier.isFlaggedFake ? 92 : 6,
    geopoliticalLogisticsRisk: supplier.country === 'چین' ? 24 : supplier.country === 'ترکیه' ? 14 : 16,
    legalDisputeRecordsCount: supplier.isFlaggedFake ? 3 : 0,
    riskSummaryFa: supplier.isFlaggedFake
      ? 'هشدار: فاقد تأسیسات تولیدی و خطوط فعال نورد؛ پروانه تولید معتبر در سامانه ممیزی ثبت نشده است.'
      : 'تأمین‌کننده مستقیم دارای دارایی فیزیکی، پروانه بهره‌برداری معتبر و سابقه صادرات مستمر.',
    mitigationRecommendation: supplier.isFlaggedFake
      ? 'از هرگونه انتقال وجه خودداری شود؛ الزام ممیزی میدانی و بازرسی اسناد.'
      : 'عقد قرارداد رسمی بر مبنای اینکوترمز ۲۰۲۰ و درج شرط بازرسی قبل از حمل (PSI).',
  };

  // Handle adding a cooperation record
  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CooperationRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderForm.orderNumber,
      date: '۱۴۰۳/۰۸/۱۰',
      productName: newOrderForm.productName,
      volumeTons: Number(newOrderForm.volumeTons),
      totalAmountUSD: Number(newOrderForm.volumeTons) * Number(newOrderForm.unitPriceUSD),
      incoterm: newOrderForm.incoterm,
      blNumber: `HBL-${supplier.countryCode}${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'سفارش در جریان تولید',
      qualityRating: 5,
      notes: newOrderForm.notes,
    };

    setCooperationList([newRecord, ...cooperationList]);
    setNewOrderModalOpen(false);
    onShowToast('سفارش جدید ثبت شد', `سفارش ${newRecord.orderNumber} به سوابق همکاری اضافه گردید.`, 'success');
  };

  // Handle document upload simulation
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocForm.name.trim()) return;

    const newDoc: SupplierDocument = {
      id: `doc-${Date.now()}`,
      name: newDocForm.name,
      category: newDocForm.category,
      date: newDocForm.date,
      size: '۲٫۱ مگابایت',
      verified: true,
    };

    setDocumentsList([newDoc, ...documentsList]);
    setUploadModalOpen(false);
    setNewDocForm({ name: '', category: 'حقوقی', date: '۱۴۰۳/۰۸/۱۰' });
    onShowToast('مدرک با موفقیت بارگذاری شد', `سند ${newDoc.name} با موفقیت به پرونده افزوده شد.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] w-full max-w-5xl max-h-[92vh] rounded-3xl border border-[#E5E3DC] shadow-2xl flex flex-col overflow-hidden text-right select-none">
        {/* Top Header Card */}
        <div className="p-5 md:p-6 bg-[#FFFFFF] border-b border-[#E5E3DC] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#111111] text-[#F3F94A] flex items-center justify-center font-black text-2xl shrink-0">
              {supplier.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-black text-[#111111]">{supplier.name}</h3>
                <span className="text-sm font-semibold text-[#73726E]">({supplier.faName})</span>
                <StatusPill
                  label={supplier.type}
                  variant={supplier.type === 'تولیدکننده' ? 'green' : 'neutral'}
                />
                {supplier.isBestMatch && <StatusPill label="بهترین تطابق" variant="ai" />}
                {supplier.isFlaggedFake && (
                  <StatusPill label="مشکوک به شرکت جعلی" variant="alert" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-[#73726E] mt-1.5 flex-wrap">
                <span>مبدأ: <strong className="text-[#111111]">{supplier.country}</strong> ({supplier.city})</span>
                <span>•</span>
                <span>سال تأسیس: <strong className="text-[#111111]">{toPersianDigits(supplier.foundedYear)}</strong></span>
                <span>•</span>
                <span>پرسنل: <strong className="text-[#111111]">{supplier.employeesCount}</strong></span>
                <span>•</span>
                <span>مساحت کارخانه: <strong className="text-[#111111]">{supplier.factoryArea}</strong></span>
              </div>
            </div>
          </div>

          {/* Action CTAs & Close Button */}
          <div className="flex items-center gap-2.5">
            {onAddToRFQ && (
              <button
                onClick={() => {
                  onAddToRFQ(supplier);
                  onShowToast('به استعلام اضافه شد', `${supplier.name} به فهرست RFQ افزوده شد.`, 'success');
                }}
                className="px-4 py-2 rounded-full bg-[#F5F4EE] hover:bg-[#E5E3DC] text-xs font-bold text-[#111111] border border-[#E5E3DC] transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن به استعلام قیمت</span>
              </button>
            )}

            {onOrderInspection && (
              <button
                onClick={() => onOrderInspection(supplier)}
                className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-xs font-bold text-[#F3F94A] transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>سفارش ممیزی SGS</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#F5F4EE] hover:bg-[#E5E3DC] border border-[#E5E3DC] flex items-center justify-center text-[#73726E] hover:text-[#111111] transition-colors"
              aria-label="بستن"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Tab Headers Bar */}
        <div className="bg-[#F5F4EE] px-5 py-2.5 border-b border-[#E5E3DC] flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'validation', label: 'پروفایل و اعتبارسنجی', icon: ShieldCheck, badge: '۸ لایه' },
            { id: 'documents', label: 'مدارک و سرتیفیکیت‌ها', icon: FileCheck, count: documentsList.length },
            { id: 'capacity', label: 'ظرفیت و توان تولید', icon: Factory },
            { id: 'performance', label: 'کارنامه و امتیاز عملکرد', icon: Award, score: `${toPersianDigits(performance.overallScore)}٪` },
            { id: 'risk', label: 'تحلیل و ماتریس ریسک', icon: AlertTriangle, alert: supplier.isFlaggedFake },
            { id: 'cooperation', label: 'سوابق همکاری و سفارشات', icon: Ship, count: cooperationList.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ManagementTab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-none'
                    : 'text-[#73726E] hover:text-[#111111] hover:bg-[#E5E3DC]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F3F94A]' : ''}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-[#F3F94A] text-[#111111]' : 'bg-[#E5E3DC] text-[#73726E]'
                    }`}
                  >
                    {toPersianDigits(tab.count)}
                  </span>
                )}
                {tab.score && (
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-[#F3F94A] text-[#111111]' : 'bg-[#E5E3DC] text-[#73726E]'
                    }`}
                  >
                    {tab.score}
                  </span>
                )}
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-[#C53030] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {/* TAB 1: VALIDATION PROFILE */}
          {activeTab === 'validation' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Trust Score Hero Banner */}
              <div className="p-5 rounded-2xl bg-[#F3F94A] border border-[#E5E3DC] flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs font-bold text-[#111111] block mb-1">
                    امتیاز رسمی اعتبارسنجی مستقل (Trust & Verification Index)
                  </span>
                  <div className="text-4xl font-black text-[#111111]">
                    {toPersianDigits(supplier.trustScore)} از ۱۰۰
                  </div>
                  <p className="text-xs text-[#111111]/80 mt-1">
                    احراز صلاحیت بر اساس ۸ شاخص ممیزی میدانی، اسناد ثبتی و آزمون متالورژی آزمایشگاهی
                  </p>
                </div>
                <div className="text-left">
                  <span className="px-3 py-1 rounded-full bg-black text-[#F3F94A] text-xs font-bold inline-block">
                    {supplier.trustScore >= 85 ? 'رتبه اعتماد A+' : supplier.trustScore >= 70 ? 'رتبه اعتماد B' : 'هشدار ریسک'}
                  </span>
                </div>
              </div>

              {/* Legal & Registration Metadata Inset */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">شماره ثبت تجاری و مالیاتی:</span>
                  <div className="text-xs font-black text-[#111111] font-mono tracking-wider">
                    {supplier.countryCode}-REG-{supplier.foundedYear}-9841
                  </div>
                  <span className="text-[10px] text-[#2D7D32] mt-1 block font-medium">استعلام رسمی تأیید شده</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">حساب بانکی و سوئیفت تأییدشده:</span>
                  <div className="text-xs font-black text-[#111111] font-mono tracking-wider">
                    {supplier.countryCode === 'VN' ? 'VTCBVNVX' : supplier.countryCode === 'TR' ? 'TCZBTR2A' : 'CHINCNBJ'}
                  </div>
                  <span className="text-[10px] text-[#2D7D32] mt-1 block font-medium">تطابق کامل نام حساب با شرکت</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">وضعیت ممیزی بازرسی شخص ثالث:</span>
                  <div className="text-xs font-bold text-[#111111]">
                    {supplier.isFlaggedFake ? 'فاقد ممیزی (مشکوک)' : 'SGS Factory Inspection (تأیید)'}
                  </div>
                  <span className="text-[10px] text-[#73726E] mt-1 block">اعتبار تا سپتامبر ۲۰۲۵</span>
                </div>
              </div>

              {/* 8 Verification Layers Grid */}
              <div>
                <h4 className="text-sm font-bold text-[#111111] mb-3">
                  ممیزی لایه‌های ۸ گانه اعتبارسنجی تخصصی بازرگانی خارجی
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {verificationLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC] hover:border-[#111111] transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#2D7D32]" />
                          <span className="font-bold text-xs text-[#111111]">{layer.title}</span>
                        </div>
                        <span className="text-xs font-black text-[#111111]">
                          {toPersianDigits(layer.score)}٪
                        </span>
                      </div>
                      <p className="text-[11px] text-[#73726E] leading-relaxed mb-3">
                        {layer.description}
                      </p>
                      <HatchedProgressBar
                        value={layer.score}
                        isActive={layer.score >= 85}
                        activeColor="yellow"
                        height="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS & CERTIFICATIONS */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">
                    اسناد رسمی و گواهینامه‌های ممیزی‌شده تأمین‌کننده
                  </h4>
                  <p className="text-xs text-[#73726E] mt-0.5">
                    تأییدیه پروانه تولید، سرتیفیکیت آزمون متالورژی MTC، بارنامه‌های BL و استانداردها
                  </p>
                </div>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-xs font-bold text-[#F3F94A] transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>بارگذاری مدرک یا تست جدید</span>
                </button>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                {documentsList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#73726E] bg-[#F5F4EE] rounded-2xl border border-[#E5E3DC]">
                    مدرک رسمی بارگذاری نشده است.
                  </div>
                ) : (
                  documentsList.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC] hover:border-[#111111] transition-all flex items-center justify-between flex-wrap gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5F4EE] text-[#111111] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#111111]">{doc.name}</span>
                            <span className="text-[10px] bg-[#F5F4EE] px-2 py-0.5 rounded-full font-bold text-[#73726E] border border-[#E5E3DC]">
                              {doc.category}
                            </span>
                            {doc.verified ? (
                              <span className="text-[10px] text-[#2D7D32] bg-[#D5E8D4] px-2 py-0.5 rounded-full font-bold">
                                تأیید اصالت
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#C53030] bg-[#FDEBE6] px-2 py-0.5 rounded-full font-bold">
                                مشکوک
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#73726E] mt-1 flex items-center gap-3">
                            <span>تاریخ بارگذاری: {toPersianDigits(doc.date)}</span>
                            <span>•</span>
                            <span>حجم: {doc.size}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onShowToast('پیش‌نمایش سند', `در حال بارگذاری سند ${doc.name}...`, 'info')}
                          className="px-3 py-1.5 rounded-full bg-[#F5F4EE] hover:bg-[#E5E3DC] text-xs font-bold text-[#111111] border border-[#E5E3DC] transition-colors"
                        >
                          مشاهده سند
                        </button>
                        <button
                          onClick={() => onShowToast('دانلود مدرک', `فایل ${doc.name} ذخیره شد.`, 'success')}
                          className="p-2 rounded-full bg-[#111111] hover:bg-black text-[#F3F94A] transition-colors"
                          title="دانلود"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Certifications Badges Bar */}
              <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
                <span className="text-xs font-bold text-[#111111] block mb-2">
                  گواهینامه‌ها و استانداردهای کیفی کارخانه:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {supplier.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-white text-xs font-black text-[#111111] border border-[#E5E3DC] flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-[#2D7D32]" />
                      <span>{cert}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTION CAPACITY */}
          {activeTab === 'capacity' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">ظرفیت اسمی سالانه:</span>
                  <div className="text-2xl font-black text-[#111111]">
                    {formatPersianNumber(capacity.annualCapacity)}
                  </div>
                  <span className="text-[11px] text-[#73726E]">تن در سال</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">ظرفیت ماهانه فعال:</span>
                  <div className="text-2xl font-black text-[#111111]">
                    {formatPersianNumber(capacity.monthlyCapacity)}
                  </div>
                  <span className="text-[11px] text-[#73726E]">تن در ماه</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">نرخ بهره‌برداری خطوط:</span>
                  <div className="text-2xl font-black text-[#2D7D32]">
                    {toPersianDigits(capacity.utilizationRate)}٪
                  </div>
                  <span className="text-[11px] text-[#73726E]">{toPersianDigits(capacity.activeLinesCount)} خط فعال نورد</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">ظرفیت انبارش مواد اولیه:</span>
                  <div className="text-2xl font-black text-[#111111]">
                    {formatPersianNumber(capacity.warehouseCapacityTons)}
                  </div>
                  <span className="text-[11px] text-[#73726E]">تن در سوله سرپوشیده</span>
                </div>
              </div>

              {/* Production Machinery & Technology Inset */}
              <div className="p-5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#111111]">
                    فناوری و سازندگان خطوط نورد و گالوانیزاسیون
                  </h4>
                  <span className="text-xs font-bold text-[#73726E]">
                    مساحت کارخانه: {supplier.factoryArea}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {capacity.equipmentMakers.map((maker, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white text-xs font-bold text-[#111111] border border-[#E5E3DC]"
                    >
                      {maker}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#73726E] leading-relaxed">
                  کنترل ضخامت ورق‌ها به صورت اتوماتیک با سنسورهای رادیواکتیو اشعه ایکس (X-Ray Gauge) و سیستم خنک‌کننده نیتروژنی برای جلوگیری از اکسیداسیون رول‌ها در آب‌وهوای مرطوب بنادر.
                </p>
              </div>

              {/* Order & Lead Time Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">حداقل مقدار سفارش (MOQ):</span>
                  <span className="text-lg font-black text-[#111111]">
                    {toPersianDigits(supplier.moq)} تن
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">زمان آماده‌سازی و بارگیری:</span>
                  <span className="text-lg font-black text-[#111111]">
                    {toPersianDigits(supplier.leadTimeDays)} روز
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">شرایط نمونه‌گیری آزمایشی:</span>
                  <span className="text-lg font-black text-[#2D7D32]">
                    {supplier.sampleAvailable ? 'رایگان (کلاف ۲ متری)' : 'با پرداخت هزینه'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PERFORMANCE SCORECARD */}
          {activeTab === 'performance' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">نرخ تحویل به‌موقع (OTD):</span>
                  <div className="text-3xl font-black text-[#111111]">
                    {toPersianDigits(performance.onTimeDeliveryRate)}٪
                  </div>
                  <span className="text-[10px] text-[#2D7D32] font-semibold mt-1 block">کمترین معطلی در بنادر بارگیری</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">نرخ قبولی کیفی متالورژی:</span>
                  <div className="text-3xl font-black text-[#2D7D32]">
                    {toPersianDigits(performance.qualityPassRate)}٪
                  </div>
                  <span className="text-[10px] text-[#73726E] font-semibold mt-1 block">تطابق با ضخامت و پوشش روی</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">زمان پاسخ به استعلام (RFQ):</span>
                  <div className="text-3xl font-black text-[#111111]">
                    {toPersianDigits(performance.rfqResponseHours)} ساعت
                  </div>
                  <span className="text-[10px] text-[#73726E] font-semibold mt-1 block">سرعت مذاکره و صدور PI</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">شاخص ثبات قیمت:</span>
                  <div className="text-3xl font-black text-[#111111]">
                    {toPersianDigits(performance.priceStabilityScore)} از ۱۰۰
                  </div>
                  <span className="text-[10px] text-[#2D7D32] font-semibold mt-1 block">پایبندی به قیمت اعلامی تا ۳۰ روز</span>
                </div>
              </div>

              {/* Reviews and Ratings from Verified Importers */}
              <div>
                <h4 className="text-sm font-bold text-[#111111] mb-3">
                  نظرات و ممیزی‌های ثبت شده خریداران تجاری
                </h4>
                <div className="space-y-3">
                  {supplier.reviews && supplier.reviews.length > 0 ? (
                    supplier.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#111111]">{rev.buyerName}</span>
                            <span className="text-[11px] text-[#73726E]">({rev.country})</span>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#E5E3DC] font-bold">
                              حجم سفارش: {toPersianDigits(rev.orderVolume)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[#C05621]">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-bold">{toPersianDigits(rev.rating)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-[#73726E] leading-relaxed">
                          «{rev.comment}»
                        </p>
                        <span className="text-[10px] text-[#73726E] block text-left">
                          تاریخ تحویل: {toPersianDigits(rev.date)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-[#73726E] bg-[#F5F4EE] rounded-2xl">
                      هنوز نظری برای این تأمین‌کننده ثبت نشده است.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RISK EVALUATION */}
          {activeTab === 'risk' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div
                className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
                  risk.overallRiskLevel === 'بحرانی'
                    ? 'bg-[#FDEBE6] border-[#C53030]'
                    : risk.overallRiskLevel === 'ریسک متوسط'
                    ? 'bg-[#F5DFCB] border-[#C05621]'
                    : 'bg-[#D5E8D4] border-[#2D7D32]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#111111]">سطح ارزیابی ریسک کل:</span>
                    <span className="text-sm font-black text-[#111111]">
                      {risk.overallRiskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-[#111111]/80 mt-1">
                    {risk.riskSummaryFa}
                  </p>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold bg-white/70 px-3 py-1 rounded-full border border-black/10">
                    دعاوی معوق: {toPersianDigits(risk.legalDisputeRecordsCount)} مورد
                  </span>
                </div>
              </div>

              {/* 4 Risk Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">شاخص سلامت مالی:</span>
                  <div className="text-2xl font-black text-[#111111] mb-2">
                    {toPersianDigits(risk.financialStabilityScore)} از ۱۰۰
                  </div>
                  <HatchedProgressBar
                    value={risk.financialStabilityScore}
                    isActive={risk.financialStabilityScore >= 80}
                    activeColor="yellow"
                    height="h-2"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">ریسک شرکت کاغذی / صوری:</span>
                  <div className="text-2xl font-black text-[#C53030] mb-2">
                    {toPersianDigits(risk.fraudShellRiskScore)}٪
                  </div>
                  <span className="text-[10px] text-[#73726E]">
                    {risk.fraudShellRiskScore > 50 ? 'هشدار شدید: احتمال واسطه صوری' : 'ایمن: تأسیسات کارخانه محرز است'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC]">
                  <span className="text-[11px] text-[#73726E] font-bold block mb-1">ریسک ژئوپلیتیک و لجستیک:</span>
                  <div className="text-2xl font-black text-[#111111] mb-2">
                    {toPersianDigits(risk.geopoliticalLogisticsRisk)}٪
                  </div>
                  <span className="text-[10px] text-[#73726E]">مسیر دریایی هایفونگ به بندرعباس</span>
                </div>
              </div>

              {/* Mitigation Strategy */}
              <div className="p-5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] space-y-2">
                <h4 className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2D7D32]" />
                  <span>راهکار مدیریتی و اقدامات احتیاطی پیشنهادی:</span>
                </h4>
                <p className="text-xs text-[#73726E] leading-relaxed">
                  {risk.mitigationRecommendation}
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: COOPERATION & ORDER HISTORY */}
          {activeTab === 'cooperation' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">
                    سوابق قراردادها و پارت‌های خریداری‌شده توسط شرکت Atlas Imports
                  </h4>
                  <p className="text-xs text-[#73726E] mt-0.5">
                    ردگیری تاریخچه پرداخت‌ها، شماره بارنامه‌های ترخیص شده و امتیاز کیفی
                  </p>
                </div>
                <button
                  onClick={() => setNewOrderModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-xs font-bold text-[#F3F94A] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت سفارش / پارت جدید</span>
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-[#F5F4EE] border-b border-[#E5E3DC] font-bold text-[#73726E] text-[11px]">
                        <th className="py-3 px-4">شماره سفارش (PO)</th>
                        <th className="py-3 px-4">تاریخ</th>
                        <th className="py-3 px-4">شرح کالا</th>
                        <th className="py-3 px-4">تناژ</th>
                        <th className="py-3 px-4">مبلغ کل (دلار)</th>
                        <th className="py-3 px-4">اینکوترمز</th>
                        <th className="py-3 px-4">شماره بارنامه (BL)</th>
                        <th className="py-3 px-4">وضعیت تحویل</th>
                        <th className="py-3 px-4 text-center">کیفیت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E3DC]">
                      {cooperationList.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-xs text-[#73726E]">
                            هنوز سفارشی با این تأمین‌کننده ثبت نشده است. روی «ثبت سفارش جدید» کلیک کنید.
                          </td>
                        </tr>
                      ) : (
                        cooperationList.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#F5F4EE]/50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-[#111111]">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3 px-4 text-[#73726E] whitespace-nowrap">
                              {toPersianDigits(ord.date)}
                            </td>
                            <td className="py-3 px-4 font-bold text-[#111111]">
                              {ord.productName}
                            </td>
                            <td className="py-3 px-4 text-[#111111] whitespace-nowrap">
                              {toPersianDigits(ord.volumeTons)} تن
                            </td>
                            <td className="py-3 px-4 font-black text-[#111111] whitespace-nowrap">
                              {formatPersianCurrency(ord.totalAmountUSD)}
                            </td>
                            <td className="py-3 px-4 text-[#73726E] whitespace-nowrap">
                              {ord.incoterm}
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-[#73726E]">
                              {ord.blNumber}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <StatusPill
                                label={ord.status}
                                variant={
                                  ord.status === 'تحویل‌شده و تسویه‌شده'
                                    ? 'green'
                                    : ord.status === 'در حال حمل دریایی'
                                    ? 'orange'
                                    : 'neutral'
                                }
                              />
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span className="font-bold text-[#2D7D32] bg-[#D5E8D4] px-2 py-0.5 rounded-full text-[10px]">
                                {toPersianDigits(ord.qualityRating)} ★
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Cooperation Summary */}
              {cooperationList.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] flex items-center justify-between text-xs flex-wrap gap-2">
                  <span className="font-bold text-[#111111]">
                    مجموع حجم واردات از این کارخانه: {toPersianDigits(cooperationList.reduce((acc, c) => acc + c.volumeTons, 0))} تن
                  </span>
                  <span className="font-black text-[#111111]">
                    ارزش کل سفارشات: {formatPersianCurrency(cooperationList.reduce((acc, c) => acc + c.totalAmountUSD, 0))}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-[#F5F4EE] border-t border-[#E5E3DC] flex items-center justify-between text-xs text-[#73726E]">
          <span>شناسه یکتای پرونده: {supplier.id} | پایگاه داده ارزیابی تأمین‌کنندگان Atlas Imports</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#111111] hover:bg-black text-white font-bold transition-colors"
          >
            بستن پنجره
          </button>
        </div>
      </div>

      {/* SUB-MODAL 1: NEW ORDER / PO CREATION */}
      {newOrderModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] w-full max-w-md rounded-3xl border border-[#E5E3DC] shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#111111]">
                ثبت سفارش جدید در سوابق همکاری
              </h4>
              <button
                onClick={() => setNewOrderModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F5F4EE] flex items-center justify-center text-[#73726E]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#73726E] block mb-1">شماره سفارش (PO):</label>
                <input
                  type="text"
                  value={newOrderForm.orderNumber}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, orderNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC] font-mono text-left focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#73726E] block mb-1">عنوان کالا:</label>
                <input
                  type="text"
                  value={newOrderForm.productName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, productName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC] focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#73726E] block mb-1">تناژ (تن):</label>
                  <input
                    type="number"
                    value={newOrderForm.volumeTons}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, volumeTons: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC] focus:outline-none focus:border-black font-bold"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#73726E] block mb-1">قیمت واحد (دلار):</label>
                  <input
                    type="number"
                    value={newOrderForm.unitPriceUSD}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, unitPriceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC] focus:outline-none focus:border-black font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#73726E] block mb-1">شرط تحویل (Incoterms):</label>
                <select
                  value={newOrderForm.incoterm}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, incoterm: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC] focus:outline-none focus:border-black font-bold"
                >
                  <option value="CIF بندرعباس">CIF بندرعباس</option>
                  <option value="FOB هایفونگ / شانگهای">FOB هایفونگ / شانگهای</option>
                  <option value="CFR بندرعباس">CFR بندرعباس</option>
                  <option value="DAP مرز بازرگان">DAP مرز بازرگان</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#73726E] block mb-1">یادداشت فنی و بازرسی:</label>
                <textarea
                  value={newOrderForm.notes}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC] focus:outline-none focus:border-black text-[11px]"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F4EE] text-[#73726E] font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#111111] text-[#F3F94A] font-bold hover:bg-black"
                >
                  ثبت سفارش در سامانه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: UPLOAD DOCUMENT */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] w-full max-w-md rounded-3xl border border-[#E5E3DC] shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#111111]">
                بارگذاری سند یا گواهی جدید
              </h4>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F5F4EE] flex items-center justify-center text-[#73726E]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#73726E] block mb-1">عنوان مدرک:</label>
                <input
                  type="text"
                  placeholder="مثال: گواهی آزمون کشش و خمش رازی"
                  value={newDocForm.name}
                  onChange={(e) => setNewDocForm({ ...newDocForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC] focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#73726E] block mb-1">دسته‌بندی مدرک:</label>
                <select
                  value={newDocForm.category}
                  onChange={(e) => setNewDocForm({ ...newDocForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F4EE] border border-[#E5E3DC] focus:outline-none focus:border-black font-bold"
                >
                  <option value="حقوقی">حقوقی و ثبتی</option>
                  <option value="فنی">فنی و بازرسی کارخانه</option>
                  <option value="کیفیت">آزمایشگاه و کیفیت متالورژی</option>
                  <option value="صادرات">صادرات و بارنامه BL</option>
                  <option value="مالی">مالی و بانکی سوئیفت</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-[#D0CEBE] text-center bg-[#F5F4EE]">
                <Upload className="w-6 h-6 text-[#73726E] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#111111] block">انتخاب فایل PDF / Image</span>
                <span className="text-[10px] text-[#73726E]">حداکثر حجم مجاز: ۱۵ مگابایت</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F4EE] text-[#73726E] font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#111111] text-[#F3F94A] font-bold hover:bg-black"
                >
                  بارگذاری و اعتبارسنجی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
