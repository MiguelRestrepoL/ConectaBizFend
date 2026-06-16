'use client';
 
import React, { useState, useEffect } from 'react';
import { createProveedor, updateProveedor } from '../api/proveedores';
 
const ProveedorFormModal = ({ isOpen, onClose, onSaved, proveedor = null }) => {
  const isEditing = !!proveedor;
 
  const [formData, setFormData] = useState({
    nombre: '', contacto: '', correo: '', telefono: '',
    direccion: '', ciudad: '', pais: '', notas: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    if (proveedor) {
      setFormData({
        nombre: proveedor.nombre || '',
        contacto: proveedor.contacto || '',
        correo: proveedor.correo || '',
        telefono: proveedor.telefono || '',
        direccion: proveedor.direccion || '',
        ciudad: proveedor.ciudad || '',
        pais: proveedor.pais || '',
        notas: proveedor.notas || ''
      });
    } else {
      setFormData({ nombre: '', contacto: '', correo: '', telefono: '', direccion: '', ciudad: '', pais: '', notas: '' });
    }
    setErrors({});
    setSubmitError('');
  }, [proveedor, isOpen]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
 
  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (formData.correo.trim() && !/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
 
    setLoading(true);
    try {
      const payload = {
        ...formData,
        correo: formData.correo.trim() || null,
        contacto: formData.contacto.trim() || null,
        telefono: formData.telefono.trim() || null,
        direccion: formData.direccion.trim() || null,
        ciudad: formData.ciudad.trim() || null,
        pais: formData.pais.trim() || null,
        notas: formData.notas.trim() || null
      };
 
      const result = isEditing
        ? await updateProveedor(proveedor.id, payload)
        : await createProveedor(payload);
 
      if (result.success) {
        onSaved && onSaved();
        onClose();
      } else {
        setSubmitError(result.error || 'Error al guardar el proveedor');
      }
    } catch (err) {
      setSubmitError('Error de conexión al guardar el proveedor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
 
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Proveedor' : 'Agregar Proveedor'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={loading}>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
 
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}
 
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del proveedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Distribuidora ABC S.A.S"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>
 
          {/* Contacto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Persona de contacto</label>
            <input
              type="text"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          {/* Correo + Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="proveedor@correo.com"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.correo ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 3001234567"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
 
          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej: Calle 10 # 20-30"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          {/* Ciudad + País */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Ej: Cali"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                placeholder="Ej: Colombia"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
 
          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={3}
              placeholder="Información adicional sobre el proveedor..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
 
          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                isEditing ? 'Guardar cambios' : 'Crear proveedor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default ProveedorFormModal;