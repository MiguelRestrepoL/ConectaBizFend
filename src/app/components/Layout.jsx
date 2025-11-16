'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ 
  children, 
  activeItem = 'inicio', 
  userName = 'Usuario' 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Overlay para móvil cuando sidebar está abierto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Responsivo */}
      <Sidebar 
        activeItem={activeItem}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      {/* Header Responsivo */}
      <Header 
        userName={userName}
        onMenuClick={toggleSidebar}
      />
      
      {/* Main Content Responsivo */}
      <main className="
        pt-20 pb-20 
        px-4 sm:px-6 lg:px-8
        lg:ml-64
        transition-all duration-300
        min-h-screen
      ">
        {children}
      </main>
      
      {/* Footer Responsivo */}
      <Footer />
    </div>
  );
}