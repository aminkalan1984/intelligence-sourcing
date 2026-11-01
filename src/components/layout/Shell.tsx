import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShieldCheck,
  Scale,
  FileSpreadsheet,
  Globe,
  Activity,
  FileBarChart,
  Settings,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Plus,
  Send,
  Download,
  Check,
  Building2,
} from 'lucide-react';
import { PageId, MonitoringAlert, ProductSpec } from '../../types';
import { AlertsDrawer } from '../common/AlertsDrawer';
import { AiAssistantModal } from '../common/AiAssistantModal';
import { toPersianDigits } from '../../utils/formatters';

interface NavItemConfig {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: number;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { id: 'products', label: 'کالاها', icon: Package, badge: 3 },
  { id: 'suppliers', label: 'تأمین‌کنندگان', icon: Users, badge: 12 },
  { id: 'verification', label: 'اعتبارسنجی', icon: ShieldCheck },
  { id: 'comparison', label: 'مقایسه', icon: Scale, badge: 4 },
  { id: 'rfq', label: 'درخواست قیمت', icon: FileSpreadsheet, badge: 7 },
  { id: 'markets', label: 'بازارها', icon: Globe, badge: 6 },
  { id: 'monitoring', label: 'پایش', icon: Activity, badge: 2 },
  { id: 'reports', label: 'گزارش‌ها', icon: FileBarChart },
  { id: 'settings', label: 'تنظیمات', icon: Settings },
];

