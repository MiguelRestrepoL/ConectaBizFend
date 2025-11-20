'use client';

import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import SelectField from './SelectField';
import { getClients } from '../api/clients';
import { getProducts } from '../api/products';

// Definir la tasa de IVA (19% en Colombia)
const IVA_RATE = 0.19;

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
  
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  useEffect(() => {
    if (initialData && initialData.productos) {
      const productosExistentes = initialData.productos.map(p => ({
        producto_id: p.id,
        nombre: p.nombre,
        precio_unitario: p.PedidoProducto?.precio_unitario || p.precio || 0,
        cantidad: p.PedidoProducto?.cantidad || 1,
        subtotal: p.PedidoProducto?.subtotal || 0
      }));
      setProductosSeleccionados(productosExistentes);
    }
  }, [initialData]);

  useEffect(() => {
    const total = parseFloat(formData.monto_total_pagado);
    if (!isNaN(total) && total > 0) {
      const sinIva = parseFloat((total / (1 + IVA_RATE)).toFixed(2));
      setFormData(prev => ({
        ...prev,
        monto_recibido_sin_iva: sinIva
      }));
    } else if (formData.monto_total_pagado === '' || formData.monto_total_pagado === 0) {
      setFormData(prev => ({
        ...prev,
        monto_recibido_sin_iva: ''
      }));
    }
  }, [formData.monto_total_pagado]);

  useEffect(() => {
    calcularTotalesDesdeProductos();
  }, [productosSeleccionados]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoadingClients(true);
        const result = await getClients({ limit: 1000 });

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

  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoadingProductos(true);
        const result = await getProducts({ limit: 1000 });

        if (result.success) {
          const productosData = result.data.productos || result.data.data || result.data;
          setProductos(productosData);
        }
      } catch (error) {
        console.error('Error loading productos:', error);
      } finally {
        setLoadingProductos(false);
      }
    };

    loadProductos();
  }, []);

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

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    const productoId = parseInt(e.target.producto.value);
    const cantidad = parseInt(e.target.cantidad.value) || 1;

    if (!productoId || cantidad < 1) {
      alert('Selecciona un producto y una cantidad válida');
      return;
    }

    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    const yaExiste = productosSeleccionados.find(p => p.producto_id === productoId);
    if (yaExiste) {
      alert('Este producto ya fue agregado. Puedes editar su cantidad.');
      return;
    }

    const precioUnitario = producto.precio;
    const subtotal = precioUnitario * cantidad;

    const nuevoProducto = {
      producto_id: productoId,
      nombre: producto.nombre,
      precio_unitario: precioUnitario,
      cantidad: cantidad,
      subtotal: subtotal
    };

    setProductosSeleccionados(prev => [...prev, nuevoProducto]);

    e.target.producto.value = '';
    e.target.cantidad.value = '1';
  };

  const handleEliminarProducto = (productoId) => {
    setProductosSeleccionados(prev => prev.filter(p => p.producto_id !== productoId));
  };

  const handleCantidadChange = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    setProductosSeleccionados(prev => prev.map(p => {
      if (p.producto_id === productoId) {
        const nuevoSubtotal = p.precio_unitario * nuevaCantidad;
        return { ...p, cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
      }
      return p;
    }));
  };

  const calcularTotalesDesdeProductos = () => {
    const totalSinIva = productosSeleccionados.reduce((sum, p) => sum + p.subtotal, 0);
    const totalConIva = totalSinIva * (1 + IVA_RATE);

    setFormData(prev => ({
      ...prev,
      monto_recibido_sin_iva: totalSinIva.toFixed(2),
      monto_total_pagado: totalConIva.toFixed(2)
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.cliente_id) newErrors.cliente_id = 'Debe seleccionar un cliente';
    if (!formData.fecha_entrega) newErrors.fecha_entrega = 'La fecha de entrega es requerida';
    if (productosSeleccionados.length === 0) {
      newErrors.productos = 'Debes agregar al menos un producto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        productos: productosSeleccionados.map(p => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario,
          subtotal: p.subtotal
        }))
      };
      onSubmit(dataToSubmit);
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      
      {/* CARD 1: Información Básica */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          Información del Pedido
        </h3>

        <div className="space-y-4 sm:space-y-6">
          <FormField
            label="Título"
            value={formData.titulo}
            onChange={(e) => handleInputChange('titulo', e.target.value)}
            placeholder="Nombre del pedido"
            required
            error={errors.titulo}
          />

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Descripción
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-300 p-1.5 sm:p-2 flex flex-wrap gap-0.5 sm:gap-1">
                <select className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded text-black">
                  <option>Párrafo</option>
                  <option>H1</option>
                  <option>H2</option>
                  <option>H3</option>
                </select>
                <button type="button" className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100">
                  <strong>B</strong>
                </button>
                <button type="button" className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100">
                  <em>I</em>
                </button>
                <button type="button" className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100">
                  <u>U</u>
                </button>
                <button type="button" className="hidden sm:inline-flex px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                  A↓
                </button>
                <button type="button" className="hidden sm:inline-flex px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                  🎨
                </button>
                <button type="button" className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100">
                  •
                </button>
                <button type="button" className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100">
                  1.
                </button>
                <button type="button" className="hidden sm:inline-flex px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                  ⬅️
                </button>
                <button type="button" className="hidden sm:inline-flex px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                  ➡️
                </button>
                <button type="button" className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100">
                  ⋯
                </button>
              </div>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                className="w-full p-3 sm:p-4 border-0 focus:ring-0 resize-none text-sm sm:text-base text-black"
                rows={6}
                style={{ minHeight: '120px' }}
                placeholder="Escribir descripción aquí..."
              />
            </div>
          </div>

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

      {/* CARD: PRODUCTOS DEL PEDIDO */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          Productos del Pedido
        </h3>

        {/* Formulario agregar producto */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <select
                name="producto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-black"
                disabled={loadingProductos}
              >
                <option value="">
                  {loadingProductos ? 'Cargando productos...' : 'Seleccionar producto'}
                </option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - {formatCurrency(p.precio)}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-28">
              <input
                type="number"
                name="cantidad"
                defaultValue="1"
                min="1"
                placeholder="Cant."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-black"
              />
            </div>

            <button
              onClick={handleAgregarProducto}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Lista de productos */}
        {productosSeleccionados.length > 0 ? (
          <div className="space-y-3">
            {productosSeleccionados.map((producto) => (
              <div key={producto.producto_id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{producto.nombre}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {formatCurrency(producto.precio_unitario)} x {producto.cantidad} = 
                      <span className="font-bold text-blue-600 ml-1">
                        {formatCurrency(producto.subtotal)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCantidadChange(producto.producto_id, producto.cantidad - 1)}
                      className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{producto.cantidad}</span>
                    <button
                      type="button"
                      onClick={() => handleCantidadChange(producto.producto_id, producto.cantidad + 1)}
                      className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEliminarProducto(producto.producto_id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded ml-2"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600">No hay productos agregados</p>
            <p className="text-sm text-gray-500">Selecciona productos arriba para agregarlos</p>
          </div>
        )}
        {errors.productos && (
          <p className="mt-2 text-sm text-red-600">{errors.productos}</p>
        )}
      </div>

      {/* CARD 2: Detalles del Pedido */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          Detalles del Pedido
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <FormField
              label="Fecha despacho pedido"
              type="date"
              value={formData.fecha_despacho || ''}
              onChange={(e) => handleInputChange('fecha_despacho', e.target.value)}
            />

            <SelectField
              label="Estado del pedido"
              value={formData.estado}
              onChange={(e) => handleInputChange('estado', e.target.value)}
              options={estadoOptions}
              required
              error={errors.estado}
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Monto total pagado (con IVA)
                <span className="text-gray-600 text-xs ml-1">(IVA {(IVA_RATE * 100).toFixed(0)}%)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monto_total_pagado}
                  readOnly
                  className="block w-full pl-7 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base text-black"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Monto total recibido (sin IVA)
                <span className="text-blue-600 text-xs ml-1">• Calculado automáticamente</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monto_recibido_sin_iva}
                  readOnly
                  className="block w-full pl-7 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base text-black"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <FormField
              label="Fecha salida aduana"
              type="date"
              value={formData.fecha_salida_aduana || ''}
              onChange={(e) => handleInputChange('fecha_salida_aduana', e.target.value)}
            />

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

      {/* BOTONES */}
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
          className="w-full sm:w-auto bg-black text-white px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm sm:text-base"
        >
          {loading ? (isEdit ? 'Actualizando...' : 'Creando...') : (isEdit ? 'Actualizar Pedido' : 'Crear Pedido')}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;