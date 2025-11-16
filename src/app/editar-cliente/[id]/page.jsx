'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ClientForm from '@/app/components/ClientForm';
import { getClientById, updateClient } from '@/app/api/clients';

export default function EditarCliente() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  // Cargar datos del cliente
  useEffect(() => {
    const loadClient = async () => {
      if (!clientId) return;

      try {
        setLoading(true);
        setError(null);

        const result = await getClientById(clientId);

        if (result.success) {
          console.log('Cliente cargado:', result.data);
          setClient(result.data);
        } else {
          setError(result.error || 'Error al cargar el cliente');
        }
      } catch (err) {
        setError('Error de conexión al cargar el cliente');
        console.error('Error loading client:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [clientId]);

  // Manejar envío del formulario
  const handleSubmit = async (formData) => {
    setSaving(true);

    try {
      // Preparar los datos base del cliente
      const clientData = {
        // Información de contacto
        correo_electronico: formData.correo_electronico.trim().toLowerCase(),
        numero_telefono: formData.numero_telefono.trim(),
        codigo_pais_telefono: formData.codigo_pais_telefono,

        // Información de dirección
        direccion: formData.direccion?.trim() || null,
        ciudad: formData.ciudad?.trim() || null,
        pais_residencia: formData.pais_residencia?.trim() || null,
        codigo_postal: formData.codigo_postal?.trim() || null,
        departamento_estado: formData.departamento_estado?.trim() || null,

        // Información fiscal
        recaudar_impuestos: formData.recaudar_impuestos,

        // Tipo de cliente
        tipo_cliente: formData.tipo_cliente || 'persona_natural'
      };

      // Agregar datos según el tipo de cliente (formato plano)
      if (clientData.tipo_cliente === 'persona_natural') {
        clientData.nombre = formData.nombre.trim();
        clientData.apellido = formData.apellido.trim();
        clientData.segundo_nombre = formData.segundo_nombre?.trim() || '';
        clientData.segundo_apellido = formData.segundo_apellido?.trim() || '';
        clientData.nacionalidad = formData.nacionalidad?.trim() || null;
        clientData.idioma = formData.idioma || 'Español';
      } else if (clientData.tipo_cliente === 'persona_juridica') {
        clientData.razon_social = formData.razon_social?.trim() || '';
        clientData.nit = formData.nit?.trim() || '';
        clientData.digito_verificacion = formData.digito_verificacion?.trim() || '';
        clientData.tipo_empresa = formData.tipo_empresa || '';
        clientData.representante_legal = formData.representante_legal?.trim() || '';
        clientData.cedula_representante = formData.cedula_representante?.trim() || '';
        clientData.fecha_constitucion = formData.fecha_constitucion || null;
        clientData.actividad_economica = formData.actividad_economica?.trim() || '';
        clientData.codigo_ciiu = formData.codigo_ciiu?.trim() || '';
        clientData.capital_social = formData.capital_social || null;
      }

      console.log('Datos a enviar al backend:', clientData);

      // Usar la función updateClient del archivo clients.js
      const result = await updateClient(clientId, clientData);

      if (result.success) {
        // Mostrar mensaje de éxito
        alert(result.message || 'Cliente actualizado exitosamente');

        // Redirigir a la página de clientes
        router.push('/clientes');
      } else {
        // Mostrar mensaje de error
        alert('Error al actualizar el cliente: ' + result.error);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  // Convertir datos del cliente al formato del formulario
  // Convertir datos del cliente al formato del formulario
  const convertClientToFormData = (clientData) => {
    console.log('Convirtiendo datos del cliente:', clientData);

    // Los datos del cliente están dentro de clientData.client
    const client = clientData.client || clientData;

    // Datos base del formulario
    const formData = {
      correo_electronico: client.correo_electronico || '',
      numero_telefono: client.numero_telefono || '',
      codigo_pais_telefono: client.codigo_pais_telefono || '+57',
      direccion: client.direccion || '',
      ciudad: client.ciudad || '',
      pais_residencia: client.pais_residencia || '',
      codigo_postal: client.codigo_postal || '',
      departamento_estado: client.departamento_estado || '',
      recaudar_impuestos: client.recaudar_impuestos || 'recaudar',
      tipo_cliente: client.tipo_cliente || 'persona_natural',
      apartamento_local: '',
      telefono_residencia: '',
      codigo_pais_residencia: '+57',
      recibe_emails_marketing: false,
      recibe_sms_marketing: false,
      notas: '',
      etiquetas: []
    };

    // Agregar datos específicos según el tipo de cliente
    if (client.tipo_cliente === 'persona_natural' && client.persona_natural) {
      const pn = client.persona_natural;
      formData.nombre = pn.nombre || '';
      formData.apellido = pn.apellido || '';
      formData.segundo_nombre = pn.segundo_nombre || '';
      formData.segundo_apellido = pn.segundo_apellido || '';
      formData.nacionalidad = pn.nacionalidad || '';
      formData.idioma = pn.idioma || 'Español';
    } else if (client.tipo_cliente === 'persona_juridica' && client.persona_juridica) {
      const pj = client.persona_juridica;
      formData.razon_social = pj.razon_social || '';
      formData.nit = pj.nit || '';
      formData.digito_verificacion = pj.digito_verificacion || '';
      formData.tipo_empresa = pj.tipo_empresa || '';
      formData.representante_legal = pj.representante_legal || '';
      formData.cedula_representante = pj.cedula_representante || '';
      formData.fecha_constitucion = pj.fecha_constitucion || '';
      formData.actividad_economica = pj.actividad_economica || '';
      formData.codigo_ciiu = pj.codigo_ciiu || '';
      formData.capital_social = pj.capital_social || '';
    }

    console.log('Datos convertidos para el formulario:', formData);
    return formData;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 text-gray-900">
        <Sidebar activeItem="clientes" />
        <Header userName="Usuario" />
        <main className="ml-64 pt-20 pb-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 text-gray-900">
        <Sidebar activeItem="clientes" />
        <Header userName="Usuario" />
        <main className="ml-64 pt-20 pb-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 mb-2">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar cliente</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
                <button
                  onClick={() => router.push('/clientes')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Volver a Clientes
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-blue-50 text-gray-900">
        <Sidebar activeItem="clientes" />
        <Header userName="Usuario" />
        <main className="ml-64 pt-20 pb-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Cliente no encontrado</h3>
              <p className="text-yellow-600 mb-4">El cliente que buscas no existe o ha sido eliminado.</p>
              <button
                onClick={() => router.push('/clientes')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Volver a Clientes
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar activeItem="clientes" />

      {/* Header */}
      <Header userName="Usuario" />

      {/* Main Content */}
      <main className="ml-64 pt-20 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Editar cliente</h1>
                  <p className="text-gray-600 mt-1">
                    Editando: {client.nombre} {client.apellido}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <ClientForm
            onSubmit={handleSubmit}
            loading={saving}
            initialData={client ? convertClientToFormData(client) : null}
            isEdit={true}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
