import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';

const Section = ({ title, children }) => (
  <div className="mb-lg">
    <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">{title}</h2>
    <div className="text-on-surface-variant font-body-md text-body-md space-y-sm">{children}</div>
  </div>
);

const Privacy = () => (
  <PublicLayout>
    <div className="container mx-auto px-gutter py-xl max-w-3xl">
      <h1 className="font-display-lg-mobile text-on-surface mb-xs">Política de Privacidad</h1>
      <p className="text-on-surface-variant font-body-sm text-body-sm mb-xl">Última actualización: {new Date().toLocaleDateString('es-CL')}</p>

      <Section title="1. Información que recopilamos">
        <p>Recopilamos información que usted nos proporciona directamente, como nombre, correo electrónico, dirección de envío y datos de pago al realizar una compra.</p>
        <p>También recopilamos automáticamente información sobre su dispositivo y cómo interactúa con nuestro sitio.</p>
      </Section>

      <Section title="2. Uso de la información">
        <p>Utilizamos la información recopilada para procesar pedidos, enviar confirmaciones, mejorar nuestros servicios y comunicarnos con usted sobre su cuenta.</p>
        <p>No vendemos, alquilamos ni compartimos su información personal con terceros sin su consentimiento, salvo lo necesario para procesar pagos (Stripe) o envíos.</p>
      </Section>

      <Section title="3. Seguridad de los datos">
        <p>Los datos de pago son procesados de forma segura por Stripe y nunca son almacenados en nuestros servidores. Utilizamos cifrado SSL para proteger la transmisión de datos.</p>
      </Section>

      <Section title="4. Cookies">
        <p>Utilizamos cookies para mantener su sesión activa y mejorar la experiencia de navegación. Puede desactivarlas desde la configuración de su navegador.</p>
      </Section>

      <Section title="5. Sus derechos">
        <p>Tiene derecho a acceder, corregir o eliminar su información personal. Para ejercer estos derechos, contáctenos a través de nuestra página de contacto.</p>
      </Section>

      <Section title="6. Cambios a esta política">
        <p>Podemos actualizar esta política ocasionalmente. Le notificaremos sobre cambios significativos por correo electrónico o mediante un aviso en el sitio.</p>
      </Section>

      <div className="bg-surface-container-low rounded-xl p-md mt-xl">
        <p className="font-body-sm text-body-sm text-on-surface-variant">¿Tienes preguntas sobre nuestra política de privacidad? <a href="/contacto" className="text-primary hover:underline">Contáctanos</a></p>
      </div>
    </div>
  </PublicLayout>
);

export default Privacy;
