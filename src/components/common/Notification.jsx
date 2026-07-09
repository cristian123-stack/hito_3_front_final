import React from 'react';
import { useApp } from '../../context/AppContext';

const Notification = () => {
  const { notification } = useApp();
  if (!notification) return null;

  const colors = {
    success: 'bg-primary text-on-primary',
    error: 'bg-error text-on-error',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-tertiary text-on-tertiary',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-center gap-xs px-md py-sm rounded-xl shadow-lg ${colors[notification.type]} transition-all animate-pulse`}>
      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
        {icons[notification.type]}
      </span>
      <span className="font-label-md text-label-md">{notification.message}</span>
    </div>
  );
};

export default Notification;
