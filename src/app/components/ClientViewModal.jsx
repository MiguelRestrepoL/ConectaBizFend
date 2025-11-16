import React from 'react';

const ClientViewModal = ({ isOpen, onClose, client }) => {
  if (!isOpen || !client) return null;

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

  const getInitials = (client) => {
    console.log(client);
    if (client.tipo_cliente === 'persona_juridica') {
      // Para persona jurídica, usar las primeras letras de la razón social
      return client.razon_social ? client.razon_social.substring(0, 2).toUpperCase() : 'PJ';
    } else {
      // Para persona natural, usar iniciales del nombre y apellido
      const firstInitial = client.persona_natural.nombre ? client.persona_natural.nombre.charAt(0).toUpperCase() : '';
      const lastInitial = client.persona_natural.apellido ? client.persona_natural.apellido.charAt(0).toUpperCase() : '';
      return firstInitial + lastInitial;
    }
  };

  const getDisplayName = (client) => {
    if (client.tipo_cliente === 'persona_juridica') {
      return client.persona_juridica.razon_social || 'Persona Jurídica';
    } else {
      return `${client.persona_natural.nombre || ''} ${client.persona_natural.apellido || ''}`.trim() || 'Persona Natural';
    }
  };

  const getSubtitle = (client) => {
    if (client.tipo_cliente === 'persona_juridica') {
      return client.persona_juridica.nit ? `NIT: ${client.persona_juridica.nit}` : 'Persona Jurídica';
    } else {
      const parts = [];
      if (client.persona_natural.segundo_nombre) parts.push(client.persona_natural.segundo_nombre);
      if (client.persona_natural.segundo_apellido) parts.push(client.persona_natural.segundo_apellido);
      return parts.join(' ');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className={`bg-gradient-to-r ${client.tipo_cliente === 'persona_juridica' 
          ? 'from-blue-600 to-indigo-600' 
          : 'from-purple-600 to-blue-600'} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                {getInitials(client)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {getDisplayName(client)}
                </h2>
                <p className="text-purple-100">
                  {getSubtitle(client)}
                </p>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.tipo_cliente === 'persona_juridica' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {client.tipo_cliente === 'persona_juridica' ? 'Persona Jurídica' : 'Persona Natural'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Información personal */}
            <div className="space-y-6">
              {/* Información según tipo de cliente */}
              {client.tipo_cliente === 'persona_natural' ? (
                /* Información Personal - Persona Natural */
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Información Personal
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{client.persona_natural.nombre || 'No disponible'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Apellido:</span>
                      <span className="font-medium">{client.persona_natural.apellido || 'No disponible'}</span>
                    </div>
                    {client.persona_natural.segundo_nombre && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Segundo nombre:</span>
                        <span className="font-medium">{client.persona_natural.segundo_nombre}</span>
                      </div>
                    )}
                    {client.persona_natural.segundo_apellido && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Segundo apellido:</span>
                        <span className="font-medium">{client.persona_natural.segundo_apellido}</span>
                      </div>
                    )}
                    {client.persona_natural.nacionalidad && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nacionalidad:</span>
                        <span className="font-medium">{client.persona_natural.nacionalidad}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Idioma:</span>
                      <span className="font-medium">{client.persona_natural.idioma || 'No disponible'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Información Empresarial - Persona Jurídica */
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Información Empresarial
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Razón Social:</span>
                      <span className="font-medium">{client.persona_juridica.razon_social || 'No disponible'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NIT:</span>
                      <span className="font-medium">{client.persona_juridica.nit || 'No disponible'}</span>
                    </div>
                    {client.persona_juridica.digito_verificacion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dígito de Verificación:</span>
                        <span className="font-medium">{client.persona_juridica.digito_verificacion}</span>
                      </div>
                    )}
                    {client.persona_juridica.tipo_empresa && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo de Empresa:</span>
                        <span className="font-medium">{client.persona_juridica.tipo_empresa}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Representante Legal:</span>
                      <span className="font-medium">{client.persona_juridica.representante_legal || 'No disponible'}</span>
                    </div>
                    {client.persona_juridica.cedula_representante && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cédula Representante:</span>
                        <span className="font-medium">{client.persona_juridica.cedula_representante}</span>
                      </div>
                    )}
                    {client.persona_juridica.actividad_economica && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actividad Económica:</span>
                        <span className="font-medium text-right max-w-xs">{client.persona_juridica.actividad_economica}</span>
                      </div>
                    )}
                    {client.persona_juridica.codigo_ciiu && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Código CIIU:</span>
                        <span className="font-medium">{client.persona_juridica.codigo_ciiu}</span>
                      </div>
                    )}
                    {client.persona_juridica.fecha_constitucion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de Constitución:</span>
                        <span className="font-medium">{new Date(client.persona_juridica.fecha_constitucion).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    {client.persona_juridica.capital_social && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capital Social:</span>
                        <span className="font-medium">${Number(client.persona_juridica.capital_social).toLocaleString('es-ES')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Idioma:</span>
                      <span className="font-medium">{client.persona_juridica.idioma || 'No disponible'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Información de Contacto */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Información de Contacto
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-blue-600">{client.correo_electronico || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">{formatPhone(client.numero_telefono, client.codigo_pais_telefono)}</span>
                  </div>
                  {client.telefono_residencia && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teléfono residencia:</span>
                      <span className="font-medium">{formatPhone(client.telefono_residencia, client.codigo_pais_residencia)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferencias de Marketing */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Preferencias de Marketing
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Emails de marketing:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.recibe_emails_marketing 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.recibe_emails_marketing ? 'Sí' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">SMS de marketing:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.recibe_sms_marketing 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.recibe_sms_marketing ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Información de dirección y fiscal */}
            <div className="space-y-6">
              {/* Información de Dirección */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Información de Dirección
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-medium text-right max-w-xs">{client.direccion || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ciudad:</span>
                    <span className="font-medium">{client.ciudad || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">País:</span>
                    <span className="font-medium">{client.pais_residencia || 'No disponible'}</span>
                  </div>
                  {client.apartamento_local && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Apartamento/Local:</span>
                      <span className="font-medium">{client.apartamento_local}</span>
                    </div>
                  )}
                  {client.codigo_postal && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Código postal:</span>
                      <span className="font-medium">{client.codigo_postal}</span>
                    </div>
                  )}
                  {client.departamento_estado && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departamento/Estado:</span>
                      <span className="font-medium">{client.departamento_estado}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información Fiscal */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Información Fiscal
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recaudar impuestos:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.recaudar_impuestos === 'recaudar' 
                        ? 'bg-green-100 text-green-800' 
                        : client.recaudar_impuestos === 'recaudar_con_excepcion'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.recaudar_impuestos === 'recaudar' ? 'Sí' : 
                       client.recaudar_impuestos === 'recaudar_con_excepcion' ? 'Con excepción' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {client.notas && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Notas
                  </h3>
                  <p className="text-gray-700 bg-white p-3 rounded-lg border">
                    {client.notas}
                  </p>
                </div>
              )}

              {/* Etiquetas */}
              {client.etiquetas && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {client.etiquetas.split(', ').map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información del sistema */}
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Información del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">ID del Cliente:</span> {client.id}
              </div>
              <div>
                <span className="font-medium">Creado:</span> {formatDate(client.created_at)}
              </div>
              <div>
                <span className="font-medium">Última actualización:</span> {formatDate(client.updated_at)}
              </div>
              {client.user && (
                <div>
                  <span className="font-medium">Usuario:</span> {client.user.username} ({client.user.email})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientViewModal;
