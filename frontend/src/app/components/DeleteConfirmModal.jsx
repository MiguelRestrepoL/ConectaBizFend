import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, client, loading = false, isActivation = false }) => {
  if (!isOpen) return null;

  const title = isActivation ? 'Activar Cliente' : 'Desactivar Cliente';
  const message = isActivation 
    ? '¿Estás seguro de que deseas activar este cliente?' 
    : '¿Estás seguro de que deseas desactivar este cliente?';
  const description = isActivation
    ? 'El cliente volverá a estar disponible en tu lista de clientes activos.'
    : 'El cliente será desactivado pero no se eliminará permanentemente. Podrás reactivarlo más tarde.';
  const confirmButtonText = isActivation ? 'Activar Cliente' : 'Desactivar Cliente';
  const confirmButtonClass = isActivation 
    ? 'bg-green-600 hover:bg-green-700' 
    : 'bg-red-600 hover:bg-red-700';
  const iconBgClass = isActivation ? 'bg-green-100' : 'bg-red-100';
  const iconColorClass = isActivation ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Icono */}
        <div className={`flex items-center justify-center w-12 h-12 mx-auto ${iconBgClass} rounded-full mb-4`}>
          {isActivation ? (
            <svg className={`w-6 h-6 ${iconColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className={`w-6 h-6 ${iconColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>

        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* Mensaje */}
        <p className="text-gray-600 text-center mb-2">
          {message}
        </p>

        {/* Información del cliente */}
        {client && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {client.persona_natural 
                ? `${client.persona_natural.nombre} ${client.persona_natural.apellido}`
                : client.persona_juridica?.razon_social || `${client.nombre || ''} ${client.apellido || ''}`}
            </div>
            <div className="text-sm text-gray-600">
              {client.correo_electronico && (
                <div className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{client.correo_electronico}</span>
                </div>
              )}
              {client.numero_telefono && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+{client.codigo_pais_telefono} {client.numero_telefono}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Descripción adicional */}
        <p className="text-sm text-gray-500 text-center mb-6">
          {description}
        </p>

        {/* Botones */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClass}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </div>
            ) : (
              confirmButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;