# [P4-ETAPA-05] Comparação entre as implementações imperativa e orientada a objetos

**Aluno:** Breno Soares e Silva

**Projeto:** Sistema de Controle e Análise de Fluxo de Caixa para Microempresas

## 1. Introdução

As duas implementações resolvem o mesmo problema e utilizam Python. Mantive a mesma linguagem para conseguir observar melhor as diferenças entre os paradigmas, sem misturar essas diferenças com a sintaxe de outra linguagem.

A implementação imperativa está concentrada no arquivo `imperativo/main.py`. A implementação orientada a objetos foi dividida entre as classes presentes na pasta `poo`.

As regras, entradas, saídas e casos de teste permaneceram os mesmos. O que mudou foi principalmente a representação dos dados, a localização do estado e a divisão das responsabilidades.

## 2. Representação do estado

Na implementação imperativa, o estado principal é representado por uma lista e um dicionário:

```python
movimentacoes = []
limites = {}
```

Essas estruturas são criadas na função `main` e enviadas como parâmetros para funções como `cadastrar_movimentacao`, `calcular_resumo` e `verificar_limite`.

Cada movimentação é representada por um dicionário contendo identificador, descrição, tipo, categoria, valor, mês e ano.

Na implementação orientada a objetos, o estado fica dentro de um objeto da classe `FluxoCaixa`:

```python
self.__movimentacoes = []
self.__limites = {}
```

As movimentações também deixaram de ser dicionários. Elas passaram a ser objetos das classes `Receita` ou `Despesa`.

A estrutura utilizada internamente ainda possui listas e dicionários, mas essas estruturas passaram a ficar protegidas dentro dos objetos.

## 3. Mutabilidade

As duas implementações possuem estado mutável.

Na versão imperativa, as alterações aparecem diretamente nas funções:

```python
movimentacoes.append(nova_movimentacao)
limites[chave] = valor
```

Na versão orientada a objetos, operações parecidas continuam acontecendo:

```python
self.__movimentacoes.append(movimentacao)
self.__limites[chave] = limite
```

A diferença é que, na versão orientada a objetos, essas alterações ficam dentro dos métodos de `FluxoCaixa`. Quem utiliza a classe não recebe acesso direto às coleções internas.

Portanto, a orientação a objetos não eliminou a mutabilidade. Ela controlou onde e como o estado pode ser alterado.

## 4. Fluxo de controle

O fluxo principal das duas implementações é parecido. As duas possuem:

- um laço `while` para manter o menu funcionando;
- estruturas `if`, `elif` e `else` para selecionar as opções;
- laços `for` para percorrer movimentações;
- `try` e `except` para tratar erros de entrada;
- comandos `continue` em consultas e filtros.

Na versão imperativa, o menu chama funções e envia as listas e dicionários necessários.

Na versão orientada a objetos, o menu cria objetos e chama métodos de `FluxoCaixa`.

Apesar da mudança de paradigma, a interação com o usuário continuou seguindo uma sequência de passos. Por esse motivo, o menu foi uma das partes que menos mudou.

## 5. Decomposição do problema

Na implementação imperativa, o problema foi dividido de acordo com as operações realizadas. Existem funções para:

- cadastrar uma movimentação;
- consultar movimentações;
- calcular o resumo;
- agrupar despesas;
- encontrar as maiores categorias;
- definir e verificar limites.

Na implementação orientada a objetos, o problema foi dividido de acordo com os conceitos e responsabilidades do sistema:

- `Categoria` representa as categorias permitidas;
- `Movimentacao` reúne os dados comuns;
- `Receita` e `Despesa` representam tipos diferentes de movimentação;
- `LimiteDespesa` representa e verifica um limite;
- `ResumoMensal` representa o resultado de um período;
- `FluxoCaixa` administra os cadastros e cálculos;
- `main.py` realiza a interação com o usuário.

A versão imperativa está organizada por ações. A versão orientada a objetos está organizada principalmente pelos elementos do domínio.

## 6. Reutilização

Na versão imperativa, a reutilização acontece por meio das funções. Por exemplo, `consultar_movimentacoes` pode ser chamada com filtros diferentes, e `formatar_moeda` pode ser utilizada para vários resultados.

Na versão orientada a objetos, também existe reutilização de funções, mas a herança acrescentou outra forma de reaproveitamento.

`Receita` e `Despesa` herdam atributos, validações e propriedades de `Movimentacao`. Assim, o código de validação não precisa ser repetido nas duas subclasses.

As duas subclasses implementam o método `impacto_no_saldo`. O restante do sistema pode chamar esse método sem precisar saber antecipadamente qual das subclasses recebeu.

