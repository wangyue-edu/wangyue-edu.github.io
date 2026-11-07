import React from 'react';
import { AwardTier } from '../types';
import { Trophy, Medal, Award } from 'lucide-react';

interface AwardBadgeProps {
  tier: AwardTier;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AwardBadge: React.FC<AwardBadgeProps> = ({ tier, label, size = 'md' }) => {
  let badgeStyle = '';
  let Icon = Award;
  let text = label || '申报项目';

  // Highlight hierarchy:
  // 1. “凌绝望岳” -> Primary Highlight
  // 2. “坚韧登岳” -> Secondary
  // 3. All other labels -> Plain Show
  const isFirst = (label && label.includes('凌绝望岳')) || tier === 'first';
  const isSecond = (label && label.includes('坚韧登岳')) || tier === 'second';

  if (isFirst) {
    // Primary highlight: gold gradient / amber badge with trophy
    badgeStyle = 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 font-bold shadow-xs';
    Icon = Trophy;
    text = label || '凌绝望岳';
  } else if (isSecond) {
    // Secondary: calm, elegant blue badge with medal
    badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
    Icon = Medal;
    text = label || '坚韧登岳';
  } else {
    // Plain show: neutral, muted gray style for all other awards
    badgeStyle = 'bg-slate-100/70 text-slate-500 border-slate-200/80 font-normal';
    Icon = Award;
    text = label || '申报项目';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide transition-colors ${badgeStyle} ${sizeClasses}`}
    >
      <Icon size={iconSizes} className="shrink-0" />
      <span>{text}</span>
    </span>
  );
};
