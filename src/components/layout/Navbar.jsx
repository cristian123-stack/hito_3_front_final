import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, cartCount, logout, showNotification } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Productos' },
    { to: '/catalogo?cat=Perros', label: 'Perros' },
    { to: '/catalogo?cat=Gatos', label: 'Gatos' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    showNotification('Sesión cerrada correctamente', 'info');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-center px-gutter py-sm max-w-[1280px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-xs">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-2xl">pets</span>
          </div>
          <span className="text-headline-md font-headline-md text-primary tracking-tight">Pet Store</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-md">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-label-md text-label-md transition-colors ${
                isActive(link.to)
                  ? 'text-primary border-b-2 border-primary pb-0.5'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-xs">
          {/* Carrito */}
          <Link to="/carrito" className="relative p-2 rounded-lg hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-on-surface-variant">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  Admin
                </Link>
              )}
              <Link to="/perfil" className="p-2 rounded-lg hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-on-primary px-md py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-all"
            >
              Iniciar Sesión
            </Link>
          )}

          {/* Hamburger mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-container"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant px-gutter py-md flex flex-col gap-sm">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              {isAdmin && (
                <Link to="/admin" className="font-label-md text-label-md text-on-surface-variant hover:text-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                  Panel Admin
                </Link>
              )}
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left font-label-md text-label-md text-on-surface-variant hover:text-primary py-2">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
