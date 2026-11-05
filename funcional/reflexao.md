# [P4-ETAPA-06] Reflexão sobre a implementação funcional

**Aluno:** Breno Soares e Silva  
**Projeto:** Sistema de Controle e Análise de Fluxo de Caixa para Microempresas

## Como eu organizei essa etapa

Continuei com o mesmo problema das etapas anteriores, mas fiz a implementação em JavaScript para trabalhar mais com funções. Separei o programa em dois arquivos principais: `nucleo.js`, que tem as regras e os cálculos, e `main.js`, que tem o menu e as perguntas feitas ao usuário.

Usei `filter` para selecionar as movimentações de um mês ou de uma categoria, `reduce` para somar os valores e agrupar despesas, e `map` para transformar os resultados quando necessário. Os filtros também podem ser combinados com a função `compor`.

## Funções puras, impuras e dados imutáveis

As funções do `nucleo.js` recebem os dados e devolvem um resultado sem mudar a lista original. Por exemplo, `cadastrarMovimentacao` devolve um novo estado com o lançamento incluído. `resumoMensal` recebe as movimentações e calcula receitas, despesas, saldo e classificação. Essas são funções puras: se os dados forem os mesmos, o resultado também será.

Já o `main.js` tem funções impuras, porque precisa ler o teclado e escrever no terminal. Ele também guarda a nova versão dos dados para que o usuário consiga continuar usando o sistema. Essa parte fica separada dos cálculos.

## O que mudou no meu raciocínio?

Nas implementações anteriores eu pensava mais em **"Que estado devo modificar?"**. Na versão imperativa, por exemplo, cadastrar uma movimentação significava acrescentar um item na lista existente. Na orientação a objetos, a mudança ficava dentro dos métodos das classes.

Agora a pergunta passou a ser **"Que transformação deve ser aplicada aos dados?"**. Em vez de adicionar diretamente uma movimentação à mesma lista, eu crio uma nova lista com o lançamento. Para montar o resumo, filtro os dados do mês, separo receitas e despesas e somo os valores com `reduce`, sem precisar ficar atualizando acumuladores manualmente.

No início foi um pouco diferente pensar dessa forma, principalmente na parte do cadastro e dos limites. Mas a separação das funções facilitou os testes, porque posso chamar uma função com valores conhecidos e conferir a resposta sem depender do menu ou de alterações feitas antes.

## Recursão

Não usei recursão manual porque, neste problema, o objetivo é principalmente filtrar e somar listas. `filter` e `reduce` já fazem esse trabalho e deixam o código mais fácil de acompanhar.

## Testes

Reaproveitei os 15 casos da Etapa 02 (10 normais, 3 casos-limite e 2 inválidos) e acrescentei testes para conferir que o estado anterior não muda e que as funções retornam o resultado esperado. O arquivo de testes fica em `testes/funcional.test.js`.
