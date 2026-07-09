import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import UserSidebar from '../../components/layout/UserSidebar';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';

const Profile = () => {
  const { user, isAuthenticated, updateUser, showNotification } = useApp();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(form);
      showNotification('Perfil actualizado correctamente', 'success');
      setEditing(false);
    } catch (err) {
      showNotification(err.message || 'Error al actualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-72px)]">
        <UserSidebar />
        <main className="flex-1 p-lg pb-24 md:pb-lg">
          <header className="mb-lg">
            <h1 className="font-display-lg-mobile text-on-surface mb-xs">Mi Perfil</h1>
            <p className="text-on-surface-variant font-body-md text-body-md">Gestiona tu información personal</p>
          </header>

          <div className="grid md:grid-cols-3 gap-md">
            {/* Avatar */}
            <div className="md:col-span-1 bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
              <div className="w-28 h-28 mb-md">
                <ImagePlaceholder alt="Foto de perfil" className="w-full h-full rounded-full" icon="account_circle" />
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">{user?.name}</h2>
              <p className="text-on-surface-variant font-body-sm text-body-sm">{user?.email}</p>
              <span className="mt-xs inline-flex items-center gap-1 bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2 py-1 rounded-lg capitalize">
                {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>

            {/* Info personal */}
            <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-md">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Información Personal</h3>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-xs text-primary font-label-md text-label-md hover:underline">
                    <span className="material-symbols-outlined text-base">edit</span>Editar
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="space-y-md">
                  {[
                    { key: 'name', label: 'Nombre completo', icon: 'person' },
                    { key: 'phone', label: 'Teléfono', icon: 'phone' },
                    { key: 'address', label: 'Dirección', icon: 'home' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="font-label-md text-label-md text-on-surface-variant block mb-1">{f.label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">{f.icon}</span>
                        <input
                          type="text"
                          value={form[f.key]}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-sm">
                    <button type="submit" disabled={loading} className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all disabled:opacity-50">
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="border border-outline-variant px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-md">
                  {[
                    { label: 'Nombre', value: user?.name, icon: 'person' },
                    { label: 'Correo', value: user?.email, icon: 'email' },
                    { label: 'Teléfono', value: user?.phone || 'No configurado', icon: 'phone' },
                    { label: 'Dirección', value: user?.address || 'No configurada', icon: 'home' },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-md py-sm border-b border-outline-variant last:border-0">
                      <span className="material-symbols-outlined text-primary">{f.icon}</span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{f.label}</p>
                        <p className="font-body-md text-body-md text-on-surface">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </PublicLayout>
  );
};

export default Profile;
