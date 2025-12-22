# 🔐 Guia de Configuração Segura do Supabase

## ⚠️ ALERTA DE SEGURANÇA

**CREDENCIAIS EXPOSTAS DETECTADAS!**

As seguintes credenciais foram compartilhadas publicamente e precisam ser **REVOGADAS IMEDIATAMENTE**:
- Token de serviço: `sbp_84b844982557e4bbad2ccbd56b082c0231dab619`
- Project ID: `hvhbvomlgcqgryosigkh`

---

## 🚨 Passo 1: Revogar Credenciais Comprometidas (URGENTE)

### 1.1 Acessar o Dashboard

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh
2. Faça login com sua conta

### 1.2 Regenerar Service Role Key

1. Vá em **Settings** > **API**
2. Na seção **Project API keys**, localize **service_role key**
3. Clique em **Regenerate** ou **Revoke**
4. Copie a nova chave e guarde em local seguro

### 1.3 Verificar Logs de Acesso

1. Vá em **Logs** > **API Logs**
2. Verifique se houve acessos suspeitos
3. Se houver atividade não autorizada, contate o suporte do Supabase

---

## 📦 Passo 2: Executar Scripts SQL

### 2.1 Criar Tabelas Principais

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/editor
2. Abra o arquivo `supabase_setup.sql` do projeto
3. Copie todo o conteúdo
4. Cole no SQL Editor
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Verifique se não há erros

### 2.2 Criar Tabelas de Conformidade

1. No mesmo SQL Editor
2. Abra o arquivo `supabase_compliance_tables.sql`
3. Copie todo o conteúdo
4. Cole no SQL Editor
5. Clique em **Run**
6. Verifique se todas as tabelas foram criadas

### 2.3 Verificar Criação das Tabelas

Execute no SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Você deve ver as seguintes tabelas:
- ✅ `users`
- ✅ `transactions`
- ✅ `deposit_requests`
- ✅ `withdraw_requests`
- ✅ `user_limits`
- ✅ `audit_logs`
- ✅ `user_kyc`
- ✅ `game_sessions`
- ✅ `responsible_gaming_alerts`

---

## 🔑 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Obter Credenciais Corretas

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/settings/api
2. Copie as seguintes informações:
   - **Project URL**: `https://hvhbvomlgcqgryosigkh.supabase.co`
   - **anon public key**: (chave que começa com `eyJ...`)
   - **service_role key**: (NÃO USAR NO FRONTEND!)

### 3.2 Criar Arquivo .env

No diretório raiz do projeto, crie o arquivo `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://hvhbvomlgcqgryosigkh.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui

# NÃO ADICIONE A SERVICE_ROLE_KEY AQUI!
# Ela só deve ser usada no backend (Edge Functions)

# PIX Configuration (para produção futura)
VITE_PIX_KEY=
VITE_OPENPIX_APP_ID=
VITE_OPENPIX_ENVIRONMENT=sandbox

# Mercado Pago (alternativa)
VITE_MERCADOPAGO_ACCESS_TOKEN=
VITE_MERCADOPAGO_PUBLIC_KEY=
```

### 3.3 Verificar .gitignore

Certifique-se de que o arquivo `.gitignore` contém:

```
# Environment variables
.env
.env.local
.env.production
.env.development

# Supabase
.supabase/
```

### 3.4 NUNCA Faça Isso ❌

- ❌ Compartilhar credenciais em chats
- ❌ Commitar arquivo `.env` no Git
- ❌ Usar `service_role` key no frontend
- ❌ Expor tokens em código público
- ❌ Compartilhar screenshots com credenciais visíveis

---

## 🛡️ Passo 4: Configurar Storage para KYC

### 4.1 Criar Bucket de Documentos

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/storage/buckets
2. Clique em **New bucket**
3. Nome: `kyc-documents`
4. **Public bucket**: ❌ DESMARCAR (documentos são privados)
5. Clique em **Create bucket**

### 4.2 Configurar Políticas de Storage

Execute no SQL Editor:

```sql
-- Política para usuários fazerem upload de seus documentos
CREATE POLICY "Usuários podem fazer upload de seus documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política para usuários verem seus próprios documentos
CREATE POLICY "Usuários podem ver seus documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política para admins verem todos os documentos
CREATE POLICY "Admins podem ver todos os documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);
```

---

## 🔐 Passo 5: Configurar Autenticação

### 5.1 Configurar Provedores de Auth

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/auth/providers
2. **Email**: Já deve estar habilitado
3. Configure opções:
   - ✅ Enable email confirmations (recomendado para produção)
   - ✅ Enable email change confirmations
   - ⏱️ Confirmation expiry: 86400 (24 horas)

