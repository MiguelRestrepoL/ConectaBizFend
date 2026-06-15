'use client';
 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import { getClients } from '../api/clients';
import { getOrders } from '../api/orders';
import { getProducts, getProductsStockBajo } from '../api/products';
import api from '../api/auth';
 
export default function HomePage() {
  const router = useRouter();
 
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalPedidos: 0,
    totalProductos: 0,
  });
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [clienteReciente, setClienteReciente] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
 
        // Traer usuario
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const res = await api.get(`/auth/${userId}`);
            setUser(res.data.user);
          } catch (e) {
            console.error('Error cargando usuario:', e);
          }
        }
 
        // Traer stats en paralelo
        const [clientesRes, pedidosRes, productosRes, stockRes] = await Promise.allSettled([
          getClients({ page: 1, limit: 1, includeInactive: true }),
          getOrders({ page: 1, limit: 5 }),
          getProducts({ page: 1, limit: 1, includeInactive: true }),
          getProductsStockBajo(),
        ]);
 
        if (clientesRes.status === 'fulfilled' && clientesRes.value.success) {
          const data = clientesRes.value.data;
          setStats(prev => ({ ...prev, totalClientes: data.total || 0 }));
 
          // Cliente más reciente (primer resultado)
          if (data.clients && data.clients.length > 0) {
            setClienteReciente(data.clients[0]);
          }
        }
 
        if (pedidosRes.status === 'fulfilled' && pedidosRes.value.success) {
          const data = pedidosRes.value.data;
          setStats(prev => ({ ...prev, totalPedidos: data.total || 0 }));
          setPedidosRecientes(data.pedidos || []);
        }
 
        if (productosRes.status === 'fulfilled' && productosRes.value.success) {
          const data = productosRes.value.data;
          setStats(prev => ({ ...prev, totalProductos: data.total || 0 }));
        }
 
        if (stockRes.status === 'fulfilled' && stockRes.value.success) {
          setStockBajo(stockRes.value.data.productos || []);
        }
 
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
 
    cargarDatos();
  }, []);
 
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'preparando': return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Preparando' };
      case 'enviado':    return { bg: 'bg-blue-100',   text: 'text-blue-800',   label: 'Enviado' };
      case 'entregado':  return { bg: 'bg-green-100',  text: 'text-green-800',  label: 'Entregado' };
      default:           return { bg: 'bg-gray-100',   text: 'text-gray-800',   label: estado };
    }
  };
 
  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };
 
  const getNombreCliente = (cliente) => {
    if (!cliente) return 'Sin cliente';
    if (cliente.persona_natural) {
      return `${cliente.persona_natural.nombre} ${cliente.persona_natural.apellido}`;
    }
    if (cliente.persona_juridica) {
      return cliente.persona_juridica.razon_social;
    }
    return cliente.correo_electronico || 'Cliente';
  };
 
  if (loading) {
    return (
      <Layout activeItem="inicio">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4" style={{ width: '48px', height: '48px' }} />
            <p className="text-gray-500 text-sm">Cargando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }
 
  return (
    <Layout activeItem="inicio">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
 
        {/* ── SALUDO ────────────────────────────────────────────────────────── */}
        <div className="mb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            ¡Hola, <span className="text-purple-600">{user?.username || 'Usuario'}</span>!
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Este es el resumen de tu negocio hoy.
          </p>
        </div>
 
        {/* ── STATS CARDS ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
 
          {/* Clientes */}
          <div
            onClick={() => router.push('/clientes')}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-purple-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalClientes}</p>
            <p className="text-sm text-gray-500 mt-1">Clientes totales</p>
          </div>
 
          {/* Pedidos */}
          <div
            onClick={() => router.push('/pedidos')}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-purple-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPedidos}</p>
            <p className="text-sm text-gray-500 mt-1">Pedidos totales</p>
          </div>
 
          {/* Productos */}
          <div
            onClick={() => router.push('/productos')}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-purple-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProductos}</p>
            <p className="text-sm text-gray-500 mt-1">Productos activos</p>
          </div>
        </div>
 
        {/* ── FILA MEDIA: Pedidos recientes + Cliente reciente ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
 
          {/* Pedidos recientes — ocupa 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Pedidos recientes</h2>
              <button
                onClick={() => router.push('/pedidos')}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                Ver todos →
              </button>
            </div>
 
            {pedidosRecientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No hay pedidos aún</p>
                <button
                  onClick={() => router.push('/agregar-pedido')}
                  className="mt-3 text-xs text-purple-600 hover:underline"
                >
                  Crear primer pedido
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pedidosRecientes.map((pedido) => {
                  const estado = getEstadoColor(pedido.estado);
                  return (
                    <div
                      key={pedido.id}
                      onClick={() => router.push('/pedidos')}
                      className="flex items-center justify-between px-5 sm:px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{pedido.titulo}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {getNombreCliente(pedido.cliente)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${estado.bg} ${estado.text}`}>
                          {estado.label}
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          {formatCurrency(pedido.monto_total_pagado)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
 
          {/* Cliente reciente — ocupa 1/3 */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Cliente reciente</h2>
              <button
                onClick={() => router.push('/clientes')}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                Ver todos →
              </button>
            </div>
 
            {!clienteReciente ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Sin clientes aún</p>
                <button
                  onClick={() => router.push('/agregar-cliente')}
                  className="mt-3 text-xs text-purple-600 hover:underline"
                >
                  Agregar primer cliente
                </button>
              </div>
            ) : (
              <div className="p-5 sm:p-6">
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">
                      {getNombreCliente(clienteReciente).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {getNombreCliente(clienteReciente)}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {clienteReciente.correo_electronico}
                    </p>
                  </div>
                </div>
 
                {/* Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Teléfono</span>
                    <span className="text-gray-700 font-medium">
                      {clienteReciente.codigo_pais_telefono} {clienteReciente.numero_telefono}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Tipo</span>
                    <span className="text-gray-700 font-medium capitalize">
                      {clienteReciente.tipo_cliente === 'persona_natural' ? 'Natural' : 'Jurídica'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Estado</span>
                    <span className={`font-medium ${clienteReciente.state ? 'text-green-600' : 'text-red-500'}`}>
                      {clienteReciente.state ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
 
                <button
                  onClick={() => router.push('/clientes')}
                  className="mt-5 w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Ver cliente
                </button>
              </div>
            )}
          </div>
        </div>
 
        {/* ── STOCK BAJO ────────────────────────────────────────────────────── */}
        {stockBajo.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-orange-100 bg-orange-50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-base font-semibold text-orange-800">
                  Productos con stock bajo ({stockBajo.length})
                </h2>
              </div>
              <button
                onClick={() => router.push('/productos-stock-bajo')}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
              >
                Ver todos →
              </button>
            </div>
 
            <div className="divide-y divide-gray-50">
              {stockBajo.slice(0, 4).map((producto) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between px-5 sm:px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{producto.nombre}</p>
                    {producto.codigo && (
                      <p className="text-xs text-gray-400 mt-0.5">Código: {producto.codigo}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      Mín: {producto.stock_minimo}
                    </span>
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      Stock: {producto.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* ── ACCESOS RÁPIDOS ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Nuevo cliente',  icon: '👤', href: '/agregar-cliente' },
              { label: 'Nuevo pedido',   icon: '📋', href: '/agregar-pedido' },
              { label: 'Nuevo producto', icon: '📦', href: '/agregar-producto' },
              { label: 'Auditoría',      icon: '🔍', href: '/auditoria' },
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all group"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-purple-700 text-center">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
 
      </div>
    </Layout>
  );
}