# Decisões de implementação

## [P4-ETAPA-03] Implementação imperativa

**Aluno:** Breno Soares e Silva
**Projeto:** Sistema de Controle e Análise de Fluxo de Caixa para Microempresas

## 1. Linguagem escolhida

Para a implementação imperativa, escolhi Python por possuir uma sintaxe direta e permitir o uso de variáveis, atribuições, repetições, condições e funções sem a necessidade de criar classes.

A intenção desta etapa foi deixar o fluxo de execução visível. Por isso, não foram utilizadas classes ou outras estruturas orientadas a objetos.

## 2. Estados mantidos pelo programa

Durante a execução, o programa mantém dois estados principais:

* `movimentacoes`: lista que armazena as receitas e despesas cadastradas;
* `limites`: dicionário que armazena os limites mensais de cada categoria.

Cada movimentação é representada por um dicionário com identificador, descrição, tipo, categoria, valor, mês e ano.

Os limites utilizam uma combinação de categoria, mês e ano como chave. Dessa maneira, uma mesma categoria pode possuir limites diferentes em períodos diferentes.

Os dados permanecem somente na memória enquanto o programa está aberto. Quando o programa é encerrado, as informações são perdidas. Essa escolha foi feita porque o armazenamento permanente e o uso de banco de dados estão fora do escopo definido na Etapa 01.

## 3. Operações que modificam o estado

A função `cadastrar_movimentacao` modifica a lista de movimentações utilizando o comando `append`. Antes dessa alteração, os dados recebidos são validados.

A função `definir_limite` modifica o dicionário de limites por meio de uma atribuição. Se já existir um limite para a mesma categoria e período, o valor anterior será substituído.

As funções de consulta e cálculo não modificam esses estados. Elas apenas percorrem os dados e retornam os resultados encontrados.

## 4. Efeitos colaterais

Os principais efeitos colaterais presentes no programa são:

* leitura de dados digitados pelo usuário com `input`;
* apresentação de mensagens e resultados com `print`;
* inclusão de uma movimentação na lista;
* inclusão ou alteração de um limite no dicionário.

Esses efeitos aparecem de maneira explícita no código. Não existe alteração de banco de dados ou de arquivos externos.

## 5. Estruturas de controle utilizadas

O menu principal utiliza um `while` para continuar executando até que o usuário escolha a opção de sair.

As estruturas `if`, `elif` e `else` são utilizadas para selecionar as opções do menu, validar os dados e classificar os resultados.

Os laços `for` são utilizados para percorrer as movimentações, realizar filtros, calcular totais e encontrar as categorias com maiores despesas.

Também foram utilizados `continue` para ignorar movimentações que não correspondem aos filtros e `try` e `except` para impedir que o programa seja interrompido quando o usuário digitar um número inválido.

## 6. Organização dos subprogramas

O programa foi dividido em funções para evitar que toda a lógica ficasse concentrada no menu principal.

As funções foram organizadas da seguinte forma:

* cadastro e validação de movimentações;
* consulta por período, tipo e categoria;
* cálculo do resumo mensal;
* agrupamento de despesas por categoria;
* identificação das maiores categorias de despesas;
* definição e verificação de limites;
* leitura e formatação dos valores;
* apresentação do menu e das movimentações.

Os dados necessários são recebidos por parâmetros. Os resultados são devolvidos com `return`, permitindo que o menu principal decida como apresentá-los.

## 7. Fluxo de execução

A execução começa na função `main`. Nela são criadas a lista de movimentações e o dicionário de limites.

Em seguida, o menu é apresentado dentro de uma repetição. O usuário escolhe uma opção, os dados necessários são solicitados e a função correspondente é chamada.

Depois da operação, o resultado é apresentado e o programa retorna ao menu. Esse processo continua até que a opção zero seja informada.

## 8. Uso de valores monetários

Os valores foram armazenados como números do tipo `float` e arredondados para duas casas decimais nos cálculos. A função `formatar_moeda` apresenta os resultados no formato utilizado em reais.

Essa escolha mantém a implementação mais direta para o objetivo acadêmico. Em um sistema financeiro real, seria mais adequado utilizar uma representação específica para valores monetários, como `Decimal` ou valores inteiros em centavos.

## 9. Por que a solução é imperativa

A solução pode ser considerada predominantemente imperativa porque apresenta uma sequência explícita de comandos e utiliza variáveis cujo conteúdo muda durante a execução.

O estado do sistema é alterado diretamente por operações sobre listas e dicionários. O controle do programa é realizado com atribuições, condições, repetições e chamadas de funções.

Não foram utilizadas classes, objetos ou mecanismos que escondessem essas mudanças de estado.

## 10. Validação

A implementação foi comparada com os casos definidos no arquivo `testes/casos.md`.

Durante a validação, foram conferidos os cadastros, cálculos mensais, filtros, agrupamentos, limites, casos sem movimentação e entradas inválidas. Também foram encontrados ajustes necessários na apresentação dos totais dos filtros e do valor da maior despesa. Esses ajustes foram realizados antes da entrega.

| Caso | Resultado                     |
| ---- | ----------------------------- |
| CN01 | Aprovado                      |
| CN02 | Aprovado                      |
| CN03 | Aprovado                      |
| CN04 | Aprovado                      |
| CN05 | Aprovado                      |
| CN06 | Aprovado após ajuste da saída |
| CN07 | Aprovado após ajuste da saída |
| CN08 | Aprovado após ajuste da saída |
| CN09 | Aprovado                      |
| CN10 | Aprovado                      |
| CL01 | Aprovado                      |
| CL02 | Aprovado                      |
| CL03 | Aprovado                      |
| CI01 | Aprovado                      |
| CI02 | Aprovado                      |
