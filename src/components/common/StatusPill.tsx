import React from 'react';
import { Sparkles } from 'lucide-react';

export type PillVariant = 'green' | 'neutral' | 'orange' | 'alert' | 'ai' | 'black';

interface StatusPillProps {
  label: string;
  variant?: PillVariant;
  showDot?: boolean;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  variant = 'neutral',
  showDot = true,
  className = '',
}) => {
  if (variant === 'ai') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F3F94A] text-[#111111] border border-[#E5E3DC] ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#111111]" strokeWidth={2} />
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'green') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#D5E8D4] text-[#2D7D32] border border-[#C2DEC0] ${className}`}
      >
        {showDot && <span className="w-2 h-2 rounded-full bg-[#2D7D32]" />}
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'orange') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F5DFCB] text-[#C05621] border border-[#ECD1BA] ${className}`}
      >
        {showDot && <span className="w-2 h-2 rounded-full bg-[#C05621]" />}
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'alert') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FDEBE6] text-[#C53030] border border-[#FADCD5] ${className}`}
      >
        {showDot && <span className="w-2 h-2 rounded-full bg-[#C53030]" />}
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'black') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#111111] text-white ${className}`}
      >
        {showDot && <span className="w-2 h-2 rounded-full bg-[#F3F94A]" />}
        <span>{label}</span>
      </span>
    );
  }

  // default neutral/brown
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E5E0D5] text-[#8C7355] border border-[#D8D2C5] ${className}`}
    >
      {showDot && <span className="w-2 h-2 rounded-full bg-[#8C7355]" />}
      <span>{label}</span>
    </span>
  );
};
