'use strict';

/**
 * [P4-ETAPA-06] Núcleo funcional do fluxo de caixa.
 * Todas as funções exportadas são puras: não leem teclado, não imprimem,
 * não escrevem arquivos e não alteram o estado recebido.
 * Valores monetários internos são inteiros em centavos.
 */

const CATEGORIAS = Object.freeze([
  'vendas', 'serviços', 'fornecedores', 'aluguel',
  'marketing', 'transporte', 'outros'
]);
const TIPOS = Object.freeze(['receita', 'despesa']);

const congelar = (valor) => Object.freeze(valor);

// Combinação de funções: a saída de uma é a entrada da próxima.
const compor = (...funcoes) => (entrada) =>
  funcoes.reduceRight((resultado, funcao) => funcao(resultado), entrada);

// Funções de alta ordem: recebem outra função como argumento.
const filtrarPor = (predicado) => (itens) =>
  congelar(itens.filter(predicado));

const somarPor = (extrairValor) => (itens) =>
  itens.reduce((total, item) => total + extrairValor(item), 0);

const validarPeriodo = (mes, ano) => {
  if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
    throw new Error('O mês deve estar entre 1 e 12.');
  }
  if (!Number.isInteger(ano) || ano <= 0) {
    throw new Error('O ano deve ser um inteiro positivo.');
  }
};

const validarCategoria = (categoria) => {
  if (!CATEGORIAS.includes(categoria)) {
    throw new Error('Categoria inválida.');
  }
};

/** Converte número decimal simples ou texto '123,45' para centavos exatos. */
const paraCentavos = (valor) => {
  const texto = (typeof valor === 'number' || typeof valor === 'string')
    ? String(valor).trim() : '';
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(texto)) {
    throw new Error('O valor deve ser maior que zero e ter até duas casas decimais.');
  }
  const [inteiro, decimal = ''] = texto.replace(',', '.').split('.');
  const centavos = Number(inteiro) * 100 + Number(decimal.padEnd(2, '0'));
  if (!Number.isSafeInteger(centavos) || centavos <= 0) {
    throw new Error('O valor deve ser maior que zero e estar dentro do intervalo permitido.');
  }
  return centavos;
};

const estadoInicial = () => congelar({
  movimentacoes: congelar([]),
  limites: congelar([])
});

const criarMovimentacao = ({ identificador, descricao, tipo, categoria, valor, mes, ano }) => {
  if (typeof identificador !== 'string' || !identificador.trim()) {
    throw new Error('O identificador não pode estar vazio.');
  }
  if (typeof descricao !== 'string' || !descricao.trim()) {
    throw new Error('A descrição não pode estar vazia.');
  }
  if (!TIPOS.includes(tipo)) {
    throw new Error('O tipo deve ser receita ou despesa.');
  }
  validarCategoria(categoria);
  validarPeriodo(mes, ano);
  const valorCentavos = paraCentavos(valor);

  return congelar({
    identificador: identificador.trim(),
    descricao: descricao.trim(),
    tipo,
    categoria,
    valorCentavos,
    mes,
    ano
  });
};

/** Transição de estado sem mutação: estado anterior -> novo estado. */
const cadastrarMovimentacao = (estado, dados) => {
  const nova = criarMovimentacao(dados);
  if (estado.movimentacoes.some(
    (movimentacao) => movimentacao.identificador === nova.identificador
  )) {
    throw new Error('Esse identificador já foi utilizado.');
  }
  return congelar({
    ...estado,
    movimentacoes: congelar([...estado.movimentacoes, nova])
  });
};

const pertenceAoPeriodo = (mes, ano) => (movimentacao) =>
  movimentacao.mes === mes && movimentacao.ano === ano;

const correspondeAoTipo = (tipo) => (movimentacao) =>
  !tipo || movimentacao.tipo === tipo;

const correspondeACategoria = (categoria) => (movimentacao) =>
  !categoria || movimentacao.categoria === categoria;

/** Composição: aplica sucessivamente filtros sem editar a coleção original. */
const consultarMovimentacoes = (estado, { mes, ano, tipo = '', categoria = '' }) => {
  validarPeriodo(mes, ano);
  if (tipo && !TIPOS.includes(tipo)) {
    throw new Error('Tipo inválido.');
  }
  if (categoria) validarCategoria(categoria);

  return compor(
    filtrarPor(correspondeACategoria(categoria)),
    filtrarPor(correspondeAoTipo(tipo)),
    filtrarPor(pertenceAoPeriodo(mes, ano))
  )(estado.movimentacoes);
};

const totalCentavos = somarPor((movimentacao) => movimentacao.valorCentavos);

