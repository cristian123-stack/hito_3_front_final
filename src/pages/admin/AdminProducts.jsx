import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApp } from '../../context/AppContext';

// Mapeo práctico para convertir Nombre <-> ID de categoría de PostgreSQL
const CATEGORIES_MAP = [
  { id: 1, name: 'Perros' },
  { id: 2, name: 'Gatos' },
];

const EMPTY_FORM = {
  name: '', price: '', originalPrice: '', categoryId: 1,
  badge: '', description: '', stock: '', rating: '5', reviews: '0', imageUrl: '',
};

const BADGES = ['', 'Popular', 'Nuevo', 'Oferta', 'Mejor Valorado'];

const ProductFormModal = ({ product, onClose, onSave, saving }) => {
  const [form, setForm] = useState(
    product
      ? { 
          ...product, 
          price: String(product.price), 
          originalPrice: String(product.originalPrice || ''), 
          stock: String(product.stock), 
          rating: String(product.rating), 
          reviews: String(product.reviews), 
          imageUrl: product.imageUrl || '',
          // Nos aseguramos de capturar el ID numérico
          categoryId: product.categoryId || (typeof product.category === 'object' ? product.category?.id : 1) || 1
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [previewError, setPreviewError] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'El nombre es requerido';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Precio inválido';
    if (!form.description.trim()) e.description = 'La descripción es requerida';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Stock inválido';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock),
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      categoryId: Number(form.categoryId), // 👈 Enviamos categoryId a PostgreSQL
      badge: form.badge || null,
      imageUrl: form.imageUrl || null,
    });
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 rounded-lg border font-body-md text-body-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors[field] ? 'border-error' : 'border-outline-variant focus:border-primary'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-lg border-b border-outline-variant sticky top-0 bg-surface-container-lowest rounded-t-2xl">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Nombre *</label>
            <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Ej: Alimento Premium" className={inputClass('name')} />
            {errors.name && <p className="text-error font-body-sm text-body-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Descripción *</label>
            <textarea value={form.description} onChange={handleChange('description')} rows={3} className={`${inputClass('description')} resize-none`} />
            {errors.description && <p className="text-error font-body-sm text-body-sm mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Precio (CLP) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-sm text-body-sm text-on-surface-variant">$</span>
                <input type="number" value={form.price} onChange={handleChange('price')} min="0" className={`${inputClass('price')} pl-7`} />
              </div>
              {errors.price && <p className="text-error font-body-sm text-body-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Precio original</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-sm text-body-sm text-on-surface-variant">$</span>
                <input type="number" value={form.originalPrice} onChange={handleChange('originalPrice')} min="0" className={`${inputClass('originalPrice')} pl-7`} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Categoría</label>
              <select value={form.categoryId} onChange={handleChange('categoryId')} className={inputClass('categoryId')}>
                {CATEGORIES_MAP.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Etiqueta</label>
              <select value={form.badge} onChange={handleChange('badge')} className={inputClass('badge')}>
                {BADGES.map((b) => <option key={b} value={b}>{b || 'Sin etiqueta'}</option>)}
              </select>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Stock *</label>
              <input type="number" value={form.stock} onChange={handleChange('stock')} min="0" className={inputClass('stock')} />
              {errors.stock && <p className="text-error font-body-sm text-body-sm mt-1">{errors.stock}</p>}
            </div>
          </div>
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant block mb-1">URL de imagen</label>
            <div className="flex gap-sm items-start">
              <div className="flex-1">
                <input type="url" value={form.imageUrl} onChange={(e) => { handleChange('imageUrl')(e); setPreviewError(false); }} placeholder="https://ejemplo.com/imagen.jpg" className={inputClass('imageUrl')} />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Pega el link directo a la imagen</p>
              </div>
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden flex-shrink-0 bg-surface-container">
                {form.imageUrl && !previewError ? (
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewError(true)} />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant opacity-40">image</span>
                )}
              </div>
            </div>
            {previewError && <p className="text-error font-body-sm text-body-sm mt-1">No se pudo cargar la imagen</p>}
          </div>
          <div className="flex gap-sm pt-sm border-t border-outline-variant">
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
              {saving ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
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

const AdminProducts = () => {
  const { products, productsLoading, addProduct, updateProduct, deleteProduct, showNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const formatPrice = (p) =>
    Number(p)?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  // Función auxiliar para obtener el nombre seguro de la categoría
  const getCategoryName = (p) => {
    if (typeof p.category === 'object' && p.category?.name) return p.category.name;
    if (p.categoryId === 1) return 'Perros';
    if (p.categoryId === 2) return 'Gatos';
    if (typeof p.category === 'string') return p.category;
    return 'Sin categoría';
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const catName = getCategoryName(p);
    const matchCat = categoryFilter === 'Todos' || catName === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct({ ...editingProduct, ...data });
        showNotification('Producto actualizado', 'success');
      } else {
        await addProduct(data);
        showNotification('Producto creado', 'success');
      }
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      showNotification(err.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      showNotification('Producto eliminado', 'info');
      setShowDeleteConfirm(null);
    } catch (err) {
      showNotification(err.message || 'Error al eliminar', 'error');
    }
  };

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h1 className="font-headline-md text-headline-md text-on-surface">Gestión de Productos</h1>
        <button onClick={() => { setEditingProduct(null); setShowModal(true); }} className="bg-primary text-on-primary px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-base">add</span>Nuevo Producto
        </button>
      </header>

      <main className="p-lg overflow-y-auto space-y-md">
        {productsLoading ? <LoadingSpinner text="Cargando productos..." /> : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {[
                { label: 'Total', value: products.length, icon: 'inventory_2' },
                { label: 'Perros', value: products.filter((p) => getCategoryName(p) === 'Perros').length, icon: 'pets' },
                { label: 'Gatos', value: products.filter((p) => getCategoryName(p) === 'Gatos').length, icon: 'pets' },
                { label: 'Sin stock', value: products.filter((p) => p.stock === 0).length, icon: 'remove_shopping_cart' },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-md">
                  <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{stat.label}</p>
                    <p className="font-headline-sm text-headline-sm text-on-surface">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-sm">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-base">search</span>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {['Todos', 'Perros', 'Gatos'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['Imagen', 'Producto', 'Categoría', 'Precio', 'Stock', 'Etiqueta', 'Acciones'].map((h) => (
                        <th key={h} className="px-md py-sm text-left font-label-md text-label-md text-on-surface-variant whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">No hay productos</td></tr>
                    ) : filtered.map((product) => (
                      <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-sm">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container border border-outline-variant flex items-center justify-center">
                            {product.imageUrl
                              ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                              : <span className="material-symbols-outlined text-on-surface-variant opacity-40">image</span>
                            }
                          </div>
                        </td>
                        <td className="px-md py-sm">
                          <p className="font-label-md text-label-md text-on-surface line-clamp-1 max-w-[200px]">{product.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 max-w-[200px]">{product.description}</p>
                        </td>
                        <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
                          {/* 👈 Renderizado seguro del texto de la categoría para evitar el Error #31 */}
                          {getCategoryName(product)}
                        </td>
                        <td className="px-md py-sm">
                          <p className="font-label-md text-label-md text-primary">{formatPrice(product.price)}</p>
                          {product.originalPrice && <p className="font-body-sm text-body-sm text-on-surface-variant line-through">{formatPrice(product.originalPrice)}</p>}
                        </td>
                        <td className="px-md py-sm">
                          <span className={`font-label-md text-label-md ${product.stock === 0 ? 'text-error' : product.stock < 10 ? 'text-yellow-600' : 'text-on-surface'}`}>{product.stock}</span>
                        </td>
                        <td className="px-md py-sm">
                          {product.badge
                            ? <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2 py-0.5 rounded-lg">{product.badge}</span>
                            : <span className="text-on-surface-variant font-body-sm text-body-sm">—</span>
                          }
                        </td>
                        <td className="px-md py-sm">
                          <div className="flex gap-xs">
                            <button onClick={() => { setEditingProduct(product); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all" title="Editar">
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button onClick={() => setShowDeleteConfirm(product)} className="p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-all" title="Eliminar">
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-md py-sm bg-surface-container-low border-t border-outline-variant">
                <span className="font-body-sm text-body-sm text-on-surface-variant">{filtered.length} producto(s)</span>
              </div>
            </div>
          </>
        )}
      </main>

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-lg w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-10 h-10 bg-error-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-error">delete</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Eliminar producto</h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              ¿Eliminar <strong className="text-on-surface">{showDeleteConfirm.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-sm">
              <button onClick={() => handleDelete(showDeleteConfirm.id)} className="flex-1 bg-error text-on-error py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">Eliminar</button>
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border border-outline-variant py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;