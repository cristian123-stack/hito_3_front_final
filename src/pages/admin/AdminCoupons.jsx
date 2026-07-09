import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const EMPTY_FORM = {
  code: '', type: 'percentage', value: '', minOrderAmount: '0',
  maxUses: '', perUserLimit: '1', isFirstPurchaseOnly: false,
  expiresAt: '', isActive: true,
};

const CouponModal = ({ coupon, onClose, onSave, saving }) => {
  const [form, setForm] = useState(coupon ? {
    ...coupon,
    value: String(coupon.value),
    minOrderAmount: String(coupon.minOrderAmount || 0),
    maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
    perUserLimit: String(coupon.perUserLimit || 1),
    expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
  } : EMPTY_FORM);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      code: form.code.toUpperCase().trim(),
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      perUserLimit: Number(form.perUserLimit) || 1,
      expiresAt: form.expiresAt || null,
    });
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-lg border-b border-outline-variant sticky top-0 bg-surface-container-lowest">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{coupon ? 'Editar Cupón' : 'Nuevo Cupón'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Código *</label>
            <input type="text" value={form.code} onChange={handleChange('code')} placeholder="DESCUENTO10" className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Tipo</label>
              <select value={form.type} onChange={handleChange('type')} className={inputClass}>
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
                Valor {form.type === 'percentage' ? '(%)' : '(CLP)'} *
              </label>
              <input type="number" value={form.value} onChange={handleChange('value')} min="0" max={form.type === 'percentage' ? 100 : undefined} className={inputClass} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Monto mínimo (CLP)</label>
              <input type="number" value={form.minOrderAmount} onChange={handleChange('minOrderAmount')} min="0" className={inputClass} />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Usos por usuario</label>
              <input type="number" value={form.perUserLimit} onChange={handleChange('perUserLimit')} min="1" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Máx. usos totales (vacío = ilimitado)</label>
              <input type="number" value={form.maxUses} onChange={handleChange('maxUses')} min="1" placeholder="Ilimitado" className={inputClass} />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Fecha de expiración</label>
              <input type="date" value={form.expiresAt} onChange={handleChange('expiresAt')} className={inputClass} />
            </div>
          </div>
          <div className="space-y-sm">
            <label className="flex items-center gap-sm cursor-pointer">
              <input type="checkbox" checked={form.isFirstPurchaseOnly} onChange={handleChange('isFirstPurchaseOnly')} className="accent-primary" />
              <span className="font-body-md text-body-md text-on-surface">Solo para primera compra</span>
            </label>
            <label className="flex items-center gap-sm cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={handleChange('isActive')} className="accent-primary" />
              <span className="font-body-md text-body-md text-on-surface">Cupón activo</span>
            </label>
          </div>
          <div className="flex gap-sm pt-sm border-t border-outline-variant">
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Guardando...' : coupon ? 'Guardar cambios' : 'Crear cupón'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border border-outline-variant py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminCoupons = () => {
  const { showNotification } = useApp();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const data = await api.get('/coupons');
      setCoupons(data);
    } catch (err) {
      console.error('Error al cargar cupones:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editingCoupon) {
        const updated = await api.put(`/coupons/${editingCoupon.id}`, data);
        setCoupons(coupons.map((c) => c.id === editingCoupon.id ? updated : c));
        showNotification('Cupón actualizado', 'success');
      } else {
        const created = await api.post('/coupons', data);
        setCoupons([created, ...coupons]);
        showNotification('Cupón creado', 'success');
      }
      setShowModal(false);
      setEditingCoupon(null);
    } catch (err) {
      showNotification(err.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.map((c) => c.id === id ? { ...c, isActive: false } : c));
      showNotification('Cupón desactivado', 'info');
    } catch (err) {
      showNotification(err.message || 'Error al eliminar', 'error');
    }
  };

  const isExpired = (date) => date && new Date() > new Date(date);

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h1 className="font-headline-md text-headline-md text-on-surface">Gestión de Cupones</h1>
        <button onClick={() => { setEditingCoupon(null); setShowModal(true); }} className="bg-primary text-on-primary px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-base">add</span>Nuevo Cupón
        </button>
      </header>

      <main className="p-lg overflow-y-auto">
        {/* Info primera compra */}
        <div className="bg-primary-container/30 border border-primary/20 rounded-xl p-md mb-lg flex items-start gap-sm">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div>
            <p className="font-label-md text-label-md text-on-surface">Descuento automático primera compra</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              El sistema aplica automáticamente un <strong>10% de descuento</strong> en la primera compra de cada usuario, sin necesidad de cupón.
            </p>
          </div>
        </div>

        {loading ? <LoadingSpinner text="Cargando cupones..." /> : (
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Código', 'Tipo', 'Valor', 'Usos', 'Expiración', 'Estado', 'Acciones'].map((h) => (
                      <th key={h} className="px-md py-sm text-left font-label-md text-label-md text-on-surface-variant whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {coupons.length === 0 ? (
                    <tr><td colSpan={7} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">No hay cupones creados</td></tr>
                  ) : coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-sm">
                        <span className="font-mono font-bold text-primary bg-primary-container/30 px-2 py-0.5 rounded">{c.code}</span>
                        {c.isFirstPurchaseOnly && <span className="ml-1 font-label-sm text-label-sm text-on-surface-variant">(1ª compra)</span>}
                      </td>
                      <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
                        {c.type === 'percentage' ? 'Porcentaje' : 'Fijo'}
                      </td>
                      <td className="px-md py-sm font-label-md text-label-md text-on-surface">
                        {c.type === 'percentage' ? `${c.value}%` : `$${Number(c.value).toLocaleString('es-CL')}`}
                      </td>
                      <td className="px-md py-sm font-body-sm text-body-sm text-on-surface">
                        {c.usedCount} / {c.maxUses ?? '∞'}
                      </td>
                      <td className="px-md py-sm font-body-sm text-body-sm">
                        {c.expiresAt
                          ? <span className={isExpired(c.expiresAt) ? 'text-error' : 'text-on-surface-variant'}>
                              {new Date(c.expiresAt).toLocaleDateString('es-CL')}
                              {isExpired(c.expiresAt) && ' (Expirado)'}
                            </span>
                          : <span className="text-on-surface-variant">Sin expiración</span>
                        }
                      </td>
                      <td className="px-md py-sm">
                        <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-lg ${c.isActive && !isExpired(c.expiresAt) ? 'bg-green-100 text-green-800' : 'bg-error-container text-on-error-container'}`}>
                          {c.isActive && !isExpired(c.expiresAt) ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-md py-sm">
                        <div className="flex gap-xs">
                          <button onClick={() => { setEditingCoupon(c); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-all">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => { setShowModal(false); setEditingCoupon(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
};

export default AdminCoupons;
