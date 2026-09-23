# [P4-ETAPA-02] Contrato Semântico e Testes



**Aluno:** Breno Soares e Silva

**Projeto:** Sistema de Controle e Análise de Fluxo de Caixa para Microempresas



## 1. Casos normais



### Caso normal 01 — Cadastro de receita



**Identificador:** CN01



**Descrição:** Verificar se uma receita com dados válidos pode ser cadastrada.



**Entrada:**



* identificador: L001;

* descrição: venda de camisetas;

* tipo: receita;

* categoria: vendas;

* valor: R$ 1.500,00;

* mês: 9;

* ano: 2026.



**Saída esperada:**



* lançamento L001 registrado com sucesso.



### Caso normal 02 — Cadastro de despesa



**Identificador:** CN02



**Descrição:** Verificar se uma despesa com dados válidos pode ser cadastrada.



**Entrada:**



* identificador: L002;

* descrição: pagamento do aluguel;

* tipo: despesa;

* categoria: aluguel;

* valor: R$ 800,00;

* mês: 9;

* ano: 2026.



**Saída esperada:**



* lançamento L002 registrado com sucesso.



### Caso normal 03 — Resultado mensal positivo



**Identificador:** CN03



**Descrição:** Verificar o cálculo de um mês em que as receitas são maiores que as despesas.



**Entrada:**



* L003: receita de vendas no valor de R$ 1.500,00;

* L004: receita de serviços no valor de R$ 500,00;

* L005: despesa com fornecedores no valor de R$ 800,00;

* L006: despesa com marketing no valor de R$ 300,00;

* mês consultado: 9;

* ano consultado: 2026.



**Saída esperada:**



* total de receitas: R$ 2.000,00;

* total de despesas: R$ 1.100,00;

* saldo mensal: R$ 900,00;

* classificação: resultado positivo.



### Caso normal 04 — Resultado mensal negativo



**Identificador:** CN04



**Descrição:** Verificar o cálculo de um mês em que as despesas são maiores que as receitas.



**Entrada:**



* L007: receita de serviços no valor de R$ 1.200,00;

* L008: despesa com fornecedores no valor de R$ 1.500,00;

* mês consultado: 10;

* ano consultado: 2026.



**Saída esperada:**



* total de receitas: R$ 1.200,00;

* total de despesas: R$ 1.500,00;

* saldo mensal: -R$ 300,00;

* classificação: resultado negativo.



### Caso normal 05 — Equilíbrio mensal



**Identificador:** CN05



**Descrição:** Verificar a classificação de um mês em que receitas e despesas possuem o mesmo total.



**Entrada:**



* L009: receita de vendas no valor de R$ 2.000,00;

* L010: despesa com fornecedores no valor de R$ 2.000,00;

* mês consultado: 11;

* ano consultado: 2026.



**Saída esperada:**



* total de receitas: R$ 2.000,00;

* total de despesas: R$ 2.000,00;

* saldo mensal: R$ 0,00;

* classificação: equilíbrio.



### Caso normal 06 — Filtro por tipo



**Identificador:** CN06



**Descrição:** Verificar se a consulta por tipo apresenta somente as despesas do período.



**Entrada:**



* L011: receita de vendas no valor de R$ 1.000,00;

* L012: despesa com transporte no valor de R$ 400,00;

* L013: despesa com marketing no valor de R$ 300,00;

* filtro: despesa;

* mês consultado: 1;

* ano consultado: 2027.



**Saída esperada:**



* lançamentos encontrados: L012 e L013;

* quantidade de lançamentos: 2;

* total das despesas encontradas: R$ 700,00;

* o lançamento L011 não deverá ser apresentado.



### Caso normal 07 — Filtro por categoria



**Identificador:** CN07



**Descrição:** Verificar se a consulta por categoria apresenta somente os lançamentos de marketing.



**Entrada:**



* L014: despesa de marketing no valor de R$ 200,00;

* L015: despesa de marketing no valor de R$ 100,00;

* L016: despesa de aluguel no valor de R$ 500,00;

* categoria consultada: marketing;

* mês consultado: 2;

* ano consultado: 2027.



**Saída esperada:**



* lançamentos encontrados: L014 e L015;

* quantidade de lançamentos: 2;

* total da categoria marketing: R$ 300,00;

* o lançamento L016 não deverá ser apresentado.



### Caso normal 08 — Agrupamento das despesas por categoria



**Identificador:** CN08



**Descrição:** Verificar o total de despesas de cada categoria e identificar a categoria com maior gasto.



**Entrada:**



* L017: despesa com fornecedores no valor de R$ 600,00;

* L018: despesa com fornecedores no valor de R$ 200,00;

