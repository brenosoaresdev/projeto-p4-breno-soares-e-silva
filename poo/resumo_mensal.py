class ResumoMensal:
    def __init__(self, total_receitas, total_despesas, saldo,
                 quantidade, despesas_por_categoria):

        self.__total_receitas = round(total_receitas, 2)
        self.__total_despesas = round(total_despesas, 2)
        self.__saldo = round(saldo, 2)
        self.__despesas_por_categoria = despesas_por_categoria.copy()
        self.__maiores_categorias = []

        if quantidade == 0:
            self.__classificacao = "sem movimentação"

        elif self.__saldo > 0:
            self.__classificacao = "resultado positivo"

        elif self.__saldo < 0:
            self.__classificacao = "resultado negativo"

        else:
            self.__classificacao = "equilíbrio"

        if len(self.__despesas_por_categoria) > 0:
            maior_valor = max(
                self.__despesas_por_categoria.values()
            )

            for categoria in self.__despesas_por_categoria:
                valor = self.__despesas_por_categoria[categoria]

                if valor == maior_valor:
                    self.__maiores_categorias.append(categoria)

    @property
    def total_receitas(self):
        return self.__total_receitas

    @property
    def total_despesas(self):
        return self.__total_despesas

    @property
    def saldo(self):
        return self.__saldo

    @property
    def classificacao(self):
        return self.__classificacao

    @property
    def despesas_por_categoria(self):
        return self.__despesas_por_categoria.copy()

    @property
    def maiores_categorias(self):
        return self.__maiores_categorias.copy()