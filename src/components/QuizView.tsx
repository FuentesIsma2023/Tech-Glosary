import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { supabase, Language, QuizQuestion, Category } from '../lib/supabase';

interface QuizViewProps {
  language: Language;
}

export function QuizView({ language }: QuizViewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);

    const { data: categoriesData } = await supabase
      .from('glossary_categories')
      .select('*')
      .order('order_index');

    const { data: questionsData } = await supabase
      .from('quiz_questions')
      .select('*');

    if (categoriesData) {
      setCategories(categoriesData);
    }

    if (questionsData) {
      setAllQuestions(questionsData);
      shuffleQuestions(questionsData);
    }

    setLoading(false);
  };

  const shuffleQuestions = (questions: QuizQuestion[]) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffled);
    setSelectedAnswers({});
    setShowResults({});
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (showResults[questionId]) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));

    setShowResults(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const resetQuiz = () => {
    shuffleQuestions(allQuestions);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '';
    return language === 'en' ? category.name_en : category.name_es;
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-400 font-mono">
          {language === 'en' ? 'Test Your Knowledge' : 'Pon a Prueba tu Conocimiento'}
        </h2>
        <button
          onClick={resetQuiz}
          className="flex items-center gap-2 bg-gray-800 text-green-400 px-4 py-2 rounded-lg border border-green-600 hover:bg-gray-700 transition-colors font-mono"
        >
          <RotateCcw size={18} />
          {language === 'en' ? 'New Questions' : 'Nuevas Preguntas'}
        </button>
      </div>

      {currentQuestions.map((question, index) => {
        const isAnswered = showResults[question.id];
        const selectedAnswer = selectedAnswers[question.id];
        const isCorrect = selectedAnswer === question.correct_answer;
        const options = language === 'en' ? question.options_en : question.options_es;
        const questionText = language === 'en' ? question.question_en : question.question_es;
        const explanation = language === 'en' ? question.explanation_en : question.explanation_es;

        return (
          <div key={question.id} className="bg-gray-900 border border-green-600 rounded-lg p-6 space-y-4 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-green-500 font-mono mb-2">
                  {getCategoryName(question.category_id)}
                </div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">
                  {index + 1}. {questionText}
                </h3>
              </div>
              {isAnswered && (
                <div className="flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle2 className="text-green-500" size={32} />
                  ) : (
                    <XCircle className="text-red-500" size={32} />
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isCorrectAnswer = optionIndex === question.correct_answer;

                let buttonClass = 'w-full text-left p-4 rounded-lg border transition-all font-mono ';

                if (!isAnswered) {
                  buttonClass += 'bg-gray-800 border-green-700 text-gray-300 hover:bg-gray-700 hover:border-green-500';
                } else {
                  if (isCorrectAnswer) {
                    buttonClass += 'bg-green-900 border-green-500 text-green-200';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'bg-red-900 border-red-500 text-red-200';
                  } else {
                    buttonClass += 'bg-gray-800 border-gray-700 text-gray-400';
                  }
                }

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(question.id, optionIndex)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`p-4 rounded-lg border-l-4 ${
                isCorrect
                  ? 'bg-green-900 border-green-500'
                  : 'bg-blue-900 border-blue-500'
              }`}>
                <p className="text-sm font-semibold text-gray-200 mb-2">
                  {language === 'en' ? 'Explanation:' : 'Explicación:'}
                </p>
                <p className="text-gray-300 text-sm">{explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
