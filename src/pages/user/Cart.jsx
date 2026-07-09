import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import ProductImage from '../../components/common/ProductImage';

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateCartItem, clearCart, showNotification, isAuthenticated, products } = useApp();
  const navigate = useNavigate();

  const formatPrice = (p) =>
    p?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const shipping = cartTotal >= 25000 ? 0 : 3990;

  // Obtener stock real del producto
  const getStock = (productId) => {
    const p = products.find((p) => p.id === productId);
    return p ? p.stock : 0;
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showNotification('Debes iniciar sesión para comprar', 'warning');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-gutter py-xl max-w-[1280px] flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-8xl mb-md">shopping_cart</span>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Tu carrito está vacío</h1>
          <p className="text-on-surface-variant font-body-md text-body-md mb-lg">Explora nuestro catálogo y encuentra algo para tu mascota</p>
          <button onClick={() => navigate('/catalogo')} className="bg-primary text-on-primary px-xl py-md rounded-lg font-headline-sm text-headline-sm hover:opacity-90 transition-all">
            Ir al catálogo
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-gutter py-lg max-w-[1280px]">
        <h1 className="font-display-lg-mobile md:text-display-lg text-on-surface mb-lg">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Items */}
          <div className="lg:col-span-2 space-y-md">
            {cart.map((item) => {
              const stock = getStock(item.id);
              const atMax = item.quantity >= stock;
              return (
                <div key={item.id} className="bg-surface-container-lowest rounded-xl p-md flex gap-md items-start shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
                  <div className="w-24 h-24 flex-shrink-0">
                    <ProductImage imageUrl={item.imageUrl} alt={item.name} className="w-full h-full rounded-lg" icon="inventory_2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/productos/${item.id}`} className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors line-clamp-2 block">
                      {item.name}
                    </Link>
                    {atMax && (
                      <p className="font-body-sm text-body-sm text-yellow-600 mt-xs">
                        Máximo disponible alcanzado ({stock} unidades)
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-sm flex-wrap gap-sm">
                      <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1.5 hover:bg-surface-container transition-all font-bold"
                        >−</button>
                        <span className="px-3 py-1.5 font-body-md text-body-md min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (item.quantity >= stock) {
                              showNotification(`Solo hay ${stock} unidades disponibles`, 'error');
                              return;
                            }
                            updateCartItem(item.id, item.quantity + 1);
                          }}
                          disabled={atMax}
                          className="px-3 py-1.5 hover:bg-surface-container transition-all font-bold disabled:opacity-30"
                        >+</button>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-primary">{formatPrice(item.price * item.quantity)}</span>
                      <button
                        onClick={() => { removeFromCart(item.id); showNotification('Producto eliminado', 'info'); }}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => { clearCart(); showNotification('Carrito vaciado', 'info'); }}
              className="text-on-surface-variant font-label-md text-label-md hover:text-error transition-colors flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-base">delete_sweep</span>Vaciar carrito
            </button>
          </div>

          {/* Resumen */}
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] h-fit sticky top-24">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Resumen</h2>
            <div className="space-y-sm mb-md">
              <div className="flex justify-between font-body-md text-body-md">
                <span className="text-on-surface-variant">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md">
                <span className="text-on-surface-variant">Envío</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Agrega {formatPrice(25000 - cartTotal)} más para envío gratis
                </p>
              )}
              <div className="border-t border-outline-variant pt-sm flex justify-between font-headline-sm text-headline-sm">
                <span>Total</span>
                <span className="text-primary">{formatPrice(cartTotal + shipping)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-on-primary py-md rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-xs"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              Proceder al pago
            </button>
            {!isAuthenticated && (
              <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-sm">
                <Link to="/login" className="text-primary hover:underline">Inicia sesión</Link> para comprar
              </p>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Cart;