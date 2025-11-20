'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductViewModal from './ProductViewModal';
import DeleteProductModal from './DeleteProductModal';
import StockUpdateModal from './StockUpdateModal';
import { getProducts, deleteProduct } from '../api/products';

const ProductList = ({ refreshTrigger = 0 }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  
  // Estados de modales
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  // Cargar productos desde API
  useEffect(() => {
    loadProducts();
  }, [refreshTrigger, includeInactive]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProducts({ 
        limit: 1000,
        includeInactive 
      });

      if (result.success) {
        const productsData = result.data.productos || result.data.data || result.data;
        setProducts(productsData);
        setFilteredProducts(productsData);
      } else {
        throw new Error(result.error || 'Error al cargar los productos');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos cuando cambia la búsqueda
  useEffect(() => {
    let result = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.nombre?.toLowerCase().includes(term) ||
        product.descripcion?.toLowerCase().includes(term) ||
        product.codigo?.toLowerCase().includes(term) ||
        product.id?.toString().includes(term)
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, products]);

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

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent" 
               style={{ width: '48px', height: '48px', margin: '0 auto 16px' }}>
          </div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <svg style={{ width: '24px', height: '24px' }} className="text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Error al cargar productos</h3>
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
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
        
        {/* Fila 1: Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <svg 
                style={{ width: '20px', height: '20px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                className="text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, código o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                style={{ paddingLeft: '40px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px' }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  style={{ fontSize: '20px' }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Toggle Incluir Inactivos */}
          <div className="flex items-center gap-2 sm:w-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mostrar inactivos</span>
            </label>
          </div>
        </div>

        {/* Fila 2: Resultados + Botón Crear */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredProducts.length}</span> de {products.length} productos
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => window.location.href = '/productos-stock-bajo'}
              className="flex items-center justify-center gap-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm sm:text-base"
              style={{ padding: '10px 20px' }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Alertas Stock</span>
            </button>
            <button
              onClick={() => window.location.href = '/crear-producto'}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              style={{ padding: '10px 20px' }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 sm:p-12 text-center">
          <svg 
            style={{ width: '64px', height: '64px', margin: '0 auto 16px' }}
            className="text-gray-300"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay productos</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchTerm 
              ? 'No se encontraron productos con los filtros aplicados' 
              : 'Aún no has creado ningún producto'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
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
    </div>
  );
};

export default ProductList;