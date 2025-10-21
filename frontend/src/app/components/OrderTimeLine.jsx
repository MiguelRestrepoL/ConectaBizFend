import { Package, Clock, CheckCircle, Truck, Calendar, DollarSign, FileText, User } from 'lucide-react';

export default function OrderTimeline({ estado }) {
  const steps = [
    { key: 'preparando', label: 'Preparando', icon: <Clock className="w-5 h-5" /> },
    { key: 'enviado', label: 'Enviado', icon: <Truck className="w-5 h-5" /> },
    { key: 'entregado', label: 'Entregado', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const currentIndex = steps.findIndex(step => step.key === estado);

  return (
    <div className="flex items-center justify-between relative px-4">
      <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10 mx-8"></div>
      <div 
        className="absolute top-6 left-0 h-1 bg-blue-500 -z-10 transition-all duration-500 mx-8"
        style={{ width: currentIndex >= 0 ? `${(currentIndex / (steps.length - 1)) * 100}%` : '0%' }}
      ></div>
      
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={step.key} className="flex flex-col items-center gap-2 bg-white z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
              isCompleted 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'bg-white border-gray-300 text-gray-400'
            } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}>
              {step.icon}
            </div>
            <span className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}