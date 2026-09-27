from categoria import Categoria
from fluxo_caixa import FluxoCaixa
from limite_despesa import LimiteDespesa
from movimentacao import Receita, Despesa


def formatar_moeda(valor):
    sinal = ""

    if valor < 0:
        sinal = "-"
        valor = abs(valor)

    texto = f"{valor:,.2f}"
    texto = texto.replace(",", "X")
    texto = texto.replace(".", ",")
    texto = texto.replace("X", ".")

    return sinal + "R$ " + texto


def ler_inteiro(mensagem):
    while True:
        try:
            return int(input(mensagem))

        except ValueError:
            print("Digite um número inteiro.")


def ler_valor(mensagem):
    while True:
        try:
            texto = input(mensagem)
            texto = texto.replace(",", ".")

            return float(texto)

        except ValueError:
            print("Digite um valor válido.")


def ler_categoria(mensagem):
    texto = input(mensagem).strip().lower()

    try:
        return Categoria(texto)

    except ValueError:
        raise ValueError("Categoria inválida.")


def mostrar_categorias():
    print(
        "Categorias: vendas, serviços, fornecedores, "
        "aluguel, marketing, transporte, outros"
    )


def mostrar_movimentacao(movimentacao):
    print(
        movimentacao.identificador,
        "-",
        movimentacao.descricao,
        "-",
        movimentacao.tipo,
        "-",
        movimentacao.categoria.value,
        "-",
        formatar_moeda(movimentacao.valor),
        "-",
        str(movimentacao.mes) + "/" + str(movimentacao.ano)
    )


def mostrar_menu():
    print("\nCONTROLE DE FLUXO DE CAIXA - POO")
    print("1 - Cadastrar movimentação")
    print("2 - Consultar movimentações")
    print("3 - Mostrar resumo mensal")
    print("4 - Definir limite de despesa")
    print("5 - Verificar limite")
    print("0 - Sair")


def main():
    fluxo_caixa = FluxoCaixa()

    while True:
        mostrar_menu()
        opcao = input("Opção: ")

        try:
            if opcao == "1":
                identificador = input("Identificador: ")
                descricao = input("Descrição: ")

                tipo = input(
                    "Tipo (receita/despesa): "
                ).strip().lower()

                mostrar_categorias()
                categoria = ler_categoria("Categoria: ")

                valor = ler_valor("Valor: ")
                mes = ler_inteiro("Mês: ")
                ano = ler_inteiro("Ano: ")

                if tipo == "receita":
                    movimentacao = Receita(
                        identificador,
                        descricao,
                        categoria,
                        valor,
                        mes,
                        ano
                    )

                elif tipo == "despesa":
                    movimentacao = Despesa(
                        identificador,
                        descricao,
                        categoria,
                        valor,
                        mes,
                        ano
                    )

                else:
                    raise ValueError(
                        "O tipo deve ser receita ou despesa."
                    )

                mensagem = fluxo_caixa.cadastrar_movimentacao(
                    movimentacao
                )

                print(mensagem)

            elif opcao == "2":
                mes = ler_inteiro("Mês: ")
                ano = ler_inteiro("Ano: ")

                tipo = input(
                    "Tipo ou Enter para todos: "
                ).strip().lower()

                texto_categoria = input(
                    "Categoria ou Enter para todas: "
                ).strip().lower()

                categoria = None

                if texto_categoria != "":
                    try:
                        categoria = Categoria(texto_categoria)

                    except ValueError:
                        raise ValueError("Categoria inválida.")

                encontradas = fluxo_caixa.consultar(
                    mes,
                    ano,
                    tipo,
                    categoria
                )

                if len(encontradas) == 0:
                    print("Nenhuma movimentação encontrada.")

                else:
                    total_encontrado = 0

                    for movimentacao in encontradas:
                        mostrar_movimentacao(movimentacao)
                        total_encontrado += movimentacao.valor

                    print(
                        "Quantidade encontrada:",
                        len(encontradas)
                    )

                    print(
                        "Total encontrado:",
                        formatar_moeda(total_encontrado)
                    )

            elif opcao == "3":
                mes = ler_inteiro("Mês: ")
                ano = ler_inteiro("Ano: ")

                resumo = fluxo_caixa.gerar_resumo(
                    mes,
                    ano
                )

                print(
                    "Total de receitas:",
                    formatar_moeda(resumo.total_receitas)
                )

                print(
                    "Total de despesas:",
                    formatar_moeda(resumo.total_despesas)
                )

                print(
                    "Saldo:",
                    formatar_moeda(resumo.saldo)
                )

                print(
                    "Classificação:",
                    resumo.classificacao
                )

                despesas = resumo.despesas_por_categoria

                if len(despesas) > 0:
                    print("Despesas por categoria:")

                    for categoria in despesas:
                        print(
                            categoria.value,
                            "-",
                            formatar_moeda(
                                despesas[categoria]
                            )
                        )

                    nomes = []

                    for categoria in resumo.maiores_categorias:
                        nomes.append(categoria.value)

                    print(
                        "Categoria(s) com maior despesa:",
                        ", ".join(nomes)
                    )

                    primeira = resumo.maiores_categorias[0]

                    print(
                        "Valor da maior despesa por categoria:",
                        formatar_moeda(
                            despesas[primeira]
                        )
                    )

            elif opcao == "4":
                mostrar_categorias()

                categoria = ler_categoria("Categoria: ")
                valor = ler_valor("Valor do limite: ")
                mes = ler_inteiro("Mês: ")
                ano = ler_inteiro("Ano: ")

                limite = LimiteDespesa(
                    categoria,
                    valor,
                    mes,
                    ano
                )

                mensagem = fluxo_caixa.definir_limite(
                    limite
                )

                print(mensagem)

            elif opcao == "5":
                mostrar_categorias()

                categoria = ler_categoria("Categoria: ")
                mes = ler_inteiro("Mês: ")
                ano = ler_inteiro("Ano: ")

                resultado = fluxo_caixa.verificar_limite(
                    categoria,
                    mes,
                    ano
                )

                total = resultado[0]
                limite = resultado[1]
                status = resultado[2]
                diferenca = resultado[3]

                print(
                    "Total gasto:",
                    formatar_moeda(total)
                )

                print("Situação:", status)

                if limite is not None:
                    print(
                        "Limite:",
                        formatar_moeda(limite)
                    )

                    if status == "limite ultrapassado":
                        print(
                            "Valor excedente:",
                            formatar_moeda(diferenca)
                        )

                    else:
                        print(
                            "Valor disponível:",
                            formatar_moeda(diferenca)
                        )

            elif opcao == "0":
                print("Programa encerrado.")
                break

            else:
                print("Opção inválida.")

        except ValueError as erro:
            print("Erro:", erro)


if __name__ == "__main__":
    main()