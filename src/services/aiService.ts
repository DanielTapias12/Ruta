import { GoogleGenAI } from '@google/genai';
import { AnalysisResult, TestAnswers, ResearchProject, ProposedProject } from '../types';

/**
 * ResearchAnalysisService
 * Hybrid AI layer that augments the deterministic rule-based engine.
 * Decoupled from any single LLM provider.
 */
class ResearchAnalysisService {
  private client: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    // Check client or server env
    const key = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.GEMINI_API_KEY);
    if (key && key !== 'MY_GEMINI_API_KEY' && typeof key === 'string' && key.trim().length > 0) {
      this.apiKey = key.trim();
      try {
        this.client = new GoogleGenAI({ apiKey: key.trim() });
      } catch (e) {
        console.warn('Gemini client initialization skipped:', e);
      }
    }
  }

  public isAIAvailable(): boolean {
    return !!this.client;
  }

  public setCustomApiKey(key: string) {
    if (key.trim()) {
      this.apiKey = key.trim();
      this.client = new GoogleGenAI({ apiKey: key.trim() });
    }
  }

  /**
   * Refines the proposal and narrative using Gemini if available.
   * If not available or on error, returns the deterministic result cleanly.
   */
  public async augmentAnalysisWithAI(
    baseResult: AnalysisResult,
    projects: ResearchProject[]
  ): Promise<AnalysisResult> {
    if (!this.client) {
      return baseResult;
    }

    try {
      const prompt = `
Actúa como investigador senior del Semillero de Investigación LabSIE del Grupo EduTLAN (Universidad de Córdoba).
Analiza el perfil y las respuestas del siguiente estudiante para refinar la propuesta preliminar de investigación:

Estudiante: ${baseResult.studentProfile.name} (${baseResult.studentProfile.program}, Semestre ${baseResult.studentProfile.semester})
Intereses: ${(baseResult.studentAnswers.curiosityQuestions || baseResult.studentAnswers.curiosities || []).join(', ')}
Formas de investigar: ${(baseResult.studentAnswers.preferredActivities || baseResult.studentAnswers.researchWays || []).join(', ')}
Idea propia del estudiante: "${baseResult.studentAnswers.problemToInvestigate || baseResult.studentAnswers.studentResearchIdea || 'Ninguna'}"
Ruta asignada por el sistema: ${baseResult.routeType}
Proyectos LabSIE relacionados: ${baseResult.relatedProjects.map(p => `${p.projectCode}: ${p.projectTitle}`).join('; ')}

Genera una respuesta en formato JSON exacto con las siguientes claves:
{
  "academicNarrative": ["párrafo 1 explicativo de por qué esta ruta", "párrafo 2 sobre la memoria investigativa del semillero", "párrafo 3 sobre el aporte futuro"],
  "refinedTitle": "Título académico tentativo",
  "refinedQuestion": "¿Pregunta de investigación tentativa?",
  "refinedObjective": "Objetivo general formulado con verbo en infinitivo",
  "contribution": "Aporte específico al patrimonio del semillero",
  "nextSteps": ["paso 1", "paso 2", "paso 3"]
}
`;

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (!text) return baseResult;

      const parsed = JSON.parse(text);
      if (parsed.refinedTitle && parsed.refinedQuestion) {
        return {
          ...baseResult,
          algorithmVersion: `${baseResult.algorithmVersion}+gemini-augmented`,
          whyExplanation: parsed.academicNarrative || baseResult.whyExplanation,
          proposedProject: {
            ...baseResult.proposedProject,
            tentativeTitle: parsed.refinedTitle,
            tentativeQuestion: parsed.refinedQuestion,
            tentativeObjective: parsed.refinedObjective || baseResult.proposedProject.tentativeObjective,
            possibleContribution: parsed.contribution || baseResult.proposedProject.possibleContribution,
            nextSteps: parsed.nextSteps || baseResult.proposedProject.nextSteps
          }
        };
      }
    } catch (e) {
      console.warn('AI augmentation skipped, using robust rule-based result:', e);
    }

    return baseResult;
  }
}

export const researchAnalysisService = new ResearchAnalysisService();
