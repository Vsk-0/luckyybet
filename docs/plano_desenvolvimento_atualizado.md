# Plano de Desenvolvimento Atualizado - Luckyybet (React Stack)

**Data:** 23 de Maio de 2025

**Baseado em:** Prompt Avançado do Usuário (23/05/2025) e Decisão de Manter Stack React/TypeScript/Vite.

## Objetivo Geral

Desenvolver um site de apostas simuladas (estilo dddbet.bet), focado em mobile, utilizando a stack React/TypeScript/Vite, integrando com backend/DB gratuito (Firebase/Supabase) e hospedagem estática, conforme funcionalidades e requisitos do prompt avançado.

## Fases e Tarefas Principais

**Fase 1: Configuração do Backend e Autenticação**

1.  **Escolha e Configuração do Backend/DB (Firebase/Supabase):**
    *   [ ] Criar projeto no Firebase ou Supabase (free tier).
    *   [ ] Configurar Realtime Database/Firestore (Firebase) ou Tabelas (Supabase) para: Usuários, Saldo, Histórico de Apostas, Pedidos de Depósito, Pedidos de Saque.
    *   [ ] Configurar Autenticação (Firebase Auth ou Supabase Auth) para Email/Senha.
    *   [ ] Configurar regras de segurança básicas no DB.
2.  **Integração Backend no Frontend (React):**
    *   [ ] Instalar SDKs necessários (firebase ou @supabase/supabase-js).
    *   [ ] Criar módulos/serviços no React para interagir com o backend (Auth, DB).
    *   [ ] Configurar variáveis de ambiente para as chaves da API.
3.  **Implementação da Autenticação (Frontend):**
    *   [ ] Criar/Adaptar componentes React para formulários de Cadastro e Login.
    *   [ ] Implementar lógica de chamada às funções de Auth do backend.
    *   [ ] Implementar validações de formulário (front + back).
    *   [ ] Gerenciar estado de autenticação do usuário globalmente (Context API ou Zustand/Jotai).
    *   [ ] Implementar proteção de rotas (React Router DOM) para redirecionar usuários não autenticados.

**Fase 2: Dashboard do Usuário e Fluxo de Saldo**

1.  **Componente Dashboard:**
    *   [ ] Criar/Adaptar página/componente do Dashboard.
    *   [ ] Exibir saldo atual do usuário (buscando do DB em tempo real).
    *   [ ] Implementar seção de Histórico de Apostas:
        *   Buscar dados do DB.
        *   Criar componente de tabela/lista paginada.
        *   Adicionar filtros (data, tipo, valor).
    *   [ ] Integrar gráfico simples de ganhos/perdas (usar Chart.js ou Recharts).
    *   [ ] Adicionar botões "Depositar" e "Solicitar Saque" (levarão às páginas/modais específicos).
2.  **Fluxo de Depósito Pix (Manual/Semi-Automático):**
    *   [ ] Criar página/modal de Depósito.
    *   [ ] Exibir chave Pix fixa ou gerar QR Code (usar biblioteca como `qrcode.react`).
    *   [ ] Adicionar campo para "Valor Enviado" e input para upload de comprovante (imagem - usar Firebase Storage/Supabase Storage).
    *   [ ] Implementar lógica do botão "Já paguei":
        *   Salvar pedido de depósito no DB com status "pendente", valor e link/referência do comprovante.
        *   Exibir feedback ao usuário (toast - usar `react-hot-toast` ou similar).
3.  **Fluxo de Solicitação de Saque:**
    *   [ ] Criar página/modal de Saque.
    *   [ ] Adicionar formulário com valor (validar mínimo R$ 10) e chave Pix destino.
    *   [ ] Implementar lógica do botão "Solicitar":
        *   Salvar pedido de saque no DB com status "pendente".
        *   Exibir feedback ao usuário.

**Fase 3: Implementação do Jogo de Slots (Fortune Tiger)**

1.  **Refinamento do `GameModal.tsx`:**
    *   [ ] Manter a base visual com símbolos reais já implementada.
    *   [ ] Implementar lógica de busca de dados do jogo (símbolos, tabela de prêmios) de um JSON ou do DB.
    *   [ ] Integrar animações de giro mais suaves (GSAP ou Framer Motion podem ser considerados, mesmo sendo libs extras, ou usar CSS puro).
