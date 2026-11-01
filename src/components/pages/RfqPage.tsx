import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Send,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Users,
  ChevronDown,
  X,
  FileText,
} from 'lucide-react';
import { RFQItem, RFQResponse, Supplier, PageId } from '../../types';
import { HatchedFunnelStep } from '../common/HatchedBar';
import { StatusPill } from '../common/StatusPill';
import { toPersianDigits, formatPersianCurrency } from '../../utils/formatters';

interface RfqPageProps {
  rfqs: RFQItem[];
  allSuppliers: Supplier[];
  onNavigate: (page: PageId, targetId?: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const RfqPage: React.FC<RfqPageProps> = ({
  rfqs,
  allSuppliers,
  onNavigate,
  onShowToast,
}) => {
  const [selectedRfqId, setSelectedRfqId] = useState<string>(rfqs[0]?.id || 'rfq-0142');
  const [isNewRfqModalOpen, setIsNewRfqModalOpen] = useState(false);

  // Active RFQ
  const currentRfq = rfqs.find((r) => r.id === selectedRfqId) || rfqs[0];

  // Negotiation thread state
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'سارا احمدی (Atlas Imports)',
      time: 'دیروز ۱۱:۲۰',
      isMe: true,
      text: 'با درود. پیرو استعلام RFQ-0142 برای ۱۰۰ تن ورق Z275، آیا در صورت عقد قرارداد سالانه ۳۰۰۰ تن، امکان کاهش قیمت FOB به ۶۷۵ دلار بر تن و صدور LC ۶۰ روزه وجود دارد؟',
    },
    {
      id: 'm2',
      sender: 'Hanoi Steel Works (مدیر فروش صادرات)',
      time: 'امروز ۰۹:۱۵',
      isMe: false,
      text: 'سلام خانم احمدی. با تشکر از اعتماد شما به کارخانه هانوی. برای سفارش اول ۱۰۰ تن قیمت ۶۸۵ دلار قطعی است، اما با گشایش LC ۶۰ روزه موافقت شد. در سفارش دوم تخفیف ۶۷۵ دلار اعمال خواهد گردید.',
    },
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  // New RFQ form modal state
  const [modalForm, setModalForm] = useState({
    productName: 'ورق فولادی گالوانیزه رول شده Z275',
    hsCode: '۷۲۱۰٫۴۹',
    quantity: 100,
    unit: 'تن متری',
    schedule: 'یک‌ماهه',
    destination: 'بندر عباس (مجتمع بندری شهید رجایی)',
    standards: 'DIN EN 10346, ASTM A653',
    paymentTerms: 'اعتبار اسنادی LC ۶۰ روزه یا TT',
    packaging: 'بسته‌بندی دریایی چهارلایه صادراتی',
    requestSample: true,
    requireInspection: true,
    deadline: '۱۴۰۳/۰۸/۲۰',
    selectedSupplierIds: ['hanoi-steel', 'anatolia-metal', 'shandong-coil'],
  });

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    const msg = {
      id: `m-${Date.now()}`,
      sender: 'سارا احمدی (Atlas Imports)',
      time: 'هم‌اکنون',
      isMe: true,
      text: newMessageText,
    };
    setMessages([...messages, msg]);
    setNewMessageText('');
    onShowToast('پیام به کارتابل تأمین‌کننده ارسال شد', '', 'success');
  };

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewRfqModalOpen(false);
    onShowToast(`استعلام قیمت جدید با کد RFQ-0143 صادر شد`, 'استعلام برای ۳ تأمین‌کننده منتخب ارسال گردید', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Selector and RFQ Header */}
      <section className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3DC] flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] text-[#F3F94A] flex items-center justify-center font-black">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-[#111111] text-white px-2.5 py-0.5 rounded-full">
                {toPersianDigits(currentRfq.code)}
              </span>
              <h2 className="text-lg font-black text-[#111111]">{currentRfq.title}</h2>
              <StatusPill label={currentRfq.status} variant="green" />
            </div>
            <div className="text-xs text-[#73726E] mt-1 flex items-center gap-3">
              <span>کد تعرفه: <strong className="text-[#111111] font-mono">{currentRfq.hsCode}</strong></span>
              <span>•</span>
              <span>تاریخ ایجاد: {toPersianDigits(currentRfq.createdDate)}</span>
              <span>•</span>
              <span>مهلت ارسال پیشنهاد: {toPersianDigits(currentRfq.deadlineDate)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRfqId}
            onChange={(e) => setSelectedRfqId(e.target.value)}
            className="py-2.5 px-4 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-xs font-bold text-[#111111] focus:outline-none"
            aria-label="انتخاب استعلام قیمت"
          >
            {rfqs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code} - {r.productName}
              </option>
            ))}
          </select>

          <button
            onClick={() => onShowToast('یادآوری خودکار برای ۳ تأمین‌کننده در انتظار ارسال شد', '', 'info')}
            className="px-5 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black font-semibold text-xs transition-all flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-[#F3F94A]" />
            <span>ارسال یادآوری به تأمین‌کنندگان</span>
          </button>
        </div>
      </section>

      {/* Hatched Funnel & Yellow Hero Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hatched Funnel (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#111111]">قیف پیشرفت استعلام بین‌المللی</h3>
              <p className="text-xs text-[#73726E] mt-0.5">مراحل تبدیل از ارسال تا انتخاب پیشنهاد نهایی</p>
            </div>
            <span className="text-xs font-bold bg-[#F5F4EE] px-3 py-1 rounded-full border border-[#E5E3DC]">
              نرخ تبدیل نهایی: ۳۷٫۵٪
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <HatchedFunnelStep
              title="ارسال‌شده"
              count={toPersianDigits(currentRfq.sentCount)}
              percentage="۱۰۰٪"
              isKey={false}
            />
            <HatchedFunnelStep
              title="بازشده"
              count={toPersianDigits(currentRfq.openedCount)}
              percentage="۸۷٪"
              isKey={false}
            />
            <HatchedFunnelStep
              title="پاسخ‌داده"
              count={toPersianDigits(currentRfq.respondedCount)}
              percentage="۶۲٪"
              isKey={false}
            />
            <HatchedFunnelStep
              title="منتخب"
              count={toPersianDigits(currentRfq.shortlistedCount)}
              percentage="۳۸٪"
              isKey={true}
            />
          </div>
        </div>

        {/* Yellow Hero Received Responses Card (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#F3F94A] border border-[#E5E3DC] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black bg-[#111111] text-[#F3F94A] px-3 py-1 rounded-full">
              وضعیت مشارکت
            </span>
            <span className="text-xs text-[#111111] font-bold">۵ روز مانده تا مهلت</span>
          </div>

          <div className="my-3">
            <span className="text-xs font-semibold text-[#111111] block mb-1">
              پاسخ‌های دریافتی رسمی
            </span>
            <div className="text-4xl font-black text-[#111111] tracking-tight">
              {toPersianDigits(currentRfq.respondedCount)} از {toPersianDigits(currentRfq.sentCount)}
            </div>
            <p className="text-xs text-[#111111]/80 mt-2 font-medium leading-relaxed">
              تأمین‌کنندگان در ویتنام و ترکیه به طور کامل فرم را تکمیل کرده‌اند؛ پاسخ‌های هند و چین نیازمند شفاف‌سازی است.
            </p>
          </div>

          <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs text-[#111111] font-bold">
            <span>میانگین قیمت پیشنهادی FOB:</span>
            <span>۶۸۸ دلار / تن</span>
          </div>
        </div>
      </section>

      {/* Requirements Chips & AI Summary Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 p-5 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC]">
          <h4 className="text-xs font-bold text-[#111111] mb-2.5">
            الزامات فنی و تجاری مندرج در این استعلام:
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] font-semibold text-[#111111]">
              استاندارد مرجع: DIN EN 10346
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] font-semibold text-[#111111]">
              پوشش روی: حداقل Z275 Regular Spangle
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] font-semibold text-[#111111]">
              حجم: ۱۰۰ تن با تلورانس ۵٪
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] font-semibold text-[#111111]">
              مقصد تحویل: بندر شهید رجایی (بندر عباس)
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] font-semibold text-[#111111]">
              تسویه: LC دیداری یا ۶۰ روزه
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#D5E8D4] text-[#2D7D32] border border-[#C2DEC0] font-semibold">
              الزام بازرسی SGS پیش از بارگیری
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F3F94A] flex items-center justify-center text-[#111111] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111111]">خلاصه تحلیلی هوش مصنوعی</h4>
            <p className="text-[11px] text-[#73726E] mt-0.5 leading-relaxed">
              شرکت Hanoi Steel Works با ۶۸۵ دلار FOB و CIF معادل ۷۲۳ دلار مناسب‌ترین توازن را بین قیمت، کیفیت آزمایشگاهی و سرعت تحویل داراست.
            </p>
          </div>
        </div>
      </section>

      {/* Standardized Responses Table */}
      <section className="bg-[#FFFFFF] rounded-3xl border border-[#E5E3DC] overflow-hidden">
        <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-[#111111]">جدول استاندارد پاسخ‌های دریافتی</h4>
            <p className="text-xs text-[#73726E] mt-0.5">یکپارچه‌سازی و نرمال‌سازی شرایط پیشنهادی برای مقایسه مستقیم</p>
          </div>
          <button
            onClick={() => setIsNewRfqModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#F3F94A]" />
            <span>ایجاد RFQ جدید</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F4EE] border-b border-[#E5E3DC] text-[11px] font-bold text-[#73726E]">
                <th className="py-3 px-5">تأمین‌کننده</th>
                <th className="py-3 px-4">قیمت پیشنهادی</th>
                <th className="py-3 px-4">اینکوترمز</th>
                <th className="py-3 px-4">CIF معادل بندرعباس</th>
                <th className="py-3 px-4">حداقل سفارش (MOQ)</th>
                <th className="py-3 px-4">زمان تحویل</th>
                <th className="py-3 px-4">روش پرداخت</th>
                <th className="py-3 px-4">ارسال نمونه</th>
                <th className="py-3 px-4">وضعیت پیشنهاد</th>
                <th className="py-3 px-5 text-center">اقدام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {currentRfq.responses.map((resp) => {
                const isReceived = resp.status === 'دریافت شد';
                const isIncomplete = resp.status === 'اطلاعات ناقص';
                return (
                  <tr key={resp.id} className="hover:bg-[#F5F4EE]/50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#111111]">
                      {resp.supplierName}
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm">
                      {resp.unitPriceUSD > 0 ? `${toPersianDigits(resp.unitPriceUSD)} $` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#73726E]">
                      {resp.incoterm || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#111111]">
                      {resp.normalizedCifUSD > 0 ? `${toPersianDigits(resp.normalizedCifUSD)} $` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {resp.moq > 0 ? `${toPersianDigits(resp.moq)} تن` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {resp.leadTimeDays > 0 ? `${toPersianDigits(resp.leadTimeDays)} روز` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {resp.paymentTerms || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {resp.sampleProvided}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusPill
                        label={resp.status}
                        variant={isReceived ? 'green' : isIncomplete ? 'orange' : 'neutral'}
                        showDot={true}
                      />
                    </td>
                    <td className="py-3.5 px-5 text-center whitespace-nowrap">
                      {isReceived ? (
                        <button
                          onClick={() => {
                            onNavigate('comparison');
                          }}
                          className="px-3 py-1 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold"
                        >
                          انتقال به مقایسه
                        </button>
                      ) : (
                        <button
                          onClick={() => onShowToast(`یادآوری به ${resp.supplierName} ارسال شد`, '', 'info')}
                          className="px-3 py-1 rounded-full bg-[#F5F4EE] hover:bg-[#E5E3DC] text-xs font-bold text-[#73726E]"
                        >
                          پیگیری
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Negotiation Chat Thread */}
      <section className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3DC] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#111111]" />
            <h4 className="text-base font-bold text-[#111111]">
              رشته مذاکرات و چانه‌زنی تجاری (Hanoi Steel Works)
            </h4>
          </div>
          <span className="text-xs text-[#2D7D32] bg-[#D5E8D4] px-3 py-1 rounded-full font-bold">
            کانال مذاکره مستقیم متصل
          </span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto p-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.isMe ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-2 text-[11px] text-[#73726E] mb-1">
                <strong>{m.sender}</strong>
                <span>{toPersianDigits(m.time)}</span>
              </div>
              <div
                className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                  m.isMe
                    ? 'bg-[#111111] text-white rounded-br-none'
                    : 'bg-[#F5F4EE] text-[#111111] border border-[#E5E3DC] rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#E5E3DC]">
          <input
            type="text"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="پاسخ یا پیشنهاد اصلاحی خود را بنویسید (مثلاً: تخفیف ۲ درصدی برای تسویه نقدی)..."
            className="flex-1 px-4 py-2.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-xs focus:border-[#111111] focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="px-5 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5"
          >
            <span>ارسال پیام</span>
            <Send className="w-3.5 h-3.5 text-[#F3F94A] -scale-x-100" />
          </button>
        </div>
      </section>

      {/* New RFQ Modal */}
      {isNewRfqModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-3xl border border-[#E5E3DC] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between bg-[#F5F4EE]">
              <div>
                <h3 className="font-bold text-sm text-[#111111]">ایجاد و ارسال استعلام قیمت جدید (New RFQ)</h3>
                <p className="text-xs text-[#73726E]">ارسال همزمان به تأمین‌کنندگان منتخب با فرم استاندارد</p>
              </div>
              <button
                onClick={() => setIsNewRfqModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#E5E3DC] flex items-center justify-center text-[#73726E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRfq} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">نام کالا</label>
                  <input
                    type="text"
                    value={modalForm.productName}
                    onChange={(e) => setModalForm({ ...modalForm, productName: e.target.value })}
                    className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">کد تعرفه گمرکی</label>
                  <input
                    type="text"
                    value={modalForm.hsCode}
                    onChange={(e) => setModalForm({ ...modalForm, hsCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">مقدار تقاضا</label>
                  <input
                    type="number"
                    value={modalForm.quantity}
                    onChange={(e) => setModalForm({ ...modalForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">برنامه خرید</label>
                  <input
                    type="text"
                    value={modalForm.schedule}
                    onChange={(e) => setModalForm({ ...modalForm, schedule: e.target.value })}
                    className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">مهلت پاسخگویی</label>
                  <input
                    type="text"
                    value={modalForm.deadline}
                    onChange={(e) => setModalForm({ ...modalForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111111]">بندر و محل تحویل نهایی</label>
                <input
                  type="text"
                  value={modalForm.destination}
                  onChange={(e) => setModalForm({ ...modalForm, destination: e.target.value })}
                  className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">استانداردها و گواهی‌نامه‌های الزامی</label>
                  <input
                    type="text"
                    value={modalForm.standards}
                    onChange={(e) => setModalForm({ ...modalForm, standards: e.target.value })}
                    className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">شرایط پرداخت درخواستی</label>
                  <input
                    type="text"
                    value={modalForm.paymentTerms}
                    onChange={(e) => setModalForm({ ...modalForm, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="p-3 bg-[#F5F4EE] rounded-2xl space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-[#111111]">ارسال نمونه فیزیکی پیش از سفارش الزامی است</span>
                  <input
                    type="checkbox"
                    checked={modalForm.requestSample}
                    onChange={(e) => setModalForm({ ...modalForm, requestSample: e.target.checked })}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-[#111111]">بازرسی کمی و کیفی شخص ثالث پیش از بارگیری (SGS) الزامی است</span>
                  <input
                    type="checkbox"
                    checked={modalForm.requireInspection}
                    onChange={(e) => setModalForm({ ...modalForm, requireInspection: e.target.checked })}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Supplier Picker */}
              <div>
                <label className="font-bold text-[#111111] block mb-1">
                  انتخاب تأمین‌کنندگان برای ارسال استعلام ({toPersianDigits(modalForm.selectedSupplierIds.length)} تأمین‌کننده):
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSuppliers.slice(0, 6).map((s) => {
                    const isSelected = modalForm.selectedSupplierIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setModalForm((prev) => ({
                            ...prev,
                            selectedSupplierIds: isSelected
                              ? prev.selectedSupplierIds.filter((id) => id !== s.id)
                              : [...prev.selectedSupplierIds, s.id],
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                          isSelected
                            ? 'bg-[#111111] text-white border-black'
                            : 'bg-[#F5F4EE] text-[#73726E] border-[#E5E3DC]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {s.name} ({s.country})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E3DC]">
                <button
                  type="button"
                  onClick={() => setIsNewRfqModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E5E3DC] text-[#73726E] hover:bg-[#F5F4EE]"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#111111] text-white font-bold hover:bg-black"
                >
                  تأیید و ارسال همزمان استعلام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
