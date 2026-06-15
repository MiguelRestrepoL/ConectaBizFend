'use client';

import React, { useState } from 'react';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';

export default function Productos() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Layout activeItem="productos">
      {/* HEADER DE LA PÁGINA */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Productos
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Gestiona tu inventario de productos
            </p>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>

      {/* CONTENIDO PRINCIPAL: ProductList */}
      <ProductList refreshTrigger={refreshTrigger} />
    </Layout>
  );
}