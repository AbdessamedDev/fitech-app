import React from 'react';
import * as Icons from '../../icons/index';

export default function StatisticBlockShop({ data }) {
  // Dynamically get the Phosphor icon component
  const IconComponent = Icons[data.iconName] || Icons.List;

  // Determine badge styling based on type
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'action':
        return 'bg-error-bg text-error font-medium px-2 py-1 rounded-md text-xs';
      case 'urgent':
        return 'bg-error-bg text-error font-medium px-2 py-1 rounded-md text-xs';
      case 'positive':
        return 'bg-transparent text-primary-600 font-medium text-xs'; // Like +12% vs LY, purple text
      default:
        return 'hidden';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl p-5 border border-border-light group cursor-default transition-all duration-300 hover:shadow-md ${data.bgColor}`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <h3 className={`text-sm font-medium mb-3 ${data.textColor === 'text-white' ? 'text-white/90' : 'text-secondary-500'}`}>
          {data.title}
        </h3>
        <div className="flex items-end justify-between">
          <div className={`text-3xl font-bold ${data.textColor}`}>
            {data.value}
          </div>
          {data.badgeText && (
            <div className={getBadgeStyle(data.badgeType)}>
              {data.badgeText}
            </div>
          )}
        </div>
      </div>
      
      {data.hasBgIcon && (
        <div className="absolute right-[-10px] bottom-[-20px] opacity-20 pointer-events-none group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
          <IconComponent size={120} weight="fill" className={data.iconColor} />
        </div>
      )}
    </div>
  );
}
