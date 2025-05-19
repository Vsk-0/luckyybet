# Plano de Simulação Visual - Luckyybet

Com base na análise do vídeo do site DDDBET, este documento apresenta o plano para criar uma simulação visual do site Luckyybet, mantendo elementos estruturais similares mas com identidade própria.

## Estrutura Geral da Interface

### Cores e Identidade Visual
- **Cores principais**: Preto (#202329) como fundo, dourado (#F0C059) para elementos de destaque, vermelho (#EA4E3D) para notificações
- **Logo**: Manter o logo já criado com elementos de trevo e coroa em dourado
- **Tipografia**: Fontes sans-serif modernas, com títulos em negrito

### Layout Principal
1. **Cabeçalho**:
   - Logo Luckyybet em destaque
   - Indicador de saldo com bandeira brasileira
   - Botão de "Depósito" em dourado
   - Banner promocional para download do app

2. **Barra de Navegação Inferior**:
   - Início/Começar (ícone de casa)
   - Promoções (ícone de presente)
   - Agente/Afiliados (ícone de pessoa com gráfico)
   - Suporte (ícone de headset)
   - Perfil (ícone de pessoa)

3. **Seção de Jackpot**:
   - Banner animado com valor progressivo
   - Fundo vermelho com texto "JACKPOT" em dourado
   - Personagens animados nas laterais

4. **Categorias de Jogos**:
   - Barra de navegação horizontal com:
     - Popular (ícone de fogo)
     - Slots (ícone de caça-níquel)
     - Cassino (ícone de cartas)
     - Esportes (ícone de bola)
     - Outros (com seta para mais opções)

5. **Grade de Jogos**:
   - Thumbnails coloridos em grid de 3 colunas
   - Nome do jogo na parte inferior
   - Marcador de favorito (estrela) em alguns jogos
   - Indicador de fornecedor no canto superior

## Fluxos a Implementar

### Tela Inicial
- Banner principal com promoção de boas-vindas
- Seção de jackpot com valor progressivo
- Categorias de jogos em abas horizontais
- Grade de jogos populares
- Barra de navegação inferior fixa

### Seção de Promoções
- Abas de navegação: Eventos, VIP, Rebate, Recompensas
- Banners promocionais:
  - Bônus de primeiro depósito
  - Programa de indicação
  - Recompensas diárias
  - Cashback

### Seção de Rebate/Cashback
- Lista de categorias de jogos
- Valores de apostas e rebate por categoria
- Botão de "Receber Tudo"
- Notificação de sucesso após resgate

### Popup de Boas-vindas
- Mensagem de boas-vindas personalizada
- Informações sobre bônus e promoções
- Links para redes sociais/contato
- Opção de "Não mostrar novamente"

## Elementos Interativos

1. **Botões e CTAs**:
   - Botões principais em dourado com texto escuro
   - Botões secundários com borda dourada e texto dourado
   - Botões de ação com efeito hover/tap

2. **Navegação**:
   - Abas com indicador de seleção
   - Ícones com texto descritivo abaixo
   - Indicadores de notificação em vermelho

3. **Cards de Jogos**:
   - Efeito de hover/tap com leve aumento de escala
   - Botão "Jogar" ou "Apostar" aparecendo no hover
   - Marcadores de favorito clicáveis

4. **Formulários**:
   - Campos de entrada com borda dourada quando focados
   - Botões de submissão em destaque
   - Feedback visual após ações (sucesso/erro)

## Adaptações e Melhorias

1. **Identidade Visual Própria**:
   - Substituir todas as referências a "DDDBET" por "Luckyybet"
   - Utilizar o novo logo em todas as ocorrências
   - Manter esquema de cores mas com tons ligeiramente diferentes

2. **Simplificações**:
   - Reduzir número de popups e interrupções
   - Melhorar hierarquia visual de informações
   - Tornar a navegação mais intuitiva

3. **Responsividade**:
   - Garantir funcionamento em diferentes tamanhos de tela
   - Adaptar layout para desktop e tablet além de mobile

## Implementação Técnica

1. **Tecnologias**:
   - React para componentes de interface
   - Tailwind CSS para estilização
   - Framer Motion para animações simples

2. **Componentes Principais**:
   - Header (cabeçalho com logo e saldo)
   - BottomNavigation (navegação inferior fixa)
   - GameGrid (grade de jogos com filtragem)
   - PromotionBanner (banners de promoção)
   - JackpotCounter (contador animado de jackpot)
   - CategoryTabs (abas de categorias)

3. **Estado da Aplicação**:
   - Gerenciar estado de navegação entre abas
   - Simular valores de saldo e jackpot
   - Controlar exibição de popups e notificações
