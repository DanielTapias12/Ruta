import {
  ResearchProject,
  ResearchLine,
  AnalysisResult,
  AdminReview
} from '../types';
import { INITIAL_PROJECTS, INITIAL_RESEARCH_LINES, DEMO_ANALYSES } from '../data/initialData';

const STORAGE_KEYS = {
  PROJECTS: 'labsie_research_projects_v10',
  LINES: 'labsie_research_lines_v10',
  ANALYSES: 'labsie_analysis_results_v10',
  CURRENT_USER: 'labsie_current_user_v10'
};

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

class StorageService {
  private projects: ResearchProject[] = [];
  private lines: ResearchLine[] = [];
  private analyses: AnalysisResult[] = [];
  private currentUser: AppUser = {
    id: 'guest-student',
    name: 'Estudiante LabSIE',
    email: 'estudiante@correo.unicordoba.edu.co',
    role: 'student'
  };
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects);
        // Ensure all official 18 projects are present and updated with official data
        INITIAL_PROJECTS.forEach(initP => {
          const idx = this.projects.findIndex(p => p.id === initP.id);
          if (idx >= 0) {
            this.projects[idx] = { ...this.projects[idx], ...initP };
          } else {
            this.projects.push(initP);
          }
        });
        // Sort stably by code in natural order (LABSIE-P01 to P18)
        this.projects.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
        this.persistProjects();
      } else {
        this.projects = [...INITIAL_PROJECTS];
        this.projects.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
        this.persistProjects();
      }

      const storedLines = localStorage.getItem(STORAGE_KEYS.LINES);
      if (storedLines) {
        this.lines = JSON.parse(storedLines);
        // Guarantee synchronization with the official 4 research lines exclusively
        const validIds = new Set(INITIAL_RESEARCH_LINES.map(l => l.id));
        const allPresent = INITIAL_RESEARCH_LINES.every(l => this.lines.some(cur => cur.id === l.id));
        if (this.lines.length !== 4 || !allPresent || this.lines.some(l => !validIds.has(l.id))) {
          this.lines = [...INITIAL_RESEARCH_LINES];
          this.persistLines();
        }
      } else {
        this.lines = [...INITIAL_RESEARCH_LINES];
        this.persistLines();
      }

      const storedAnalyses = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      if (storedAnalyses) {
        this.analyses = JSON.parse(storedAnalyses);
      } else {
        this.analyses = [...DEMO_ANALYSES];
        this.persistAnalyses();
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.warn('Storage initialization fallback to memory', e);
      this.projects = [...INITIAL_PROJECTS];
      this.lines = [...INITIAL_RESEARCH_LINES];
      this.analyses = [...DEMO_ANALYSES];
    }
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private persistProjects() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
    } catch (e) {
      console.error(e);
    }
  }

  private persistLines() {
    try {
      localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(this.lines));
    } catch (e) {
      console.error(e);
    }
  }

  private persistAnalyses() {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(this.analyses));
    } catch (e) {
      console.error(e);
    }
  }

  // --- Current User & Role ---
  public getCurrentUser(): AppUser {
    return this.currentUser;
  }

  public setCurrentUser(user: AppUser) {
    this.currentUser = user;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public setAdminRole(isAdmin: boolean) {
    if (isAdmin) {
      this.setCurrentUser({
        id: 'admin-01',
        name: 'Coordinación LabSIE / EduTLAN',
        email: 'labsie.edutlan@unicordoba.edu.co',
        role: 'admin'
      });
    } else {
      this.setCurrentUser({
        id: 'student-demo',
        name: 'Estudiante LabSIE',
        email: 'estudiante@correo.unicordoba.edu.co',
        role: 'student'
      });
    }
  }

  // --- Projects CRUD ---
  public getProjects(): ResearchProject[] {
    return [...this.projects];
  }

  public getProjectById(id: string): ResearchProject | undefined {
    return this.projects.find(p => p.id === id);
  }

  public saveProject(project: ResearchProject): void {
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      this.projects[index] = { ...project };
    } else {
      this.projects.push({ ...project });
    }
    this.persistProjects();
    this.notify();
  }

  public deleteProject(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id);
    this.persistProjects();
    this.notify();
  }

  // --- Lines CRUD ---
  public getLines(): ResearchLine[] {
    return [...this.lines];
  }

  public getLineById(id: string): ResearchLine | undefined {
    return this.lines.find(l => l.id === id);
  }

  public saveLine(line: ResearchLine): void {
    const index = this.lines.findIndex(l => l.id === line.id);
    if (index >= 0) {
      this.lines[index] = { ...line };
    } else {
      this.lines.push({ ...line });
    }
    this.persistLines();
    this.notify();
  }

  public deleteLine(id: string): void {
    this.lines = this.lines.filter(l => l.id !== id);
    this.persistLines();
    this.notify();
  }

  // --- Analysis Results CRUD ---
  public getAnalyses(): AnalysisResult[] {
    return [...this.analyses].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public getAnalysisById(id: string): AnalysisResult | undefined {
    return this.analyses.find(a => a.id === id);
  }

  public saveAnalysis(analysis: AnalysisResult): void {
    const index = this.analyses.findIndex(a => a.id === analysis.id);
    if (index >= 0) {
      this.analyses[index] = { ...analysis };
    } else {
      this.analyses.unshift({ ...analysis });
    }
    this.persistAnalyses();
    this.notify();
  }

  public updateAdminReview(analysisId: string, review: AdminReview): void {
    const target = this.analyses.find(a => a.id === analysisId);
    if (target) {
      target.adminReview = review;
      this.persistAnalyses();
      this.notify();
    }
  }

  public resetToDefaults(): void {
    this.projects = [...INITIAL_PROJECTS];
    this.lines = [...INITIAL_RESEARCH_LINES];
    this.analyses = [...DEMO_ANALYSES];
    this.persistProjects();
    this.persistLines();
    this.persistAnalyses();
    this.notify();
  }
}

export const storageService = new StorageService();
