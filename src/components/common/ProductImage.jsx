import React, { useState } from 'react';

// Muestra imagen real si hay URL, sino muestra placeholder
const ProductImage = ({ imageUrl, alt = '', className = '', icon = 'inventory_2' }) => {
  const [error, setError] = useState(false);

  if (imageUrl && !error) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`object-contain ${className}`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center bg-surface-container border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant ${className}`}>
      <span className="material-symbols-outlined text-4xl opacity-30">{icon}</span>
      {alt && <span className="text-xs mt-1 opacity-40 text-center px-2 line-clamp-2">{alt}</span>}
    </div>
  );
};

export default ProductImage;
