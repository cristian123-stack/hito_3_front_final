import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const AdminSidebar = () => {
  const { logout, showNotification, user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/admin', label: 'Panel de Control', icon: 'dashboard' },
    { to: '/admin/productos', label: 'Productos', icon: 'inventory_2' },
    { to: '/admin/pedidos', label: 'Pedidos', icon: 'receipt_long' },
    { to: '/admin/categorias', label: 'Categorías', icon: 'category' },
    { to: '/admin/cupones', label: 'Cupones', icon: 'local_offer' },
    { to: '/admin/usuarios', label: 'Usuarios', icon: 'group' },
    { to: '/catalogo', label: 'Ver Tienda', icon: 'storefront' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    showNotification('Sesión cerrada', 'info');
    navigate('/');
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 min-h-screen bg-surface-container-lowest border-r border-outline-variant flex flex-col flex-shrink-0`}>
      <div className="px-md py-lg flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-xs">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-base">pets</span>
            </div>
            <h1 className="font-headline-sm text-headline-sm text-primary">Panel Admin</h1>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-surface-container transition-all ml-auto">
          <span className="material-symbols-outlined text-on-surface-variant text-xl">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      <nav className="flex-1 px-xs py-md space-y-xs">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to}
            className={`flex items-center gap-sm px-md py-sm rounded-xl transition-all ${isActive(item.to) ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            title={collapsed ? item.label : ''}
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="font-label-md text-label-md">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-xs py-md border-t border-outline-variant">
        {!collapsed && user && (
          <div className="px-md py-xs mb-xs">
            <p className="font-label-md text-label-md text-on-surface truncate">{user.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{user.email}</p>
          </div>
        )}
        <button onClick={handleLogout} className="flex items-center gap-sm px-md py-sm w-full rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all" title={collapsed ? 'Cerrar sesión' : ''}>
          <span className="material-symbols-outlined text-xl">logout</span>
          {!collapsed && <span className="font-label-md text-label-md">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
