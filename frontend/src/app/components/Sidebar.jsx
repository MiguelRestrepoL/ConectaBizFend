import React from 'react';
import Link from 'next/link';
import { authService } from '../api/auth';

const Sidebar = ({ activeItem = 'inicio' }) => {
  const navigationItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠', href: '/home' },
    { id: 'pedidos', label: 'Pedidos', icon: '📦', href: '/pedidos' },
    { id: 'productos', label: 'Productos', icon: '📦', href: '/productos' },
    { id: 'clientes', label: 'Clientes', icon: '👥', href: '/clientes' },
    { id: 'borradores', label: 'Borradores', icon: '📄', href: '/borradores' },
    { id: 'top-cliente', label: 'Top cliente', icon: '🏔️', href: '/top-cliente' },
    { id: 'contenido', label: 'Contenido', icon: '📋', href: '/contenido' },
    { id: 'estadisticas', label: 'Estadísticas', icon: '📊', href: '/estadisticas' },
    { id: 'marketing', label: 'Marketing', icon: '📢', href: '/marketing' },
    { id: 'descuentos', label: 'Descuentos', icon: '🏷️', href: '/descuentos' },
    { id: 'suscripcion', label: 'Suscripción', icon: '💰', href: '/suscripcion' }
  ];

  // Función para manejar el logout
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      authService.logout();
    } 
  };

  const salesChannels = [
    { id: 'punto-fisico', label: 'Punto físico', icon: '🏪', href: '/punto-fisico' },
    { id: 'tienda-online', label: 'Tienda Online', icon: '🛒', href: '/tienda-online' }
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        {/* Navigation Items */}
        <nav className="space-y-2 mb-8">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeItem === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sales Channels Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
            Canales de venta
          </h3>
          <div className="space-y-2">
            {salesChannels.map((channel) => (
              <Link
                key={channel.id}
                href={channel.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <span className="text-xl">{channel.icon}</span>
                <span className="font-medium">{channel.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors group"
          >
            <svg className="w-6 h-6 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
