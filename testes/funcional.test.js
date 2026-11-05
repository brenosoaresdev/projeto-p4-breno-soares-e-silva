'use strict';

/**
 * [P4-ETAPA-06] Validação da implementação funcional.
 * CN01–CN10, CL01–CL03 e CI01–CI02 reproduzem o contrato da Etapa 02.
 * Os demais testes conferem as características específicas do paradigma.
 * Executar: node --test testes/funcional.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  estadoInicial, cadastrarMovimentacao, consultarMovimentacoes,
  definirLimite, verificarLimite, resumoMensal,
  agruparDespesas, encontrarMaioresCategorias, formatarMoeda,
  paraCentavos, compor, filtrarPor, somarPor
} = require('../funcional/nucleo');

const lancamento = (identificador, tipo, categoria, valor, mes = 9, ano = 2026) => ({
  identificador, descricao: `Lançamento ${identificador}`, tipo, categoria, valor, mes, ano
});
const montar = (...registros) => registros.reduce(cadastrarMovimentacao, estadoInicial());
const comLimite = (estado, categoria, valor, mes, ano) =>
  definirLimite(estado, { categoria, valor, mes, ano });

test('CN01 - cadastro de receita válida', () => {
  const estado = montar(lancamento('L001', 'receita', 'vendas', 1500));
  assert.equal(estado.movimentacoes.length, 1);
  assert.equal(estado.movimentacoes[0].identificador, 'L001');
  assert.equal(estado.movimentacoes[0].valorCentavos, 150000);
});

test('CN02 - cadastro de despesa válida', () => {
  const estado = montar(lancamento('L002', 'despesa', 'aluguel', 800));
  assert.equal(estado.movimentacoes[0].tipo, 'despesa');
  assert.equal(estado.movimentacoes[0].valorCentavos, 80000);
});

test('CN03 - resultado mensal positivo', () => {
  const estado = montar(
    lancamento('L003', 'receita', 'vendas', 1500),
    lancamento('L004', 'receita', 'serviços', 500),
    lancamento('L005', 'despesa', 'fornecedores', 800),
    lancamento('L006', 'despesa', 'marketing', 300)
  );
  const r = resumoMensal(estado, 9, 2026);
  assert.equal(r.receitasCentavos, 200000);
  assert.equal(r.despesasCentavos, 110000);
  assert.equal(r.saldoCentavos, 90000);
  assert.equal(r.classificacao, 'resultado positivo');
});

test('CN04 - resultado mensal negativo', () => {
  const estado = montar(
    lancamento('L007', 'receita', 'serviços', 1200, 10, 2026),
    lancamento('L008', 'despesa', 'fornecedores', 1500, 10, 2026)
  );
  const r = resumoMensal(estado, 10, 2026);
  assert.equal(r.receitasCentavos, 120000);
  assert.equal(r.despesasCentavos, 150000);
  assert.equal(r.saldoCentavos, -30000);
  assert.equal(r.classificacao, 'resultado negativo');
});

test('CN05 - equilíbrio mensal com movimentações', () => {
  const estado = montar(
    lancamento('L009', 'receita', 'vendas', 2000, 11, 2026),
    lancamento('L010', 'despesa', 'fornecedores', 2000, 11, 2026)
  );
  const r = resumoMensal(estado, 11, 2026);
  assert.equal(r.saldoCentavos, 0);
  assert.equal(r.classificacao, 'equilíbrio');
});

test('CN06 - filtro por tipo retorna L012 e L013, total R$ 700', () => {
  const estado = montar(
    lancamento('L011', 'receita', 'vendas', 1000, 1, 2027),
    lancamento('L012', 'despesa', 'transporte', 400, 1, 2027),
    lancamento('L013', 'despesa', 'marketing', 300, 1, 2027)
  );
  const encontrados = consultarMovimentacoes(estado, { mes: 1, ano: 2027, tipo: 'despesa' });
  assert.deepEqual(encontrados.map((m) => m.identificador), ['L012', 'L013']);
  assert.equal(encontrados.reduce((s, m) => s + m.valorCentavos, 0), 70000);
});

test('CN07 - filtro por categoria retorna L014 e L015, total R$ 300', () => {
  const estado = montar(
    lancamento('L014', 'despesa', 'marketing', 200, 2, 2027),
    lancamento('L015', 'despesa', 'marketing', 100, 2, 2027),
    lancamento('L016', 'despesa', 'aluguel', 500, 2, 2027)
  );
  const encontrados = consultarMovimentacoes(estado, { mes: 2, ano: 2027, categoria: 'marketing' });
  assert.deepEqual(encontrados.map((m) => m.identificador), ['L014', 'L015']);
  assert.equal(encontrados.reduce((s, m) => s + m.valorCentavos, 0), 30000);
});

test('CN08 - agrupamento e maior categoria aluguel', () => {
  const estado = montar(
    lancamento('L017', 'despesa', 'fornecedores', 600, 3, 2027),
    lancamento('L018', 'despesa', 'fornecedores', 200, 3, 2027),
    lancamento('L019', 'despesa', 'aluguel', 900, 3, 2027),
    lancamento('L020', 'despesa', 'transporte', 100, 3, 2027)
  );
  const totais = agruparDespesas(estado, 3, 2027);
  assert.deepEqual(totais, { fornecedores: 80000, aluguel: 90000, transporte: 10000 });
  assert.deepEqual(encontrarMaioresCategorias(totais), ['aluguel']);
});

test('CN09 - despesa abaixo do limite', () => {
  const estado = comLimite(montar(
    lancamento('L021', 'despesa', 'transporte', 150, 4, 2027),
    lancamento('L022', 'despesa', 'transporte', 200, 4, 2027)
  ), 'transporte', 500, 4, 2027);
  const limite = verificarLimite(estado, 'transporte', 4, 2027);
  assert.equal(limite.totalGastoCentavos, 35000);
  assert.equal(limite.limiteCentavos, 50000);
  assert.equal(limite.situacao, 'dentro do limite');
  assert.equal(limite.diferencaCentavos, 15000);
});

test('CN10 - limite ultrapassado e excedente R$ 50', () => {
  const estado = comLimite(montar(
    lancamento('L023', 'despesa', 'marketing', 200, 5, 2027),
    lancamento('L024', 'despesa', 'marketing', 100, 5, 2027)
  ), 'marketing', 250, 5, 2027);
  const limite = verificarLimite(estado, 'marketing', 5, 2027);
  assert.equal(limite.totalGastoCentavos, 30000);
  assert.equal(limite.limiteCentavos, 25000);
  assert.equal(limite.situacao, 'limite ultrapassado');
  assert.equal(limite.diferencaCentavos, 5000);
});

test('CL01 - período sem movimentação', () => {
  const r = resumoMensal(estadoInicial(), 6, 2027);
  assert.equal(r.receitasCentavos, 0);
  assert.equal(r.despesasCentavos, 0);
  assert.equal(r.saldoCentavos, 0);
  assert.equal(r.classificacao, 'sem movimentação');
  assert.deepEqual(r.maioresCategorias, []);
});

test('CL02 - gasto igual ao limite, não ultrapassado', () => {
  const estado = comLimite(montar(
    lancamento('L025', 'despesa', 'aluguel', 800, 7, 2027)
  ), 'aluguel', 800, 7, 2027);
  const limite = verificarLimite(estado, 'aluguel', 7, 2027);
  assert.equal(limite.situacao, 'limite atingido');
  assert.equal(limite.diferencaCentavos, 0);
});

test('CL03 - empate entre fornecedores e aluguel', () => {
  const estado = montar(
    lancamento('L026', 'despesa', 'fornecedores', 900, 8, 2027),
    lancamento('L027', 'despesa', 'aluguel', 900, 8, 2027),
    lancamento('L028', 'despesa', 'marketing', 300, 8, 2027)
  );
  assert.deepEqual(resumoMensal(estado, 8, 2027).maioresCategorias,
    ['fornecedores', 'aluguel']);
});

test('CI01 - valor negativo é recusado e não muda estado', () => {
  const anterior = estadoInicial();
  assert.throws(
    () => cadastrarMovimentacao(anterior, lancamento('L029', 'despesa', 'aluguel', -800, 9, 2027)),
    /maior que zero/
  );
  assert.equal(anterior.movimentacoes.length, 0);
});

test('CI02 - identificador repetido é recusado e primeiro permanece', () => {
  const primeiro = montar(lancamento('L030', 'receita', 'vendas', 1000, 10, 2027));
  assert.throws(() => cadastrarMovimentacao(
    primeiro, lancamento('L030', 'despesa', 'transporte', 200, 10, 2027)
  ), /identificador já foi utilizado/);
  assert.equal(primeiro.movimentacoes.length, 1);
  assert.equal(primeiro.movimentacoes[0].tipo, 'receita');
});

// Testes adicionais: evidências do paradigma funcional.
test('PF01 - cadastrar retorna novo estado e preserva o anterior', () => {
  const anterior = estadoInicial();
  const novo = cadastrarMovimentacao(anterior, lancamento('F001', 'receita', 'vendas', '19,90'));
  assert.notStrictEqual(novo, anterior);
  assert.notStrictEqual(novo.movimentacoes, anterior.movimentacoes);
  assert.equal(anterior.movimentacoes.length, 0);
  assert.equal(novo.movimentacoes.length, 1);
  assert.ok(Object.isFrozen(novo));
  assert.ok(Object.isFrozen(novo.movimentacoes));
  assert.ok(Object.isFrozen(novo.movimentacoes[0]));
});

test('PF02 - a mesma entrada produz a mesma saída (transparência referencial)', () => {
  const anterior = estadoInicial();
  const dados = lancamento('F002', 'despesa', 'marketing', '49,99');
  assert.deepEqual(cadastrarMovimentacao(anterior, dados), cadastrarMovimentacao(anterior, dados));
});

test('PF03 - limite substituído sem modificar estados anteriores', () => {
  const original = estadoInicial();
  const primeiro = comLimite(original, 'marketing', 100, 4, 2027);
  const segundo = comLimite(primeiro, 'marketing', 120, 4, 2027);
  assert.equal(original.limites.length, 0);
  assert.equal(primeiro.limites[0].valorCentavos, 10000);
  assert.equal(segundo.limites.length, 1);
  assert.equal(segundo.limites[0].valorCentavos, 12000);
});

test('PF04 - limites são diferentes em meses diferentes', () => {
  const primeiro = comLimite(estadoInicial(), 'marketing', 100, 1, 2027);
  const segundo = comLimite(primeiro, 'marketing', 200, 2, 2027);
  assert.equal(verificarLimite(segundo, 'marketing', 1, 2027).limiteCentavos, 10000);
  assert.equal(verificarLimite(segundo, 'marketing', 2, 2027).limiteCentavos, 20000);
});

test('PF05 - sem limite não há aviso de ultrapassagem', () => {
  const estado = montar(lancamento('F005', 'despesa', 'aluguel', 900));
  const situacao = verificarLimite(estado, 'aluguel', 9, 2026);
  assert.equal(situacao.situacao, 'sem limite definido');
  assert.equal(situacao.diferencaCentavos, null);
});

test('PF06 - evita números inválidos e conversão monetária ambígua', () => {
  assert.equal(paraCentavos('0,01'), 1);
  assert.equal(paraCentavos('123,45'), 12345);
  assert.throws(() => paraCentavos('0'), /maior que zero/);
  assert.throws(() => paraCentavos('20,999'), /maior que zero/);
  assert.throws(() => paraCentavos('1.234,56'), /maior que zero/);
  assert.equal(formatarMoeda(-123456), '-R$ 1.234,56');
});

test('PF07 - valida categorias, períodos e filtros', () => {
  assert.throws(() => montar(lancamento('F007', 'receita', 'inválida', 100)), /Categoria inválida/);
  assert.throws(() => montar(lancamento('F008', 'despesa', 'aluguel', 100, 13, 2026)), /mês/);
  assert.throws(() => consultarMovimentacoes(estadoInicial(), { mes: 9, ano: 2026, tipo: 'saldo' }), /Tipo inválido/);
  assert.throws(() => comLimite(estadoInicial(), 'marketing', 0, 9, 2026), /maior que zero/);
});

test('PF08 - composição e funções de alta ordem', () => {
  const aoQuadrado = (n) => n * n;
  const maisUm = (n) => n + 1;
  assert.equal(compor(aoQuadrado, maisUm)(3), 16);
  const pares = filtrarPor((n) => n % 2 === 0)([1, 2, 3, 4]);
  assert.deepEqual(pares, [2, 4]);
  assert.equal(somarPor((n) => n)(pares), 6);
});

test('PF09 - o recorte por período é respeitado no resumo', () => {
  const estado = montar(
    lancamento('F009A', 'receita', 'vendas', 100, 9, 2026),
    lancamento('F009B', 'despesa', 'marketing', 80, 10, 2026)
  );
  assert.equal(resumoMensal(estado, 9, 2026).saldoCentavos, 10000);
  assert.equal(resumoMensal(estado, 10, 2026).saldoCentavos, -8000);
});
