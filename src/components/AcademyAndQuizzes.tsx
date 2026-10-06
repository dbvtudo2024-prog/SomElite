import React, { useState, useEffect } from 'react';
import {
  COURSES_DATA,
  ACOUSTIC_QUIZ_QUESTIONS,
  CourseModule,
} from '../data/audioEngineeringData';
import { GraduationCap, Award, CheckCircle2, RotateCcw, BookOpenCheck, ChevronRight } from 'lucide-react';

type AcademyTab = 'courses' | 'exam-simulator';

export const AcademyAndQuizzes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AcademyTab>('courses');
  const [levelFilter, setLevelFilter] = useState<string>('Todos');
  const [selectedCourse, setSelectedCourse] = useState<CourseModule>(COURSES_DATA[0]);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);

  // Completed lessons stored in localStorage
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('sonoplastia_completed_lessons');
      return saved ? JSON.parse(saved) : { 'l-101': true };
    } catch {
      return { 'l-101': true };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sonoplastia_completed_lessons', JSON.stringify(completedLessons));
    } catch {
      // ignore storage quota errors
    }
  }, [completedLessons]);

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  // --- QUIZ SIMULATOR STATE ---
  const [quizLevelFilter, setQuizLevelFilter] = useState<string>('Todos');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const filteredCourses = COURSES_DATA.filter(
    (c) => levelFilter === 'Todos' || c.level === levelFilter
  );

  const filteredQuestions = ACOUSTIC_QUIZ_QUESTIONS.filter(
    (q) => quizLevelFilter === 'Todos' || q.level === quizLevelFilter
  );

  const activeLesson =
    selectedCourse.lessons[activeLessonIndex] || selectedCourse.lessons[0];

  const totalLessonsCount = COURSES_DATA.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedCount = Object.values(completedLessons).filter(Boolean).length;

  // Quiz score calculation
  const answeredCount = filteredQuestions.filter((q) => selectedAnswers[q.id] !== undefined).length;
  const correctCount = filteredQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <section className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-mono text-amber-400 mb-1">
            Formação Técnica Continuada · Progresso: {completedCount}/{totalLessonsCount} aulas concluídas
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
            Cursos Integrados e Simulados de Acústica
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            Trilhas de Cursos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exam-simulator')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              activeTab === 'exam-simulator'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            Simulado Prático ({ACOUSTIC_QUIZ_QUESTIONS.length} Questões)
          </button>
        </div>
      </div>

      {/* TAB 1: INTEGRATED COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: Course Catalog */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">Filtrar por nível técnico:</span>
              <div className="flex gap-1">
                {['Todos', 'Iniciante', 'Intermediário', 'Profissional'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevelFilter(lvl)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap min-h-[36px] ${
                      levelFilter === lvl
                        ? 'bg-slate-100 text-slate-950 font-semibold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredCourses.map((course) => {
                const courseCompleted = course.lessons.filter((l) => completedLessons[l.id]).length;
                const isSelected = selectedCourse.id === course.id;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveLessonIndex(0);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/70'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-mono text-amber-400 font-semibold">{course.code}</span>
                      <span aria-hidden="true">·</span>
                      <span>Nível {course.level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {courseCompleted}/{course.lessons.length} aulas
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-100 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                    <div className="text-[11px] text-slate-400 mt-2 font-mono">
                      {course.instructor} · {course.duration}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 7 Cols: Active Course Classroom */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-amber-400 font-semibold">
                  {selectedCourse.code}
                </span>
                <span aria-hidden="true">·</span>
                <span>Nível {selectedCourse.level}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedCourse.instructor}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-50">{selectedCourse.title}</h3>
            </div>

            {/* Lesson Selector Buttons */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400">
                Módulos e Aulas Disponíveis Nesta Trilha:
              </div>
              <div className="grid grid-cols-1 gap-2">
                {selectedCourse.lessons.map((lesson, idx) => {
                  const isDone = !!completedLessons[lesson.id];
                  const isCurrent = idx === activeLessonIndex;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-colors flex items-center justify-between gap-3 min-h-[44px] ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500/60 text-slate-50'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs text-amber-400 font-semibold shrink-0">
                          Aula 0{idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-slate-400">
                        <span>{lesson.duration}</span>
                        {isDone ? (
                          <span className="text-emerald-400 font-semibold">● Concluída</span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Lesson Content Card */}
            {activeLesson && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-xs font-mono text-amber-400">
                      Aula 0{activeLessonIndex + 1} · Duração: {activeLesson.duration}
                    </span>
                    <h4 className="text-lg font-semibold text-slate-100 mt-0.5">
                      {activeLesson.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleLessonComplete(activeLesson.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap min-h-[40px] ${
                      completedLessons[activeLesson.id]
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    <BookOpenCheck className="w-4 h-4 shrink-0" />
                    {completedLessons[activeLesson.id]
                      ? 'Aula Concluída ✓'
                      : 'Marcar Aula como Concluída'}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400">Fundamentação Técnica:</div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {activeLesson.conceptSummary}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    Fórmula / Regra Canônica de Engenharia:
                  </div>
                  <code className="text-xs sm:text-sm font-mono tabular-nums text-amber-400 font-semibold">
                    {activeLesson.formulaOrRule}
                  </code>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-1">
                  <div className="text-xs font-mono text-sky-400 font-semibold">
                    Exercício Prático de Palco / Bancada:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {activeLesson.practicalExercise}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400">
                    Pontos-Chave para Memorizar:
                  </div>
                  <ul className="space-y-1.5">
                    {activeLesson.keyTakeaways.map((pt, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                        <span className="font-mono text-amber-400 font-semibold">0{i + 1}.</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACOUSTIC CERTIFICATION EXAM SIMULATOR */}
      {activeTab === 'exam-simulator' && (
        <div className="space-y-6">
          {/* Exam Controls & Live Score Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-1">Nível do Simulado:</span>
              {['Todos', 'Iniciante', 'Intermediário', 'Profissional'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setQuizLevelFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap min-h-[38px] ${
                    quizLevelFilter === lvl
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 font-mono tabular-nums text-xs">
              <div>
                Respondidas:{' '}
                <span className="text-slate-100 font-semibold">
                  {answeredCount}/{filteredQuestions.length}
                </span>
              </div>
              <div>
                Acertos:{' '}
                <span className="text-emerald-400 font-semibold">
                  {correctCount}/{filteredQuestions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnswers({})}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 min-h-[38px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuestions.map((q, qIdx) => {
              const userChoice = selectedAnswers[q.id];
              const isAnswered = userChoice !== undefined;
              const isCorrect = userChoice === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-amber-400 font-semibold">
                        Questão {String(qIdx + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{q.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span>Nível {q.level}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                      {q.question}
                    </h3>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isThisSelected = userChoice === oIdx;
                        const isThisRight = oIdx === q.correctIndex;

                        let btnStyle =
                          'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (isAnswered) {
                          if (isThisRight) {
                            btnStyle =
                              'bg-emerald-950/40 border-emerald-500/70 text-emerald-200 font-semibold';
                          } else if (isThisSelected && !isThisRight) {
                            btnStyle =
                              'bg-rose-950/40 border-rose-500/70 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                            }
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-colors flex items-center justify-between gap-2 min-h-[44px] ${btnStyle}`}
                          >
                            <span>
                              <span className="font-mono text-xs mr-2 opacity-75">
                                {String.fromCharCode(65 + oIdx)})
                              </span>
                              {opt}
                            </span>
                            {isAnswered && isThisRight && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Engineering Resolution when answered */}
                  {isAnswered && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                          : 'bg-rose-950/20 border-rose-500/40 text-rose-100'
                      }`}
                    >
                      <div className="font-mono font-semibold">
                        {isCorrect
                          ? '● RESPOSTA CORRETA — Fundamentação Técnica:'
                          : '■ RESPOSTA INCORRETA — Correção Comentada:'}
                      </div>
                      <p className="text-slate-200 leading-relaxed">{q.explanation}</p>
                      <div className="pt-1 font-mono text-amber-300">
                        Cálculo: {q.formulaUsed}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
