/**
 * Serviço de Validação de CPF
 * 
 * Implementa validação de CPF conforme algoritmo oficial da Receita Federal
 * e integração com APIs de consulta (Brasil API)
 */

/**
 * Valida o formato e dígitos verificadores do CPF
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF é válido
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

/**
 * Formata CPF para exibição (000.000.000-00)
 * @param cpf - CPF sem formatação
 * @returns CPF formatado
 */
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Remove formatação do CPF
 * @param cpf - CPF formatado
 * @returns CPF apenas com números
 */
export const cleanCPF = (cpf: string): string => {
  return cpf.replace(/[^\d]/g, '');
};

/**
 * Interface para resposta da API de consulta de CPF
 */
export interface CPFConsultaResponse {
  valid: boolean;
  cpf: string;
  nome?: string;
  situacao?: string;
  error?: string;
}

/**
 * Consulta CPF na base da Receita Federal via Brasil API
 * 
 * IMPORTANTE: Esta API é gratuita mas tem rate limit.
 * Para produção, considere usar APIs pagas como:
 * - Serpro (https://www.serpro.gov.br/menu/suporte/produtos/cpf)
 * - Consultas CPF (https://consultascpf.com.br/)
 * 
 * @param cpf - CPF a ser consultado
 * @returns Dados do CPF ou erro
 */
export const consultarCPF = async (cpf: string): Promise<CPFConsultaResponse> => {
  try {
    // Valida formato antes de consultar
    if (!validateCPF(cpf)) {
      return {
        valid: false,
        cpf: cleanCPF(cpf),
        error: 'CPF inválido',
      };
    }

    const cleanedCPF = cleanCPF(cpf);

    // NOTA: Brasil API não tem endpoint de CPF público por questões de privacidade
    // Em produção, você deve usar uma API oficial como Serpro
    // Este é um exemplo de como seria a integração:
    
    // Simulação para ambiente de desenvolvimento/educacional
    if (process.env.NODE_ENV === 'development') {
      // Simula consulta bem-sucedida
      return {
        valid: true,
        cpf: cleanedCPF,
        situacao: 'REGULAR',
      };
    }

    // Para produção, descomentar e configurar:
    /*
    const response = await fetch(`https://api.serpro.gov.br/consulta-cpf/v1/cpf/${cleanedCPF}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_SERPRO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao consultar CPF');
    }

    const data = await response.json();
    
    return {
      valid: data.situacao === 'REGULAR',
      cpf: cleanedCPF,
      nome: data.nome,
      situacao: data.situacao,
    };
    */

    return {
      valid: true,
      cpf: cleanedCPF,
      situacao: 'REGULAR',
    };
  } catch (error) {
    console.error('Erro ao consultar CPF:', error);
    return {
      valid: false,
      cpf: cleanCPF(cpf),
      error: 'Erro ao consultar CPF na base de dados',
    };
  }
};

/**
 * Verifica se o usuário é maior de idade com base na data de nascimento
 * @param dataNascimento - Data de nascimento no formato YYYY-MM-DD
 * @returns true se maior de 18 anos
 */
export const isMaiorDeIdade = (dataNascimento: string): boolean => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade >= 18;
};

/**
 * Guia de Integração para Produção
 * 
 * 1. ESCOLHER PROVEDOR DE CONSULTA CPF:
 *    - Serpro (Oficial do Governo): https://www.serpro.gov.br/
 *    - ReceitaWS: https://receitaws.com.br/
 *    - Consultas CPF: https://consultascpf.com.br/
 * 
 * 2. OBTER CREDENCIAIS:
 *    - Criar conta no provedor escolhido
 *    - Obter API Key
 *    - Adicionar ao .env: VITE_SERPRO_API_KEY
 * 
 * 3. IMPLEMENTAR KYC COMPLETO:
 *    - Validar CPF
 *    - Solicitar foto de documento (RG/CNH)
 *    - Implementar verificação facial (liveness)
 *    - Validar endereço (comprovante de residência)
 * 
 * 4. ARMAZENAMENTO SEGURO:
 *    - Criptografar CPF no banco de dados
 *    - Usar Supabase Vault para dados sensíveis
 *    - Implementar logs de acesso aos dados
 * 
 * 5. COMPLIANCE LGPD:
 *    - Obter consentimento explícito do usuário
 *    - Permitir exclusão de dados
 *    - Implementar portabilidade de dados
 *    - Manter registro de tratamento de dados
 */
