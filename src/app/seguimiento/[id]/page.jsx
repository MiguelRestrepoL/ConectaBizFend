'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../components/Layout';
import OrderTrackingPage from '../../components/OrderTrackingPage';
import { getOrderById } from '../../api/orders';

export default function SeguimientoPedido() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      loadOrder();
    }
  }, [params.id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getOrderById(params.id);

      if (result.success) {
        const orderData = result.data.pedido || result.data;
        setOrder(orderData);
      } else {
        setError(result.error || 'Error al cargar el pedido');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar el pedido');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <OrderTrackingPage 
        order={order} 
        loading={loading} 
        error={error} 
      />
    </Layout>
  );
}