export type Grade = 'MANA' | 'MPA' | 'MA' | number;

// Tipos e Interfaces

export interface AcademicMetrics {
    studentCpf: string;
    studentName: string;
    classId: string;
    mediaParcial: number;
    reprovadoPorFalta: boolean;
    reprovacoesAnteriores: number; 
    frequenciaPercentual: number; 
}

export interface StatusColor {
    cor: 'Verde' | 'Laranja' | 'Vermelho';
    status: string;
    motivos: { descricao: string; detalhe: string }[];
    observacao?: string;
}

//FUNÇÕES AUXILIARES (Simuladas por hora, trocar futuramente)

interface Thresholds {
    LIMITE_APROVACAO_NOTA: number;
    LIMITE_CRITICO_NOTA: number;
    LIMITE_REPROVACAO_FREQ: number; 
    LIMITE_ALERTA_FREQ: number;     
}

const CONCEPTUAL_GRADE_MAP: { [key: string]: number } = {
    'MA': 10.0, 
    'MPA': 7.0, 
    'MANA': 4.0 
};

// Simula Converter notas
export function convertGradeToNumeric(grade: Grade): number | null {
    if (typeof grade === 'number') {
        return grade;
    }
    const gradeStr = String(grade).toUpperCase(); 
    const numericValue = CONCEPTUAL_GRADE_MAP[gradeStr];
    if (numericValue !== undefined) {
        return numericValue;
    }
    return null; 
}


// Simula a busca de metricas da turma
export function getApprovalThresholds(classId: string): Thresholds {
    return {
        LIMITE_APROVACAO_NOTA: 7.0,
        LIMITE_CRITICO_NOTA: 5.0,
        LIMITE_REPROVACAO_FREQ: 0.75,
        LIMITE_ALERTA_FREQ: 0.80      
    };
}

// Simula a busca de reprovações anteriores
export function getActualPreviousFailuresCount(studentCpf: string, currentClassId: string): number {
    // Simulação: CPFs que disparam reprovações (>= 2)
    const FAILED_STUDENT_CPFS_SIMULATION = ['11122233344', '55566677788']; 
    // Simulação: CPFs que disparam Laranja (1 reprovação)
    const ALERT_STUDENT_CPFS_SIMULATION = ['99988877766']; 
    
    if (FAILED_STUDENT_CPFS_SIMULATION.includes(studentCpf)) {
        return 2; 
    }
    if (ALERT_STUDENT_CPFS_SIMULATION.includes(studentCpf)) {
        return 1; 
    }
    
    return 0; 
}


// Função principal
export const getClassificacaoAcademica = (metrics: AcademicMetrics): StatusColor => {

    const { studentCpf, classId, mediaParcial, reprovadoPorFalta, reprovacoesAnteriores, frequenciaPercentual } = metrics;
    
    const thresholds = getApprovalThresholds(classId); 

    const motivos: { descricao: string; detalhe: string }[] = [];
    let cor: 'Verde' | 'Laranja' | 'Vermelho' = 'Verde';
    let status: string = 'Situação Acadêmica Segura';
    let observacao: string | undefined = undefined;

    // 1 Critério VERMELHO 
    // Reprovado por Falta OU Nota Baixa Crítica OU Reprovações Anteriores Críticas (>= 2)
    if (reprovadoPorFalta || mediaParcial < thresholds.LIMITE_CRITICO_NOTA || reprovacoesAnteriores >= 2) {

        cor = 'Vermelho';
        status = 'Risco Crítico / Situação Irreversível';
        
        if (reprovadoPorFalta) {
            motivos.push({ descricao: `Frequência`, detalhe: 'Abaixo do limite de reprovação por falta' });
        }
        if (mediaParcial < thresholds.LIMITE_CRITICO_NOTA) {
            motivos.push({ descricao: `Nota Média Parcial ${mediaParcial.toFixed(1)}`, detalhe: 'Abaixo da nota de corte e do limite de recuperação' });
        }
        if (reprovacoesAnteriores >= 1) { // Motivo aparece se houver histórico de reprovação
             motivos.push({ descricao: `Reprovações Anteriores (${reprovacoesAnteriores})`, detalhe: `${reprovacoesAnteriores} reprovação(ões) detectada(s) em disciplinas pré-requisito` });
        }
        return { cor, status, motivos, observacao }; 
    }

    // 2 Critério LARANJA (Alerta)
    // Nota Abaixo da Média de Aprovação OU 1 Reprovação Anterior OU Frequência em Zona de Alerta
    if (mediaParcial < thresholds.LIMITE_APROVACAO_NOTA || reprovacoesAnteriores === 1 || frequenciaPercentual <= thresholds.LIMITE_ALERTA_FREQ) {
        cor = 'Laranja';
        status = 'Situação de Alerta';
        
        if (mediaParcial < thresholds.LIMITE_APROVACAO_NOTA) {
            motivos.push({ descricao: `Nota Média Parcial ${mediaParcial.toFixed(1)}`, detalhe: 'Abaixo da média de aprovação, mas com potencial de recuperação' });
            observacao = 'Ainda há avaliações a serem realizadas, com chance de reversão do status para Verde';
        }

        if (reprovacoesAnteriores === 1) {
            motivos.push({ descricao: `Reprovações Anteriores (${reprovacoesAnteriores})`, detalhe: `${reprovacoesAnteriores} reprovação detectada em pré-requisito (Alerta)` });
        }
        
        if (frequenciaPercentual <= thresholds.LIMITE_ALERTA_FREQ) { // Ex: Frequência entre 75% e 80%
            motivos.push({ descricao: `Frequência ${Math.round(frequenciaPercentual * 100)}%`, detalhe: 'Próximo do limite de reprovação por falta' });
        }
        
        if (reprovacoesAnteriores < 1) {
            motivos.push({ descricao: `Reprovações Anteriores`, detalhe: 'Nenhuma reprovação detectada em pré-requisitos' });
        }

        return { cor, status, motivos, observacao };
    }
    
    // 3 Critério VERDE (Seguro)
    motivos.push({ descricao: `Nota Média Parcial ${mediaParcial.toFixed(1)}`, detalhe: 'Dentro da média de aprovação exigida' });
    motivos.push({ descricao: `Frequência ${Math.round(frequenciaPercentual * 100)}%`, detalhe: 'Acima do limite de aprovação por frequência' });
    motivos.push({ descricao: `Reprovações Anteriores`, detalhe: 'Nenhuma reprovação detectada em pré-requisitos' });

    return { cor, status, motivos, observacao };
};