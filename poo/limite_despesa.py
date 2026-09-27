from categoria import Categoria


class LimiteDespesa:
    def __init__(self, categoria, valor, mes, ano):
        if not isinstance(categoria, Categoria):
            raise ValueError("Categoria inválida.")

        if valor <= 0:
            raise ValueError("O limite deve ser maior que zero.")

        if mes < 1 or mes > 12:
            raise ValueError("O mês deve estar entre 1 e 12.")

        if ano <= 0:
            raise ValueError("O ano deve ser positivo.")

        self.__categoria = categoria
        self.__valor = valor
        self.__mes = mes
        self.__ano = ano

    @property
    def categoria(self):
        return self.__categoria

    @property
    def valor(self):
        return self.__valor

    @property
    def mes(self):
        return self.__mes

    @property
    def ano(self):
        return self.__ano

    def verificar(self, total_gasto):
        if total_gasto > self.__valor:
            status = "limite ultrapassado"
            diferenca = total_gasto - self.__valor

        elif total_gasto == self.__valor:
            status = "limite atingido"
            diferenca = 0

        else:
            status = "dentro do limite"
            diferenca = self.__valor - total_gasto

        return status, round(diferenca, 2)