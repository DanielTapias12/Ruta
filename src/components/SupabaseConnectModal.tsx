import React, { useState, useEffect } from 'react';
import {
  Database,
  Check,
  Copy,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Save,
  Server,
  Zap,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  supabaseManager,
  SUPABASE_SQL_SCHEMA,
  SupabaseTestResult,
  SupabaseConfigState
} from '../services/supabaseClient';
import { storageService } from '../services/storageService';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({
  isOpen,
  onClose
}) => {
  const [config, setConfig] = useState<SupabaseConfigState>(supabaseManager.getConfig());
  const [inputUrl, setInputUrl] = useState(config.url || '');
  const [inputKey, setInputKey] = useState(config.anonKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<SupabaseTestResult | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'guide'>('config');

  useEffect(() => {
    if (isOpen) {
      const current = supabaseManager.getConfig();
      setConfig(current);
      setInputUrl(current.url);
      setInputKey(current.anonKey);
      setTestResult(null);
      setSyncFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await supabaseManager.testConnection(inputUrl, inputKey);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || 'Error inesperado al probar conexión'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!inputUrl.trim() || !inputKey.trim()) {
      setTestResult({
        success: false,
        message: 'Debes proporcionar la URL del proyecto y la Anon Key de Supabase.'
      });
      return;
    }

    supabaseManager.saveConfig(inputUrl, inputKey);
    const updated = supabaseManager.getConfig();
    setConfig(updated);

    // Auto-test on save
    setIsTesting(true);
    try {
      const res = await supabaseManager.testConnection(inputUrl, inputKey);
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    supabaseManager.clearConfig();
    const updated = supabaseManager.getConfig();
    setConfig(updated);
    setInputUrl(updated.url);
    setInputKey(updated.anonKey);
    setTestResult(null);
    setSyncFeedback('Se desconectó Supabase. La aplicación continuará en modo local resiliente.');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSyncAllAnalyses = async () => {
    if (!supabaseManager.isReady()) {
      setSyncFeedback('Conecta primero tu proyecto de Supabase antes de sincronizar.');
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const analyses = storageService.getAnalyses();
      const res = await supabaseManager.syncAllAnalyses(analyses);
      if (res.success) {
        setSyncFeedback(`✅ ¡Éxito! Se sincronizaron ${res.syncedCount} análisis de caracterización con Supabase.`);
      } else {
        setSyncFeedback(`⚠️ No se pudo sincronizar: ${res.error}. ¿Ya creaste la tabla en Supabase?`);
      }
    } catch (err: any) {
      setSyncFeedback(`Error: ${err?.message || 'Fallo de red'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncProjects = async () => {
    if (!supabaseManager.isReady()) {
      setSyncFeedback('Conecta primero tu proyecto de Supabase antes de sincronizar.');
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const projects = storageService.getProjects();
      const res = await supabaseManager.syncProjects(projects);
      if (res.success) {
        setSyncFeedback(`✅ ¡Éxito! Se sincronizaron los ${res.count} proyectos oficiales de LabSIE con Supabase.`);
      } else {
        setSyncFeedback(`⚠️ No se pudo sincronizar: ${res.error}`);
      }
    } catch (err: any) {
      setSyncFeedback(`Error: ${err?.message || 'Fallo de red'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2624]/65 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border-2 border-[#10B981] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6 animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#CCD4CF] pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] shadow-xs">
              <Database className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl md:text-2xl text-[#1C2624]">
                  Base de Datos Supabase (PostgreSQL)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  Cloud DB
                </span>
              </div>
              <p className="text-xs text-[#4A5568] mt-0.5">
                Persistencia en tiempo real para análisis, respuestas y proyectos del Semillero LabSIE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer text-[#6F7976] hover:text-[#1C2624] p-1.5 rounded-lg hover:bg-[#F7F3ED] transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className={`p-4 rounded-2xl border-2 space-y-2 ${
          config.isConfigured
            ? 'bg-[#ECFDF5] border-[#10B981]'
            : 'bg-[#FFFBEB] border-[#F59E0B]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {config.isConfigured ? '🟢' : '🟡'}
              </span>
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block text-[#1C2624]">
                  {config.isConfigured ? 'Estado: Conectado a la Nube' : 'Estado: Modo Local Resiliente (Listo para Conectar)'}
                </span>
                <span className="text-xs text-[#4A5568]">
                  {config.isConfigured
                    ? `Conectado a ${config.url} (${config.source === 'custom' ? 'Configurado en el navegador' : 'Variable de entorno'})`
                    : 'La aplicación almacena todo localmente. Puedes conectar tu Supabase en 2 minutos.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="cursor-pointer self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] hover:border-[#10B981] text-[#1C2624] hover:bg-[#ECFDF5] transition-all shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#059669] ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Probando...' : 'Probar Conexión'}</span>
            </button>
          </div>

          {/* Test Feedback */}
          {testResult && (
            <div className={`mt-3 p-3 rounded-xl text-xs flex items-start gap-2 border ${
              testResult.success
                ? 'bg-[#FFFDF9] border-[#10B981] text-[#065F46]'
                : 'bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold">{testResult.message}</p>
                {testResult.latencyMs && (
                  <span className="text-[11px] opacity-80 block">
                    Latencia: {testResult.latencyMs}ms {testResult.tableFound === false ? '• Falta crear las tablas SQL' : '• Tablas operativas'}
                  </span>
                )}
                {testResult.tableFound === false && (
                  <button
                    onClick={() => setActiveTab('sql')}
                    className="cursor-pointer text-[11px] font-bold underline text-[#059669] hover:text-[#047857]"
                  >
                    Ver el script SQL para crear las tablas en Supabase →
                  </button>
                )}
              </div>
            </div>
          )}

          {syncFeedback && (
            <div className="mt-2 p-2.5 rounded-lg bg-[#FFFDF9] border border-[#CCD4CF] text-xs text-[#1C2624] font-medium flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#CCD4CF] gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('config')}
            className={`cursor-pointer pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#6F7976] hover:text-[#1C2624]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Configurar Conexión</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`cursor-pointer pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#6F7976] hover:text-[#1C2624]'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Script SQL (Tablas)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`cursor-pointer pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#6F7976] hover:text-[#1C2624]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Guía Paso a Paso (2 min)</span>
          </button>
        </div>

        {/* Tab 1: Configuration Form */}
        {activeTab === 'config' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C2624] mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzprojectid.supabase.co"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-[#CCD4CF] bg-[#FFFDF9] focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                />
                <span className="text-[11px] text-[#6F7976] mt-0.5 block">
                  Encuéntrala en Supabase: Settings &gt; API &gt; Project URL
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C2624] mb-1">
                  Supabase Anon / Public Key (API Key)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-[#CCD4CF] bg-[#FFFDF9] focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                />
                <span className="text-[11px] text-[#6F7976] mt-0.5 block">
                  Encuéntrala en Supabase: Settings &gt; API &gt; Project API keys &gt; anon public
                </span>
              </div>
            </div>

            {/* Actions for Form */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveConfig}
                  disabled={isTesting}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#059669] text-white hover:bg-[#047857] transition-all shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar y Conectar</span>
                </button>

                {config.source === 'custom' && (
                  <button
                    onClick={handleDisconnect}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-[#FAF8F5] border border-[#CCD4CF] text-[#991B1B] hover:bg-[#FEF2F2] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Desconectar</span>
                  </button>
                )}
              </div>

              {/* Sync Tools */}
              {config.isConfigured && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncAllAnalyses}
                    disabled={isSyncing}
                    className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#ECFDF5] border border-[#10B981] text-[#065F46] hover:bg-[#D1FAE5] transition-all disabled:opacity-50"
                    title="Subir todos los análisis guardados a la tabla labsie_analyses"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sincronizar Análisis</span>
                  </button>

                  <button
                    onClick={handleSyncProjects}
                    disabled={isSyncing}
                    className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#FAF8F5] border border-[#CCD4CF] text-[#1C2624] hover:bg-[#F0EFEB] transition-all disabled:opacity-50"
                    title="Subir los 18 proyectos oficiales a la tabla labsie_projects"
                  >
                    <Database className="w-3 h-3 text-[#059669]" />
                    <span>Sincronizar 18 Proyectos</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: SQL Script */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2624]">
                Script SQL para Supabase (Tablas `labsie_analyses` y `labsie_projects` con RLS):
              </span>
              <button
                onClick={handleCopySql}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#059669] text-white hover:bg-[#047857] transition-all shadow-xs"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Script SQL</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-[#6F7976]">
              Abre el <strong>SQL Editor</strong> en tu panel de Supabase (<a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#059669] underline">supabase.com/dashboard</a>), pega este código y pulsa <strong>Run</strong>.
            </p>

            <pre className="p-4 rounded-2xl bg-[#1C2624] text-[#A7F3D0] font-mono text-xs max-h-56 overflow-y-auto leading-relaxed border border-[#CCD4CF] selection:bg-[#059669]">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        )}

        {/* Tab 3: Quick Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs text-[#24302F]">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#CCD4CF] space-y-3">
              <h4 className="font-bold text-sm text-[#065F46] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>¿Cómo conectar tu propia cuenta de Supabase en 3 sencillos pasos?</span>
              </h4>

              <ol className="list-decimal list-inside space-y-2.5 text-xs text-[#374151] pl-1">
                <li>
                  <strong>Crear proyecto en Supabase (Gratis):</strong> Ve a{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#059669] font-bold underline inline-flex items-center gap-0.5"
                  >
                    supabase.com <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  e inicia sesión con GitHub o correo. Crea una nueva organización y proyecto.
                </li>
                <li>
                  <strong>Crear las tablas con 1 clic:</strong> En el menú lateral izquierdo, haz clic en <strong>SQL Editor</strong>. Copia el script de la pestaña <em>"Script SQL"</em> de arriba, pégalo allí y haz clic en <strong>Run</strong>.
                </li>
                <li>
                  <strong>Obtener credenciales y conectar:</strong> Ve a <strong>Project Settings &gt; API</strong>. Copia tu <code>Project URL</code> y tu <code>anon public key</code>. Pégalas en la pestaña <em>"Configurar Conexión"</em> de esta ventana y haz clic en <strong>Guardar y Conectar</strong>.
                </li>
              </ol>

              <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#065F46]">
                💡 <strong>Ventaja:</strong> Cada vez que un estudiante complete el test de caracterización o seleccione su propuesta preferida de investigación, el resultado se guardará en PostgreSQL en tu Supabase en tiempo real.
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#CCD4CF] flex items-center justify-between">
          <span className="text-[11px] text-[#6F7976]">
            Persistencia híbrida blindada: LocalStorage + Supabase Cloud PostgreSQL
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-xl bg-[#268E6C] text-[#FFFDF9] font-bold text-xs hover:bg-[#1E785B] transition-colors shadow-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
