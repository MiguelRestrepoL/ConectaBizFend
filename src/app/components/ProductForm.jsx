'use client';

import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import SelectField from './SelectField';
import { getClients } from '../api/clients';

const ProductForm = ({ onSubmit, loading = false, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData || {
    nombre: '',
    descripcion: '',
    precio: '',
    stock: 0,
    stock_minimo: 0,
    codigo: '',
    proveedor_id: '',
    estado: true
  });

  const [errors, setErrors] = useState({});
  const [proveedores, setProveedores] = useState([]);
  const [loadingProveedores, setLoadingProveedores] = useState(true);

  // Cargar clientes (proveedores) para el select
  useEffect(() => {
    const loadProveedores = async () => {
      try {
        setLoadingProveedores(true);
        const result = await getClients({ limit: 1000 });

        if (result.success) {
          const clientsData = result.data.clients || result.data.data || result.data;
          setProveedores(clientsData);
        }
      } catch (error) {
        console.error('Error loading proveedores:', error);
      } finally {
        setLoadingProveedores(false);
      }
    };

    loadProveedores();
  }, []);

  // Actualizar formData cuando cambien los initialData
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }
    if (formData.stock_minimo < 0) {
      newErrors.stock_minimo = 'El stock mínimo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const proveedorOptions = proveedores.map(cliente => {
    let label = '';
    if (cliente.persona_natural) {
      label = `${cliente.persona_natural.nombre} ${cliente.persona_natural.apellido} (${cliente.correo_electronico})`;
    } else if (cliente.persona_juridica) {
      label = `${cliente.persona_juridica.razon_social} (${cliente.correo_electronico})`;
    } else {
      label = cliente.correo_electronico;
    }
    
    return {
      value: cliente.id,
      label
    };
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      
      {/* CARD 1: Información Básica */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          Información del Producto
        </h3>

        <div className="space-y-4 sm:space-y-6">
          {/* Grid: 2 columnas en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Nombre */}
            <FormField
              label="Nombre del Producto"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Laptop Dell XPS 15"
              required
              error={errors.nombre}
            />

            {/* Código */}
            <FormField
              label="Código (opcional)"
              value={formData.codigo}
              onChange={(e) => handleInputChange('codigo', e.target.value)}
              placeholder="Ej: LAP-DELL-001"
              error={errors.codigo}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              rows={4}
              placeholder="Descripción detallada del producto..."
            />
          </div>
        </div>
      </div>

      {/* CARD 2: Precio e Inventario */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          Precio e Inventario
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => handleInputChange('precio', e.target.value)}
                className="block w-full pl-7 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="0.00"
                required
              />
            </div>
            {errors.precio && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.precio}</p>
            )}
          </div>

          {/* Stock Actual */}
          <FormField
            label="Stock Actual"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
            placeholder="0"
            error={errors.stock}
          />

          {/* Stock Mínimo */}
          <FormField
            label="Stock Mínimo (Alerta)"
            type="number"
            min="0"
            value={formData.stock_minimo}
            onChange={(e) => handleInputChange('stock_minimo', parseInt(e.target.value) || 0)}
            placeholder="0"
            error={errors.stock_minimo}
          />
        </div>
      </div>

      {/* CARD 3: Proveedor y Estado */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          Proveedor y Estado
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Proveedor */}
          <SelectField
            label="Proveedor (opcional)"
            value={formData.proveedor_id}
            onChange={(e) => handleInputChange('proveedor_id', e.target.value)}
            options={proveedorOptions}
            placeholder={loadingProveedores ? "Cargando proveedores..." : "Seleccionar proveedor"}
            disabled={loadingProveedores}
          />

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado del Producto
            </label>
            <div className="flex items-center gap-4 p-3 border border-gray-300 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="estado"
                  checked={formData.estado === true}
                  onChange={() => handleInputChange('estado', true)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="estado"
                  checked={formData.estado === false}
                  onChange={() => handleInputChange('estado', false)}
                  className="w-4 h-4 text-gray-600 focus:ring-2 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">Inactivo</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm sm:text-base"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-black text-white px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? (isEdit ? 'Actualizando...' : 'Creando...') : (isEdit ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;