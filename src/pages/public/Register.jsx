import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FaPaw } from 'react-icons/fa';

const Register = () => {
  const { register, showNotification } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'El nombre es requerido';
    if (!form.email) e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido';
    if (!form.password) e.password = 'La contraseña es requerida';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!form.terms) e.terms = 'Debes aceptar los términos';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      showNotification('¡Cuenta creada! Bienvenido a Pet Store', 'success');
      navigate('/');
    } catch (err) {
      showNotification(err.message || 'Error al crear cuenta', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const fields = [
    { key: 'name', label: 'Nombre completo', type: 'text', icon: 'person', placeholder: 'Juan García' },
    { key: 'email', label: 'Correo electrónico', type: 'email', icon: 'email', placeholder: 'tu@correo.com' },
    { key: 'password', label: 'Contraseña', type: showPass ? 'text' : 'password', icon: 'lock', placeholder: '••••••••' },
    { key: 'confirmPassword', label: 'Confirmar contraseña', type: showPass ? 'text' : 'password', icon: 'lock_reset', placeholder: '••••••••' },
  ];

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
          <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Crea tu cuenta</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Únete a la familia Pet Store</p>

          <form onSubmit={handleSubmit} className="space-y-md">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">{f.icon}</span>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={handleChange(f.key)}
                    placeholder={f.placeholder}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border font-body-md text-body-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors[f.key] ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                  />
                  {f.key === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-on-surface-variant">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  )}
                </div>
                {errors[f.key] && <p className="text-error font-body-sm text-body-sm mt-1">{errors[f.key]}</p>}
              </div>
            ))}

            <div>
              <label className="flex items-start gap-xs cursor-pointer">
                <input type="checkbox" checked={form.terms} onChange={handleChange('terms')} className="mt-1 accent-primary" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Acepto los <Link to="#" className="text-primary hover:underline">Términos de Servicio</Link> y la <Link to="#" className="text-primary hover:underline">Política de Privacidad</Link>
                </span>
              </label>
              {errors.terms && <p className="text-error font-body-sm text-body-sm mt-1">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-md">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Inicia Sesión</Link>
          </p>
        </div>
      </main>

      <footer className="w-full py-md px-gutter flex justify-center gap-md text-on-surface-variant">
        {['Privacidad', 'Términos', 'Ayuda'].map((t) => (
          <Link key={t} to="#" className="font-body-sm text-body-sm hover:text-on-surface hover:underline">{t}</Link>
        ))}
      </footer>
    </div>
  );
};

export default Register;
