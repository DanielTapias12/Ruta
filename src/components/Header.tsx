import React from 'react';
import { storageService, AppUser } from '../services/storageService';
import { LabSIELogo } from './LabSIELogo';

interface HeaderProps {
  currentView: 'welcome' | 'test' | 'heritage' | 'results' | 'admin';
  onNavigate: (view: 'welcome' | 'test' | 'heritage' | 'results' | 'admin') => void;
  currentUser: AppUser;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, currentUser }) => {
  const isAdmin = currentUser.role === 'admin';

  const handleRoleToggle = () => {
    storageService.setAdminRole(!isAdmin);
    if (!isAdmin) {
      onNavigate('admin');
    } else {
      onNavigate('welcome');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9] border-b-2 border-[#CCD4CF] px-4 md:px-8 py-2.5 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Brand Zone with Official Logo */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-lg py-1 px-1 -ml-1 transition-all"
          title="Ir al inicio de LabSIE · Ruta Investigativa"
          aria-label="Logotipo oficial LabSIE Grupo EduTLAN - Ir a la pantalla de bienvenida"
        >
          <LabSIELogo size="sm" className="group-hover:scale-[1.02] transition-transform" />
          <div className="hidden lg:flex flex-col border-l-2 border-[#CCD4CF] pl-2.5 leading-none py-0.5 justify-center">
            <span className="font-serif font-bold text-xs text-[#1C2624] tracking-tight">Ruta Investigativa</span>
            <span className="text-[10px] font-semibold text-[#059669] mt-1">Licenciatura en Informática</span>
          </div>
        </button>

        {/* Zone 2: Clean text navigation links with high contrast */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#1C2624]">
          <button
            onClick={() => onNavigate('welcome')}
            className={`cursor-pointer transition-colors hover:text-[#059669] pb-0.5 ${
              currentView === 'welcome' ? 'text-[#059669] font-bold border-b-2 border-[#10B981]' : 'text-[#1C2624]'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => onNavigate('heritage')}
            className={`cursor-pointer transition-colors hover:text-[#059669] pb-0.5 ${
              currentView === 'heritage' ? 'text-[#059669] font-bold border-b-2 border-[#10B981]' : 'text-[#1C2624]'
            }`}
          >
            Patrimonio Científico
          </button>
          <button
            onClick={() => onNavigate('test')}
            className={`cursor-pointer transition-colors hover:text-[#059669] pb-0.5 ${
              currentView === 'test' ? 'text-[#059669] font-bold border-b-2 border-[#10B981]' : 'text-[#1C2624]'
            }`}
          >
            Test de Exploración
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`cursor-pointer transition-colors hover:text-[#059669] pb-0.5 ${
              currentView === 'admin' ? 'text-[#059669] font-bold border-b-2 border-[#10B981]' : 'text-[#1C2624]'
            }`}
          >
            Panel Administrativo
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Role Mode */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRoleToggle}
            className="cursor-pointer text-xs font-bold px-3.5 py-1.5 rounded-lg border-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#24302F] hover:bg-[#ECFDF5] hover:border-[#10B981] transition-colors whitespace-nowrap shadow-xs"
            title={isAdmin ? 'Cambiar a modo Estudiante' : 'Cambiar a modo Coordinación LabSIE'}
            style={{ color: '#24302F' }}
          >
            {isAdmin ? 'Modo: Coordinador' : 'Modo: Estudiante'}
          </button>

          {currentView !== 'test' && (
            <button
              onClick={() => onNavigate('test')}
              className="cursor-pointer text-xs md:text-sm font-bold px-4 py-2 rounded-lg bg-[#10B981] text-[#FFFDF9] hover:bg-[#059669] transition-colors whitespace-nowrap shadow-sm border border-[#10B981]"
            >
              Comenzar ruta
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
