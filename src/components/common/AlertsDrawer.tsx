import React from 'react';
import { X, Bell, ExternalLink, Sparkles } from 'lucide-react';
import { MonitoringAlert, PageId } from '../../types';
import { StatusPill } from './StatusPill';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MonitoringAlert[];
  onNavigateToAlert: (targetPage: PageId, targetId?: string) => void;
  onMarkAllAsRead: () => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onNavigateToAlert,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="alerts-title">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-md w-full bg-[#FFFFFF] shadow-2xl flex flex-col z-10 border-r border-[#E5E3DC]">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E3DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F3F94A] flex items-center justify-center text-[#111111]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 id="alerts-title" className="text-lg font-bold text-[#111111]">
                هشدارهای هوشمند پایش
              </h2>
              <p className="text-xs text-[#73726E]">
                {unreadCount > 0 ? `${unreadCount} اعلان خوانده نشده` : 'تمام هشدارها بررسی شده‌اند'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F5F4EE] hover:bg-[#E5E3DC] flex items-center justify-center text-[#111111] transition-colors"
            aria-label="بستن پنل هشدارها"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick action bar */}
        <div className="px-6 py-3 bg-[#F5F4EE] border-b border-[#E5E3DC] flex items-center justify-between text-xs">
          <span className="text-[#73726E]">به‌روزرسانی خودکار سیگنال‌های بازار جهانی</span>
          <button
            onClick={onMarkAllAsRead}
            className="font-medium text-[#111111] hover:underline"
          >
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all ${
                alert.isFeatured
                  ? 'bg-[#FDFDE8] border-[#F3F94A]'
                  : alert.read
                  ? 'bg-[#FFFFFF] border-[#E5E3DC]'
                  : 'bg-[#F5F4EE] border-[#E5E3DC]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusPill
                    label={alert.type}
                    variant={alert.isFeatured ? 'ai' : 'neutral'}
                  />
                  {alert.country && (
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-[#E5E3DC] text-[#73726E]">
                      {alert.country}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#73726E] shrink-0">{alert.time}</span>
              </div>

              <h4 className="text-sm font-bold text-[#111111] mb-1.5">{alert.title}</h4>
              <p className="text-xs text-[#73726E] leading-relaxed mb-3">{alert.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-[#E5E3DC]">
                <span className="text-[11px] text-[#73726E]">{alert.productName}</span>
                <button
                  onClick={() => {
                    onNavigateToAlert(alert.targetPage, alert.targetId);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] text-[#FFFFFF] hover:bg-black text-xs font-semibold transition-colors"
                >
                  <span>بررسی</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
