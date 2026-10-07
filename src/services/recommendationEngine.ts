import {
  TestAnswers,
  ResearchProject,
  ResearchLine,
  AnalysisResult,
  RouteType,
  CorrespondenceLevel,
  RelatedProjectAffinity,
  ProposedProject
} from '../types';

export const ALGORITHM_VERSION = 'v2.0-lic-informatica-engine';

export function runRecommendationEngine(
  answers: TestAnswers,
  projects: ResearchProject[],
  lines: ResearchLine[]
): AnalysisResult {
  const {
    profile,
    firstActionOnProblem = '',
    curiosityQuestions = [],
    preferredActivities = [],
    scenarioDifficulty = '',
    scenarioTeacherAI = '',
    scenarioIntelligentSystem = '',
    scenarioCulturalChallenge = '',
    aiInterests = [],
    researcherArchetypes = [],
    problemToInvestigate = '',
    dreamResearch = '',
    sixMonthsDiscovery = '',
    selectedLabSIEProjects = [],
    divergentProjectIdea = '',
    continuationPreference = '',
    labsieExpectations = [],
    additionalInterests = ''
  } = answers;

  // Combine long text answers for conceptual semantic analysis
  const combinedIdeaText = [
    problemToInvestigate,
    dreamResearch,
    sixMonthsDiscovery,
    divergentProjectIdea,
    additionalInterests
  ].join(' ').toLowerCase();

  const projectAffinities: {
    project: ResearchProject;
    totalAffinity: number;
    interestScore: number;
    waysScore: number;
    scenarioScore: number;
    ideaScore: number;
    selectedScore: number;
    experienceScore: number;
    connectionReason: string;
    matchingConcepts: string[];
  }[] = [];

  for (const project of projects) {
    const projConceptsLower = project.concepts.map(c => c.toLowerCase());
    const projKeywordsLower = project.keywords.map(k => k.toLowerCase());
    const projAllTerms = [...projConceptsLower, ...projKeywordsLower, project.title.toLowerCase()];

    // A. Intereses (Curiosidades Q8 + IA Interests Q14) - 25%
    let interestMatches = 0;
    const matchingConceptsFound: string[] = [];

    // Check curiosity questions
    curiosityQuestions.forEach(q => {
      const qLow = q.toLowerCase();
      if (qLow.includes('aprenden') && (projAllTerms.some(t => t.includes('aprendizaje') || t.includes('cognitivo') || t.includes('pensamiento') || t.includes('estudiante')))) interestMatches += 1.5;
      if (qLow.includes('inteligentes') && (projAllTerms.some(t => t.includes('inteligente') || t.includes('ia') || t.includes('tutor') || t.includes('llm') || t.includes('carina')))) interestMatches += 1.6;
      if (qLow.includes('patrones') && (projAllTerms.some(t => t.includes('tracing') || t.includes('predicción') || t.includes('datos') || t.includes('benchmark')))) interestMatches += 1.6;
      if (qLow.includes('tecnología') && (projAllTerms.some(t => t.includes('tecnología') || t.includes('gemelo') || t.includes('coil') || t.includes('sistema')))) interestMatches += 1.3;
      if (qLow.includes('diferente') || qLow.includes('condición')) interestMatches += 1.2;
    });

    // Check AI interests
    aiInterests.forEach(ai => {
      const aiLow = ai.toLowerCase();
      if (aiLow.includes('aprender') && projAllTerms.some(t => t.includes('aprender') || t.includes('aprendizaje') || t.includes('gamificación') || t.includes('autónomo'))) interestMatches += 1.8;
      if (aiLow.includes('enseñar') && projAllTerms.some(t => t.includes('enseñar') || t.includes('didáctica') || t.includes('currículo') || t.includes('formación'))) interestMatches += 1.8;
      if (aiLow.includes('datos') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('datos') || t.includes('markov') || t.includes('machine learning')))) interestMatches += 2.0;
      if (aiLow.includes('retroalimentación') && projAllTerms.some(t => t.includes('retroalimentación') || t.includes('tutor') || t.includes('recomendación'))) interestMatches += 2.0;
      if (aiLow.includes('adapta') && (project.lineId === 'line-entornos-virtuales-adaptativos' || projAllTerms.some(t => t.includes('adaptativ') || t.includes('asistente') || t.includes('tutor')))) interestMatches += 1.8;
      if (aiLow.includes('comportamiento') && projAllTerms.some(t => t.includes('comportamiento') || t.includes('disciplinario') || t.includes('autorregulado') || t.includes('inasistencia'))) interestMatches += 2.0;
      if (aiLow.includes('evalúa') && projAllTerms.some(t => t.includes('evaluación') || t.includes('competencias') || t.includes('rendimiento'))) interestMatches += 2.2;
      if (aiLow.includes('límites') && projAllTerms.some(t => t.includes('pensamiento crítico') || t.includes('dificultades') || t.includes('experiencias'))) interestMatches += 2.0;
    });

    const interestScore = Math.min(100, Math.round((interestMatches / Math.max(3, (curiosityQuestions.length + aiInterests.length) * 0.4)) * 100));

    // B. Actividades y Formas de Investigar (Q7 + Q9) - 15%
    let waysMatches = 0;
    const actionLow = firstActionOnProblem.toLowerCase();
    if (actionLow.includes('comprender') && projAllTerms.some(t => t.includes('cognitivo') || t.includes('neurocognitivo') || t.includes('pensamiento crítico') || t.includes('fenomenología'))) waysMatches += 2;
    if (actionLow.includes('datos') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('markov') || t.includes('machine learning') || t.includes('indicadores')))) waysMatches += 2.5;
    if ((actionLow.includes('prototipo') || actionLow.includes('diseñar')) && projAllTerms.some(t => t.includes('diseño') || t.includes('desarrollo') || t.includes('app') || t.includes('red'))) waysMatches += 2;
    if (actionLow.includes('experimentar') || actionLow.includes('comparar')) waysMatches += 2;

    preferredActivities.forEach(act => {
      const actLow = act.toLowerCase();
      if ((actLow.includes('datos') || actLow.includes('patrones')) && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('datos') || t.includes('markov') || t.includes('machine learning')))) waysMatches += 2.5;
      if ((actLow.includes('programar') || actLow.includes('aplicaciones')) && projAllTerms.some(t => t.includes('app') || t.includes('software') || t.includes('desarrollo') || t.includes('qr'))) waysMatches += 2.5;
      if (actLow.includes('inteligencia artificial') && (project.lineId === 'line-diseno-sistemas-inteligentes' || project.lineId === 'line-ia-aprendizaje-personalizado' || projAllTerms.some(t => t.includes('ia') || t.includes('inteligente') || t.includes('tutor') || t.includes('machine learning')))) waysMatches += 2.5;
      if ((actLow.includes('actividades educativas') || actLow.includes('interfaces')) && projAllTerms.some(t => t.includes('actividades') || t.includes('didáctica') || t.includes('gamificación') || t.includes('ux'))) waysMatches += 2.5;
      if ((actLow.includes('entrevistar') || actLow.includes('docentes')) && projAllTerms.some(t => t.includes('docentes') || t.includes('formación') || t.includes('currículo') || t.includes('experiencias'))) waysMatches += 2.5;
      if (actLow.includes('estudiantes') && projAllTerms.some(t => t.includes('estudiante') || t.includes('secundaria') || t.includes('rural') || t.includes('aula'))) waysMatches += 2.5;
    });

    const waysScore = Math.min(100, Math.round((waysMatches / Math.max(3, preferredActivities.length * 0.8)) * 100));

    // C. Escenarios Situacionales (Q10, Q11, Q12, Q13) - 20%
    let scenarioScore = 50;

    // Q10: Dificultad en plataforma
    if (scenarioDifficulty.startsWith('A') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('predecir') || t.includes('inasistencia') || t.includes('rendimiento')))) scenarioScore += 18; // Detección temprana
    if (scenarioDifficulty.startsWith('B') && projAllTerms.some(t => t.includes('dificultades') || t.includes('pensamiento crítico') || t.includes('experiencias'))) scenarioScore += 18; // Por qué ocurre
    if (scenarioDifficulty.startsWith('C') && projAllTerms.some(t => t.includes('tutor') || t.includes('resolución de problemas') || t.includes('asistente') || t.includes('gamificación'))) scenarioScore += 18; // Cómo ayudar
    if (scenarioDifficulty.startsWith('D') && (project.lineId === 'line-entornos-virtuales-adaptativos' || projAllTerms.some(t => t.includes('adaptar') || t.includes('rural') || t.includes('dua')))) scenarioScore += 18; // Adaptar
    if (scenarioDifficulty.startsWith('E') && projAllTerms.some(t => t.includes('autorregulado') || t.includes('pensamiento crítico') || t.includes('autónomo'))) scenarioScore += 18; // Reflexión errores
    if (scenarioDifficulty.startsWith('F') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('machine learning') || t.includes('automatiz') || t.includes('ontología')))) scenarioScore += 18; // Automatización

    // Q11: Docente con IA
    if (scenarioTeacherAI.startsWith('A') && projAllTerms.some(t => t.includes('currículo') || t.includes('resultados de aprendizaje') || t.includes('planeación') || t.includes('competencias'))) scenarioScore += 20;
    if (scenarioTeacherAI.startsWith('B') && projAllTerms.some(t => t.includes('asistente') || t.includes('steam') || t.includes('didáctica') || t.includes('gamificación'))) scenarioScore += 18;
    if (scenarioTeacherAI.startsWith('D') && projAllTerms.some(t => t.includes('tutor') || t.includes('autorregulado') || t.includes('classroom'))) scenarioScore += 18;
    if (scenarioTeacherAI.startsWith('E') && projAllTerms.some(t => t.includes('rural') || t.includes('cultural') || t.includes('botánica') || t.includes('identidad'))) scenarioScore += 18;

    // Q12: Sistema observa comportamiento
    if (scenarioIntelligentSystem.startsWith('A') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('predecir') || t.includes('rendimiento') || t.includes('inasistencia')))) scenarioScore += 20;
    if (scenarioIntelligentSystem.startsWith('B') && projAllTerms.some(t => t.includes('markov') || t.includes('datos') || t.includes('competencias'))) scenarioScore += 18;
    if (scenarioIntelligentSystem.startsWith('C') && projAllTerms.some(t => t.includes('gamificación') || t.includes('app') || t.includes('qr') || t.includes('adaptad'))) scenarioScore += 18;
    if (scenarioIntelligentSystem.startsWith('D') && projAllTerms.some(t => t.includes('tutor') || t.includes('retroalimentación') || t.includes('resolución'))) scenarioScore += 22;
    if (scenarioIntelligentSystem.startsWith('F') && projAllTerms.some(t => t.includes('pensamiento crítico') || t.includes('resolución de problemas'))) scenarioScore += 22;
    if (scenarioIntelligentSystem.startsWith('G') && projAllTerms.some(t => t.includes('autorregulado') || t.includes('autónomo') || t.includes('metacogn'))) scenarioScore += 22;

    // Q13: Reto cultural colaborativo
    if (projAllTerms.some(t => t.includes('cultural') || t.includes('identidad') || t.includes('rural') || t.includes('botánica') || t.includes('comunidad'))) {
      scenarioScore += 22;
    }

    scenarioScore = Math.min(100, scenarioScore);

    // D. Ideas Propias del Estudiante (Q16, Q17, Q18, Q20) - 20%
    let ideaScore = 40;
    const keywordsBank = [
      'conocimiento', 'aprendizaje', 'tutor', 'inteligencia artificial', 'ia', 'retroalimentación',
      'crítico', 'evaluación', 'modelo', 'datos', 'escuela', 'docente', 'estudiante', 'cultura',
      'coil', 'lenguaje', 'llm', 'chatgpt', 'gemelo', 'simulación', 'programación', 'algoritmo',
      'código', 'error', 'dificultad', 'predecir', 'intervención', 'metacognición', 'rural', 'córdoba'
    ];

    let ideaMatches = 0;
    keywordsBank.forEach(kw => {
      if (combinedIdeaText.includes(kw)) {
        if (projAllTerms.some(t => t.includes(kw))) {
          ideaMatches += 1;
        }
      }
    });

    if (combinedIdeaText.length > 20) {
      ideaScore = Math.min(100, 45 + ideaMatches * 7);
    }

    // E. Proyectos seleccionados explícitamente (Q19) y Expectativas (Q22) - 10%
    const isSelected = selectedLabSIEProjects.some(sp => sp.toLowerCase().includes(project.id.toLowerCase()) || sp.toLowerCase().includes(project.code.toLowerCase()) || sp.toLowerCase().includes(project.title.toLowerCase().slice(0, 15)));
    let selectedScore = isSelected ? 95 : 45;

    // F. Experiencia y Trayectoria Técnica (Q4, Q5, Q6) - 10%
    let experienceScore = 50;
    const techExp = profile.techExperience || '';
    const aiExp = profile.aiExperience || '';
    const resExp = profile.researchExperience || '';

    if (techExp.includes('Muy avanzado') || techExp.includes('Avanzado')) experienceScore += 25;
    else if (techExp.includes('Intermedio')) experienceScore += 15;

    if (aiExp.includes('Habitualmente') || aiExp.includes('Frecuentemente')) experienceScore += 25;
    else if (aiExp.includes('Ocasionalmente')) experienceScore += 15;

    if (resExp.includes('proyecto') || resExp.includes('experiencia')) experienceScore += 20;

    experienceScore = Math.min(100, experienceScore);

    // Ponderación oficial:
    // Intereses (25%), Actividades (15%), Escenarios (20%), Ideas propias (20%), Seleccionados (10%), Experiencia (10%)
    const totalAffinity = Math.round(
      interestScore * 0.25 +
      waysScore * 0.15 +
      scenarioScore * 0.20 +
      ideaScore * 0.20 +
      selectedScore * 0.10 +
      experienceScore * 0.10
    );

    // Matching concepts
    project.concepts.forEach(c => {
      const cLow = c.toLowerCase();
      if (
        curiosityQuestions.some(q => q.toLowerCase().includes(cLow.substring(0, 5))) ||
        aiInterests.some(ai => ai.toLowerCase().includes(cLow.substring(0, 5))) ||
        combinedIdeaText.includes(cLow.substring(0, 5)) ||
        projAllTerms.some(t => t.includes(cLow))
      ) {
        if (!matchingConceptsFound.includes(c)) {
          matchingConceptsFound.push(c);
        }
      }
    });

    let connectionReason = `Afinidad detectada en el eje de ${project.lineName}.`;
    if (isSelected && totalAffinity >= 75) {
      connectionReason = `Fuerte coincidencia entre tus intereses declarados en la Licenciatura en Informática y la memoria de este proyecto.`;
    } else if (totalAffinity >= 70) {
      connectionReason = `Correspondencia significativa con tu interés en ${project.concepts[0]} y tus elecciones situacionales.`;
    } else {
      connectionReason = `Alineación en aspectos didácticos y computacionales de ${project.concepts.slice(0, 2).join(' y ')}.`;
    }

    projectAffinities.push({
      project,
      totalAffinity,
      interestScore,
      waysScore,
      scenarioScore,
      ideaScore,
      selectedScore,
      experienceScore,
      connectionReason,
      matchingConcepts: matchingConceptsFound.slice(0, 4)
    });
  }

  // Sort descending by affinity
  projectAffinities.sort((a, b) => b.totalAffinity - a.totalAffinity);

  const topProject = projectAffinities[0];
  const secondProject = projectAffinities[1];
  const thirdProject = projectAffinities[2];

  // Overall correspondence score
  const correspondenceScore = Math.min(
    100,
    Math.round(topProject.totalAffinity * 0.6 + (secondProject ? secondProject.totalAffinity * 0.3 : 0) + (thirdProject ? thirdProject.totalAffinity * 0.1 : 0))
  );

  let correspondenceLevel: CorrespondenceLevel = 'Correspondencia exploratoria';
  if (correspondenceScore >= 80) correspondenceLevel = 'Alta correspondencia';
  else if (correspondenceScore >= 60) correspondenceLevel = 'Buena correspondencia';
  else if (correspondenceScore >= 40) correspondenceLevel = 'Correspondencia exploratoria';
  else correspondenceLevel = 'Baja correspondencia';

  // Determine Route Type based on Q21 (continuationPreference) and affinities:
  // 🧬 Profundizar -> HEREDAR
  // 🔗 Conectar -> CONECTAR
  // 🌱 Transformar / 💡 Crear -> TRASCENDER
  // 🧭 Explorar -> EXPLORAR
  let routeType: RouteType = 'HEREDAR';

  const pref = continuationPreference.toLowerCase();
  if (pref.includes('profundizar') && correspondenceScore >= 55) {
    routeType = 'HEREDAR';
  } else if (pref.includes('conectar') && correspondenceScore >= 50) {
    routeType = 'CONECTAR';
  } else if ((pref.includes('transformar') || pref.includes('crear')) && correspondenceScore >= 50) {
    routeType = 'TRASCENDER';
  } else if (pref.includes('explorar') || correspondenceScore < 45) {
    routeType = 'EXPLORAR';
  } else {
    // Fallback if not chosen or nuanced
    if (topProject.totalAffinity >= 75 && secondProject && secondProject.totalAffinity >= 72) {
      routeType = 'CONECTAR';
    } else if (topProject.totalAffinity >= 70) {
      routeType = 'HEREDAR';
    } else if (correspondenceScore >= 55) {
      routeType = 'TRASCENDER';
    } else {
      routeType = 'EXPLORAR';
    }
  }

  // Archetype: Prioritize Q15 choice if present
  let profileArchetype = 'El Explorador 🔎 · Descubridor Pedagógico';
  if (researcherArchetypes.length > 0) {
    profileArchetype = researcherArchetypes.slice(0, 2).join(' & ');
  } else if (preferredActivities.some(a => a.includes('datos') || a.includes('patrones'))) {
    profileArchetype = 'El Analista 📊 · Analítica de Datos y Knowledge Tracing';
  } else if (preferredActivities.some(a => a.includes('programar') || a.includes('aplicaciones'))) {
    profileArchetype = 'El Constructor 💻 · Arquitecto de Sistemas Inteligentes';
  } else if (preferredActivities.some(a => a.includes('actividades') || a.includes('interfaces'))) {
    profileArchetype = 'El Diseñador 🎨 · Diseñador de Experiencias y Tareas Pedagógicas';
  }

  // Interest percentages breakdown for visualization
  const interestPercentages: Record<string, number> = {
    'IA Educativa y Tutores': Math.min(96, Math.max(45, Math.round(topProject.interestScore * 0.95))),
    'Analítica y Knowledge Tracing': Math.min(95, Math.max(40, Math.round(topProject.waysScore * 0.9 + 10))),
    'Diseño Didáctico e Interfaces': Math.min(92, Math.max(35, Math.round(topProject.scenarioScore * 0.85 + 10))),
    'Metacognición y Modelos LLM': Math.min(90, Math.max(30, Math.round(topProject.experienceScore * 0.8 + 15))),
    'Colaboración e Interculturalidad': Math.min(88, Math.max(30, scenarioCulturalChallenge ? 85 : 45))
  };

  // Related projects list (max 3)
  const relatedProjects: RelatedProjectAffinity[] = projectAffinities.slice(0, 3).map(pa => ({
    projectId: pa.project.id,
    projectTitle: pa.project.title,
    projectCode: pa.project.code,
    affinity: pa.totalAffinity,
    connectionReason: pa.connectionReason,
    matchingConcepts: pa.matchingConcepts.length > 0 ? pa.matchingConcepts : pa.project.concepts.slice(0, 3)
  }));

  // Why explanation (2-4 academic paragraphs)
  const whyExplanation: string[] = [];
  const primaryProject = topProject.project;

  if (routeType === 'HEREDAR') {
    whyExplanation.push(
      `En la Licenciatura en Informática de la Universidad de Córdoba, tu perfil presenta una afinidad alta y concentrada con la investigación "${primaryProject.title}" (${primaryProject.code}), vinculada a la línea de ${primaryProject.lineName}. Tus respuestas en las actividades y situaciones demuestran que tu interés está en profundizar un problema que ya cuenta con base sólida en el semillero.`
    );
    whyExplanation.push(
      `En LabSIE, esta investigación cuenta con un marco teórico estructurado, preguntas abiertas formuladas y vías de continuidad directas (por ejemplo: transferir el modelo a nuevos cursos de programación o perfeccionar la retroalimentación en tiempo real). En lugar de empezar desde cero, te apoyas en la memoria viva de EduTLAN.`
    );
    whyExplanation.push(
      `La ruta HEREDAR te brinda la oportunidad de vincularte inmediatamente a un equipo de trabajo para continuar o validar una fase pendiente, lo cual es ideal para proyectar tu trabajo de grado en la licenciatura.`
    );
  } else if (routeType === 'CONECTAR') {
    const secProj = secondProject?.project;
    whyExplanation.push(
      `Tus respuestas y preferencias situacionales se sitúan en la intersección de dos investigaciones patrimoniales de LabSIE: "${primaryProject.title}" y "${secProj?.title}".`
    );
    whyExplanation.push(
      `El sistema detecta una complementariedad natural para un estudiante de Licenciatura en Informática: articular los avances en ${primaryProject.lineName} con los desarrollos de ${secProj?.lineName}. Tu interés en conectar ideas te permite ser el puente entre dos metodologías que se venían explorando en paralelo.`
    );
    whyExplanation.push(
      `Bajo la ruta CONECTAR, tu proyecto puede articular el diseño tecnológico con la mediación pedagógica situada, generando un aporte metodológico interdisciplinar con alto potencial de publicación.`
    );
  } else if (routeType === 'TRASCENDER') {
    whyExplanation.push(
      `Tus inquietudes sobre "${problemToInvestigate ? problemToInvestigate.slice(0, 80) + '...' : 'nuevos retos pedagógicos con tecnología'}" demuestran una mirada innovadora. Utilizas como trampolín las investigaciones de LabSIE pero proyectas tu indagación hacia un contexto, población o enfoque didáctico que aún no ha sido explorado en el semillero.`
    );
    whyExplanation.push(
      `Las líneas de investigación de EduTLAN te darán el rigor y las herramientas de evaluación, mientras tú aportas la formulación de una nueva problemática con anclaje regional o comunitario.`
    );
    whyExplanation.push(
      `La ruta TRASCENDER implica diseñar una nueva propuesta investigativa que crezca desde las raíces de LabSIE pero expanda su horizonte temático en la educación en informática.`
    );
  } else {
    // EXPLORAR
    whyExplanation.push(
      `Tu perfil se encuentra en una etapa exploratoria y abierta. Tus intereses aún no convergen de forma unívoca con las investigaciones activas de LabSIE, lo cual es completamente natural en las primeras etapas de formación investigativa.`
    );
    whyExplanation.push(
      `Esto no significa que tus ideas carezcan de valor. Al contrario: representa una oportunidad para participar en las sesiones formativas del semillero, conocer los semilleristas activos y delimitar una pregunta de investigación con el apoyo de un docente tutor.`
    );
    whyExplanation.push(
      `La ruta EXPLORAR te invita a agendar una sesión de orientación con el coordinador de LabSIE para explorar qué temáticas de la Licenciatura en Informática pueden conectar con tu curiosidad.`
    );
  }

  // Proposed Tentative Project
  const proposedProject = generateTentativeProposal(
    routeType,
    primaryProject,
    secondProject?.project,
    problemToInvestigate || dreamResearch || sixMonthsDiscovery,
    profile
  );

  return {
    id: `eval-${Date.now()}`,
    timestamp: new Date().toISOString(),
    algorithmVersion: ALGORITHM_VERSION,
    studentId: `std-${Date.now().toString().slice(-5)}`,
    studentProfile: profile,
    routeType,
    correspondenceScore,
    correspondenceLevel,
    profileArchetype,
    interestPercentages,
    dominantResearchWays: preferredActivities.length > 0 ? preferredActivities.slice(0, 4) : [firstActionOnProblem],
    primaryLineId: primaryProject.lineId,
    primaryLineName: primaryProject.lineName,
    relatedProjects,
    whyExplanation,
    whyBreakdown: {
      matchingInterests: curiosityQuestions.length > 0 ? curiosityQuestions.slice(0, 4) : aiInterests.slice(0, 4),
      matchingWays: preferredActivities.length > 0 ? preferredActivities.slice(0, 4) : [firstActionOnProblem],
      relatedConcepts: primaryProject.concepts.slice(0, 4),
      selectedProjectsCount: selectedLabSIEProjects.length,
      studentIdeaAnalysis: problemToInvestigate
        ? `Inquietud expresada: "${problemToInvestigate.slice(0, 110)}..."`
        : 'Inquietud latente para perfilar en entrevista.',
      detectedConnections: [
        `Línea prioritaria: ${primaryProject.lineName}`,
        secondProject ? `Línea complementaria: ${secondProject.project.lineName}` : 'Focalizado en una línea principal',
        `Preferencia declarada: ${continuationPreference || 'Abierta a orientación'}`
      ]
    },
    proposedProject,
    studentAnswers: answers
  };
}

