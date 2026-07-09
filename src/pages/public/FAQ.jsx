import React, { useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';

const faqs = [
  {
    category: 'Pedidos y envíos',
    items: [
      { q: '¿Cuánto tiempo demora el envío?', a: 'Los pedidos se procesan en 1-2 días hábiles. El envío tarda entre 3-5 días hábiles dependiendo de tu ubicación.' },
      { q: '¿El envío es gratuito?', a: 'Sí, el envío es gratuito para compras superiores a $25.000 CLP. Para compras menores, el costo de envío es de $3.990 CLP.' },
      { q: '¿Puedo rastrear mi pedido?', a: 'Sí, una vez despachado tu pedido recibirás un número de seguimiento para rastrear el envío en tiempo real.' },
      { q: '¿Hacen envíos a regiones?', a: 'Sí, hacemos envíos a todo Chile. Los tiempos pueden variar según la región.' },
    ],
  },
  {
    category: 'Pagos',
    items: [
      { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito y débito Visa, Mastercard y American Express, procesadas de forma segura a través de Stripe.' },
      { q: '¿Es seguro pagar en el sitio?', a: 'Sí, todos los pagos son procesados con cifrado SSL por Stripe, uno de los procesadores de pago más seguros del mundo. No almacenamos datos de tarjetas.' },
      { q: '¿Puedo pagar en cuotas?', a: 'Esto depende de tu banco emisor. Si tu tarjeta soporta cuotas, podrás seleccionarlas al momento del pago.' },
    ],
  },
  {
    category: 'Devoluciones',
    items: [
      { q: '¿Cuál es la política de devoluciones?', a: 'Aceptamos devoluciones dentro de los 30 días posteriores a la recepción, siempre que el producto esté en su estado original y sin uso.' },
      { q: '¿Cómo solicito una devolución?', a: 'Contáctanos a través del formulario de contacto indicando tu número de pedido y el motivo de la devolución. Te guiaremos en el proceso.' },
      { q: '¿Cuánto demora el reembolso?', a: 'Una vez aprobada la devolución, el reembolso se procesa en 5-10 días hábiles dependiendo de tu banco.' },
    ],
  },
  {
    category: 'Productos',
    items: [
      { q: '¿Los productos son originales?', a: 'Sí, todos nuestros productos son 100% originales y provienen directamente de distribuidores autorizados.' },
      { q: '¿Tienen garantía los productos?', a: 'Los productos tienen la garantía del fabricante. Ante cualquier defecto, contáctanos y gestionaremos la solución.' },
      { q: '¿Cómo elijo el alimento correcto para mi mascota?', a: 'Considera la edad, raza y condición de tu mascota. Si tienes dudas, contáctanos y con gusto te asesoramos.' },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-md text-left hover:bg-surface-container-low transition-all">
        <span className="font-label-md text-label-md text-on-surface pr-md">{q}</span>
        <span className={`material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {open && (
        <div className="px-md pb-md pt-0">
          <p className="font-body-md text-body-md text-on-surface-variant">{a}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => (
  <PublicLayout>
    <div className="container mx-auto px-gutter py-xl max-w-3xl">
      <div className="text-center mb-xl">
        <h1 className="font-display-lg-mobile text-on-surface mb-xs">Preguntas Frecuentes</h1>
        <p className="text-on-surface-variant font-body-lg text-body-lg">Encuentra respuestas a las dudas más comunes</p>
      </div>

      <div className="space-y-xl">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-base">help_outline</span>
              {section.category}
            </h2>
            <div className="space-y-sm">
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary text-on-primary rounded-2xl p-lg mt-xl text-center">
        <h2 className="font-headline-sm text-headline-sm mb-xs">¿No encontraste lo que buscabas?</h2>
        <p className="font-body-md text-body-md opacity-90 mb-md">Nuestro equipo está listo para ayudarte.</p>
        <a href="/contacto" className="inline-flex items-center gap-xs bg-on-primary text-primary px-md py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-base">chat</span>
          Contáctanos
        </a>
      </div>
    </div>
  </PublicLayout>
);

export default FAQ;
