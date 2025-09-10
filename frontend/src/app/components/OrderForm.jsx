import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import SelectField from './SelectField';
import { getClients } from '../api/clients';

const OrderForm = ({ onSubmit, loading = false, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData || {
    titulo: '',
    descripcion: '',
    cliente_id: '',
    fecha_entrega: '',
    estado: 'preparando',
    monto_total_pagado: '',
    monto_recibido_sin_iva: ''
  });

  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // Cargar clientes para el select
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoadingClients(true);
        const result = await getClients({ limit: 1000 }); // Cargar todos los clientes
        
        if (result.success) {
          const clientsData = result.data.clients || result.data.data || result.data;
          setClients(clientsData);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    loadClients();
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

    // Required fields validation
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.cliente_id) newErrors.cliente_id = 'Debe seleccionar un cliente';
    if (!formData.fecha_entrega) newErrors.fecha_entrega = 'La fecha de entrega es requerida';
    if (!formData.monto_total_pagado || formData.monto_total_pagado <= 0) {
      newErrors.monto_total_pagado = 'El monto total pagado debe ser mayor a 0';
    }
    if (!formData.monto_recibido_sin_iva || formData.monto_recibido_sin_iva <= 0) {
      newErrors.monto_recibido_sin_iva = 'El monto recibido sin IVA debe ser mayor a 0';
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

  const estadoOptions = [
    { value: 'preparando', label: 'Preparando' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregado', label: 'Entregado' }
  ];

  const clientOptions = clients.map(client => ({
    value: client.id,
    label: `${client.nombre} ${client.apellido} (${client.correo_electronico})`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primera tarjeta - Información básica */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Información del Pedido</h3>
            
            <div className="space-y-6">
              {/* Título */}
              <FormField
                label="Título"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Text field data"
                required
                error={errors.titulo}
              />

              {/* Descripción con editor de texto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Toolbar del editor */}
                  <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                    <select className="px-2 py-1 text-sm border border-gray-300 rounded">
                      <option>Párrafo</option>
                      <option>H1</option>
                      <option>H2</option>
                      <option>H3</option>
                    </select>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      <strong>B</strong>
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      <em>I</em>
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      <u>U</u>
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      A↓
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      🎨
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      🎨
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      •
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      1.
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      ⬅️
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      ➡️
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      🔗
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      🖼️
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      📹
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      📊
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      💻
                    </button>
                    <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      ⋯
                    </button>
                  </div>
                  
                  {/* Área de texto */}
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    className="w-full p-4 border-0 focus:ring-0 resize-none"
                    rows={8}
                    placeholder="Escribir descripción aquí..."
                  />
                </div>
              </div>

              {/* Fecha de entrega */}
              <FormField
                label="Fecha entrega pedido"
                type="date"
                value={formData.fecha_entrega}
                onChange={(e) => handleInputChange('fecha_entrega', e.target.value)}
                required
                error={errors.fecha_entrega}
              />
            </div>
          </div>
        </div>

        {/* Segunda tarjeta - Información adicional */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Detalles del Pedido</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-6">
                {/* Fecha de despacho */}
                <FormField
                  label="Fecha despacho pedido"
                  type="date"
                  value={formData.fecha_despacho || ''}
                  onChange={(e) => handleInputChange('fecha_despacho', e.target.value)}
                />

                {/* Estado del pedido */}
                <SelectField
                  label="Estado del pedido"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  options={estadoOptions}
                  required
                  error={errors.estado}
                />

                {/* Monto total pagado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto total pagado
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.monto_total_pagado}
                      onChange={(e) => handleInputChange('monto_total_pagado', parseFloat(e.target.value) || 0)}
                      className="block w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {errors.monto_total_pagado && (
                    <p className="mt-1 text-sm text-red-600">{errors.monto_total_pagado}</p>
                  )}
                </div>

                {/* Monto recibido sin IVA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto total recibido (-IVA)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.monto_recibido_sin_iva}
                      onChange={(e) => handleInputChange('monto_recibido_sin_iva', parseFloat(e.target.value) || 0)}
                      className="block w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {errors.monto_recibido_sin_iva && (
                    <p className="mt-1 text-sm text-red-600">{errors.monto_recibido_sin_iva}</p>
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-6">
                {/* Fecha salida aduana */}
                <FormField
                  label="Fecha salida aduana"
                  type="date"
                  value={formData.fecha_salida_aduana || ''}
                  onChange={(e) => handleInputChange('fecha_salida_aduana', e.target.value)}
                />

                {/* Cliente */}
                <SelectField
                  label="Usuario respectivo del pedido"
                  value={formData.cliente_id}
                  onChange={(e) => handleInputChange('cliente_id', e.target.value)}
                  options={clientOptions}
                  placeholder={loadingClients ? "Cargando clientes..." : "Seleccionar cliente"}
                  required
                  error={errors.cliente_id}
                  disabled={loadingClients}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (isEdit ? 'Actualizando...' : 'Creando...') : (isEdit ? 'Actualizar Pedido' : 'Crear Pedido')}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
