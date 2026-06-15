'use client';

import React from 'react';
import Layout from '../components/Layout';
import PlanCard from '../components/PlanCard';

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

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Layout activeItem="inicio" userName="Usuario">
      {/* Solo el contenido específico de la página */}
      <div className="max-w-7xl mx-auto">
        {/* Page Title - RESPONSIVE */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleGoBack}
              className="mr-3 sm:mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Volver"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Selecciona un plan
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg pl-11 sm:pl-14">
            Puedes cancelar el plan antes del <span className="font-semibold">{new Date().toLocaleDateString('es-ES')}</span> sin cobro. 
            <span className="hidden sm:inline"> Puedes cambiar el plan cuando desees</span>
          </p>
        </div>

        {/* Plans Grid - RESPONSIVE */}
        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-3 
          gap-4 sm:gap-6 lg:gap-8
        ">
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
    </Layout>
  );
}