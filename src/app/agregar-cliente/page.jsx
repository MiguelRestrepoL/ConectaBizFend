'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';
import ClientForm from '@/app/components/ClientForm';
import AlertModal from '@/app/components/AlertModal';
import { createClient } from '@/app/api/clients';

export default function AgregarCliente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      const clientData = {
        tipo_cliente: formData.tipo_cliente || 'persona_natural',
        nombre: formData.nombre?.trim() || '',
        apellido: formData.apellido?.trim() || '',
        segundo_nombre: formData.segundo_nombre?.trim() || '',
        segundo_apellido: formData.segundo_apellido?.trim() || '',
        nacionalidad: formData.nacionalidad?.trim() || '',
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
        idioma: formData.idioma || 'Español',
        correo_electronico: formData.correo_electronico.trim().toLowerCase(),
        numero_telefono: formData.numero_telefono.trim(),
        codigo_pais_telefono: formData.codigo_pais_telefono || '+57',
        recibe_emails_marketing: formData.recibe_emails_marketing || false,
        recibe_sms_marketing: formData.recibe_sms_marketing || false,
        direccion: formData.direccion?.trim() || '',
        ciudad: formData.ciudad?.trim() || '',
        pais_residencia: formData.pais_residencia?.trim() || '',
        apartamento_local: formData.apartamento_local?.trim() || '',
        codigo_postal: formData.codigo_postal?.trim() || '',
        departamento_estado: formData.departamento_estado?.trim() || '',
        telefono_residencia: formData.telefono_residencia?.trim() || '',
        codigo_pais_residencia: formData.codigo_pais_residencia || '+57',
        recaudar_impuestos: formData.recaudar_impuestos || 'recaudar',
        notas: formData.notas?.trim() || '',
        etiquetas: Array.isArray(formData.etiquetas) ? formData.etiquetas : []
      };

      console.log('Enviando datos del cliente:', clientData);

      const result = await createClient(clientData);

      if (result.success) {
        setAlertModal({
          isOpen: true,
          title: 'Éxito',
          message: result.message || 'Cliente creado exitosamente',
          type: 'success'
        });
        
        setTimeout(() => {
          router.push('/clientes');
        }, 2000);
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: 'Error al crear el cliente: ' + result.error,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error inesperado. Por favor, intenta nuevamente.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* HEADER DE LA PÁGINA */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push('/clientes')}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            title="Volver a clientes"
          >
            <svg style={{ width: '20px', height: '20px' }} className="text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Agregar Cliente
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Completa la información del nuevo cliente
              </p>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>

      {/* FORMULARIO DE CREACIÓN */}
      <ClientForm 
        onSubmit={handleSubmit} 
        loading={loading}
        isEdit={false}
      />

      {/* MODAL DE ALERTA */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        autoClose={alertModal.type === 'success'}
        autoCloseDelay={2000}
      />
    </Layout>
  );
}