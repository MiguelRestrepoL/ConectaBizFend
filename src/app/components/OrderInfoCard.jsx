// Componente para información de la orden
export default function OrderInfoCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}