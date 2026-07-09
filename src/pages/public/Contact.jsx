import React, { useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useApp } from '../../context/AppContext';

const Contact = () => {
  const { showNotification } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: conectar con endpoint de contacto cuando haya backend
    await new Promise((r) => setTimeout(r, 800));
    showNotification('Mensaje enviado correctamente. Te responderemos pronto.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md transition-all';

  const contactInfo = [
    { icon: 'email', label: 'Correo', value: 'contacto@petstore.cl' },
    { icon: 'phone', label: 'Teléfono', value: '+56 9 1234 5678' },
    { icon: 'schedule', label: 'Horario', value: 'Lunes a Viernes, 9:00 - 18:00' },
    { icon: 'location_on', label: 'Dirección', value: 'Santiago, Chile' },
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-gutter py-xl max-w-[1280px]">
        <div className="text-center mb-xl">
          <h1 className="font-display-lg-mobile text-on-surface mb-xs">Contáctanos</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg">Estamos aquí para ayudarte con cualquier consulta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Formulario */}
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Nombre</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" required className={inputClass} />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Correo</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@correo.com" required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Asunto</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className={inputClass}>
                  <option value="">Selecciona un asunto</option>
                  <option value="pedido">Consulta sobre pedido</option>
                  <option value="producto">Consulta sobre producto</option>
                  <option value="devolucion">Devolución o cambio</option>
                  <option value="pago">Problema con el pago</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Mensaje</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Escribe tu mensaje aquí..." rows={5} required className={`${inputClass} resize-none`} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary py-md rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>

          {/* Info de contacto */}
          <div className="space-y-md">
            <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Información de contacto</h2>
              <div className="space-y-md">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-md">
                    <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-primary-container">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{item.label}</p>
                      <p className="font-body-md text-body-md text-on-surface">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary text-on-primary rounded-2xl p-lg">
              <h3 className="font-headline-sm text-headline-sm mb-xs">¿Necesitas ayuda urgente?</h3>
              <p className="font-body-md text-body-md opacity-90 mb-md">Revisa nuestras preguntas frecuentes, puede que ya tengamos la respuesta.</p>
              <a href="/faq" className="inline-flex items-center gap-xs bg-on-primary text-primary px-md py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">
                <span className="material-symbols-outlined text-base">help</span>
                Ver preguntas frecuentes
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