## 7. Manutenção

Para o tamanho atual do projeto, a implementação imperativa é mais rápida de localizar porque quase todo o código está em um único arquivo.

Por outro lado, o arquivo principal ficou responsável pelo menu, pelos estados e pela ligação com várias funções. Se novas operações fossem adicionadas continuamente, esse arquivo poderia crescer bastante.

A implementação orientada a objetos possui mais arquivos, o que exige saber em qual classe cada comportamento está localizado. Porém, depois de entender essa divisão, as alterações ficam mais isoladas.

Uma mudança na verificação de limites, por exemplo, pode ser feita em `LimiteDespesa`. Uma mudança na classificação mensal pode ser feita em `ResumoMensal`. A interface do menu não precisa conhecer todos os detalhes desses cálculos.

## 8. Facilidade de extensão

A implementação orientada a objetos facilita algumas extensões.

Se fosse necessário criar um novo tipo de movimentação, seria possível criar outra subclasse de `Movimentacao` e implementar `impacto_no_saldo`.

Novas categorias podem ser adicionadas ao `Enum` `Categoria`. Novos relatórios também podem utilizar os objetos guardados por `FluxoCaixa`.

Na versão imperativa, adicionar um novo tipo poderia exigir alterações na lista de tipos aceitos e em diferentes condições que verificam textos como `"receita"` e `"despesa"`.

Entretanto, a versão orientada a objetos atual ainda possui uma condição em `gerar_resumo` que verifica o tipo da movimentação. Portanto, nem toda extensão seria automática. Dependendo do novo comportamento, também seria necessário atualizar esse método.

## 9. Tratamento de erros

Na versão imperativa, as funções de cadastro retornam um valor booleano e uma mensagem:

```python
return False, "O valor deve ser maior que zero."
```

A função principal recebe esse resultado e apresenta a mensagem.

Na versão orientada a objetos, os construtores e métodos lançam `ValueError` quando encontram dados inválidos:

```python
raise ValueError("O valor deve ser maior que zero.")
```

O `main.py` captura o erro:

```python
except ValueError as erro:
    print("Erro:", erro)
```

A vantagem da segunda forma é que um objeto inválido não termina de ser criado. A própria classe protege seu estado.

A forma imperativa, entretanto, é mais direta para quem ainda está aprendendo, pois o retorno da operação fica visível na chamada da função.

## 10. Efeitos colaterais

Nas duas versões, `input` e `print` são efeitos colaterais porque realizam comunicação com o ambiente externo.

A inclusão de movimentações e a alteração de limites também modificam o estado do programa.

Na versão imperativa, essas mudanças são visíveis porque as listas e dicionários são enviados para as funções.

Na versão orientada a objetos, as mudanças ficam dentro dos métodos. Isso protege o estado, mas também significa que é necessário conhecer a responsabilidade do método para saber que ele altera o objeto.

As consultas e cálculos foram organizados para não alterarem as movimentações cadastradas.

## 11. Facilidade para testar

A implementação imperativa permite testar funções individualmente passando listas e dicionários preparados para cada situação. Isso é simples e exige pouca configuração.

Na implementação orientada a objetos, é necessário criar um objeto `FluxoCaixa` e depois criar objetos `Receita`, `Despesa` ou `LimiteDespesa`.

Essa preparação é um pouco maior, mas os testes ficam próximos da forma como o problema é descrito. Por exemplo, é possível criar uma receita e cadastrá-la no fluxo de caixa, em vez de montar manualmente um dicionário com todos os campos.

Nas duas versões foi possível utilizar os mesmos casos definidos em `testes/casos.md`, pois o comportamento esperado não mudou.

## 12. Organização do código

A implementação imperativa possui menos arquivos e pode ser compreendida seguindo a execução de cima para baixo.

A implementação orientada a objetos possui vários arquivos e exige acompanhar os relacionamentos entre as classes.

A divisão em arquivos melhorou a separação das responsabilidades, mas também aumentou a quantidade de elementos que precisam ser conhecidos.

Para um programa pequeno, a organização imperativa é suficiente. Para um sistema que continue crescendo, a separação da versão orientada a objetos tende a evitar que toda a lógica fique concentrada em um único arquivo.

## 13. Complexidade

A implementação imperativa possui menor complexidade estrutural. Ela utiliza funções, listas, dicionários, condições e repetições.

A implementação orientada a objetos acrescentou:

- classes;
- objetos;
- propriedades;
- atributos encapsulados;
- classe abstrata;
- herança;
- polimorfismo;
- agregação;
- vários arquivos relacionados.

