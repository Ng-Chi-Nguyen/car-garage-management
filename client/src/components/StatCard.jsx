import React from 'react';
import { StatCard as CanonicalStatCard } from './ui/stat-card';

/**
 * @deprecated Use import { StatCard } from '@/components/ui' instead.
 */
export default function StatCard({ title, value, trend, trendDirection }) {
  // Legacy component uses trendDirection 'down' or 'up'.
  // Canonical component uses trendUp boolean or parses from trend value.
  const trendUp = trendDirection !== 'down';
  
  return (
    <CanonicalStatCard 
      title={title} 
      value={value} 
      trend={trend} 
      trendUp={trendUp} 
    />
  );
}
