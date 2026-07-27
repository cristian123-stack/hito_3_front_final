import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import ProductCard from '../../components/common/ProductCard';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];

const CATEGORIES = ['Todos', 'Perros', 'Gatos'];

const Catalog = () => {
  const { products = [] } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 60000]);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCat = searchParams.get('cat') || 'Todos';

  const setSelectedCat = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'Todos') {
      newParams.delete('cat');
    } else {
      newParams.set('cat', cat);
    }
    setSearchParams(newParams);
  };

  const filtered = useMemo(() => {
    let list = [...products];

    // Búsqueda por texto
    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((p) => p.name?.toLowerCase().includes(query));
    }

    // Filtrado por categoría
    if (selectedCat === 'Perros') {
      list = list.filter((p) => p.category?.name === 'Perros' || p.category?.name === 'Ambos');
    } else if (selectedCat === 'Gatos') {
      list = list.filter((p) => p.category?.name === 'Gatos' || p.category?.name === 'Ambos');
    }

    // Filtrado por precio
    list = list.filter((p) => {
      const price = p.price ?? 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Ordenamiento (sin mutar el arreglo original)
    if (sort === 'price-asc') list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === 'price-desc') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return list;
  }, [products, search, selectedCat, sort, priceRange]);

  const formatPrice = (p) =>
    p.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const handleResetFilters = () => {
    setSearch('');
    setSort('featured');
    setPriceRange([0, 60000]);
    setSearchParams({});
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-gutter py-lg max-w-[1280px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
          <div>
            <h1 className="font-display-lg-mobile md:text-display-lg text-on-surface">Catálogo</h1>
            <p className="text-on-surface-variant font-body-md text-body-md">
              {filtered.length} {filtered.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          </div>
          <div className="flex items-center gap-sm flex-wrap">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
                className="pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md w-48 md:w-64"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Ordenar por"
              className="py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Mostrar u ocultar filtros"
              className="md:hidden p-2 rounded-lg border border-outline-variant bg-surface-container-lowest"
            >
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            </button>
          </div>
        </div>

        <div className="flex gap-lg">
          {/* Sidebar Filtros */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] sticky top-24">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Filtros</h3>
              <div className="mb-md">
                <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm">Categoría</h4>
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-xs py-1 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCat === cat}
                      onChange={() => setSelectedCat(cat)}
                      className="accent-primary"
                    />
                    <span className="font-body-md text-body-md text-on-surface">{cat}</span>
                  </label>
                ))}
              </div>
              <div className="mb-md">
                <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm">
                  Precio máximo: {formatPrice(priceRange[1])}
                </h4>
                <input
                  type="range"
                  min={0}
                  max={60000}
                  step={1000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  aria-label="Filtro por precio máximo"
                  className="w-full accent-primary"
                />
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant mt-1">
                  <span>$0</span>
                  <span>$60.000</span>
                </div>
              </div>
              <button
                onClick={handleResetFilters}
                className="w-full py-2 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-xl text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-6xl mb-md">search_off</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">No encontramos productos</h3>
                <p className="text-on-surface-variant font-body-md text-body-md">Intenta con otros filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Catalog;
