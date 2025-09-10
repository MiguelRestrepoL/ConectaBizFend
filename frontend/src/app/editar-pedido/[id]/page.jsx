'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import OrderForm from '../../components/OrderForm';
import { getOrderById, updateOrder } from '../../api/orders';

export default function EditarPedido() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cargar pedido al montar el componente
  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getOrderById(id);
      
      if (result.success) {
        console.log('Pedido cargado:', result.data);
        setOrder(result.data);
      } else {
        setError(result.error || 'Error al cargar el pedido');
      }
    } catch (err) {
      setError('Error de conexión al cargar el pedido');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError(null);
      
      const result = await updateOrder(id, formData);
      
      if (result.success) {
        alert('Pedido actualizado exitosamente');
        router.push('/pedidos');
      } else {
        setError(result.error || 'Error al actualizar el pedido');
      }
    } catch (err) {
      setError('Error de conexión al actualizar el pedido');
      console.error('Error updating order:', err);
    } finally {
      setSaving(false);
    }
  };

  const convertOrderToFormData = (orderData) => {
    console.log('Convirtiendo datos del pedido:', orderData);
    
    // Acceder a los datos anidados del pedido
    const pedido = orderData.pedido || orderData;
    
    const formData = {
      titulo: pedido.titulo || '',
      descripcion: pedido.descripcion || '',
      cliente_id: pedido.cliente_id || '',
      fecha_entrega: pedido.fecha_entrega ? 
        new Date(pedido.fecha_entrega).toISOString().split('T')[0] : '',
      estado: pedido.estado || 'preparando',
      monto_total_pagado: pedido.monto_total_pagado || 0,
      monto_recibido_sin_iva: pedido.monto_recibido_sin_iva || 0
    };
    
    console.log('Datos convertidos para el formulario:', formData);
    return formData;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 text-gray-900">
        <Sidebar activeItem="pedidos" />
        <Header userName="Usuario" />
        
        <main className="ml-64 pt-20 pb-20 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <Sidebar activeItem="pedidos" />
        <Header userName="Usuario" />
        
        <main className="ml-64 pt-20 pb-20 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 mb-2">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar el pedido</h3>
              <p className="text-red-600 mb-4">{error}</p>
              
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={loadOrder}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
                <button
                  onClick={() => router.push('/pedidos')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Volver a Pedidos
                </button>
              </div>
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
      <Sidebar activeItem="pedidos" />
      
      {/* Header */}
      <Header userName="Usuario" />
      
      {/* Main Content */}
      <main className="ml-64 pt-20 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Editar Pedido</h1>
                  <p className="text-gray-600">Modifica los detalles del pedido #{order?.id}</p>
                </div>
              </div>
              
              {/* Botón para volver */}
              <button
                onClick={() => router.push('/pedidos')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a Pedidos
              </button>
            </div>
          </div>

          {/* Formulario de edición */}
          {order && (
            <OrderForm
              initialData={convertOrderToFormData(order)}
              onSubmit={handleSubmit}
              isEdit={true}
              loading={saving}
            />
          )}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
