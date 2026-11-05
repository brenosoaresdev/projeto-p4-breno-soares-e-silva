# [P4-ETAPA-06] Implementação funcional

**Projeto:** Sistema de Controle e Análise de Fluxo de Caixa para Microempresas  
**Aluno:** Breno Soares e Silva  
**Linguagem:** JavaScript (Node.js)

## O que foi feito

Nesta etapa refiz o sistema de fluxo de caixa usando o paradigma funcional. Mantive as funções do projeto: cadastrar receitas e despesas, consultar por mês e ano, calcular o saldo mensal, mostrar os gastos por categoria e verificar limites de despesas.

A principal diferença é como os dados são tratados. Antes eu alterava listas e objetos. Agora, quando cadastro uma movimentação ou defino um limite, o programa devolve uma nova versão dos dados, sem alterar a anterior.

## Arquivos

- `nucleo.js` — regras do sistema, com funções puras, `filter`, `map`, `reduce` e composição.
- `main.js` — menu no terminal e leitura dos dados digitados.
- `exemplo.js` — um exemplo pronto para conferir os resultados.
- `reflexao.md` — explicação das escolhas e reflexão solicitada pelo professor.
- `../testes/funcional.test.js` — testes da Etapa 02 e testes sobre o paradigma funcional.

## Como executar

Abra o terminal na raiz do repositório e use:

```bash
node funcional/main.js
```

Para ver um exemplo sem digitar nada:

```bash
node funcional/exemplo.js
```

Para executar os testes:

```bash
node --test testes/funcional.test.js
```

## Como a parte funcional aparece no código

- **Funções puras:** cálculos e consultas estão em `nucleo.js` e não usam teclado ou `console.log`.
- **Dados imutáveis:** novas movimentações e limites geram novas listas e objetos. Usei `Object.freeze` para evitar alterações acidentais.
- **Funções de alta ordem:** `filter`, `map` e `reduce` recebem funções como argumentos. Também há funções como `filtrarPor` e `somarPor`.
- **Composição:** os filtros de período, tipo e categoria são combinados na consulta.
- **Funções impuras:** `main.js` usa o terminal para ler e mostrar informações e mantém a versão atual do estado.

Os valores são digitados em reais e guardados em centavos para facilitar os cálculos. Não usei bibliotecas externas. A recursão manual não foi necessária porque `reduce` e as outras funções já resolvem os percursos das listas de um jeito mais claro.
