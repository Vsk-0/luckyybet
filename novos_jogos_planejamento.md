# Planejamento de Novos Jogos - LuckyYBet

Este documento detalha os novos jogos de slots a serem integrados na plataforma, incluindo suas mecânicas e assets simulados.

## 1. PG Soft (Pocket Games Soft)
Os jogos da PG Soft são conhecidos por sua orientação vertical (mobile-first) e gráficos de alta qualidade.

| Jogo | Tema | Mecânica Principal | Multiplicador Máximo |
| :--- | :--- | :--- | :--- |
| **Fortune Tiger** | Tigre da Fortuna | Re-spin até ganhar com multiplicador 10x | 2.500x |
| **Lucky Neko** | Gato da Sorte | Rodadas grátis com multiplicadores crescentes | 20.000x |
| **Fortune Rabbit** | Coelho da Fortuna | Símbolos de prêmio em dinheiro | 5.000x |
| **Fortune Mouse** | Rato da Fortuna | Wilds fixos no carretel central | 1.000x |

## 2. TaDa Gaming (Jili)
Jogos com mecânicas clássicas e foco em bônus de gemas e moedas.

| Jogo | Tema | Mecânica Principal | Características |
| :--- | :--- | :--- | :--- |
| **Fortune Gems** | Gemas Preciosas | Carretel de multiplicador extra | 3x3 + Carretel Bônus |
| **Money Coming** | Moedas e Dinheiro | Multiplicadores de linha e bônus de roda | Foco em ganhos rápidos |
| **Fortune Gems 2** | Gemas Preciosas | Roda de bônus e multiplicadores maiores | Evolução do clássico |

## 3. World Gaming (WG) / Outros
Foco em jogos de colisão (Crash) e mecânicas rápidas.

| Jogo | Tipo | Mecânica |
| :--- | :--- | :--- |
| **Aviator** | Crash Game | Multiplicador crescente, deve sacar antes do avião sumir |
| **Mines** | Arcade | Revelar diamantes e evitar minas |

## Estratégia de Implementação
1. **Assets:** Utilizar placeholders de alta qualidade ou URLs de assets públicos dos provedores.
2. **Lógica:** Implementar RNG (Random Number Generator) baseado em `Math.random()` com RTP (Return to Player) configurável.
3. **Integração:** Adicionar cards na Home e criar rotas específicas para cada jogo.
4. **Auditoria:** Garantir que cada giro seja registrado na tabela `game_sessions`.
