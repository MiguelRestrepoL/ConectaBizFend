'use client';

import { useParams } from "next/navigation";
import { getOrderById } from '../../api/orders'
import { useState, useEffect } from "react";
import OrderTrackingPage from '../../components/OrderTrackingPage';
import Sidebar from '../../components/Sidebar'

export default function Seguimiento() {
    const params = useParams();
    const id = params.id;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrderById(id);
                // Extrae pedido de la data
                setOrder(response.data.pedido);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error al cargar el pedido');
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    return (
        <main>
            <Sidebar/>
            <OrderTrackingPage order={order} loading={loading} error={error} />
        </main>

    )

}