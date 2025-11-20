'use client';

import React from 'react';

const StockBadge = ({ stock, stockMinimo = 0, showLabel = true, size = 'md' }) => {
  // Calcular el estado del stock
  const getStockStatus = () => {
    if (stock <= stockMinimo) {
      return {
        status: 'critical',
        label: 'Stock Crítico',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '🔴'
      };
    } else if (stock <= stockMinimo * 2) {
      return {
        status: 'warning',
        label: 'Stock Bajo',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '🟡'
      };
    } else {
      return {
        status: 'ok',
        label: 'Stock OK',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '🟢'
      };
    }
  };

  const stockStatus = getStockStatus();

  // Tamaños
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${stockStatus.color} ${sizes[size]}`}
      title={`Stock: ${stock} | Mínimo: ${stockMinimo}`}
    >
      <span>{stockStatus.icon}</span>
      {showLabel && <span>{stockStatus.label}</span>}
      <span className="font-bold">{stock}</span>
    </span>
  );
};

export default StockBadge;