interface ShellProps {
  currentPage: PageId;
  onNavigate: (page: PageId, targetId?: string) => void;
  products: ProductSpec[];
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
  alerts: MonitoringAlert[];
  onTriggerPageCTA: (page: PageId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({
  currentPage,
  onNavigate,
  products,
  selectedProductId,
  onSelectProduct,
  alerts,
  onTriggerPageCTA,
  searchQuery,
  onSearchChange,
  children,
}) => {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [alertList, setAlertList] = useState<MonitoringAlert[]>(alerts);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const unreadAlertsCount = alertList.filter((a) => !a.read).length;

  const handleMarkAllAsRead = () => {
    setAlertList((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  // Page titles and descriptions
  const pageMeta: Record<PageId, { title: string; subtitle: string; ctaLabel: string; ctaIcon: any }> = {
    dashboard: {
      title: 'صبح بخیر، سارا',
      subtitle: 'خلاصه وضعیت زنجیره تأمین بین‌المللی و فرصت‌های بهینه‌سازی هزینه',
      ctaLabel: 'درخواست قیمت جدید',
      ctaIcon: Plus,
    },
    products: {
      title: 'کالاها و موتور تعریف اقلام تجاری',
      subtitle: 'ثبت و استانداردسازی مشخصات فنی کالا برای کشف دقیق تأمین‌کنندگان',
      ctaLabel: 'یافتن تأمین‌کننده',
      ctaIcon: Search,
    },
    suppliers: {
      title: 'فهرست جامع تأمین‌کنندگان بین‌المللی',
      subtitle: 'ارزیابی تولیدکنندگان مستقیم، کشف واسطه‌ها و رصد امتیاز اعتماد',
      ctaLabel: 'افزودن به درخواست قیمت',
      ctaIcon: Plus,
    },
    verification: {
      title: 'اعتبارسنجی و پروفایل چندلایه تأمین‌کننده',
      subtitle: 'بررسی مدارک ثبتی، بازرسی‌های فیزیکی کارخانه و گزارش‌های اعتباری',
      ctaLabel: 'درخواست نمونه',
      ctaIcon: Send,
    },
    comparison: {
      title: 'مقایسه هزینه نهایی (Landed Cost)',
      subtitle: 'محاسبه دقیق بهای تمام‌شده واحد کالا در بنادر مقصد با سناریوهای ریسک',
      ctaLabel: 'خروجی',
      ctaIcon: Download,
    },
    rfq: {
      title: 'مدیریت درخواست‌های قیمت (RFQs)',
      subtitle: 'پیگیری ارسال استعلام‌ها، نرخ پاسخ‌دهی و مذاکرات قیمت استاندارد',
      ctaLabel: 'ارسال یادآوری',
      ctaIcon: Send,
    },
    markets: {
      title: 'بازارهای جایگزین و فرصت‌های جهانی',
      subtitle: 'رصد جریان‌های صادراتی، مقایسه کشورها و شناسایی مسیرهای کم‌هزینه',
      ctaLabel: 'بررسی تأمین‌کنندگان',
      ctaIcon: Search,
    },
    monitoring: {
      title: 'پایش مستمر بازار و هشدارهای زنجیره تأمین',
      subtitle: 'سیگنال‌های هوشمند تغییر تعرفه، نرخ کرایه حمل و نوسان مواد اولیه',
      ctaLabel: 'پرونده پایش جدید',
      ctaIcon: Plus,
    },
    reports: {
      title: 'گزارش‌های جامع مدیریت خرید و واردات',
      subtitle: 'تحلیل صرفه‌جویی محقق‌شده، پراکندگی جغرافیایی و عملکرد تحویل',
      ctaLabel: 'دانلود PDF',
      ctaIcon: Download,
    },
    settings: {
      title: 'تنظیمات سامانه و قواعد وزن‌دهی',
      subtitle: 'مدیریت پروفایل بازرگانی، بنادر پیش‌فرض و شاخص‌های رتبه‌بندی',
      ctaLabel: 'ذخیره تغییرات',
      ctaIcon: Check,
    },
  };

  const currentMeta = pageMeta[currentPage];

  return (
    <div className="min-h-screen flex bg-[#ECEBE5] text-[#111111]" dir="rtl">
      {/* Sidebar on the RIGHT (260px wide, white) */}
      <aside className="w-[260px] shrink-0 bg-[#FFFFFF] border-l border-[#E5E3DC] flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
        {/* Top brand & navigation */}
        <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] flex items-center justify-center text-[#F3F94A] shrink-0 font-black text-xl">
              S
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-[#111111] leading-none flex items-center gap-1.5">
                <span>SourcingIQ</span>
                <span className="w-2 h-2 rounded-full bg-[#F3F94A]" />
              </div>
              <span className="text-[11px] text-[#73726E] font-medium">سورسینگ هوشمند B2B</span>
            </div>
          </div>

          {/* Company Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC] hover:border-[#111111] transition-colors text-right"
              aria-label="انتخاب شرکت بازرگانی"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-xl bg-[#FFFFFF] border border-[#E5E3DC] flex items-center justify-center shrink-0 text-[#111111]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#111111] truncate">اطلس واردات</div>
                  <div className="text-[10px] text-[#73726E] truncate">Atlas Imports LLC</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#73726E] shrink-0" />
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-[#E5E3DC] rounded-2xl p-2 shadow-lg z-40 space-y-1 text-xs">
                <button
                  onClick={() => setIsCompanyDropdownOpen(false)}
                  className="w-full text-right px-3 py-2 rounded-xl bg-[#F5F4EE] font-semibold text-[#111111] flex items-center justify-between"
                >
                  <span>اطلس واردات (فعال)</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsCompanyDropdownOpen(false)}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-[#F5F4EE] text-[#73726E]"
                >
                  <span>صنایع فولاد کاسپین</span>
                </button>
              </div>
            )}
          </div>

          {/* 10 Navigation Items */}
          <nav className="space-y-1.5 flex-1" aria-label="منوی اصلی">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#111111] text-white font-semibold'
                      : 'text-[#111111] hover:bg-[#F5F4EE] hover:text-[#111111]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-[#F3F94A] text-[#111111]'
                          : 'bg-[#F5F4EE] text-[#73726E]'
                      }`}
                    >
                      {toPersianDigits(item.badge)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Area: SourcingIQ AI Assistant & User Card */}
          <div className="pt-3 border-t border-[#E5E3DC] space-y-3">
            {/* AI Assistant Widget */}
            <div className="p-3 bg-[#F5F4EE] rounded-2xl border border-[#E5E3DC] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#F3F94A] flex items-center justify-center text-[#111111]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#111111]">SourcingIQ AI</span>
                </div>
                {/* Black toggle switch */}
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  aria-label="تغییر وضعیت هوش مصنوعی"
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                    aiEnabled ? 'bg-[#111111] justify-end' : 'bg-[#D0CEBE] justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white transition-all shadow-xs" />
                </button>
              </div>
              <p className="text-[11px] text-[#73726E] leading-tight">
                پایش لحظه‌ای نوسانات قیمت و کشف تأمین‌کنندگان جایگزین
              </p>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="w-full py-1.5 px-3 bg-white hover:bg-[#E5E3DC] text-[#111111] text-xs font-medium rounded-full border border-[#E5E3DC] transition-colors text-center"
              >
                گفت‌وگو با دستیار خرید
              </button>
            </div>

            {/* User Profile Card */}
            <div className="flex items-center gap-3 p-2 bg-[#FFFFFF] rounded-2xl border border-[#E5E3DC]">
              <div className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold shrink-0">
                سا
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#111111] truncate">سارا احمدی</div>
                <div className="text-[11px] text-[#73726E] truncate">مدیر خرید بازرگانی</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar on the canvas (no background, clean integration) */}
        <header className="px-8 pt-8 pb-4 flex items-center justify-between gap-6 flex-wrap">
          {/* Right side: Page Title & Subtitle */}
          <div>
            <h1 className="text-2xl font-black text-[#111111] tracking-tight leading-tight">
              {currentMeta.title}
            </h1>
            <p className="text-sm text-[#73726E] mt-0.5">{currentMeta.subtitle}</p>
          </div>

          {/* Left side: Search, Product Filter, Bell, Page CTA */}
          <div className="flex items-center gap-3">
            {/* Search Field */}
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#73726E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جست‌وجو در کالا، تأمین‌کننده، HS Code..."
                className="w-64 pl-4 pr-10 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E5E3DC] text-xs text-[#111111] placeholder:text-[#73726E] focus:outline-none focus:border-[#111111] transition-colors"
              />
            </div>

            {/* Product Filter Dropdown */}
            <select
              value={selectedProductId}
              onChange={(e) => onSelectProduct(e.target.value)}
              className="py-2.5 px-4 rounded-full bg-[#FFFFFF] border border-[#E5E3DC] text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111] transition-colors cursor-pointer"
              aria-label="فیلتر کالا"
            >
              <option value="all">همه کالاهای تحت پایش (۳ کالا)</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.split(' (')[0]} ({p.hsCode})
                </option>
              ))}
            </select>

            {/* Notification Bell */}
            <button
              onClick={() => setIsAlertsOpen(true)}
              className="relative w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E5E3DC] flex items-center justify-center text-[#111111] hover:bg-[#F5F4EE] transition-colors"
              aria-label="نمایش هشدارها"
            >
              <Bell className="w-4 h-4" strokeWidth={1.5} />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C53030] ring-2 ring-white" />
              )}
            </button>

            {/* Primary Page CTA Pill */}
            <button
              onClick={() => onTriggerPageCTA(currentPage)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black font-semibold text-xs tracking-tight transition-all duration-200 active:scale-95"
            >
              <currentMeta.ctaIcon className="w-3.5 h-3.5 text-[#F3F94A]" strokeWidth={2} />
              <span>{currentMeta.ctaLabel}</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 px-8 pb-10">{children}</main>
      </div>

      {/* Alerts Slide-over Drawer */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alertList}
        onNavigateToAlert={(page, id) => {
          onNavigate(page, id);
        }}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* SourcingIQ AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onNavigate={(page, id) => {
          onNavigate(page, id);
        }}
      />
    </div>
  );
};
