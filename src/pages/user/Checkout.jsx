import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import ProductImage from '../../components/common/ProductImage';
import { paymentService, orderService } from '../../services/api';
import api from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: { fontSize: '16px', color: '#181c1e', fontFamily: 'Inter, sans-serif', '::placeholder': { color: '#707783' } },
    invalid: { color: '#ba1a1a' },
  },
};

const CheckoutForm = ({ cart, cartTotal, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, showNotification, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState('');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponInput, setCouponInput] = useState('');

  const [firstPurchaseDiscount, setFirstPurchaseDiscount] = useState(0);
  const [isFirstPurchase, setIsFirstPurchase] = useState(false);

  const formatPrice = (p) =>
    Number(p)?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const shipping = cartTotal >= 25000 ? 0 : 3990;

  useEffect(() => {
    const checkFirstPurchase = async () => {
      try {
        const result = await api.get('/orders/me');
        const paidOrders = result.filter((o) => o.paymentStatus === 'paid');
        if (paidOrders.length === 0) {
          setFirstPurchaseDiscount(Math.round(cartTotal * 0.10));
          setIsFirstPurchase(true);
        }
      } catch (e) { /* ignorar */ }
    };
    checkFirstPurchase();
  }, [cartTotal]);

  const discount = couponData ? couponData.discount : firstPurchaseDiscount;
  const total = Math.max(0, cartTotal + shipping - discount);

  const handleValidateCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponData(null);
    try {
      const result = await api.post('/coupons/validate', {
        code: couponInput,
        orderAmount: cartTotal,
      });
      setCouponData(result);
      setCouponCode(couponInput);
    } catch (err) {
      setCouponError(err.message || 'Cupón no válido');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponCode('');
    setCouponInput('');
    setCouponError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setCardError('');
    try {
      const { clientSecret } = await paymentService.createPaymentIntent(total);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user?.name, email: user?.email },
        },
      });
      if (error) { setCardError(error.message); setLoading(false); return; }
      if (paymentIntent.status === 'succeeded') {
        const items = cart.map((i) => ({ productId: i.id, quantity: i.quantity }));
        const order = await orderService.create({ items, shippingAddress, couponCode: couponData ? couponCode : null });
        await paymentService.confirmPayment(paymentIntent.id, order.id);
        clearCart();
        showNotification('¡Pago exitoso! Tu pedido fue creado', 'success');
        onSuccess(order.id);
      }
    } catch (err) {
      showNotification(err.message || 'Error al procesar el pago', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-md">

      {/* ── RESUMEN DEL PEDIDO — va primero para que el usuario lo vea ── */}
      <div className="bg-surface-container-low rounded-xl p-md space-y-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Resumen del pedido</h3>

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between font-body-sm text-body-sm">
            <span className="text-on-surface-variant">{item.name} x{item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}

        <div className="border-t border-outline-variant pt-sm space-y-xs">
          <div className="flex justify-between font-body-sm text-body-sm">
            <span className="text-on-surface-variant">Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between font-body-sm text-body-sm">
            <span className="text-on-surface-variant">Envío</span>
            <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
              {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
            </span>
          </div>

          {/* Descuento primera compra */}
          {isFirstPurchase && !couponData && firstPurchaseDiscount > 0 && (
            <div className="flex justify-between font-body-sm text-body-sm text-green-700 bg-green-50 rounded-lg px-sm py-xs">
              <span className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
                Descuento primera compra (10%)
              </span>
              <span className="font-semibold">-{formatPrice(firstPurchaseDiscount)}</span>
            </div>
          )}

          {/* Descuento cupón */}
          {couponData && (
            <div className="flex justify-between font-body-sm text-body-sm text-green-700 bg-green-50 rounded-lg px-sm py-xs">
              <span className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>local_offer</span>
                Cupón {couponData.coupon.code}
                {couponData.coupon.type === 'percentage' ? ` (${couponData.coupon.value}%)` : ''}
              </span>
              <span className="font-semibold">-{formatPrice(couponData.discount)}</span>
            </div>
          )}

          <div className="flex justify-between font-headline-sm text-headline-sm border-t border-outline-variant pt-xs">
            <span>Total a pagar</span>
            <span className="text-primary text-xl">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* ── CUPÓN ── */}
      <div>
        <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
          Código de descuento
        </label>

        {couponData ? (
          /* Cupón aplicado — feedback claro */
          <div className="rounded-xl border-2 border-green-400 bg-green-50 p-md space-y-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-green-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <p className="font-label-md text-label-md text-green-800">¡Cupón aplicado correctamente!</p>
                  <p className="font-body-sm text-body-sm text-green-700">
                    {couponData.coupon.code} — {couponData.coupon.type === 'percentage' ? `${couponData.coupon.value}% de descuento` : `$${Number(couponData.coupon.value).toLocaleString('es-CL')} de descuento`}
                  </p>
                </div>
              </div>
              <button type="button" onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800 p-1 rounded-lg hover:bg-green-100 transition-all" title="Quitar cupón">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="flex justify-between font-body-sm text-body-sm bg-green-100 rounded-lg px-sm py-xs">
              <span className="text-green-800">Ahorro total:</span>
              <span className="font-bold text-green-800">{formatPrice(couponData.discount)}</span>
            </div>
          </div>
        ) : (
          /* Input de cupón */
          <div className="space-y-xs">
            <div className="flex gap-sm">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleValidateCoupon())}
                placeholder="Ingresa tu código aquí"
                className={`flex-1 px-4 py-2 rounded-lg border font-body-md text-body-md uppercase transition-all focus:outline-none focus:ring-2 focus:ring-primary ${couponError ? 'border-error bg-error-container/10' : 'border-outline-variant bg-surface'}`}
              />
              <button
                type="button"
                onClick={handleValidateCoupon}
                disabled={couponLoading || !couponInput.trim()}
                className="bg-primary text-on-primary px-md py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-xs"
              >
                {couponLoading
                  ? <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />Validando...</>
                  : <><span className="material-symbols-outlined text-base">local_offer</span>Aplicar</>
                }
              </button>
            </div>

            {/* Error del cupón — mensaje claro */}
            {couponError && (
              <div className="flex items-center gap-xs bg-error-container/20 border border-error/30 rounded-lg px-sm py-xs">
                <span className="material-symbols-outlined text-error text-base" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                <p className="text-error font-body-sm text-body-sm">{couponError}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DIRECCIÓN ── */}
      <div>
        <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Dirección de envío</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">home</span>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Calle, número, ciudad"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md"
          />
        </div>
      </div>

      {/* ── TARJETA ── */}
      <div>
        <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Datos de tarjeta</label>
        <div className="p-4 rounded-lg border border-outline-variant bg-surface focus-within:ring-2 focus-within:ring-primary transition-all">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        {cardError && (
          <div className="flex items-center gap-xs mt-1 bg-error-container/20 border border-error/30 rounded-lg px-sm py-xs">
            <span className="material-symbols-outlined text-error text-base" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <p className="text-error font-body-sm text-body-sm">{cardError}</p>
          </div>
        )}
        <div className="mt-sm p-sm bg-primary-container/30 rounded-lg">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Tarjetas de prueba Stripe:</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">✅ Exitoso: <span className="font-mono">4242 4242 4242 4242</span></p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">❌ Fallido: <span className="font-mono">4000 0000 0000 0002</span></p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Fecha: cualquier futura · CVC: cualquier 3 dígitos</p>
        </div>
      </div>

      {/* ── BOTÓN PAGAR ── */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary text-on-primary py-md rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-sm"
      >
        {loading
          ? <><div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />Procesando pago...</>
          : <><span className="material-symbols-outlined text-base">lock</span>Pagar {formatPrice(total)}</>
        }
      </button>

      <p className="text-center font-body-sm text-body-sm text-on-surface-variant flex items-center justify-center gap-xs">
        <span className="material-symbols-outlined text-base">security</span>
        Pago seguro procesado por Stripe
      </p>
    </form>
  );
};

const Checkout = () => {
  const { cart, cartTotal, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    if (cart.length === 0 && !orderSuccess) navigate('/carrito');
  }, [isAuthenticated, cart, orderSuccess]);

  const formatPrice = (p) =>
    p?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  if (orderSuccess) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-gutter py-xl max-w-lg text-center">
          <div className="bg-surface-container-lowest rounded-2xl p-xl shadow-[0px_8px_40px_rgba(0,0,0,0.08)]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-green-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">¡Pago exitoso!</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xs">
              Tu pedido <strong className="text-primary">#{orderSuccess}</strong> fue creado correctamente.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">Recibirás una confirmación pronto.</p>
            <div className="flex gap-sm justify-center">
              <button onClick={() => navigate('/mis-pedidos')} className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">Ver mis pedidos</button>
              <button onClick={() => navigate('/catalogo')} className="border border-outline-variant px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">Seguir comprando</button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-gutter py-lg max-w-[1280px]">
        <h1 className="font-display-lg-mobile text-on-surface mb-lg">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">credit_card</span>
              Información de pago
            </h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm cart={cart} cartTotal={cartTotal} onSuccess={(id) => setOrderSuccess(id)} />
            </Elements>
          </div>
          <div className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Productos ({cart.length})</h2>
            {cart.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest rounded-xl p-md flex gap-md items-center shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
                <div className="w-16 h-16 flex-shrink-0">
                  <ProductImage imageUrl={item.imageUrl} alt={item.name} className="w-full h-full rounded-lg" icon="inventory_2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-label-md text-on-surface line-clamp-1">{item.name}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Cantidad: {item.quantity}</p>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Checkout;