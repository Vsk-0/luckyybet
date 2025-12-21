-- Script de Configuração do Banco de Dados Supabase
-- Execute este script no SQL Editor do Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/editor

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 100.00 NOT NULL CHECK (balance >= 0),
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);

-- ============================================
-- 2. TABELA DE TRANSAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet', 'win')),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- ============================================
-- 3. TABELA DE SOLICITAÇÕES DE DEPÓSITO
-- ============================================
CREATE TABLE IF NOT EXISTS public.deposit_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 2),
  pix_key TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  qr_code TEXT,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_image_url TEXT,
  expires_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON public.deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_status ON public.deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_transaction_id ON public.deposit_requests(transaction_id);

-- ============================================
-- 4. TABELA DE SOLICITAÇÕES DE SAQUE
-- ============================================
CREATE TABLE IF NOT EXISTS public.withdraw_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 10),
  pix_key TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMPTZ,
  rejected_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_withdraw_requests_user_id ON public.withdraw_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdraw_requests_status ON public.withdraw_requests(status);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdraw_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para USERS
CREATE POLICY "Usuários podem ver seus próprios dados"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os usuários"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Políticas para TRANSACTIONS
CREATE POLICY "Usuários podem ver suas próprias transações"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar transações"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as transações"
  ON public.transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Políticas para DEPOSIT_REQUESTS
CREATE POLICY "Usuários podem ver seus próprios depósitos"
  ON public.deposit_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar solicitações de depósito"
  ON public.deposit_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os depósitos"
  ON public.deposit_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins podem atualizar depósitos"
  ON public.deposit_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Políticas para WITHDRAW_REQUESTS
CREATE POLICY "Usuários podem ver seus próprios saques"
  ON public.withdraw_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar solicitações de saque"
  ON public.withdraw_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os saques"
  ON public.withdraw_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins podem atualizar saques"
  ON public.withdraw_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================
-- 6. FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at na tabela users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir usuário admin de teste (descomente se necessário)
-- IMPORTANTE: Primeiro crie o usuário no Supabase Auth, depois execute este INSERT
-- INSERT INTO public.users (id, email, balance, is_admin)
-- VALUES (
--   'UUID_DO_USUARIO_ADMIN_AQUI',
--   'admin@luckyybet.com',
--   1000.00,
--   TRUE
-- );

-- ============================================
-- 8. VERIFICAÇÃO
-- ============================================

-- Verificar se todas as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'transactions', 'deposit_requests', 'withdraw_requests');

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

COMMENT ON TABLE public.users IS 'Tabela de usuários da plataforma LuckyYBet';
COMMENT ON TABLE public.transactions IS 'Histórico de todas as transações (depósitos, saques, apostas, ganhos)';
COMMENT ON TABLE public.deposit_requests IS 'Solicitações de depósito via PIX';
COMMENT ON TABLE public.withdraw_requests IS 'Solicitações de saque via PIX';

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================
-- 
-- 1. Acesse: https://supabase.com/dashboard/project/hvhbvomlgcqgryosigkh/editor
-- 2. Cole este script completo no SQL Editor
-- 3. Clique em "Run" para executar
-- 4. Verifique se todas as tabelas foram criadas sem erros
-- 5. Teste a autenticação e criação de usuários no frontend
-- 
-- Para criar um usuário admin:
-- 1. Registre-se normalmente no frontend
-- 2. Copie o UUID do usuário (visível no console ou no Supabase Auth)
-- 3. Execute: UPDATE public.users SET is_admin = TRUE WHERE id = 'UUID_AQUI';
-- 
-- ============================================
