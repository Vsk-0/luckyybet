# Relatório de Problemas Identificados - LuckyYBet

**Data:** 21 de dezembro de 2025  
**Projeto:** LuckyYBet - Plataforma de Simulação de Jogos para Concurso Escolar  
**Site de Inspiração:** Betão (betao.bet.br)

---

## 1. Problemas Críticos (Prioridade Alta)

### 1.1 Migração Incompleta do Firebase para Supabase

**Problema:** O arquivo `WithdrawPage.tsx` ainda utiliza Firebase Firestore, enquanto o resto da aplicação foi migrado para Supabase. Isso cria inconsistência na base de dados e pode causar erros de compilação.

**Localização:**
- `/src/pages/WithdrawPage.tsx` (linhas 2-3, 32-38)
- Importa `db` de `firebaseConfig.ts`
- Usa `collection`, `addDoc`, `serverTimestamp` do Firebase

**Impacto:** Alto - A aplicação não funcionará corretamente para solicitações de saque, e o arquivo Firebase ainda está presente no projeto.

**Solução Necessária:**
- Refatorar `WithdrawPage.tsx` para usar Supabase
- Criar função no `userService.ts` para criar solicitações de saque
- Remover completamente as dependências do Firebase

---

### 1.2 Falta de Modal de Verificação de Idade Obrigatória

**Problema:** O projeto possui apenas um disclaimer estático, mas não implementa verificação de idade obrigatória como o site Betão. Para um concurso escolar que pode ser oficializado pelo governo, essa verificação é **essencial** para conformidade legal.

**Localização:**
- Componente `Disclaimer.tsx` existe mas é apenas informativo
- Não há bloqueio de acesso para menores de 18 anos

**Impacto:** Crítico - Pode desqualificar o projeto no concurso por não atender requisitos legais básicos.

**Solução Necessária:**
- Criar modal obrigatório de verificação de idade na primeira visita
- Implementar bloqueio de acesso caso o usuário selecione "Não"
- Adicionar cookie/localStorage para lembrar a verificação
- Seguir o padrão do Betão com botões "NÃO" e "SIM"

---

### 1.3 Ausência de Integração com Sistema de Pagamento PIX

**Problema:** O projeto possui uma página de depósito (`DepositPage.tsx`) com chave PIX hardcoded (`chave-pix-exemplo@banco.com`), mas não há integração real com APIs de pagamento. Para oficialização futura, é necessário preparar a arquitetura para integração com gateways de pagamento.

**Localização:**
- `/src/pages/DepositPage.tsx` (linha 16)
- Não há geração de QR Code PIX
- Não há validação de pagamento

**Impacto:** Alto - O professor mencionou que o projeto está "muito abaixo", e a falta de preparação para integração bancária pode ser um dos motivos.

**Solução Necessária:**
- Integrar com API de gateway de pagamento (Mercado Pago, PagSeguro, ou Asaas)
- Implementar geração de QR Code PIX dinâmico
- Criar webhook para confirmação automática de pagamentos
- Adicionar validação de comprovantes

---

### 1.4 Configuração do Supabase Não Documentada

**Problema:** O usuário forneceu token de acesso pessoal do Supabase (`sbp_84b844982557e4bbad2ccbd56b082c0231dab619`) e URL do projeto, mas o arquivo `.env` não está configurado e não há documentação clara sobre como obter as chaves corretas.

