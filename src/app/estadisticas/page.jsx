'use client';
 
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
 
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
 
const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
};
 
// ── HELPERS ───────────────────────────────────────────────────────────────────
 
const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
 
const formatFechaCorta = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};
 
const formatFechaLarga = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};
 
const toISODate = (date) => date.toISOString().slice(0, 10);
 
const RANGOS = [
  { id: '7d', label: 'Últimos 7 días', dias: 6 },
  { id: '30d', label: 'Últimos 30 días', dias: 29 },
  { id: '3m', label: 'Últimos 3 meses', dias: 89 },
  { id: 'custom', label: 'Personalizado', dias: null }
];
 
const ESTADO_COLORS = {
  preparando: 'bg-yellow-100 text-yellow-700',
  enviado: 'bg-blue-100 text-blue-700',
  entregado: 'bg-green-100 text-green-700'
};
 
// ── COMPONENTES REUTILIZABLES ────────────────────────────────────────────────
 
const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">{icon}</div>
    <p className="text-gray-700 font-medium text-base mb-1">{title}</p>
    <p className="text-gray-400 text-sm">{subtitle}</p>
  </div>
);
 
const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${ESTADO_COLORS[estado] || 'bg-gray-100 text-gray-600'}`}>
    {estado}
  </span>
);
 
const VariacionBadge = ({ valor }) => {
  if (valor === null || valor === undefined || isNaN(valor)) return null;
  const positivo = Number(valor) >= 0;
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${positivo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
      <svg className={`w-3 h-3 ${positivo ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      {Math.abs(Number(valor))}%
    </span>
  );
};
 
