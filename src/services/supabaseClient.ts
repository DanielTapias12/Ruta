import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AnalysisResult, ResearchProject } from '../types';

const STORAGE_KEY = 'labsie_supabase_custom_config_v2';

export interface SupabaseConfigState {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'custom' | 'env' | 'none';
}

export interface SupabaseTestResult {
  success: boolean;
  message: string;
  tableFound?: boolean;
  latencyMs?: number;
  details?: string;
}

class SupabaseManager {
  private client: SupabaseClient | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initClient();
  }

  private initClient() {
    const config = this.getConfig();
    if (config.isConfigured && config.url && config.anonKey) {
      try {
        this.client = createClient(config.url, config.anonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        });
      } catch (e) {
        console.warn('Error inicializando cliente Supabase:', e);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  public getConfig(): SupabaseConfigState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.anonKey) {
          return {
            url: parsed.url.trim(),
            anonKey: parsed.anonKey.trim(),
            isConfigured: true,
            source: 'custom'
          };
        }
      }
    } catch {
      // Fallback
    }

    const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
    const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

    if (
      envUrl &&
      envKey &&
      envUrl !== 'https://your-project.supabase.co' &&
      !envUrl.includes('your-project')
    ) {
      return {
        url: envUrl,
        anonKey: envKey,
        isConfigured: true,
        source: 'env'
      };
    }

    return {
      url: envUrl || '',
      anonKey: envKey || '',
      isConfigured: false,
      source: 'none'
    };
  }

  public saveConfig(url: string, anonKey: string): void {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();
    if (cleanUrl && cleanKey) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
      );
    }
    this.initClient();
    this.notify();
  }

  public clearConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.initClient();
    this.notify();
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public isReady(): boolean {
    return Boolean(this.client && this.getConfig().isConfigured);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  /**
   * Realiza un test de conexión activo contra Supabase
   */
  public async testConnection(customUrl?: string, customKey?: string): Promise<SupabaseTestResult> {
    const testUrl = (customUrl ?? this.getConfig().url).trim();
    const testKey = (customKey ?? this.getConfig().anonKey).trim();

    if (!testUrl || !testKey) {
      return {
        success: false,
        message: 'Por favor ingresa la URL del proyecto y la Anon Public Key de Supabase.'
      };
    }

    if (!testUrl.startsWith('https://') || !testUrl.includes('.supabase.co')) {
      return {
        success: false,
        message: 'La URL debe tener el formato https://<tu-proyecto>.supabase.co'
      };
    }

    const startTime = performance.now();

    try {
      const testClient = createClient(testUrl, testKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      // Intento 1: Verificar si la tabla labsie_analyses existe y tiene acceso
      const { data, error } = await testClient
        .from('labsie_analyses')
        .select('id', { count: 'exact', head: true });

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        // Error de tabla no encontrada (PGRST204 o 404)
        if (
          error.code === '42P01' ||
          error.message.toLowerCase().includes('relation "labsie_analyses" does not exist') ||
          error.message.toLowerCase().includes('not found')
        ) {
          return {
            success: true,
            tableFound: false,
            latencyMs,
            message: 'Conexión con Supabase establecida con éxito, pero la tabla "labsie_analyses" aún no ha sido creada. Ejecuta el script SQL en tu proyecto.',
            details: error.message
          };
        }

        // Error de credenciales o JWT
        if (error.code === 'PGRST301' || error.message.toLowerCase().includes('jwt') || error.message.toLowerCase().includes('api key')) {
          return {
            success: false,
            latencyMs,
            message: 'La URL responde, pero la Anon Key parece inválida o ha expirado.',
            details: error.message
          };
        }

        return {
          success: false,
          latencyMs,
          message: `Error al consultar Supabase: ${error.message}`,
          details: error.message
        };
      }

      return {
        success: true,
        tableFound: true,
        latencyMs,
        message: `¡Conexión exitosa con Supabase! Tabla 'labsie_analyses' lista (${latencyMs}ms).`
      };
    } catch (err: any) {
      return {
        success: false,
        message: `No se pudo conectar a Supabase: ${err?.message || 'Error de red o CORS'}. Verifica que la URL sea correcta y tu conexión a Internet.`,
        details: String(err)
      };
    }
  }

  /**
   * Sincroniza un análisis individual a Supabase
   */
  public async syncAnalysis(analysis: AnalysisResult): Promise<{ success: boolean; error?: string }> {
    if (!this.client) {
      return { success: false, error: 'Supabase no está configurado.' };
    }

    try {
      const { error } = await this.client.from('labsie_analyses').upsert({
        id: analysis.id,
        student_name: analysis.studentProfile.name,
        student_email: analysis.studentProfile.email,
        student_phone: analysis.studentProfile.phone || null,
        program: analysis.studentProfile.program,
        semester: analysis.studentProfile.semester,
        route_type: analysis.routeType,
        correspondence_score: analysis.correspondenceScore,
        profile_archetype: analysis.profileArchetype,
        primary_line_name: analysis.primaryLineName,
        analysis_payload: analysis
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error de red al sincronizar' };
    }
  }

  /**
   * Sincroniza un conjunto de análisis a Supabase
   */
  public async syncAllAnalyses(analyses: AnalysisResult[]): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    if (!this.client) {
      return { success: false, syncedCount: 0, error: 'Supabase no está configurado.' };
    }

    try {
      const payloads = analyses.map(a => ({
        id: a.id,
        student_name: a.studentProfile.name,
        student_email: a.studentProfile.email,
        student_phone: a.studentProfile.phone || null,
        program: a.studentProfile.program,
        semester: a.studentProfile.semester,
        route_type: a.routeType,
        correspondence_score: a.correspondenceScore,
        profile_archetype: a.profileArchetype,
        primary_line_name: a.primaryLineName,
        analysis_payload: a
      }));

      const { error } = await this.client.from('labsie_analyses').upsert(payloads);

      if (error) {
        return { success: false, syncedCount: 0, error: error.message };
      }

      return { success: true, syncedCount: analyses.length };
    } catch (err: any) {
      return { success: false, syncedCount: 0, error: err?.message || 'Error general' };
    }
  }

  /**
   * Sincroniza el catálogo de proyectos a Supabase
   */
  public async syncProjects(projects: ResearchProject[]): Promise<{ success: boolean; count: number; error?: string }> {
    if (!this.client) {
      return { success: false, count: 0, error: 'Supabase no está configurado.' };
    }

    try {
      const records = projects.map(p => ({
        id: p.id,
        code: p.code,
        title: p.title,
        line_id: p.lineId,
        line_name: p.lineName,
        description: p.description,
        methodology: p.methodology,
        concepts: p.concepts
      }));

      const { error } = await this.client.from('labsie_projects').upsert(records);

      if (error) {
        return { success: false, count: 0, error: error.message };
      }

      return { success: true, count: projects.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Error general' };
    }
  }

  /**
   * Obtiene los análisis registrados en Supabase
   */
  public async fetchRemoteAnalyses(): Promise<AnalysisResult[]> {
    if (!this.client) return [];

    try {
      const { data, error } = await this.client
        .from('labsie_analyses')
        .select('analysis_payload')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Error fetching analyses from Supabase:', error);
        return [];
      }

      return data.map((row: any) => row.analysis_payload as AnalysisResult).filter(Boolean);
    } catch (e) {
      console.warn('Exception fetching from Supabase:', e);
      return [];
    }
  }
}

export const supabaseManager = new SupabaseManager();

/** Compatibilidad con código existente **/
export const supabase = supabaseManager.getClient();
export const isSupabaseConfigured = supabaseManager.isReady();

export function syncAnalysisToSupabase(analysis: AnalysisResult) {
  return supabaseManager.syncAnalysis(analysis);
}

/**
 * SQL Schema definition to share with user for easy setup in Supabase SQL editor.
 */
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================
-- SEMILLERO DE INVESTIGACIÓN LabSIE · GRUPO EduTLAN (UNICÓRDOBA)
-- Esquema de Base de Datos para Supabase (PostgreSQL)
-- Copia y pega esto en el SQL Editor de tu proyecto en https://supabase.com
-- ==============================================================

-- 1. Tabla de Análisis y Caracterización de Estudiantes
CREATE TABLE IF NOT EXISTS labsie_analyses (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT,
  program TEXT NOT NULL,
  semester TEXT NOT NULL,
  route_type TEXT NOT NULL,
  correspondence_score INTEGER NOT NULL,
  profile_archetype TEXT NOT NULL,
  primary_line_name TEXT NOT NULL,
  analysis_payload JSONB NOT NULL
);

-- 2. Tabla de Proyectos del Semillero LabSIE (18 Proyectos Oficiales)
CREATE TABLE IF NOT EXISTS labsie_projects (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  line_id TEXT NOT NULL,
  line_name TEXT NOT NULL,
  description TEXT,
  methodology TEXT,
  concepts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE labsie_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE labsie_projects ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de acceso (Lectura y Escritura para la aplicación web)
DROP POLICY IF EXISTS "Lectura pública de proyectos" ON labsie_projects;
CREATE POLICY "Lectura pública de proyectos" ON labsie_projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserción y actualización de proyectos" ON labsie_projects;
CREATE POLICY "Inserción y actualización de proyectos" ON labsie_projects
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Inserción de análisis" ON labsie_analyses;
CREATE POLICY "Inserción de análisis" ON labsie_analyses
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Actualización de análisis" ON labsie_analyses;
CREATE POLICY "Actualización de análisis" ON labsie_analyses
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Lectura de análisis" ON labsie_analyses;
CREATE POLICY "Lectura de análisis" ON labsie_analyses
  FOR SELECT USING (true);
`;