**Localização:**
- Arquivo `.env` não existe (apenas `.env.example` com variáveis do Firebase)
- `supabaseClient.ts` espera `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

**Impacto:** Alto - O projeto não pode ser executado sem as configurações corretas.

**Solução Necessária:**
- Obter as credenciais corretas do Supabase (URL e Anon Key)
- Criar arquivo `.env` com as variáveis corretas
- Atualizar `.env.example` para remover referências ao Firebase
- Documentar o processo no README

---

## 2. Problemas de Design e UX (Prioridade Média)

### 2.1 Esquema de Cores Diferente do Site de Inspiração

**Problema:** O LuckyYBet usa roxo (#6b46c1) como cor primária, enquanto o Betão usa laranja (#ff8800). Embora não seja obrigatório copiar as cores, o professor mencionou que o design está "muito abaixo", o que pode indicar falta de profissionalismo visual.

**Impacto:** Médio - Afeta a percepção de qualidade do projeto.

**Solução Necessária:**
- Avaliar se deve manter roxo ou migrar para laranja
- Melhorar contraste e acessibilidade das cores
- Adicionar gradientes e efeitos visuais modernos

---

### 2.2 Ausência de Feed de Atividades em Tempo Real

**Problema:** O Betão possui seções "Últimas apostas" e "Grandes Ganhos" que criam engajamento social. O LuckyYBet não possui esse recurso, tornando a experiência menos dinâmica.

**Impacto:** Médio - Reduz o engajamento e a sensação de comunidade.

**Solução Necessária:**
- Criar componente de feed de atividades simuladas
- Implementar sistema de "grandes ganhos" fictícios
- Adicionar animações de entrada/saída de itens no feed

---

### 2.3 Falta de Carrossel de Promoções/Banners

**Problema:** O Betão possui um carrossel de banners promocionais vibrante e atraente. O LuckyYBet tem apenas um card estático de jogo na página inicial.

**Impacto:** Médio - A página inicial parece incompleta e pouco profissional.

**Solução Necessária:**
- Implementar carrossel com biblioteca como `embla-carousel-react` (já instalada)
- Criar banners promocionais com gradientes e imagens
- Adicionar navegação com setas e indicadores

---

### 2.4 Navegação e Estrutura Simplificadas Demais

**Problema:** O LuckyYBet possui apenas um jogo de exemplo (Fortune Tiger) e navegação básica. O Betão tem categorias organizadas (Esportes, Cassino, Cassino Ao Vivo, Torneios, etc.).

**Impacto:** Médio - O projeto parece incompleto e não demonstra complexidade técnica.

**Solução Necessária:**
- Adicionar mais categorias de jogos simulados
- Criar páginas separadas para cada categoria
- Implementar filtros e busca de jogos

---

## 3. Problemas de Código e Arquitetura (Prioridade Média)

### 3.1 Inconsistência no Uso de `currentUser.id` vs `currentUser.uid`

**Problema:** O código usa tanto `currentUser.id` quanto `currentUser.uid` para referenciar o ID do usuário. No Supabase Auth, o campo correto é `currentUser.id`, mas no Firebase era `currentUser.uid`.

**Localização:**
- `Dashboard.tsx` usa `currentUser.uid` (linha 18)
- `DepositPage.tsx` usa `currentUser.id` (linha 41)
- `WithdrawPage.tsx` usa `currentUser.uid` (linha 34)

**Impacto:** Médio - Pode causar bugs difíceis de rastrear.

**Solução Necessária:**
- Padronizar para usar `currentUser.id` em todo o projeto
- Atualizar o contexto de autenticação se necessário

---

### 3.2 Falta de Validação de Saldo Antes de Apostas

**Problema:** Embora exista lógica de verificação de saldo, não há validação robusta antes de permitir apostas, e não há mensagens claras de erro.

**Impacto:** Baixo - Pode permitir apostas inválidas em casos extremos.

**Solução Necessária:**
- Adicionar validação de saldo no frontend e backend
- Implementar mensagens de erro amigáveis
- Criar sistema de limites de aposta

---

### 3.3 Ausência de Testes Automatizados

**Problema:** O projeto não possui testes unitários ou de integração, conforme mencionado no próprio README.

**Impacto:** Baixo - Não afeta funcionalidade imediata, mas reduz confiabilidade.

**Solução Necessária:**
- Implementar testes com Vitest para funções críticas
- Testar fluxos de autenticação e transações
- Adicionar CI/CD no GitHub Actions

---

## 4. Problemas de Documentação (Prioridade Baixa)

### 4.1 README Desatualizado

**Problema:** O README menciona Firebase mas o projeto está migrando para Supabase. Há inconsistências nas instruções de instalação.

**Impacto:** Baixo - Dificulta que outros desenvolvedores ou avaliadores executem o projeto.

**Solução Necessária:**
- Atualizar README com instruções corretas do Supabase
- Adicionar screenshots do projeto
- Documentar processo de obtenção de credenciais

---

### 4.2 Falta de Informações Legais Completas

**Problema:** O Betão possui informações detalhadas de CNPJ, portaria de autorização, políticas de privacidade, etc. O LuckyYBet tem apenas um disclaimer básico.

**Impacto:** Baixo - Mas crítico para oficialização futura.

**Solução Necessária:**
- Adicionar seção de "Jogo Responsável" completa
- Criar páginas de Termos de Uso e Política de Privacidade
- Adicionar informações sobre o concurso e caráter educacional

---

## 5. Resumo de Prioridades

### Deve Ser Resolvido Imediatamente (Antes de Apresentar ao Professor)
1. ✅ Completar migração do Firebase para Supabase (WithdrawPage)
2. ✅ Configurar variáveis de ambiente do Supabase corretamente
3. ✅ Implementar modal de verificação de idade obrigatória
4. ✅ Preparar estrutura para integração PIX (mesmo que simulada inicialmente)

### Deve Ser Implementado para Melhorar Nota
1. ⚠️ Adicionar carrossel de banners promocionais
2. ⚠️ Criar feed de "últimas apostas" e "grandes ganhos"
3. ⚠️ Adicionar mais jogos simulados e categorias
4. ⚠️ Melhorar design visual (cores, gradientes, animações)

### Pode Ser Implementado Posteriormente
1. 📋 Testes automatizados
2. 📋 CI/CD no GitHub Actions
3. 📋 Páginas de políticas e termos completas
4. 📋 Sistema de administração mais robusto

---

## 6. Próximos Passos Recomendados

1. **Configurar Supabase:** Obter credenciais corretas e criar arquivo `.env`
2. **Refatorar WithdrawPage:** Completar migração para Supabase
3. **Implementar Modal de Idade:** Criar componente de verificação obrigatória
4. **Preparar Integração PIX:** Pesquisar APIs de gateway e implementar estrutura básica
5. **Melhorar Design:** Adicionar carrossel, feed de atividades e mais jogos
6. **Testar Completamente:** Garantir que todos os fluxos funcionam corretamente
7. **Atualizar Documentação:** README e documentação do concurso

---

**Conclusão:** O projeto possui uma base sólida com a migração para Supabase, mas precisa de melhorias críticas em conformidade legal (verificação de idade), integração de pagamentos e design visual para estar à altura de um concurso escolar que visa oficialização governamental.
