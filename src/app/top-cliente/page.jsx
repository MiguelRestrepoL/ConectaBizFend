'use client';
 
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/app/components/Layout';
 
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
 
const apiFetch = async (path, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error del servidor');
  return data;
};
 
const BADGE_CONFIG = {
  oro:    { label: '🥇 Oro',   bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  plata:  { label: '🥈 Plata', bg: 'bg-gray-50',   border: 'border-gray-300',  text: 'text-gray-600',   dot: 'bg-gray-400' },
  bronce: { label: '🥉 Bronce',bg: 'bg-orange-50', border: 'border-orange-300',text: 'text-orange-700', dot: 'bg-orange-400' },
};
 
const FILTROS = [
  { label: 'Últimos 7 días',  dias: 7 },
  { label: 'Últimos 30 días', dias: 30 },
  { label: 'Últimos 3 meses', dias: 90 },
  { label: 'Todo el tiempo',  dias: null },
];
 
const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
 
const fmtFecha = (d) =>
  d ? new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
 
export default function TopClientePage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroIdx, setFiltroIdx] = useState(3); // "Todo el tiempo" por defecto
  const [limit, setLimit] = useState(10);
 
  const cargar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filtro = FILTROS[filtroIdx];
      let query = `?limit=${limit}`;
      if (filtro.dias) {
        const fin = new Date();
        const ini = new Date();
        ini.setDate(ini.getDate() - filtro.dias);
        query += `&fecha_inicio=${ini.toISOString().slice(0, 10)}&fecha_fin=${fin.toISOString().slice(0, 10)}`;
      }
      const { data } = await apiFetch(`/top-clientes${query}`);
      setClientes(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filtroIdx, limit]);
 
  useEffect(() => { cargar(); }, [cargar]);
 
  const top3 = clientes.slice(0, 3);
  const resto = clientes.slice(3);
 
  return (
    <Layout>
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Top Clientes</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Ranking de tus mejores clientes por monto y pedidos</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 border-t border-gray-200" />
      </div>
 
      {/* CONTROLES */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
        {/* Filtros de período */}
        <div className="flex gap-2 flex-wrap">
          {FILTROS.map((f, i) => (
            <button
              key={i}
              onClick={() => setFiltroIdx(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtroIdx === i
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
 
        {/* Cuántos mostrar */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Mostrar</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-sm text-gray-500">clientes</span>
        </div>
      </div>
 
      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">{error}</div>
      )}
 
      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
 
      {/* EMPTY */}
      {!loading && !error && clientes.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No hay clientes con pedidos en este período</p>
          <p className="text-gray-400 text-sm mt-1">Prueba ampliando el rango de fechas</p>
        </div>
      )}
 
      {!loading && !error && clientes.length > 0 && (
        <>
          {/* PODIO TOP 3 */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {top3.map((c, i) => {
                const badge = BADGE_CONFIG[c.badge];
                return (
                  <div
                    key={c.id}
                    className={`bg-white rounded-xl border-2 ${badge.border} p-5 flex flex-col gap-3 relative overflow-hidden`}
                  >
                    {/* Posición */}
                    <div className={`absolute top-3 right-3 w-8 h-8 rounded-full ${badge.dot} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">#{i + 1}</span>
                    </div>
 
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full ${badge.bg} border-2 ${badge.border} flex items-center justify-center`}>
                      <span className={`text-xl font-bold ${badge.text}`}>
                        {c.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
 
                    <div>
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{c.nombre}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.correo_electronico}</p>
                      {c.ciudad && <p className="text-xs text-gray-400">{c.ciudad}</p>}
                    </div>
 
                    <span className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} border ${badge.border}`}>
                      {badge.label}
                    </span>
 
                    <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Monto total</p>
                        <p className="text-sm font-bold text-gray-900">{fmt(c.monto_total)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pedidos</p>
                        <p className="text-sm font-bold text-purple-600">{c.total_pedidos}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Último pedido</p>
                        <p className="text-xs text-gray-700">{fmtFecha(c.ultimo_pedido)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
 
          {/* TABLA RESTO */}
          {resto.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm">Resto del ranking</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Ciudad</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pedidos</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto total</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Último pedido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {resto.map((c, i) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{i + 4}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-600 font-semibold text-xs">
                                {c.nombre.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{c.nombre}</p>
                              <p className="text-xs text-gray-400">{c.correo_electronico}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{c.ciudad || '—'}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                            {c.total_pedidos}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">{fmt(c.monto_total)}</td>
                        <td className="px-6 py-4 text-right text-gray-500 text-xs hidden lg:table-cell">{fmtFecha(c.ultimo_pedido)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
 
          {/* RESUMEN FOOTER */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Clientes en ranking</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{clientes.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Total pedidos</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {clientes.reduce((s, c) => s + c.total_pedidos, 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-500">Monto acumulado</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {fmt(clientes.reduce((s, c) => s + c.monto_total, 0))}
              </p>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}