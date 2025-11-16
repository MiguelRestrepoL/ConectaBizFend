'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="
      fixed bottom-0 right-0
      bg-gray-900 text-white 
      px-4 sm:px-6 lg:px-8 py-3 sm:py-4
      w-full lg:left-64
      flex flex-col sm:flex-row 
      items-center justify-between
      gap-2 sm:gap-0
      shadow-lg
      z-30
    ">
      {/* Settings Icon */}
      <div className="flex items-center">
        <button 
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Configuración"
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Copyright Text */}
      <div className="flex-1 text-center">
        <p className="text-xs sm:text-sm text-gray-400">
          <span className="hidden md:inline">
            Al seleccionar el paquete se mostrarán todos los detalles del paquete deseado, todos los derechos de autor están reservados para 
          </span>
          <span className="font-semibold"> ConectaBiz Corp</span>
          <span className="md:hidden"> © 2024</span>
        </p>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center">
        <button 
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Cambiar tema"
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;