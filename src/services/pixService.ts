import { supabase } from '../supabaseClient';

/**
 * Serviço de Integração PIX
 * 
 * Este serviço está preparado para integração com gateways de pagamento reais.
 * Atualmente usa simulação, mas a estrutura permite fácil migração para APIs como:
 * - Mercado Pago (https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/pix)
 * - PagSeguro (https://dev.pagseguro.uol.com.br/reference/pix-intro)
 * - Asaas (https://docs.asaas.com/reference/criar-nova-cobranca)
 * - OpenPix (https://developers.openpix.com.br/)
 */

export interface PixPaymentRequest {
  userId: string;
  isKycVerified: boolean;
  amount: number;
  description: string;
  userEmail: string;
}

export interface PixPaymentResponse {
  success: boolean;
  transactionId?: string;
  pixKey?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  expiresAt?: Date;
  error?: string;
}

export interface PixWebhookPayload {
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  paidAt?: Date;
}

/**
 * Gera um QR Code PIX para pagamento
 * 
 * PRODUÇÃO: Substituir por chamada à API do gateway escolhido
 * Exemplo com Mercado Pago:
 * ```typescript
 * const response = await fetch('https://api.mercadopago.com/v1/payments', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify({
 *     transaction_amount: amount,
 *     description: description,
 *     payment_method_id: 'pix',
 *     payer: { email: userEmail },
 *   }),
 * });
 * ```
 */
export const generatePixPayment = async (
  request: PixPaymentRequest
): Promise<PixPaymentResponse> => {
  // 1. VERIFICAÇÃO DE KYC
  if (!request.isKycVerified) {
    return {
      success: false,
      error: 'KYC não verificado. Por favor, complete a verificação de identidade para depositar.',
    };
  }

  try {
    // SIMULAÇÃO: Em produção, fazer chamada à API do gateway
    const simulatedTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const simulatedPixKey = process.env.VITE_PIX_KEY || 'chave-pix-luckyybet@exemplo.com';
    
    // Simular QR Code (em produção, virá da API)
    const simulatedQrCode = `00020126580014br.gov.bcb.pix0136${simulatedPixKey}520400005303986540${request.amount.toFixed(2)}5802BR5913LuckyYBet6009SAO PAULO62070503***6304`;
    
    // Registrar a transação pendente no banco de dados
    const { error: depositError } = await supabase
      .from('deposit_requests')
      .insert([
        {
          user_id: request.userId,
          amount: request.amount,
          pix_key: simulatedPixKey,
          status: 'pending',
          transaction_id: simulatedTransactionId,
          qr_code: simulatedQrCode,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
        },
      ])
      .select()
      .single();

    if (depositError) {
      console.error('Erro ao registrar depósito:', depositError);
      return {
        success: false,
        error: 'Falha ao gerar pagamento PIX',
      };
    }

    // Adicionar transação pendente no histórico
    await supabase
      .from('transactions')
      .insert([
        {
          user_id: request.userId,
          type: 'deposit',
          amount: request.amount,
          description: `Depósito PIX - ${request.description}`,
          status: 'pending',
        },
      ]);

    return {
      success: true,
      transactionId: simulatedTransactionId,
      pixKey: simulatedPixKey,
      qrCode: simulatedQrCode,
      qrCodeBase64: btoa(simulatedQrCode), // Em produção, usar imagem real
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    };
  } catch (error) {
    console.error('Erro ao gerar pagamento PIX:', error);
    return {
      success: false,
      error: 'Erro inesperado ao processar pagamento',
    };
  }
};

/**
 * Verifica o status de um pagamento PIX
 * 
 * PRODUÇÃO: Consultar API do gateway
 * Exemplo com Mercado Pago:
 * ```typescript
 * const response = await fetch(`https://api.mercadopago.com/v1/payments/${transactionId}`, {
 *   headers: {
 *     'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
 *   },
 * });
 * ```
 */
export const checkPixPaymentStatus = async (
  transactionId: string
): Promise<'pending' | 'approved' | 'rejected'> => {
  try {
    // SIMULAÇÃO: Em produção, consultar API do gateway
    const { data, error } = await supabase
      .from('deposit_requests')
      .select('status')
      .eq('transaction_id', transactionId)
      .single();

    if (error || !data) {
      return 'pending';
    }

    return data.status as 'pending' | 'approved' | 'rejected';
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return 'pending';
  }
};

/**
 * Processa webhook de confirmação de pagamento
 * 
 * PRODUÇÃO: Esta função deve ser chamada por uma Edge Function do Supabase
 * ou API backend que recebe webhooks do gateway de pagamento
 * 
 * Configuração de webhook (exemplo Mercado Pago):
 * URL: https://seu-dominio.com/api/webhooks/pix
 * Eventos: payment.created, payment.updated
 */
export const processPixWebhook = async (
  payload: PixWebhookPayload
): Promise<boolean> => {
  try {
    if (payload.status !== 'approved') {
      return false;
    }

    // Buscar a solicitação de depósito
    const { data: depositRequest, error: fetchError } = await supabase
      .from('deposit_requests')
      .select('*')
      .eq('transaction_id', payload.transactionId)
      .single();

    if (fetchError || !depositRequest) {
      console.error('Depósito não encontrado:', payload.transactionId);
      return false;
    }

    // Atualizar status da solicitação
    await supabase
      .from('deposit_requests')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('transaction_id', payload.transactionId);

    // Atualizar saldo do usuário
    const { data: userData } = await supabase
      .from('users')
      .select('balance')
      .eq('id', depositRequest.user_id)
      .single();

    if (userData) {
      await supabase
        .from('users')
        .update({ 
          balance: userData.balance + payload.amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', depositRequest.user_id);
    }

    // Atualizar transação no histórico
    await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('user_id', depositRequest.user_id)
      .eq('type', 'deposit')
      .eq('amount', payload.amount)
      .eq('status', 'pending');

    return true;
  } catch (error) {
    console.error('Erro ao processar webhook PIX:', error);
    return false;
  }
};

/**
 * Cancela um pagamento PIX pendente
 */
export const cancelPixPayment = async (transactionId: string): Promise<boolean> => {
  try {
    await supabase
      .from('deposit_requests')
      .update({ status: 'rejected' })
      .eq('transaction_id', transactionId);

    return true;
  } catch (error) {
    console.error('Erro ao cancelar pagamento:', error);
    return false;
  }
};

/**
 * Guia de Integração para Produção
 * 
 * 1. ESCOLHER GATEWAY DE PAGAMENTO:
 *    - Mercado Pago: Mais popular, taxas competitivas (R$ 0,99 + 0,99%)
 *    - OpenPix: Focado em desenvolvedores, API simples
 *    - Asaas: Bom para automação de cobranças
 * 
 * 2. OBTER CREDENCIAIS:
 *    - Criar conta no gateway escolhido
 *    - Obter Access Token / API Key
 *    - Adicionar ao .env: VITE_PAYMENT_GATEWAY_TOKEN
 * 
 * 3. CONFIGURAR WEBHOOK:
 *    - Criar Edge Function no Supabase para receber webhooks
 *    - Configurar URL no painel do gateway
 *    - Validar assinatura do webhook para segurança
 * 
 * 4. IMPLEMENTAR VALIDAÇÕES:
 *    - Verificar valor mínimo/máximo
 *    - Validar duplicação de pagamentos
 *    - Implementar retry logic para falhas
 * 
 * 5. COMPLIANCE:
 *    - Implementar KYC (Know Your Customer) se necessário
 *    - Adicionar logs de auditoria
 *    - Seguir regulamentações do Banco Central
 */
