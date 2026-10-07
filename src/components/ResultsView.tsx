import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  CheckCircle,
  ExternalLink,
  Sparkles,
  GitFork,
  ArrowRight,
  Info
} from 'lucide-react';
import { AnalysisResult, RouteType } from '../types';
import { generatePDFReport, generateDOCXReport } from '../services/documentGenerator';
import { getProjectMethodology } from '../data/projectMetadata';
import { LabSIELogo } from './LabSIELogo';

interface ResultsViewProps {
  analysis: AnalysisResult;
  onExploreHeritage: () => void;
  onRetakeTest: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  analysis,
  onExploreHeritage,
  onRetakeTest
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'docx' | null>(null);

  const handleDownloadPDF = async () => {
    try {
      setDownloadingFormat('pdf');
      await generatePDFReport(analysis, { includeAdminSection: false });
    } catch (e) {
      console.error('Error generating PDF:', e);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadDOCX = async () => {
    try {
      setDownloadingFormat('docx');
      await generateDOCXReport(analysis, { includeAdminSection: false });
    } catch (e) {
      console.error('Error generating DOCX:', e);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const getRouteBadge = (route: RouteType) => {
    switch (route) {
      case 'HEREDAR':
        return {
          icon: '🧬',
          name: 'Heredar',
          subtitle: 'Profundizar una investigación existente con memoria científica acumulada.',
          colorClass: 'text-[#059669] border-[#10B981] bg-[#ECFDF5]'
        };
      case 'CONECTAR':
        return {
          icon: '🔗',
          name: 'Conectar',
          subtitle: 'Articular dos o más investigaciones del semillero en una intersección fértil.',
          colorClass: 'text-[#065F46] border-[#059669] bg-[#ECFDF5]'
        };
      case 'TRASCENDER':
        return {
          icon: '🌱',
          name: 'Trascender',
          subtitle: 'Apertura de una dirección novedosa inspirada en las raíces del semillero.',
          colorClass: 'text-[#C79A52] border-[#C79A52] bg-[#C79A52]/10'
        };
      case 'EXPLORAR':
      default:
        return {
          icon: '🧭',
          name: 'Explorar',
          subtitle: 'Diálogo con la coordinación para delimitar o buscar nueva línea.',
          colorClass: 'text-[#6F7976] border-[#6F7976] bg-[#6F7976]/10'
        };
    }
  };

  const routeInfo = getRouteBadge(analysis.routeType);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14 space-y-10">
      {/* Header and Archetype */}
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#CCD4CF] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <LabSIELogo size="sm" className="shrink-0" />
              <div className="border-l-2 border-[#CCD4CF] pl-3">
                <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider block">
                  Informe Oficial de Orientación Investigativa
                </span>
                <span className="text-xs text-[#1C2624] font-medium">
                  Estudiante: <strong className="text-[#059669]">{analysis.studentProfile.name}</strong>
                </span>
              </div>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1C2624] mt-2" style={{ color: '#1C2624' }}>
              Tu ruta investigativa sugerida
            </h1>
            <p className="text-sm font-semibold text-[#1C2624]">
              {analysis.studentProfile.program} · Semestre {analysis.studentProfile.semester}
            </p>
          </div>

          {/* Action Download Buttons with high contrast */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingFormat !== null}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold rounded-xl bg-[#268E6C] text-[#FFFDF9] hover:bg-[#1E785B] transition-all shadow-sm border-2 border-[#268E6C] disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#FFFDF9]" />
              <span>{downloadingFormat === 'pdf' ? 'Generando PDF...' : 'Descargar PDF'}</span>
            </button>

            <button
              onClick={handleDownloadDOCX}
              disabled={downloadingFormat !== null}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold rounded-xl border-2 border-[#268E6C] bg-[#FFFDF9] text-[#1C2624] hover:bg-[#F2FAF6] transition-all shadow-sm disabled:opacity-50"
              style={{ color: '#1C2624' }}
            >
              <FileText className="w-4 h-4 text-[#268E6C]" />
              <span style={{ color: '#1C2624' }}>{downloadingFormat === 'docx' ? 'Generando DOCX...' : 'DOCX Editable'}</span>
            </button>
          </div>
        </div>

        {/* Descriptive Profile Archetype (Not a rigid label) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
              Arquetipo Investigativo Orientativo
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#059669]">
              {analysis.profileArchetype}
            </h2>
            <p className="text-xs md:text-sm text-[#1C2624] leading-relaxed font-normal">
              Este perfil es orientativo y se construye a partir de tus respuestas y preferencias de aproximación a problemas. No es una clasificación diagnóstica rígida ni una restricción para tu vocación.
            </p>
          </div>

          {/* Correspondence Score Meter */}
          <div className="p-4 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] text-center space-y-1 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#059669] font-bold">
              Índice de Correspondencia
            </span>
            <div className="text-3xl font-serif font-bold text-[#059669]">
              {analysis.correspondenceScore}
              <span className="text-base text-[#1C2624] font-semibold"> / 100</span>
            </div>
            <span className="text-xs font-bold text-[#059669]">
              {analysis.correspondenceLevel}
            </span>
          </div>
        </div>

        {/* Ejes temáticos de afinidad */}
        <div className="pt-4 border-t border-[#DDE2DE]">
          <span className="text-xs uppercase tracking-wider text-[#059669] font-bold block mb-3">
            Afinidad por Ejes Temáticos del Semillero
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(analysis.interestPercentages).map(([topic, pct]) => (
              <div key={topic} className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF]">
                <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                  <span className="text-[#24302F] truncate pr-2">{topic}</span>
                  <span className="text-[#059669] tabular-nums">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#E5E9E7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Trajectory Card (RUTA) */}
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
              Modalidad de Trayectoria Identificada
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl">{routeInfo.icon}</span>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F]">
                  Ruta {routeInfo.name}
                </h2>
                <p className="text-xs text-[#3F4E4C] font-medium">{routeInfo.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-[#526066] block font-medium">Línea sugerida:</span>
            <span className="font-bold text-xs md:text-sm text-[#059669]">
              {analysis.primaryLineName}
            </span>
          </div>
        </div>

        {/* Explicación "¿Por qué el sistema sugiere esto?" */}
        <div className="space-y-3 pt-4 border-t border-[#DDE2DE]">
          <h3 className="font-serif text-lg font-bold text-[#059669]">
            ¿Por qué surge esta recomendación?
          </h3>
          <div className="space-y-3 text-xs md:text-sm text-[#24302F] leading-relaxed font-normal">
            {analysis.whyExplanation.map((parr, pIdx) => (
              <p key={pIdx}>{parr}</p>
            ))}
          </div>
        </div>

        {/* Trazabilidad transparente */}
        <div className="p-4 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDE2DE] pb-2">
            <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px] block">
              Trazabilidad del análisis
            </span>
            {analysis.studentAnswers.continuationPreference && (
              <span className="font-medium text-[#059669]">
                Preferencia de continuidad declarada: <span className="font-bold">{analysis.studentAnswers.continuationPreference}</span>
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#6F7976] pt-1">
            <div>
              <span className="font-medium text-[#24302F]">Intereses coincidentes: </span>
              {analysis.whyBreakdown.matchingInterests.join(', ')}.
            </div>
            <div>
              <span className="font-medium text-[#24302F]">Formas de aproximación: </span>
              {analysis.whyBreakdown.matchingWays.join(', ')}.
            </div>
            <div>
              <span className="font-medium text-[#24302F]">Conceptos afines: </span>
              {analysis.whyBreakdown.relatedConcepts.join(', ')}.
            </div>
            <div>
              <span className="font-medium text-[#24302F]">Proyectos explorados: </span>
              {analysis.whyBreakdown.selectedProjectsCount} seleccionados en el test.
            </div>
          </div>
          {(analysis.studentAnswers.problemToInvestigate || analysis.studentAnswers.studentResearchIdea) && (
            <div className="pt-2 border-t border-[#DDE2DE] text-[#24302F]">
              <span className="font-semibold text-[#059669]">Tu problema de interés: </span>
              <span className="italic font-serif">
                "{analysis.studentAnswers.problemToInvestigate || analysis.studentAnswers.studentResearchIdea}"
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Related Projects (Up to 3) */}
      <div className="space-y-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
            Memoria Científica
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1C2624] mt-1">
            Investigaciones de LabSIE Relacionadas
          </h2>
          <p className="text-xs md:text-sm text-[#3F4E4C] mt-1 font-medium">
            Proyectos que presentan correspondencia directa con tus respuestas y sustentan esta ruta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {analysis.relatedProjects.map((rp, rIdx) => {
            const methInfo = getProjectMethodology(rp.projectId);
            return (
              <div
                key={rp.projectId}
                className="bg-[#FFFDF9] border-2 border-[#CCD4CF] hover:border-[#10B981] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                      {rp.projectCode}
                    </span>
                    <span className="font-bold text-[#059669] tabular-nums">{rp.affinity}% afinidad</span>
                  </div>

                  {/* Insignia Metodológica Oficial para todos los proyectos */}
                  <div className="pt-0.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${methInfo.themeColor.bg} ${methInfo.themeColor.text} text-[10px] font-bold border ${methInfo.themeColor.border}`}>
                      <span>{methInfo.badgeIcon} {methInfo.badgeTitle.replace('Metodología: ', '')}</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#1C2624] leading-snug">
                    {rp.projectTitle}
                  </h3>

                  <p className="text-xs text-[#24302F] leading-relaxed font-normal">
                    {rp.connectionReason}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-[#CCD4CF] text-[11px] text-[#059669]">
                  <span className="font-bold">Conceptos: {rp.matchingConcepts.join(' · ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POSIBLE PROYECTO (PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN) */}
      <div className="bg-[#FFFDF9] border-2 border-[#10B981] rounded-2xl p-6 md:p-10 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#CCD4CF] pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
              Una Posibilidad para Explorar
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1C2624] mt-1">
              Propuesta Preliminar de Investigación
            </h2>
          </div>

          <span className="self-start sm:self-center text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FEF3C7] text-[#92400E] border-2 border-[#FCD34D] uppercase tracking-wide">
            {analysis.proposedProject.statusLabel}
          </span>
        </div>

        {/* Tentative Title & Question */}
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#059669] font-bold block mb-1">
              Título Tentativo:
            </span>
            <p className="font-serif text-lg md:text-xl font-bold text-[#059669] leading-snug">
              {analysis.proposedProject.tentativeTitle}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-2">
            <div>
              <span className="font-bold text-xs text-[#1C2624] block">
                Pregunta de Investigación Tentativa:
              </span>
              <p className="text-xs md:text-sm text-[#065F46] italic font-serif font-semibold">
                "{analysis.proposedProject.tentativeQuestion}"
              </p>
            </div>

            <div className="pt-2 border-t border-[#CCD4CF]">
              <span className="font-bold text-xs text-[#1C2624] block">
                Objetivo General Tentativo:
              </span>
              <p className="text-xs md:text-sm text-[#1C2624] font-medium">
                {analysis.proposedProject.tentativeObjective}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm pt-2">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF]">
              <span className="font-bold text-[#059669] block mb-1">Conceptos Centrales:</span>
              <p className="text-[#1C2624] font-medium">
                {analysis.proposedProject.centralConcepts.join(' · ')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF]">
              <span className="font-bold text-[#059669] block mb-1">Población / Contexto Sugerido:</span>
              <p className="text-[#1C2624] font-medium">
                {analysis.proposedProject.possibleContextPopulation}
              </p>
            </div>

            <div className="md:col-span-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF]">
              <span className="font-bold text-[#059669] block mb-1">Posible Aporte al Semillero:</span>
              <p className="text-[#1C2624] leading-relaxed font-normal">
                {analysis.proposedProject.possibleContribution}
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="pt-4 border-t-2 border-[#CCD4CF] space-y-2">
            <span className="font-bold text-xs text-[#059669] uppercase tracking-wider block">
              Próximos pasos recomendados:
            </span>
            <ul className="space-y-1.5 text-xs text-[#1C2624]">
              {analysis.proposedProject.nextSteps.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimers & Next Actions */}
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-6 text-xs text-[#1C2624] space-y-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-[#1C2624]">Nota del Semillero LabSIE:</span> El presente
            resultado no constituye la aprobación automática ni la asignación obligatoria de un proyecto.
            El administrador y comité docente serán quienes evalúen formalmente la pertinencia, asignen el
            tutor responsable o coordinen una entrevista de profundización.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-[#CCD4CF]">
          <button
            onClick={onRetakeTest}
            className="cursor-pointer text-xs font-bold text-[#1C2624] hover:text-[#059669] transition-colors"
          >
            ← Volver a realizar el test
          </button>

          <button
            onClick={onExploreHeritage}
            className="cursor-pointer text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors"
          >
            Explorar todas las fichas del patrimonio LabSIE →
          </button>
        </div>
      </div>
    </div>
  );
};
