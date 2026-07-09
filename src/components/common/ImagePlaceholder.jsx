import React from 'react';

// Placeholder universal para imágenes — reemplazar src con la imagen real
const ImagePlaceholder = ({ alt = '', className = '', aspectRatio = '1/1', icon = 'image' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-surface-container rounded-lg text-on-surface-variant border-2 border-dashed border-outline-variant ${className}`}
      style={{ aspectRatio }}
      aria-label={alt}
      title={alt || 'Imagen no disponible'}
    >
      <span className="material-symbols-outlined text-4xl opacity-30">{icon}</span>
      {alt && <span className="text-xs mt-1 opacity-50 text-center px-2 line-clamp-2">{alt}</span>}
    </div>
  );
};

export default ImagePlaceholder;
