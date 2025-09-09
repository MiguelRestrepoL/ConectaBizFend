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
        // Información personal
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        segundo_nombre: formData.segundo_nombre?.trim() || null,
        segundo_apellido: formData.segundo_apellido?.trim() || null,
        nacionalidad: formData.nacionalidad?.trim() || null,
        idioma: formData.idioma,
        correo_electronico: formData.correo_electronico.trim().toLowerCase(),
        numero_telefono: formData.numero_telefono.trim(),
        codigo_pais_telefono: formData.codigo_pais_telefono,
        recibe_emails_marketing: formData.recibe_emails_marketing,
        recibe_sms_marketing: formData.recibe_sms_marketing,
        
        // Información de dirección
        direccion: formData.direccion?.trim() || null,
        ciudad: formData.ciudad?.trim() || null,
        pais_residencia: formData.pais_residencia?.trim() || null,
        apartamento_local: formData.apartamento_local?.trim() || null,
        codigo_postal: formData.codigo_postal?.trim() || null,
        departamento_estado: formData.departamento_estado?.trim() || null,
        telefono_residencia: formData.telefono_residencia?.trim() || null,
        codigo_pais_residencia: formData.codigo_pais_residencia,
        
        // Información fiscal
        recaudar_impuestos: formData.recaudar_impuestos,
        
        // Notas y etiquetas (estos campos no están en el modelo, pero los incluimos por si se necesitan)
        notas: formData.notas?.trim() || null,
        etiquetas: formData.etiquetas.length > 0 ? formData.etiquetas.join(', ') : null
      };

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
