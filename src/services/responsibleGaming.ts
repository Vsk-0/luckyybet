import { supabase } from '../supabaseClient';

/**
 * Serviço de Jogo Responsável
 * 
 * Implementa funcionalidades obrigatórias para conformidade legal:
 * - Limites de depósito
 * - Limites de aposta
 * - Autoexclusão
 * - Alertas de tempo de jogo
 * - Histórico de atividades
 */

export interface LimitesUsuario {
  limite_deposito_diario: number;
  limite_deposito_mensal: number;
  limite_aposta_diaria: number;
  limite_aposta_mensal: number;
  limite_perda_diaria: number;
  limite_perda_mensal: number;
  tempo_sessao_maximo: number; // em minutos
  autoexclusao_ate?: Date | null;
  alertas_habilitados: boolean;
}

export interface HistoricoAtividade {
  total_depositado_hoje: number;
  total_depositado_mes: number;
  total_apostado_hoje: number;
  total_apostado_mes: number;
  total_perdido_hoje: number;
  total_perdido_mes: number;
  tempo_sessao_atual: number; // em minutos
  ultima_atividade: Date;
}

/**
 * Limites padrão conforme boas práticas de jogo responsável
 */
export const LIMITES_PADRAO: LimitesUsuario = {
  limite_deposito_diario: 500,
  limite_deposito_mensal: 5000,
  limite_aposta_diaria: 300,
  limite_aposta_mensal: 3000,
  limite_perda_diaria: 200,
  limite_perda_mensal: 2000,
  tempo_sessao_maximo: 120, // 2 horas
  autoexclusao_ate: null,
  alertas_habilitados: true,
};

/**
 * Busca os limites configurados pelo usuário
 */
export const getLimitesUsuario = async (userId: string): Promise<LimitesUsuario> => {
  try {
    const { data, error } = await supabase
      .from('user_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Se não existir, retorna limites padrão
      return LIMITES_PADRAO;
    }

    return {
      limite_deposito_diario: data.limite_deposito_diario,
      limite_deposito_mensal: data.limite_deposito_mensal,
      limite_aposta_diaria: data.limite_aposta_diaria,
      limite_aposta_mensal: data.limite_aposta_mensal,
      limite_perda_diaria: data.limite_perda_diaria,
      limite_perda_mensal: data.limite_perda_mensal,
      tempo_sessao_maximo: data.tempo_sessao_maximo,
      autoexclusao_ate: data.autoexclusao_ate ? new Date(data.autoexclusao_ate) : null,
      alertas_habilitados: data.alertas_habilitados,
    };
  } catch (error) {
    console.error('Erro ao buscar limites do usuário:', error);
    return LIMITES_PADRAO;
  }
};

/**
 * Atualiza os limites do usuário
 * IMPORTANTE: Mudanças de limite só devem entrar em vigor após 24h (cooling-off period)
 */
