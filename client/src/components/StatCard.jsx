export default function StatCard({ title, value, trend, trendDirection }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <span className={`text-sm font-medium ${trendDirection === 'down' ? 'text-red-600' : 'text-green-600'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
