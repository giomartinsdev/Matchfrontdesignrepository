import { useEffect } from 'react';

interface GlobalSearchModalFixedProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModalFixed({ isOpen, onClose }: GlobalSearchModalFixedProps) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="mt-4 text-center text-slate-500 dark:text-slate-400">
          Digite para buscar transações, contas ou investimentos
        </div>
      </div>
    </div>
  );
}
