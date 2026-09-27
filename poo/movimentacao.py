from abc import ABC, abstractmethod

from categoria import Categoria


class Movimentacao(ABC):
    def __init__(
        self,
        identificador,
        descricao,
        categoria,
        valor,
        mes,
        ano
    ):
        identificador = identificador.strip()
        descricao = descricao.strip()

        if identificador == "":
            raise ValueError("O identificador não pode estar vazio.")

        if descricao == "":
            raise ValueError("A descrição não pode estar vazia.")

        if not isinstance(categoria, Categoria):
            raise ValueError("Categoria inválida.")

        if valor <= 0:
            raise ValueError("O valor deve ser maior que zero.")

        if mes < 1 or mes > 12:
            raise ValueError("O mês deve estar entre 1 e 12.")

        if ano <= 0:
            raise ValueError("O ano deve ser positivo.")

        self.__identificador = identificador
        self.__descricao = descricao
        self.__categoria = categoria
        self.__valor = valor
        self.__mes = mes
        self.__ano = ano

    @property
    def identificador(self):
        return self.__identificador

    @property
    def descricao(self):
        return self.__descricao

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

    @property
    @abstractmethod
    def tipo(self):
        pass

    @abstractmethod
    def impacto_no_saldo(self):
        pass


class Receita(Movimentacao):
    @property
    def tipo(self):
        return "receita"

    def impacto_no_saldo(self):
        return self.valor


class Despesa(Movimentacao):
    @property
    def tipo(self):
        return "despesa"

    def impacto_no_saldo(self):
        return -self.valor