import React from 'react';
import { PageHeader as CanonicalPageHeader } from './ui/page-header';

/**
 * @deprecated Use import { PageHeader } from '@/components/ui' instead.
 */
export default function PageHeader({ title, subtitle, breadcrumbs }) {
  return (
    <div className="mb-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="text-sm text-slate-500 mb-2">
          {breadcrumbs.map((bc, idx) => (
            <span key={`${bc.path ?? 'breadcrumb'}:${bc.label ?? 'item'}:${idx}`}>
              {idx > 0 && <span className="mx-2">/</span>}
              {bc.label}
            </span>
          ))}
        </nav>
      )}
      <CanonicalPageHeader title={title} description={subtitle} />
    </div>
  );
}
