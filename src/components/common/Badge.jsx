import React from 'react';

const Badge = ({ label, variant = 'default' }) => {
  if (!label) return null;
  const variants = {
    default: 'bg-primary-container text-on-primary-container',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-error-container text-on-error-container',
    info: 'bg-tertiary-container text-on-tertiary-container',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg font-label-sm text-label-sm ${variants[variant]}`}>
      {label}
    </span>
  );
};

export default Badge;
