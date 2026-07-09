import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-sm p-lg">
      <div className={`${sizes[size]} border-4 border-primary-container border-t-primary rounded-full animate-spin`} />
      {text && <span className="text-on-surface-variant font-label-md text-label-md">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
