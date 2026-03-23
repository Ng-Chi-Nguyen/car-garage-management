export default function SectionCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {title && <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>}
      {children}
    </div>
  );
}
