import React from 'react';

const ClientCard = ({ client, onEdit, onDelete, onView }) => {
  const formatPhone = (phone, countryCode) => {
    if (!phone) return 'No disponible';
    return `+${countryCode || ''} ${phone}`;
  };

  const formatAddress = (client) => {
    const parts = [];
    if (client.direccion) parts.push(client.direccion);
    if (client.ciudad) parts.push(client.ciudad);
    if (client.departamento_estado) parts.push(client.departamento_estado);
    if (client.pais_residencia) parts.push(client.pais_residencia);
    
    return parts.length > 0 ? parts.join(', ') : 'No disponible';
  };

  const getInitials = (nombre, apellido) => {
    const firstInitial = nombre ? nombre.charAt(0).toUpperCase() : '';
    const lastInitial = apellido ? apellido.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  // 👇 Determinar si el cliente está activo o inactivo
  const isActive = client.state !== false;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
      {/* Header con avatar y nombre */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
            {getInitials(client.nombre, client.apellido)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {client.nombre} {client.apellido}
            </h3>
            <p className="text-sm text-gray-500">
              {client.segundo_nombre && `${client.segundo_nombre} `}
              {client.segundo_apellido}
            </p>
            {/* 👇 Badge de estado */}
            {!isActive && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                Inactivo
              </span>
            )}
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView && onView(client)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit && onEdit(client)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Editar cliente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* 👇 Botón que cambia según el estado del cliente */}
          <button
            onClick={() => onDelete && onDelete(client)}
            className={`p-2 rounded-lg transition-colors ${
              isActive
                ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            }`}
            title={isActive ? "Desactivar cliente" : "Activar cliente"}
          >
            {isActive ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{client.correo_electronico || 'No disponible'}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{formatPhone(client.numero_telefono, client.codigo_pais_telefono)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{formatAddress(client)}</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="flex flex-wrap gap-2 mb-4">
        {client.nacionalidad && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {client.nacionalidad}
          </span>
        )}
        {client.idioma && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {client.idioma}
          </span>
        )}
        {client.recibe_emails_marketing && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            Email Marketing
          </span>
        )}
        {client.recibe_sms_marketing && (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
            SMS Marketing
          </span>
        )}
      </div>

      {/* Notas (si existen) */}
      {client.notas && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="line-clamp-2">{client.notas}</p>
        </div>
      )}
    </div>
  );
};

export default ClientCard;
