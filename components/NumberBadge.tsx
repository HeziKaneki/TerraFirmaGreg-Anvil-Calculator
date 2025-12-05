import React from 'react';
import { HITS } from '../types';

interface NumberBadgeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  isHit?: boolean;
}

export const NumberBadge: React.FC<NumberBadgeProps> = ({ value, size = 'md', isHit }) => {
  const isHitValue = HITS.includes(value);
  const isPositive = value > 0;
  
  // Explicitly passing isHit prop overrides the check, otherwise check if it's in HIT array
  const showAsHit = isHit !== undefined ? isHit : isHitValue;

  let baseClasses = "font-mono font-bold rounded shadow-sm flex items-center justify-center border transition-all";
  let sizeClasses = "";
  
  switch(size) {
    case 'sm': sizeClasses = "w-8 h-8 text-xs"; break;
    case 'md': sizeClasses = "w-10 h-10 text-sm"; break;
    case 'lg': sizeClasses = "w-14 h-14 text-lg"; break;
  }

  let colorClasses = "";
  if (showAsHit) {
    colorClasses = "bg-rose-100 text-rose-700 border-rose-200";
  } else if (isPositive) {
    colorClasses = "bg-emerald-100 text-emerald-700 border-emerald-200";
  } else {
    colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
  }

  return (
    <div className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {value > 0 ? '+' : ''}{value}
    </div>
  );
};
