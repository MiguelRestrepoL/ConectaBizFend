'use client';

import { useEffect, useState } from "react";
import OrderStatusBadge from '../components/OrderStatusBadge';
import OrderTimeline from '../components/OrderTimeLine';
import OrderInfoCard from '../components/OrderInfoCard';
import { Package, Clock, CheckCircle, Truck, Calendar, DollarSign, FileText, User, ArrowLeft } from 'lucide-react';
import GuiaSeguimientoPDF from "../../app/components/GuiaSeguimientoPDF";

export default function OrderTrackingPage({ order, loading, error }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // ✅ FIX: Obtener nombre del cliente de forma segura
  const getClienteName = () => {
    if (!order || !order.cliente) return 'Sin cliente';
    
    if (order.cliente.persona_natural) {
      const nombre = order.cliente.persona_natural.nombre || '';
      const apellido = order.cliente.persona_natural.apellido || '';
      return `${nombre} ${apellido}`.trim() || 'Sin nombre';
    }
    
    if (order.cliente.persona_juridica) {
      return order.cliente.persona_juridica.razon_social || 'Empresa';
    }
    
    return 'Sin nombre';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-xl mb-2">Error al cargar el pedido</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <h2 className="text-yellow-800 font-semibold text-xl mb-2">Pedido no encontrado</h2>
          <p className="text-yellow-700">No se encontró información para este pedido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>

        {/* Header del pedido con botón */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <Package className="w-4 h-4" />
                <span>Orden #{order.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{order.titulo}</h1>
              {order.descripcion && (
                <p className="text-gray-600 text-sm sm:text-base">{order.descripcion}</p>
              )}
            </div>

            {/* Botón + estado */}
            <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
              <OrderStatusBadge estado={order.estado} />
              <GuiaSeguimientoPDF order={order} />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado del Pedido</h2>
          <OrderTimeline estado={order.estado} />
        </div>

        {/* Información detallada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <OrderInfoCard
            icon={<User className="w-5 h-5" />}
            label="Cliente"
            value={getClienteName()}
          />
          <OrderInfoCard
            icon={<Calendar className="w-5 h-5" />}
            label="Fecha de Entrega"
            value={formatDate(order.fecha_entrega)}
          />
          <OrderInfoCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Monto Total Pagado"
            value={formatCurrency(order.monto_total_pagado)}
          />
          <OrderInfoCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Monto sin IVA"
            value={formatCurrency(order.monto_recibido_sin_iva)}
          />
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Adicional</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Fecha de creación:</span>
              <span className="font-medium text-gray-900">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Última actualización:</span>
              <span className="font-medium text-gray-900">{formatDate(order.updated_at)}</span>
            </div>
            {order.cliente?.correo_electronico && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Email del cliente:</span>
                <span className="font-medium text-gray-900 break-all">{order.cliente.correo_electronico}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}