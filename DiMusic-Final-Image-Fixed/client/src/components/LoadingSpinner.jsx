import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading', size = 20, className = '' }) => (
  <div className={`flex items-center justify-center gap-2 text-text-dim ${className}`}>
    <Loader2 size={size} className="animate-spin text-gold" />
    <span className="text-sm text-[var(--text-dim)]">{label}</span>
  </div>
);

export default LoadingSpinner;
