"use client";

import React from "react";

interface StudioCardProps {
  title: string;
  subtitle?: string;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onToggleVisibility?: (v: boolean) => void;
  isVisible?: boolean;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  title,
  subtitle,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  isVisible = true,
  children,
  className = "",
  isActive = false,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border p-6 backdrop-blur-sm transition-all duration-500 ${
        isActive
          ? "border-brand-teal bg-white shadow-2xl shadow-brand-teal/5 dark:border-brand-teal/55 dark:bg-zinc-900/70 dark:shadow-[0_0_28px_rgba(0,123,128,0.18)]"
          : "border-outline-variant/25 bg-white/55 hover:border-brand-teal/35 hover:shadow-lg hover:shadow-brand-teal/5 dark:border-zinc-600/50 dark:bg-zinc-900/55 dark:hover:border-brand-teal/45"
      } ${!isVisible ? "opacity-55 grayscale-[0.35]" : ""} ${className}`}
    >
      <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
        {onDuplicate && (
          <button
            type="button"
            onClick={onDuplicate}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300/80 bg-white text-zinc-600 transition-all hover:border-brand-teal hover:text-brand-teal dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-300 dark:hover:border-[#7ee8ec] dark:hover:text-[#7ee8ec]"
            title="Duplicate"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-400/50 bg-white text-zinc-500 transition-all hover:border-rose-500/55 hover:bg-rose-500/10 hover:text-rose-600 dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-400 dark:hover:border-rose-400/60 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        )}
      </div>

      <div className="mb-6 max-w-[calc(100%-5rem)] pr-2">
        <h5 className="text-sm font-black uppercase leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
          {title || "Untitled entry"}
        </h5>
        {subtitle && (
          <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-brand-teal dark:text-[#7ee8ec]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-6">{children}</div>

      {onToggleVisibility && (
        <label className="mt-8 flex cursor-pointer select-none items-center gap-3 border-t border-outline-variant/15 pt-4 dark:border-zinc-600/60">
          <div
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
              isVisible
                ? "border-brand-teal bg-brand-teal dark:border-[#5ec4c9] dark:bg-[#007b80]"
                : "border-zinc-400 bg-white dark:border-zinc-500 dark:bg-zinc-800"
            }`}
          >
            {isVisible && (
              <span className="material-symbols-outlined text-[12px] font-bold text-white">
                check
              </span>
            )}
          </div>
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => onToggleVisibility(e.target.checked)}
            className="hidden"
          />
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-700 transition-colors group-hover:text-brand-teal dark:text-zinc-200 dark:group-hover:text-[#7ee8ec]">
            Show in resume
          </span>
        </label>
      )}
    </div>
  );
};
