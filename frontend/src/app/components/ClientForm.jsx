import React, { useState, useEffect } from 'react';

// Datos de actividades económicas y CIIU (ejemplo)
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

  if (residuo === 0 || residuo === 1) {
    return residuo.toString();
  } else {
    return (11 - residuo).toString();
  }
};

// Componentes básicos
const FormField = ({ label, error, required, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, options, placeholder, error, required, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`w-full px-3 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
          className="mr-3 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{option.label}</span>
      </label>
    ))}
  </div>
);

const PhoneInput = ({ label, value, onChange, countryCode, onCountryCodeChange, error, required }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={onCountryCodeChange}
        className="w-24 px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className={`flex-1 px-3 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Agregar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

const ClientForm = ({ onSubmit, loading = false, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData || {
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
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingGeo, setLoadingGeo] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Cargar lista de países con geonameId al montar el componente
  useEffect(() => {
    const cargarPaises = async () => {
      try {
        setLoadingGeo(true);
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,cca2,translations'
        );
        const data = await response.json();

        const paisesConGeoId = await Promise.all(
          data.map(async (pais) => {
            try {
              // Buscar el geonameId del país en GeoNames
              const geoResponse = await fetch(
                `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(pais.name.common)}&featureCode=PCLI&maxRows=1&username=keivch1304`
              );
              const geoData = await geoResponse.json();
              
              return {
                codigo: pais.cca2,
                nombre: pais.translations?.spa?.common || pais.name.common,
                nombreOriginal: pais.name.common,
                geonameId: geoData.geonames && geoData.geonames.length > 0 ? geoData.geonames[0].geonameId : null
              };
            } catch (error) {
              return {
                codigo: pais.cca2,
                nombre: pais.translations?.spa?.common || pais.name.common,
                nombreOriginal: pais.name.common,
                geonameId: null
              };
            }
          })
        );

        const paisesOrdenados = paisesConGeoId.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setPaises(paisesOrdenados);
      } catch (error) {
        console.log('Error cargando países:', error);
      } finally {
        setLoadingGeo(false);
      }
    };

    cargarPaises();
  }, []);

  // Cargar departamentos cuando cambia el país
  useEffect(() => {
    const cargarDepartamentos = async () => {
      if (!formData.pais_residencia) {
        setDepartamentos([]);
        setCiudades([]);
        return;
      }

      try {
        setLoadingGeo(true);
        const paisSeleccionado = paises.find(p => p.nombre === formData.pais_residencia);

        if (!paisSeleccionado || !paisSeleccionado.geonameId) {
          console.log('No se encontró geonameId para el país seleccionado');
          setDepartamentos([]);
          return;
        }

        const response = await fetch(
          `https://secure.geonames.org/childrenJSON?geonameId=${paisSeleccionado.geonameId}&username=keivch1304`
        );
        const data = await response.json();

        if (data.geonames && data.geonames.length > 0) {
          const deptosOrdenados = data.geonames
            .map(dept => ({
              geonameId: dept.geonameId,
              nombre: dept.name,
              adminName: dept.adminName1
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));

          setDepartamentos(deptosOrdenados);
        } else {
          setDepartamentos([]);
        }
      } catch (error) {
        console.log('Error cargando departamentos:', error);
        setDepartamentos([]);
      } finally {
        setLoadingGeo(false);
      }
    };

    cargarDepartamentos();
  }, [formData.pais_residencia, paises]);

  // Cargar ciudades cuando cambia el departamento
  useEffect(() => {
    const cargarCiudades = async () => {
      if (!formData.departamento_estado) {
        setCiudades([]);
        return;
      }

      try {
        setLoadingGeo(true);
        const deptoSeleccionado = departamentos.find(d => d.nombre === formData.departamento_estado);

        if (!deptoSeleccionado || !deptoSeleccionado.geonameId) {
          console.log('No se encontró geonameId para el departamento seleccionado');
          setCiudades([]);
          return;
        }

        console.log('Buscando ciudades para departamento:', deptoSeleccionado);

        // Primero intentamos con children
        let response = await fetch(
          `https://secure.geonames.org/childrenJSON?geonameId=${deptoSeleccionado.geonameId}&username=keivch1304`
        );
        let data = await response.json();

        let ciudadesEncontradas = [];

        // Si childrenJSON no devuelve resultados, intentamos con search
        if (!data.geonames || data.geonames.length === 0) {
          console.log('Intentando búsqueda alternativa de ciudades...');
          response = await fetch(
            `https://secure.geonames.org/searchJSON?adminCode1=${deptoSeleccionado.adminName || deptoSeleccionado.nombre}&country=${paises.find(p => p.nombre === formData.pais_residencia)?.codigo}&featureClass=P&maxRows=100&username=keivch1304`
          );
          data = await response.json();
        }

        if (data.geonames && data.geonames.length > 0) {
          // Filtramos ciudades (feature class P = populated places)
          ciudadesEncontradas = data.geonames
            .filter(lugar => 
              lugar.fcl === 'P' || 
              lugar.fcode === 'PPL' || 
              lugar.fcode === 'PPLA' || 
              lugar.fcode === 'PPLC' || 
              lugar.fcode === 'PPLA2' ||
              lugar.fcode === 'PPLA3' ||
              lugar.fcode === 'PPLA4'
            )
            .map(ciudad => ({
              nombre: ciudad.name,
              poblacion: ciudad.population || 0,
              geonameId: ciudad.geonameId
            }))
            .sort((a, b) => b.poblacion - a.poblacion || a.nombre.localeCompare(b.nombre));

          console.log(`Se encontraron ${ciudadesEncontradas.length} ciudades`);
          setCiudades(ciudadesEncontradas);
        } else {
          console.log('No se encontraron ciudades');
          setCiudades([]);
        }
      } catch (error) {
        console.log('Error cargando ciudades:', error);
        setCiudades([]);
      } finally {
        setLoadingGeo(false);
      }
    };

    cargarCiudades();
  }, [formData.departamento_estado, departamentos, formData.pais_residencia, paises]);

  // Calcular DV automáticamente cuando cambia el NIT
  useEffect(() => {
    if (formData.nit && formData.tipo_cliente === 'persona_juridica') {
      const dv = calcularDigitoVerificacion(formData.nit);
      if (dv !== formData.digito_verificacion) {
        setFormData(prev => ({
          ...prev,
          digito_verificacion: dv
        }));
      }
    }
  }, [formData.nit, formData.tipo_cliente]);

  // Actualizar opciones de CIIU cuando cambia la actividad económica
  useEffect(() => {
    if (formData.actividad_economica && actividadesEconomicas[formData.actividad_economica]) {
      setCiuuOptions(actividadesEconomicas[formData.actividad_economica]);
      const codigosDisponibles = actividadesEconomicas[formData.actividad_economica].map(c => c.codigo);
      if (formData.codigo_ciiu && !codigosDisponibles.includes(formData.codigo_ciiu)) {
        setFormData(prev => ({
          ...prev,
          codigo_ciiu: ''
        }));
      }
    } else {
      setCiuuOptions([]);
    }
  }, [formData.actividad_economica]);

  const handleInputChange = (field, value) => {
    const processedValue = (value === null || value === undefined) ? '' : value;

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    // Limpiar campos dependientes cuando cambia el país
    if (field === 'pais_residencia') {
      setFormData(prev => ({
        ...prev,
        [field]: processedValue,
        departamento_estado: '',
        ciudad: ''
      }));
      setDepartamentos([]);
      setCiudades([]);
    }

    // Limpiar ciudad cuando cambia el departamento
    if (field === 'departamento_estado') {
      setFormData(prev => ({
        ...prev,
        [field]: processedValue,
        ciudad: ''
      }));
      setCiudades([]);
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.correo_electronico.trim()) {
      newErrors.correo_electronico = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'El correo electrónico no es válido';
    }

    if (!formData.numero_telefono.trim()) {
      newErrors.numero_telefono = 'El número de teléfono es requerido';
    }

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

    if (!cleaned.tipo_cliente) {
      cleaned.tipo_cliente = 'persona_natural';
    }

    if (!cleaned.estado) {
      cleaned.estado = 'Activo';
    }

    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === null || cleaned[key] === undefined) {
        cleaned[key] = '';
      }
    });

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

  const handleInactivate = () => {
    if (window.confirm('¿Está seguro que desea inactivar este cliente?')) {
      const inactivatedData = {
        ...formData,
        estado: 'Inactivo'
      };
      onSubmit(inactivatedData);
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

  const actividadEconomicaOptions = Object.keys(actividadesEconomicas).map(key => ({
    value: key,
    label: key
  }));

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {isEdit && (
        <div className={`p-4 rounded-lg ${formData.estado === 'Activo' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${formData.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-medium">Estado del cliente: {formData.estado}</span>
            </div>
            {formData.estado === 'Activo' && (
              <button
                type="button"
                onClick={handleInactivate}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Inactivar Cliente
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>

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
                        readOnly
                        disabled
                        title="El dígito de verificación se calcula automáticamente"
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
                  <SelectField
                    label="Actividad Económica"
                    value={formData.actividad_economica}
                    onChange={(e) => handleInputChange('actividad_economica', e.target.value)}
                    options={actividadEconomicaOptions}
                    placeholder="Seleccionar actividad"
                  />
                  <SelectField
                    label="Código CIIU"
                    value={formData.codigo_ciiu}
                    onChange={(e) => handleInputChange('codigo_ciiu', e.target.value)}
                    options={ciuuOptions.map(c => ({ value: c.codigo, label: `${c.codigo} - ${c.descripcion}` }))}
                    placeholder={formData.actividad_economica ? "Seleccionar código CIIU" : "Primero seleccione actividad económica"}
                    disabled={!formData.actividad_economica}
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
                onChange={(e) => handleInputChange('numero_telefono', e.target.value)}
                countryCode={formData.codigo_pais_telefono}
                onCountryCodeChange={(e) => handleInputChange('codigo_pais_telefono', e.target.value)}
                required
                error={errors.numero_telefono}
              />
            </div>

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

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Dirección</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
              />
              <FormField
                label="Apartamento, local, etc"
                value={formData.apartamento_local}
                onChange={(e) => handleInputChange('apartamento_local', e.target.value)}
              />

              {/* País de residencia */}
              <SelectField
                label="País de residencia"
                value={formData.pais_residencia}
                onChange={(e) => handleInputChange('pais_residencia', e.target.value)}
                options={paises.map(p => ({ value: p.nombre, label: p.nombre }))}
                placeholder={loadingGeo ? "Cargando países..." : "Seleccionar país"}
                disabled={loadingGeo}
              />

              {/* Departamento/Estado */}
              <div>
                {departamentos.length > 0 ? (
                  <SelectField
                    label="Departamento, estado, etc"
                    value={formData.departamento_estado}
                    onChange={(e) => handleInputChange('departamento_estado', e.target.value)}
                    options={departamentos.map(d => ({ value: d.nombre, label: d.nombre }))}
                    placeholder={loadingGeo ? "Cargando departamentos..." : "Seleccionar departamento"}
                    disabled={loadingGeo}
                  />
                ) : (
                  <FormField
                    label="Departamento, estado, etc"
                    value={formData.departamento_estado}
                    onChange={(e) => handleInputChange('departamento_estado', e.target.value)}
                    placeholder={
                      !formData.pais_residencia 
                        ? "Primero seleccione un país" 
                        : "Escriba el nombre del departamento"
                    }
                    disabled={!formData.pais_residencia}
                  />
                )}
              </div>

              {/* Ciudad */}
              <div>
                {ciudades.length > 0 ? (
                  <SelectField
                    label="Ciudad"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    options={ciudades.map(c => ({ value: c.nombre, label: c.nombre }))}
                    placeholder={loadingGeo ? "Cargando ciudades..." : "Seleccionar ciudad"}
                    disabled={loadingGeo}
                  />
                ) : (
                  <FormField
                    label="Ciudad"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    placeholder={
                      !formData.departamento_estado 
                        ? "Primero seleccione un departamento" 
                        : "Escriba el nombre de la ciudad"
                    }
                    disabled={!formData.departamento_estado}
                  />
                )}
              </div>

              <FormField
                label="Código postal"
                value={formData.codigo_postal}
                onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
              />

              <PhoneInput
                label="Teléfono de la residencia"
                value={formData.telefono_residencia}
                onChange={(e) => handleInputChange('telefono_residencia', e.target.value)}
                countryCode={formData.codigo_pais_residencia}
                onCountryCodeChange={(e) => handleInputChange('codigo_pais_residencia', e.target.value)}
              />
            </div>
          </div>

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

        <div className="space-y-6">
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