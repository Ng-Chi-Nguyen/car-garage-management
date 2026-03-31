import React from 'react';
import { SectionCard as CanonicalSectionCard } from './ui/section-card';

/**
 * @deprecated Use import { SectionCard } from '@/components/ui' instead.
 */
export default function SectionCard({ title, children }) {
  return (
    <CanonicalSectionCard title={title}>
      {children}
    </CanonicalSectionCard>
  );
}
