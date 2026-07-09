import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FaPaw } from 'react-icons/fa';

const Login = () => {
  const { login, showNotification } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido';
    if (!form.password) e.password = 'La contraseña es requerida';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(form);
      showNotification('Bienvenido a Pet Store', 'success');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      showNotification(err.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full flex justify-center py-lg">
        <Link to="/" className="flex items-center gap-xs">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
            <FaPaw className="text-on-primary text-xl" />
          </div>
          <span className="text-headline-md font-headline-md text-primary">Pet Store</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-gutter pb-lg">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.08)] p-lg">
          <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-xs">
            Bienvenido de nuevo
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
            Ingresa a tu cuenta de Pet Store
          </p>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Correo electrónico</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="tu@correo.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border font-body-md text-body-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                />
              </div>
              {errors.email && <p className="text-error font-body-sm text-body-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">lock</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border font-body-md text-body-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.password ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-on-surface-variant">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="text-error font-body-sm text-body-sm mt-1">{errors.password}</p>}
              <div className="text-right mt-1">
                <Link to="#" className="font-label-sm text-label-sm text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-md">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary font-semibold hover:underline">Regístrate</Link>
          </p>
        </div>
      </main>

      <footer className="w-full py-md px-gutter flex justify-center items-center gap-md text-on-surface-variant">
        {['Privacidad', 'Términos', 'Contacto', 'Preguntas Frecuentes'].map((t) => (
          <Link key={t} to="#" className="font-body-sm text-body-sm hover:text-on-surface hover:underline transition-all">{t}</Link>
        ))}
      </footer>
    </div>
  );
};

export default Login;
