import React from 'react';
import * as Icons from '../../icons/index';

export default function StatisticBlockShop({ data }) {
  // Dynamically get the Phosphor icon component
  const IconComponent = Icons[data.iconName] || Icons.List;

  // Determine badge styling based on type
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'action':
        return 'bg-error-bg text-error font-bold md:px-2 lg:px-3 xl:px-4 md:py-1 rounded-md text-[14px]';
      case 'urgent':
        return 'bg-error-bg text-error font-bold md:px-2 lg:px-3 xl:px-4 md:py-1 rounded-md text-[14px]';
      case 'positive':
        return 'bg-transparent text-primary-700 font-bold text-[14px]'; // Like +12% vs LY, purple text
      default:
        return 'hidden';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-[20px] p-6 border group cursor-default transition-all duration-300 hover:shadow-lg ${data.bgColor === 'bg-secondary-50' ? 'bg-secondary-50 border-secondary-200' : data.bgColor + ' border-transparent'}`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <h3 className={`text-[15px] font-medium md:mb-1 lg:mb-2 xl:mb-3 2xl:mb-4 ${data.textColor === 'text-white' ? 'text-primary-100' : 'text-secondary-500'}`}>
          {data.title}
        </h3>
        <div className="flex items-end justify-between">
          <div className={`lg:text-[30px] 2xl:text-[38px] leading-none font-extrabold ${data.textColor}`}>
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
        <div className="absolute -right-2.5 -bottom-5 opacity-20 pointer-events-none group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
          <IconComponent size={140} weight="fill" className={data.iconColor} />
        </div>
      )}
    </div>
  );
}
