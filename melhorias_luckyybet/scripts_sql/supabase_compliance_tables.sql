-- ============================================
-- TABELAS ADICIONAIS PARA CONFORMIDADE LEGAL
-- Execute após o supabase_setup.sql
-- ============================================

-- ============================================
-- 1. TABELA DE LIMITES DE USUÁRIO
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_limits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  limite_deposito_diario DECIMAL(10, 2) DEFAULT 500.00 NOT NULL,
  limite_deposito_mensal DECIMAL(10, 2) DEFAULT 5000.00 NOT NULL,
  limite_aposta_diaria DECIMAL(10, 2) DEFAULT 300.00 NOT NULL,
  limite_aposta_mensal DECIMAL(10, 2) DEFAULT 3000.00 NOT NULL,
  limite_perda_diaria DECIMAL(10, 2) DEFAULT 200.00 NOT NULL,
  limite_perda_mensal DECIMAL(10, 2) DEFAULT 2000.00 NOT NULL,
  tempo_sessao_maximo INTEGER DEFAULT 120 NOT NULL, -- em minutos
  autoexclusao_ate TIMESTAMPTZ,
  alertas_habilitados BOOLEAN DEFAULT TRUE NOT NULL,
  effective_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_limits_user_id ON public.user_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_limits_autoexclusao ON public.user_limits(autoexclusao_ate) WHERE autoexclusao_ate IS NOT NULL;

-- ============================================
-- 2. TABELA DE LOGS DE AUDITORIA
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON public.audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================
-- 3. TABELA DE DADOS KYC (Know Your Customer)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_kyc (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  cpf TEXT NOT NULL UNIQUE,
  cpf_validado BOOLEAN DEFAULT FALSE NOT NULL,
  nome_completo TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  telefone TEXT,
  endereco_cep TEXT,
  endereco_logradouro TEXT,
  endereco_numero TEXT,
  endereco_complemento TEXT,
  endereco_bairro TEXT,
  endereco_cidade TEXT,
  endereco_estado TEXT,
  documento_frente_url TEXT,
  documento_verso_url TEXT,
  selfie_url TEXT,
  status_verificacao TEXT DEFAULT 'pending' NOT NULL CHECK (status_verificacao IN ('pending', 'approved', 'rejected')),
  motivo_rejeicao TEXT,
  verificado_por UUID REFERENCES public.users(id),
  verificado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_kyc_user_id ON public.user_kyc(user_id);
CREATE INDEX IF NOT EXISTS idx_user_kyc_cpf ON public.user_kyc(cpf);
CREATE INDEX IF NOT EXISTS idx_user_kyc_status ON public.user_kyc(status_verificacao);

-- ============================================
-- 4. TABELA DE SESSÕES DE JOGO
-- ============================================
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  inicio_sessao TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  fim_sessao TIMESTAMPTZ,
  duracao_minutos INTEGER,
  total_apostado DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
  total_ganho DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
  saldo_inicial DECIMAL(10, 2) NOT NULL,
  saldo_final DECIMAL(10, 2),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_inicio ON public.game_sessions(inicio_sessao DESC);

-- ============================================
-- 5. TABELA DE ALERTAS DE JOGO RESPONSÁVEL
-- ============================================
CREATE TABLE IF NOT EXISTS public.responsible_gaming_alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('TEMPO_SESSAO', 'LIMITE_DEPOSITO', 'LIMITE_APOSTA', 'LIMITE_PERDA', 'COMPORTAMENTO_RISCO')),
  alert_message TEXT NOT NULL,
  alert_data JSONB,
  acknowledged BOOLEAN DEFAULT FALSE NOT NULL,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rg_alerts_user_id ON public.responsible_gaming_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_rg_alerts_type ON public.responsible_gaming_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_rg_alerts_acknowledged ON public.responsible_gaming_alerts(acknowledged);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as novas tabelas
