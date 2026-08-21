import React from 'react';
import { Music2 } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Music2,
  title = 'Nothing here yet',
  description = 'Once content is added, it will show up here.',
  action = null
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl glass">
    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 mb-4">
      <Icon size={26} className="text-gold" />
    </div>
    <h3 className="font-display text-lg mb-1">{title}</h3>
    <p className="text-sm text-[var(--text-dim)] max-w-sm">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