export const atualizarLimites = async (
  userId: string,
  novosLimites: Partial<LimitesUsuario>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_limits')
      .upsert({
        user_id: userId,
        ...novosLimites,
        updated_at: new Date().toISOString(),
        // Limites mais restritivos entram em vigor imediatamente
        // Limites mais permissivos entram em vigor após 24h
        effective_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Registrar mudança de limites no log de auditoria
    await registrarAuditoria(userId, 'LIMITE_ALTERADO', novosLimites);

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar limites:', error);
    return { success: false, error: 'Erro ao atualizar limites' };
  }
};

/**
 * Verifica se o usuário pode realizar um depósito
 */
export const verificarLimiteDeposito = async (
  userId: string,
  valorDeposito: number
): Promise<{ permitido: boolean; motivo?: string; limiteRestante?: number }> => {
  try {
    const limites = await getLimitesUsuario(userId);
    const historico = await getHistoricoAtividade(userId);

    // Verifica limite diário
    const totalDepositoHoje = historico.total_depositado_hoje + valorDeposito;
    if (totalDepositoHoje > limites.limite_deposito_diario) {
      return {
        permitido: false,
        motivo: `Limite diário de depósito atingido. Limite: R$ ${limites.limite_deposito_diario.toFixed(2)}`,
        limiteRestante: limites.limite_deposito_diario - historico.total_depositado_hoje,
      };
    }

    // Verifica limite mensal
    const totalDepositoMes = historico.total_depositado_mes + valorDeposito;
    if (totalDepositoMes > limites.limite_deposito_mensal) {
      return {
        permitido: false,
        motivo: `Limite mensal de depósito atingido. Limite: R$ ${limites.limite_deposito_mensal.toFixed(2)}`,
        limiteRestante: limites.limite_deposito_mensal - historico.total_depositado_mes,
      };
    }

    return {
      permitido: true,
      limiteRestante: Math.min(
        limites.limite_deposito_diario - historico.total_depositado_hoje,
        limites.limite_deposito_mensal - historico.total_depositado_mes
      ),
    };
  } catch (error) {
    console.error('Erro ao verificar limite de depósito:', error);
    return { permitido: false, motivo: 'Erro ao verificar limites' };
  }
};

/**
 * Verifica se o usuário pode realizar uma aposta
 */
export const verificarLimiteAposta = async (
  userId: string,
  valorAposta: number
): Promise<{ permitido: boolean; motivo?: string }> => {
  try {
    const limites = await getLimitesUsuario(userId);
    const historico = await getHistoricoAtividade(userId);

    // Verifica autoexclusão
    if (limites.autoexclusao_ate && new Date() < limites.autoexclusao_ate) {
      return {
        permitido: false,
        motivo: `Conta em autoexclusão até ${limites.autoexclusao_ate.toLocaleDateString()}`,
      };
    }

    // Verifica limite diário de aposta
    const totalApostaHoje = historico.total_apostado_hoje + valorAposta;
    if (totalApostaHoje > limites.limite_aposta_diaria) {
      return {
        permitido: false,
        motivo: `Limite diário de aposta atingido. Limite: R$ ${limites.limite_aposta_diaria.toFixed(2)}`,
      };
    }

    // Verifica limite mensal de aposta
    const totalApostaMes = historico.total_apostado_mes + valorAposta;
    if (totalApostaMes > limites.limite_aposta_mensal) {
      return {
        permitido: false,
        motivo: `Limite mensal de aposta atingido. Limite: R$ ${limites.limite_aposta_mensal.toFixed(2)}`,
      };
    }

    // Verifica limite de perda diária
    const perdaHoje = historico.total_perdido_hoje + valorAposta;
    if (perdaHoje > limites.limite_perda_diaria) {
      return {
        permitido: false,
        motivo: `Limite diário de perda atingido. Considere fazer uma pausa.`,
      };
    }

    return { permitido: true };
  } catch (error) {
    console.error('Erro ao verificar limite de aposta:', error);
    return { permitido: false, motivo: 'Erro ao verificar limites' };
  }
};

/**
 * Busca histórico de atividades do usuário
 */
export const getHistoricoAtividade = async (userId: string): Promise<HistoricoAtividade> => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    // Buscar transações do dia
    const { data: transacoesHoje } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId)
      .gte('created_at', hoje.toISOString());

    // Buscar transações do mês
    const { data: transacoesMes } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId)
      .gte('created_at', inicioMes.toISOString());

    // Calcular totais
    let total_depositado_hoje = 0;
    let total_apostado_hoje = 0;
    let total_perdido_hoje = 0;

    transacoesHoje?.forEach((t) => {
      if (t.type === 'deposit') total_depositado_hoje += t.amount;
      if (t.type === 'bet') {
        total_apostado_hoje += t.amount;
        total_perdido_hoje += t.amount;
      }
      if (t.type === 'win') total_perdido_hoje -= t.amount;
    });

    let total_depositado_mes = 0;
    let total_apostado_mes = 0;
    let total_perdido_mes = 0;

    transacoesMes?.forEach((t) => {
      if (t.type === 'deposit') total_depositado_mes += t.amount;
      if (t.type === 'bet') {
        total_apostado_mes += t.amount;
        total_perdido_mes += t.amount;
      }
      if (t.type === 'win') total_perdido_mes -= t.amount;
    });

    return {
      total_depositado_hoje,
      total_depositado_mes,
      total_apostado_hoje,
      total_apostado_mes,
      total_perdido_hoje,
      total_perdido_mes,
      tempo_sessao_atual: 0, // Deve ser calculado no frontend
      ultima_atividade: new Date(),
    };
  } catch (error) {
    console.error('Erro ao buscar histórico de atividade:', error);
    return {
      total_depositado_hoje: 0,
      total_depositado_mes: 0,
      total_apostado_hoje: 0,
      total_apostado_mes: 0,
      total_perdido_hoje: 0,
      total_perdido_mes: 0,
      tempo_sessao_atual: 0,
      ultima_atividade: new Date(),
    };
  }
};

/**
 * Ativa autoexclusão para o usuário
 */
export const ativarAutoexclusao = async (
  userId: string,
  periodoEmDias: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + periodoEmDias);

    const { error } = await supabase
      .from('user_limits')
      .upsert({
        user_id: userId,
        autoexclusao_ate: dataExpiracao.toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Registrar no log de auditoria
    await registrarAuditoria(userId, 'AUTOEXCLUSAO_ATIVADA', {
      periodo_dias: periodoEmDias,
      expira_em: dataExpiracao,
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao ativar autoexclusão:', error);
    return { success: false, error: 'Erro ao ativar autoexclusão' };
  }
};

/**
 * Verifica se o usuário está em autoexclusão
 */
export const verificarAutoexclusao = async (userId: string): Promise<boolean> => {
  try {
    const limites = await getLimitesUsuario(userId);
    return limites.autoexclusao_ate !== null && new Date() < limites.autoexclusao_ate;
  } catch (error) {
    console.error('Erro ao verificar autoexclusão:', error);
    return false;
  }
};

/**
 * Registra evento no log de auditoria
 */
const registrarAuditoria = async (
  userId: string,
  evento: string,
  dados?: any
): Promise<void> => {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      event_type: evento,
      event_data: dados,
      ip_address: '', // Deve ser capturado no backend
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
  }
};

/**
 * Gera relatório de atividades do usuário (para conformidade)
 */
export const gerarRelatorioAtividades = async (
  userId: string,
  dataInicio: Date,
  dataFim: Date
): Promise<any> => {
  try {
    const { data: transacoes } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', dataInicio.toISOString())
      .lte('created_at', dataFim.toISOString())
      .order('created_at', { ascending: false });

    const { data: limites } = await supabase
      .from('user_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    return {
      periodo: {
        inicio: dataInicio,
        fim: dataFim,
      },
      transacoes: transacoes || [],
      limites_configurados: limites,
      total_transacoes: transacoes?.length || 0,
    };
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return null;
  }
};
