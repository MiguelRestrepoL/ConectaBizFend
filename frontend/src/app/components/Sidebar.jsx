import React from 'react';
import Link from 'next/link';

const Sidebar = ({ activeItem = 'inicio' }) => {
  const navigationItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠', href: '/home' },
    { id: 'pedidos', label: 'Pedidos', icon: '🛒', href: '/pedidos' },
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

        {/* Bottom Icons */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex justify-center space-x-4">
            <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
