import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import ProductCard from '../../components/common/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const { products } = useApp();
  const featuredProducts = products.slice(0, 4);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative w-full h-[600px] overflow-hidden flex items-center bg-gradient-to-r from-primary-fixed to-surface-container">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full flex items-center justify-end pr-20">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '400px', opacity: 0.3 }}>pets</span>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden md:block">
          <img
            src="https://img2.huffingtonpost.es/files/og_thumbnail/uploads/2022/12/10/6394010fad68e.jpeg"
            alt="Perro y gato felices"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-gutter relative z-10 max-w-[1280px]">
          <div className="max-w-xl space-y-md">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight text-on-surface">
              Todo para tu <span className="text-primary">mejor amigo</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Descubre la mejor selección de alimentos premium, accesorios divertidos y cuidados especializados para perros y gatos.
            </p>
            <div className="flex gap-sm flex-wrap">
              <button
                onClick={() => navigate('/catalogo')}
                className="bg-primary text-on-primary px-xl py-md rounded-lg font-headline-sm text-headline-sm hover:shadow-lg transition-all active:scale-95"
              >
                Comprar Ahora
              </button>
              <button
                onClick={() => navigate('/catalogo')}
                className="bg-white border-2 border-primary text-primary px-xl py-md rounded-lg font-headline-sm text-headline-sm hover:bg-primary-fixed/10 transition-all"
              >
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Bento */}
      <section className="py-xl container mx-auto px-gutter max-w-[1280px]">
        <div className="flex justify-between items-end mb-lg">
          <div className="space-y-xs">
            <span className="text-primary font-label-sm text-label-sm uppercase tracking-widest">Explora</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Nuestras Especialidades</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md h-auto md:h-[500px]">
          {/* Mundo Canino */}
          <div
            className="relative group overflow-hidden rounded-xl cursor-pointer bento-item"
            onClick={() => navigate('/catalogo?cat=Perros')}
          >
            <img
              src="/mia.jpeg"
              alt="Mundo Canino"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-lg w-full">
              <h3 className="text-white font-headline-md text-headline-md">Mundo Canino</h3>
              <p className="text-white/80 font-body-sm text-body-sm">Alimento, juguetes y bienestar para perros</p>
            </div>
          </div>
          {/* Mundo Felino */}
          <div
            className="relative group overflow-hidden rounded-xl cursor-pointer bento-item"
            onClick={() => navigate('/catalogo?cat=Gatos')}
          >
            <img
              src="/tito.jpeg"
              alt="Mundo Felino"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-lg w-full">
              <h3 className="text-white font-headline-md text-headline-md">Mundo Felino</h3>
              <p className="text-white/80 font-body-sm text-body-sm">Cuidado experto y diversión para gatos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-xl bg-surface-container-low">
        <div className="container mx-auto px-gutter max-w-[1280px]">
          <div className="mb-lg text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">Favoritos del Mes</h2>
            <p className="text-on-surface-variant font-body-md text-body-md mt-xs">Lo mejor para el cuidado de perros y gatos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-lg">
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-primary text-on-primary px-xl py-md rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95"
            >
              Ver todos los productos
            </button>
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-xl px-gutter bg-primary text-on-primary text-center">
        <h2 className="font-headline-md text-headline-md mb-xs">¿Primera compra?</h2>
        <p className="font-body-lg text-body-lg mb-md opacity-90">Regístrate y obtén 10% de descuento en tu primer pedido</p>
        <button
          onClick={() => navigate('/registro')}
          className="bg-on-primary text-primary px-xl py-md rounded-lg font-headline-sm text-headline-sm hover:opacity-90 transition-all active:scale-95"
        >
          Crear cuenta gratis
        </button>
      </section>
    </PublicLayout>
  );
};

export default Home;