import React from 'react';
import { PurchaseDecision } from '../types';
import { CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface Props {
  decision?: PurchaseDecision;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DecisionBadge: React.FC<Props> = ({ decision, showIcon = true, size = 'md' }) => {
  if (!decision) return null;

  const configs = {
    [PurchaseDecision.BUY_NOW]: {
      label: 'BUY NOW',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 shrink-0 text-emerald-600" />
    },
    [PurchaseDecision.WAIT]: {
      label: 'WAIT FOR DROP',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 mr-1 shrink-0 text-amber-600" />
    },
    [PurchaseDecision.PRICE_INCREASE]: {
      label: 'RISING PRICE',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <TrendingUp className="w-3.5 h-3.5 mr-1 shrink-0 text-rose-600" />
    }
  };

  const config = configs[decision] || configs[PurchaseDecision.BUY_NOW];

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-xs font-bold'
  };

  return (
    <span className={`inline-flex items-center rounded-md border ${config.color} ${sizeStyles[size]}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default DecisionBadge;
