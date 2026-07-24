
import React from 'react';
import { PurchaseDecision } from '../types';

interface Props {
  decision: PurchaseDecision;
}

const DecisionBadge: React.FC<Props> = ({ decision }) => {
  const configs = {
    [PurchaseDecision.BUY_NOW]: {
      label: 'Buy Now',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    [PurchaseDecision.WAIT]: {
      label: 'Wait for Drop',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    [PurchaseDecision.PRICE_INCREASE]: {
      label: 'Rising Price',
      color: 'bg-rose-100 text-rose-700 border-rose-200',
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  };

  const config = configs[decision];

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.color}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

export default DecisionBadge;
