/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WelcomeView } from './components/WelcomeView';
import { TestView } from './components/TestView';
import { HeritageExplorer } from './components/HeritageExplorer';
import { ResultsView } from './components/ResultsView';
import { AdminDashboard } from './components/AdminDashboard';
import { storageService, AppUser } from './services/storageService';
import { ResearchProject, ResearchLine, AnalysisResult } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'test' | 'heritage' | 'results' | 'admin'>('welcome');
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [lines, setLines] = useState<ResearchLine[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser>(storageService.getCurrentUser());
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);

  const loadData = () => {
    setProjects(storageService.getProjects());
    setLines(storageService.getLines());
    const allAnalyses = storageService.getAnalyses();
    setAnalyses(allAnalyses);
    setCurrentUser(storageService.getCurrentUser());
    if (!activeAnalysis && allAnalyses.length > 0) {
      setActiveAnalysis(allAnalyses[0]);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = storageService.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  const handleTestComplete = (result: AnalysisResult) => {
    setActiveAnalysis(result);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F5EFE6] via-[#FAF8F5] to-[#F2EDE5] text-[#24302F] relative overflow-x-hidden">
      {/* Fondo institucional oficial — Detrás de TODO el contenido (-z-10) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
        style={{ zIndex: -10 }}
        aria-hidden="true"
      >
        <img
          src="/fondo-labsie-paisaje.svg"
          alt=""
          className="w-full h-full object-cover object-top opacity-15 md:opacity-20 transition-opacity"
        />
        {/* Velo armonizador protector — mantiene legibilidad 100% nítida */}
        <div className="absolute inset-0 bg-[#FAF8F5]/70 pointer-events-none" />
      </div>

      {/* 3-Zone Header Contract */}
      <Header
        currentView={currentView}
        onNavigate={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
      />

      {/* Main View Router — Firmemente ADELANTE con z-index positivo */}
      <main className="flex-1 relative z-10" style={{ position: 'relative', zIndex: 10 }}>
        {currentView === 'welcome' && (
          <WelcomeView
            onStartTest={() => setCurrentView('test')}
            onExploreHeritage={() => setCurrentView('heritage')}
            projects={projects}
            lines={lines}
          />
        )}

        {currentView === 'test' && (
          <TestView
            projects={projects}
            lines={lines}
            onTestComplete={handleTestComplete}
            onCancel={() => setCurrentView('welcome')}
          />
        )}

        {currentView === 'heritage' && (
          <HeritageExplorer
            projects={projects}
            lines={lines}
            onStartTest={() => setCurrentView('test')}
          />
        )}

        {currentView === 'results' && activeAnalysis && (
          <ResultsView
            analysis={activeAnalysis}
            onExploreHeritage={() => setCurrentView('heritage')}
            onRetakeTest={() => setCurrentView('test')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            analyses={analyses}
            projects={projects}
            lines={lines}
            onRefreshData={loadData}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
