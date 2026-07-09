import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import ProductImage from '../../components/common/ProductImage';
import StarRating from '../../components/common/StarRating';
import ProductCard from '../../components/common/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, isFavorite, showNotification, products, cart } = useApp();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === Number(id));
  const related = products.filter((p) => p.id !== Number(id)).slice(0, 4);
  const fav = product ? isFavorite(product.id) : false;

  if (!product) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center py-xl">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-md">search_off</span>
          <h2 className="font-headline-md text-headline-md text-on-surface">Producto no encontrado</h2>
          <button onClick={() => navigate('/catalogo')} className="mt-md bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md">
            Ver catálogo
          </button>
        </div>
      </PublicLayout>
    );
  }

  // Cantidad ya en el carrito
  const inCart = cart.find((i) => i.id === product.id);
  const quantityInCart = inCart ? inCart.quantity : 0;
  const maxDisponible = product.stock - quantityInCart;
  const sinStock = product.stock === 0;

  const formatPrice = (p) =>
    p?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const handleAddToCart = () => {
    if (maxDisponible <= 0) {
      showNotification(`Ya tienes el máximo disponible en el carrito (${product.stock})`, 'error');
      return;
    }
    if (quantity > maxDisponible) {
      showNotification(`Solo puedes agregar ${maxDisponible} más — ya tienes ${quantityInCart} en el carrito`, 'error');
      return;
    }
    addToCart(product, quantity);
    showNotification(`${product.name} añadido al carrito`, 'success');
  };

  const handleFavorite = () => {
    toggleFavorite(product);
    showNotification(fav ? 'Eliminado de favoritos' : 'Añadido a favoritos', 'success');
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-gutter py-lg max-w-[1280px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-xs text-on-surface-variant py-md font-label-md text-label-md mb-md flex-wrap">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to={`/catalogo?cat=${product.category}`} className="hover:text-primary">{product.category}</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface line-clamp-1">{product.name}</span>
        </nav>

        {/* Detalle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl mb-xl">
          {/* Imagen */}
          <div className="bg-white rounded-xl p-lg flex items-center justify-center min-h-[350px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            <ProductImage
              imageUrl={product.imageUrl}
              alt={product.name}
              className="w-full max-w-xs"
              icon="inventory_2"
            />
          </div>

          {/* Info */}
          <div className="space-y-md">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">{product.category}</span>
              <h1 className="font-headline-md text-display-lg-mobile md:text-headline-md text-on-surface mt-xs">
                {product.name}
              </h1>
            </div>

            <StarRating rating={product.rating} reviews={product.reviews} />

            <div className="flex items-baseline gap-sm">
              <span className="font-display-lg-mobile text-display-lg-mobile text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-on-surface-variant line-through font-body-lg text-body-lg">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="font-body-lg text-body-lg text-on-surface-variant">{product.description}</p>

            {/* Stock */}
            {sinStock ? (
              <div className="flex items-center gap-xs bg-error-container/30 border border-error/30 rounded-lg px-md py-sm">
                <span className="material-symbols-outlined text-error text-base">inventory</span>
                <span className="font-label-md text-label-md text-error">Producto sin stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-xs">
                <span className={`font-body-sm text-body-sm ${product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {product.stock <= 5 ? `⚠️ Solo quedan ${product.stock} unidades` : `✅ ${product.stock} disponibles`}
                </span>
                {quantityInCart > 0 && (
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    ({quantityInCart} en tu carrito)
                  </span>
                )}
              </div>
            )}

            {/* Cantidad */}
            {!sinStock && (
              <div className="flex items-center gap-sm">
                <span className="font-label-md text-label-md text-on-surface-variant">Cantidad:</span>
                <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-surface-container transition-all font-bold"
                  >−</button>
                  <span className="px-md py-2 font-body-md text-body-md min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxDisponible, quantity + 1))}
                    disabled={quantity >= maxDisponible}
                    className="px-3 py-2 hover:bg-surface-container transition-all font-bold disabled:opacity-30"
                  >+</button>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Máx. {maxDisponible} {maxDisponible !== product.stock ? `(${quantityInCart} en carrito)` : ''}
                </span>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-sm flex-wrap">
              <button
                onClick={handleAddToCart}
                disabled={sinStock || maxDisponible <= 0}
                className="flex-1 bg-primary text-on-primary py-md rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {sinStock ? 'Sin stock' : maxDisponible <= 0 ? 'Máximo en carrito' : 'Añadir al carrito'}
              </button>
              <button
                onClick={handleFavorite}
                className={`p-3 rounded-lg border-2 transition-all ${fav ? 'border-error bg-error-container text-on-error-container' : 'border-outline-variant hover:border-error text-on-surface-variant'}`}
                aria-label="Favorito"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
            </div>

            {/* Info adicional */}
            <div className="bg-surface-container-low rounded-xl p-md space-y-sm">
              {[
                { icon: 'local_shipping', text: 'Envío gratis en compras sobre $25.000' },
                { icon: 'autorenew', text: 'Devolución gratis en 30 días' },
                { icon: 'verified', text: 'Productos 100% originales' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                  <span className="font-body-sm text-body-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        <section className="mt-xl pt-xl border-t border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default ProductDetail;