/** Agrega apenas despesas do período, produzindo um NOVO objeto a cada etapa. */
const agruparDespesas = (estado, mes, ano) =>
  congelar(consultarMovimentacoes(estado, { mes, ano, tipo: 'despesa' })
    .reduce((totais, movimentacao) => congelar({
      ...totais,
      [movimentacao.categoria]:
        (totais[movimentacao.categoria] ?? 0) + movimentacao.valorCentavos
    }), {}));

const encontrarMaioresCategorias = (totaisPorCategoria) => {
  const entradas = Object.entries(totaisPorCategoria);
  if (!entradas.length) return congelar([]);
  const maiorTotal = entradas.reduce((maior, [, total]) => Math.max(maior, total), 0);
  return congelar(entradas
    .filter(([, total]) => total === maiorTotal)
    .map(([categoria]) => categoria));
};

const classificarSaldo = (quantidade, saldoCentavos) => {
  if (quantidade === 0) return 'sem movimentação';
  if (saldoCentavos > 0) return 'resultado positivo';
  if (saldoCentavos < 0) return 'resultado negativo';
  return 'equilíbrio';
};

const definirLimite = (estado, { categoria, valor, mes, ano }) => {
  validarCategoria(categoria);
  validarPeriodo(mes, ano);
  const valorCentavos = paraCentavos(valor);
  const mesmoLimite = (limite) => limite.categoria === categoria &&
    limite.mes === mes && limite.ano === ano;

  // Substitui apenas o limite correspondente; limites anteriores são preservados.
  const outrosLimites = estado.limites.filter((limite) => !mesmoLimite(limite));
  return congelar({
    ...estado,
    limites: congelar([...outrosLimites, congelar({
      categoria, valorCentavos, mes, ano
    })])
  });
};

const verificarLimite = (estado, categoria, mes, ano) => {
  validarCategoria(categoria);
  validarPeriodo(mes, ano);
  const totais = agruparDespesas(estado, mes, ano);
  const totalGastoCentavos = totais[categoria] ?? 0;
  const limite = estado.limites.find((item) =>
    item.categoria === categoria && item.mes === mes && item.ano === ano);

  if (!limite) return congelar({
    categoria, totalGastoCentavos, limiteCentavos: null,
    situacao: 'sem limite definido', diferencaCentavos: null
  });

  const diferenca = totalGastoCentavos - limite.valorCentavos;
  const situacao = diferenca > 0 ? 'limite ultrapassado'
    : diferenca === 0 ? 'limite atingido' : 'dentro do limite';

  return congelar({
    categoria,
    totalGastoCentavos,
    limiteCentavos: limite.valorCentavos,
    situacao,
    // Se positiva, excedente; se negativa, valor disponível (em módulo).
    diferencaCentavos: Math.abs(diferenca)
  });
};

/** Encadeia filtros, somatórios e agrupamentos sem alterações do estado. */
const resumoMensal = (estado, mes, ano) => {
  const movimentacoes = consultarMovimentacoes(estado, { mes, ano });
  const receitasCentavos = totalCentavos(
    movimentacoes.filter((movimentacao) => movimentacao.tipo === 'receita')
  );
  const despesasCentavos = totalCentavos(
    movimentacoes.filter((movimentacao) => movimentacao.tipo === 'despesa')
  );
  const saldoCentavos = receitasCentavos - despesasCentavos;
  const despesasPorCategoria = agruparDespesas(estado, mes, ano);
  const maioresCategorias = encontrarMaioresCategorias(despesasPorCategoria);
  const limitesPeriodo = estado.limites
    .filter((limite) => limite.mes === mes && limite.ano === ano)
    .map((limite) => verificarLimite(estado, limite.categoria, mes, ano));

  return congelar({
    mes, ano,
    quantidade: movimentacoes.length,
    receitasCentavos,
    despesasCentavos,
    saldoCentavos,
    classificacao: classificarSaldo(movimentacoes.length, saldoCentavos),
    despesasPorCategoria,
    maioresCategorias,
    limites: congelar(limitesPeriodo)
  });
};

/** Função pura; apresenta reais sem depender do locale do computador. */
const formatarMoeda = (centavos) => {
  if (!Number.isSafeInteger(centavos)) throw new Error('Valor monetário inválido.');
  const negativo = centavos < 0 ? '-' : '';
  const absoluto = Math.abs(centavos);
  const inteiro = Math.floor(absoluto / 100)
    .toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negativo}R$ ${inteiro},${String(absoluto % 100).padStart(2, '0')}`;
};

module.exports = {
  CATEGORIAS, TIPOS, estadoInicial, paraCentavos, compor, filtrarPor, somarPor,
  criarMovimentacao, cadastrarMovimentacao, consultarMovimentacoes,
  agruparDespesas, encontrarMaioresCategorias, classificarSaldo,
  definirLimite, verificarLimite, resumoMensal, formatarMoeda
};
