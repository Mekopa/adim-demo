import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-surface rounded-xl p-8 flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-text-secondary">Kuriamas dokumentas...</p>
      </div>
    </div>
  );
}