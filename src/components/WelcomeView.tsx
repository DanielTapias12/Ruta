import React from 'react';
import { ArrowRight, Compass, Library, Sparkles, BookOpen, GitFork, CheckCircle, Layers } from 'lucide-react';
import { ResearchProject, ResearchLine } from '../types';
import { LabSIELogo } from './LabSIELogo';
import { EduTLANLogo } from './EduTLANLogo';

interface WelcomeViewProps {
  onStartTest: () => void;
  onExploreHeritage: () => void;
  projects: ResearchProject[];
  lines?: ResearchLine[];
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartTest,
  onExploreHeritage,
  projects,
  lines = []
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16 relative">
      {/* Editorial Header / Hero Section with Official Institutional Logo */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        {/* Logotipo Oficial LabSIE · Grupo EduTLAN */}
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-xs inline-flex flex-col items-center max-w-full">
            <LabSIELogo size="lg" className="hover:scale-[1.01] transition-transform" />
            <div className="mt-3 pt-2.5 border-t border-[#DDE2DE] flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-[#526066]">
              <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                Semillero de Investigación
              </span>
              <span className="text-[#CCD4CF]" aria-hidden="true">·</span>
              <span className="px-2.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                Grupo EduTLAN (Cat. A MinCiencias)
              </span>
              <span className="text-[#CCD4CF]" aria-hidden="true">·</span>
              <span className="text-[#24302F]">Universidad de Córdoba</span>
            </div>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#24302F] leading-tight text-balance" style={{ color: '#24302F' }}>
          Descubre dónde podría comenzar tu investigación.
        </h1>

        <p className="font-serif italic text-lg md:text-xl text-[#059669]">
          "De tus intereses a una posible investigación."
        </p>

        <p className="text-[#24302F] text-base md:text-lg leading-relaxed text-pretty font-normal" style={{ color: '#24302F' }}>
          No necesitas tener un proyecto definido. Esta experiencia analiza tus intereses,
          curiosidades y formas de abordar problemas para ayudarte a encontrar posibles caminos
          de investigación dentro del patrimonio investigativo de LabSIE.
        </p>

        {/* CTAs with strong background contrast */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartTest}
            className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#10B981] text-[#FFFDF9] font-bold text-base hover:bg-[#059669] transition-all shadow-md hover:shadow-lg border-2 border-[#10B981] group"
          >
            <span>Comenzar exploración</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreHeritage}
            className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl border-2 border-[#10B981] bg-[#FFFDF9] text-[#24302F] font-bold text-base hover:bg-[#ECFDF5] hover:border-[#059669] transition-all shadow-sm hover:shadow-md"
            style={{ color: '#24302F' }}
          >
            <Library className="w-5 h-5 text-[#10B981] shrink-0" />
            <span style={{ color: '#24302F' }}>Conocer LabSIE ({projects.length} proyectos)</span>
          </button>
        </div>
      </div>

      {/* Visual Flow Representation with strong defined borders */}
      <div className="mt-16 md:mt-24 p-6 md:p-10 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
            Dinámica del Sistema de Orientación
          </span>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
            De la curiosidad personal al patrimonio científico
          </h2>
        </div>

        {/* Flow diagram steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] flex flex-col items-center text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-[#FFFDF9] flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              01
            </div>
            <span className="font-serif font-bold text-[#24302F] text-lg" style={{ color: '#24302F' }}>Tú</span>
            <p className="mt-2 text-xs text-[#526066] leading-relaxed font-medium">
              Tus experiencias previas, saberes en informática y formas intuitivas de encarar interrogantes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] flex flex-col items-center text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-[#FFFDF9] flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              02
            </div>
            <span className="font-serif font-bold text-[#24302F] text-lg" style={{ color: '#24302F' }}>Intereses</span>
            <p className="mt-2 text-xs text-[#526066] leading-relaxed font-medium">
              Tus curiosidades sobre IA, cognición, analítica, diseño didáctico y desafíos socioculturales.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] flex flex-col items-center text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-[#FFFDF9] flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              03
            </div>
            <span className="font-serif font-bold text-[#24302F] text-lg" style={{ color: '#24302F' }}>Investigación</span>
            <p className="mt-2 text-xs text-[#526066] leading-relaxed font-medium">
              Cruce con la memoria científica de LabSIE: problemas resueltos, conceptos y preguntas abiertas.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] flex flex-col items-center text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#C79A52] text-[#FFFDF9] flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              04
            </div>
            <span className="font-serif font-bold text-[#24302F] text-lg" style={{ color: '#24302F' }}>Nuevas Posibilidades</span>
            <p className="mt-2 text-xs text-[#526066] leading-relaxed font-medium">
              Rutas concretas para heredar, conectar, trascender o explorar una propuesta con respaldo docente.
            </p>
          </div>
        </div>

        {/* Philosophical Banner */}
        <div className="mt-8 pt-6 border-t-2 border-[#CCD4CF] text-center">
          <blockquote className="font-serif italic text-base md:text-lg font-bold text-[#059669]">
            "Investigar no es empezar de cero. Es saber desde dónde continuar."
          </blockquote>
        </div>
      </div>

      {/* Las 4 Líneas de Investigación Oficiales */}
      <div className="mt-16 md:mt-24 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-bold uppercase tracking-wider border border-[#A7F3D0]">
            <Layers className="w-3.5 h-3.5" />
            Estructura Epistemológica LabSIE · EduTLAN
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F]" style={{ color: '#24302F' }}>
            Las Cuatro Líneas de Investigación
          </h2>
          <p className="text-sm md:text-base text-[#526066] leading-relaxed">
            El Semillero LabSIE y el Grupo EduTLAN (Categoría A MinCiencias) desarrollan su labor científica
            alrededor de <strong className="text-[#24302F]">cuatro líneas oficiales de investigación</strong> en la Licenciatura en Informática:
          </p>
        </div>

