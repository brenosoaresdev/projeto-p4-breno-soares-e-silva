\# projeto-p4-breno-soares-e-silva



\*\*Etapa:\*\* `\[P4-ETAPA-01] Proposta e Especificação do Problema`  

\*\*Aluno:\*\* Breno Soares e Silva  

\*\*Projeto escolhido:\*\* Sistema de Controle e Análise de Fluxo de Caixa para Microempresas



\## 1. Descrição do problema



Pequenas empresas realizam entradas e saídas de dinheiro relacionadas a vendas, serviços, fornecedores, aluguel, transporte, marketing e outras atividades. Quando essas movimentações não são organizadas, o responsável pela empresa pode ter dificuldade para saber quanto recebeu, quanto gastou, quais categorias concentram as maiores despesas e se o resultado de determinado mês foi positivo ou negativo.



O problema proposto consiste em controlar as movimentações financeiras realizadas por uma microempresa. O sistema deverá registrar receitas e despesas, organizar os lançamentos por categoria e período e produzir análises mensais do fluxo de caixa.



O sistema considerará somente valores que efetivamente entraram ou saíram do caixa da empresa. Valores previstos, contas pendentes e compromissos futuros não serão registrados.



\## 2. Objetivo



O sistema deverá permitir o registro e a consulta das movimentações financeiras de uma microempresa.



A partir dos lançamentos informados, o sistema deverá:



\- calcular o total de receitas de determinado mês;

\- calcular o total de despesas;

\- calcular o saldo do período;

\- classificar o resultado mensal;

\- agrupar as despesas por categoria;

\- identificar a categoria com maior gasto;

\- comparar os gastos de cada categoria com limites definidos pela empresa;

\- apresentar um resumo mensal do fluxo de caixa.



\## 3. Entradas



Para cada lançamento financeiro, o sistema receberá:



\- identificador único;

\- descrição;

\- tipo, definido como receita ou despesa;

\- categoria;

\- valor;

\- mês de referência;

\- ano de referência.



As categorias inicialmente consideradas serão:



\- vendas;

\- serviços;

\- fornecedores;

\- aluguel;

\- marketing;

\- transporte;

\- outros.



Para o controle de gastos, o sistema também poderá receber:



\- categoria de despesa;

\- limite mensal da categoria;

\- mês;

\- ano.



Nas consultas, o sistema receberá o mês e o ano desejados. O usuário também poderá informar filtros por tipo ou categoria.



\## 4. Saídas



O sistema deverá produzir:



\- confirmação do registro de um lançamento;

\- mensagem informando o motivo de uma recusa;

\- lista dos lançamentos encontrados;

\- total de receitas no período;

\- total de despesas no período;

\- saldo mensal;

\- classificação do resultado;

\- total de despesas em cada categoria;

\- categoria ou categorias com maior despesa;

\- aviso de limite de gasto ultrapassado;

\- valor que excedeu o limite;

\- resumo mensal do fluxo de caixa.



As classificações possíveis para o resultado mensal serão:



\- resultado positivo;

\- equilíbrio;

\- resultado negativo;

\- sem movimentação.



\## 5. Regras do problema



1\. Cada lançamento deverá possuir um identificador único.

2\. A descrição do lançamento não poderá estar vazia.

3\. O tipo deverá ser informado como receita ou despesa.

4\. O valor deverá ser maior que zero.

5\. O tipo do lançamento indicará se o valor representa uma entrada ou uma saída. Portanto, os valores não serão registrados como números negativos.

6\. O mês deverá ser representado por um número entre 1 e 12.

7\. O ano deverá ser representado por um número inteiro positivo.

8\. A categoria deverá pertencer ao conjunto de categorias aceitas pelo sistema.

9\. O total de receitas será calculado pela soma de todos os lançamentos do tipo receita no mês e ano consultados.

10\. O total de despesas será calculado pela soma de todos os lançamentos do tipo despesa no mês e ano consultados.

11\. O saldo mensal será calculado por:



&#x20;   `Saldo mensal = total de receitas - total de despesas`



12\. Quando o saldo for maior que zero, o mês será classificado como resultado positivo.

13\. Quando o saldo for igual a zero e existirem lançamentos no período, o mês será classificado como equilíbrio.

14\. Quando o saldo for menor que zero, o mês será classificado como resultado negativo.

15\. Quando não existirem lançamentos no período, o sistema deverá informar a situação sem movimentação.

16\. O total de uma categoria será calculado pela soma dos lançamentos daquela categoria no período consultado.

17\. A categoria com maior despesa será aquela que possuir o maior total de lançamentos do tipo despesa.

18\. Se duas ou mais categorias possuírem o mesmo maior valor de despesa, todas deverão ser apresentadas.

19\. Um limite mensal somente poderá ser definido para uma categoria de despesa.

20\. O limite mensal deverá ser maior que zero.

21\. Uma categoria terá o limite ultrapassado quando o total de despesas for maior que o limite definido.

22\. Se o total de despesas for exatamente igual ao limite, ele não será considerado ultrapassado.

23\. O valor excedente será calculado por:



&#x20;   `Valor excedente = total da categoria - limite da categoria`



24\. Quando não existir limite definido para uma categoria, o sistema apresentará apenas o total gasto, sem emitir aviso.

25\. As consultas deverão considerar somente os lançamentos correspondentes ao mês e ao ano informados.

26\. Quando um filtro por tipo ou categoria for utilizado, somente os lançamentos correspondentes ao filtro deverão ser apresentados.



\## 6. Casos de exemplo



\### Exemplo 1 - Registro de receita



\*\*Entrada:\*\*



\- identificador: L001;

\- descrição: venda de camisetas;

