// ============================================================
// MOCK DATA — Datos de ejemplo para desarrollo
// Reemplazar por llamadas reales a la API cuando el backend esté listo
// ============================================================

export const mockProducts = [
  {
    id: 1,
    name: 'Alimento Premium Adulto',
    price: 32990,
    originalPrice: 38990,
    rating: 4.8,
    reviews: 124,
    category: 'Perros',
    badge: 'Popular',
    description: 'Alimento balanceado de alta calidad para perros adultos con proteínas seleccionadas.',
    stock: 50,
  },
  {
    id: 2,
    name: 'Rascador para Gatos "Zen"',
    price: 24990,
    originalPrice: null,
    rating: 4.6,
    reviews: 87,
    category: 'Gatos',
    badge: 'Nuevo',
    description: 'Rascador ergonómico con múltiples niveles y superficie de sisal natural.',
    stock: 30,
  },
  {
    id: 3,
    name: 'Juguete Resistente Pro',
    price: 8990,
    originalPrice: null,
    rating: 4.9,
    reviews: 203,
    category: 'Perros',
    badge: 'Mejor Valorado',
    description: 'Juguete ultra resistente de caucho natural para perros activos.',
    stock: 100,
  },
  {
    id: 4,
    name: 'Fuente de Agua Inteligente',
    price: 19990,
    originalPrice: 24990,
    rating: 4.7,
    reviews: 156,
    category: 'Ambos',
    badge: 'Oferta',
    description: 'Fuente de agua silenciosa con filtro de carbón activo y sensor automático.',
    stock: 25,
  },
  {
    id: 5,
    name: 'NutriPet Organic - Cordero y Arroz (12kg)',
    price: 45990,
    originalPrice: 52990,
    rating: 4.8,
    reviews: 98,
    category: 'Perros',
    badge: null,
    description: 'Alimento orgánico certificado con cordero y arroz integral.',
    stock: 20,
  },
  {
    id: 6,
    name: 'Mordedor Dental Ultra-Resistente Bluey',
    price: 12990,
    originalPrice: null,
    rating: 4.5,
    reviews: 67,
    category: 'Perros',
    badge: null,
    description: 'Mordedor dental que limpia los dientes mientras tu perro juega.',
    stock: 80,
  },
  {
    id: 7,
    name: 'Cama Ortopédica Velvet Confort - Gris',
    price: 34990,
    originalPrice: 42990,
    rating: 4.9,
    reviews: 145,
    category: 'Ambos',
    badge: null,
    description: 'Cama ortopédica con espuma de memoria y cubierta de terciopelo lavable.',
    stock: 15,
  },
  {
    id: 8,
    name: 'Arena Premium Anti-Olor 10L',
    price: 9990,
    originalPrice: null,
    rating: 4.6,
    reviews: 312,
    category: 'Gatos',
    badge: null,
    description: 'Arena aglomerante con control de olores durante 30 días.',
    stock: 200,
  },
];

export const mockCategories = [
  { id: 1, name: 'Alimentos Perros', productCount: 145, icon: 'pets' },
  { id: 2, name: 'Alimentos Gatos', productCount: 98, icon: 'pets' },
  { id: 3, name: 'Accesorios', productCount: 234, icon: 'star' },
  { id: 4, name: 'Juguetes', productCount: 187, icon: 'toys' },
  { id: 5, name: 'Higiene', productCount: 76, icon: 'spa' },
  { id: 6, name: 'Salud', productCount: 112, icon: 'health_and_safety' },
];

export const mockOrders = [
  {
    id: '#PET-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    statusLabel: 'Entregado',
    total: 52980,
    items: [
      { name: 'Alimento Premium Adulto', qty: 1, price: 32990 },
      { name: 'Juguete Resistente Pro', qty: 2, price: 8990 },
    ],
  },
  {
    id: '#PET-2024-002',
    date: '2024-01-22',
    status: 'shipped',
    statusLabel: 'En camino',
    total: 24990,
    items: [
      { name: 'Rascador para Gatos "Zen"', qty: 1, price: 24990 },
    ],
  },
  {
    id: '#PET-2024-003',
    date: '2024-02-01',
    status: 'processing',
    statusLabel: 'Procesando',
    total: 19990,
    items: [
      { name: 'Fuente de Agua Inteligente', qty: 1, price: 19990 },
    ],
  },
];

export const mockUsers = [
  { id: 1, name: 'María González', email: 'maria@example.com', role: 'user', orders: 12, joined: '2023-05-10' },
  { id: 2, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'user', orders: 7, joined: '2023-07-22' },
  { id: 3, name: 'Ana López', email: 'ana@example.com', role: 'admin', orders: 0, joined: '2023-03-01' },
  { id: 4, name: 'Pedro Martínez', email: 'pedro@example.com', role: 'user', orders: 3, joined: '2024-01-05' },
];

export const mockDashboardStats = {
  totalRevenue: 24500,
  totalOrders: 156,
  totalUsers: 1240,
  conversionRate: 82,
};
