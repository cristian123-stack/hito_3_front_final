import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';

const Section = ({ title, children }) => (
  <div className="mb-lg">
    <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">{title}</h2>
    <div className="text-on-surface-variant font-body-md text-body-md space-y-sm">{children}</div>
  </div>
);

const Terms = () => (
  <PublicLayout>
    <div className="container mx-auto px-gutter py-xl max-w-3xl">
      <h1 className="font-display-lg-mobile text-on-surface mb-xs">Términos de Servicio</h1>
      <p className="text-on-surface-variant font-body-sm text-body-sm mb-xl">Última actualización: {new Date().toLocaleDateString('es-CL')}</p>

      <Section title="1. Aceptación de los términos">
        <p>Al acceder y utilizar Pet Store, usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, no utilice nuestros servicios.</p>
      </Section>

      <Section title="2. Uso del sitio">
        <p>Usted se compromete a utilizar el sitio únicamente para fines legales y de acuerdo con estos términos. Está prohibido el uso del sitio para actividades fraudulentas o ilegales.</p>
      </Section>

      <Section title="3. Productos y precios">
        <p>Nos reservamos el derecho de modificar precios, descripción de productos y disponibilidad sin previo aviso. Los precios incluyen IVA cuando corresponda.</p>
        <p>En caso de error en el precio de un producto, nos reservamos el derecho de cancelar el pedido y notificarle.</p>
      </Section>

      <Section title="4. Proceso de compra y pagos">
        <p>Los pagos son procesados de forma segura por Stripe. Al completar una compra, usted confirma que está autorizado a usar el método de pago proporcionado.</p>
      </Section>

      <Section title="5. Envíos y entregas">
        <p>Los tiempos de entrega son estimados y pueden variar. No nos hacemos responsables por demoras causadas por la empresa de courier o eventos de fuerza mayor.</p>
        <p>El envío es gratuito para compras sobre $25.000 CLP.</p>
      </Section>

      <Section title="6. Devoluciones">
        <p>Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto, siempre que esté en su estado original y sin uso.</p>
      </Section>

      <Section title="7. Limitación de responsabilidad">
        <p>Pet Store no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de uso del sitio o los productos.</p>
      </Section>

      <div className="bg-surface-container-low rounded-xl p-md mt-xl">
        <p className="font-body-sm text-body-sm text-on-surface-variant">¿Tienes preguntas sobre nuestros términos? <a href="/contacto" className="text-primary hover:underline">Contáctanos</a></p>
      </div>
    </div>
  </PublicLayout>
);

export default Terms;
