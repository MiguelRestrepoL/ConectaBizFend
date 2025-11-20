'use client';

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
    if (client.apartamento_local) parts.push(client.apartamento_local);
    if (client.ciudad) parts.push(client.ciudad);
    if (client.departamento_estado) parts.push(client.departamento_estado);
    if (client.pais_residencia) parts.push(client.pais_residencia);
    if (client.codigo_postal) parts.push(`CP: ${client.codigo_postal}`);
    
    return parts.length > 0 ? parts.join(', ') : 'No disponible';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'No disponible';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isPersonaNatural = client.tipo_cliente === 'persona_natural';
  const isActive = client.state !== false && client.estado !== 'Inactivo';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* HEADER DEL MODAL - RESPONSIVE */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                      {isPersonaNatural 
                        ? `${client.nombre || ''} ${client.apellido || ''}`
                        : client.razon_social || 'Sin nombre'
                      }
                    </h2>
                    {isPersonaNatural && (client.segundo_nombre || client.segundo_apellido) && (
                      <p className="text-xs sm:text-sm text-purple-100 truncate">
                        {client.segundo_nombre && `${client.segundo_nombre} `}
                        {client.segundo_apellido}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                    isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                    {isPersonaNatural ? 'Persona Natural' : 'Persona Jurídica'}
                  </span>
                  {client.idioma && (
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      {client.idioma}
                    </span>
                  )}
                </div>
              </div>

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* CONTENIDO DEL MODAL - SCROLLABLE */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

              {/* SECCIÓN: Información de Contacto */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Información de Contacto
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Email</p>
                    <p className="text-sm sm:text-base text-gray-900 break-all">{client.correo_electronico || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Teléfono Principal</p>
                    <p className="text-sm sm:text-base text-gray-900">{formatPhone(client.numero_telefono, client.codigo_pais_telefono)}</p>
                  </div>

                  {client.telefono_residencia && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Teléfono Residencia</p>
                      <p className="text-sm sm:text-base text-gray-900">{formatPhone(client.telefono_residencia, client.codigo_pais_residencia)}</p>
                    </div>
                  )}

                  {client.nacionalidad && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Nacionalidad</p>
                      <p className="text-sm sm:text-base text-gray-900">{client.nacionalidad}</p>
                    </div>
                  )}
                </div>

                {/* Marketing preferences */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Preferencias de Marketing</p>
                  <div className="flex flex-wrap gap-2">
                    {client.recibe_emails_marketing ? (
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Emails
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        No Emails
                      </span>
                    )}
                    
                    {client.recibe_sms_marketing ? (
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        SMS
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        No SMS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECCIÓN: Dirección */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Dirección
                </h3>
                
                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-gray-900">{formatAddress(client)}</p>
                </div>
              </div>

              {/* SECCIÓN: Información según tipo de cliente */}
              {isPersonaNatural ? (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Información Personal
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Nombre Completo</p>
                      <p className="text-sm sm:text-base text-gray-900">
                        {`${client.nombre || ''} ${client.segundo_nombre || ''} ${client.apellido || ''} ${client.segundo_apellido || ''}`.trim() || 'No disponible'}
                      </p>
                    </div>

                    {client.nacionalidad && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Nacionalidad</p>
                        <p className="text-sm sm:text-base text-gray-900">{client.nacionalidad}</p>
                      </div>
                    )}

                    {client.idioma && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Idioma</p>
                        <p className="text-sm sm:text-base text-gray-900">{client.idioma}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Información Empresarial
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Razón Social</p>
                      <p className="text-sm sm:text-base text-gray-900">{client.razon_social || 'No disponible'}</p>
                    </div>

                    {client.nit && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">NIT</p>
                        <p className="text-sm sm:text-base text-gray-900">
                          {client.nit}{client.digito_verificacion ? `-${client.digito_verificacion}` : ''}
                        </p>
                      </div>
                    )}

                    {client.tipo_empresa && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Tipo de Empresa</p>
                        <p className="text-sm sm:text-base text-gray-900">{client.tipo_empresa}</p>
                      </div>
                    )}

                    {client.representante_legal && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Representante Legal</p>
                        <p className="text-sm sm:text-base text-gray-900">{client.representante_legal}</p>
                      </div>
                    )}

                    {client.cedula_representante && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Cédula Representante</p>
                        <p className="text-sm sm:text-base text-gray-900">{client.cedula_representante}</p>
                      </div>
                    )}

                    {client.actividad_economica && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Actividad Económica</p>
                        <p className="text-sm sm:text-base text-gray-900">{client.actividad_economica}</p>
                      </div>
                    )}

                    {client.codigo_ciiu && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Código CIIU</p>
                        <p className="text-sm sm:text-base text-gray-900">{client.codigo_ciiu}</p>
                      </div>
                    )}

                    {client.fecha_constitucion && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Fecha de Constitución</p>
                        <p className="text-sm sm:text-base text-gray-900">{formatDate(client.fecha_constitucion)}</p>
                      </div>
                    )}

                    {client.capital_social && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Capital Social</p>
                        <p className="text-sm sm:text-base text-gray-900">{formatCurrency(client.capital_social)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECCIÓN: Información Fiscal */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Información Fiscal
                </h3>
                
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Recaudación de Impuestos</p>
                  <p className="text-sm sm:text-base text-gray-900">
                    {client.recaudar_impuestos === 'recaudar' && 'Recaudar impuestos'}
                    {client.recaudar_impuestos === 'recaudar_con_excepcion' && 'Recaudar con excepción'}
                    {client.recaudar_impuestos === 'no_recaudar' && 'No recaudar impuestos'}
                    {!client.recaudar_impuestos && 'No especificado'}
                  </p>
                </div>
              </div>

              {/* SECCIÓN: Notas */}
              {client.notas && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Notas
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{client.notas}</p>
                </div>
              )}

              {/* SECCIÓN: Etiquetas */}
              {client.etiquetas && client.etiquetas.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {client.etiquetas.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* FOOTER DEL MODAL - RESPONSIVE */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
              >
                Cerrar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientViewModal;