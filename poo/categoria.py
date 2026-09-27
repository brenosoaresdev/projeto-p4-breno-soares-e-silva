from enum import Enum


class Categoria(Enum):
    VENDAS = "vendas"
    SERVICOS = "serviços"
    FORNECEDORES = "fornecedores"
    ALUGUEL = "aluguel"
    MARKETING = "marketing"
    TRANSPORTE = "transporte"
    OUTROS = "outros"