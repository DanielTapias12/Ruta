/**
 * LabSIE · Ruta Investigativa
 * Types & Domain Interfaces
 */

export type RouteType = 'HEREDAR' | 'CONECTAR' | 'TRASCENDER' | 'EXPLORAR';

export type CorrespondenceLevel =
  | 'Baja correspondencia'
  | 'Correspondencia exploratoria'
  | 'Buena correspondencia'
  | 'Alta correspondencia';

export type ReviewStatus =
  | 'PENDING'
  | 'IN_ANALYSIS'
  | 'PERTINENT'
  | 'NEW_PROPOSAL'
  | 'NEEDS_INTERVIEW'
  | 'NO_CORRESPONDENCE';

export type AdminDecision =
  | 'VINCULAR_PROYECTO'
  | 'VINCULAR_LINEA'
  | 'NUEVA_PROPUESTA'
  | 'REQUIERE_ENTREVISTA'
  | 'EXPLORACION_ADICIONAL'
  | 'SIN_CORRESPONDENCIA';

export type ProjectStatus = 'active' | 'in_development' | 'completed' | 'historical';

export interface ResearchLine {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ResearchProject {
  id: string;
  code: string;
  title: string;
  lineId: string;
  lineName: string;
  description: string;
  problem: string;
  question: string;
  generalObjective: string;
  context: string;
  population: string;
  concepts: string[];
  methodology: string;
  results: string;
  limitaciones: string;
  openQuestions: string[];
  continuityPossibilities: string[];
  keywords: string[];
  status: ProjectStatus;
  year?: string;
  leadResearcher?: string;
}

export interface StudentProfileData {
  name: string;
  email: string;
  program: 'Licenciatura en Informática';
  semester: string; // "1.º", "2.º", ... "10.º"
  researchExperience:
    | 'No, es mi primer acercamiento.'
    | 'He participado en actividades de investigación.'
    | 'He participado en un proyecto.'
    | 'Tengo experiencia en investigación.'
    | string;
  techExperience: 'Básico' | 'Intermedio' | 'Avanzado' | 'Muy avanzado' | string;
  aiExperience: 'Nunca' | 'Algunas veces' | 'Ocasionalmente' | 'Frecuentemente' | 'Habitualmente' | string;
}

export interface TestAnswers {
  profile: StudentProfileData;
  // SECCIÓN 2 — TU CURIOSIDAD
  firstActionOnProblem: string; // Q7 (1 respuesta)
  curiosityQuestions: string[]; // Q8 (varias respuestas)
  // SECCIÓN 3 — ¿CÓMO TE GUSTARÍA INVESTIGAR?
  preferredActivities: string[]; // Q9 (máx 4)
  // SECCIÓN 4 — SITUACIONES
  scenarioDifficulty: string; // Q10 (A-F)
  scenarioTeacherAI: string; // Q11 (A-E)
  scenarioIntelligentSystem: string; // Q12 (A-G)
  scenarioCulturalChallenge: string; // Q13 (A-F)
  // SECCIÓN 5 — TU RELACIÓN CON LA IA
  aiInterests: string[]; // Q14 (varias respuestas)
  // SECCIÓN 6 — ¿QUÉ TIPO DE INVESTIGADOR TE REPRESENTA?
  researcherArchetypes: string[]; // Q15 (máx 3)
  // SECCIÓN 7 — TU PROPIA CURIOSIDAD
  problemToInvestigate: string; // Q16 (respuesta larga)
  dreamResearch: string; // Q17 (respuesta larga)
  sixMonthsDiscovery: string; // Q18 (respuesta larga)
  // SECCIÓN 9 — CONEXIÓN
  selectedLabSIEProjects: string[]; // Q19 (Proyecto 1-7)
  divergentProjectIdea: string; // Q20 (respuesta larga)
  // SECCIÓN 10 — HEREDAR, CONECTAR O CREAR
  continuationPreference: string; // Q21 (Profundizar, Conectar, Transformar, Crear, Explorar)
  // SECCIÓN 11 — CIERRE
  labsieExpectations: string[]; // Q22 (varias respuestas)
  additionalInterests: string; // Q23 (respuesta larga)
  // Backward compatibility / alias fields
  curiosities?: string[];
  researchWays?: string[];
  scenarios?: Record<string, string>;
  studentResearchIdea?: string;
  selectedProjects?: string[];
}

export interface RelatedProjectAffinity {
  projectId: string;
  projectTitle: string;
  projectCode: string;
  affinity: number; // 0-100
  connectionReason: string;
  matchingConcepts: string[];
}

export interface ProposedProject {
  tentativeTitle: string;
  tentativeQuestion: string;
  tentativeObjective: string;
  centralConcepts: string[];
  possibleContextPopulation: string;
  possibleContribution: string;
  nextSteps: string[];
  statusLabel: string; // e.g. "PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN"
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  algorithmVersion: string;
  studentId: string;
  studentProfile: StudentProfileData;
  routeType: RouteType;
  correspondenceScore: number;
  correspondenceLevel: CorrespondenceLevel;
  profileArchetype: string;
  interestPercentages: Record<string, number>;
  dominantResearchWays: string[];
  primaryLineId: string;
  primaryLineName: string;
  relatedProjects: RelatedProjectAffinity[];
  whyExplanation: string[];
  whyBreakdown: {
    matchingInterests: string[];
    matchingWays: string[];
    relatedConcepts: string[];
    selectedProjectsCount: number;
    studentIdeaAnalysis: string;
    detectedConnections: string[];
  };
  proposedProject: ProposedProject;
  studentAnswers: TestAnswers;
  adminReview?: AdminReview;
}

export interface AdminReview {
  id: string;
  status: ReviewStatus;
  decision: AdminDecision;
  assignedLineId?: string;
  assignedProjectId?: string;
  assignedTutor?: string;
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  adminComments?: string;
  reviewedAt: string;
  reviewedBy: string;
}

export interface QuestionDefinition {
  id: string;
  category: 'curiosity' | 'way' | 'scenario';
  title: string;
  description?: string;
  options: {
    id: string;
    label: string;
    description?: string;
    tags: string[];
  }[];
}
