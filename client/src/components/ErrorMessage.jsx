import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
    <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
    <div className="flex-1">
      <p className="text-red-200">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-red-300 underline underline-offset-2 hover:text-red-100 focus-ring"
        >
          Try again
        </button>
      )}
    </div>
  </div>
);

export default ErrorMessage;
