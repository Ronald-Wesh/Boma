import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '../../lib/utils';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon: Icon, 
  className,
  loading = false,
  subtitle,
  trend
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatValue = (val) => {
    if (loading) return '---';
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group glass",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : (
              <span className="gradient-text">{formatValue(value)}</span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          
          {change && (
            <div className="flex items-center space-x-1">
              <span className={cn("text-xs font-medium", getChangeColor(changeType))}>
                {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}{Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground">from last period</span>
            </div>
          )}
          
          {trend && (
            <div className="mt-2">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    changeType === 'positive' ? 'bg-green-500' : 
                    changeType === 'negative' ? 'bg-red-500' : 'bg-primary'
                  )}
                  style={{ width: `${Math.min(Math.abs(trend), 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { StatCard };