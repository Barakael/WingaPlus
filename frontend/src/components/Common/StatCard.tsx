import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'gray-100',
    green: 'gray-100',
    purple: 'gray-100',
    orange: 'gray-100',
    red: 'red-200',
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 bg-${colorClasses[color]} dark:bg-gray-700 rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-[#1973AE]"/>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
