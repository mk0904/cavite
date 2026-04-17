"use client";

import React from 'react';

interface StudioInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  isTextArea?: boolean;
}

export const StudioInput: React.FC<StudioInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  isTextArea = false
}) => {
  const Component = isTextArea ? 'textarea' : 'input';

  return (
    <div className={`relative group ${className}`}>
      {/* Label sitting on the border */}
      <label className="absolute -top-2 left-4 px-2 text-[9px] font-black tracking-[0.2em] uppercase text-brand-teal bg-white/90 backdrop-blur-sm rounded-full z-10 transition-all group-focus-within:text-brand-teal group-focus-within:scale-105 origin-left pointer-events-none opacity-60 group-focus-within:opacity-100">
        {label}
      </label>
      
      <Component
        type={type}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label}...`}
        rows={isTextArea ? 4 : undefined}
        className={`w-full bg-white/40 border border-outline-variant/30 rounded-xl px-5 ${isTextArea ? 'py-4' : 'h-12'} text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/20 focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal focus:bg-white/80 transition-all outline-none resize-none`}
      />
    </div>
  );
};
