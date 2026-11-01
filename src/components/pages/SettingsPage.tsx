import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Users,
  Anchor,
  Sliders,
  Bell,
  Save,
  Check,
  Plus,
  Trash2,
  Shield,
} from 'lucide-react';
import { RankingWeights } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface SettingsPageProps {
  rankingWeights: RankingWeights;
  onUpdateWeights: (weights: RankingWeights) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  rankingWeights,
  onUpdateWeights,
  onShowToast,
}) => {
  // Company Profile Form
  const [companyData, setCompanyData] = useState({
    nameFa: 'شرکت بازرگانی بین‌المللی اطلس واردات',
    nameEn: 'Atlas Imports Global LLC',
    nationalId: '۱۰۱۰۳۴۸۵۹۲۰',
    registrationNumber: '۴۸۳۹۲',
    defaultPort: 'مجتمع بندری شهید رجایی (بندر عباس)',
    defaultIncoterm: 'CIF',
    defaultCurrency: 'USD (دلار آمریکا)',
    address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، برج سرو، طبقه ۸',
  });

  // Default Destination Ports
  const [destinationPorts, setDestinationPorts] = useState([
    { id: '1', name: 'مجتمع بندری شهید رجایی (بندر عباس)', code: 'IRBND', type: 'دریایی کانتینری', default: true },
    { id: '2', name: 'بندر امام خمینی (BIK)', code: 'IRBKM', type: 'دریایی فله و عمومی', default: false },
    { id: '3', name: 'گمرک بازرگان (مرز ترکیه)', code: 'IRBAZ', type: 'زمینی ترانزیتی', default: false },
    { id: '4', name: 'گمرک فرودگاه امام خمینی', code: 'IRIKA', type: 'هوایی کارگو', default: false },
  ]);

  // Ranking Weights local state
  const [weights, setWeights] = useState<RankingWeights>(rankingWeights);

  // Team Members
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'سارا احمدی', role: 'مدیر خرید و بازرگانی خارجی', email: 'sara@atlas.ir', access: 'مدیر کل (Admin)' },
    { id: '2', name: 'کامران علوی', role: 'کارشناس ارشد ترخیص و لجستیک', email: 'kamran@atlas.ir', access: 'ویرایشگر' },
    { id: '3', name: 'مریم فیاض', role: 'حسابدار ارشد ارزی و LC', email: 'maryam@atlas.ir', access: 'مشاهده‌کننده' },
  ]);

  const handleWeightChange = (key: keyof RankingWeights, val: number) => {
    const updated = { ...weights, [key]: val };
    setWeights(updated);
    onUpdateWeights(updated);
  };

  const handleSaveAll = () => {
    onShowToast('تمامی تنظیمات و پروفایل با موفقیت در سامانه ذخیره شدند', 'تغییرات در محاسبات آینده اعمال خواهد شد', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Save Bar */}
      <section className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3DC] flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-[#111111]">تنظیمات عمومی سامانه و پیکربندی شرکت</h2>
          <p className="text-xs text-[#73726E] mt-0.5">
            مدیریت هویت بازرگانی، بنادر تخلیه پیش‌فرض، قواعد رتبه‌بندی وزنی و دسترسی اعضای تیم
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-2.5 rounded-full bg-[#111111] text-white hover:bg-black font-semibold text-xs transition-all flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5 text-[#F3F94A]" />
          <span>ذخیره تغییرات</span>
        </button>
      </section>

      {/* Company Profile Form */}
      <section className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E5E3DC] pb-3">
          <Building2 className="w-5 h-5 text-[#111111]" />
          <h3 className="text-base font-bold text-[#111111]">مشخصات رسمی شرکت بازرگانی</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#111111]">نام رسمی فارسی شرکت</label>
            <input
              type="text"
              value={companyData.nameFa}
              onChange={(e) => setCompanyData({ ...companyData, nameFa: e.target.value })}
              className="w-full px-4 py-2.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111]">نام انگلیسی برای اسناد بین‌المللی</label>
            <input
              type="text"
              value={companyData.nameEn}
              onChange={(e) => setCompanyData({ ...companyData, nameEn: e.target.value })}
              className="w-full px-4 py-2.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-left font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111]">شناسه ملی شرکت</label>
            <input
              type="text"
              value={companyData.nationalId}
              onChange={(e) => setCompanyData({ ...companyData, nationalId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-left font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111]">شماره ثبت تجاری</label>
            <input
              type="text"
              value={companyData.registrationNumber}
              onChange={(e) => setCompanyData({ ...companyData, registrationNumber: e.target.value })}
              className="w-full px-4 py-2.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-left font-mono"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="font-bold text-[#111111]">نشانی دفتر مرکزی و امور بازرگانی</label>
            <input
              type="text"
              value={companyData.address}
              onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC]"
            />
          </div>
        </div>
      </section>

      {/* Destination Ports & Customs Offices */}
      <section className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-[#111111]" />
            <h3 className="text-base font-bold text-[#111111]">بنادر مقصد و گمرکات ترخیص کالا</h3>
          </div>
          <button
            onClick={() => onShowToast('فرم ثبت بندر مقصد جدید باز شد', '', 'info')}
            className="px-3.5 py-1.5 rounded-full bg-[#F5F4EE] hover:bg-[#E5E3DC] text-xs font-bold text-[#111111] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن بندر جدید</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {destinationPorts.map((port) => (
            <div
              key={port.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                port.default
                  ? 'bg-[#FDFDE8] border-[#F3F94A]'
                  : 'bg-[#F5F4EE] border-[#E5E3DC]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111111]">{port.name}</span>
                  {port.default && (
                    <span className="px-2 py-0.5 rounded-full bg-[#111111] text-[#F3F94A] text-[10px] font-bold">
                      بندر پیش‌فرض
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#73726E] mt-0.5">
                  کد بندر: <span className="font-mono">{port.code}</span> | {port.type}
                </div>
              </div>

              {!port.default && (
                <button
                  onClick={() => {
                    setDestinationPorts((prev) =>
                      prev.map((p) => ({ ...p, default: p.id === port.id }))
                    );
                    onShowToast(`بندر ${port.name} به عنوان بندر پیش‌فرض انتخاب شد`, '', 'success');
                  }}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#E5E3DC] border border-[#E5E3DC] text-[11px] font-semibold"
                >
                  تنظیم پیش‌فرض
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Default Ranking Weights Slider Sync */}
      <section className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#111111]" />
            <h3 className="text-base font-bold text-[#111111]">
              قواعد و اوزان پیش‌فرض رتبه‌بندی تأمین‌کنندگان (Ranking Rules)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#73726E]">
            مجموع اوزان: ۱۰۰٪
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'landedCost', label: 'هزینه نهایی (Landed Cost)', val: weights.landedCost },
            { key: 'trustScore', label: 'امتیاز اعتبار و ممیزی', val: weights.trustScore },
            { key: 'quality', label: 'کیفیت و استاندارد', val: weights.quality },
            { key: 'capacity', label: 'ظرفیت تولید ماهانه', val: weights.capacity },
            { key: 'leadTime', label: 'زمان تحویل سفارش', val: weights.leadTime },
            { key: 'paymentTerms', label: 'شرایط پرداخت و LC', val: weights.paymentTerms },
            { key: 'countryRisk', label: 'امنیت سیاسی کشور مبدأ', val: weights.countryRisk },
            { key: 'responsiveness', label: 'سرعت پاسخگویی تأمین‌کننده', val: weights.responsiveness },
          ].map((item) => (
            <div key={item.key} className="p-3.5 rounded-2xl bg-[#F5F4EE] border border-[#E5E3DC]">
              <div className="flex justify-between text-xs font-bold text-[#111111] mb-2">
                <span className="truncate pl-1">{item.label}</span>
                <span className="bg-white px-2 py-0.5 rounded-full border border-[#E5E3DC] shrink-0">
                  {toPersianDigits(item.val)}٪
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={item.val}
                onChange={(e) => handleWeightChange(item.key as any, Number(e.target.value))}
                className="w-full accent-[#111111] cursor-pointer"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Team Members & Roles */}
      <section className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E3DC] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#111111]" />
            <h3 className="text-base font-bold text-[#111111]">اعضای تیم خرید و سطوح دسترسی</h3>
          </div>
          <button
            onClick={() => onShowToast('دعوت‌نامه برای همکار جدید ارسال شد', '', 'info')}
            className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#F3F94A]" />
            <span>دعوت از عضو جدید</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F4EE] border-b border-[#E5E3DC] text-[11px] font-bold text-[#73726E]">
                <th className="py-2.5 px-4">نام و نام خانوادگی</th>
                <th className="py-2.5 px-4">عنوان سازمانی</th>
                <th className="py-2.5 px-4">ایمیل</th>
                <th className="py-2.5 px-4">سطح دسترسی</th>
                <th className="py-2.5 px-4 text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {teamMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[#F5F4EE]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#111111]">{m.name}</td>
                  <td className="py-3 px-4 text-[#73726E]">{m.role}</td>
                  <td className="py-3 px-4 font-mono">{m.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F5F4EE] border border-[#E5E3DC] text-[11px] font-semibold">
                      {m.access}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[#2D7D32] font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-[#2D7D32]" />
                      فعال
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
