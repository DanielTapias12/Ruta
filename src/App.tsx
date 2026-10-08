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
import { WelcomeModal } from './components/WelcomeModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { storageService, AppUser } from './services/storageService';
import { ResearchProject, ResearchLine, AnalysisResult } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'test' | 'heritage' | 'results' | 'admin'>('welcome');
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [lines, setLines] = useState<ResearchLine[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser>(storageService.getCurrentUser());
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);

  // Semillero affiliation and popup modal state
  const [isTestUnlocked, setIsTestUnlocked] = useState<boolean>(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(true);
  const [welcomeModalMode, setWelcomeModalMode] = useState<'welcome' | 'locked-attempt'>('welcome');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

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

  // Actions from WelcomeModal and Route Activation Menu
  const handleJoinAndStartTest = () => {
    storageService.setSemilleroAffiliation('joined');
    setIsTestUnlocked(true);
    setIsWelcomeModalOpen(false);
    setCurrentView('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActivateRoute = () => {
    storageService.setSemilleroAffiliation('joined');
    setIsTestUnlocked(true);
    setIsWelcomeModalOpen(false);
    setCurrentView('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeactivateRoute = () => {
    storageService.setSemilleroAffiliation('exploring');
    setIsTestUnlocked(false);
  };

  const handleExploreBeforeTest = () => {
    storageService.setSemilleroAffiliation('exploring');
    setIsTestUnlocked(false);
    setIsWelcomeModalOpen(false);
    setCurrentView('heritage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct navigation with role separation protection
  const handleNavigate = (view: 'welcome' | 'test' | 'heritage' | 'results' | 'admin') => {
    if (view === 'admin') {
      if (!storageService.isAdminAuthenticated()) {
        setIsAdminAuthModalOpen(true);
        return;
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthModalOpen(false);
    setCurrentView('admin');
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

      {/* 3-Zone Header Contract with Route Activation Menu */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        isTestUnlocked={isTestUnlocked}
        onOpenWelcomeModal={() => {
          setWelcomeModalMode('welcome');
          setIsWelcomeModalOpen(true);
        }}
        onOpenAdminAuthModal={() => setIsAdminAuthModalOpen(true)}
        onActivateRoute={handleActivateRoute}
        onDeactivateRoute={handleDeactivateRoute}
      />

      {/* Main View Router — Firmemente ADELANTE con z-index positivo */}
      <main className="flex-1 relative z-10" style={{ position: 'relative', zIndex: 10 }}>
        {currentView === 'welcome' && (
          <WelcomeView
            onStartTest={() => handleNavigate('test')}
            onExploreHeritage={() => handleNavigate('heritage')}
            projects={projects}
            lines={lines}
            isTestUnlocked={isTestUnlocked}
            onOpenWelcomeModal={() => {
              setWelcomeModalMode('welcome');
              setIsWelcomeModalOpen(true);
            }}
            onActivateRoute={handleActivateRoute}
            onDeactivateRoute={handleDeactivateRoute}
          />
        )}

        {currentView === 'test' && (
          <TestView
            projects={projects}
            lines={lines}
            onTestComplete={handleTestComplete}
            onCancel={() => handleNavigate('welcome')}
            isTestUnlocked={isTestUnlocked}
            onActivateRoute={handleActivateRoute}
            onOpenWelcomeModal={() => {
              setWelcomeModalMode('welcome');
              setIsWelcomeModalOpen(true);
            }}
            onExploreHeritage={() => handleNavigate('heritage')}
          />
        )}

        {currentView === 'heritage' && (
          <HeritageExplorer
            projects={projects}
            lines={lines}
            onStartTest={() => handleNavigate('test')}
            isTestUnlocked={isTestUnlocked}
          />
        )}

        {currentView === 'results' && activeAnalysis && (
          <ResultsView
            analysis={activeAnalysis}
            onExploreHeritage={() => handleNavigate('heritage')}
            onRetakeTest={() => handleNavigate('test')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            analyses={analyses}
            projects={projects}
            lines={lines}
            onRefreshData={loadData}
            onExitAdmin={() => handleNavigate('welcome')}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Ventana emergente al inicio: Bienvenida, Promoción, Logotipos Grandes y Decisión */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onJoinAndStartTest={handleJoinAndStartTest}
        onExploreBeforeTest={handleExploreBeforeTest}
        mode={welcomeModalMode}
        totalProjectsCount={projects.length}
      />

      {/* Modal de Autenticación de Administrador con Clave Única */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />
    </div>
  );
}
