from categoria import Categoria
from limite_despesa import LimiteDespesa
from movimentacao import Movimentacao
from resumo_mensal import ResumoMensal


class FluxoCaixa:
    def __init__(self):
        self.__movimentacoes = []
        self.__limites = {}

    def cadastrar_movimentacao(self, movimentacao):
        if not isinstance(movimentacao, Movimentacao):
            raise ValueError("Movimentação inválida.")

        for cadastrada in self.__movimentacoes:
            if cadastrada.identificador == movimentacao.identificador:
                raise ValueError(
                    "Esse identificador já foi utilizado."
                )

        self.__movimentacoes.append(movimentacao)

        return (
            "Lançamento "
            + movimentacao.identificador
            + " registrado com sucesso."
        )

    def consultar(self, mes, ano, tipo="", categoria=None):
        self.__validar_periodo(mes, ano)

        if tipo not in ("", "receita", "despesa"):
            raise ValueError("Tipo inválido.")

        if categoria is not None:
            if not isinstance(categoria, Categoria):
                raise ValueError("Categoria inválida.")

        encontradas = []

        for movimentacao in self.__movimentacoes:
            if movimentacao.mes != mes:
                continue

            if movimentacao.ano != ano:
                continue

            if tipo != "" and movimentacao.tipo != tipo:
                continue

            if categoria is not None:
                if movimentacao.categoria != categoria:
                    continue

            encontradas.append(movimentacao)

        return encontradas

    def gerar_resumo(self, mes, ano):
        movimentacoes = self.consultar(mes, ano)

        total_receitas = 0
        total_despesas = 0
        saldo = 0
        despesas_por_categoria = {}

        for movimentacao in movimentacoes:
            saldo += movimentacao.impacto_no_saldo()

            if movimentacao.tipo == "receita":
                total_receitas += movimentacao.valor

            else:
                total_despesas += movimentacao.valor
                categoria = movimentacao.categoria

                if categoria not in despesas_por_categoria:
                    despesas_por_categoria[categoria] = 0

                despesas_por_categoria[categoria] += (
                    movimentacao.valor
                )

        return ResumoMensal(
            total_receitas,
            total_despesas,
            saldo,
            len(movimentacoes),
            despesas_por_categoria
        )

    def definir_limite(self, limite):
        if not isinstance(limite, LimiteDespesa):
            raise ValueError("Limite inválido.")

        chave = (
            limite.categoria,
            limite.mes,
            limite.ano
        )

        self.__limites[chave] = limite

        return "Limite cadastrado com sucesso."

    def verificar_limite(self, categoria, mes, ano):
        if not isinstance(categoria, Categoria):
            raise ValueError("Categoria inválida.")

        self.__validar_periodo(mes, ano)

        total_gasto = 0

        for movimentacao in self.__movimentacoes:
            if (
                movimentacao.tipo == "despesa"
                and movimentacao.categoria == categoria
                and movimentacao.mes == mes
                and movimentacao.ano == ano
            ):
                total_gasto += movimentacao.valor

        total_gasto = round(total_gasto, 2)

        chave = (
            categoria,
            mes,
            ano
        )

        if chave not in self.__limites:
            return (
                total_gasto,
                None,
                "sem limite definido",
                None
            )

        limite = self.__limites[chave]
        status, diferenca = limite.verificar(total_gasto)

        return (
            total_gasto,
            limite.valor,
            status,
            diferenca
        )

    def __validar_periodo(self, mes, ano):
        if mes < 1 or mes > 12:
            raise ValueError(
                "O mês deve estar entre 1 e 12."
            )

        if ano <= 0:
            raise ValueError(
                "O ano deve ser positivo."
            )