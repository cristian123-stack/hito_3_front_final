import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/perfil', label: 'Mi Perfil', icon: 'account_circle' },
    { to: '/mis-pedidos', label: 'Mis Pedidos', icon: 'receipt_long' },
    { to: '/favoritos', label: 'Favoritos', icon: 'favorite' },
    { to: '/carrito', label: 'Mi Carrito', icon: 'shopping_cart' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen bg-surface-container-lowest border-r border-outline-variant flex-col py-lg px-xs">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-sm px-md py-sm rounded-xl transition-all mb-xs ${
              isActive(item.to)
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="font-label-md text-label-md">{item.label}</span>
          </Link>
        ))}
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest shadow-[0px_-4px_20px_rgba(0,0,0,0.06)] flex justify-around py-xs border-t border-outline-variant z-50">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-base py-xs px-sm ${
              isActive(item.to) ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: isActive(item.to) ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm">{item.label.split(' ')[1] || item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default UserSidebar;
