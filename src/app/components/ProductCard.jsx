'use client';
 
import React from 'react';
import StockBadge from './StockBadge';
 
const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView,
  onUpdateStock 
}) => {
  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };
 
  // Obtener nombre del proveedor de forma segura
  const getProveedorName = () => {
    if (!product.proveedor) return 'Sin proveedor';
    return product.proveedor.nombre || 'Sin nombre';
  };
 
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200">
      {/* Card Content */}
      <div style={{ padding: '16px' }} className="sm:p-6">
        
        {/* HEADER: Nombre + Badge Stock + Acciones */}
        <div className="flex flex-col gap-3 mb-4">
          
          {/* Fila 1: Nombre + Acciones (móvil) */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-gray-900 truncate"
                style={{ fontSize: '16px' }}
                title={product.nombre}
              >
                {product.nombre}
              </h3>
              {product.codigo && (
                <p className="text-xs text-gray-500 mt-1">
                  Código: {product.codigo}
                </p>
              )}
            </div>
 
            {/* Botones de Acción - MÓVIL (solo iconos) */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={() => onUpdateStock(product)}
                className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
                title="Actualizar stock"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
              <button
                onClick={() => onView(product)}
                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver detalles"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(product)}
                className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                title="Editar"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(product)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
 
          {/* Fila 2: Badge Stock + ID + Acciones Desktop */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Badge de Stock */}
              <StockBadge 
                stock={product.stock} 
                stockMinimo={product.stock_minimo}
                size="md"
              />
              
              {/* ID del producto */}
              <span className="text-xs text-gray-500" style={{ whiteSpace: 'nowrap' }}>
                ID: #{product.id}
              </span>
            </div>
 
            {/* Botones de Acción - DESKTOP (con texto) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onUpdateStock(product)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-orange-50 rounded-lg transition-colors text-orange-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span className="hidden md:inline">Stock</span>
              </button>
              <button
                onClick={() => onView(product)}
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
                onClick={() => onEdit(product)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden md:inline">Editar</span>
              </button>
              <button
                onClick={() => onDelete(product)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden md:inline">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
 
        {/* BODY: Info del Producto */}
        <div className="space-y-2 mb-4">
          {/* Proveedor */}
          <div className="flex items-center gap-2 text-gray-700">
            <svg style={{ width: '16px', height: '16px' }} className="flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm truncate font-medium" title={getProveedorName()}>
              {getProveedorName()}
            </span>
          </div>
 
          {/* Descripción (solo desktop) */}
          {product.descripcion && (
            <p className="hidden lg:block text-sm text-gray-600 line-clamp-2" title={product.descripcion}>
              {product.descripcion}
            </p>
          )}
        </div>
 
        {/* FOOTER: Precio + Estado */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200">
          {/* Precio */}
          <div>
            <span className="text-xs text-gray-700 block mb-1 font-medium">Precio</span>
            <span className="text-lg sm:text-xl font-bold text-blue-700 block">
              {formatCurrency(product.precio)}
            </span>
          </div>
 
          {/* Estado activo/inactivo */}
          <div className="text-right">
            <span className="text-xs text-gray-700 block mb-1 font-medium">Estado</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
              product.estado 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
              {product.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
 
      </div>
    </div>
  );
};
 
export default ProductCard;