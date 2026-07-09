import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductImage from './ProductImage';
import StarRating from './StarRating';
import Badge from './Badge';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, isFavorite, showNotification, cart } = useApp();
  const fav = isFavorite(product.id);

  // Cantidad ya en el carrito
  const inCart = cart.find((i) => i.id === product.id);
  const quantityInCart = inCart ? inCart.quantity : 0;
  const sinStock = product.stock === 0;
  const stockAgotado = quantityInCart >= product.stock;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (stockAgotado) {
      showNotification(`Stock insuficiente — solo hay ${product.stock} disponibles`, 'error');
      return;
    }
    addToCart(product);
    showNotification(`${product.name} añadido al carrito`, 'success');
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(product);
    showNotification(fav ? 'Eliminado de favoritos' : 'Añadido a favoritos', 'success');
  };

  const formatPrice = (p) =>
    p?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  return (
    <div
      className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-all group flex flex-col cursor-pointer"
      onClick={() => navigate(`/productos/${product.id}`)}
    >
      {/* Imagen */}
      <div className="relative h-56 bg-white p-md flex items-center justify-center overflow-hidden">
        <ProductImage
          imageUrl={product.imageUrl}
          alt={product.name}
          className="max-h-full w-full group-hover:scale-105 transition-transform duration-300"
          icon="inventory_2"
        />
        {product.badge && (
          <span className="absolute top-sm left-sm">
            <Badge label={product.badge} />
          </span>
        )}
        {sinStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-error text-on-error font-label-md text-label-md px-md py-xs rounded-lg">Sin stock</span>
          </div>
        )}
        <button
          onClick={handleFavorite}
          className="absolute top-sm right-sm p-1 rounded-full bg-white/80 hover:bg-white transition-all"
          aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <span
            className={`material-symbols-outlined text-xl ${fav ? 'text-error' : 'text-on-surface-variant'}`}
            style={{ fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="p-md flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs line-clamp-2">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviews={product.reviews} />
          <div className="flex items-center gap-xs mt-xs">
            <span className="font-headline-sm text-headline-sm text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-on-surface-variant line-through font-body-sm text-body-sm">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {/* Stock bajo */}
          {!sinStock && product.stock <= 5 && (
            <p className="font-body-sm text-body-sm text-yellow-600 mt-xs">
              ¡Solo quedan {product.stock}!
            </p>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={sinStock || stockAgotado}
          className="mt-md w-full bg-primary text-on-primary py-2 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sinStock ? 'Sin stock' : stockAgotado ? 'Máximo alcanzado' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;