"use client";

import React from "react";

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
  isTextArea = false,
}) => {
  const Component = isTextArea ? "textarea" : "input";

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-[9px] font-black uppercase leading-snug tracking-[0.12em] text-brand-teal dark:text-[#7ee8ec]">
        {label}
      </label>
      <Component
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder || `Enter ${label.toLowerCase()}…`}
        rows={isTextArea ? 4 : undefined}
        className={`w-full resize-none rounded-xl border border-outline-variant/30 bg-white/70 px-4 text-sm font-semibold text-zinc-900 outline-none transition-all placeholder:text-zinc-500 focus:border-brand-teal focus:bg-white focus:text-zinc-900 focus:ring-2 focus:ring-brand-teal/15 dark:border-zinc-500/50 dark:bg-zinc-900/90 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-[#5ec4c9] dark:focus:bg-zinc-950 dark:focus:text-zinc-100 dark:focus:ring-[#5ec4c9]/25 dark:focus:placeholder:text-zinc-500 ${
          isTextArea ? "min-h-[6rem] py-3" : "h-11 py-2"
        }`}
      />
    </div>
  );
};