function generateTentativeProposal(
  routeType: RouteType,
  p1: ResearchProject,
  p2: ResearchProject | undefined,
  idea: string,
  profile: any
): ProposedProject {
  const isIdeaPresent = idea && idea.trim().length > 10;
  const context = 'Estudiantes y docentes de la Licenciatura en Informática, Universidad de Córdoba (Colombia)';

  if (routeType === 'HEREDAR') {
    return {
      tentativeTitle: `Continuidad y profundización en ${p1.concepts[0] || 'la investigación'}: ampliación del andamiaje pedagógico en la Licenciatura en Informática`,
      tentativeQuestion: `¿Cómo pueden optimizarse las dimensiones de ${p1.concepts[0] || 'interacción'} identificadas en ${p1.code} para mejorar el aprendizaje autónomo en cursos de la Universidad de Córdoba?`,
      tentativeObjective: `Profundizar y validar una fase de continuidad del proyecto ${p1.code}, incorporando mecanismos refinados de seguimiento e intervención en el aula de informática.`,
      centralConcepts: [p1.concepts[0] || 'Investigación Educativa', p1.concepts[1] || 'Tecnología', 'Autonomía de Aprendizaje', 'Evaluación Formativa'],
      possibleContextPopulation: `Estudiantes de la Licenciatura en Informática, Universidad de Córdoba`,
      possibleContribution: `Aportar datos empíricos y adaptaciones metodológicas que den respuesta a una de las preguntas abiertas documentadas en la memoria del proyecto ${p1.code}.`,
      nextSteps: [
        `Revisión exhaustiva del informe técnico y repositorios del proyecto ${p1.code}.`,
        `Reunión de empalme con el investigador tutor responsable (${p1.leadResearcher || 'LabSIE'}).`,
        `Delimitación del alcance metodológico específico para el trabajo de grado o estancia semillero.`
      ],
      statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
    };
  }

  if (routeType === 'CONECTAR') {
    const conceptA = p1.concepts[0] || 'Inteligencia Artificial';
    const conceptB = p2 ? (p2.concepts[0] || 'Evaluación Pedagógica') : 'Knowledge Tracing';
    return {
      tentativeTitle: `Articulación de ${conceptA} y ${conceptB}: un marco integrado para la mediación didáctica en informática`,
      tentativeQuestion: `¿Cómo articular los modelos de ${conceptA} desarrollados en ${p1.code} con los principios de ${conceptB} de ${p2?.code || 'otra investigación LabSIE'} para generar una experiencia de aprendizaje personalizada en la Universidad de Córdoba?`,
      tentativeObjective: `Diseñar y evaluar una propuesta conceptual y metodológica que integre ${conceptA} y ${conceptB} en entornos de enseñanza de la programación.`,
      centralConcepts: [conceptA, conceptB, 'Integración Didáctica', 'Sistemas Inteligentes Adaptativos'],
      possibleContextPopulation: `${context}`,
      possibleContribution: `Crear un puente interdisciplinar dentro del semillero que conecte la analítica predictiva con la interacción pedagógica en tiempo real.`,
      nextSteps: [
        `Lectura cruzada de los marcos metodológicos de ambos proyectos (${p1.code} y ${p2?.code || 'P02'}).`,
        `Diseño del diagrama conceptual de integración bajo asesoría del equipo docente EduTLAN.`,
        `Formulación del anteproyecto de investigación conjunto.`
      ],
      statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
    };
  }

  if (routeType === 'TRASCENDER') {
    const focusIdea = isIdeaPresent ? idea.slice(0, 60) : 'nuevas mediaciones pedagógicas situadas';
    return {
      tentativeTitle: `Nuevos horizontes en ${p1.lineName}: ${focusIdea.replace(/[.,]/g, '')} en el contexto de la Licenciatura en Informática`,
      tentativeQuestion: `¿De qué manera los fundamentos investigativos de ${p1.lineName} pueden extenderse para dar respuesta a la problemática de: ${isIdeaPresent ? idea : 'las nuevas demandas del contexto educativo regional'}?`,
      tentativeObjective: `Formular y pilotear un enfoque investigativo emergente que aproveche la base metodológica de LabSIE para indagar sobre ${focusIdea}.`,
      centralConcepts: [p1.concepts[0] || 'Innovación Educativa', 'Contexto Situado', 'Nuevas Mediaciones', 'Apropiación Social'],
      possibleContextPopulation: `Estudiantes y comunidades educativas vinculadas a la Licenciatura en Informática (Universidad de Córdoba)`,
      possibleContribution: `Abrir una nueva vertiente investigativa dentro del grupo EduTLAN que vincule el rigor técnico con problemáticas emergentes de alta pertinencia social.`,
      nextSteps: [
        `Presentación de la idea en seminario interno de semilleristas de LabSIE.`,
        `Revisión del estado del arte en bases de datos indexadas (Scopus, WoS, SciELO).`,
        `Estructuración del problema de investigación con el comité de línea.`
      ],
      statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
    };
  }

  // EXPLORAR
  return {
    tentativeTitle: `Exploración y delimitación temática: articulación de intereses iniciales con las líneas de investigación de la Licenciatura en Informática`,
    tentativeQuestion: `¿Cuáles son las conexiones viables entre los intereses formativos del estudiante y los ejes epistemológicos del grupo de investigación EduTLAN?`,
    tentativeObjective: `Realizar un ejercicio de exploración documental y diálogo académico para delimitar un problema investigativo con pertinencia y viabilidad institucional.`,
    centralConcepts: ['Formación Investigativa', 'Exploración Vocacional Científica', 'Didáctica de la Informática'],
    possibleContextPopulation: `Estudiante en etapa de exploración investigativa (${profile.program}, Semestre ${profile.semester})`,
    possibleContribution: `Clarificar la vocación investigativa y definir si se perfila hacia una investigación formativa o un trabajo de grado interdisciplinar.`,
    nextSteps: [
      `Agendar entrevista de orientación con el coordinador de semillero LabSIE.`,
      `Participar como asistente en dos sesiones ordinarias del semillero para conocer los proyectos en curso.`,
      `Realizar una reevaluación o reformulación de la idea investigativa tras conocer el banco de problemas.`
    ],
    statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
  };
}
