import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Bot, ArrowRight } from 'lucide-react';
import { PageId } from '../../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId, targetId?: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<
    Array<{ sender: 'ai' | 'user'; text: string; action?: { label: string; page: PageId; id?: string } }>
  >([
    {
      sender: 'ai',
      text: 'سلام سارا، من دستیار هوشمند SourcingIQ هستم. بر اساس تحلیل داده‌های بازار امروز، شرکت Hanoi Steel Works در ویتنام با قیمت ۶۸۵ دلار و زمان تحویل ۲۸ روزه بهترین صرفه‌جویی را نسبت به چین ارائه می‌دهد. می‌خواهید پروفایل اعتبارسنجی آن را بررسی کنید؟',
      action: {
        label: 'مشاهده پروفایل اعتبارسنجی Hanoi Steel',
        page: 'verification',
        id: 'hanoi-steel',
      },
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      let reply = 'درخواست شما پردازش شد. داده‌های مربوطه در ماژول مقایسه هزینه نهایی به‌روزرسانی شدند.';
      let action: { label: string; page: PageId; id?: string } | undefined;

      if (userText.includes('قیمت') || userText.includes('مقایسه') || userText.includes('هزینه')) {
        reply = 'در سناریوی پایه، هزینه نهایی ویتنام ۷۹۲٫۷ دلار بر تن است در حالی که چین ۷۸۲٫۵ دلار است ولی ریسک کیفی و حمل دریایی ویتنام ۳۵٪ کمتر ارزیابی شده است.';
        action = { label: 'انتقال به جدول مقایسه هزینه نهایی', page: 'comparison' };
      } else if (userText.includes('تأمین') || userText.includes('تولیدکننده')) {
        reply = 'در حال حاضر ۱۲ تأمین‌کننده در فهرست رصد شما وجود دارد که ۹ شرکت تولیدکننده مستقیم و ۱ شرکت به دلیل ریسک شرکت کاغذی نشانه‌گذاری شده است.';
        action = { label: 'مشاهده فهرست تأمین‌کنندگان', page: 'suppliers' };
      } else if (userText.includes('استعلام') || userText.includes('rfq')) {
        reply = 'در استعلام RFQ-0142، تا این لحظه ۵ پاسخ از ۸ تأمین‌کننده دریافت شده و ۳ تأمین‌کننده برای مذاکره نهایی پیشنهاد شده‌اند.';
        action = { label: 'مشاهده وضعیت RFQ-0142', page: 'rfq' };
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply, action }]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] w-full max-w-xl rounded-3xl border border-[#E5E3DC] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between bg-[#F5F4EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3F94A] flex items-center justify-center text-[#111111]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#111111]">دستیار هوشمند SourcingIQ AI</h3>
                <span className="text-[11px] bg-[#111111] text-[#F3F94A] px-2 py-0.5 rounded-full font-bold">
                  فعال
                </span>
              </div>
              <p className="text-xs text-[#73726E]">
                تحلیلگر ریسک زنجیره تأمین بین‌المللی و بهینه‌سازی قیمت Landed Cost
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E5E3DC] flex items-center justify-center text-[#73726E] hover:text-[#111111]"
            aria-label="بستن پنجره هوش مصنوعی"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#111111] text-white rounded-br-none'
                    : 'bg-[#F5F4EE] text-[#111111] border border-[#E5E3DC] rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.action && (
                <button
                  onClick={() => {
                    onNavigate(msg.action!.page, msg.action!.id);
                    onClose();
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#F3F94A] hover:bg-[#ebf230] text-[#111111] text-xs font-bold rounded-full border border-[#E5E3DC] transition-all"
                >
                  <span>{msg.action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#E5E3DC] bg-[#FFFFFF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="از هوش مصنوعی بپرسید... (مثلاً: وضعیت قیمت ویتنام چطور است؟)"
              className="flex-1 px-4 py-2.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-sm text-[#111111] placeholder:text-[#73726E] focus:outline-none focus:border-[#111111]"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0"
              aria-label="ارسال پیام"
            >
              <Send className="w-4 h-4 -scale-x-100" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-[#73726E]">
            <CheckCircle2 className="w-3 h-3 text-[#2D7D32]" />
            <span>مدل تحلیلی متصل به استعلام‌های فعال و تعرفه‌های گمرکی ۱۴۰۳/۲۰۲۶</span>
          </div>
        </div>
      </div>
    </div>
  );
};