* L019: despesa com aluguel no valor de R$ 900,00;

* L020: despesa com transporte no valor de R$ 100,00;

* mês consultado: 3;

* ano consultado: 2027.



**Saída esperada:**



* fornecedores: R$ 800,00;

* aluguel: R$ 900,00;

* transporte: R$ 100,00;

* categoria com maior despesa: aluguel;

* valor da maior despesa por categoria: R$ 900,00.



### Caso normal 09 — Despesa abaixo do limite



**Identificador:** CN09



**Descrição:** Verificar uma categoria cujo total de despesas está abaixo do limite definido.



**Entrada:**



* limite de transporte: R$ 500,00;

* L021: despesa de transporte no valor de R$ 150,00;

* L022: despesa de transporte no valor de R$ 200,00;

* mês: 4;

* ano: 2027.



**Saída esperada:**



* total de despesas com transporte: R$ 350,00;

* limite definido: R$ 500,00;

* limite não ultrapassado.



### Caso normal 10 — Limite ultrapassado



**Identificador:** CN10



**Descrição:** Verificar uma categoria cujo total de despesas ultrapassa o limite definido.



**Entrada:**



* limite de marketing: R$ 250,00;

* L023: despesa de marketing no valor de R$ 200,00;

* L024: despesa de marketing no valor de R$ 100,00;

* mês: 5;

* ano: 2027.



**Saída esperada:**



* total de despesas com marketing: R$ 300,00;

* limite definido: R$ 250,00;

* limite ultrapassado;

* valor excedente: R$ 50,00.



## 2. Casos-limite



### Caso-limite 01 — Período sem movimentação



**Identificador:** CL01



**Descrição:** Verificar o resultado de uma consulta para um período sem lançamentos.



**Entrada:**



* mês consultado: 6;

* ano consultado: 2027;

* nenhum lançamento registrado no período.



**Saída esperada:**



* total de receitas: R$ 0,00;

* total de despesas: R$ 0,00;

* saldo mensal: R$ 0,00;

* classificação: sem movimentação.



### Caso-limite 02 — Despesa igual ao limite



**Identificador:** CL02



**Descrição:** Verificar o resultado quando a despesa é exatamente igual ao limite da categoria.



**Entrada:**



* limite de aluguel: R$ 800,00;

* L025: despesa de aluguel no valor de R$ 800,00;

* mês: 7;

* ano: 2027.



**Saída esperada:**



* total de despesas com aluguel: R$ 800,00;

* limite definido: R$ 800,00;

* limite atingido, mas não ultrapassado;

* valor disponível: R$ 0,00.



### Caso-limite 03 — Empate entre as maiores despesas



**Identificador:** CL03



**Descrição:** Verificar o resultado quando duas categorias possuem o mesmo maior valor de despesas.



**Entrada:**



* L026: despesa com fornecedores no valor de R$ 900,00;

* L027: despesa com aluguel no valor de R$ 900,00;

* L028: despesa com marketing no valor de R$ 300,00;

* mês consultado: 8;

* ano consultado: 2027.



**Saída esperada:**



* fornecedores: R$ 900,00;

* aluguel: R$ 900,00;

* marketing: R$ 300,00;

* categorias com maior despesa: fornecedores e aluguel.



## 3. Casos de entrada inválida



### Caso inválido 01 — Valor negativo



**Identificador:** CI01



**Descrição:** Verificar se um lançamento com valor negativo é recusado.



**Entrada:**



* identificador: L029;

* descrição: pagamento de aluguel;

* tipo: despesa;

* categoria: aluguel;

* valor: -R$ 800,00;

* mês: 9;

* ano: 2027.



**Saída esperada:**



* lançamento recusado;

* mensagem informando que o valor deve ser maior que zero;

* o lançamento L029 não deverá ser cadastrado.



### Caso inválido 02 — Identificador repetido



**Identificador:** CI02



**Descrição:** Verificar se o sistema impede o cadastro de dois lançamentos com o mesmo identificador.



**Entrada:**



Primeiro lançamento:



* identificador: L030;

* descrição: venda de produtos;

* tipo: receita;

* categoria: vendas;

* valor: R$ 1.000,00;

* mês: 10;

* ano: 2027.



Segundo lançamento:



* identificador: L030;

* descrição: pagamento de transporte;

* tipo: despesa;

* categoria: transporte;

* valor: R$ 200,00;

* mês: 10;

* ano: 2027.



**Saída esperada:**



* primeiro lançamento registrado com sucesso;

* segundo lançamento recusado por possuir um identificador já utilizado;

* somente o primeiro lançamento deverá permanecer cadastrado.



