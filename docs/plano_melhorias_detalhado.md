# Plano Detalhado de Melhorias - Luckyybet

Este documento detalha as melhorias planejadas para o frontend e backend (simulado) do projeto Luckyybet, com base na análise do repositório, documentação existente e comparação com a referência visual do dddbet.bet. A priorização visa otimizar o uso de créditos, focando em impacto visual e funcional inicial.

## Prioridades (Foco na Otimização de Créditos)

1.  **Refinamento Visual (Frontend):** Alinhar o design geral (cores, layout, tipografia, ícones) com a documentação visual do dddbet.bet e o `plano_simulacao_luckyybet.md`.
2.  **Simulação de Jogos PG (Frontend):** Implementar uma simulação visual básica para os jogos PG, conforme descrito no `MELHORIAS.md` e `plano_simulacao_luckyybet.md`, para demonstrar a funcionalidade.
3.  **Fluxo de Cadastro (Frontend):** Desenvolver o formulário de cadastro com validações básicas no lado do cliente, sem integração completa com backend neste momento para economizar créditos.
4.  **Animações Básicas (Frontend):** Adicionar animações sutis (hover, transições) para melhorar a experiência do usuário, utilizando Framer Motion.
5.  **Seção de Promoções (Frontend - Simulado):** Criar a estrutura visual da seção de promoções com base na documentação, exibindo banners estáticos inicialmente.
6.  **Jackpot Animado (Frontend - Simulado):** Implementar o contador de jackpot com animação visual, mas com valor simulado.

## Detalhamento das Tarefas

### Frontend

*   **Estilização Global:**
    *   Atualizar `tailwind.config.js` com as cores primárias (#202329, #F0C059, #EA4E3D) e fontes definidas no `plano_simulacao_luckyybet.md`.
    *   Revisar e ajustar estilos globais para espaçamento, bordas e sombras, buscando maior fidelidade visual ao dddbet.bet.
*   **Componentes Principais (Refatoração/Criação):**
    *   `Header`: Ajustar logo, indicador de saldo (simulado), botão de depósito.
    *   `BottomNavigation`: Revisar ícones e layout conforme documentação.
    *   `GameGrid`: Melhorar apresentação das thumbnails, adicionar indicador de provedor (PG) e marcador de favorito (visual).
    *   `JackpotCounter`: Implementar componente com valor simulado e animação de contagem.
    *   `PromotionBanner`: Criar componente para exibir banners promocionais (inicialmente estáticos).
    *   `CategoryTabs`: Refinar visual das abas de categorias de jogos.
*   **Simulação Jogos PG:**
    *   Criar um componente modal ou de página que simule o carregamento e uma interface básica do jogo (sem lógica real de aposta).
    *   Utilizar imagens/elementos visuais representativos dos jogos Fortune Tiger/Rabbit/Dragon.
*   **Formulário de Cadastro:**
    *   Criar componente `RegistrationForm` com campos padrão (nome de usuário, senha, confirmação, etc.).
    *   Implementar validações de formulário no lado do cliente (campos obrigatórios, formato de e-mail, etc.).
*   **Animações:**
    *   Aplicar efeitos de hover/tap em botões e cards de jogos.
    *   Adicionar transições suaves entre seções/páginas (se aplicável).

### Backend (Simulado/Mínimo)

*   **Estado do Usuário:** Utilizar Context API ou Zustand para gerenciar um estado simples de autenticação (logado/deslogado) e saldo simulado, persistindo minimamente no `localStorage` se necessário.
*   **Dados Simulados:** Manter dados de jogos, promoções e jackpot como JSON estáticos ou diretamente no código frontend para esta fase.
*   **Sem Integração Real:** Nenhuma chamada real a APIs ou banco de dados será implementada nesta fase para otimizar créditos.

## Próximos Passos

1.  Iniciar a implementação das tarefas de **Estilização Global** e **Refatoração/Criação de Componentes Principais**.
2.  Implementar a **Simulação dos Jogos PG**.
3.  Desenvolver o **Formulário de Cadastro** (frontend).
4.  Adicionar **Animações Básicas**.
5.  Criar a **Seção de Promoções** e **Jackpot Animado** (simulados).

*Este plano será a base para a próxima etapa de implementação.*
