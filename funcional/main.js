'use strict';

/**
 * [P4-ETAPA-06] Camada IMPURA (entrada/saída).
 * Aqui ficam apenas teclado, terminal e o encadeamento dos novos estados.
 * Toda regra do fluxo de caixa reside em nucleo.js (funções puras).
 */

const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const {
  CATEGORIAS, estadoInicial, cadastrarMovimentacao,
  consultarMovimentacoes, definirLimite, verificarLimite,
  resumoMensal, formatarMoeda
} = require('./nucleo');

const rl = readline.createInterface({ input: stdin, output: stdout });
const perguntar = (texto) => rl.question(texto);
const linha = (texto = '') => stdout.write(`${texto}\n`);
const lerInteiro = async (texto) => Number((await perguntar(texto)).trim());
const lerCategoria = async () => {
  linha(`Categorias: ${CATEGORIAS.join(', ')}`);
  return (await perguntar('Categoria: ')).trim().toLowerCase();
};
const mostrarMovimentacao = (m) => linha(
  `${m.identificador} - ${m.descricao} - ${m.tipo} - ${m.categoria} - ` +
  `${formatarMoeda(m.valorCentavos)} - ${m.mes}/${m.ano}`
);

const mostrarMenu = () => {
  linha('\nCONTROLE DE FLUXO DE CAIXA - VERSÃO FUNCIONAL');
  linha('1 - Cadastrar movimentação');
  linha('2 - Consultar movimentações');
  linha('3 - Mostrar resumo mensal');
  linha('4 - Definir limite de despesa');
  linha('5 - Verificar limite');
  linha('0 - Sair');
};

const main = async () => {
  // A variável de integração pode apontar para um novo estado. Nenhuma
  // operação modifica as coleções contidas no estado anterior.
  let estado = estadoInicial();
  let emExecucao = true;

  while (emExecucao) {
    mostrarMenu();
    const opcao = (await perguntar('Opção: ')).trim();
    try {
      switch (opcao) {
        case '1': {
          const identificador = (await perguntar('Identificador: ')).trim();
          const descricao = (await perguntar('Descrição: ')).trim();
          const tipo = (await perguntar('Tipo (receita/despesa): ')).trim().toLowerCase();
          const categoria = await lerCategoria();
          const valor = (await perguntar('Valor (ex.: 200,50): ')).trim();
          const mes = await lerInteiro('Mês: ');
          const ano = await lerInteiro('Ano: ');
          estado = cadastrarMovimentacao(estado, {
            identificador, descricao, tipo, categoria, valor, mes, ano
          });
          linha('Movimentação cadastrada com sucesso.');
          break;
        }
        case '2': {
          const mes = await lerInteiro('Mês: ');
          const ano = await lerInteiro('Ano: ');
          const tipo = (await perguntar('Tipo ou Enter para todos: ')).trim().toLowerCase();
          const categoria = (await perguntar('Categoria ou Enter para todas: ')).trim().toLowerCase();
          const encontradas = consultarMovimentacoes(estado, { mes, ano, tipo, categoria });
          encontradas.forEach(mostrarMovimentacao);
          if (!encontradas.length) linha('Nenhuma movimentação encontrada.');
          linha(`Quantidade encontrada: ${encontradas.length}`);
          linha(`Total encontrado: ${formatarMoeda(
            encontradas.reduce((total, m) => total + m.valorCentavos, 0)
          )}`);
          break;
        }
        case '3': {
          const mes = await lerInteiro('Mês: ');
          const ano = await lerInteiro('Ano: ');
          const resumo = resumoMensal(estado, mes, ano);
          linha(`Total de receitas: ${formatarMoeda(resumo.receitasCentavos)}`);
          linha(`Total de despesas: ${formatarMoeda(resumo.despesasCentavos)}`);
          linha(`Saldo: ${formatarMoeda(resumo.saldoCentavos)}`);
          linha(`Classificação: ${resumo.classificacao}`);
          const categorias = Object.entries(resumo.despesasPorCategoria);
          if (categorias.length) {
            linha('Despesas por categoria:');
            categorias.forEach(([categoria, total]) =>
              linha(`  ${categoria}: ${formatarMoeda(total)}`));
            linha(`Categoria(s) com maior despesa: ${resumo.maioresCategorias.join(', ')}`);
          }
          break;
        }
        case '4': {
          const categoria = await lerCategoria();
          const valor = (await perguntar('Valor do limite: ')).trim();
          const mes = await lerInteiro('Mês: ');
          const ano = await lerInteiro('Ano: ');
          estado = definirLimite(estado, { categoria, valor, mes, ano });
          linha('Limite cadastrado com sucesso.');
          break;
        }
        case '5': {
          const categoria = await lerCategoria();
          const mes = await lerInteiro('Mês: ');
          const ano = await lerInteiro('Ano: ');
          const resultado = verificarLimite(estado, categoria, mes, ano);
          linha(`Total gasto: ${formatarMoeda(resultado.totalGastoCentavos)}`);
          linha(`Situação: ${resultado.situacao}`);
          if (resultado.limiteCentavos !== null) {
            linha(`Limite: ${formatarMoeda(resultado.limiteCentavos)}`);
            const rotulo = resultado.situacao === 'limite ultrapassado'
              ? 'Valor excedente' : 'Valor disponível';
            linha(`${rotulo}: ${formatarMoeda(resultado.diferencaCentavos)}`);
          }
          break;
        }
        case '0': {
          linha('Programa encerrado.');
          emExecucao = false;
          break;
        }
        default: linha('Opção inválida.');
      }
    } catch (erro) {
      linha(`Operação recusada: ${erro.message}`);
    }
  }
  rl.close();
};

if (require.main === module) {
  main().catch((erro) => {
    console.error(`Erro de entrada/saída: ${erro.message}`);
    rl.close();
    process.exitCode = 1;
  });
}
