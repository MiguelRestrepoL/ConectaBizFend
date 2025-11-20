'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import ProductForm from '../components/ProductForm';
import AlertModal from '../components/AlertModal';
import { getProductById, updateProduct } from '../api/products';

export default function EditarProducto() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Cargar producto al montar el componente
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProductById(id);
      
      if (result.success) {
        console.log('Producto cargado:', result.data);
        setProduct(result.data);
      } else {
        setError(result.error || 'Error al cargar el producto');
      }
    } catch (err) {
      setError('Error de conexión al cargar el producto');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError(null);

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
      
      const result = await updateProduct(id, productData);
      
      if (result.success) {
        setAlertModal({
          isOpen: true,
          title: 'Éxito',
          message: 'Producto actualizado exitosamente',
          type: 'success'
        });
        
        setTimeout(() => {
          router.push('/productos');
        }, 2000);
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: result.error || 'Error al actualizar el producto',
          type: 'error'
        });
      }
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error de conexión al actualizar el producto',
        type: 'error'
      });
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  const convertProductToFormData = (productData) => {
    console.log('Convirtiendo datos del producto:', productData);
    
    const formData = {
      nombre: productData.nombre || '',
      descripcion: productData.descripcion || '',
      precio: productData.precio || '',
      stock: productData.stock || 0,
      stock_minimo: productData.stock_minimo || 0,
      codigo: productData.codigo || '',
      proveedor_id: productData.proveedor_id || '',
      estado: productData.estado !== undefined ? productData.estado : true
    };
    
    console.log('Datos convertidos para el formulario:', formData);
    return formData;
  };

  // Estado de carga inicial
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent" 
                 style={{ width: '48px', height: '48px', margin: '0 auto 16px' }}>
            </div>
            <p className="text-gray-600">Cargando datos del producto...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Estado de error al cargar
  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <svg style={{ width: '24px', height: '24px' }} className="text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Error al cargar el producto</h3>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={loadProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Reintentar
                </button>
                <button
                  onClick={() => router.push('/productos')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Volver a Productos
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Editar Producto
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                ID: #{product?.id} • {product?.nombre}
              </p>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>

      {/* FORMULARIO DE EDICIÓN */}
      {product && (
        <ProductForm
          initialData={convertProductToFormData(product)}
          onSubmit={handleSubmit}
          isEdit={true}
          loading={saving}
        />
      )}

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