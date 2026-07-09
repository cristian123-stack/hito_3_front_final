import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { userService } from '../../services/api';

const AdminUsers = () => {
  const { showNotification } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data.users || data);
      } catch (err) {
        console.error('Error al cargar usuarios:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await userService.delete(id);
      setUsers(users.filter((u) => u.id !== id));
      showNotification('Usuario desactivado', 'info');
    } catch (err) {
      showNotification(err.message || 'Error al eliminar', 'error');
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h1 className="font-display-lg-mobile text-on-surface">Gestión de Usuarios</h1>
      </header>
      <main className="p-lg overflow-y-auto">
        {loading ? <LoadingSpinner text="Cargando usuarios..." /> : (
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant">
            <div className="p-md flex flex-col md:flex-row gap-sm border-b border-outline-variant">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-base">search</span>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o correo..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="py-2 px-3 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">Todos los roles</option>
                <option value="user">Clientes</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Usuario', 'Correo', 'Rol', 'Registrado', 'Estado', 'Acciones'].map((h) => (
                      <th key={h} className="px-md py-sm text-left font-label-md text-label-md text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">Sin usuarios</td></tr>
                  ) : filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-sm">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-primary-container text-base">person</span>
                          </div>
                          <span className="font-label-md text-label-md text-on-surface">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">{user.email}</td>
                      <td className="px-md py-sm"><Badge label={user.role === 'admin' ? 'Admin' : 'Cliente'} variant={user.role === 'admin' ? 'default' : 'success'} /></td>
                      <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">{new Date(user.createdAt).toLocaleDateString('es-CL')}</td>
                      <td className="px-md py-sm">
                        <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-lg ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-error-container text-on-error-container'}`}>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-md py-sm">
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-all" title="Desactivar">
                          <span className="material-symbols-outlined text-base">person_off</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-md py-sm bg-surface-container-low border-t border-outline-variant">
              <span className="font-body-sm text-body-sm text-on-surface-variant">{filtered.length} usuarios</span>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminUsers;
