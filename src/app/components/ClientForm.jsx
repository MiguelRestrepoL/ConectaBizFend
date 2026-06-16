'use client';
 
import React, { useState, useEffect } from 'react';
import { PAISES, getDepartamentos, getCiudadesColombia } from './geodata';
 
// Datos de actividades económicas y CIIU
const actividadesEconomicas = {
  'Comercio': [
    { codigo: '4711', descripcion: 'Comercio al por menor en establecimientos no especializados con surtido compuesto principalmente de alimentos, bebidas o tabaco' },
    { codigo: '4759', descripcion: 'Comercio al por menor de muebles, artículos para el hogar y ferretería' },
    { codigo: '4761', descripcion: 'Comercio al por menor de libros, periódicos, materiales y artículos de papelería y escritorio' }
  ],
  'Servicios Profesionales': [
    { codigo: '6201', descripcion: 'Actividades de desarrollo de sistemas informáticos' },
    { codigo: '6202', descripcion: 'Actividades de consultoría informática y actividades de administración de instalaciones informáticas' },
    { codigo: '7020', descripcion: 'Actividades de consultoría de gestión' }
  ],
  'Manufactura': [
    { codigo: '1520', descripcion: 'Fabricación de calzado' },
    { codigo: '1410', descripcion: 'Confección de prendas de vestir, excepto prendas de piel' },
    { codigo: '2511', descripcion: 'Fabricación de productos metálicos para uso estructural' }
  ],
  'Construcción': [
    { codigo: '4100', descripcion: 'Construcción de edificios' },
    { codigo: '4210', descripcion: 'Construcción de carreteras y vías de ferrocarril' },
    { codigo: '4312', descripcion: 'Preparación del terreno' }
  ],
  'Restaurantes y Hoteles': [
    { codigo: '5510', descripcion: 'Alojamiento en hoteles' },
    { codigo: '5611', descripcion: 'Expendio a la mesa de comidas preparadas' },
    { codigo: '5619', descripcion: 'Otros tipos de expendio de comidas preparadas n.c.p.' }
  ]
};
 
// Función para calcular el dígito de verificación
const calcularDigitoVerificacion = (nit) => {
  if (!nit || nit.length === 0) return '';
  const vpri = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  let suma = 0;
  const nitString = nit.toString().replace(/\D/g, '');
  for (let i = 0; i < nitString.length; i++) {
    suma += parseInt(nitString[nitString.length - 1 - i]) * vpri[i];
  }
  const residuo = suma % 11;
  if (residuo === 0 || residuo === 1) return residuo.toString();
  return (11 - residuo).toString();
};
 
// ── COMPONENTES BÁSICOS ───────────────────────────────────────────────────────
 
