import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import UserSidebar from '../../components/layout/UserSidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { orderService } from '../../services/api';

const statusVariant = { delivered: 'success', shipped: 'info', processing: 'warning', cancelled: 'error' };
const statusLabel = { delivered: 'Entregado', shipped: 'En camino', processing: 'Procesando', cancelled: 'Cancelado' };

const MyOrders = () => {
  const { isAuthenticated } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Error al cargar pedidos:', err.message);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const formatPrice = (p) =>
    Number(p)?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const tabs = [
    { value: 'all', label: 'Todos' },
    { value: 'processing', label: 'En proceso' },
    { value: 'shipped', label: 'En camino' },
    { value: 'delivered', label: 'Entregados' },
  ];

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-72px)]">
        <UserSidebar />
        <main className="flex-1 p-lg pb-24 md:pb-lg">
          <header className="mb-lg">
            <h2 className="font-display-lg-mobile text-on-surface mb-xs">Mis Pedidos</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">{orders.length} pedidos en total</p>
          </header>

          <div className="flex gap-xs mb-md overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-md py-sm rounded-lg font-label-md text-label-md whitespace-nowrap transition-all ${
                  filter === tab.value ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant">
            {loading ? (
              <LoadingSpinner text="Cargando pedidos..." />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-xl text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-md">receipt_long</span>
                <p className="text-on-surface-variant font-body-md text-body-md">No hay pedidos en esta categoría</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant">
                {filtered.map((order) => (
                  <div key={order.id} className="p-md hover:bg-surface-container-low transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm">
                      <div>
                        <p className="font-headline-sm text-headline-sm text-on-surface">#{order.id}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {new Date(order.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="mt-xs space-y-0.5">
                          {order.items?.map((item, i) => (
                            <p key={i} className="font-body-sm text-body-sm text-on-surface-variant">
                              {item.quantity}x {item.product?.name}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-xs">
                        <Badge label={statusLabel[order.status]} variant={statusVariant[order.status]} />
                        <span className="font-headline-sm text-headline-sm text-primary">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </PublicLayout>
  );
};

export default MyOrders;
