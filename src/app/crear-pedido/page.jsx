'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import OrderForm from '../components/OrderForm';
import AlertModal from '../components/AlertModal';
import { createOrder } from '../api/orders';

export default function CrearPedido() {
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
      // Preparar los datos para enviar
      const orderData = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion?.trim() || null,
        cliente_id: parseInt(formData.cliente_id),
        fecha_entrega: formData.fecha_entrega,
        fecha_despacho: formData.fecha_despacho || null,
        fecha_salida_aduana: formData.fecha_salida_aduana || null,
        estado: formData.estado,
        monto_total_pagado: parseFloat(formData.monto_total_pagado),
        monto_recibido_sin_iva: parseFloat(formData.monto_recibido_sin_iva)
      };

      console.log('Enviando datos del pedido:', orderData);

      // Usar la función createOrder del archivo orders.js
      const result = await createOrder(orderData);

      if (result.success) {
        // Mostrar mensaje de éxito
        setAlertModal({
          isOpen: true,
          title: 'Éxito',
          message: result.message || 'Pedido creado exitosamente',
          type: 'success'
        });
        
        // Redirigir a la página de pedidos después de un breve delay
        setTimeout(() => {
          router.push('/pedidos');
        }, 2000);
      } else {
        // Mostrar mensaje de error
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: 'Error al crear el pedido: ' + result.error,
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Título con botón volver */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/pedidos')}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
              title="Volver a pedidos"
            >
              <svg style={{ width: '20px', height: '20px' }} className="text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Crear Pedido
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Completa los datos del nuevo pedido
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>

      {/* FORMULARIO DE CREACIÓN */}
      <OrderForm 
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