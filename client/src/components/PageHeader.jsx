export default function PageHeader({ title, subtitle, breadcrumbs }) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="text-sm text-gray-500 mb-2">
          {breadcrumbs.map((bc, idx) => (
            <span key={idx}>
              {idx > 0 && <span className="mx-2">/</span>}
              {bc.label}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
