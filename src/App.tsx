import { useState } from 'react';
import { MatrixRain } from './components/MatrixRain';
import { LanguageToggle } from './components/LanguageToggle';
import { Header } from './components/Header';
import { GlossaryView } from './components/GlossaryView';
import { QuizView } from './components/QuizView';
import { Language } from './lib/supabase';

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<'glossary' | 'quiz'>('glossary');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <MatrixRain />

      <LanguageToggle language={language} onToggle={toggleLanguage} />

      <div className="relative z-10">
        <Header
          language={language}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {currentView === 'glossary' ? (
            <GlossaryView language={language} />
          ) : (
            <QuizView language={language} />
          )}
        </main>

        <footer className="relative z-10 bg-gray-900 border-t border-green-500 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center">
            <p className="text-green-400 font-mono">
              {language === 'en'
                ? '© 2025 Tech Glossary - Created by Ismael Najera'
                : '© 2025 Glosario Técnico - Creado por Ismael Najera'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
