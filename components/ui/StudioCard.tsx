"use client";

import React from 'react';

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
  isActive = false
}) => {
  return (
    <div className={`relative p-6 rounded-[1.5rem] border transition-all duration-500 overflow-hidden group ${
      isActive 
      ? 'bg-white border-brand-teal shadow-2xl shadow-brand-teal/5' 
      : 'bg-white/40 border-outline-variant/20 hover:border-brand-teal/30 hover:shadow-xl hover:shadow-brand-teal/5'
    } ${!isVisible ? 'opacity-50 grayscale-[0.5]' : ''} ${className}`}>
      
      {/* Action Toolbar */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        {onDuplicate && (
          <button 
            onClick={onDuplicate}
            className="w-8 h-8 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-brand-teal hover:border-brand-teal transition-all"
            title="Duplicate"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete}
            className="w-8 h-8 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-all"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        )}
      </div>

      <div className="mb-6">
        <h5 className="text-sm font-black text-on-surface tracking-tight uppercase">{title || "Untitled Entry"}</h5>
        {subtitle && <p className="text-[10px] font-black tracking-widest text-brand-teal uppercase mt-1 opacity-70">{subtitle}</p>}
      </div>

      <div className="space-y-6">
        {children}
      </div>

      {/* Visibility Toggle Footer */}
      {onToggleVisibility && (
        <label className="mt-8 pt-4 border-t border-outline-variant/10 flex items-center gap-3 cursor-pointer select-none">
           <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isVisible ? 'bg-brand-teal border-brand-teal' : 'bg-white border-outline-variant/30'}`}>
              {isVisible && <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>}
           </div>
           <input 
             type="checkbox" 
             checked={isVisible}
             onChange={(e) => onToggleVisibility(e.target.checked)}
             className="hidden"
           />
           <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 group-hover:text-brand-teal transition-colors">Show in Resume</span>
        </label>
      )}
    </div>
  );
};
