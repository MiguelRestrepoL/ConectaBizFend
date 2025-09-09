'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PlanCard from '../components/PlanCard';
import Footer from '../components/Footer';

export default function Home() {
  // Datos de los planes de suscripción
  const plans = [
    {
      title: 'Free',
      description: 'El paquete más básico, lo suficiente para establecer tu tienda pero sin aprovechar al máximo ConectaBiz',
      price: '0€',
      isPopular: true,
      buttonText: 'Seleccionar free package',
      features: [
        { icon: '👤', text: '1 socio' },
        { icon: '📍', text: 'Hasta 5 sucursales' },
        { icon: '🛍️', text: 'Puntos de venta' },
        { icon: '📊', text: 'Informes de ventas/compras' }
      ],
      shipping: 'Tarifas de envío vía servientrega de (money) COP$'
    },
    {
      title: 'Premium',
      description: 'Contiene la mayoría de los servicios para tu tienda, soporte inmediato y lo necesario para establecer la mejor tienda posible',
      price: '5€',
      isPopular: false,
      buttonText: 'Seleccionar premium package',
      features: [
        { icon: '👥', text: '3 socios' },
        { icon: '📍', text: 'Hasta 100 sucursales' },
        { icon: '🛍️', text: 'Puntos de ventas' },
        { icon: '📊', text: 'Análisis de informes de ventas/compras' },
        { icon: '💰', text: 'Precios internacionales' }
      ],
      shipping: 'Tarifas de envío vía servientrega de (money) COP$'
    },
    {
      title: 'Elite',
      description: 'Todos los beneficios posibles, asistencia por canal privado, soporte 24/7, privilegios para la tienda y página personalizada',
      price: '15€',
      isPopular: false,
      buttonText: 'Seleccionar elite package',
      features: [
        { icon: '👥', text: '10 socios' },
        { icon: '📍', text: 'Hasta 1000 sucursales' },
        { icon: '🛍️', text: 'Puntos de ventas' },
        { icon: '📊', text: 'Informes profesionales' },
        { icon: '💰', text: 'Precios internacionales al menor' },
        { icon: '📄', text: 'Aranceles e impuestos de importación' }
      ],
      shipping: 'Tarifas de envío vía servientrega de (money) COP$'
    }
  ];

  const handlePlanSelect = (planTitle) => {
    console.log(`Plan seleccionado: ${planTitle}`);
    // Aquí puedes agregar la lógica para manejar la selección del plan
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar activeItem="inicio" />
      
      {/* Header */}
      <Header userName="Usuario" />
      
      {/* Main Content */}
      <main className="ml-64 pt-20 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <button className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold">Selecciona un plan</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Puedes cancelar el plan antes del {new Date().toLocaleDateString('es-ES')} sin cobro. Puedes cambiar el plan cuando desees
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PlanCard
                key={index}
                title={plan.title}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                shipping={plan.shipping}
                isPopular={plan.isPopular}
                buttonText={plan.buttonText}
                onSelect={() => handlePlanSelect(plan.title)}
              />
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
