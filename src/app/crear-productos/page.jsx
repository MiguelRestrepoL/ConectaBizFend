'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import ProductForm from '../components/ProductForm';
import AlertModal from '../components/AlertModal';
import { createProduct } from '../api/products';

export default function CrearProducto() {
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
      const productData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        stock_minimo: parseInt(formData.stock_minimo) || 0,
        codigo: formData.codigo?.trim() || null,
        proveedor_id: formData.proveedor_id ? parseInt(formData.proveedor_id) : null,
        estado: formData.estado
      };

      console.log('Enviando datos del producto:', productData);

      const result = await createProduct(productData);

      if (result.success) {
        setAlertModal({
          isOpen: true,
          title: 'Éxito',
          message: result.message || 'Producto creado exitosamente',
          type: 'success'
        });
        
        setTimeout(() => {
          router.push('/productos');
        }, 2000);
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: 'Error al crear el producto: ' + result.error,
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
            onClick={() => router.push('/productos')}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            title="Volver a productos"
          >
            <svg style={{ width: '20px', height: '20px' }} className="text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Crear Producto
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Agrega un nuevo producto al inventario
              </p>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>

      {/* FORMULARIO DE CREACIÓN */}
      <ProductForm 
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