import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Notification from './components/common/Notification';

// Páginas públicas
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Catalog from './pages/public/Catalog';
import ProductDetail from './pages/public/ProductDetail';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';

// Páginas de usuario
import Cart from './pages/user/Cart';
import Profile from './pages/user/Profile';
import MyOrders from './pages/user/MyOrders';
import Favorites from './pages/user/Favorites';
import Checkout from './pages/user/Checkout';

// Páginas de admin
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCoupons from './pages/admin/AdminCoupons';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Notification />
        <Routes>
          {/* ---- Rutas públicas ---- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* ---- Rutas de usuario ---- */}
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mis-pedidos" element={<MyOrders />} />
          <Route path="/favoritos" element={<Favorites />} />

          {/* ---- Rutas de admin ---- */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/productos" element={<AdminProducts />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin/categorias" element={<AdminCategories />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/cupones" element={<AdminCoupons />} />

          {/* ---- 404 ---- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
