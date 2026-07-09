import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import UserSidebar from '../../components/layout/UserSidebar';
import ProductCard from '../../components/common/ProductCard';

const Favorites = () => {
  const { isAuthenticated, favorites } = useApp();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-72px)]">
        <UserSidebar />
        <main className="flex-1 p-lg pb-24 md:pb-lg">
          <h1 className="font-headline-md text-headline-md text-primary mb-md">Mis Favoritos</h1>
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center py-xl text-center">
              <span className="material-symbols-outlined text-on-surface-variant text-8xl mb-md">favorite_border</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Aún no tienes favoritos</h2>
              <p className="text-on-surface-variant font-body-md text-body-md mb-lg">
                Guarda los productos que más te gustan para encontrarlos fácilmente
              </p>
              <button onClick={() => navigate('/catalogo')} className="bg-primary text-on-primary px-xl py-md rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">
                Explorar productos
              </button>
            </div>
          ) : (
            <>
              <p className="text-on-surface-variant font-body-md text-body-md mb-md">{favorites.length} productos guardados</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
                {favorites.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              <div className="mt-xl bg-primary-container/30 rounded-xl p-lg text-center">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">¿Buscas algo más?</h2>
                <button onClick={() => navigate('/catalogo')} className="bg-primary text-on-primary px-xl py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">
                  Ver catálogo completo
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </PublicLayout>
  );
};

export default Favorites;
