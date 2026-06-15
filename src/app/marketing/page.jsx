'use client';
 
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
 
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
 
// ── COMPONENTES REUTILIZABLES ─────────────────────────────────────────────────
 
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
 
const Badge = ({ active, label }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-400'}`} />
    {label}
  </span>
);
 
const EmptyState = ({ icon, title, subtitle, onAction, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">{icon}</div>
    <p className="text-gray-700 font-medium text-base mb-1">{title}</p>
    <p className="text-gray-400 text-sm mb-4">{subtitle}</p>
    {onAction && (
      <button onClick={onAction} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
        {actionLabel}
      </button>
    )}
  </div>
);
 
// ── SELECTOR DE PRODUCTOS ─────────────────────────────────────────────────────
 
const ProductosSelector = ({ seleccionados, onChange }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
 
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await apiFetch('/productos?limit=100');
        setProductos(data.productos || data.data?.productos || []);
      } catch (e) {
        console.error('Error cargando productos:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);
 
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
 
  const toggle = (id) => {
    if (seleccionados.includes(id)) {
      onChange(seleccionados.filter(s => s !== id));
    } else {
      onChange([...seleccionados, id]);
    }
  };
 
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Productos asociados
        {seleccionados.length > 0 && (
          <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold">
            {seleccionados.length} seleccionados
          </span>
        )}
      </label>
 
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Buscador interno */}
        <div className="p-2 border-b border-gray-100 bg-gray-50">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-900"
          />
        </div>
 
        {/* Lista */}
        <div className="max-h-40 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full border-2 border-purple-500 border-t-transparent w-5 h-5" />
            </div>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">Sin productos</p>
          ) : (
            filtrados.map(p => (
              <label key={p.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={seleccionados.includes(p.id)}
                  onChange={() => toggle(p.id)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                  {p.precio !== undefined && (
                    <p className="text-xs text-gray-400">${Number(p.precio).toLocaleString()}</p>
                  )}
                </div>
              </label>
            ))
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-1">Opcional — deja vacío para aplicar a toda la tienda</p>
    </div>
  );
};
 
// ── CUPONES ───────────────────────────────────────────────────────────────────
 
const CuponesTab = ({ triggerCreate }) => {
  const [cupones, setCupones] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    codigo: '', tipo: 'porcentaje', valor: '', descripcion: '',
    fecha_inicio: '', fecha_fin: '', limite_usos: '', activo: true
  });
 
  const fetchCupones = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: 1, limit: 50, search });
      if (filtro !== 'todos') params.append('activo', filtro === 'activos');
      const data = await apiFetch(`/marketing/cupones?${params}`);
      setCupones(data.data.cupones || []);
      setTotal(data.data.total || 0);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [search, filtro]);
 
  useEffect(() => { fetchCupones(); }, [fetchCupones]);
  useEffect(() => { if (triggerCreate) openCreate(); }, [triggerCreate]);
 
  const openCreate = () => {
    setEditando(null);
    setForm({ codigo: '', tipo: 'porcentaje', valor: '', descripcion: '', fecha_inicio: '', fecha_fin: '', limite_usos: '', activo: true });
    setError('');
    setModalOpen(true);
  };
 
  const openEdit = (c) => {
    setEditando(c);
    setForm({
      codigo: c.codigo, tipo: c.tipo, valor: c.valor, descripcion: c.descripcion || '',
      activo: c.activo,
      fecha_inicio: c.fecha_inicio ? c.fecha_inicio.slice(0, 10) : '',
      fecha_fin: c.fecha_fin ? c.fecha_fin.slice(0, 10) : '',
      limite_usos: c.limite_usos || ''
    });
    setError('');
    setModalOpen(true);
  };
 
  const handleSave = async () => {
    if (!form.codigo.trim() || !form.valor) { setError('Código y valor son obligatorios'); return; }
    setSaving(true);
    try {
      const body = { ...form, valor: parseFloat(form.valor), limite_usos: form.limite_usos ? parseInt(form.limite_usos) : null };
      if (editando) await apiFetch(`/marketing/cupones/${editando.id}`, { method: 'PUT', body: JSON.stringify(body) });
      else await apiFetch('/marketing/cupones', { method: 'POST', body: JSON.stringify(body) });
      setModalOpen(false);
      fetchCupones();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };
 
  const handleDelete = async () => {
    try {
      await apiFetch(`/marketing/cupones/${deleteModal.id}`, { method: 'DELETE' });
      setDeleteModal(null);
      fetchCupones();
    } catch (e) { console.error(e); }
  };
 
  const stats = {
    total: cupones.length,
    activos: cupones.filter(c => c.activo).length,
    inactivos: cupones.filter(c => !c.activo).length
  };
 
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Activos', value: stats.activos, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Inactivos', value: stats.inactivos, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
 
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Buscar por código..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <select value={filtro} onChange={e => setFiltro(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-300">
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Mostrando <span className="font-semibold text-gray-600">{cupones.length}</span> de <span className="font-semibold text-gray-600">{total}</span> cupones
        </p>
      </div>
 
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full border-4 border-purple-500 border-t-transparent w-10 h-10" /></div>
        ) : cupones.length === 0 ? (
          <EmptyState
            icon={<svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
            title="No hay cupones" subtitle="Aún no has creado ningún cupón" onAction={openCreate} actionLabel="Crear primer cupón"
          />
        ) : (
          <div className="divide-y divide-gray-50">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-2">Código</div>
              <div className="col-span-2">Tipo</div>
              <div className="col-span-2">Valor</div>
              <div className="col-span-2">Usos</div>
              <div className="col-span-2">Vence</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1 text-right">Acc.</div>
            </div>
            {cupones.map(c => (
              <div key={c.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-2"><span className="font-mono font-semibold text-sm text-purple-700 bg-purple-50 px-2 py-1 rounded">{c.codigo}</span></div>
                <div className="col-span-2 text-sm text-gray-600 capitalize">{c.tipo}</div>
                <div className="col-span-2 text-sm font-semibold text-gray-800">{c.tipo === 'porcentaje' ? `${c.valor}%` : `$${Number(c.valor).toLocaleString()}`}</div>
                <div className="col-span-2 text-sm text-gray-500">{c.usos_actuales}{c.limite_usos ? `/${c.limite_usos}` : ' / ∞'}</div>
                <div className="col-span-2 text-sm text-gray-500">{c.fecha_fin ? new Date(c.fecha_fin).toLocaleDateString('es-ES') : '—'}</div>
                <div className="col-span-1"><Badge active={c.activo} label={c.activo ? 'Activo' : 'Inactivo'} /></div>
                <div className="col-span-1 flex justify-end gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteModal(c)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Modal cupón */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editando ? 'Editar cupón' : 'Nuevo cupón'}>
        <div className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
            <input type="text" value={form.codigo} onChange={e => setForm(p => ({ ...p, codigo: e.target.value.toUpperCase() }))}
              placeholder="Ej: DESCUENTO20"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300">
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="fijo">Valor fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
              <input type="number" min="0" max={form.tipo === 'porcentaje' ? 100 : undefined} value={form.valor}
                onChange={e => setForm(p => ({ ...p, valor: e.target.value }))}
                placeholder={form.tipo === 'porcentaje' ? 'Ej: 20' : 'Ej: 5000'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} rows={2}
              placeholder="Descripción opcional"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input type="date" value={form.fecha_inicio} onChange={e => setForm(p => ({ ...p, fecha_inicio: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input type="date" value={form.fecha_fin} onChange={e => setForm(p => ({ ...p, fecha_fin: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Límite de usos</label>
            <input type="number" min="1" value={form.limite_usos} onChange={e => setForm(p => ({ ...p, limite_usos: e.target.value }))}
              placeholder="Vacío = ilimitado"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(p => ({ ...p, activo: !p.activo }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.activo ? 'bg-purple-600' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.activo ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm text-gray-600">{form.activo ? 'Cupón activo' : 'Cupón inactivo'}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
              {saving ? 'Guardando...' : editando ? 'Actualizar' : 'Crear cupón'}
            </button>
          </div>
        </div>
      </Modal>
 
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar cupón">
        <p className="text-gray-600 text-sm mb-6">
          ¿Eliminar el cupón <span className="font-mono font-bold text-purple-700">{deleteModal?.codigo}</span>? No se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600">Eliminar</button>
        </div>
      </Modal>
    </>
  );
};
 
// ── PROMOCIONES ───────────────────────────────────────────────────────────────
 
const PromocionesTab = ({ triggerCreate }) => {
  const [promociones, setPromociones] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', tipo_descuento: 'porcentaje',
    valor_descuento: '', fecha_inicio: '', fecha_fin: '', activa: true
  });
 
  const fetchPromociones = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: 1, limit: 50, search });
      if (filtro !== 'todos') params.append('activa', filtro === 'activas');
      const data = await apiFetch(`/marketing/promociones?${params}`);
      setPromociones(data.data.promociones || []);
      setTotal(data.data.total || 0);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [search, filtro]);
 
  useEffect(() => { fetchPromociones(); }, [fetchPromociones]);
  useEffect(() => { if (triggerCreate) openCreate(); }, [triggerCreate]);
 
  const openCreate = () => {
    setEditando(null);
    setProductosSeleccionados([]);
    setForm({ nombre: '', descripcion: '', tipo_descuento: 'porcentaje', valor_descuento: '', fecha_inicio: '', fecha_fin: '', activa: true });
    setError('');
    setModalOpen(true);
  };
 
  const openEdit = (p) => {
    setEditando(p);
    // Precargar productos ya asociados
    setProductosSeleccionados(p.productos?.map(prod => prod.id) || []);
    setForm({
      nombre: p.nombre, descripcion: p.descripcion || '',
      tipo_descuento: p.tipo_descuento, valor_descuento: p.valor_descuento,
      activa: p.activa,
      fecha_inicio: p.fecha_inicio ? p.fecha_inicio.slice(0, 10) : '',
      fecha_fin: p.fecha_fin ? p.fecha_fin.slice(0, 10) : ''
    });
    setError('');
    setModalOpen(true);
  };
 
  const handleSave = async () => {
    if (!form.nombre.trim() || !form.valor_descuento) { setError('Nombre y valor son obligatorios'); return; }
    setSaving(true);
    try {
      const body = {
        ...form,
        valor_descuento: parseFloat(form.valor_descuento),
        productos: productosSeleccionados  // ← array de IDs
      };
      if (editando) await apiFetch(`/marketing/promociones/${editando.id}`, { method: 'PUT', body: JSON.stringify(body) });
      else await apiFetch('/marketing/promociones', { method: 'POST', body: JSON.stringify(body) });
      setModalOpen(false);
      fetchPromociones();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };
 
  const handleDelete = async () => {
    try {
      await apiFetch(`/marketing/promociones/${deleteModal.id}`, { method: 'DELETE' });
      setDeleteModal(null);
      fetchPromociones();
    } catch (e) { console.error(e); }
  };
 
  const isVigente = (p) => {
    const now = new Date();
    if (p.fecha_inicio && new Date(p.fecha_inicio) > now) return false;
    if (p.fecha_fin && new Date(p.fecha_fin) < now) return false;
    return p.activa;
  };
 
  const stats = {
    total: promociones.length,
    activas: promociones.filter(p => p.activa).length,
    inactivas: promociones.filter(p => !p.activa).length
  };
 
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Activas', value: stats.activas, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Inactivas', value: stats.inactivas, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
 
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Buscar promoción..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <select value={filtro} onChange={e => setFiltro(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-300">
            <option value="todos">Todas</option>
            <option value="activas">Activas</option>
            <option value="inactivas">Inactivas</option>
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Mostrando <span className="font-semibold text-gray-600">{promociones.length}</span> de <span className="font-semibold text-gray-600">{total}</span> promociones
        </p>
      </div>
 
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full border-4 border-purple-500 border-t-transparent w-10 h-10" /></div>
        ) : promociones.length === 0 ? (
          <EmptyState
            icon={<svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>}
            title="No hay promociones" subtitle="Aún no has creado ninguna promoción" onAction={openCreate} actionLabel="Crear primera promoción"
          />
        ) : (
          <div className="divide-y divide-gray-50">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-3">Nombre</div>
              <div className="col-span-2">Descuento</div>
              <div className="col-span-2">Productos</div>
              <div className="col-span-2">Vence</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-1 text-right">Acc.</div>
            </div>
            {promociones.map(p => (
              <div key={p.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-3">
                  <p className="font-medium text-sm text-gray-900 truncate">{p.nombre}</p>
                  {p.descripcion && <p className="text-xs text-gray-400 truncate">{p.descripcion}</p>}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-sm text-purple-700 bg-purple-50 px-2 py-1 rounded">
                    {p.tipo_descuento === 'porcentaje' ? `${p.valor_descuento}%` : `$${Number(p.valor_descuento).toLocaleString()}`}
                  </span>
                </div>
                <div className="col-span-2">
                  {p.productos?.length > 0 ? (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                      {p.productos.length} producto{p.productos.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Toda la tienda</span>
                  )}
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {p.fecha_fin ? new Date(p.fecha_fin).toLocaleDateString('es-ES') : '—'}
                </div>
                <div className="col-span-2">
                  <Badge active={isVigente(p)} label={isVigente(p) ? 'Vigente' : p.activa ? 'Fuera de fecha' : 'Inactiva'} />
                </div>
                <div className="col-span-1 flex justify-end gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 rounded-lg">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteModal(p)} className="p-1.5 hover:bg-red-50 rounded-lg">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Modal promoción */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editando ? 'Editar promoción' : 'Nueva promoción'}>
        <div className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input type="text" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej: Black Friday 2025"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} rows={2}
              placeholder="Descripción de la promoción"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo descuento *</label>
              <select value={form.tipo_descuento} onChange={e => setForm(p => ({ ...p, tipo_descuento: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300">
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="fijo">Valor fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
              <input type="number" min="0" value={form.valor_descuento} onChange={e => setForm(p => ({ ...p, valor_descuento: e.target.value }))}
                placeholder={form.tipo_descuento === 'porcentaje' ? 'Ej: 15' : 'Ej: 10000'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input type="date" value={form.fecha_inicio} onChange={e => setForm(p => ({ ...p, fecha_inicio: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input type="date" value={form.fecha_fin} onChange={e => setForm(p => ({ ...p, fecha_fin: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
          </div>
 
          {/* Selector de productos */}
          <ProductosSelector
            seleccionados={productosSeleccionados}
            onChange={setProductosSeleccionados}
          />
 
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(p => ({ ...p, activa: !p.activa }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.activa ? 'bg-purple-600' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.activa ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm text-gray-600">{form.activa ? 'Promoción activa' : 'Promoción inactiva'}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
              {saving ? 'Guardando...' : editando ? 'Actualizar' : 'Crear promoción'}
            </button>
          </div>
        </div>
      </Modal>
 
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar promoción">
        <p className="text-gray-600 text-sm mb-6">
          ¿Eliminar la promoción <span className="font-bold text-gray-900">"{deleteModal?.nombre}"</span>? No se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600">Eliminar</button>
        </div>
      </Modal>
    </>
  );
};
 
// ── PAGE PRINCIPAL ────────────────────────────────────────────────────────────
 
export default function MarketingPage() {
  const [tab, setTab] = useState('cupones');
  const [createTrigger, setCreateTrigger] = useState(0);
 
  return (
    <Layout activeItem="marketing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Marketing</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Gestiona cupones y promociones de tu tienda</p>
            </div>
          </div>
          <button
            onClick={() => setCreateTrigger(t => t + 1)}
            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {tab === 'cupones' ? 'Nuevo cupón' : 'Nueva promoción'}
          </button>
        </div>
 
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {[{ id: 'cupones', label: 'Cupones', emoji: '🎟️' }, { id: 'promociones', label: 'Promociones', emoji: '📣' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <span>{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>
 
        {/* Contenido */}
        {tab === 'cupones'
          ? <CuponesTab triggerCreate={createTrigger} />
          : <PromocionesTab triggerCreate={createTrigger} />
        }
      </div>
    </Layout>
  );
}