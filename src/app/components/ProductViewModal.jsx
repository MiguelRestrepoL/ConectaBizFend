'use client';
 
import React from 'react';
import StockBadge from './StockBadge';
 
const ProductViewModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;
 
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
 
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
 
  // Obtener info del proveedor de forma segura
  const getProveedorInfo = () => {
    if (!product.proveedor) {
      return {
        nombre: 'Sin proveedor asignado',
        contacto: 'N/A',
        email: 'N/A',
        telefono: 'N/A',
        ubicacion: 'N/A'
      };
    }
 
    const proveedor = product.proveedor;
    return {
      nombre: proveedor.nombre || 'Sin nombre',
      contacto: proveedor.contacto || 'N/A',
      email: proveedor.correo || 'N/A',
      telefono: proveedor.telefono || 'N/A',
      ubicacion: [proveedor.ciudad, proveedor.pais].filter(Boolean).join(', ') || 'N/A'
    };
  };
 
  const proveedorInfo = getProveedorInfo();
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                📦
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {product.nombre}
                </h2>
                <p className="text-blue-100">
                  ID: #{product.id} {product.codigo && `• Código: ${product.codigo}`}
                </p>
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
            {/* Columna izquierda - Información del producto */}
            <div className="space-y-6">
              {/* Estado del stock */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Estado del Inventario
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Estado del stock:</span>
                    <StockBadge 
                      stock={product.stock} 
                      stockMinimo={product.stock_minimo}
                      size="lg"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock actual:</span>
                    <span className="font-bold text-gray-900">{product.stock} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock mínimo:</span>
                    <span className="font-medium text-gray-700">{product.stock_minimo} unidades</span>
                  </div>
                  {product.stock <= product.stock_minimo && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-red-800 font-medium">
                        ⚠️ Stock crítico: Se recomienda reabastecer
                      </p>
                    </div>
                  )}
                </div>
              </div>
 
              {/* Información del proveedor */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Información del Proveedor
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium text-right">{proveedorInfo.nombre}</span>
                  </div>
                  {proveedorInfo.contacto !== 'N/A' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contacto:</span>
                      <span className="font-medium">{proveedorInfo.contacto}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-blue-600 break-all text-right">{proveedorInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">{proveedorInfo.telefono}</span>
                  </div>
                  {proveedorInfo.ubicacion !== 'N/A' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium">{proveedorInfo.ubicacion}</span>
                    </div>
                  )}
                </div>
              </div>
 
              {/* Fechas importantes */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Fechas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de creación:</span>
                    <span className="font-medium">{formatDate(product.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última actualización:</span>
                    <span className="font-medium">{formatDate(product.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Columna derecha - Información financiera y descripción */}
            <div className="space-y-6">
              {/* Información de precio */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Información de Precio
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-gray-600 font-medium">Precio Unitario:</span>
                    <span className="text-3xl font-bold text-green-600">
                      {formatCurrency(product.precio)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-gray-600 font-medium">Valor Total Inventario:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(product.precio * product.stock)}
                    </span>
                  </div>
                </div>
              </div>
 
              {/* Estado del producto */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Estado del Producto
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estado actual:</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    product.estado 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {product.estado ? '✓ Activo' : '✗ Inactivo'}
                  </span>
                </div>
              </div>
 
              {/* Descripción */}
              {product.descripcion && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Descripción del Producto
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {product.descripcion}
                    </p>
                  </div>
                </div>
              )}
 
              {/* Información del sistema */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Información del Sistema</h3>
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">ID del Producto:</span> {product.id}
                  </div>
                  {product.codigo && (
                    <div>
                      <span className="font-medium">Código:</span> {product.codigo}
                    </div>
                  )}
                  {product.proveedor_id && (
                    <div>
                      <span className="font-medium">Proveedor ID:</span> {product.proveedor_id}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Creado:</span> {formatDate(product.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">Actualizado:</span> {formatDate(product.updated_at)}
                  </div>
                </div>
              </div>
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
 
export default ProductViewModal;