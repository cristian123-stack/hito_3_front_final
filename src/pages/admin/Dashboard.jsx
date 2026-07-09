import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { dashboardService } from '../../services/api';

const StatCard = ({ icon, label, value, color = 'bg-primary-container text-on-primary-container' }) => (
  <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant">{label}</p>
    <h3 className="text-headline-md font-bold text-on-surface">{value}</h3>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, topData, ordersData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getTopProducts(),
          dashboardService.getRecentOrders(),
        ]);
        setStats(statsData);
        setTopProducts(topData);
        setRecentOrders(ordersData);
      } catch (err) {
        console.error('Error al cargar dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (p) =>
    Number(p)?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const statusLabel = { delivered: 'Entregado', shipped: 'En camino', processing: 'Procesando', cancelled: 'Cancelado' };
  const statusColor = { delivered: 'bg-green-100 text-green-800', shipped: 'bg-blue-100 text-blue-800', processing: 'bg-yellow-100 text-yellow-800', cancelled: 'bg-red-100 text-red-800' };

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h1 className="font-headline-md text-headline-md text-on-surface">Panel de Control</h1>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </header>

      <main className="p-lg space-y-lg overflow-y-auto">
        {loading ? (
          <LoadingSpinner text="Cargando estadísticas..." />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
              <StatCard icon="payments" label="Ingresos del mes" value={formatPrice(stats?.totalRevenue)} color="bg-primary-container text-on-primary-container" />
              <StatCard icon="receipt_long" label="Pedidos totales" value={stats?.totalOrders} color="bg-secondary-container text-on-secondary-container" />
              <StatCard icon="group" label="Usuarios activos" value={stats?.totalUsers?.toLocaleString()} color="bg-tertiary-container text-on-tertiary-container" />
              <StatCard icon="inventory_2" label="Productos activos" value={stats?.totalProducts} color="bg-green-100 text-green-800" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              {/* Más vendidos */}
              <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-md">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Más Vendidos</h2>
                {topProducts.length === 0 ? (
                  <p className="text-on-surface-variant font-body-sm text-body-sm text-center py-md">Sin datos aún</p>
                ) : (
                  <div className="space-y-sm">
                    {topProducts.map((item, i) => (
                      <div key={item.productId} className="flex items-center gap-sm py-sm border-b border-outline-variant last:border-0">
                        <span className="font-bold text-primary w-6 text-center">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-label-md text-label-md text-on-surface truncate">{item.product?.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{item.totalSold} vendidos</p>
                        </div>
                        <p className="font-label-md text-label-md text-primary">{formatPrice(item.product?.price)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pedidos recientes */}
              <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-md">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Pedidos Recientes</h2>
                {recentOrders.length === 0 ? (
                  <p className="text-on-surface-variant font-body-sm text-body-sm text-center py-md">Sin pedidos aún</p>
                ) : (
                  <div className="space-y-sm">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-sm border-b border-outline-variant last:border-0">
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">#{order.id} — {order.user?.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString('es-CL')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-label-md text-label-md text-primary">{formatPrice(order.total)}</p>
                          <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-lg ${statusColor[order.status]}`}>{statusLabel[order.status]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </AdminLayout>
  );
};

export default Dashboard;
