import React from 'react';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title = "Información", 
  message = "Operación completada", 
  buttonText = "Entendido",
  type = "info", // info, success, warning, error
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonClass: "bg-green-600 hover:bg-green-700 text-white",
          iconBgClass: "bg-green-100"
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          buttonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
          iconBgClass: "bg-yellow-100"
        };
      case 'error':
        return {
          icon: (
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonClass: "bg-red-600 hover:bg-red-700 text-white",
          iconBgClass: "bg-red-100"
        };
      default: // info
        return {
          icon: (
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
          iconBgClass: "bg-blue-100"
        };
    }
  };

  const { icon, buttonClass, iconBgClass } = getIconAndColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6 text-center">
          {/* Icon */}
          <div className={`mx-auto w-16 h-16 rounded-full ${iconBgClass} flex items-center justify-center mb-4`}>
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Button */}
          <button
            onClick={onClose}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${buttonClass}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
