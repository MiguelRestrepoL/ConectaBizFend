import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import SelectField from './SelectField';
import RadioGroup from './RadioGroup';
import PhoneInput from './PhoneInput';
import TextArea from './TextArea';
import TagInput from './TagInput';

const ClientForm = ({ onSubmit, loading = false, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData || {
    // Información personal
    nombre: '',
    apellido: '',
    segundo_nombre: '',
    segundo_apellido: '',
    nacionalidad: '',
    idioma: 'Español',
    correo_electronico: '',
    numero_telefono: '',
    codigo_pais_telefono: '+57',
    recibe_emails_marketing: false,
    recibe_sms_marketing: false,
    
    // Información de dirección
    direccion: '',
    ciudad: '',
    pais_residencia: '',
    apartamento_local: '',
    codigo_postal: '',
    departamento_estado: '',
    telefono_residencia: '',
    codigo_pais_residencia: '+57',
    
    // Información fiscal
    recaudar_impuestos: 'recaudar',
    
    // Notas y etiquetas
    notas: '',
    etiquetas: []
  });

  const [errors, setErrors] = useState({});

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

  const handlePhoneChange = (field, value) => {
    handleInputChange(field, value);
  };

  const handleCountryCodeChange = (field, value) => {
    handleInputChange(field, value);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.correo_electronico.trim()) {
      newErrors.correo_electronico = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'El correo electrónico no es válido';
    }
    if (!formData.numero_telefono.trim()) newErrors.numero_telefono = 'El número de teléfono es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const idiomaOptions = [
    { value: 'Español', label: 'Español (Predeterminado)' },
    { value: 'English', label: 'English' },
    { value: 'Português', label: 'Português' },
    { value: 'Français', label: 'Français' }
  ];

  const departamentoOptions = [
    { value: 'Antioquia', label: 'Antioquia' },
    { value: 'Cundinamarca', label: 'Cundinamarca' },
    { value: 'Valle del Cauca', label: 'Valle del Cauca' },
    { value: 'Atlántico', label: 'Atlántico' },
    { value: 'Santander', label: 'Santander' },
    { value: 'Bolívar', label: 'Bolívar' },
    { value: 'Nariño', label: 'Nariño' },
    { value: 'Córdoba', label: 'Córdoba' },
    { value: 'Tolima', label: 'Tolima' },
    { value: 'Huila', label: 'Huila' }
  ];

  const taxOptions = [
    { value: 'recaudar', label: 'Recaudar impuestos' },
    { value: 'recaudar_con_excepcion', label: 'Realizar recaudación de impuestos a menos que haya excepción' },
    { value: 'no_recaudar', label: 'No recaudar impuestos' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Personal */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                required
                error={errors.nombre}
              />
              <FormField
                label="Apellido"
                value={formData.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                required
                error={errors.apellido}
              />
              <FormField
                label="Segundo nombre"
                value={formData.segundo_nombre}
                onChange={(e) => handleInputChange('segundo_nombre', e.target.value)}
              />
              <FormField
                label="Segundo Apellido"
                value={formData.segundo_apellido}
                onChange={(e) => handleInputChange('segundo_apellido', e.target.value)}
              />
              <FormField
                label="Nacionalidad"
                value={formData.nacionalidad}
                onChange={(e) => handleInputChange('nacionalidad', e.target.value)}
              />
              <SelectField
                label="Idioma"
                value={formData.idioma}
                onChange={(e) => handleInputChange('idioma', e.target.value)}
                options={idiomaOptions}
                required
              />
              <FormField
                label="Correo electrónico"
                type="email"
                value={formData.correo_electronico}
                onChange={(e) => handleInputChange('correo_electronico', e.target.value)}
                required
                error={errors.correo_electronico}
              />
              <PhoneInput
                label="Número de teléfono"
                value={formData.numero_telefono}
                onChange={(e) => handlePhoneChange('numero_telefono', e.target.value)}
                countryCode={formData.codigo_pais_telefono}
                onCountryCodeChange={(e) => handleCountryCodeChange('codigo_pais_telefono', e.target.value)}
                required
                error={errors.numero_telefono}
              />
            </div>
            
            {/* Preferencias de Marketing */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Preferencias de Marketing</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.recibe_emails_marketing}
                    onChange={(e) => handleInputChange('recibe_emails_marketing', e.target.checked)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">El cliente desea recibir correos electrónicos de marketing</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.recibe_sms_marketing}
                    onChange={(e) => handleInputChange('recibe_sms_marketing', e.target.checked)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">El cliente aceptó recibir mensajes SMS de Marketing</span>
                </label>
              </div>
            </div>
          </div>

          {/* Información de Dirección */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Dirección</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
              />
              <FormField
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
              />
              <div className="flex">
                <div className="w-16 mr-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">País</label>
                  <select
                    value={formData.pais_residencia}
                    onChange={(e) => handleInputChange('pais_residencia', e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Colombia">🇨🇴 Colombia</option>
                    <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                    <option value="México">🇲🇽 México</option>
                    <option value="España">🇪🇸 España</option>
                    <option value="Argentina">🇦🇷 Argentina</option>
                    <option value="Chile">🇨🇱 Chile</option>
                    <option value="Perú">🇵🇪 Perú</option>
                    <option value="Bolivia">🇧🇴 Bolivia</option>
                    <option value="Uruguay">🇺🇾 Uruguay</option>
                    <option value="Paraguay">🇵🇾 Paraguay</option>
                  </select>
                </div>
                <div className="flex-1">
                  <FormField
                    label="País de residencia"
                    value={formData.pais_residencia}
                    onChange={(e) => handleInputChange('pais_residencia', e.target.value)}
                  />
                </div>
              </div>
              <FormField
                label="Apartamento, local, etc"
                value={formData.apartamento_local}
                onChange={(e) => handleInputChange('apartamento_local', e.target.value)}
              />
              <FormField
                label="Código postal"
                value={formData.codigo_postal}
                onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
              />
              <SelectField
                label="Departamento, estado, etc"
                value={formData.departamento_estado}
                onChange={(e) => handleInputChange('departamento_estado', e.target.value)}
                options={departamentoOptions}
                placeholder="Seleccionar departamento"
              />
              <PhoneInput
                label="Teléfono de la residencia"
                value={formData.telefono_residencia}
                onChange={(e) => handlePhoneChange('telefono_residencia', e.target.value)}
                countryCode={formData.codigo_pais_residencia}
                onCountryCodeChange={(e) => handleCountryCodeChange('codigo_pais_residencia', e.target.value)}
              />
            </div>
          </div>

          {/* Información Fiscal */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Fiscal</h3>
            <RadioGroup
              name="recaudar_impuestos"
              value={formData.recaudar_impuestos}
              onChange={(e) => handleInputChange('recaudar_impuestos', e.target.value)}
              options={taxOptions}
              required
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          {/* Notas del Cliente */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notas sobre el cliente</h3>
              <svg className="w-4 h-4 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Las notas sobre el cliente son privadas hasta para él, así que anote lo necesario sobre el mismo
            </p>
            <TextArea
              value={formData.notas}
              onChange={(e) => handleInputChange('notas', e.target.value)}
              placeholder="Escribir notas aquí..."
              rows={6}
            />
          </div>

          {/* Etiquetas del Cliente */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas del cliente</h3>
            <TagInput
              value={formData.etiquetas}
              onChange={(value) => handleInputChange('etiquetas', value)}
              placeholder="Agregar etiqueta..."
            />
            <p className="text-sm text-gray-600 mt-3">
              En caso de que no se entienda, con etiquetas puede hacerle como labels al cliente, es decir, categorizarlo (ej: buena paga, activo, amable, etc.)
            </p>
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
          {loading ? (isEdit ? 'Actualizando...' : 'Guardando...') : (isEdit ? 'Actualizar Cliente' : 'Guardar Cliente')}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
