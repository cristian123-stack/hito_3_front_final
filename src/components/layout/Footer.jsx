import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="w-full py-lg px-gutter flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-highest border-t border-outline-variant">
    <div className="flex items-center gap-xs">
      <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center">
        <span className="material-symbols-outlined text-on-primary text-base">pets</span>
      </div>
      <span className="font-headline-sm text-headline-sm text-primary">Pet Store</span>
    </div>
    <div className="flex items-center gap-md flex-wrap justify-center">
      <Link to="/privacidad" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all">Privacidad</Link>
      <Link to="/terminos" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all">Términos</Link>
      <Link to="/contacto" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all">Contacto</Link>
      <Link to="/faq" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all">Preguntas Frecuentes</Link>
    </div>
    <span className="font-body-sm text-body-sm text-on-surface-variant">© {new Date().getFullYear()} Pet Store</span>
  </footer>
);

export default Footer;
