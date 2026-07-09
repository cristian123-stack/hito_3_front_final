import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/api';

const statusVariant = { delivered: 'success', shipped: 'info', processing: 'warning', cancelled: 'error' };
const statusLabel = { delivered: 'Entregado', shipped: 'En camino', processing: 'Procesando', cancelled: 'Cancelado' };
const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const { showNotification } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data.orders || data);
    } catch (err) {
      console.error('Error al cargar pedidos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o));
      showNotification('Estado actualizado', 'success');
    } catch (err) {
      showNotification(err.message || 'Error al actualizar estado', 'error');
    }
  };

  const formatPrice = (p) =>
    Number(p)?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const filtered = orders.filter((o) => {
    const matchSearch = String(o.id).includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Gestión de Pedidos</h1>
      </header>
      <main className="p-lg space-y-md overflow-y-auto">
        {loading ? <LoadingSpinner text="Cargando pedidos..." /> : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {STATUSES.map((s) => (
                <div key={s} className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-center">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{statusLabel[s]}</p>
                  <p className="font-headline-sm text-headline-sm text-on-surface">{orders.filter((o) => o.status === s).length}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant">
              <div className="p-md flex flex-col md:flex-row gap-sm border-b border-outline-variant">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-base">search</span>
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por ID o cliente..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-2 px-3 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="all">Todos</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['ID', 'Cliente', 'Fecha', 'Total', 'Estado', 'Cambiar Estado'].map((h) => (
                        <th key={h} className="px-md py-sm text-left font-label-md text-label-md text-on-surface-variant">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">Sin pedidos</td></tr>
                    ) : filtered.map((order) => (
                      <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-sm font-label-md text-label-md text-primary">#{order.id}</td>
                        <td className="px-md py-sm font-body-sm text-body-sm text-on-surface">{order.user?.name || '—'}</td>
                        <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString('es-CL')}</td>
                        <td className="px-md py-sm font-label-md text-label-md">{formatPrice(order.total)}</td>
                        <td className="px-md py-sm"><Badge label={statusLabel[order.status]} variant={statusVariant[order.status]} /></td>
                        <td className="px-md py-sm">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="py-1 px-2 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminOrders;