2.  **Lógica de Probabilidade e Ganhos (Backend):**
    *   [ ] Criar uma Cloud Function (Firebase) ou Edge Function (Supabase) para processar o giro do slot.
    *   [ ] Receber ID do usuário e valor da aposta.
    *   [ ] Validar saldo do usuário no DB.
    *   [ ] Deduzir aposta do saldo.
    *   [ ] Implementar lógica de probabilidade (RTP simulado/taxa de acerto configurável) para determinar o resultado (símbolos) e o ganho.
    *   [ ] Atualizar saldo do usuário no DB em caso de ganho.
    *   [ ] Registrar a aposta (resultado, ganho/perda, timestamp) no histórico do usuário no DB.
    *   [ ] Retornar o resultado (símbolos e valor ganho) para o frontend.
3.  **Integração Frontend-Backend do Slot:**
    *   [ ] Modificar `GameModal.tsx` para chamar a função de backend ao clicar em "GIRAR".
    *   [ ] Exibir resultado e atualizar saldo na interface com base na resposta do backend.
    *   [ ] Implementar feedback visual durante a chamada ao backend (loading no botão).

**Fase 4: Admin Panel**

1.  **Autenticação Admin:**
    *   [ ] Definir método de autenticação para admin (pode ser um usuário com role específica no DB).
    *   [ ] Criar rota/página de login separada para admin.
2.  **Interface Admin:**
    *   [ ] Criar layout básico para o painel admin.
    *   [ ] Implementar listagem paginada de Pedidos de Depósito Pendentes:
        *   Buscar dados do DB.
        *   Exibir informações (usuário, valor, comprovante).
        *   Adicionar botões "Confirmar Depósito" e "Recusar".
    *   [ ] Implementar listagem paginada de Pedidos de Saque Pendentes:
        *   Buscar dados do DB.
        *   Exibir informações (usuário, valor, chave Pix).
        *   Adicionar botões "Marcar como Pago" e "Recusar".
    *   [ ] Criar dashboard admin com métricas básicas (buscar/calcular do DB): nº usuários, total apostado, saldo pendente, etc.
3.  **Lógica Admin (Backend):**
    *   [ ] Criar Cloud/Edge Functions para as ações do admin:
        *   Confirmar Depósito: Atualiza status do pedido no DB e adiciona saldo ao usuário.
        *   Recusar Depósito/Saque: Atualiza status no DB.
        *   Marcar Saque como Pago: Atualiza status no DB.
    *   [ ] Garantir que apenas usuários admin possam chamar essas funções (verificar token/role).

**Fase 5: Segurança, UX e Finalização**

1.  **Segurança:**
    *   [ ] Revisar e implementar validação de inputs em todos os formulários (frontend e backend/regras de segurança DB).
    *   [ ] Implementar rate limiting básico nas funções de backend críticas (giro de slot, pedidos) se a plataforma permitir (Firebase/Supabase têm mecanismos para isso).
    *   [ ] Revisar regras de segurança do DB para garantir acesso mínimo necessário.
    *   [ ] Considerar obfuscação mínima do build final do JS (Vite já faz minificação).
2.  **UX e Refinamentos:**
    *   [ ] Garantir responsividade e boa experiência em mobile.
    *   [ ] Implementar tema Dark Mode de forma consistente.
    *   [ ] Adicionar feedback visual (loaders, toasts) onde necessário.
    *   [ ] Configurar PWA básico (manifest.json, service worker simples para cache de assets via Vite PWA plugin).
3.  **Testes e Validação:**
    *   [ ] Testar todos os fluxos funcionais (cadastro, login, depósito, slot, saque, admin).
    *   [ ] Testar em diferentes navegadores mobile.
4.  **Hospedagem:**
    *   [ ] Fazer build de produção (`pnpm build`).
    *   [ ] Configurar e fazer deploy em plataforma gratuita (Netlify, GitHub Pages via Action, ou Manus.space se disponível).
5.  **Documentação:**
    *   [ ] Atualizar README com instruções de setup e deploy.
    *   [ ] Documentar fluxo de confirmação manual/semi-automática do Pix.

## Considerações

*   **Libs Adicionais:** Embora o prompt original pedisse Vanilla JS e CDNs, manter React pode exigir libs adicionais (React Router, Zustand/Context, react-hot-toast, qrcode.react, Chart.js/Recharts, talvez Framer Motion para animações). Buscar alternativas leves ou usar CDNs quando viável.
*   **Backend Free Tier:** Monitorar limites de uso do Firebase/Supabase free tier.
*   **Complexidade:** O escopo é relativamente complexo para ser totalmente free tier e sem servidor pago real, especialmente a parte de admin e confirmação Pix. O fluxo manual/semi-automático é uma solução viável.

Este plano servirá como guia. As tarefas podem ser reordenadas ou detalhadas conforme o desenvolvimento avança.
