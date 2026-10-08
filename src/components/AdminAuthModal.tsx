import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight, X, KeyRound, UserCheck } from 'lucide-react';
import { storageService } from '../services/storageService';
import { LabSIELogo } from './LabSIELogo';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const trimmedKey = accessKey.trim();
    if (!trimmedKey) {
      setErrorMsg('Por favor introduce la clave única de administración.');
      setIsSubmitting(false);
      return;
    }

    const isValid = storageService.loginAdmin(trimmedKey);
    if (isValid) {
      setIsSubmitting(false);
      setAccessKey('');
      setErrorMsg(null);
      onSuccess();
    } else {
      setIsSubmitting(false);
      setErrorMsg('Clave de administración incorrecta. Verifícala e intenta nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-2xl border-2 border-[#CCD4CF] shadow-2xl p-6 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-1.5 rounded-lg text-[#3F4E4C] hover:text-[#1C2624] hover:bg-[#FAF8F5] transition-colors"
          aria-label="Cerrar modal de autenticación"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with LabSIE Logo & Security Icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[#059669] shadow-xs">
            <ShieldCheck className="w-8 h-8 text-[#059669]" />
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#059669] block mb-1">
              Control de Acceso Seguro · Grupo EduTLAN
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1C2624]">
              Acceso de Coordinación & Administración
            </h2>
            <p className="text-xs text-[#3F4E4C] mt-1.5 leading-relaxed">
              Este apartado está reservado para docentes tutores y coordinadores del <strong>Semillero LabSIE</strong>. Requiere ingresar la clave única maestra para habilitar la revisión de evaluaciones y gestión de proyectos.
            </p>
          </div>
        </div>

        {/* Separation of Roles Callout */}
        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF] text-xs space-y-2">
          <div className="flex items-center justify-between font-bold">
            <span className="text-[#059669] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Portal de Estudiantes:
            </span>
            <span className="text-[#10B981] font-mono text-[11px]">Acceso Libre</span>
          </div>
          <p className="text-[11px] text-[#3F4E4C] leading-normal">
            Los estudiantes pueden realizar el test diagnóstico, explorar líneas y descargar resultados sin necesidad de clave.
          </p>
        </div>

        {/* Key Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="adminKey" className="block text-xs font-bold text-[#1C2624] flex items-center justify-between">
              <span>Clave Única de Administrador</span>
              <span className="text-[11px] font-normal text-[#059669] flex items-center gap-1">
                <KeyRound className="w-3 h-3" /> Clave Maestra Requerida
              </span>
            </label>

            <div className="relative">
              <input
                id="adminKey"
                type={showKey ? 'text' : 'password'}
                value={accessKey}
                onChange={(e) => {
                  setAccessKey(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Introduce la clave única (ej. LABSIE-ADMIN-...)"
                autoFocus
                className="w-full px-3.5 py-2.5 pr-10 text-sm font-mono rounded-xl border-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#1C2624] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all placeholder:text-[#3F4E4C]/50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#3F4E4C] hover:text-[#1C2624] p-1 transition-colors"
                title={showKey ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 pt-1 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-[#059669] text-[#FFFDF9] hover:bg-[#047857] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Verificando clave...' : 'Desbloquear Panel Administrativo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer w-full py-2 px-4 rounded-xl font-bold text-xs text-[#3F4E4C] hover:text-[#1C2624] hover:bg-[#FAF8F5] transition-colors"
            >
              Cancelar y continuar en modo Estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
