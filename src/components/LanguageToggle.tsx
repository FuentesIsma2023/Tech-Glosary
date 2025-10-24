import { Languages } from 'lucide-react';
import { Language } from '../lib/supabase';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-gray-900 text-green-400 px-4 py-2 rounded-lg border border-green-500 hover:bg-gray-800 transition-colors"
    >
      <Languages size={20} />
      <span className="font-mono">{language === 'en' ? 'English' : 'Español'}</span>
    </button>
  );
}
