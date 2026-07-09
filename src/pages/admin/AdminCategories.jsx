import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { categoryService } from '../../services/api';

const AdminCategories = () => {
  const { showNotification } = useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [form, setForm] = useState({ name: '', icon: 'category' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editingCat) {
        const updated = await categoryService.update(editingCat.id, form);
        setCategories(categories.map((c) => c.id === editingCat.id ? updated : c));
        showNotification('Categoría actualizada', 'success');
      } else {
        const created = await categoryService.create(form);
        setCategories([...categories, { ...created, productCount: 0 }]);
        showNotification('Categoría creada', 'success');
      }
      setShowModal(false);
      setForm({ name: '', icon: 'category' });
      setEditingCat(null);
    } catch (err) {
      showNotification(err.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      setCategories(categories.filter((c) => c.id !== id));
      showNotification('Categoría eliminada', 'info');
    } catch (err) {
      showNotification(err.message || 'Error al eliminar', 'error');
    }
  };

  const openEdit = (cat) => { setEditingCat(cat); setForm({ name: cat.name, icon: cat.icon }); setShowModal(true); };
  const openNew = () => { setEditingCat(null); setForm({ name: '', icon: 'category' }); setShowModal(true); };

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h2 className="font-headline-md text-headline-md text-on-surface">Gestión de Categorías</h2>
        <button onClick={openNew} className="bg-primary text-on-primary px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-base">add</span>Nueva Categoría
        </button>
      </header>

      <main className="p-lg overflow-y-auto">
        {loading ? <LoadingSpinner text="Cargando categorías..." /> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
              {[
                { label: 'Total Categorías', value: categories.length, icon: 'category' },
                { label: 'Más productos', value: [...categories].sort((a, b) => (b.productCount || 0) - (a.productCount || 0))[0]?.name || '—', icon: 'trending_up' },
                { label: 'Total productos', value: categories.reduce((s, c) => s + (c.productCount || 0), 0), icon: 'inventory_2' },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-md">
                  <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{stat.label}</p>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-md group">
                  <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container">{cat.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-label-md text-label-md text-on-surface">{cat.name}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{cat.productCount || 0} productos</p>
                  </div>
                  <div className="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-surface-container transition-all text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-error-container transition-all text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-lg w-full max-w-md shadow-2xl">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
              {editingCat ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>
            <div className="space-y-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Nombre</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre de la categoría" className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Ícono (Material Icons)</label>
                <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="pets, category, toys..." className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md" />
              </div>
            </div>
            <div className="flex gap-sm mt-lg">
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all disabled:opacity-50">
                {saving ? 'Guardando...' : editingCat ? 'Guardar cambios' : 'Crear categoría'}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-outline-variant py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
