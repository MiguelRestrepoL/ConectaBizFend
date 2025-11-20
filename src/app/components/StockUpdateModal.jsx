'use client';

import React, { useState } from 'react';
import { updateProductStock } from '../api/products';

const StockUpdateModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [operation, setOperation] = useState('add');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cantidad || cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await updateProductStock(product.id, parseInt(cantidad), operation);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Error al actualizar el stock');
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar el stock');
    } finally {
      setLoading(false);
    }
  };

  const getNewStock = () => {
    const cant = parseInt(cantidad) || 0;
    switch (operation) {
      case 'add':
        return product.stock + cant;
      case 'subtract':
        return Math.max(0, product.stock - cant);
      case 'set':
        return cant;
      default:
        return product.stock;
    }
  };

  const operationInfo = {
    add: {
      icon: '➕',
      title: 'Sumar Stock',
      description: 'Agregar unidades al inventario (ej: nueva compra)',
      color: 'bg-green-50 border-green-200'
    },
    subtract: {
      icon: '➖',
      title: 'Restar Stock',
      description: 'Quitar unidades del inventario (ej: venta)',
      color: 'bg-red-50 border-red-200'
    },
    set: {
      icon: '🎯',
      title: 'Establecer Stock',
      description: 'Definir cantidad exacta (ej: ajuste de inventario)',
      color: 'bg-blue-50 border-blue-200'
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <h3 className="text-xl font-bold">Actualizar Stock</h3>
                <p className="text-orange-100 text-sm">{product.nombre}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Stock Actual */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Stock Actual:</span>
              <span className="text-2xl font-bold text-gray-900">{product.stock} unidades</span>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-gray-500">Stock Mínimo:</span>
              <span className="font-medium text-gray-700">{product.stock_minimo} unidades</span>
            </div>
          </div>

          {/* Tipo de Operación */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Operación
            </label>
            <div className="space-y-2">
              {Object.entries(operationInfo).map(([key, info]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    operation === key
                      ? `${info.color} border-current`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="operation"
                    value={key}
                    checked={operation === key}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{info.icon}</span>
                      <span className="font-semibold text-gray-900">{info.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{info.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cantidad */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad {operation === 'set' ? '(nueva cantidad total)' : '(unidades)'}
            </label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-semibold"
              placeholder="0"
              required
            />
          </div>

          {/* Vista Previa */}
          {cantidad && parseInt(cantidad) > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-blue-800">Vista Previa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Nuevo Stock:</span>
                <span className="text-2xl font-bold text-blue-800">{getNewStock()} unidades</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !cantidad || parseInt(cantidad) <= 0}
              className="w-full sm:w-auto flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Actualizando...' : 'Actualizar Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockUpdateModal;