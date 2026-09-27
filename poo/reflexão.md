# [P4-ETAPA-04] Reflexão sobre a implementação orientada a objetos

**Aluno:** Breno Soares e Silva
**Projeto:** Sistema de Controle e Análise de Fluxo de Caixa para Microempresas

## Como meu modelo mudou ao passar do paradigma imperativo para o orientado a objetos?

Na implementação imperativa, o estado do sistema era representado principalmente por uma lista de movimentações e um dicionário de limites. Essas estruturas eram criadas na função principal e enviadas como parâmetros para diferentes funções.

Na implementação orientada a objetos, o estado passou a pertencer aos objetos. A classe `FluxoCaixa` mantém internamente as movimentações e os limites. As receitas, despesas, categorias, limites e resumos também passaram a possuir representações próprias.

A linguagem Python foi mantida para permitir que a comparação se concentrasse na mudança de paradigma. Embora as duas implementações utilizem a mesma linguagem, a forma de organizar os dados e as responsabilidades foi modificada.

## Representação do estado

Na implementação imperativa, as movimentações eram dicionários armazenados em uma lista. Cada função precisava receber essa lista para realizar uma consulta ou alteração.

Na implementação orientada a objetos, cada movimentação é um objeto. Os dados como identificador, descrição, categoria, valor, mês e ano ficam armazenados dentro desse objeto.

O objeto `FluxoCaixa` possui uma coleção de movimentações e uma coleção de limites. Dessa maneira, não é necessário passar essas coleções para todas as operações. Os métodos da própria classe utilizam o estado que ela mantém.

## Responsabilidades

As responsabilidades foram separadas entre as classes.

A classe `Categoria` representa as categorias aceitas pelo sistema.

A classe abstrata `Movimentacao` contém os dados e validações que são comuns às receitas e despesas.

As classes `Receita` e `Despesa` determinam como cada tipo de movimentação interfere no saldo.

A classe `LimiteDespesa` armazena um limite mensal e verifica se o total gasto está dentro, igual ou acima desse limite.

A classe `ResumoMensal` representa o resultado de uma consulta mensal. Ela guarda os totais, o saldo, a classificação e as maiores categorias de despesas.

A classe `FluxoCaixa` administra as movimentações e os limites. Ela é responsável pelos cadastros, consultas, cálculos e verificações.

O arquivo `main.py` ficou responsável pela comunicação com o usuário. Ele apresenta o menu, lê os dados e chama os métodos dos objetos.

## Relacionamento entre os componentes

`Receita` e `Despesa` herdam de `Movimentacao`. Essa herança foi utilizada porque as duas possuem os mesmos dados básicos, mas apresentam comportamentos diferentes no cálculo do saldo.

A classe `FluxoCaixa` mantém objetos do tipo `Movimentacao` e `LimiteDespesa`. Esse relacionamento é uma agregação, pois o fluxo de caixa administra uma coleção desses objetos.

Durante a geração de um relatório, `FluxoCaixa` cria um objeto `ResumoMensal` com os resultados encontrados.

Preferi utilizar agregação em `FluxoCaixa` em vez de fazer essa classe herdar de uma lista. Um fluxo de caixa possui movimentações, mas não é uma movimentação nem uma lista.

## Reutilização

A classe `Movimentacao` evita a repetição de atributos e validações entre `Receita` e `Despesa`. As duas subclasses reutilizam o mesmo construtor e as mesmas propriedades.

O método `impacto_no_saldo` é implementado de maneira diferente em cada subclasse. Uma receita retorna um valor positivo e uma despesa retorna um valor negativo.

O cálculo do saldo pode utilizar o mesmo método para qualquer movimentação. O objeto decide qual resultado deve produzir. Esse comportamento representa o polimorfismo utilizado na solução.

## Encapsulamento

Os atributos principais foram definidos com dois sublinhados, como `__movimentacoes`, `__valor` e `__categoria`. Isso evita que outras partes do programa dependam da alteração direta desses dados.

As propriedades permitem consultar as informações necessárias sem fornecer acesso direto aos atributos internos.

Para cadastrar uma movimentação, é necessário utilizar o método de cadastro de `FluxoCaixa`. Dessa forma, a classe pode verificar se o identificador já foi utilizado antes de alterar seu estado.

## Extensão do sistema

A organização em classes permite adicionar novos comportamentos sem concentrar tudo no menu principal.

Se fosse necessário criar outro tipo de movimentação com um efeito diferente no saldo, seria possível criar uma nova subclasse de `Movimentacao` e implementar o método `impacto_no_saldo`.

Novas categorias podem ser adicionadas ao `Enum` `Categoria`. Também seria possível criar novos tipos de resumo ou relatórios utilizando os objetos já cadastrados em `FluxoCaixa`.

Essa possibilidade de extensão é maior do que na implementação imperativa, porque as responsabilidades estão separadas e cada classe possui uma função definida.

## Uso da herança

A herança foi usada apenas entre `Movimentacao`, `Receita` e `Despesa`, porque existe uma relação direta entre esses conceitos.

Nos outros componentes, utilizei objetos internos e agregação. Criar heranças adicionais apenas para demonstrar o recurso deixaria a solução mais difícil de entender e não representaria corretamente o problema.

## Validação

A implementação orientada a objetos manteve as mesmas regras, entradas e resultados definidos nas etapas anteriores.

Os casos registrados em `testes/casos.md` foram utilizados como referência para verificar cadastros, consultas, cálculos mensais, limites, empates entre categorias e entradas inválidas.

Assim, a estrutura interna mudou, mas o comportamento esperado do sistema permaneceu o mesmo.

## Conclusão

A principal mudança não foi a linguagem, mas a organização da solução.

Na versão imperativa, as funções manipulavam diretamente listas e dicionários. Na versão orientada a objetos, o estado e os comportamentos foram distribuídos entre objetos com responsabilidades próprias.

A nova implementação utiliza encapsulamento, abstração, objetos, herança, agregação e polimorfismo sem alterar o problema definido na primeira etapa.