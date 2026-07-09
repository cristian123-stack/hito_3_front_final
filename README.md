# 🐾 Pet Store — React + Vite

Frontend de tienda de mascotas desarrollado con React y Vite.

## 🚀 Instalación y ejecución

```bash
npm install
npm run dev        # Desarrollo → http://localhost:5173
npm run build      # Producción
npm run preview    # Preview del build
```

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxx
```

> En Vite todas las variables deben comenzar con `VITE_` para ser accesibles en el frontend.

## 📦 Dependencias principales

| Paquete | Uso |
|---------|-----|
| `react` + `react-dom` | UI principal |
| `react-router-dom` | Navegación entre rutas |
| `axios` | Peticiones HTTP al backend |
| `@stripe/react-stripe-js` | Componentes de pago Stripe |
| `@stripe/stripe-js` | SDK de Stripe |
| `react-icons` | Íconos adicionales |
| `vite` | Bundler y entorno de desarrollo |
| `nodemon` | Reinicio automático (uso en backend) |

## 📁 Estructura

```
src/
├── context/AppContext.jsx     # Estado global (auth, carrito, favoritos, productos)
├── services/
│   ├── api.js                 # Axios — endpoints listos para backend
│   └── mockData.js            # Datos de ejemplo para desarrollo
├── components/
│   ├── common/                # Badge, ProductCard, ProductImage, StarRating...
│   └── layout/                # Navbar, Footer, AdminSidebar, layouts...
└── pages/
    ├── public/                # Home, Catalog, ProductDetail, Login, Register
    ├── user/                  # Cart, Profile, MyOrders, Favorites
    └── admin/                 # Dashboard, Products, Orders, Categories, Users
```

## 🔗 Rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Inicio | Público |
| `/login` | Iniciar sesión | Público |
| `/registro` | Crear cuenta | Público |
| `/catalogo` | Catálogo con filtros | Público |
| `/productos/:id` | Detalle producto | Público |
| `/carrito` | Carrito de compras | Público |
| `/perfil` | Perfil de usuario | Autenticado |
| `/mis-pedidos` | Historial de pedidos | Autenticado |
| `/favoritos` | Favoritos | Autenticado |
| `/admin` | Dashboard admin | Solo admin |
| `/admin/productos` | Gestión productos | Solo admin |
| `/admin/pedidos` | Gestión pedidos | Solo admin |
| `/admin/categorias` | Gestión categorías | Solo admin |
| `/admin/usuarios` | Gestión usuarios | Solo admin |

## 🔐 Demo (sin backend)

- **Usuario:** cualquier correo sin "admin"
- **Admin:** correo que contenga "admin" (ej: `admin@petstore.com`)

## 💳 Integración Stripe

El servicio `paymentService` en `api.js` ya tiene los endpoints preparados:
- `createPaymentIntent(amount)` — crea intención de pago en el backend
- `confirmPayment(paymentIntentId, orderId)` — confirma el pago

Para implementar el formulario de pago, usar `<Elements>` y `<PaymentElement>` de `@stripe/react-stripe-js`.
