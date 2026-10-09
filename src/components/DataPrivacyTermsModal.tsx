import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { LabSIELogo } from './LabSIELogo';
import { EduTLANLogo } from './EduTLANLogo';

interface DataPrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  hasAccepted?: boolean;
}

export const DataPrivacyTermsModal: React.FC<DataPrivacyTermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  hasAccepted = false
}) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'completo' | 'normatividad' | 'seguridad'>('resumen');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C2624]/75 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header institucional */}
        <div className="bg-[#1C2624] text-[#FAF8F5] p-5 sm:p-6 border-b-2 border-[#10B981]/50 relative">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#CCD4CF] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Protección Criptográfica · Ley 1581 de 2012</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-[#FAF8F5] font-mono">
              AES-256-GCM + JWT HS256
            </span>
          </div>

          <h2 id="privacy-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-white">
            Términos, Condiciones y Política de Tratamiento de Datos Personales
          </h2>
          <p className="text-xs sm:text-sm text-[#CCD4CF] mt-1 leading-relaxed">
            Semillero de Investigación LabSIE · Grupo de Investigación EduTLAN (Categoría A MinCiencias)
            <br />
            Licenciatura en Informática · Universidad de Córdoba (Colombia)
          </p>

          {/* Selector de pestañas */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('resumen')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'resumen'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-[#CCD4CF] hover:bg-white/10'
              }`}
            >
              1. Resumen y Finalidad
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('normatividad')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'normatividad'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-[#CCD4CF] hover:bg-white/10'
              }`}
            >
              2. Marco Normativo (Leyes)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seguridad')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'seguridad'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-[#CCD4CF] hover:bg-white/10'
              }`}
            >
              3. Cifrado y JWT
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completo')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'completo'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-[#CCD4CF] hover:bg-white/10'
              }`}
            >
              4. Texto Jurídico Completo
            </button>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-5 text-[#24302F] text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: RESUMEN Y FINALIDAD */}
          {activeTab === 'resumen' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] space-y-2">
                <div className="flex items-center gap-2 text-[#065F46] font-bold">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                  <span>¿Por qué y para qué recopilamos tus datos?</span>
                </div>
                <p className="text-xs text-[#065F46] leading-relaxed">
                  El <strong>Semillero de Investigación LabSIE</strong> recopila tu nombre, correo institucional, número de teléfono/WhatsApp y trayectoria académica <strong>única y exclusivamente con fines investigativos, pedagógicos y de articulación académica</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-[#1C2624] flex items-center gap-2">
                  <span>🎯</span>
                  <span>Finalidades Específicas del Tratamiento de Datos:</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF] space-y-1">
                    <span className="font-bold text-[#059669] block">1. Caracterización Investigativa</span>
                    <p className="text-[#3F4E4C]">
                      Analizar tus afinidades temáticas, habilidades técnicas y preguntas de curiosidad para asignarte una trayectoria y arquetipo investigativo personalizado.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF] space-y-1">
                    <span className="font-bold text-[#059669] block">2. Contacto Directo y Notificaciones</span>
                    <p className="text-[#3F4E4C]">
                      Contactarte mediante tu correo institucional y celular/WhatsApp para convocatorias oficiales, reuniones de semillero, entrevistas con docentes e invitación a proyectos.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF] space-y-1">
                    <span className="font-bold text-[#059669] block">3. Vinculación al Semillero LabSIE</span>
                    <p className="text-[#3F4E4C]">
                      Gestionar tu adscripción al Semillero LabSIE y al Grupo EduTLAN (Categoría A MinCiencias) de la Licenciatura en Informática de la Universidad de Córdoba.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF] space-y-1">
                    <span className="font-bold text-[#059669] block">4. Generación de Dossier e Informes</span>
                    <p className="text-[#3F4E4C]">
                      Emitir informes técnicos de caracterización (PDF y DOCX) respaldados con firma de integridad digital y sellado criptográfico JWT.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] text-xs text-[#92400E] space-y-1">
                <span className="font-bold block flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#B45309]" />
                  <span>Garantía de No Comercialización y Confidencialidad Estricta</span>
                </span>
                <p>
                  En ningún caso tus datos personales serán vendidos, comercializados, transferidos ni cedidos a terceras entidades comerciales o ajenas al ámbito académico de la Universidad de Córdoba y el Grupo EduTLAN.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MARCO NORMATIVO */}
          {activeTab === 'normatividad' && (
            <div className="space-y-4">
              <div className="border-b border-[#CCD4CF] pb-2">
                <h3 className="font-serif font-bold text-base text-[#1C2624]">
                  🏛️ Marco Jurídico y Normativo Aplicable (Colombia)
                </h3>
                <p className="text-xs text-[#526066]">
                  La recolección y tratamiento de datos se fundamenta estrictamente en la legislación colombiana vigente sobre Protección de Datos Personales y Habeas Data:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Ley 1581 de 2012 */}
                <div className="p-3.5 rounded-xl bg-[#FFFDF9] border-2 border-[#10B981]/30 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#059669] text-sm">Ley Estatutaria 1581 de 2012</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] font-bold text-[10px] border border-[#A7F3D0]">
                      Congreso de la República
                    </span>
                  </div>
                  <p className="text-[#3F4E4C]">
                    Por la cual se dictan disposiciones generales para la protección de datos personales. Regula el derecho constitucional que tienen todas las personas a conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bases de datos o archivos (Principios de Legalidad, Finalidad, Libertad, Veracidad, Transparencia, Acceso Restringido, Seguridad y Confidencialidad).
                  </p>
                </div>

                {/* 2. Decreto 1377 de 2013 */}
                <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C2624] text-sm">Decreto Reglamentario 1377 de 2013</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] text-[#526066] font-bold text-[10px] border border-[#CCD4CF]">
                      Presidencia de la República
                    </span>
                  </div>
                  <p className="text-[#3F4E4C]">
                    Reglamenta parcialmente la Ley 1581 de 2012 en lo relativo a la autorización del titular para el tratamiento de datos personales, las políticas de tratamiento de los responsables y encargados, el ejercicio de los derechos de los titulares y las transferencias de datos.
                  </p>
                </div>

                {/* 3. Constitución Política Art 15 */}
                <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C2624] text-sm">Constitución Política de Colombia (Artículo 15)</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] text-[#526066] font-bold text-[10px] border border-[#CCD4CF]">
                      Derecho Fundamental
                    </span>
                  </div>
                  <p className="text-[#3F4E4C]">
                    Garantiza a todas las personas su intimidad personal y familiar y su buen nombre. Otorga expresamente el derecho de conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bancos de datos y en archivos de entidades públicas y privadas.
                  </p>
                </div>

                {/* 4. Decreto 1074 de 2015 & Reglamentos Unicordoba */}
                <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C2624] text-sm">Políticas Institucionales · Universidad de Córdoba</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] text-[#526066] font-bold text-[10px] border border-[#CCD4CF]">
                      Acuerdos Consejo Superior
                    </span>
                  </div>
                  <p className="text-[#3F4E4C]">
                    Manual interno de políticas y procedimientos para la protección y tratamiento de datos personales de la Universidad de Córdoba, garantizando la seguridad en el manejo de registros de estudiantes de pregrado de la Licenciatura en Informática.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEGURIDAD Y JWT */}
          {activeTab === 'seguridad' && (
            <div className="space-y-4">
              <div className="border-b border-[#CCD4CF] pb-2">
                <h3 className="font-serif font-bold text-base text-[#1C2624]">
                  🔐 Arquitectura Criptográfica y Protección de Datos
                </h3>
                <p className="text-xs text-[#526066]">
                  Cómo implementamos la protección técnica de tu número de celular y datos sensibles:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border-2 border-[#10B981] space-y-2">
                  <div className="flex items-center gap-2 text-[#059669] font-bold">
                    <KeyRound className="w-5 h-5" />
                    <span>Cifrado Simétrico AES-GCM de 256 bits (Web Crypto API)</span>
                  </div>
                  <p className="text-[#3F4E4C] leading-relaxed">
                    Tus datos de contacto (número de celular / WhatsApp y correo institucional) no se almacenan como texto plano desprotegido. Son cifrados con <strong>AES-256 en modo GCM (Galois/Counter Mode)</strong>, un estándar de grado militar que garantiza tanto la confidencialidad como la autenticidad e integridad del mensaje mediante vectores de inicialización aleatorios de 96 bits.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border-2 border-[#059669] space-y-2">
                  <div className="flex items-center gap-2 text-[#065F46] font-bold">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <span>JSON Web Token (JWT RFC 7519) con Firma HMAC-SHA256</span>
                  </div>
                  <p className="text-[#3F4E4C] leading-relaxed">
                    Al completar la caracterización se genera un <strong>Token JWT firmado</strong> que vincula tu identificación estudiantil, fecha de consentimiento, huella criptográfica SHA-256 del teléfono y autorización expresa de la Ley 1581. Cualquier intento de alteración invalida de inmediato la firma criptográfica (tamper-evident).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] space-y-1 text-[#92400E]">
                  <span className="font-bold block">Acceso Restringido al Administrador</span>
                  <p>
                    Solo la coordinación del semillero autenticada mediante la Clave Maestra de Administración puede descifrar los datos de contacto para ponerse en comunicación contigo para convocatorias y eventos oficiales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEXTO COMPLETO JURÍDICO */}
          {activeTab === 'completo' && (
            <div className="space-y-3 text-xs text-[#3F4E4C] leading-relaxed border p-4 rounded-xl bg-[#FAF8F5] border-[#CCD4CF]">
              <h4 className="font-bold text-[#1C2624] text-sm">
                AUTORIZACIÓN EXPRESA PARA EL TRATAMIENTO DE DATOS PERSONALES
              </h4>
              <p>
                En cumplimiento de lo dispuesto en la <strong>Ley Estatutaria 1581 de 2012</strong>, su <strong>Decreto Reglamentario 1377 de 2013</strong> y el <strong>Artículo 15 de la Constitución Política de Colombia</strong>, manifiesto de manera voluntaria, previa, explícita, informada e inequívoca que autorizo al <strong>Semillero de Investigación LabSIE</strong> y al <strong>Grupo de Investigación EduTLAN</strong> de la Universidad de Córdoba para que actúen como Responsables del Tratamiento de mis datos personales recolectados a través de este formulario de exploración investigativa.
              </p>
              <h5 className="font-bold text-[#1C2624] pt-2">Cláusula 1. Datos Recopilados:</h5>
              <p>
                Nombre y apellidos, correo electrónico institucional, número telefónico / WhatsApp de contacto, programa académico (Licenciatura en Informática), semestre cursado, experiencias en investigación, habilidades tecnológicas y respuestas al cuestionario vocacional.
              </p>
              <h5 className="font-bold text-[#1C2624] pt-2">Cláusula 2. Finalidades:</h5>
              <p>
                Los datos se recolectan con el propósito de: (i) Evaluar y orientar mis afinidades investigativas respecto a las líneas y proyectos del semillero; (ii) Contactarme para informarme sobre convocatorias, entrevistas, tutorías y admisión al Semillero LabSIE; (iii) Registrar formalmente mi participación investigativa; (iv) Elaborar informes académicos institucionales protegidos mediante token JWT.
              </p>
              <h5 className="font-bold text-[#1C2624] pt-2">Cláusula 3. Derechos del Titular (Habeas Data):</h5>
              <p>
                Como titular de los datos tengo derecho a: (a) Conocer, actualizar y rectificar mis datos personales; (b) Solicitar prueba de la presente autorización; (c) Ser informado del uso que se ha dado a mis datos; (d) Revocar la autorización y/o solicitar la supresión del dato en los términos previstos por la Ley 1581 de 2012.
              </p>
              <h5 className="font-bold text-[#1C2624] pt-2">Cláusula 4. Canales de Ejercicio de Derechos:</h5>
              <p>
                Para ejercer mis derechos de Habeas Data puedo dirigirme formalmente a la Coordinación del Semillero LabSIE y del Grupo EduTLAN en la Facultad de Educación y Ciencias Humanas, Licenciatura en Informática, Universidad de Córdoba (Montería, Colombia).
              </p>
            </div>
          )}
        </div>

        {/* Footer con botones de aceptación */}
        <div className="bg-[#FAF8F5] border-t-2 border-[#CCD4CF] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#526066]">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Regulado bajo Ley 1581 de 2012 (Colombia) · Cifrado AES-256</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2.5 rounded-xl border border-[#CCD4CF] bg-white text-xs font-bold text-[#526066] hover:bg-[#F2EDE5] transition-colors"
            >
              Cerrar
            </button>
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-xs sm:text-sm font-bold hover:bg-[#059669] transition-all shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{hasAccepted ? 'Entendido (Aceptado)' : 'Aceptar Términos y Continuar'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