### 5.2 Configurar Templates de Email

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/auth/templates
2. Personalize os templates:
   - **Confirm signup**: Email de confirmação de cadastro
   - **Magic Link**: Link mágico para login
   - **Change Email Address**: Confirmação de mudança de email
   - **Reset Password**: Redefinição de senha

### 5.3 Configurar URL de Redirecionamento

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/auth/url-configuration
2. Adicione URLs permitidas:
   - `http://localhost:5173` (desenvolvimento)
   - `https://seu-dominio.com` (produção)

---

## 🚀 Passo 6: Criar Edge Function para Webhook PIX

### 6.1 Instalar Supabase CLI

```bash
# Instalar globalmente
pnpm add -g supabase

# Ou usar npx
npx supabase --version
```

### 6.2 Login no Supabase CLI

```bash
supabase login
```

### 6.3 Inicializar Projeto Local

```bash
cd /caminho/para/luckyybet
supabase init
```

### 6.4 Criar Edge Function

```bash
supabase functions new pix-webhook
```

### 6.5 Implementar Webhook Handler

Edite `supabase/functions/pix-webhook/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    
    // Validar assinatura do webhook (IMPORTANTE!)
    // Implementar de acordo com o gateway escolhido

    // Processar pagamento aprovado
    if (payload.event === 'OPENPIX:CHARGE_COMPLETED') {
      const charge = payload.charge;
      const transactionId = charge.correlationID;

      // Buscar depósito
      const { data: deposit } = await supabase
        .from('deposit_requests')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

      if (!deposit) {
        return new Response('Depósito não encontrado', { 
          status: 404,
          headers: corsHeaders 
        });
      }

      // Atualizar depósito
      await supabase
        .from('deposit_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('transaction_id', transactionId);

      // Atualizar saldo
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

      // Registrar auditoria
      await supabase.from('audit_logs').insert({
        user_id: deposit.user_id,
        event_type: 'DEPOSIT_APPROVED',
        event_data: { transaction_id: transactionId, amount: deposit.amount },
      });

      return new Response('Webhook processado', { 
        status: 200,
        headers: corsHeaders 
      });
    }

    return new Response('Evento não tratado', { 
      status: 200,
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Erro:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### 6.6 Deploy da Edge Function

```bash
supabase functions deploy pix-webhook
```

### 6.7 Obter URL da Edge Function

Após o deploy, a URL será:
```
https://hvhbvomlgcqgryosigkh.supabase.co/functions/v1/pix-webhook
```

---

## ✅ Passo 7: Testar Configuração

### 7.1 Testar Conexão com Supabase

Crie um arquivo `test-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvhbvomlgcqgryosigkh.supabase.co';
const supabaseKey = 'sua-anon-key-aqui';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('count');

  if (error) {
    console.error('❌ Erro:', error);
  } else {
    console.log('✅ Conexão bem-sucedida!');
    console.log('Dados:', data);
  }
}

testConnection();
```

Execute:
```bash
npx tsx test-supabase.ts
```

### 7.2 Criar Usuário de Teste

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/auth/users
2. Clique em **Add user** > **Create new user**
3. Preencha:
   - Email: `teste@luckyybet.com`
   - Password: `Teste@123456`
   - Auto Confirm User: ✅ Marcar
4. Clique em **Create user**

### 7.3 Tornar Usuário Admin

Execute no SQL Editor:

```sql
-- Copie o UUID do usuário criado
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'teste@luckyybet.com';
```

---

## 📊 Passo 8: Monitoramento e Logs

### 8.1 Configurar Logs

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/logs/explorer
2. Configure alertas para:
   - Erros de autenticação
   - Falhas em transações
   - Acessos suspeitos

### 8.2 Configurar Webhooks de Notificação

1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/settings/webhooks
2. Configure webhooks para eventos importantes:
   - Novo usuário registrado
   - Falha de autenticação
   - Erro em Edge Function

---

## 🔒 Checklist de Segurança Final

- [ ] Credenciais antigas revogadas
- [ ] Novo `.env` criado com credenciais atualizadas
- [ ] `.env` adicionado ao `.gitignore`
- [ ] Todas as tabelas SQL criadas
- [ ] Storage bucket criado e configurado
- [ ] Políticas RLS testadas
- [ ] Edge Function deployada
- [ ] Webhook configurado no gateway
- [ ] Usuário admin de teste criado
- [ ] Logs e monitoramento configurados
- [ ] Documentação atualizada

---

## 📞 Suporte

Se encontrar problemas:

1. **Documentação Supabase**: https://supabase.com/docs
2. **Discord Supabase**: https://discord.supabase.com/
3. **GitHub Issues**: https://github.com/supabase/supabase/issues

---

**IMPORTANTE**: Após seguir todos os passos, teste o sistema completamente antes de apresentar no concurso. Mantenha as credenciais seguras e nunca as compartilhe publicamente.
