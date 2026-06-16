'use client';
 
import React, { useState } from 'react';
import Layout from '../components/Layout';
import ProveedorList from '../components/ProveedorList';
import ProveedorFormModal from '../components/ProveedorFormModal';
 
export default function Proveedores() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
 
  const handleProveedorAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
 
  return (
    <Layout activeItem="proveedores">
      {/* HEADER DE LA PÁGINA */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 
          {/* Título con icono */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Proveedores</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Gestiona los proveedores de tu inventario</p>
            </div>
          </div>
 
          {/* Botón agregar proveedor */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Proveedor
          </button>
        </div>
 
        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>
 
      {/* LISTA DE PROVEEDORES */}
      <ProveedorList refreshTrigger={refreshTrigger} />
 
      {/* MODAL DE CREACIÓN (desde el botón del header) */}
      <ProveedorFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        proveedor={null}
        onSaved={handleProveedorAdded}
      />
 
      {/* INFORMACIÓN ADICIONAL */}
      <div className="mt-8 sm:mt-12 bg-white rounded-lg sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Asocia proveedores a tus productos
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
              Al crear o editar un producto, podrás seleccionar el proveedor encargado de su abastecimiento para mantener un mejor control de tu inventario.
            </p>
            <a
              href="/productos"
              className="inline-block w-full sm:w-auto bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base text-center"
            >
              Ir a Productos
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}