        {/* Grid de las 4 líneas con diseño enriquecido para todas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Línea 1 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#10B981] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 01
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-diseno-sistemas-inteligentes').length} Proyectos Activos
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#24302F]" style={{ color: '#24302F' }}>
                  Diseño e implementación de sistemas inteligentes para la educación
                </h3>
                <p className="text-xs md:text-sm text-[#3F4E4C] leading-relaxed mt-1.5 font-normal">
                  Investigación orientada al diseño, modelado e implementación de sistemas inteligentes, agentes tutores y herramientas computacionales aplicadas a la educación, integrando inteligencia artificial con pedagogía.
                </p>
              </div>

              {/* Proyectos patrimoniales con diseño uniforme */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>
                
                {/* LABSIE-P06 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P06</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🎯 Sistemas Tutores & Resolución de Problemas
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Diseño de un modelo de actividades de aprendizaje para un sistema tutor inteligente
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Estructuración pedagógica de tareas para un STI orientado a potenciar habilidades cognitivas superiores y competencias del siglo XXI (Diaz Arteaga, 2024).
                  </p>
                </div>

                {/* LABSIE-P20 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P20</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🧪 Benchmarking Experimental en LLMs
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    CARINA MIRROR Test: un benchmark conductual para la Metacognición Artificial en LLMs
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Protocolos experimentales de sondeo y perturbación para medir autoconocimiento, calibración y detección de errores en IA.
                  </p>
                </div>

                {/* LABSIE-P19 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P19</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      📐 Investigación Basada en Diseño (DBR)
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Diseño de tareas para el desarrollo del pensamiento crítico en un sistema tutor mediado por IA
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Ciclos iterativos de prototipado pedagógico y validación con usuarios para andamiar inferencias y argumentación crítica.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Sistemas Inteligentes', 'Tutorías Adaptativas', 'Metacognición', 'CARINA', 'Resolución de Problemas', 'LLMs'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Línea 2 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#10B981] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 02
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-entornos-virtuales-adaptativos').length} Proyectos Activos
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#24302F]" style={{ color: '#24302F' }}>
                  Desarrollo de entornos de aprendizaje virtuales y adaptativos
                </h3>
                <p className="text-xs md:text-sm text-[#3F4E4C] leading-relaxed mt-1.5 font-normal">
                  Desarrollo de entornos y plataformas virtuales que se adaptan a las necesidades del estudiante, ambientes híbridos de aprendizaje y espacios colaborativos con anclaje cultural y metodológico.
                </p>
              </div>

              {/* Proyectos patrimoniales con diseño uniforme */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>

                {/* LABSIE-P01 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P01</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🎮 Gamificación Rural & Didáctica
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Estrategia didáctica mediante la gamificación en área de informática de zonas rurales
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Mecánicas lúdicas aplicadas a la superación de brechas digitales en instituciones de Córdoba (Mangones & Banquez, 2024).
                  </p>
                </div>

                {/* LABSIE-P21 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P21</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      👥 Metodología Mixta & Gemelo Digital
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Diseño de un gemelo humano digital como Laboratorio pedagógico (IE Guillermo Valencia)
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Caracterización etnográfica y modelado multi-agente para permitir a futuros docentes simular escenarios de aula secundaria.
                  </p>
                </div>

                {/* LABSIE-P22 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P22</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🌐 PLN & Traducción Intercultural
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Traductor estadístico y computacional para la lengua nativa Embera Katío del Alto Sinú
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Herramientas de Procesamiento de Lenguaje Natural para la conservación, enseñanza y revitalización de la lengua ancestral indígena.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Entornos Virtuales', 'Gamificación', 'Anclaje Cultural', 'Gemelo Digital', 'Embera Katío', 'TreeScanEdu'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Línea 3 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#10B981] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 03
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-analisis-datos-educativos').length} Proyectos Activos
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#24302F]" style={{ color: '#24302F' }}>
                  Análisis de datos educativos para la mejora de la enseñanza
                </h3>
                <p className="text-xs md:text-sm text-[#3F4E4C] leading-relaxed mt-1.5 font-normal">
                  Modelado y análisis de datos educativos masivos y de interacción para detectar dificultades a tiempo, monitorear trayectorias de aprendizaje y brindar soporte fundamentado a la toma de decisiones docentes.
                </p>
              </div>

              {/* Proyectos patrimoniales con diseño uniforme */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>

                {/* LABSIE-P03 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P03</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      📈 Cadenas de Markov & EDM
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Análisis longitudinal de patrones de compromiso mediante cadenas de Markov
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Modelos probabilísticos para analizar transiciones estocásticas de rendimiento durante la pandemia (Marchena & Medrano, 2024).
                  </p>
                </div>

                {/* LABSIE-P23 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P23</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      📊 Knowledge Tracing & Predicción Temprana
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Análisis de indicadores dinámicos de Knowledge Tracing para la predicción temprana
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Modelado cuantitativo empírico de series temporales para alertar oportunamente sobre vacíos antes de evaluaciones sumativas.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Knowledge Tracing', 'Cadenas de Markov', 'Predicción Temprana', 'Modelado Dinámico', 'EDM'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Línea 4 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#10B981] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 04
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-ia-aprendizaje-personalizado').length} Proyectos Activos
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#24302F]" style={{ color: '#24302F' }}>
                  Aplicación de la inteligencia artificial en el aprendizaje personalizado
                </h3>
                <p className="text-xs md:text-sm text-[#3F4E4C] leading-relaxed mt-1.5 font-normal">
                  Aplicación e integración de modelos de IA y tecnologías generativas en la personalización del aprendizaje, retroalimentación formativa inmediata y dinámica de agencia docente.
                </p>
              </div>
              
              {/* Proyectos patrimoniales con diseño uniforme */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>

                {/* LABSIE-P04 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P04</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🤖 Asistente STEAM & Neurocognición
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Asistente inteligente para actividades STEAM y desarrollo neurocognitivo
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Estructuración de actividades STEAM respetando las etapas cognitivas de estudiantes de primer grado (Bedoya & Alegría, 2025).
                  </p>
                </div>

                {/* LABSIE-P24 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P24</span>
                    <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold border border-[#FCD34D]">
                      🧭 Teoría Fundamentada Constructivista (Kathy Charmaz)
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Negociación del control pedagógico: Planificación educativa con inteligencia artificial generativa
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Investigación fundamentada para modelar la tensión entre delegación y autonomía al co-diseñar con IA.
                  </p>
                </div>

                {/* LABSIE-P25 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P25</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🔬 Diseño Cuasi-experimental
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Sistema de retroalimentación inteligente basado en Knowledge Tracing en Tecnología e Informática
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Evaluación cuasi-experimental con grupo control y experimental para diagnosticar vacíos y personalizar retroalimentación en tiempo real.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Teoría Fundamentada', 'Control Pedagógico', 'IA Generativa', 'Retroalimentación', 'Agencia Docente'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Nota Institucional Aclaratoria sobre Líneas vs Modalidades */}
        <div className="p-4 md:p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#A7F3D0] text-xs md:text-sm text-[#24302F] flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#059669] block mb-0.5">Clarificación Epistemológica:</strong>
            LabSIE cuenta exclusivamente con estas <strong className="text-[#059669]">cuatro líneas de investigación oficiales</strong>. Las figuras siguientes (<em>Heredar, Conectar, Trascender y Explorar</em>) no son líneas de investigación; corresponden a las <strong className="text-[#059669]">modalidades de trayectoria</strong> mediante las cuales puedes vincular tu propio perfil a los proyectos del semillero.
          </div>
        </div>
      </div>

      {/* The 4 Trajectory Modes Preview */}
      <div className="mt-16 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
            Modalidades de Recomendación
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
            Cuatro formas de vincularte con LabSIE
          </h2>
          <p className="text-sm text-[#526066] mt-2 font-medium">
            La plataforma no dictamina un destino rígido; identifica posibilidades según tu afinidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col justify-between hover:border-[#10B981] transition-all">
            <div>
              <div className="text-2xl mb-2">🧬</div>
              <h3 className="font-serif font-bold text-lg text-[#059669]">Heredar</h3>
              <p className="text-xs text-[#1C2624] mt-2 leading-relaxed font-medium">
                Continúa o profundiza una investigación existente que cuenta con datos y preguntas abiertas
                documentadas.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t-2 border-[#CCD4CF] text-xs font-bold text-[#059669]">
              Profundización científica
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col justify-between hover:border-[#10B981] transition-all">
            <div>
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-serif font-bold text-lg text-[#059669]">Conectar</h3>
              <p className="text-xs text-[#1C2624] mt-2 leading-relaxed font-medium">
                Articula dos o más proyectos del semillero en una intersección fértil (ej. analítica de datos +
                retroalimentación inteligente).
              </p>
            </div>
            <span className="mt-4 pt-3 border-t-2 border-[#CCD4CF] text-xs font-bold text-[#059669]">
              Cruce interdisciplinar
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col justify-between hover:border-[#10B981] transition-all">
            <div>
              <div className="text-2xl mb-2">🌱</div>
              <h3 className="font-serif font-bold text-lg text-[#059669]">Trascender</h3>
              <p className="text-xs text-[#1C2624] mt-2 leading-relaxed font-medium">
                Nace de la memoria investigativa del semillero pero abre una dirección totalmente nueva,
                otra población o contexto.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t-2 border-[#CCD4CF] text-xs font-bold text-[#059669]">
              Nueva propuesta situada
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col justify-between hover:border-[#10B981] transition-all">
            <div>
              <div className="text-2xl mb-2">🧭</div>
              <h3 className="font-serif font-bold text-lg text-[#059669]">Explorar</h3>
              <p className="text-xs text-[#1C2624] mt-2 leading-relaxed font-medium">
                Tus inquietudes aún no convergen con las líneas activas. No se descarta tu idea: se propone
                diálogo y maduración.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t-2 border-[#CCD4CF] text-xs font-bold text-[#059669]">
              Entrevista y diálogo formativo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