ALTER TABLE public.user_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsible_gaming_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas para USER_LIMITS
CREATE POLICY "Usuários podem ver seus próprios limites"
  ON public.user_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios limites"
  ON public.user_limits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios limites"
  ON public.user_limits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os limites"
  ON public.user_limits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Políticas para AUDIT_LOGS
CREATE POLICY "Usuários podem ver seus próprios logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode inserir logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins podem ver todos os logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Políticas para USER_KYC
CREATE POLICY "Usuários podem ver seus próprios dados KYC"
  ON public.user_kyc FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus dados KYC"
  ON public.user_kyc FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus dados KYC pendentes"
  ON public.user_kyc FOR UPDATE
  USING (auth.uid() = user_id AND status_verificacao = 'pending');

CREATE POLICY "Admins podem ver todos os dados KYC"
  ON public.user_kyc FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins podem atualizar dados KYC"
  ON public.user_kyc FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Políticas para GAME_SESSIONS
CREATE POLICY "Usuários podem ver suas próprias sessões"
  ON public.game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar sessões"
  ON public.game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas sessões"
  ON public.game_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as sessões"
  ON public.game_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Políticas para RESPONSIBLE_GAMING_ALERTS
CREATE POLICY "Usuários podem ver seus próprios alertas"
  ON public.responsible_gaming_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode criar alertas"
  ON public.responsible_gaming_alerts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem marcar alertas como lidos"
  ON public.responsible_gaming_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os alertas"
  ON public.responsible_gaming_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================
-- 7. TRIGGERS
-- ============================================

-- Trigger para atualizar updated_at em user_limits
CREATE TRIGGER update_user_limits_updated_at
  BEFORE UPDATE ON public.user_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em user_kyc
CREATE TRIGGER update_user_kyc_updated_at
  BEFORE UPDATE ON public.user_kyc
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para criar limites padrão ao criar usuário
CREATE OR REPLACE FUNCTION create_default_user_limits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_limits (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_limits_on_user_creation
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_limits();

-- ============================================
-- 8. FUNÇÕES AUXILIARES
-- ============================================

-- Função para verificar se usuário está em autoexclusão
CREATE OR REPLACE FUNCTION is_user_self_excluded(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_autoexclusao_ate TIMESTAMPTZ;
BEGIN
  SELECT autoexclusao_ate INTO v_autoexclusao_ate
  FROM public.user_limits
  WHERE user_id = p_user_id;
  
  RETURN v_autoexclusao_ate IS NOT NULL AND v_autoexclusao_ate > NOW();
END;
$$ LANGUAGE plpgsql;

-- Função para calcular total depositado hoje
CREATE OR REPLACE FUNCTION get_total_deposited_today(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_total DECIMAL;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total
  FROM public.transactions
  WHERE user_id = p_user_id
    AND type = 'deposit'
    AND status = 'completed'
    AND created_at >= CURRENT_DATE;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular total apostado hoje
CREATE OR REPLACE FUNCTION get_total_bet_today(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_total DECIMAL;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total
  FROM public.transactions
  WHERE user_id = p_user_id
    AND type = 'bet'
    AND created_at >= CURRENT_DATE;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. COMENTÁRIOS
-- ============================================

COMMENT ON TABLE public.user_limits IS 'Limites de jogo responsável configurados pelo usuário';
COMMENT ON TABLE public.audit_logs IS 'Log de auditoria de todas as ações importantes do sistema';
COMMENT ON TABLE public.user_kyc IS 'Dados de verificação de identidade (KYC) dos usuários';
COMMENT ON TABLE public.game_sessions IS 'Registro de sessões de jogo dos usuários';
COMMENT ON TABLE public.responsible_gaming_alerts IS 'Alertas de jogo responsável enviados aos usuários';

-- ============================================
-- 10. VERIFICAÇÃO
-- ============================================

-- Verificar se todas as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_limits', 'audit_logs', 'user_kyc', 'game_sessions', 'responsible_gaming_alerts');

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('user_limits', 'audit_logs', 'user_kyc', 'game_sessions', 'responsible_gaming_alerts');
