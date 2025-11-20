'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ProductViewModal from '../components/ProductViewModal';
import DeleteProductModal from '../components/DeleteProductModal';
import StockUpdateModal from '../components/StockUpdateModal';
import { getProductsStockBajo, deleteProduct } from '../api/products';

export default function ProductosStockBajo() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de modales
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProductsStockBajo();

      if (result.success) {
        const productsData = result.data.productos || result.data.data || result.data;
        setProducts(productsData);
      } else {
        throw new Error(result.error || 'Error al cargar productos con stock bajo');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers de acciones
  const handleView = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEdit = (product) => {
    window.location.href = `/editar-producto/${product.id}`;
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateStock = (product) => {
    setSelectedProduct(product);
    setIsStockModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await deleteProduct(selectedProduct.id);

      if (result.success) {
        await loadProducts();
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      } else {
        throw new Error(result.error || 'Error al eliminar el producto');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err.message || 'Error al eliminar el producto');
    }
  };

  const handleStockUpdated = () => {
    loadProducts();
    setIsStockModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" 
                 style={{ width: '48px', height: '48px', margin: '0 auto 16px' }}>
            </div>
            <p className="text-gray-600">Cargando alertas de stock...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Alertas de Stock
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Productos con stock bajo o crítico
              </p>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>

      {/* ALERTA INFORMATIVA */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 mb-1">Atención Requerida</h3>
            <p className="text-sm text-yellow-700">
              Los siguientes productos tienen stock igual o menor al stock mínimo configurado. 
              Se recomienda reabastecer el inventario lo antes posible.
            </p>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🔴</span>
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Stock Crítico</p>
              <p className="text-2xl font-bold text-red-700">
                {products.filter(p => p.stock === 0 || p.stock < p.stock_minimo / 2).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🟡</span>
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-700">
                {products.filter(p => p.stock >= p.stock_minimo / 2 && p.stock <= p.stock_minimo).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Alertas</p>
              <p className="text-2xl font-bold text-blue-700">{products.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg style={{ width: '24px', height: '24px' }} className="text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error al cargar alertas</h3>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={loadProducts}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRID DE PRODUCTOS */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 sm:p-12 text-center">
          <svg 
            style={{ width: '64px', height: '64px', margin: '0 auto 16px' }}
            className="text-green-300"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">¡Todo en orden!</h3>
          <p className="text-gray-500 text-sm mb-4">
            No hay productos con stock bajo en este momento
          </p>
          <button
            onClick={() => router.push('/productos')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Ver Todos los Productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateStock={handleUpdateStock}
            />
          ))}
        </div>
      )}

      {/* MODALES */}
      {isViewModalOpen && selectedProduct && (
        <ProductViewModal
          product={selectedProduct}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {isDeleteModalOpen && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          onConfirm={confirmDelete}
        />
      )}

      {isStockModalOpen && selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          isOpen={isStockModalOpen}
          onClose={() => {
            setIsStockModalOpen(false);
            setSelectedProduct(null);
          }}
          onSuccess={handleStockUpdated}
        />
      )}
    </Layout>
  );
}