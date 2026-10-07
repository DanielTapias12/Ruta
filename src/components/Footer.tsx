import React from 'react';
import { EduTLANLogo } from './EduTLANLogo';
import { LabSIELogo } from './LabSIELogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t-2 border-[#CCD4CF] bg-[#FFFDF9] py-12 px-4 md:px-8 text-xs text-[#3F4E4C] relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <LabSIELogo size="sm" />
          <div className="border-l-2 border-[#CCD4CF] pl-3 space-y-0.5">
            <p className="font-serif text-sm font-bold text-[#24302F]">
              LABSIE · RUTA INVESTIGATIVA
            </p>
            <p className="text-[#3F4E4C] font-medium">
              Laboratorio de Sistemas Inteligentes en Educación · Grupo EduTLAN (Cat. A MinCiencias)
            </p>
            <p className="text-[#3F4E4C]">
              Facultad de Educación · Licenciatura en Informática · Universidad de Córdoba
            </p>
            <p className="text-[#059669] font-bold pt-1">
              Docentes Asesores: Manuel Caro Piñeres · Raúl Toscano Miranda (rtoscano@correo.unicordoba.edu.co)
            </p>
          </div>
        </div>

        <div className="text-left md:text-right space-y-1">
          <p className="italic text-[#059669] font-serif font-bold text-sm">
            "Investigar no es empezar de cero. Es saber desde dónde continuar."
          </p>
          <p className="text-[#3F4E4C] font-medium">
            Vicerrectoría de Investigación y Extensión · investigacion@correo.unicordoba.edu.co
          </p>
          <span className="inline-block mt-1 px-3 py-1 rounded-full bg-[#10B981] text-[#FFFDF9] text-[11px] font-bold tracking-wide shadow-xs">
            ¡Anímate a ser un semillerista UNICOR!
          </span>
        </div>
      </div>
    </footer>
  );
};
