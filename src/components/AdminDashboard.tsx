import React, { useState } from 'react';
import {
  Users,
  Compass,
  BookOpen,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Download,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Save,
  AlertTriangle
} from 'lucide-react';
import {
  AnalysisResult,
  ResearchProject,
  ResearchLine,
  ReviewStatus,
  AdminDecision,
  AdminReview
} from '../types';
import { storageService } from '../services/storageService';
import { generatePDFReport, generateDOCXReport } from '../services/documentGenerator';
import { getProjectMethodology } from '../data/projectMetadata';
import { AdminProjectModal } from './AdminProjectModal';
import { AdminLineModal } from './AdminLineModal';
import { LabSIELogo } from './LabSIELogo';

interface AdminDashboardProps {
  analyses: AnalysisResult[];
  projects: ResearchProject[];
  lines: ResearchLine[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analyses,
  projects,
  lines,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'panorama' | 'estudiantes' | 'proyectos' | 'lineas'>('panorama');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

  // Filters for Students Table
  const [searchStudent, setSearchStudent] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRoute, setFilterRoute] = useState<string>('all');

  // Modal States
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ResearchProject | null>(null);

  const [lineModalOpen, setLineModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<ResearchLine | null>(null);

  // Review Form inside Student Detail
  const [reviewForm, setReviewForm] = useState<AdminReview>({
    id: '',
    status: 'PENDING',
    decision: 'VINCULAR_PROYECTO',
    assignedLineId: '',
    assignedProjectId: '',
    assignedTutor: '',
    priority: 'MEDIA',
    adminComments: '',
    reviewedAt: '',
    reviewedBy: 'Coordinación LabSIE'
  });

  const [isSavingReview, setIsSavingReview] = useState(false);

  // Update Review Form when selecting a student
  const handleSelectStudent = (analysis: AnalysisResult) => {
    setSelectedAnalysis(analysis);
    if (analysis.adminReview) {
      setReviewForm({ ...analysis.adminReview });
    } else {
      setReviewForm({
        id: `rev-${Date.now()}`,
        status: 'PENDING',
        decision:
          analysis.routeType === 'HEREDAR'
            ? 'VINCULAR_PROYECTO'
            : analysis.routeType === 'CONECTAR'
            ? 'VINCULAR_LINEA'
            : analysis.routeType === 'TRASCENDER'
            ? 'NUEVA_PROPUESTA'
            : 'REQUIERE_ENTREVISTA',
        assignedLineId: analysis.primaryLineId || lines[0]?.id || '',
        assignedProjectId: analysis.relatedProjects[0]?.projectId || projects[0]?.id || '',
        assignedTutor: 'Dr. Coordinador LabSIE',
        priority: 'MEDIA',
        adminComments: '',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Coordinación LabSIE'
      });
    }
  };

  const handleSaveReview = () => {
    if (!selectedAnalysis) return;
    setIsSavingReview(true);
    const updatedReview: AdminReview = {
      ...reviewForm,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'Coordinación LabSIE / EduTLAN'
    };
    storageService.updateAdminReview(selectedAnalysis.id, updatedReview);
    setSelectedAnalysis({ ...selectedAnalysis, adminReview: updatedReview });
    setIsSavingReview(false);
    onRefreshData();
  };

  // Status mapping
  const getStatusBadge = (status?: ReviewStatus) => {
    switch (status) {
      case 'PERTINENT':
        return { label: 'Pertinente', color: 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]' };
      case 'IN_ANALYSIS':
        return { label: 'En análisis', color: 'text-[#059669] bg-[#ECFDF5] border-[#10B981]/30' };
      case 'NEW_PROPOSAL':
        return { label: 'Nueva propuesta', color: 'text-[#854D92] bg-[#854D92]/10 border-[#854D92]/30' };
      case 'NEEDS_INTERVIEW':
        return { label: 'Requiere entrevista', color: 'text-[#C38B4A] bg-[#C38B4A]/10 border-[#C38B4A]/30' };
      case 'NO_CORRESPONDENCE':
        return { label: 'Sin correspondencia', color: 'text-[#B65C5C] bg-[#B65C5C]/10 border-[#B65C5C]/30' };
      case 'PENDING':
      default:
        return { label: 'Pendiente de revisión', color: 'text-[#C79A52] bg-[#C79A52]/10 border-[#C79A52]/30' };
    }
  };

  // Metrics calculation
  const totalEvaluated = analyses.length;
  const highCorrespondenceCount = analyses.filter(a => a.correspondenceScore >= 80).length;
  const exploratoryCount = analyses.filter(a => a.correspondenceScore >= 40 && a.correspondenceScore < 60).length;
  const newProposalsCount = analyses.filter(a => a.routeType === 'TRASCENDER').length;
  const noCorrespondenceCount = analyses.filter(a => a.routeType === 'EXPLORAR').length;
  const pendingReviewCount = analyses.filter(a => !a.adminReview || a.adminReview.status === 'PENDING').length;

  // Route breakdown
  const routeCounts = {
    HEREDAR: analyses.filter(a => a.routeType === 'HEREDAR').length,
    CONECTAR: analyses.filter(a => a.routeType === 'CONECTAR').length,
    TRASCENDER: analyses.filter(a => a.routeType === 'TRASCENDER').length,
    EXPLORAR: analyses.filter(a => a.routeType === 'EXPLORAR').length
  };

  // Filtered students list
  const filteredStudents = analyses.filter(a => {
    const q = searchStudent.toLowerCase();
    const matchesQuery =
      !q ||
      a.studentProfile.name.toLowerCase().includes(q) ||
      a.studentProfile.email.toLowerCase().includes(q) ||
      a.studentProfile.program.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === 'all' ||
      (a.adminReview ? a.adminReview.status === filterStatus : filterStatus === 'PENDING');

    const matchesRoute = filterRoute === 'all' || a.routeType === filterRoute;

    return matchesQuery && matchesStatus && matchesRoute;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE2DE] pb-6">
        <div className="flex items-center gap-4">
          <LabSIELogo size="sm" className="shrink-0" />
          <div className="border-l border-[#DDE2DE] pl-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#059669] uppercase tracking-wider">
              <span>Coordinación Semillero</span>
              <span aria-hidden="true">·</span>
              <span>Grupo EduTLAN</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F] mt-0.5" style={{ color: '#24302F' }}>
              Panel de Orientación Investigativa
            </h1>
            <p className="text-xs md:text-sm text-[#6F7976]">
              Monitoreo, análisis de correspondencia y validación de vinculación científica.
            </p>
          </div>
        </div>

        {/* Tab Navigation with clear contrast */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-xl self-start md:self-auto overflow-x-auto shadow-xs">
          <button
            onClick={() => {
              setActiveTab('panorama');
              setSelectedAnalysis(null);
            }}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'panorama' && !selectedAnalysis
                ? 'bg-[#10B981] text-[#FFFDF9] shadow-xs'
                : 'text-[#24302F] hover:bg-[#ECFDF5]'
            }`}
          >
            Panorama
          </button>
          <button
            onClick={() => {
              setActiveTab('estudiantes');
              setSelectedAnalysis(null);
            }}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'estudiantes' && !selectedAnalysis
                ? 'bg-[#10B981] text-[#FFFDF9] shadow-xs'
                : 'text-[#24302F] hover:bg-[#ECFDF5]'
            }`}
          >
            Estudiantes ({analyses.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('proyectos');
              setSelectedAnalysis(null);
            }}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'proyectos'
                ? 'bg-[#10B981] text-[#FFFDF9] shadow-xs'
                : 'text-[#24302F] hover:bg-[#ECFDF5]'
            }`}
          >
            Proyectos ({projects.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('lineas');
              setSelectedAnalysis(null);
            }}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'lineas'
                ? 'bg-[#10B981] text-[#FFFDF9] shadow-xs'
                : 'text-[#24302F] hover:bg-[#ECFDF5]'
            }`}
          >
            Líneas ({lines.length})
          </button>
        </div>
      </div>

      {/* DETAIL VIEW: When a student is selected */}
      {selectedAnalysis ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedAnalysis(null)}
            className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la lista de estudiantes</span>
          </button>

          {/* Student Detailed Dossier */}
          <div className="bg-[#FFFDF9] border border-[#DDE2DE] rounded-2xl p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE2DE] pb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#6F7976] font-semibold">
                  Dossier de Evaluación #{selectedAnalysis.id}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#24302F] mt-1">
                  {selectedAnalysis.studentProfile.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6F7976] mt-1">
                  <span>{selectedAnalysis.studentProfile.program}</span>
                  <span aria-hidden="true">·</span>
                  <span>Semestre {selectedAnalysis.studentProfile.semester}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedAnalysis.studentProfile.email}</span>
                </div>
              </div>

              {/* Download Reports with Admin Section */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generatePDFReport(selectedAnalysis, { includeAdminSection: true })}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#10B981] text-[#FFFDF9] hover:bg-[#059669] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Informe Admin PDF</span>
                </button>
                <button
                  onClick={() => generateDOCXReport(selectedAnalysis, { includeAdminSection: true })}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#DDE2DE] bg-[#F7F3ED] text-[#24302F] hover:bg-[#ECFDF5] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Informe Admin DOCX</span>
                </button>
              </div>
            </div>

            {/* 10 Structured Sections as required by the prompt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
              {/* 01 PERFIL */}
              <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-2">
                <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px] block">
                  01. Perfil Investigativo
                </span>
                <p className="font-serif font-bold text-[#24302F]">
                  {selectedAnalysis.profileArchetype}
                </p>
                <p className="text-[#3F4E4C] font-medium">
                  Afinidad: {selectedAnalysis.correspondenceScore}/100 ({selectedAnalysis.correspondenceLevel}).
                </p>
                <div className="pt-2 text-[11px] text-[#3F4E4C] space-y-0.5">
                  <p>Investigación previa: {selectedAnalysis.studentProfile.researchExperience}</p>
                  <p>Experiencia técnica: {selectedAnalysis.studentProfile.techExperience}</p>
                  <p>Familiaridad IA: {selectedAnalysis.studentProfile.aiExperience}</p>
                </div>
              </div>

              {/* 02 & 03 INTERESES Y FORMAS */}
              <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-2">
                <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px] block">
                  02 & 03. Curiosidades y Métodos
                </span>
                <div>
                  <span className="font-medium text-[#24302F]">Curiosidades:</span>
                  <p className="text-[#3F4E4C] mt-0.5 font-medium">
                    {selectedAnalysis.whyBreakdown.matchingInterests.join(', ')}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="font-medium text-[#24302F]">Formas preferidas:</span>
                  <p className="text-[#3F4E4C] mt-0.5 font-medium">
                    {selectedAnalysis.dominantResearchWays.join(', ')}
                  </p>
                </div>
              </div>

              {/* 04 IDEA PROPIA Y PREGUNTAS CLAVE */}
              <div className="md:col-span-2 p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-3">
                <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px] block">
                  04. Ideas Propias y Respuestas Clave del Estudiante
                </span>
                <div>
                  <span className="font-medium text-[#24302F]">Problema a investigar:</span>
                  <p className="text-[#24302F] italic leading-relaxed font-serif mt-0.5">
                    "{selectedAnalysis.studentAnswers.problemToInvestigate || selectedAnalysis.studentAnswers.studentResearchIdea || 'No especificada.'}"
                  </p>
                </div>

                {selectedAnalysis.studentAnswers.dreamResearch && (
                  <div>
                    <span className="font-medium text-[#24302F]">Investigación que siempre ha querido realizar:</span>
                    <p className="text-[#6F7976] mt-0.5">
                      "{selectedAnalysis.studentAnswers.dreamResearch}"
                    </p>
                  </div>
                )}

                {selectedAnalysis.studentAnswers.sixMonthsDiscovery && (
                  <div>
                    <span className="font-medium text-[#24302F]">Meta a seis meses:</span>
                    <p className="text-[#6F7976] mt-0.5">
                      "{selectedAnalysis.studentAnswers.sixMonthsDiscovery}"
                    </p>
                  </div>
                )}

                {selectedAnalysis.studentAnswers.divergentProjectIdea && (
                  <div>
                    <span className="font-medium text-[#24302F]">Idea divergente a partir de LabSIE:</span>
                    <p className="text-[#6F7976] mt-0.5">
                      "{selectedAnalysis.studentAnswers.divergentProjectIdea}"
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#DDE2DE]">
                  <div>
                    <span className="font-medium text-[#24302F]">Preferencia de continuidad declarada:</span>
                    <p className="text-[#059669] font-bold mt-0.5">
                      {selectedAnalysis.studentAnswers.continuationPreference || 'No declarada'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-[#24302F]">Expectativas en LabSIE:</span>
                    <p className="text-[#6F7976] mt-0.5">
                      {selectedAnalysis.studentAnswers.labsieExpectations?.join(', ') || 'No especificadas'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 05 PROYECTOS RELACIONADOS */}
              <div className="md:col-span-2 p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-3">
                <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px] block">
                  05. Proyectos LabSIE Relacionados
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedAnalysis.relatedProjects.map(rp => (
                    <div key={rp.projectId} className="p-3 rounded-lg bg-[#FFFDF9] border border-[#CCD4CF] text-xs">
                      <div className="flex justify-between font-semibold text-[#059669] mb-1">
                        <span>{rp.projectCode}</span>
                        <span className="tabular-nums">{rp.affinity}%</span>
                      </div>
                      <p className="font-medium text-[#24302F] truncate">{rp.projectTitle}</p>
                      <p className="text-[#3F4E4C] text-[11px] mt-1 line-clamp-2">{rp.connectionReason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 06 & 07 ANÁLISIS AUTOMÁTICO Y RUTA */}
              <div className="md:col-span-2 p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px]">
                    06 & 07. Análisis de Correspondencia y Ruta
                  </span>
                  <span className="font-bold text-xs px-2.5 py-1 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                    Ruta: {selectedAnalysis.routeType}
                  </span>
                </div>
                <div className="space-y-2 text-[#24302F] leading-relaxed text-xs">
                  {selectedAnalysis.whyExplanation.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* 08 POSIBLE PROYECTO */}
              <div className="md:col-span-2 p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-2">
                <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px] block">
                  08. Posible Proyecto Preliminar
                </span>
                <p className="font-serif font-bold text-sm text-[#24302F]">
                  {selectedAnalysis.proposedProject.tentativeTitle}
                </p>
                <p className="text-xs text-[#065F46] italic">
                  Pregunta: "{selectedAnalysis.proposedProject.tentativeQuestion}"
                </p>
                <p className="text-xs text-[#3F4E4C]">
                  Objetivo: {selectedAnalysis.proposedProject.tentativeObjective}
                </p>
              </div>
            </div>

            {/* SECTIONS 09 & 10: DECISIÓN ADMINISTRATIVA Y OBSERVACIONES */}
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#10B981]/40 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#DDE2DE] pb-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                    09 & 10. Validación y Decisión Administrativa
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#24302F]">
                    Resolución Institucional de la Coordinación
                  </h3>
                </div>
                <span className="text-xs text-[#6F7976]">
                  Solo el administrador define la vinculación final
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
                <div className="space-y-1">
                  <label className="font-semibold text-[#24302F]">Decisión Institucional:</label>
                  <select
                    value={reviewForm.decision}
                    onChange={e => setReviewForm({ ...reviewForm, decision: e.target.value as AdminDecision })}
                    className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
                  >
                    <option value="VINCULAR_PROYECTO">Vincular a proyecto existente</option>
                    <option value="VINCULAR_LINEA">Vincular a una línea de investigación</option>
                    <option value="NUEVA_PROPUESTA">Desarrollar nueva propuesta</option>
                    <option value="REQUIERE_ENTREVISTA">Requiere entrevista</option>
                    <option value="EXPLORACION_ADICIONAL">Requiere exploración adicional</option>
                    <option value="SIN_CORRESPONDENCIA">No existe correspondencia actualmente</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#24302F]">Estado de la Revisión:</label>
                  <select
                    value={reviewForm.status}
                    onChange={e => setReviewForm({ ...reviewForm, status: e.target.value as ReviewStatus })}
                    className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
                  >
                    <option value="PENDING">🟡 Pendiente de revisión</option>
                    <option value="IN_ANALYSIS">🔵 En análisis</option>
                    <option value="PERTINENT">🟢 Pertinente</option>
                    <option value="NEW_PROPOSAL">🟣 Nueva propuesta</option>
                    <option value="NEEDS_INTERVIEW">🟠 Requiere entrevista</option>
                    <option value="NO_CORRESPONDENCE">🔴 Sin correspondencia</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#24302F]">Prioridad:</label>
                  <select
                    value={reviewForm.priority}
                    onChange={e => setReviewForm({ ...reviewForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#24302F]">Línea de investigación asignada:</label>
                  <select
                    value={reviewForm.assignedLineId}
                    onChange={e => setReviewForm({ ...reviewForm, assignedLineId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
                  >
                    {lines.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#24302F]">Proyecto asignado (opcional):</label>
                  <select
                    value={reviewForm.assignedProjectId}
                    onChange={e => setReviewForm({ ...reviewForm, assignedProjectId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
                  >
                    <option value="">Ninguno / Nueva propuesta</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.code}] {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#24302F]">Tutor / Investigador responsable:</label>
                  <input
                    type="text"
                    value={reviewForm.assignedTutor}
                    onChange={e => setReviewForm({ ...reviewForm, assignedTutor: e.target.value })}
                    placeholder="Ej. Dr. Líder EduTLAN"
                    className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
                  />
                </div>

                <div className="md:col-span-3 space-y-1">
                  <label className="font-semibold text-[#24302F]">
                    Observaciones y conceptos del administrador:
                  </label>
                  <textarea
                    rows={3}
                    value={reviewForm.adminComments}
                    onChange={e => setReviewForm({ ...reviewForm, adminComments: e.target.value })}
                    placeholder="Dictamen técnico, orientaciones para la entrevista o precisiones sobre el anteproyecto..."
                    className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DDE2DE]">
                <button
                  type="button"
                  onClick={handleSaveReview}
                  disabled={isSavingReview}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10B981] text-[#FFFDF9] text-xs md:text-sm font-bold hover:bg-[#059669] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingReview ? 'Guardando...' : 'Guardar Decisión Administrativa'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* PANORAMA TAB */}
      {!selectedAnalysis && activeTab === 'panorama' && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-xs">
              <span className="text-[11px] font-bold text-[#1C2624] uppercase">Evaluados</span>
              <p className="text-2xl font-serif font-bold text-[#059669] mt-1 tabular-nums">{totalEvaluated}</p>
              <span className="text-[10px] text-[#3F4E4C] font-semibold">Perfiles totales</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-xs">
              <span className="text-[11px] font-bold text-[#059669] uppercase">Alta Correspondencia</span>
              <p className="text-2xl font-serif font-bold text-[#059669] mt-1 tabular-nums">{highCorrespondenceCount}</p>
              <span className="text-[10px] text-[#3F4E4C] font-semibold">&ge; 80 puntos</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-xs">
              <span className="text-[11px] font-bold text-[#10B981] uppercase">Exploratoria</span>
              <p className="text-2xl font-serif font-bold text-[#10B981] mt-1 tabular-nums">{exploratoryCount}</p>
              <span className="text-[10px] text-[#3F4E4C] font-semibold">40-59 puntos</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-xs">
              <span className="text-[11px] font-bold text-[#854D92] uppercase">Nuevas Propuestas</span>
              <p className="text-2xl font-serif font-bold text-[#854D92] mt-1 tabular-nums">{newProposalsCount}</p>
              <span className="text-[10px] text-[#3F4E4C] font-semibold">Ruta Trascender</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-xs">
              <span className="text-[11px] font-bold text-[#B65C5C] uppercase">Sin Correspondencia</span>
              <p className="text-2xl font-serif font-bold text-[#B65C5C] mt-1 tabular-nums">{noCorrespondenceCount}</p>
              <span className="text-[10px] text-[#3F4E4C] font-semibold">Ruta Explorar</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-xs">
              <span className="text-[11px] font-bold text-[#C79A52] uppercase">Pendientes</span>
              <p className="text-2xl font-serif font-bold text-[#C79A52] mt-1 tabular-nums">{pendingReviewCount}</p>
              <span className="text-[10px] text-[#3F4E4C] font-semibold">Por revisar</span>
            </div>
          </div>

          {/* Gráfico / Distribución de Rutas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] space-y-4 shadow-sm">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                  Distribución de Rutas
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1C2624] mt-0.5">
                  Trayectorias Sugeridas en el Semillero
                </h3>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-[#24302F]">🧬 Heredar (Profundización)</span>
                    <span className="tabular-nums font-bold text-[#059669]">
                      {routeCounts.HEREDAR} ({Math.round((routeCounts.HEREDAR / Math.max(1, totalEvaluated)) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F7F3ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10B981]"
                      style={{ width: `${(routeCounts.HEREDAR / Math.max(1, totalEvaluated)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-[#24302F]">🔗 Conectar (Intersección)</span>
                    <span className="tabular-nums font-bold text-[#065F46]">
                      {routeCounts.CONECTAR} ({Math.round((routeCounts.CONECTAR / Math.max(1, totalEvaluated)) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F7F3ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#059669]"
                      style={{ width: `${(routeCounts.CONECTAR / Math.max(1, totalEvaluated)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-[#24302F]">🌱 Trascender (Nueva vertiente)</span>
                    <span className="tabular-nums font-bold text-[#C79A52]">
                      {routeCounts.TRASCENDER} ({Math.round((routeCounts.TRASCENDER / Math.max(1, totalEvaluated)) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F7F3ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C79A52]"
                      style={{ width: `${(routeCounts.TRASCENDER / Math.max(1, totalEvaluated)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-[#24302F]">🧭 Explorar (Diálogo previo)</span>
                    <span className="tabular-nums font-bold text-[#6F7976]">
                      {routeCounts.EXPLORAR} ({Math.round((routeCounts.EXPLORAR / Math.max(1, totalEvaluated)) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F7F3ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6F7976]"
                      style={{ width: `${(routeCounts.EXPLORAR / Math.max(1, totalEvaluated)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Recent Evaluations */}
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#DDE2DE] flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#6F7976] font-semibold">
                  Orientación Rápida
                </span>
                <h3 className="font-serif text-lg font-bold text-[#24302F] mt-0.5">
                  Últimos Estudiantes Evaluados
                </h3>

                <div className="divide-y divide-[#DDE2DE] mt-3">
                  {analyses.slice(0, 3).map(a => (
                    <div
                      key={a.id}
                      onClick={() => handleSelectStudent(a)}
                      className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#F7F3ED] px-2 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#24302F]">{a.studentProfile.name}</p>
                        <p className="text-[11px] text-[#6F7976]">
                          {a.studentProfile.program} · Ruta {a.routeType}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6F7976]" />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('estudiantes')}
                className="mt-4 w-full py-2 rounded-lg border border-[#DDE2DE] text-xs font-semibold text-[#059669] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
              >
                Ver todos los estudiantes ({analyses.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ESTUDIANTES TAB */}
      {!selectedAnalysis && activeTab === 'estudiantes' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-[#FFFDF9] p-4 rounded-xl border-2 border-[#CCD4CF] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#059669] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar estudiante por nombre, correo, programa..."
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-lg text-[#1C2624] font-medium placeholder-[#526066] focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#1C2624]">Estado:</span>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="text-xs bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-lg px-2.5 py-1.5 font-semibold text-[#1C2624] focus:outline-none focus:border-[#10B981]"
                >
                  <option value="all">Todos los estados</option>
                  <option value="PENDING">Pendiente de revisión</option>
                  <option value="IN_ANALYSIS">En análisis</option>
                  <option value="PERTINENT">Pertinente</option>
                  <option value="NEW_PROPOSAL">Nueva propuesta</option>
                  <option value="NEEDS_INTERVIEW">Requiere entrevista</option>
                  <option value="NO_CORRESPONDENCE">Sin correspondencia</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#1C2624]">Ruta:</span>
                <select
                  value={filterRoute}
                  onChange={e => setFilterRoute(e.target.value)}
                  className="text-xs bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-lg px-2.5 py-1.5 font-semibold text-[#1C2624] focus:outline-none focus:border-[#10B981]"
                >
                  <option value="all">Todas las rutas</option>
                  <option value="HEREDAR">Heredar</option>
                  <option value="CONECTAR">Conectar</option>
                  <option value="TRASCENDER">Trascender</option>
                  <option value="EXPLORAR">Explorar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead className="bg-[#FAF8F5] border-b-2 border-[#CCD4CF] text-[#1C2624] font-bold">
                  <tr>
                    <th className="py-3 px-4">Estudiante</th>
                    <th className="py-3 px-4">Programa / Sem.</th>
                    <th className="py-3 px-4">Ruta</th>
                    <th className="py-3 px-4">Afinidad</th>
                    <th className="py-3 px-4">Línea Principal</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#CCD4CF]">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-[#1C2624] font-medium">
                        No se encontraron estudiantes con los filtros especificados.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(a => {
                      const statusBadge = getStatusBadge(a.adminReview?.status);
                      return (
                        <tr key={a.id} className="hover:bg-[#F7F3ED] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#1C2624]">
                            <div>{a.studentProfile.name}</div>
                            <div className="text-[11px] text-[#3F4E4C] font-normal">{a.studentProfile.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#1C2624] font-medium">
                            <div>{a.studentProfile.program}</div>
                            <div className="text-[11px] text-[#059669] font-bold">Semestre {a.studentProfile.semester}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#059669]">
                            {a.routeType}
                          </td>
                          <td className="py-3.5 px-4 font-bold tabular-nums text-[#1C2624]">
                            {a.correspondenceScore}%
                          </td>
                          <td className="py-3.5 px-4 text-[#1C2624] font-medium max-w-[180px] truncate">
                            {a.primaryLineName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${statusBadge.color}`}
                            >
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleSelectStudent(a)}
                              className="cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg bg-[#10B981] text-[#FFFDF9] hover:bg-[#059669] transition-colors shadow-xs"
                            >
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PROYECTOS TAB (CRUD) */}
      {!selectedAnalysis && activeTab === 'proyectos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#24302F]">
                Gestión del Patrimonio Científico ({projects.length})
              </h2>
              <p className="text-xs text-[#6F7976]">
                Cualquier nuevo proyecto se incorpora automáticamente al motor de recomendación.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProject(null);
                setProjectModalOpen(true);
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] text-[#FFFDF9] text-xs font-bold hover:bg-[#059669] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Proyecto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => {
              const methInfo = getProjectMethodology(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-[#FFFDF9] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-all rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                        {p.code}
                      </span>
                      <span className="text-[11px] font-bold text-[#1C2624]">{p.lineName}</span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#1C2624] leading-snug">{p.title}</h3>
                    
                    {/* Insignia metodológica para todos los proyectos */}
                    <div className="mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${methInfo.themeColor.bg} ${methInfo.themeColor.text} ${methInfo.themeColor.border}`}>
                        {methInfo.badgeIcon} {methInfo.badgeTitle.replace('Metodología: ', '')}
                      </span>
                    </div>

                    <p className="text-xs text-[#24302F] mt-2 line-clamp-2 font-normal">{p.problem}</p>
                  </div>

                  <div className="pt-3 border-t-2 border-[#CCD4CF] flex items-center justify-between text-xs">
                    <span className="text-[#059669] font-bold uppercase tracking-wider text-[11px]">{p.status}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(p);
                          setProjectModalOpen(true);
                        }}
                        className="cursor-pointer p-1.5 text-[#1C2624] hover:text-[#059669] rounded hover:bg-[#F7F3ED]"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar proyecto ${p.code}?`)) {
                            storageService.deleteProject(p.id);
                            onRefreshData();
                          }
                        }}
                        className="cursor-pointer p-1.5 text-[#B65C5C] hover:text-red-700 rounded hover:bg-[#F7F3ED]"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LÍNEAS TAB (CRUD) */}
      {!selectedAnalysis && activeTab === 'lineas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#24302F]">
                Las 4 Líneas Oficiales de Investigación ({lines.length})
              </h2>
              <p className="text-xs text-[#6F7976]">
                Ejes epistemológicos oficiales del Semillero LabSIE y el Grupo EduTLAN (Categoría A MinCiencias · Universidad de Córdoba).
              </p>
            </div>
            <button
              onClick={() => {
                setEditingLine(null);
                setLineModalOpen(true);
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] text-[#FFFDF9] text-xs font-bold hover:bg-[#059669] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Línea</span>
            </button>
          </div>

          <div className="space-y-4">
            {lines.map(l => {
              const lineProjects = projects.filter(p => p.lineId === l.id);
              return (
                <div
                  key={l.id}
                  className="bg-[#FFFDF9] border border-[#CCD4CF] hover:border-[#10B981] transition-colors rounded-xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-base text-[#24302F]">{l.name}</h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            l.status === 'active'
                              ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                              : 'bg-[#6F7976]/10 text-[#6F7976]'
                          }`}
                        >
                          {l.status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingLine(l);
                            setLineModalOpen(true);
                          }}
                          className="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-[#DDE2DE] hover:bg-[#ECFDF5] hover:border-[#10B981] text-[#24302F]"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar línea ${l.name}?`)) {
                              storageService.deleteLine(l.id);
                              onRefreshData();
                            }
                          }}
                          className="cursor-pointer p-1.5 text-[#B65C5C] hover:text-red-700 rounded hover:bg-[#F7F3ED]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#6F7976]">{l.description}</p>
                    
                    {/* Proyectos asociados con sus metodologías */}
                    <div className="pt-2 border-t border-[#DDE2DE] space-y-1.5">
                      <span className="text-[11px] font-bold text-[#059669] block">
                        Proyectos adscritos ({lineProjects.length}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {lineProjects.map(lp => {
                          const lpMeth = getProjectMethodology(lp.id);
                          return (
                            <span
                              key={lp.id}
                              className={`text-[11px] px-2 py-1 rounded-md border flex items-center gap-1 ${lpMeth.themeColor.bg} ${lpMeth.themeColor.text} ${lpMeth.themeColor.border}`}
                              title={lp.title}
                            >
                              <strong>{lp.code}:</strong> {lpMeth.badgeIcon} {lpMeth.badgeTitle.replace('Metodología: ', '')}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#6F7976] pt-1">
                      <span className="font-medium text-[#24302F]">Palabras clave:</span> {l.keywords.join(', ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Modal */}
      {projectModalOpen && (
        <AdminProjectModal
          project={editingProject}
          lines={lines}
          onSave={p => {
            storageService.saveProject(p);
            setProjectModalOpen(false);
            onRefreshData();
          }}
          onClose={() => setProjectModalOpen(false)}
        />
      )}

      {/* Line Modal */}
      {lineModalOpen && (
        <AdminLineModal
          line={editingLine}
          onSave={l => {
            storageService.saveLine(l);
            setLineModalOpen(false);
            onRefreshData();
          }}
          onClose={() => setLineModalOpen(false)}
        />
      )}
    </div>
  );
};