const FormField = ({ label, error, required, ...props }) => (
  <div>
    <label className="text-sm font-medium text-black mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-2.5 sm:py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base text-black`}
    />
    {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
  </div>
);
 
const SelectField = ({ label, options, placeholder, error, required, ...props }) => (
  <div>
    <label className="text-sm font-medium text-black mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`w-full px-3 py-2.5 sm:py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base text-black`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
  </div>
);
 
const RadioGroup = ({ name, value, onChange, options, required }) => (
  <div className="space-y-2">
    {options.map(option => (
      <label key={option.value} className="flex items-center cursor-pointer">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          required={required}
          className="mr-3 text-purple-600 focus:ring-purple-500 w-4 h-4"
        />
        <span className="text-sm text-black">{option.label}</span>
      </label>
    ))}
  </div>
);
 
const PhoneInput = ({ label, value, onChange, countryCode, onCountryCodeChange, error, required }) => (
  <div>
    <label className="text-sm font-medium text-black mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={onCountryCodeChange}
        className="w-20 sm:w-24 px-2 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base text-black"
      >
        <option value="+57">🇨🇴 +57</option>
        <option value="+1">🇺🇸 +1</option>
        <option value="+52">🇲🇽 +52</option>
        <option value="+34">🇪🇸 +34</option>
      </select>
      <input
        type="tel"
        value={value}
        onChange={onChange}
        className={`flex-1 px-3 py-2.5 sm:py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base text-black`}
      />
    </div>
    {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
  </div>
);
 
const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base text-black"
  />
);
 
const TagInput = ({ value = [], onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const addTag = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };
  const removeTag = (tagToRemove) => onChange(value.filter(tag => tag !== tagToRemove));
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base text-black"
        />
        <button type="button" onClick={addTag} className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm sm:text-base whitespace-nowrap">
          Agregar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <span key={index} className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 sm:ml-2 text-purple-600 hover:text-purple-800 font-bold">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};
 
// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
 
const ClientForm = ({ onSubmit, loading = false, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    tipo_cliente: 'persona_natural',
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
    direccion: '',
    ciudad: '',
    pais_residencia: '',
    apartamento_local: '',
    codigo_postal: '',
    departamento_estado: '',
    telefono_residencia: '',
    codigo_pais_residencia: '+57',
    recaudar_impuestos: 'recaudar',
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
    notas: '',
    etiquetas: [],
    estado: 'Activo'
  });
 
  const [errors, setErrors] = useState({});
  const [ciuuOptions, setCiuuOptions] = useState([]);
 
  // ── GEO: estado derivado de los datos hardcodeados (sin fetch) ────────────
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [esColombia, setEsColombia] = useState(false);
 
  // Cargar initialData
  useEffect(() => {
    if (initialData) {
      const hasNestedStructure = initialData.tipo_cliente &&
        (initialData.persona_natural || initialData.persona_juridica);
      if (hasNestedStructure) {
        setFormData(initialData);
      } else {
        setFormData(prev => ({ ...prev, ...initialData }));
      }
    }
  }, [initialData]);
 
  // ── REEMPLAZA los 3 useEffects de restcountries + geonames ───────────────
  // Cuando cambia el país: calcular departamentos desde geodata (sin fetch)
  useEffect(() => {
    const { departamentos: deptos, esColombia: esCo } = getDepartamentos(formData.pais_residencia);
    setDepartamentos(deptos);
    setEsColombia(esCo);
    setCiudades([]);
  }, [formData.pais_residencia]);
 
  // Cuando cambia el departamento: calcular ciudades desde geodata (sin fetch) A
  useEffect(() => {
    if (!formData.departamento_estado) {
      setCiudades([]);
      return;
    }
    if (esColombia) {
      setCiudades(getCiudadesColombia(formData.departamento_estado));
    } else {
      // Para otros países no tenemos ciudades hardcodeadas → campo libre
      setCiudades([]);
    }
  }, [formData.departamento_estado, esColombia]);
 
  // DV automático
  useEffect(() => {
    if (formData.nit && formData.tipo_cliente === 'persona_juridica') {
      const dv = calcularDigitoVerificacion(formData.nit);
      if (dv !== formData.digito_verificacion) {
        setFormData(prev => ({ ...prev, digito_verificacion: dv }));
      }
    }
  }, [formData.nit, formData.tipo_cliente]);
 
  // CIIU options
  useEffect(() => {
    if (formData.actividad_economica && actividadesEconomicas[formData.actividad_economica]) {
      setCiuuOptions(actividadesEconomicas[formData.actividad_economica]);
      const codigosDisponibles = actividadesEconomicas[formData.actividad_economica].map(c => c.codigo);
      if (formData.codigo_ciiu && !codigosDisponibles.includes(formData.codigo_ciiu)) {
        setFormData(prev => ({ ...prev, codigo_ciiu: '' }));
      }
    } else {
      setCiuuOptions([]);
    }
  }, [formData.actividad_economica]);
 
  const handleInputChange = (field, value) => {
    const processedValue = (value === null || value === undefined) ? '' : value;
 
    if (field === 'pais_residencia') {
      setFormData(prev => ({ ...prev, [field]: processedValue, departamento_estado: '', ciudad: '' }));
    } else if (field === 'departamento_estado') {
      setFormData(prev => ({ ...prev, [field]: processedValue, ciudad: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: processedValue }));
    }
 
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
 
  const validateForm = () => {
    const newErrors = {};
    if (!formData.correo_electronico.trim()) {
      newErrors.correo_electronico = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'El correo electrónico no es válido';
    }
    if (!formData.numero_telefono.trim()) newErrors.numero_telefono = 'El número de teléfono es requerido';
    if (formData.tipo_cliente === 'persona_natural') {
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
      if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    } else if (formData.tipo_cliente === 'persona_juridica') {
      if (!formData.razon_social.trim()) newErrors.razon_social = 'La razón social es requerida';
      if (!formData.nit.trim()) newErrors.nit = 'El NIT es requerido';
      if (!formData.representante_legal.trim()) newErrors.representante_legal = 'El representante legal es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const cleanFormData = (data) => {
    const cleaned = { ...data };
    if (!cleaned.tipo_cliente) cleaned.tipo_cliente = 'persona_natural';
    if (!cleaned.estado) cleaned.estado = 'Activo';
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === null || cleaned[key] === undefined) cleaned[key] = '';
    });
    if (!Array.isArray(cleaned.etiquetas)) cleaned.etiquetas = [];
    return cleaned;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(cleanFormData(formData));
  };
 
  const handleInactivate = () => {
    if (window.confirm('¿Está seguro que desea inactivar este cliente?')) {
      onSubmit({ ...formData, estado: 'Inactivo' });
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
  const actividadEconomicaOptions = Object.keys(actividadesEconomicas).map(key => ({ value: key, label: key }));
  const idiomaOptions = [
    { value: 'Español', label: 'Español (Predeterminado)' },
    { value: 'English', label: 'English' },
    { value: 'Português', label: 'Português' },
    { value: 'Français', label: 'Français' }
  ];
  const taxOptions = [
    { value: 'recaudar', label: 'Recaudar impuestos' },
    { value: 'recaudar_con_excepcion', label: 'Realizar recaudación de impuestos a menos que haya excepción' },
    { value: 'no_recaudar', label: 'No recaudar impuestos' }
  ];
 
  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* BADGE DE ESTADO (solo en edit) */}
      {isEdit && (
        <div className={`p-4 rounded-lg ${formData.estado === 'Activo' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${formData.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-medium text-sm sm:text-base text-black">Estado del cliente: {formData.estado}</span>
            </div>
            {formData.estado === 'Activo' && (
              <button type="button" onClick={handleInactivate} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Inactivar Cliente
              </button>
            )}
          </div>
        </div>
      )}
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
 
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
 
          {/* CARD 1: Información del Cliente */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Información del Cliente</h3>
            <div className="mb-4 sm:mb-6">
              <RadioGroup name="tipo_cliente" value={formData.tipo_cliente} onChange={(e) => handleInputChange('tipo_cliente', e.target.value)} options={tipoClienteOptions} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.tipo_cliente === 'persona_natural' && (
                <>
                  <FormField label="Nombre" value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} required error={errors.nombre} />
                  <FormField label="Apellido" value={formData.apellido} onChange={(e) => handleInputChange('apellido', e.target.value)} required error={errors.apellido} />
                  <FormField label="Segundo nombre" value={formData.segundo_nombre} onChange={(e) => handleInputChange('segundo_nombre', e.target.value)} />
                  <FormField label="Segundo Apellido" value={formData.segundo_apellido} onChange={(e) => handleInputChange('segundo_apellido', e.target.value)} />
                  <FormField label="Nacionalidad" value={formData.nacionalidad} onChange={(e) => handleInputChange('nacionalidad', e.target.value)} />
                </>
              )}
              {formData.tipo_cliente === 'persona_juridica' && (
                <>
                  <FormField label="Razón Social" value={formData.razon_social} onChange={(e) => handleInputChange('razon_social', e.target.value)} required error={errors.razon_social} />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormField label="NIT" value={formData.nit} onChange={(e) => handleInputChange('nit', e.target.value)} required error={errors.nit} />
                    </div>
                    <div className="w-16 sm:w-20">
                      <FormField label="DV" value={formData.digito_verificacion} readOnly disabled title="El dígito de verificación se calcula automáticamente" />
                    </div>
                  </div>
                  <SelectField label="Tipo de Empresa" value={formData.tipo_empresa} onChange={(e) => handleInputChange('tipo_empresa', e.target.value)} options={tipoEmpresaOptions} placeholder="Seleccionar tipo" />
                  <FormField label="Representante Legal" value={formData.representante_legal} onChange={(e) => handleInputChange('representante_legal', e.target.value)} required error={errors.representante_legal} />
                  <FormField label="Cédula del Representante" value={formData.cedula_representante} onChange={(e) => handleInputChange('cedula_representante', e.target.value)} />
                  <SelectField label="Actividad Económica" value={formData.actividad_economica} onChange={(e) => handleInputChange('actividad_economica', e.target.value)} options={actividadEconomicaOptions} placeholder="Seleccionar actividad" />
                  <SelectField label="Código CIIU" value={formData.codigo_ciiu} onChange={(e) => handleInputChange('codigo_ciiu', e.target.value)} options={ciuuOptions.map(c => ({ value: c.codigo, label: `${c.codigo} - ${c.descripcion}` }))} placeholder={ciuuOptions.length > 0 ? "Seleccionar código" : "Primero seleccione una actividad económica"} disabled={ciuuOptions.length === 0} />
                  <FormField label="Fecha de Constitución" type="date" value={formData.fecha_constitucion} onChange={(e) => handleInputChange('fecha_constitucion', e.target.value)} />
                  <FormField label="Capital Social" type="number" value={formData.capital_social} onChange={(e) => handleInputChange('capital_social', e.target.value)} placeholder="Ej: 50000000" />
                </>
              )}
              <SelectField label="Idioma" value={formData.idioma} onChange={(e) => handleInputChange('idioma', e.target.value)} options={idiomaOptions} />
            </div>
          </div>
 
          {/* CARD 2: Contacto */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormField label="Correo Electrónico" type="email" value={formData.correo_electronico} onChange={(e) => handleInputChange('correo_electronico', e.target.value)} required error={errors.correo_electronico} />
              </div>
              <PhoneInput label="Número de Teléfono" value={formData.numero_telefono} onChange={(e) => handleInputChange('numero_telefono', e.target.value)} countryCode={formData.codigo_pais_telefono} onCountryCodeChange={(e) => handleInputChange('codigo_pais_telefono', e.target.value)} required error={errors.numero_telefono} />
              <PhoneInput label="Teléfono de Residencia" value={formData.telefono_residencia} onChange={(e) => handleInputChange('telefono_residencia', e.target.value)} countryCode={formData.codigo_pais_residencia} onCountryCodeChange={(e) => handleInputChange('codigo_pais_residencia', e.target.value)} />
            </div>
            <div className="mt-4 space-y-3">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.recibe_emails_marketing} onChange={(e) => handleInputChange('recibe_emails_marketing', e.target.checked)} className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500 rounded" />
                <span className="text-sm text-black">Acepta recibir emails de marketing</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.recibe_sms_marketing} onChange={(e) => handleInputChange('recibe_sms_marketing', e.target.checked)} className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500 rounded" />
                <span className="text-sm text-black">Acepta recibir SMS de marketing</span>
              </label>
            </div>
          </div>
 
          {/* CARD 3: Dirección */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Dirección</h3>
            <div className="space-y-4">
              <FormField label="Dirección" value={formData.direccion} onChange={(e) => handleInputChange('direccion', e.target.value)} placeholder="Ej: Calle 123 #45-67" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Apartamento/Local" value={formData.apartamento_local} onChange={(e) => handleInputChange('apartamento_local', e.target.value)} placeholder="Ej: Apto 301" />
                <FormField label="Código Postal" value={formData.codigo_postal} onChange={(e) => handleInputChange('codigo_postal', e.target.value)} placeholder="Ej: 110111" />
              </div>
 
              {/* País → Departamento → Ciudad (100% hardcodeado, 0 fetches) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField
                  label="País de Residencia"
                  value={formData.pais_residencia}
                  onChange={(e) => handleInputChange('pais_residencia', e.target.value)}
                  options={PAISES.map(p => ({ value: p.nombre, label: p.nombre }))}
                  placeholder="Seleccionar país"
                />
 
                {/* Si es Colombia → select con departamentos hardcodeados
                    Si es otro país → input libre */}
                {esColombia ? (
                  <SelectField
                    label="Departamento/Estado"
                    value={formData.departamento_estado}
                    onChange={(e) => handleInputChange('departamento_estado', e.target.value)}
                    options={departamentos.map(d => ({ value: d, label: d }))}
                    placeholder={!formData.pais_residencia ? "Primero seleccione un país" : "Seleccionar departamento"}
                    disabled={!formData.pais_residencia}
                  />
                ) : (
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block">Departamento/Estado</label>
                    <input
                      value={formData.departamento_estado}
                      onChange={(e) => handleInputChange('departamento_estado', e.target.value)}
                      placeholder={!formData.pais_residencia ? "Primero seleccione un país" : "Escribe el departamento"}
                      disabled={!formData.pais_residencia}
                      className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base text-black disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>
                )}
 
                {/* Si es Colombia y hay ciudades → select, si no → input libre */}
                {esColombia && ciudades.length > 0 ? (
                  <SelectField
                    label="Ciudad"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    options={ciudades.map(c => ({ value: c, label: c }))}
                    placeholder={!formData.departamento_estado ? "Primero seleccione un departamento" : "Seleccionar ciudad"}
                    disabled={!formData.departamento_estado}
                  />
                ) : (
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block">Ciudad</label>
                    <input
                      value={formData.ciudad}
                      onChange={(e) => handleInputChange('ciudad', e.target.value)}
                      placeholder={!formData.departamento_estado ? "Primero seleccione un departamento" : "Escribe la ciudad"}
                      disabled={!formData.departamento_estado}
                      className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base text-black disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
 
          {/* CARD 4: Notas y Etiquetas */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Notas y Etiquetas</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Notas</label>
                <TextArea value={formData.notas} onChange={(e) => handleInputChange('notas', e.target.value)} placeholder="Agrega notas sobre este cliente..." rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Etiquetas</label>
                <TagInput value={formData.etiquetas} onChange={(newTags) => handleInputChange('etiquetas', newTags)} placeholder="Escribe una etiqueta y presiona Enter" />
              </div>
            </div>
          </div>
        </div>
 
        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Impuestos</h3>
            <RadioGroup name="recaudar_impuestos" value={formData.recaudar_impuestos} onChange={(e) => handleInputChange('recaudar_impuestos', e.target.value)} options={taxOptions} required />
          </div>
 
          <div className="lg:sticky lg:top-24 bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="space-y-3">
              <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <span>{isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}</span>
                )}
              </button>
              <button type="button" onClick={() => window.history.back()} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base">
                Cancelar
              </button>
            </div>
            <div className="hidden lg:block mt-6 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-2">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Los campos con * son obligatorios
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Los datos están protegidos y encriptados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
 
export default ClientForm;