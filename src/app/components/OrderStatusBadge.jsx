import { Package, Clock, CheckCircle, Truck, Calendar, DollarSign, FileText, User } from 'lucide-react';

// Componente para el estado de la orden
export default function OrderStatusBadge({ estado }) {
  const statusConfig = {
    preparando: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: <Clock className="w-4 h-4" />,
      label: 'Preparando'
    },
    enviado: {
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Truck className="w-4 h-4" />,
      label: 'Enviado'
    },
    entregado: {
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Entregado'
    }
  };

  const config = statusConfig[estado] || statusConfig.preparando;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${config.color}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}