import React from 'react';
import { Sparkles, Lock, ShieldCheck, LogOut, KeyRound } from 'lucide-react';
import { storageService, AppUser } from '../services/storageService';
import { LabSIELogo } from './LabSIELogo';

interface HeaderProps {
  currentView: 'welcome' | 'test' | 'heritage' | 'results' | 'admin';
  onNavigate: (view: 'welcome' | 'test' | 'heritage' | 'results' | 'admin') => void;
  currentUser: AppUser;
  isTestUnlocked?: boolean;
  onOpenWelcomeModal?: () => void;
  onOpenAdminAuthModal?: () => void;
  onActivateRoute?: () => void;
  onDeactivateRoute?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
  isTestUnlocked = false,
  onOpenWelcomeModal,
  onOpenAdminAuthModal,
  onActivateRoute,
  onDeactivateRoute
}) => {
  const isAdmin = currentUser.role === 'admin';

  const handleAdminClick = () => {
    if (isAdmin) {
      onNavigate('admin');
    } else {
      if (onOpenAdminAuthModal) {
        onOpenAdminAuthModal();
      } else {
        onNavigate('admin');
      }
    }
  };

  const handleLogoutAdmin = () => {
    storageService.logoutAdmin();
    onNavigate('welcome');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9] border-b-2 border-[#CCD4CF] px-4 md:px-8 py-2.5 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Brand Zone with Official Logo */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-lg py-1 px-1 -ml-1 transition-all"
          title="Ir al inicio: Semillero de Investigación LabSIE · Grupo EduTLAN"
          aria-label="Logotipo oficial Semillero de Investigación LabSIE y Grupo EduTLAN"
        >
          <LabSIELogo size="sm" className="group-hover:scale-[1.02] transition-transform shrink-0" />
          <div className="flex flex-col border-l-2 border-[#CCD4CF] pl-2.5 leading-tight py-0.5 justify-center">
            <span className="font-serif font-bold text-xs sm:text-sm text-[#1C2624] tracking-tight">
              Semillero de Investigación LabSIE
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#059669]">
              Grupo EduTLAN · Licenciatura en Informática
            </span>
          </div>
        </button>

        {/* Zone 2: Clean text navigation links with high contrast */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#1C2624]">
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
            onClick={() => {
              if (!isTestUnlocked && onOpenWelcomeModal) {
                onOpenWelcomeModal();
              } else {
                onNavigate('test');
              }
            }}
            className={`cursor-pointer transition-colors hover:text-[#059669] pb-0.5 flex items-center gap-1.5 ${
              currentView === 'test' ? 'text-[#059669] font-bold border-b-2 border-[#10B981]' : 'text-[#1C2624]'
            }`}
          >
            {!isTestUnlocked && <Lock className="w-3.5 h-3.5 text-[#B45309]" />}
            <span>Test Vocacional</span>
            {isTestUnlocked && (
              <span className="px-1.5 py-0.2 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[10px] font-bold">
                Activo
              </span>
            )}
          </button>

          {/* Admin Tab: Clearly marked with lock or shield */}
          <button
            onClick={handleAdminClick}
            className={`cursor-pointer transition-colors hover:text-[#059669] pb-0.5 flex items-center gap-1.5 ${
              currentView === 'admin' ? 'text-[#059669] font-bold border-b-2 border-[#10B981]' : 'text-[#1C2624]'
            }`}
          >
            {isAdmin ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[#3F4E4C]" />
            )}
            <span>Panel de Coordinación</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Role Mode */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onOpenWelcomeModal && (
            <button
              onClick={onOpenWelcomeModal}
              className="cursor-pointer hidden lg:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#CCD4CF] bg-[#FAF8F5] text-[#1C2624] hover:bg-[#ECFDF5] hover:border-[#10B981] transition-all shadow-xs"
              title="Abrir invitación y convocatoria al Semillero LabSIE"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Convocatoria</span>
            </button>
          )}

          {/* Separation of Student vs Admin Actions */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]">
                <ShieldCheck className="w-3 h-3 text-[#059669]" />
                <span>Admin Activo</span>
              </span>
              <button
                onClick={handleLogoutAdmin}
                className="cursor-pointer text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1 shadow-xs"
                title="Cerrar sesión de administrador y regresar a modo Estudiante"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenAdminAuthModal) onOpenAdminAuthModal();
                else onNavigate('admin');
              }}
              className="cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#24302F] hover:bg-[#ECFDF5] hover:border-[#10B981] transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
              title="Acceso exclusivo para docentes y coordinación con clave única"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#059669]" />
              <span className="hidden sm:inline">Acceso Coordinador</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}

          {/* Botón directo de Activar Ruta / Realizar Test */}
          {currentView !== 'test' && (
            <button
              type="button"
              onClick={() => {
                if (!isTestUnlocked) {
                  if (onOpenWelcomeModal) onOpenWelcomeModal();
                } else {
                  onNavigate('test');
                }
              }}
              className={`cursor-pointer text-xs md:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap shadow-sm border-2 flex items-center gap-1.5 ${
                isTestUnlocked
                  ? 'bg-[#10B981] text-[#FFFDF9] hover:bg-[#059669] border-[#10B981]'
                  : 'bg-[#ECFDF5] text-[#065F46] hover:bg-[#10B981] hover:text-[#FFFDF9] border-[#10B981]'
              }`}
              title={isTestUnlocked ? 'Ir al Test de Exploración (Ruta Activa)' : 'Abrir invitación y activar ruta'}
            >
              {!isTestUnlocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Activar Ruta</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFFDF9]" />
                  <span>Realizar Test</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
