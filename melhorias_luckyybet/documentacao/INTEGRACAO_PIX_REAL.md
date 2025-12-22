# 🔐 Guia de Integração PIX Real para Produção

Este documento fornece instruções detalhadas para integrar um gateway de pagamento PIX real ao LuckyYBet, preparando o sistema para oficialização governamental.

---

## 📋 Índice

1. [Escolha do Gateway de Pagamento](#escolha-do-gateway)
2. [Integração com OpenPix (Recomendado para Educacional)](#integracao-openpix)
3. [Integração com Mercado Pago (Mais Popular)](#integracao-mercadopago)
4. [Configuração de Webhooks](#configuracao-webhooks)
5. [Implementação no Frontend](#implementacao-frontend)
6. [Implementação no Backend (Supabase Edge Functions)](#implementacao-backend)
7. [Testes e Homologação](#testes)
8. [Compliance e Segurança](#compliance)

---

## 🏦 1. Escolha do Gateway de Pagamento {#escolha-do-gateway}

### Comparação de Gateways

| Gateway | Taxa | Aprovação | Facilidade | Recomendado Para |
|---------|------|-----------|------------|------------------|
| **OpenPix** | 0,99% | ~95% | ⭐⭐⭐⭐⭐ | Educacional, Startups |
| **Mercado Pago** | R$ 0,99 + 0,99% | ~98% | ⭐⭐⭐⭐ | Produção, Alto Volume |
| **Asaas** | 1,49% | ~96% | ⭐⭐⭐⭐ | Cobranças Recorrentes |
| **PagSeguro** | 1,99% | ~97% | ⭐⭐⭐ | E-commerce Tradicional |

### Recomendação para Concurso Escolar

**OpenPix** é a melhor escolha porque:
- ✅ API simples e bem documentada
- ✅ Sandbox gratuito para testes
- ✅ Suporte a webhooks em tempo real
- ✅ Sem mensalidade
- ✅ Ideal para projetos educacionais

---

## 🚀 2. Integração com OpenPix {#integracao-openpix}

### Passo 1: Criar Conta

1. Acesse [OpenPix](https://openpix.com.br)
2. Crie uma conta gratuita
3. Valide seu email

### Passo 2: Obter Credenciais

1. Acesse o [Dashboard](https://app.openpix.com.br)
2. Vá em **Configurações > API**
3. Copie o **App ID** (para sandbox e produção)

### Passo 3: Configurar Variáveis de Ambiente

Adicione ao arquivo `.env`:

```env
# OpenPix
VITE_OPENPIX_APP_ID=seu-app-id-aqui
VITE_OPENPIX_ENVIRONMENT=sandbox  # ou 'production'
```

### Passo 4: Instalar Dependências

```bash
pnpm add @openpix/sdk
```

### Passo 5: Atualizar `pixService.ts`

Substitua o conteúdo de `src/services/pixService.ts`:

```typescript
import { OpenPixClient } from '@openpix/sdk';

const client = new OpenPixClient({
  appId: import.meta.env.VITE_OPENPIX_APP_ID,
  environment: import.meta.env.VITE_OPENPIX_ENVIRONMENT || 'sandbox',
});

export const generatePixPayment = async (request: PixPaymentRequest): Promise<PixPaymentResponse> => {
  try {
    // Criar cobrança PIX
    const charge = await client.charge.create({
      correlationID: `${request.userId}_${Date.now()}`,
      value: Math.round(request.amount * 100), // Valor em centavos
      comment: request.description,
      customer: {
        email: request.userEmail,
      },
      expiresIn: 1800, // 30 minutos
    });

    // Registrar no banco de dados
    const { data: depositData, error: depositError } = await supabase
      .from('deposit_requests')
      .insert([
        {
          user_id: request.userId,
          amount: request.amount,
          pix_key: charge.pixKey,
          status: 'pending',
          transaction_id: charge.correlationID,
          qr_code: charge.brCode,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
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

    return {
      success: true,
      transactionId: charge.correlationID,
      pixKey: charge.pixKey,
      qrCode: charge.brCode,
      qrCodeBase64: charge.qrCodeImage, // Imagem base64 do QR Code
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

export const checkPixPaymentStatus = async (transactionId: string): Promise<'pending' | 'approved' | 'rejected'> => {
  try {
    const charge = await client.charge.get(transactionId);
    
    if (charge.status === 'COMPLETED') {
      return 'approved';
    } else if (charge.status === 'EXPIRED') {
      return 'rejected';
    }
    
    return 'pending';
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return 'pending';
  }
};
```

---

## 💳 3. Integração com Mercado Pago {#integracao-mercadopago}

### Passo 1: Criar Conta

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma conta de desenvolvedor
3. Valide sua identidade

### Passo 2: Obter Credenciais

1. Acesse **Suas integrações > Credenciais**
2. Copie o **Access Token** de teste e produção

### Passo 3: Configurar Variáveis de Ambiente

```env
# Mercado Pago
VITE_MERCADOPAGO_ACCESS_TOKEN=seu-access-token-aqui
VITE_MERCADOPAGO_PUBLIC_KEY=sua-public-key-aqui
```

### Passo 4: Instalar SDK

```bash
pnpm add mercadopago
```

### Passo 5: Implementar Integração

```typescript
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN,
});

export const generatePixPayment = async (request: PixPaymentRequest): Promise<PixPaymentResponse> => {
  try {
    const payment = await mercadopago.payment.create({
      transaction_amount: request.amount,
      description: request.description,
      payment_method_id: 'pix',
      payer: {
        email: request.userEmail,
      },
    });

    const qrCode = payment.body.point_of_interaction.transaction_data.qr_code;
    const qrCodeBase64 = payment.body.point_of_interaction.transaction_data.qr_code_base64;

    // Registrar no banco...

    return {
      success: true,
      transactionId: payment.body.id.toString(),
      pixKey: qrCode,
      qrCode: qrCode,
      qrCodeBase64: qrCodeBase64,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    };
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return {
      success: false,
      error: 'Erro ao processar pagamento',
    };
  }
};
```

---

## 🔔 4. Configuração de Webhooks {#configuracao-webhooks}

Webhooks são essenciais para receber notificações automáticas de pagamento.

### Passo 1: Criar Edge Function no Supabase

Crie um arquivo `supabase/functions/pix-webhook/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  try {
    // Verificar assinatura do webhook (IMPORTANTE!)
    const signature = req.headers.get('x-openpix-signature');
    // Implementar validação de assinatura aqui

    const payload = await req.json();

    // Processar evento de pagamento
    if (payload.event === 'OPENPIX:CHARGE_COMPLETED') {
      const charge = payload.charge;

      // Buscar depósito pendente
      const { data: deposit } = await supabase
        .from('deposit_requests')
        .select('*')
        .eq('transaction_id', charge.correlationID)
        .single();

      if (!deposit) {
        return new Response('Depósito não encontrado', { status: 404 });
      }

      // Atualizar status do depósito
      await supabase
        .from('deposit_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('transaction_id', charge.correlationID);

      // Atualizar saldo do usuário
      const { data: user } = await supabase
        .from('users')
        .select('balance')
        .eq('id', deposit.user_id)
        .single();

      await supabase
        .from('users')
        .update({
          balance: user.balance + deposit.amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', deposit.user_id);

      // Atualizar transação
      await supabase
        .from('transactions')
        .update({ status: 'completed' })
        .eq('user_id', deposit.user_id)
        .eq('type', 'deposit')
        .eq('amount', deposit.amount)
        .eq('status', 'pending');

      return new Response('Webhook processado com sucesso', { status: 200 });
    }

    return new Response('Evento não tratado', { status: 200 });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return new Response('Erro interno', { status: 500 });
  }
});
```

### Passo 2: Deploy da Edge Function

```bash
# Instalar Supabase CLI
pnpm add -g supabase

# Login
supabase login

# Deploy
supabase functions deploy pix-webhook
```

### Passo 3: Configurar Webhook no Gateway

**OpenPix:**
1. Acesse **Configurações > Webhooks**
2. Adicione a URL: `https://seu-projeto.supabase.co/functions/v1/pix-webhook`
3. Selecione eventos: `OPENPIX:CHARGE_COMPLETED`

**Mercado Pago:**
1. Acesse **Suas integrações > Webhooks**
2. Adicione a URL do webhook
3. Selecione eventos: `payment.created`, `payment.updated`

---

## 🎨 5. Implementação no Frontend {#implementacao-frontend}

### Atualizar `DepositPage.tsx`

```typescript
// Exibir QR Code real
<div className="bg-white p-6 rounded-lg mb-6 flex justify-center">
  <img 
    src={`data:image/png;base64,${pixData.qrCodeBase64}`} 
    alt="QR Code PIX" 
    className="w-64 h-64"
  />
</div>
```

### Adicionar Polling de Status

```typescript
useEffect(() => {
  if (!pixData) return;

  const interval = setInterval(async () => {
    const status = await checkPixPaymentStatus(pixData.transactionId);
    
    if (status === 'approved') {
      clearInterval(interval);
      toast.success('Pagamento confirmado!');
      navigate('/dashboard');
    } else if (status === 'rejected') {
      clearInterval(interval);
      toast.error('Pagamento expirado');
      setPixData(null);
    }
  }, 5000); // Verificar a cada 5 segundos

  return () => clearInterval(interval);
}, [pixData]);
```

---

## 🧪 6. Testes e Homologação {#testes}

### Ambiente Sandbox

1. **OpenPix**: Use o App ID de sandbox
2. **Mercado Pago**: Use credenciais de teste

### Testes Recomendados

- [ ] Gerar QR Code PIX
- [ ] Copiar código PIX
- [ ] Simular pagamento no sandbox
- [ ] Verificar webhook recebido
- [ ] Confirmar atualização de saldo
- [ ] Testar expiração de pagamento
- [ ] Testar múltiplos pagamentos simultâneos
- [ ] Testar limites de depósito

### Ferramentas de Teste

- **Webhook.site**: Testar recebimento de webhooks
- **Postman**: Testar APIs manualmente
- **Supabase Logs**: Monitorar Edge Functions

---

## 🔒 7. Compliance e Segurança {#compliance}

### Checklist de Segurança

- [ ] **Validar assinatura de webhooks** (evitar fraudes)
- [ ] **Usar HTTPS** em todas as comunicações
- [ ] **Não expor credenciais** no frontend
- [ ] **Implementar rate limiting** (evitar spam)
- [ ] **Criptografar dados sensíveis** no banco
- [ ] **Logs de auditoria** para todas as transações
- [ ] **Implementar retry logic** para falhas
- [ ] **Monitorar transações suspeitas**

### Validação de Assinatura (OpenPix)

```typescript
import crypto from 'crypto';

function validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
}
```

### Conformidade Legal

- [ ] **KYC**: Validar identidade de usuários
- [ ] **Limites de transação**: Implementar limites diários/mensais
- [ ] **Jogo responsável**: Sistema de autoexclusão
- [ ] **LGPD**: Política de privacidade e consentimento
- [ ] **Auditoria**: Logs imutáveis de transações
- [ ] **Relatórios**: Exportação para fiscalização

---

## 📞 Suporte e Recursos

### OpenPix
- **Documentação**: https://developers.openpix.com.br/
- **Discord**: https://discord.gg/openpix
- **Email**: suporte@openpix.com.br

### Mercado Pago
- **Documentação**: https://www.mercadopago.com.br/developers/pt/docs
- **Fórum**: https://www.mercadopago.com.br/developers/pt/support
- **Email**: developers@mercadopago.com

### Supabase
- **Documentação**: https://supabase.com/docs
- **Discord**: https://discord.supabase.com/
- **GitHub**: https://github.com/supabase/supabase

---

## ✅ Próximos Passos

1. ✅ Escolher gateway (OpenPix recomendado)
2. ✅ Criar conta e obter credenciais
3. ✅ Atualizar `pixService.ts` com integração real
4. ✅ Criar Edge Function para webhook
5. ✅ Configurar webhook no gateway
6. ✅ Testar em ambiente sandbox
7. ✅ Validar com pagamento real (valor mínimo)
8. ✅ Implementar monitoramento e alertas
9. ✅ Documentar processo para apresentação

---

**Importante**: Sempre teste em ambiente sandbox antes de ir para produção. Nunca exponha credenciais de produção em código ou repositórios públicos.