Essa complexidade não significa automaticamente que a solução seja melhor. No escopo atual, algumas partes ficaram maiores na versão orientada a objetos.

A vantagem aparece principalmente se o sistema precisar receber novas regras, novos tipos de movimentação ou mais relatórios. Para a versão atual e pequena, a implementação imperativa continua sendo mais simples de ler.

# Respostas às perguntas obrigatórias

## 1. Qual problema ficou mais fácil de expressar de forma imperativa?

Os cálculos diretos ficaram mais fáceis de expressar de forma imperativa.

Somar receitas e despesas, aplicar filtros e percorrer uma lista são operações sequenciais. Na versão imperativa, essas ações aparecem de maneira direta dentro das funções e exigem menos estruturas auxiliares.

O menu também ficou mais simples na versão imperativa, pois as funções são chamadas diretamente com os dados necessários.

## 2. Qual problema ficou mais fácil de expressar utilizando orientação a objetos?

A representação das movimentações e a administração do estado ficaram mais claras com orientação a objetos.

Uma receita e uma despesa passaram a ser objetos diferentes, mas relacionados por uma classe comum. O fluxo de caixa também passou a ser o responsável por suas movimentações e limites.

A regra de como cada movimentação interfere no saldo ficou representada no próprio objeto por meio de `impacto_no_saldo`.

## 3. Onde a orientação a objetos realmente trouxe vantagem?

A principal vantagem foi a separação de responsabilidades.

As validações comuns ficaram em `Movimentacao`, a verificação do limite ficou em `LimiteDespesa` e a classificação mensal ficou em `ResumoMensal`.

O encapsulamento também trouxe vantagem porque as coleções internas de `FluxoCaixa` não são alteradas diretamente pelo menu.

A herança evitou repetir os dados e validações de receita e despesa. O polimorfismo permitiu calcular o impacto no saldo usando o mesmo método para objetos diferentes.

## 4. Em quais situações a utilização de objetos acrescentou complexidade desnecessária?

Para um sistema pequeno e executado somente pelo terminal, algumas classes aumentaram a quantidade de código.

O uso de propriedades para todos os atributos, a criação de uma classe abstrata e a divisão em vários arquivos exigem mais conhecimento do que uma lista de dicionários.

`ResumoMensal` e `LimiteDespesa` poderiam ser representados por valores simples em uma solução menor. Eles foram transformados em objetos para distribuir responsabilidades e permitir uma possível evolução do sistema.

Portanto, os objetos acrescentaram organização, mas também criaram uma estrutura maior do que a necessária para apenas executar os cálculos atuais.

## 5. Que partes do problema praticamente não mudaram entre as duas implementações?

As seguintes partes praticamente não mudaram:

- opções do menu;
- leitura de dados com `input`;
- apresentação com `print`;
- categorias aceitas;
- regras de validação;
- fórmulas de receitas, despesas e saldo;
- filtros por mês, ano, tipo e categoria;
- comparação dos gastos com limites;
- repetição principal do programa;
- armazenamento somente durante a execução;
- casos de teste e resultados esperados.

A forma interna mudou, mas o comportamento observado pelo usuário continuou igual.

## 6. Que partes precisaram ser completamente remodeladas?

A representação de uma movimentação foi a principal mudança. Na versão imperativa, ela era um dicionário. Na versão orientada a objetos, passou a ser uma instância de `Receita` ou `Despesa`.

O estado também foi remodelado. Antes, as coleções eram criadas em `main` e enviadas às funções. Depois, passaram a pertencer ao objeto `FluxoCaixa`.

Os limites deixaram de ser apenas valores dentro de um dicionário e passaram a ser objetos `LimiteDespesa`.

O resumo, que antes era devolvido como vários valores, passou a ser representado por um objeto `ResumoMensal`.

O tratamento de falhas também mudou de retornos booleanos com mensagens para exceções `ValueError` tratadas pela interface.

## Conclusão

As duas soluções são adequadas para o problema, mas possuem vantagens diferentes.

A implementação imperativa é menor, mais direta e mais fácil de acompanhar no escopo atual. A implementação orientada a objetos exige mais estrutura, mas representa melhor os elementos do sistema e separa suas responsabilidades.

A comparação mostrou que orientação a objetos não é automaticamente melhor para qualquer situação. Para programas pequenos, a solução imperativa pode ser suficiente. Quando o sistema precisa crescer e receber novas responsabilidades, o encapsulamento e a divisão em objetos podem facilitar a manutenção.