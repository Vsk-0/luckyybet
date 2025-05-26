## Plano de Melhorias - Simulação Jogos PG (Fortune Tiger)

Com base na análise visual do site BETO.com e outras referências, as seguintes melhorias serão implementadas no componente `GameModal.tsx` para aprimorar a simulação do Fortune Tiger:

1.  **Interface Visual Geral:**
    *   **Fundo:** Substituir o fundo genérico por uma imagem ou gradiente que remeta ao tema asiático/templo do Fortune Tiger (vermelho, dourado, elementos de templo).
    *   **Layout dos Controles:** Reorganizar os controles (saldo, aposta, giro) para se assemelharem mais à disposição vista nas imagens de referência (botão de giro central grande, controles de aposta +/- ao lado, saldo/ganho na parte superior ou inferior de forma clara).
    *   **Botão de Giro:** Estilizar o botão de giro para ser maior, mais proeminente e com design similar ao original (verde ou dourado com detalhes).
    *   **Controles de Aposta:** Melhorar visual dos botões +/- e do display de valor da aposta.
    *   **Fontes e Cores:** Ajustar fontes e cores dos textos (saldo, aposta, ganhos) para maior fidelidade.

2.  **Símbolos e Animações:**
    *   **Símbolos:** Utilizar imagens dos símbolos reais do Fortune Tiger (Laranja, Fogos de Artifício, Envelope Vermelho, Saco de Moedas, Amuleto Verde, Lingote de Ouro, Tigre Wild) em vez de apenas emojis. Salvar essas imagens como assets.
    *   **Animação de Giro:** Melhorar a animação de giro dos rolos para ser mais fluida e visualmente parecida com um slot real (efeito blur/velocidade).
    *   **Animação de Vitória:** Criar animações mais elaboradas para vitórias:
        *   Destacar a linha de pagamento vencedora.
        *   Animar os símbolos vencedores (brilho, pulso, etc.).
        *   Exibir o valor ganho de forma mais impactante (fonte maior, animação de contagem/aparecimento).
    *   **Efeitos Sonoros (Simulado):** Adicionar placeholders ou descrições para futuros efeitos sonoros (giro, vitória, clique de botão) - a implementação real de áudio pode consumir mais créditos.

3.  **Mecânicas Simuladas:**
    *   **Respin Feature (Simulada):** Implementar uma lógica simulada para o recurso de respin. Por exemplo, aleatoriamente, após um giro sem vitória, acionar um respin visual onde os rolos giram novamente (sem custo de aposta) com chance aumentada de vitória.
    *   **Multiplicador x10 (Simulado):** Implementar a lógica simulada onde, se todos os símbolos na tela forem iguais (uma vitória de tela cheia), o ganho é multiplicado por 10 e exibido de forma destacada.

4.  **Refinamentos Gerais:**
    *   **Tela de Carregamento:** Manter a tela de carregamento estilizada, talvez adicionando o logo do Fortune Tiger.
    *   **Responsividade:** Garantir que o modal do jogo se adapte bem a diferentes tamanhos de tela mobile.

**Priorização (Otimização de Créditos):**

1.  Atualização dos Símbolos (usando imagens).
2.  Melhoria no Layout dos Controles e Botão de Giro.
3.  Animação de Vitória mais elaborada.
4.  Simulação básica do Respin e Multiplicador x10.
5.  Refinamento da Animação de Giro.
6.  Ajustes finos de fontes, cores e fundo.

*Este plano guiará a próxima fase de implementação no `GameModal.tsx`.*
