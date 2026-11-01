import React from 'react';

interface HatchedBarProps {
  value: number; // 0 to 100 percentage
  label?: string;
  sublabel?: string;
  isActive?: boolean;
  activeColor?: 'yellow' | 'black';
  height?: string;
  className?: string;
}

export const HatchedProgressBar: React.FC<HatchedBarProps> = ({
  value,
  label,
  sublabel,
  isActive = false,
  activeColor = 'yellow',
  height = 'h-3.5',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {(label || sublabel) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          {label && <span className="text-[#111111]">{label}</span>}
          {sublabel && <span className="text-[#73726E]">{sublabel}</span>}
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-[#E5E3DC] p-0.5 overflow-hidden flex`}>
        <div
          style={{ width: `${clamped}%` }}
          className={`h-full rounded-full transition-all duration-300 ${
            isActive
              ? activeColor === 'yellow'
                ? 'bg-[#F3F94A]'
                : 'bg-[#111111]'
              : 'bg-hatched-pattern bg-[#F5F4EE]'
          }`}
        />
      </div>
    </div>
  );
};

interface HatchedFunnelStepProps {
  title: string;
  count: string;
  percentage?: string;
  isKey?: boolean;
}

export const HatchedFunnelStep: React.FC<HatchedFunnelStepProps> = ({
  title,
  count,
  percentage,
  isKey = false,
}) => {
  return (
    <div
      className={`relative flex-1 px-4 py-3.5 rounded-full border border-[#E5E3DC] flex items-center justify-between transition-all ${
        isKey
          ? 'bg-[#F3F94A] text-[#111111] font-bold shadow-none'
          : 'bg-hatched-pattern bg-[#FFFFFF] text-[#111111]'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{title}</span>
        {percentage && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isKey ? 'bg-black/10 text-black' : 'bg-[#E5E0D5] text-[#8C7355]'
            }`}
          >
            {percentage}
          </span>
        )}
      </div>
      <span className="text-lg font-black tracking-tight">{count}</span>
    </div>
  );
};
