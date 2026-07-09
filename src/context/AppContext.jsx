import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, productService, favoriteService } from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  products: [],
  productsLoading: false,
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  favorites: [],
  isDarkMode: false,
  isLoading: false,
  notification: null,
};

const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_PRODUCTS_LOADING: 'SET_PRODUCTS_LOADING',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART',
  SET_FAVORITES: 'SET_FAVORITES',
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  SET_LOADING: 'SET_LOADING',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
};

const calcCartCount = (cart) => cart.reduce((sum, i) => sum + i.quantity, 0);
const calcCartTotal = (cart) => cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { ...state, user: action.payload, isAuthenticated: true, isAdmin: action.payload?.role === 'admin' };
    case ACTIONS.LOGOUT:
      return { ...state, user: null, isAuthenticated: false, isAdmin: false, cart: [], cartCount: 0, cartTotal: 0, favorites: [] };
    case ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload };
    case ACTIONS.SET_PRODUCTS_LOADING:
      return { ...state, productsLoading: action.payload };
    case ACTIONS.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case ACTIONS.UPDATE_PRODUCT:
      return { ...state, products: state.products.map((p) => p.id === action.payload.id ? action.payload : p) };
    case ACTIONS.DELETE_PRODUCT:
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };
    case ACTIONS.ADD_TO_CART: {
      const exists = state.cart.find((i) => i.id === action.payload.id);
      const cart = exists
        ? state.cart.map((i) => i.id === action.payload.id ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) } : i)
        : [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }];
      return { ...state, cart, cartCount: calcCartCount(cart), cartTotal: calcCartTotal(cart) };
    }
    case ACTIONS.REMOVE_FROM_CART: {
      const cart = state.cart.filter((i) => i.id !== action.payload);
      return { ...state, cart, cartCount: calcCartCount(cart), cartTotal: calcCartTotal(cart) };
    }
    case ACTIONS.UPDATE_CART_ITEM: {
      const cart = state.cart.map((i) => i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i);
      return { ...state, cart, cartCount: calcCartCount(cart), cartTotal: calcCartTotal(cart) };
    }
    case ACTIONS.CLEAR_CART:
      return { ...state, cart: [], cartCount: 0, cartTotal: 0 };
    case ACTIONS.SET_CART: {
      const cart = action.payload;
      return { ...state, cart, cartCount: calcCartCount(cart), cartTotal: calcCartTotal(cart) };
    }
    case ACTIONS.SET_FAVORITES:
      return { ...state, favorites: action.payload };
    case ACTIONS.ADD_TO_FAVORITES:
      if (state.favorites.find((f) => f.id === action.payload.id)) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };
    case ACTIONS.REMOVE_FROM_FAVORITES:
      return { ...state, favorites: state.favorites.filter((f) => f.id !== action.payload) };
    case ACTIONS.TOGGLE_DARK_MODE:
      return { ...state, isDarkMode: !state.isDarkMode };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SHOW_NOTIFICATION:
      return { ...state, notification: action.payload };
    case ACTIONS.CLEAR_NOTIFICATION:
      return { ...state, notification: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Al iniciar: restaurar sesión y cargar productos
  useEffect(() => {
    const initApp = async () => {
      // Restaurar carrito del localStorage
      const savedCart = localStorage.getItem('pet_store_cart');
      if (savedCart) {
        try { dispatch({ type: ACTIONS.SET_CART, payload: JSON.parse(savedCart) }); }
        catch (e) { /* ignorar */ }
      }

      // Restaurar sesión si hay token
      const token = localStorage.getItem('pet_store_token');
      if (token) {
        try {
          const user = await authService.getProfile();
          dispatch({ type: ACTIONS.LOGIN, payload: user });
          // Cargar favoritos del usuario
          const favs = await favoriteService.getAll();
          dispatch({ type: ACTIONS.SET_FAVORITES, payload: favs });
        } catch (e) {
          localStorage.removeItem('pet_store_token');
        }
      }

      // Cargar productos desde el backend
      await loadProducts();
    };

    initApp();
  }, []);

  // Persistir carrito en localStorage
  useEffect(() => {
    localStorage.setItem('pet_store_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.isDarkMode);
  }, [state.isDarkMode]);

  // ---- Cargar productos desde API ----
  const loadProducts = async () => {
    dispatch({ type: ACTIONS.SET_PRODUCTS_LOADING, payload: true });
    try {
      const data = await productService.getAll();
      dispatch({ type: ACTIONS.SET_PRODUCTS, payload: data });
    } catch (e) {
      console.error('Error al cargar productos:', e.message);
    } finally {
      dispatch({ type: ACTIONS.SET_PRODUCTS_LOADING, payload: false });
    }
  };

  // ---- AUTH ----
  const login = async (credentials) => {
    const { user, token } = await authService.login(credentials);
    localStorage.setItem('pet_store_token', token);
    dispatch({ type: ACTIONS.LOGIN, payload: user });
    // Cargar favoritos tras login
    try {
      const favs = await favoriteService.getAll();
      dispatch({ type: ACTIONS.SET_FAVORITES, payload: favs });
    } catch (e) { /* ignorar */ }
    return user;
  };

  const register = async (data) => {
    const { user, token } = await authService.register(data);
    localStorage.setItem('pet_store_token', token);
    dispatch({ type: ACTIONS.LOGIN, payload: user });
    return user;
  };

  const logout = () => {
    localStorage.removeItem('pet_store_token');
    localStorage.removeItem('pet_store_cart');
    dispatch({ type: ACTIONS.LOGOUT });
  };

  const updateUser = async (data) => {
    const updated = await authService.updateProfile(data);
    dispatch({ type: ACTIONS.UPDATE_USER, payload: updated });
    return updated;
  };

  // ---- PRODUCTOS ----
  const addProduct = async (data) => {
    const product = await productService.create(data);
    dispatch({ type: ACTIONS.ADD_PRODUCT, payload: product });
    return product;
  };

  const updateProduct = async (product) => {
    const updated = await productService.update(product.id, product);
    dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updated });
    return updated;
  };

  const deleteProduct = async (id) => {
    await productService.delete(id);
    dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: id });
  };

  // ---- CARRITO ----
  const addToCart = (product, quantity = 1) =>
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: { ...product, quantity } });

  const removeFromCart = (productId) =>
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });

  const updateCartItem = (productId, quantity) =>
    dispatch({ type: ACTIONS.UPDATE_CART_ITEM, payload: { id: productId, quantity } });

  const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART });

  // ---- FAVORITOS ----
  const toggleFavorite = async (product) => {
    const isFav = state.favorites.some((f) => f.id === product.id);
    if (isFav) {
      await favoriteService.remove(product.id);
      dispatch({ type: ACTIONS.REMOVE_FROM_FAVORITES, payload: product.id });
    } else {
      await favoriteService.add(product.id);
      dispatch({ type: ACTIONS.ADD_TO_FAVORITES, payload: product });
    }
  };

  const isFavorite = (productId) => state.favorites.some((f) => f.id === productId);

  const toggleDarkMode = () => dispatch({ type: ACTIONS.TOGGLE_DARK_MODE });

  const showNotification = (message, type = 'success') => {
    dispatch({ type: ACTIONS.SHOW_NOTIFICATION, payload: { message, type } });
    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION }), 3500);
  };

  const setLoading = (val) => dispatch({ type: ACTIONS.SET_LOADING, payload: val });

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    toggleFavorite,
    isFavorite,
    toggleDarkMode,
    showNotification,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}

export default AppContext;
