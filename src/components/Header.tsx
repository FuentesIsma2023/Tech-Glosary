import { BookOpen, Brain } from 'lucide-react';
import { Language } from '../lib/supabase';

interface HeaderProps {
  language: Language;
  currentView: 'glossary' | 'quiz';
  onViewChange: (view: 'glossary' | 'quiz') => void;
}

export function Header({ language, currentView, onViewChange }: HeaderProps) {
  const title = language === 'en' ? 'Tech Glossary' : 'Glosario Técnico';
  const subtitle = language === 'en'
    ? 'Learn technology concepts with real-world examples'
    : 'Aprende conceptos tecnológicos con ejemplos del mundo real';

  return (
    <header className="relative z-10 bg-gray-900 border-b border-green-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-green-400 mb-2 font-mono">
          {'>'} {title}
        </h1>
        <p className="text-green-300 text-lg mb-6">{subtitle}</p>

        <div className="flex gap-4">
          <button
            onClick={() => onViewChange('glossary')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono transition-all ${
              currentView === 'glossary'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-800 text-green-400 border border-green-600 hover:bg-gray-700'
            }`}
          >
            <BookOpen size={20} />
            {language === 'en' ? 'Glossary' : 'Glosario'}
          </button>
          <button
            onClick={() => onViewChange('quiz')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono transition-all ${
              currentView === 'quiz'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-800 text-green-400 border border-green-600 hover:bg-gray-700'
            }`}
          >
            <Brain size={20} />
            {language === 'en' ? 'Practice Quiz' : 'Cuestionario'}
          </button>
        </div>
      </div>
    </header>
  );
}
