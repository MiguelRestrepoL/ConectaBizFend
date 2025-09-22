import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import SelectField from './SelectField';
import RadioGroup from './RadioGroup';
import PhoneInput from './PhoneInput';
import TextArea from './TextArea';
import TagInput from './TagInput';

const ClientForm = ({ onSubmit, loading = false, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData || {
    // Tipo de cliente
    tipo_cliente: 'persona_natural',
    
    // Información personal (para persona natural)
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
    
    // Información para persona jurídica
    razon_social: '',
    nit: '',
    digito_verificacion: '',
    representante_legal: '',
    cedula_representante: '',
    tipo_empresa: '',
    actividad_economica: '',
    codigo_ciiu: '',
    fecha_constitucion: '',
    capital_social: '',
    
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
    // Convertir null/undefined a cadena vacía para campos de texto
    const processedValue = (value === null || value === undefined) ? '' : value;
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
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

    // Validaciones comunes
    if (!formData.correo_electronico.trim()) {
      newErrors.correo_electronico = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'El correo electrónico no es válido';
    }
    if (!formData.numero_telefono.trim()) newErrors.numero_telefono = 'El número de teléfono es requerido';

    // Validaciones condicionales según el tipo de cliente
    if (formData.tipo_cliente === 'persona_natural') {
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido para persona natural';
      if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido para persona natural';
    } else if (formData.tipo_cliente === 'persona_juridica') {
      if (!formData.razon_social.trim()) newErrors.razon_social = 'La razón social es requerida para persona jurídica';
      if (!formData.nit.trim()) newErrors.nit = 'El NIT es requerido para persona jurídica';
      if (!formData.representante_legal.trim()) newErrors.representante_legal = 'El representante legal es requerido para persona jurídica';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cleanFormData = (data) => {
    const cleaned = { ...data };
    
    // Asegurar que tipo_cliente esté presente
    if (!cleaned.tipo_cliente) {
      cleaned.tipo_cliente = 'persona_natural';
    }
    
    // Convertir todos los valores null/undefined a cadenas vacías
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === null || cleaned[key] === undefined) {
        cleaned[key] = '';
      }
    });
    
    // Asegurar que las etiquetas sean un array
    if (!Array.isArray(cleaned.etiquetas)) {
      cleaned.etiquetas = [];
    }
    
    return cleaned;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const cleanedData = cleanFormData(formData);
      console.log('Datos limpios a enviar:', cleanedData);
      onSubmit(cleanedData);
    }
  };

  const tipoClienteOptions = [
    { value: 'persona_natural', label: 'Persona Natural' },
    { value: 'persona_juridica', label: 'Persona Jurídica' }
  ];

  const tipoEmpresaOptions = [
    { value: 'SAS', label: 'SAS' },
    { value: 'LTDA', label: 'LTDA' },
    { value: 'SA', label: 'SA' },
    { value: 'SRL', label: 'SRL' },
    { value: 'EIRL', label: 'EIRL' },
    { value: 'SOCIEDAD_COLECTIVA', label: 'Sociedad Colectiva' },
    { value: 'SOCIEDAD_EN_COMANDITA', label: 'Sociedad en Comandita' },
    { value: 'OTRO', label: 'Otro' }
  ];

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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
            
            {/* Tipo de Cliente */}
            <div className="mb-6">
              <RadioGroup
                name="tipo_cliente"
                value={formData.tipo_cliente}
                onChange={(e) => handleInputChange('tipo_cliente', e.target.value)}
                options={tipoClienteOptions}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campos para Persona Natural */}
              {formData.tipo_cliente === 'persona_natural' && (
                <>
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
                </>
              )}

              {/* Campos para Persona Jurídica */}
              {formData.tipo_cliente === 'persona_juridica' && (
                <>
                  <FormField
                    label="Razón Social"
                    value={formData.razon_social}
                    onChange={(e) => handleInputChange('razon_social', e.target.value)}
                    required
                    error={errors.razon_social}
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormField
                        label="NIT"
                        value={formData.nit}
                        onChange={(e) => handleInputChange('nit', e.target.value)}
                        required
                        error={errors.nit}
                      />
                    </div>
                    <div className="w-20">
                      <FormField
                        label="DV"
                        value={formData.digito_verificacion}
                        onChange={(e) => handleInputChange('digito_verificacion', e.target.value)}
                        maxLength="1"
                      />
                    </div>
                  </div>
                  <SelectField
                    label="Tipo de Empresa"
                    value={formData.tipo_empresa}
                    onChange={(e) => handleInputChange('tipo_empresa', e.target.value)}
                    options={tipoEmpresaOptions}
                    placeholder="Seleccionar tipo"
                  />
                  <FormField
                    label="Representante Legal"
                    value={formData.representante_legal}
                    onChange={(e) => handleInputChange('representante_legal', e.target.value)}
                    required
                    error={errors.representante_legal}
                  />
                  <FormField
                    label="Cédula del Representante"
                    value={formData.cedula_representante}
                    onChange={(e) => handleInputChange('cedula_representante', e.target.value)}
                  />
                  <FormField
                    label="Actividad Económica"
                    value={formData.actividad_economica}
                    onChange={(e) => handleInputChange('actividad_economica', e.target.value)}
                  />
                  <FormField
                    label="Código CIIU"
                    value={formData.codigo_ciiu}
                    onChange={(e) => handleInputChange('codigo_ciiu', e.target.value)}
                  />
                  <FormField
                    label="Fecha de Constitución"
                    type="date"
                    value={formData.fecha_constitucion}
                    onChange={(e) => handleInputChange('fecha_constitucion', e.target.value)}
                  />
                  <FormField
                    label="Capital Social"
                    type="number"
                    value={formData.capital_social}
                    onChange={(e) => handleInputChange('capital_social', e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </>
              )}

              {/* Campos comunes */}
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
