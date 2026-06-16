'use client';
 
import React from 'react';
 
const ProveedorViewModal = ({ isOpen, onClose, proveedor }) => {
  if (!isOpen || !proveedor) return null;
 
  const isActive = proveedor.activo !== false;
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
 
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Detalle del Proveedor</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
 
        <div className="p-6 space-y-5">
          {/* Nombre + estado */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
              {proveedor.nombre?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{proveedor.nombre}</h3>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
 
          {/* Info */}
          <div className="space-y-3">
            <DetailRow icon="user" label="Contacto" value={proveedor.contacto} />
            <DetailRow icon="mail" label="Correo" value={proveedor.correo} />
            <DetailRow icon="phone" label="Teléfono" value={proveedor.telefono} />
            <DetailRow icon="map" label="Dirección" value={proveedor.direccion} />
            <DetailRow icon="location" label="Ciudad / País" value={[proveedor.ciudad, proveedor.pais].filter(Boolean).join(', ')} />
          </div>
 
          {proveedor.notas && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notas</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{proveedor.notas}</p>
            </div>
          )}
 
          {proveedor.productos && proveedor.productos.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Productos asociados ({proveedor.productos.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {proveedor.productos.slice(0, 8).map((p) => (
                  <span key={p.id} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    {p.nombre}
                  </span>
                ))}
                {proveedor.productos.length > 8 && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    +{proveedor.productos.length - 8} más
                  </span>
                )}
              </div>
            </div>
          )}
 
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
 
const icons = {
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  mail: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  map: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  location: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
};
 
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 text-gray-700">
    <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[icon]} />
    </svg>
    <div className="min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium truncate">{value || 'No disponible'}</p>
    </div>
  </div>
);
 
export default ProveedorViewModal;