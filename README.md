# 🎰 LuckyYBet - Plataforma de Simulação de Jogos e Educação Financeira

> ⚠️ **AVISO IMPORTANTE:** Este é um projeto de **SIMULAÇÃO EDUCACIONAL** desenvolvido para o [Nome do Concurso Escolar]. **Não envolve dinheiro real, não possui fins lucrativos e não é uma plataforma de apostas real.** O objetivo é demonstrar a arquitetura de sistemas complexos e promover a educação sobre gestão de risco e probabilidade em um ambiente controlado.

## 📋 Sobre o Projeto

LuckyYBet é uma plataforma web que simula a experiência de jogos de cassino online. O foco do projeto é técnico e educacional, servindo como uma prova de conceito para:

1.  **Segurança de Sistemas:** Demonstração de como proteger a lógica de negócio (cálculo de saldo e resultados) em um backend seguro (Supabase).
2.  **Arquitetura Moderna:** Utilização de uma stack de desenvolvimento de ponta (React, TypeScript, Supabase) para construir uma aplicação escalável.
3.  **Educação Financeira:** Uso da simulação para ensinar conceitos de probabilidade, gestão de banca e jogo responsável.

### 🎯 Objetivos para o Concurso

- **Conformidade:** Reforçar o caráter de simulação para atender às exigências do concurso.
- **Segurança:** Migrar para Supabase para resolver as vulnerabilidades críticas de segurança do protótipo inicial.
- **Qualidade:** Entregar um código limpo, funcional e com testes básicos.

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | Interface de usuário moderna e tipada. |
| **Estilização** | Tailwind CSS, Radix UI | Design responsivo, acessível e rápido. |
| **Backend** | **Supabase** (PostgreSQL) | Banco de dados, autenticação e lógica de negócio segura (via RLS e Edge Functions). |
| **Roteamento** | React Router v7 | Navegação entre páginas. |

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm)
- Conta Supabase (para obter as chaves de API)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Vsk-0/luckyybet.git
    cd luckyybet
    ```

2.  **Instale dependências:**
    ```bash
    pnpm install
    ```

3.  **Configure o Supabase:**
    - Crie um projeto no [Supabase Dashboard](https://app.supabase.com/).
    - Obtenha o `Project URL` e a `anon public key`.
    - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```env
    VITE_SUPABASE_URL="SEU_PROJECT_URL_AQUI"
    VITE_SUPABASE_ANON_KEY="SUA_ANON_PUBLIC_KEY_AQUI"
    ```

4.  **Execute em desenvolvimento:**
    ```bash
    pnpm dev
    ```

5.  **Build para produção:**
    ```bash
    pnpm build
    ```

## ⚠️ Limitações Conhecidas e Próximos Passos

O projeto está em fase de refatoração. As principais limitações atuais são:

- **Migração em Andamento:** A migração completa do Firebase para o Supabase ainda está em curso.
- **Testes:** A cobertura de testes automatizados é mínima e será expandida.
- **CI/CD:** Os workflows de Integração Contínua (CI) ainda não foram configurados.

## ⚖️ Disclaimers Legais

- Este projeto é estritamente para fins de demonstração técnica e educacional.
- Não há troca de dinheiro real. Todos os valores e transações são simulados.
- O projeto não possui licença para operar como uma plataforma de jogos de azar real.
- **Proibido para menores de 18 anos** (mesmo sendo simulação, o tema exige responsabilidade).

## 👨‍💻 Autor

[Seu Nome] - [Sua Escola]

---
*Este README será atualizado à medida que as fases de refatoração forem concluídas.*