\- tipo: receita;

\- categoria: vendas;

\- valor: R$ 1.500,00;

\- mês: 9;

\- ano: 2026.



\*\*Saída esperada:\*\*



\- lançamento registrado com sucesso.



\### Exemplo 2 - Registro com valor inválido



\*\*Entrada:\*\*



\- identificador: L002;

\- descrição: pagamento do aluguel;

\- tipo: despesa;

\- categoria: aluguel;

\- valor: R$ -800,00;

\- mês: 9;

\- ano: 2026.



\*\*Saída esperada:\*\*



\- lançamento recusado porque o valor deve ser maior que zero.



\### Exemplo 3 - Resumo mensal



\*\*Entrada:\*\*



\- receita de vendas no valor de R$ 1.500,00;

\- receita de serviços no valor de R$ 500,00;

\- despesa com fornecedores no valor de R$ 800,00;

\- despesa com marketing no valor de R$ 300,00;

\- período consultado: setembro de 2026.



\*\*Saída esperada:\*\*



\- total de receitas: R$ 2.000,00;

\- total de despesas: R$ 1.100,00;

\- saldo mensal: R$ 900,00;

\- classificação: resultado positivo.



\### Exemplo 4 - Consulta por categoria



\*\*Entrada:\*\*



\- categoria: marketing;

\- mês: 9;

\- ano: 2026;

\- duas despesas de marketing nos valores de R$ 200,00 e R$ 100,00.



\*\*Saída esperada:\*\*



\- dois lançamentos encontrados;

\- total da categoria marketing: R$ 300,00.



\### Exemplo 5 - Limite ultrapassado



\*\*Entrada:\*\*



\- limite de marketing: R$ 250,00;

\- despesas de marketing: R$ 300,00;

\- período: setembro de 2026.



\*\*Saída esperada:\*\*



\- limite ultrapassado;

\- valor excedente: R$ 50,00.



\### Exemplo 6 - Despesa igual ao limite



\*\*Entrada:\*\*



\- limite de transporte: R$ 200,00;

\- despesas de transporte: R$ 200,00;

\- período: setembro de 2026.



\*\*Saída esperada:\*\*



\- limite não ultrapassado;

\- valor disponível: R$ 0,00.



\### Exemplo 7 - Período sem movimentação



\*\*Entrada:\*\*



\- mês: 10;

\- ano: 2026;

\- nenhum lançamento registrado nesse período.



\*\*Saída esperada:\*\*



\- total de receitas: R$ 0,00;

\- total de despesas: R$ 0,00;

\- saldo mensal: R$ 0,00;

\- classificação: sem movimentação.



\## 7. Casos-limite



\- Se as receitas e as despesas possuírem exatamente o mesmo total, o saldo será zero e o mês será classificado como equilíbrio.

\- Se uma despesa for exatamente igual ao limite da categoria, o limite não será considerado ultrapassado.

\- Se não houver lançamentos no mês consultado, os totais serão iguais a zero e a classificação será sem movimentação.

\- Se duas categorias apresentarem o mesmo maior valor de despesa, as duas serão informadas como categorias de maior gasto.

\- Se um identificador já utilizado for informado novamente, o lançamento será recusado.

\- Se o mês informado for menor que 1 ou maior que 12, o lançamento ou a consulta será recusado.

\- Se o valor informado for igual a zero, o lançamento será recusado.



\## 8. Restrições



Estão fora do escopo do projeto:



\- contas a pagar;

\- contas a receber;

\- datas de vencimento;

\- controle de pagamentos pendentes;

\- cálculo de atrasos, multas ou juros;

\- parcelamentos;

\- lançamentos recorrentes;

\- previsões financeiras;

\- integração com bancos;

\- emissão de notas fiscais;

\- cálculo de impostos;

\- serviços contábeis;

\- controle de estoque;

\- cadastro de clientes e fornecedores;

\- folha de pagamento;

\- conversão entre moedas;

\- controle de várias empresas;

\- autenticação e níveis de acesso;

\- armazenamento permanente obrigatório;

\- aplicação móvel;

\- página web;

\- interface gráfica.



Todos os valores serão considerados em reais.



\## 9. Principais conceitos do domínio



\- \*\*Microempresa:\*\* organização cujas movimentações financeiras serão analisadas.

\- \*\*Lançamento financeiro:\*\* registro de uma movimentação de entrada ou saída de dinheiro.

\- \*\*Receita:\*\* valor que entrou no caixa da empresa.

\- \*\*Despesa:\*\* valor que saiu do caixa da empresa.

\- \*\*Categoria:\*\* classificação utilizada para agrupar movimentações semelhantes.

\- \*\*Período de referência:\*\* mês e ano aos quais o lançamento pertence.

\- \*\*Saldo mensal:\*\* diferença entre as receitas e as despesas de um período.

\- \*\*Limite mensal:\*\* valor máximo definido para os gastos de uma categoria.

\- \*\*Valor excedente:\*\* diferença entre o total gasto e o limite estabelecido.

\- \*\*Resumo mensal:\*\* conjunto de resultados obtidos a partir dos lançamentos de um período.



\## 10. Adequação aos quatro paradigmas



O problema poderá ser desenvolvido nos quatro paradigmas porque envolve operações sequenciais, organização de dados, cálculos, filtros e regras de classificação. Serão criadas versões independentes do mesmo sistema, mantendo as mesmas entradas, saídas e regras.



\## 11. Linguagens inicialmente consideradas



Serão utilizadas as seguintes linguagens:



\- Python para o paradigma imperativo;

\- Java para o paradigma orientado a objetos;

\- JavaScript para o paradigma funcional;

\- Prolog para o paradigma lógico.

