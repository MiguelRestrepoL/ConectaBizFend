'use client';
 
import React from 'react';
 
const ProveedorCard = ({ proveedor, onEdit, onDelete, onView }) => {
  const formatUbicacion = (p) => {
    const parts = [];
    if (p.ciudad) parts.push(p.ciudad);
    if (p.pais) parts.push(p.pais);
    return parts.length > 0 ? parts.join(', ') : 'Sin ubicación';
  };
 
  const getInitials = (nombre) => {
    if (!nombre) return 'P';
    const words = nombre.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };
 
  const isActive = proveedor.activo !== false;
  const cantidadProductos = proveedor.productos?.length ?? proveedor.total_productos ?? null;
 
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200">
      <div className="p-4 sm:p-6">
 
        {/* HEADER: Avatar + Nombre + Botones */}
        <div className="flex flex-col gap-3 mb-4">
 
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 mr-3">
                <span className="text-sm sm:text-lg">{getInitials(proveedor.nombre)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {proveedor.nombre}
                </h3>
                {proveedor.contacto && (
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    Contacto: {proveedor.contacto}
                  </p>
                )}
                {!isActive && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full sm:hidden">
                    Inactivo
                  </span>
                )}
              </div>
            </div>
 
            {/* Botones - MÓVIL */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={() => onView && onView(proveedor)}
                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver detalles"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => onEdit && onEdit(proveedor)}
                className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                title="Editar"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete && onDelete(proveedor)}
                className={`p-1.5 rounded-lg transition-colors ${isActive ? 'hover:bg-red-50 text-red-600' : 'hover:bg-green-50 text-green-600'}`}
                title={isActive ? 'Desactivar' : 'Activar'}
              >
                {isActive ? (
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : (
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
 
          {/* Fila 2: Badge + Botones DESKTOP */}
          <div className="hidden sm:flex items-center justify-between">
            {!isActive ? (
              <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                Inactivo
              </span>
            ) : (
              <div></div>
            )}
 
            <div className="flex items-center gap-2">
              <button
                onClick={() => onView && onView(proveedor)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden md:inline">Ver</span>
              </button>
              <button
                onClick={() => onEdit && onEdit(proveedor)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden md:inline">Editar</span>
              </button>
              <button
                onClick={() => onDelete && onDelete(proveedor)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${isActive ? 'hover:bg-red-50 text-red-600' : 'hover:bg-green-50 text-green-600'}`}
                style={{ fontSize: '13px' }}
              >
                {isActive ? (
                  <>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden md:inline">Desactivar</span>
                  </>
                ) : (
                  <>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden md:inline">Activar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
 
        {/* BODY: Información de contacto */}
        <div className="space-y-2 mb-2">
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm truncate font-medium">{proveedor.correo || 'Sin correo'}</span>
          </div>
 
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm truncate">{proveedor.telefono || 'Sin teléfono'}</span>
          </div>
 
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm truncate">{formatUbicacion(proveedor)}</span>
          </div>
        </div>
 
        {/* Footer: cantidad de productos asociados */}
        {cantidadProductos !== null && (
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs">{cantidadProductos} producto{cantidadProductos === 1 ? '' : 's'} asociado{cantidadProductos === 1 ? '' : 's'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default ProveedorCard;