import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
    <div className="min-h-screen bg-blue-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar activeItem="pedidos" />
      
      {/* Header */}
      <Header userName="Usuario" />
      
      {/* Main Content */}
      <main className="ml-64 pt-20 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                  </svg>
                </div>
                <div className="flex items-center">
                  <h1 className="text-4xl font-bold text-gray-900">Crear pedido</h1>
                  <svg className="w-6 h-6 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <OrderForm 
            onSubmit={handleSubmit} 
            loading={loading}
            isEdit={false}
          />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Modal de alerta */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        autoClose={alertModal.type === 'success'}
        autoCloseDelay={2000}
      />
    </div>
  );
}
