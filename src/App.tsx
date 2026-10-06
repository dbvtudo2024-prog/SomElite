/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AcousticSimulator } from './components/AcousticSimulator';
import { ManualsAndTables } from './components/ManualsAndTables';
import { AcademyAndQuizzes } from './components/AcademyAndQuizzes';
import { RepairAndConsultation } from './components/RepairAndConsultation';
import { CommunityForum } from './components/CommunityForum';
import { Compass, BookOpen, GraduationCap, Wrench, MessageSquare, Zap } from 'lucide-react';

type ActiveSection = 'simulator' | 'manuals' | 'academy' | 'repair-sos' | 'forum';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('simulator');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeSection]);

  const navItems: { id: ActiveSection; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    {
      id: 'simulator',
      label: 'Simulador',
      shortLabel: 'Simulador',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'manuals',
      label: 'Manuais & Tabelas',
      shortLabel: 'Manuais',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'academy',
      label: 'Cursos & Simulados',
      shortLabel: 'Cursos',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'repair-sos',
      label: 'Conserto & SOS',
      shortLabel: 'SOS Palco',
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      id: 'forum',
      label: 'Fórum',
      shortLabel: 'Fórum',
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col pb-20 md:pb-0 overflow-x-hidden">
      {/* Top Bar Contract: Strictly 3 Zones with generous horizontal separation */}
      <header className="sticky top-0 z-30 h-14 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6 lg:gap-12">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('simulator');
            }}
            className="font-display text-base sm:text-xl font-bold tracking-tight text-slate-50 whitespace-nowrap shrink-0"
          >
            Sonoplastia de Elite
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-xs lg:text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`py-1.5 transition-colors whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'border-amber-500 text-slate-50 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection('repair-sos')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap min-h-[36px] flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              SOS Palco
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport — Renders Active Tool Immediately at the Top */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-7">
        {activeSection === 'simulator' && <AcousticSimulator />}
        {activeSection === 'manuals' && <ManualsAndTables />}
        {activeSection === 'academy' && <AcademyAndQuizzes />}
        {activeSection === 'repair-sos' && <RepairAndConsultation />}
        {activeSection === 'forum' && <CommunityForum />}
      </main>

      {/* Quiet Editorial Footer (Desktop) */}
      <footer className="hidden md:block border-t border-slate-900 py-6 px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>Sonoplastia de Elite — Engenharia de Áudio Profissional para Celular e PC</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSection('simulator')}
              className="hover:text-slate-300 transition-colors"
            >
              Simulador 2D
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveSection('manuals')}
              className="hover:text-slate-300 transition-colors"
            >
              Tabelas AES14
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveSection('repair-sos')}
              className="hover:text-slate-300 transition-colors"
            >
              SOS Palco
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Tab Bar (Thumb-Zone Navigation, <= 15% Viewport Height) */}
      <nav
        aria-label="Navegação Principal Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#0B0F17]/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center px-1"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center rounded-lg transition-colors ${
                isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[68px]">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
