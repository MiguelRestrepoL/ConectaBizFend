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
 
const TIPO_CONFIG = {
  info:        { label: 'Información', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-400'   },
  advertencia: { label: 'Advertencia', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400'  },
  promocion:   { label: 'Promoción',   bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400' },
};
 
const ANUNCIO_VACIO = { titulo: '', contenido: '', tipo: 'info', activo: true };
 
export default function ContenidoPage() {
  // ── Tienda ───────────────────────────────────────────────────────────────────
  const [tienda, setTienda] = useState({ nombre_tienda: '', slogan: '', descripcion: '' });
  const [tiendaLoading, setTiendaLoading] = useState(true);
  const [tiendaSaving, setTiendaSaving] = useState(false);
  const [tiendaMsg, setTiendaMsg] = useState(null); // {type, text}
 
  // ── Anuncios ─────────────────────────────────────────────────────────────────
  const [anuncios, setAnuncios] = useState([]);
  const [anunciosLoading, setAnunciosLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { modo: 'crear'|'editar', form: {}, saving, error }
  const [deletingId, setDeletingId] = useState(null);
 
  // ── Cargar datos ─────────────────────────────────────────────────────────────
  const cargarTienda = useCallback(async () => {
    setTiendaLoading(true);
    try {
      const { data } = await apiFetch('/contenido/tienda');
      setTienda({ nombre_tienda: data.nombre_tienda || '', slogan: data.slogan || '', descripcion: data.descripcion || '' });
    } catch (e) {
      setTiendaMsg({ type: 'error', text: e.message });
    } finally {
      setTiendaLoading(false);
    }
  }, []);
 
  const cargarAnuncios = useCallback(async () => {
    setAnunciosLoading(true);
    try {
      const { data } = await apiFetch('/contenido/anuncios');
      setAnuncios(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setAnunciosLoading(false);
    }
  }, []);
 
  useEffect(() => { cargarTienda(); cargarAnuncios(); }, [cargarTienda, cargarAnuncios]);
 
  // ── Guardar tienda ───────────────────────────────────────────────────────────
  const guardarTienda = async () => {
    setTiendaSaving(true);
    setTiendaMsg(null);
    try {
      await apiFetch('/contenido/tienda', { method: 'PUT', body: JSON.stringify(tienda) });
      setTiendaMsg({ type: 'success', text: 'Perfil de tienda guardado correctamente' });
      setTimeout(() => setTiendaMsg(null), 3000);
    } catch (e) {
      setTiendaMsg({ type: 'error', text: e.message });
    } finally {
      setTiendaSaving(false);
    }
  };
 
  // ── Crear / Editar anuncio ───────────────────────────────────────────────────
  const abrirCrear = () => setModal({ modo: 'crear', form: { ...ANUNCIO_VACIO }, saving: false, error: '' });
  const abrirEditar = (a) => setModal({ modo: 'editar', id: a.id, form: { titulo: a.titulo, contenido: a.contenido, tipo: a.tipo, activo: a.activo }, saving: false, error: '' });
 
  const guardarAnuncio = async () => {
    if (!modal.form.titulo.trim() || !modal.form.contenido.trim()) {
      setModal(m => ({ ...m, error: 'El título y el contenido son obligatorios' }));
      return;
    }
    setModal(m => ({ ...m, saving: true, error: '' }));
    try {
      if (modal.modo === 'crear') {
        await apiFetch('/contenido/anuncios', { method: 'POST', body: JSON.stringify(modal.form) });
      } else {
        await apiFetch(`/contenido/anuncios/${modal.id}`, { method: 'PUT', body: JSON.stringify(modal.form) });
      }
      setModal(null);
      cargarAnuncios();
    } catch (e) {
      setModal(m => ({ ...m, saving: false, error: e.message }));
    }
  };
 
  // ── Toggle activo inline ─────────────────────────────────────────────────────
  const toggleActivo = async (a) => {
    try {
      await apiFetch(`/contenido/anuncios/${a.id}`, { method: 'PUT', body: JSON.stringify({ activo: !a.activo }) });
      setAnuncios(prev => prev.map(x => x.id === a.id ? { ...x, activo: !x.activo } : x));
    } catch (e) {
      console.error(e);
    }
  };
 
  // ── Eliminar anuncio ─────────────────────────────────────────────────────────
  const eliminarAnuncio = async (id) => {
    setDeletingId(id);
    try {
      await apiFetch(`/contenido/anuncios/${id}`, { method: 'DELETE' });
      setAnuncios(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };
 
  return (
    <Layout>
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Contenido</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Personaliza tu tienda y gestiona tus anuncios internos</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 border-t border-gray-200" />
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
        {/* ── PERFIL DE TIENDA ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-900">Perfil de tienda</h2>
          </div>
 
          {tiendaLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de la tienda</label>
                  <input
                    value={tienda.nombre_tienda}
                    onChange={(e) => setTienda(t => ({ ...t, nombre_tienda: e.target.value }))}
                    placeholder="Ej: Mi Tienda Online"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Slogan</label>
                  <input
                    value={tienda.slogan}
                    onChange={(e) => setTienda(t => ({ ...t, slogan: e.target.value }))}
                    placeholder="Ej: La mejor calidad al mejor precio"
                    maxLength={255}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{tienda.slogan.length}/255</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={tienda.descripcion}
                    onChange={(e) => setTienda(t => ({ ...t, descripcion: e.target.value }))}
                    placeholder="Cuenta de qué trata tu tienda, qué vendes, tu misión…"
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
 
              {tiendaMsg && (
                <div className={`text-sm px-3 py-2 rounded-lg ${
                  tiendaMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {tiendaMsg.text}
                </div>
              )}
 
              <button
                onClick={guardarTienda}
                disabled={tiendaSaving}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                {tiendaSaving ? 'Guardando…' : 'Guardar perfil'}
              </button>
            </>
          )}
        </div>
 
        {/* ── ANUNCIOS INTERNOS ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h2 className="font-semibold text-gray-900">Anuncios internos</h2>
            </div>
            <button
              onClick={abrirCrear}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo
            </button>
          </div>
 
          {anunciosLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : anuncios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Sin anuncios todavía</p>
              <p className="text-gray-300 text-xs mt-1">Crea un aviso para tener visible información importante</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
              {anuncios.map((a) => {
                const cfg = TIPO_CONFIG[a.tipo] || TIPO_CONFIG.info;
                return (
                  <div
                    key={a.id}
                    className={`rounded-lg border p-4 transition-opacity ${cfg.border} ${a.activo ? 'opacity-100' : 'opacity-50'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <p className="font-medium text-gray-900 text-sm truncate">{a.titulo}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Toggle activo */}
                        <button
                          onClick={() => toggleActivo(a)}
                          title={a.activo ? 'Desactivar' : 'Activar'}
                          className={`w-8 h-5 rounded-full transition-colors flex items-center px-0.5 ${a.activo ? 'bg-purple-500' : 'bg-gray-200'}`}
                        >
                          <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${a.activo ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                        <button
                          onClick={() => abrirEditar(a)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => eliminarAnuncio(a.id)}
                          disabled={deletingId === a.id}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{a.contenido}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                      {!a.activo && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Inactivo</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
 
      {/* ── MODAL CREAR/EDITAR ANUNCIO ──────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {modal.modo === 'crear' ? 'Nuevo anuncio' : 'Editar anuncio'}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
 
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                <input
                  value={modal.form.titulo}
                  onChange={(e) => setModal(m => ({ ...m, form: { ...m.form, titulo: e.target.value } }))}
                  placeholder="Ej: Cierre por mantenimiento"
                  maxLength={150}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
 
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Contenido *</label>
                <textarea
                  value={modal.form.contenido}
                  onChange={(e) => setModal(m => ({ ...m, form: { ...m.form, contenido: e.target.value } }))}
                  placeholder="Descripción del anuncio…"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
 
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={modal.form.tipo}
                  onChange={(e) => setModal(m => ({ ...m, form: { ...m.form, tipo: e.target.value } }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="info">Información</option>
                  <option value="advertencia">Advertencia</option>
                  <option value="promocion">Promoción</option>
                </select>
              </div>
 
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModal(m => ({ ...m, form: { ...m.form, activo: !m.form.activo } }))}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${modal.form.activo ? 'bg-purple-500' : 'bg-gray-200'}`}
                >
                  <span className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${modal.form.activo ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-700">{modal.form.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
 
            {modal.error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {modal.error}
              </div>
            )}
 
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={guardarAnuncio}
                disabled={modal.saving}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                {modal.saving ? 'Guardando…' : modal.modo === 'crear' ? 'Crear anuncio' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}