'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClientForm from '../components/ClientForm';
import { addClient } from '../api/clients';

export default function AgregarCliente() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    
    try {
      // Preparar los datos para enviar
      const clientData = {
        // Tipo de cliente
        tipo_cliente: formData.tipo_cliente || 'persona_natural',
        
        // Información personal (para persona natural)
        nombre: formData.nombre?.trim() || '',
        apellido: formData.apellido?.trim() || '',
        segundo_nombre: formData.segundo_nombre?.trim() || '',
        segundo_apellido: formData.segundo_apellido?.trim() || '',
        nacionalidad: formData.nacionalidad?.trim() || '',
        
        // Información para persona jurídica
        razon_social: formData.razon_social?.trim() || '',
        nit: formData.nit?.trim() || '',
        digito_verificacion: formData.digito_verificacion?.trim() || '',
        representante_legal: formData.representante_legal?.trim() || '',
        cedula_representante: formData.cedula_representante?.trim() || '',
        tipo_empresa: formData.tipo_empresa || '',
        actividad_economica: formData.actividad_economica?.trim() || '',
        codigo_ciiu: formData.codigo_ciiu?.trim() || '',
        fecha_constitucion: formData.fecha_constitucion || '',
        capital_social: formData.capital_social || '',
        
        // Campos comunes
        idioma: formData.idioma || 'Español',
        correo_electronico: formData.correo_electronico.trim().toLowerCase(),
        numero_telefono: formData.numero_telefono.trim(),
        codigo_pais_telefono: formData.codigo_pais_telefono || '+57',
        recibe_emails_marketing: formData.recibe_emails_marketing || false,
        recibe_sms_marketing: formData.recibe_sms_marketing || false,
        
        // Información de dirección
        direccion: formData.direccion?.trim() || '',
        ciudad: formData.ciudad?.trim() || '',
        pais_residencia: formData.pais_residencia?.trim() || '',
        apartamento_local: formData.apartamento_local?.trim() || '',
        codigo_postal: formData.codigo_postal?.trim() || '',
        departamento_estado: formData.departamento_estado?.trim() || '',
        telefono_residencia: formData.telefono_residencia?.trim() || '',
        codigo_pais_residencia: formData.codigo_pais_residencia || '+57',
        
        // Información fiscal
        recaudar_impuestos: formData.recaudar_impuestos || 'recaudar',
        
        // Notas y etiquetas
        notas: formData.notas?.trim() || '',
        etiquetas: Array.isArray(formData.etiquetas) ? formData.etiquetas : []
      };

      // Verificar los datos antes de enviar
      console.log('Datos del cliente a enviar:', clientData);
      
      // Usar la función addClient del archivo clients.js
      const result = await addClient(clientData);

      if (result.success) {
        // Mostrar mensaje de éxito
        alert(result.message);
        
        // Redirigir a la página de clientes
        window.location.href = '/clientes';
      } else {
        // Mostrar mensaje de error
        alert('Error al crear el cliente: ' + result.error);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Agregar cliente</h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <ClientForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
