import React from 'react';
import { PageHeader as CanonicalPageHeader } from './ui/page-header';

/**
 * @deprecated Use import { PageHeader } from '@/components/ui' instead.
 */
export default function PageHeader({ title, subtitle, breadcrumbs }) {
  // Legacy component maps subtitle to description.
  // Breadcrumbs might need to be rendered in actions or above if needed,
  // but for compatibility we'll just render it above or ignore if not heavily used,
  // or we can put it in a custom header if needed.
  // The canonical PageHeader accepts `title`, `description` and `actions`.
  
  return (
    <div className="mb-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="text-sm text-slate-500 mb-2">
          {breadcrumbs.map((bc, idx) => (
            <span key={bc.path ?? bc.label ?? idx}>
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
