'use strict';

/** [P4-ETAPA-06] Demonstração reproduzível, sem interação. */
const {
  estadoInicial, cadastrarMovimentacao, definirLimite,
  resumoMensal, verificarLimite, formatarMoeda
} = require('./nucleo');

const lancamentos = [
  { identificador: 'L003', descricao: 'Vendas', tipo: 'receita', categoria: 'vendas', valor: 1500, mes: 9, ano: 2026 },
  { identificador: 'L004', descricao: 'Serviços', tipo: 'receita', categoria: 'serviços', valor: 500, mes: 9, ano: 2026 },
  { identificador: 'L005', descricao: 'Fornecedores', tipo: 'despesa', categoria: 'fornecedores', valor: 800, mes: 9, ano: 2026 },
  { identificador: 'L006', descricao: 'Marketing', tipo: 'despesa', categoria: 'marketing', valor: 300, mes: 9, ano: 2026 }
];

const estadoComMovimentacoes = lancamentos.reduce(cadastrarMovimentacao, estadoInicial());
const estado = definirLimite(estadoComMovimentacoes, {
  categoria: 'marketing', valor: 250, mes: 9, ano: 2026
});
const resumo = resumoMensal(estado, 9, 2026);
const limite = verificarLimite(estado, 'marketing', 9, 2026);

console.log('[P4-ETAPA-06] Demonstração de setembro/2026');
console.log('Receitas:', formatarMoeda(resumo.receitasCentavos));
console.log('Despesas:', formatarMoeda(resumo.despesasCentavos));
console.log('Saldo:', formatarMoeda(resumo.saldoCentavos));
console.log('Classificação:', resumo.classificacao);
console.log('Limite de marketing:', limite.situacao);
console.log('Excedente:', formatarMoeda(limite.diferencaCentavos));