const KPICard = ({ icon, label, value, variacion, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconBg}`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <VariacionBadge valor={variacion} />
    </div>
    <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);
 
// ── TOOLTIPS DE LAS GRÁFICAS ─────────────────────────────────────────────────
 
const VentasTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{formatFechaLarga(label)}</p>
      <p className="text-purple-600">Ingresos: <span className="font-semibold">{formatCurrency(payload[0]?.value)}</span></p>
      {payload[1] && <p className="text-gray-500">Pedidos: <span className="font-semibold">{payload[1].value}</span></p>}
    </div>
  );
};
 
const ProductosTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{data?.nombre}</p>
      <p className="text-purple-600">Vendidos: <span className="font-semibold">{data?.total_vendido}</span></p>
      <p className="text-gray-500">Ingresos: <span className="font-semibold">{formatCurrency(data?.total_ingresos)}</span></p>
    </div>
  );
};
 
// ── PAGE PRINCIPAL ───────────────────────────────────────────────────────────
 
export default function EstadisticasPage() {
  const [rango, setRango] = useState('30d');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  // Calcular fechas según el rango seleccionado
  const getFechas = useCallback(() => {
    if (rango === 'custom') {
      return { inicio: fechaInicio, fin: fechaFin };
    }
    const config = RANGOS.find(r => r.id === rango);
    const fin = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - config.dias);
    return { inicio: toISODate(inicio), fin: toISODate(fin) };
  }, [rango, fechaInicio, fechaFin]);
 
  const fetchEstadisticas = useCallback(async () => {
    const { inicio, fin } = getFechas();
    if (rango === 'custom' && (!inicio || !fin)) return;
 
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (inicio) params.append('fecha_inicio', inicio);
      if (fin) params.append('fecha_fin', fin);
 
      const res = await apiFetch(`/estadisticas?${params.toString()}`);
      setData(res.data);
    } catch (e) {
      setError(e.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, [getFechas, rango]);
 
  useEffect(() => {
    // Inicializar fechas custom con el rango de 30 días por defecto
    if (!fechaInicio || !fechaFin) {
      const fin = new Date();
      const inicio = new Date();
      inicio.setDate(inicio.getDate() - 29);
      setFechaInicio(toISODate(inicio));
      setFechaFin(toISODate(fin));
    }
  }, []);
 
  useEffect(() => { fetchEstadisticas(); }, [fetchEstadisticas]);
 
  const kpis = data?.kpis;
  const ventasPorDia = data?.ventas_por_dia || [];
  const topProductos = data?.top_productos || [];
  const pedidosRecientes = data?.pedidos_recientes || [];
 
  const ventasChartData = ventasPorDia.map(v => ({
    fecha: v.fecha,
    ingresos: parseFloat(v.ingresos || 0),
    pedidos: parseInt(v.total_pedidos || 0)
  }));
 
  const productosChartData = topProductos.map(p => ({
    nombre: p.nombre?.length > 14 ? `${p.nombre.slice(0, 14)}…` : p.nombre,
    total_vendido: p.total_vendido,
    total_ingresos: p.total_ingresos
  }));
 
  return (
    <Layout activeItem="estadisticas">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Estadísticas</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Resumen del rendimiento de tu negocio</p>
            </div>
          </div>
        </div>
 
        {/* Filtro de fechas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
              {RANGOS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRango(r.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${rango === r.id ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
 
            {rango === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fechaInicio}
                  max={fechaFin || undefined}
                  onChange={e => setFechaInicio(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <span className="text-gray-400 text-sm">hasta</span>
                <input
                  type="date"
                  value={fechaFin}
                  min={fechaInicio || undefined}
                  onChange={e => setFechaFin(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            )}
          </div>
        </div>
 
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4 mb-6">
            {error}
          </div>
        )}
 
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full border-4 border-purple-500 border-t-transparent w-10 h-10" />
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KPICard
                label="Ingresos totales"
                value={formatCurrency(kpis?.ingresos_totales)}
                variacion={kpis?.variacion_ingresos}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <KPICard
                label="Pedidos totales"
                value={kpis?.total_pedidos ?? 0}
                variacion={kpis?.variacion_pedidos}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
              />
              <KPICard
                label="Clientes nuevos"
                value={kpis?.clientes_nuevos ?? 0}
                iconBg="bg-green-50"
                iconColor="text-green-600"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              <KPICard
                label="Ticket promedio"
                value={formatCurrency(kpis?.ticket_promedio)}
                iconBg="bg-orange-50"
                iconColor="text-orange-500"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
            </div>
 
            {/* Resumen de pedidos por estado */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Preparando', value: kpis?.pedidos_preparando ?? 0, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Enviados', value: kpis?.pedidos_enviados ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Entregados', value: kpis?.pedidos_entregados ?? 0, color: 'text-green-600', bg: 'bg-green-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
 
            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Ventas por día */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Ingresos por día</h3>
                {ventasChartData.length === 0 ? (
                  <EmptyState
                    icon={<svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    title="Sin datos en este período"
                    subtitle="No hay ventas registradas en el rango seleccionado"
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={ventasChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="fecha" tickFormatter={formatFechaCorta} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<VentasTooltip />} />
                      <Line type="monotone" dataKey="ingresos" stroke="#9333ea" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
 
              {/* Top productos */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Top productos vendidos</h3>
                {productosChartData.length === 0 ? (
                  <EmptyState
                    icon={<svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                    title="Sin productos vendidos"
                    subtitle="Aún no hay ventas en este período"
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={productosChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ProductosTooltip />} />
                      <Bar dataKey="total_vendido" fill="#9333ea" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
 
            {/* Pedidos recientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">Pedidos recientes</h3>
              </div>
              {pedidosRecientes.length === 0 ? (
                <EmptyState
                  icon={<svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                  title="Sin pedidos recientes"
                  subtitle="Aún no se han registrado pedidos"
                />
              ) : (
                <div className="divide-y divide-gray-50">
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-2">Cliente</div>
                    <div className="col-span-4">Título</div>
                    <div className="col-span-2">Monto</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-2">Fecha</div>
                  </div>
                  {pedidosRecientes.map(p => (
                    <div key={p.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors">
                      <div className="col-span-2 text-sm text-gray-600 truncate">{p.cliente?.correo_electronico || '—'}</div>
                      <div className="col-span-4 text-sm font-medium text-gray-900 truncate">{p.titulo}</div>
                      <div className="col-span-2 text-sm font-semibold text-gray-800">{formatCurrency(p.monto_total_pagado)}</div>
                      <div className="col-span-2"><EstadoBadge estado={p.estado} /></div>
                      <div className="col-span-2 text-sm text-gray-500">{formatFechaLarga(p.created_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}