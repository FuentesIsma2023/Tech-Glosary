import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { supabase, Language, Category, GlossaryTerm } from '../lib/supabase';

interface GlossaryViewProps {
  language: Language;
}

export function GlossaryView({ language }: GlossaryViewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [terms, setTerms] = useState<Record<string, GlossaryTerm[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const { data: categoriesData } = await supabase
      .from('glossary_categories')
      .select('*')
      .order('order_index');

    const { data: termsData } = await supabase
      .from('glossary_terms')
      .select('*');

    if (categoriesData) {
      setCategories(categoriesData);
      setExpandedCategories(new Set([categoriesData[0]?.id]));
    }

    if (termsData) {
      const termsByCategory: Record<string, GlossaryTerm[]> = {};
      termsData.forEach(term => {
        if (!termsByCategory[term.category_id]) {
          termsByCategory[term.category_id] = [];
        }
        termsByCategory[term.category_id].push(term);
      });
      setTerms(termsByCategory);
    }

    setLoading(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-green-400 text-xl font-mono animate-pulse">
          {language === 'en' ? 'Loading...' : 'Cargando...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryTerms = terms[category.id] || [];
        const isExpanded = expandedCategories.has(category.id);
        const categoryName = language === 'en' ? category.name_en : category.name_es;

        return (
          <div key={category.id} className="bg-gray-900 border border-green-600 rounded-lg overflow-hidden shadow-lg">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-2xl font-bold text-green-400 font-mono">
                {category.order_index}. {categoryName}
              </h2>
              {isExpanded ? (
                <ChevronUp className="text-green-400" size={24} />
              ) : (
                <ChevronDown className="text-green-400" size={24} />
              )}
            </button>

            {isExpanded && (
              <div className="p-6 pt-0 space-y-6">
                {categoryTerms.map(term => (
                  <div key={term.id} className="bg-gray-800 border border-green-700 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-bold text-green-300 font-mono">
                      {language === 'en' ? term.term_en : term.term_es}
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                      {language === 'en' ? term.definition_en : term.definition_es}
                    </p>

                    <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-yellow-400 mb-2">
                            {language === 'en' ? 'Real-World Example:' : 'Ejemplo del Mundo Real:'}
                          </p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {language === 'en' ? term.example_en : term.example_es}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
