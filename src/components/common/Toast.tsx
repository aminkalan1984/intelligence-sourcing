import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-[#FFFFFF] border border-[#E5E3DC] rounded-2xl shadow-none transition-all duration-300 animate-slide-up"
        >
          {toast.type === 'success' && (
            <div className="w-8 h-8 rounded-full bg-[#D5E8D4] text-[#2D7D32] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-8 h-8 rounded-full bg-[#F3F94A] text-[#111111] flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-8 h-8 rounded-full bg-[#F5DFCB] text-[#C05621] flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}

          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#111111] leading-tight">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-[#73726E] mt-1 leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#73726E] hover:text-[#111111] p-1 rounded-full transition-colors"
            aria-label="بستن پیام"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
