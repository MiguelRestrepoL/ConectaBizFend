'use client';

import React, { useState, useEffect } from 'react';

// Componentes auxiliares simplificados
const FormField = ({ label, name, value, onChange, type = 'text', required = false, error }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-medium"
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-medium cursor-pointer"
    >
      <option value="">Seleccionar...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Definir la tasa de IVA (19% en Colombia)
const IVA_RATE = 0.19;

const OrderForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    cliente_id: '',
    estado: 'preparando',
    fecha_entrega: '',
    monto_total_pagado: '',
    monto_recibido_sin_iva: ''
  });

  // ✅ NUEVO: Estado para productos seleccionados
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo || '',
        descripcion: initialData.descripcion || '',
        cliente_id: initialData.cliente_id || '',
        estado: initialData.estado || 'preparando',
        fecha_entrega: initialData.fecha_entrega || '',
        monto_total_pagado: initialData.monto_total_pagado || '',
        monto_recibido_sin_iva: initialData.monto_recibido_sin_iva || ''
      });

      // ✅ Cargar productos existentes del pedido
      if (initialData.productos && initialData.productos.length > 0) {
        const productosExistentes = initialData.productos.map(p => ({
          producto_id: p.id,
          nombre: p.nombre,
          precio_unitario: p.PedidoProducto?.precio_unitario || p.precio || 0,
          cantidad: p.PedidoProducto?.cantidad || 1,
          subtotal: p.PedidoProducto?.subtotal || 0
        }));
        setProductosSeleccionados(productosExistentes);
      }
    }
  }, [initialData]);

  // Cargar clientes (simulado)
  useEffect(() => {
    loadClientes();
  }, []);

  // Cargar productos disponibles (simulado)
  useEffect(() => {
    loadProductos();
  }, []);

  const loadClientes = async () => {
    try {
      setLoadingClientes(true);
      // Simulación de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockClientes = [
        { id: 1, nombre: 'Juan Pérez', tipo: 'natural' },
        { id: 2, nombre: 'Tech Corp SAS', tipo: 'juridica' },
        { id: 3, nombre: 'María González', tipo: 'natural' }
      ];
      
      setClientes(mockClientes);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const loadProductos = async () => {
    try {
      setLoadingProductos(true);
      // Simulación de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockProductos = [
        { id: 1, nombre: 'Laptop Dell XPS 13', precio: 3500000, stock: 10 },
        { id: 2, nombre: 'Mouse Logitech MX Master', precio: 250000, stock: 25 },
        { id: 3, nombre: 'Teclado Mecánico Corsair', precio: 450000, stock: 15 },
        { id: 4, nombre: 'Monitor LG 27"', precio: 1200000, stock: 8 },
        { id: 5, nombre: 'Webcam Logitech C920', precio: 350000, stock: 20 }
      ];
      
      setProductos(mockProductos);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoadingProductos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ AGREGAR PRODUCTO
  const handleAgregarProducto = (e) => {
    e.preventDefault();
    const productoId = parseInt(e.target.producto.value);
    const cantidad = parseInt(e.target.cantidad.value) || 1;

    if (!productoId || cantidad < 1) {
      alert('Selecciona un producto y una cantidad válida');
      return;
    }

    // Buscar el producto en la lista
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    // Verificar si ya está agregado
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

    // Limpiar campos
    e.target.producto.value = '';
    e.target.cantidad.value = '1';

    // Recalcular totales
    calcularTotales([...productosSeleccionados, nuevoProducto]);
  };

  // ✅ ELIMINAR PRODUCTO
  const handleEliminarProducto = (productoId) => {
    const nuevosProductos = productosSeleccionados.filter(p => p.producto_id !== productoId);
    setProductosSeleccionados(nuevosProductos);
    calcularTotales(nuevosProductos);
  };

  // ✅ ACTUALIZAR CANTIDAD
  const handleCantidadChange = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const nuevosProductos = productosSeleccionados.map(p => {
      if (p.producto_id === productoId) {
        const nuevoSubtotal = p.precio_unitario * nuevaCantidad;
        return { ...p, cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
      }
      return p;
    });

    setProductosSeleccionados(nuevosProductos);
    calcularTotales(nuevosProductos);
  };

  // ✅ CALCULAR TOTALES AUTOMÁTICAMENTE
  const calcularTotales = (productos) => {
    const totalSinIva = productos.reduce((sum, p) => sum + p.subtotal, 0);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productosSeleccionados.length === 0) {
      alert('Debes agregar al menos un producto al pedido');
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        productos: productosSeleccionados.map(p => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario,
          subtotal: p.subtotal
        }))
      };

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Error al guardar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Título del Pedido"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
          
          <SelectField
            label="Cliente"
            name="cliente_id"
            value={formData.cliente_id}
            onChange={handleChange}
            required
            options={clientes.map(c => ({ value: c.id, label: c.nombre }))}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            options={[
              { value: 'preparando', label: 'Preparando' },
              { value: 'enviado', label: 'Enviado' },
              { value: 'entregado', label: 'Entregado' },
              { value: 'cancelado', label: 'Cancelado' }
            ]}
          />

          <FormField
            label="Fecha de Entrega"
            name="fecha_entrega"
            type="date"
            value={formData.fecha_entrega}
            onChange={handleChange}
          />
        </div>

        {/* ✅ SECCIÓN DE PRODUCTOS */}
        <div className="border-t-2 border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Productos del Pedido
          </h3>

          {/* Formulario para agregar productos */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <select
                  name="producto"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-medium cursor-pointer"
                  disabled={loadingProductos}
                >
                  <option value="">
                    {loadingProductos ? 'Cargando productos...' : 'Seleccionar producto'}
                  </option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} - {formatCurrency(p.precio)} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-32">
                <input
                  type="number"
                  name="cantidad"
                  defaultValue="1"
                  min="1"
                  placeholder="Cant."
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-medium"
                />
              </div>

              <button
                onClick={handleAgregarProducto}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg whitespace-nowrap"
              >
                + Agregar
              </button>
            </div>
          </div>

          {/* Lista de productos seleccionados */}
          {productosSeleccionados.length > 0 ? (
            <div className="space-y-3">
              {productosSeleccionados.map((producto) => (
                <div key={producto.producto_id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{producto.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(producto.precio_unitario)} x {producto.cantidad} = 
                        <span className="font-bold text-blue-700 ml-1">
                          {formatCurrency(producto.subtotal)}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Control de cantidad */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCantidadChange(producto.producto_id, producto.cantidad - 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-800 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900">
                          {producto.cantidad}
                        </span>
                        <button
                          onClick={() => handleCantidadChange(producto.producto_id, producto.cantidad + 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-800 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => handleEliminarProducto(producto.producto_id)}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                        title="Eliminar producto"
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-600 font-medium">No hay productos agregados</p>
              <p className="text-sm text-gray-500">Selecciona productos arriba para agregarlos</p>
            </div>
          )}
        </div>

        {/* Totales */}
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Total Sin IVA
              </label>
              <input
                type="number"
                name="monto_recibido_sin_iva"
                value={formData.monto_recibido_sin_iva}
                readOnly
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-bold text-lg"
              />
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Total Con IVA (19%)
              </label>
              <input
                type="number"
                name="monto_total_pagado"
                value={formData.monto_total_pagado}
                readOnly
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-bold text-lg"
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading || productosSeleccionados.length === 0}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar Pedido' : 'Crear Pedido'}
          </button>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;