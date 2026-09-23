CATEGORIAS = [
    "vendas",
    "serviços",
    "fornecedores",
    "aluguel",
    "marketing",
    "transporte",
    "outros"
]

TIPOS = ["receita", "despesa"]


def cadastrar_movimentacao(movimentacoes, identificador, descricao,
                            tipo, categoria, valor, mes, ano):
    if identificador == "":
        return False, "O identificador não pode estar vazio."

    for movimentacao in movimentacoes:
        if movimentacao["identificador"] == identificador:
            return False, "Esse identificador já foi utilizado."

    if descricao == "":
        return False, "A descrição não pode estar vazia."

    if tipo not in TIPOS:
        return False, "O tipo deve ser receita ou despesa."

    if categoria not in CATEGORIAS:
        return False, "Categoria inválida."

    if valor <= 0:
        return False, "O valor deve ser maior que zero."

    if mes < 1 or mes > 12:
        return False, "O mês deve estar entre 1 e 12."

    if ano <= 0:
        return False, "O ano deve ser positivo."

    nova_movimentacao = {
        "identificador": identificador,
        "descricao": descricao,
        "tipo": tipo,
        "categoria": categoria,
        "valor": valor,
        "mes": mes,
        "ano": ano
    }

    # O append modifica o estado da lista.
    movimentacoes.append(nova_movimentacao)

    return True, "Lançamento " + identificador + " registrado com sucesso."


def consultar_movimentacoes(movimentacoes, mes, ano,
                            tipo="", categoria=""):
    encontradas = []

    for movimentacao in movimentacoes:
        if movimentacao["mes"] == mes and movimentacao["ano"] == ano:
            if tipo != "" and movimentacao["tipo"] != tipo:
                continue

            if categoria != "" and movimentacao["categoria"] != categoria:
                continue

            encontradas.append(movimentacao)

    return encontradas


def calcular_resumo(movimentacoes, mes, ano):
    receitas = 0
    despesas = 0
    quantidade = 0

    for movimentacao in movimentacoes:
        if movimentacao["mes"] == mes and movimentacao["ano"] == ano:
            quantidade += 1

            if movimentacao["tipo"] == "receita":
                receitas += movimentacao["valor"]
            else:
                despesas += movimentacao["valor"]

    receitas = round(receitas, 2)
    despesas = round(despesas, 2)
    saldo = round(receitas - despesas, 2)

    if quantidade == 0:
        classificacao = "sem movimentação"
    elif saldo > 0:
        classificacao = "resultado positivo"
    elif saldo < 0:
        classificacao = "resultado negativo"
    else:
        classificacao = "equilíbrio"

    return receitas, despesas, saldo, classificacao


def agrupar_despesas(movimentacoes, mes, ano):
    totais = {}

    for movimentacao in movimentacoes:
        if (movimentacao["mes"] == mes
                and movimentacao["ano"] == ano
                and movimentacao["tipo"] == "despesa"):

            categoria = movimentacao["categoria"]

            if categoria not in totais:
                totais[categoria] = 0

            totais[categoria] += movimentacao["valor"]

    return totais


def encontrar_maiores_categorias(totais):
    maiores = []

    if len(totais) == 0:
        return maiores

    maior_valor = max(totais.values())

    for categoria in totais:
        if totais[categoria] == maior_valor:
            maiores.append(categoria)

    return maiores


def definir_limite(limites, categoria, valor, mes, ano):
    if categoria not in CATEGORIAS:
        return False, "Categoria inválida."

    if valor <= 0:
        return False, "O limite deve ser maior que zero."

    if mes < 1 or mes > 12 or ano <= 0:
        return False, "Período inválido."

    chave = (categoria, mes, ano)

    # Esta atribuição modifica o estado dos limites.
    limites[chave] = valor

    return True, "Limite cadastrado com sucesso."


def verificar_limite(movimentacoes, limites, categoria, mes, ano):
    total = 0

    for movimentacao in movimentacoes:
        if (movimentacao["tipo"] == "despesa"
                and movimentacao["categoria"] == categoria
                and movimentacao["mes"] == mes
                and movimentacao["ano"] == ano):
            total += movimentacao["valor"]

    total = round(total, 2)
    chave = (categoria, mes, ano)

    if chave not in limites:
        return total, None, "sem limite definido", None

    limite = limites[chave]

    if total > limite:
        status = "limite ultrapassado"
        diferenca = total - limite
    elif total == limite:
        status = "limite atingido"
        diferenca = 0
    else:
        status = "dentro do limite"
        diferenca = limite - total

    return total, limite, status, round(diferenca, 2)


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
            numero = int(input(mensagem))
            return numero
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


def mostrar_movimentacao(movimentacao):
    print(
        movimentacao["identificador"],
        "-",
        movimentacao["descricao"],
        "-",
        movimentacao["tipo"],
        "-",
        movimentacao["categoria"],
        "-",
        formatar_moeda(movimentacao["valor"]),
        "-",
        str(movimentacao["mes"]) + "/" + str(movimentacao["ano"])
    )


def mostrar_menu():
    print("\nCONTROLE DE FLUXO DE CAIXA")
    print("1 - Cadastrar movimentação")
    print("2 - Consultar movimentações")
    print("3 - Mostrar resumo mensal")
    print("4 - Definir limite de despesa")
    print("5 - Verificar limite")
    print("0 - Sair")


def main():
    # Estados mantidos durante a execução do programa.
    movimentacoes = []
    limites = {}

    while True:
        mostrar_menu()
        opcao = input("Opção: ")

        if opcao == "1":
            identificador = input("Identificador: ").strip()
            descricao = input("Descrição: ").strip()
            tipo = input("Tipo (receita/despesa): ").strip().lower()

            print("Categorias:", ", ".join(CATEGORIAS))
            categoria = input("Categoria: ").strip().lower()

            valor = ler_valor("Valor: ")
            mes = ler_inteiro("Mês: ")
            ano = ler_inteiro("Ano: ")

            sucesso, mensagem = cadastrar_movimentacao(
                movimentacoes,
                identificador,
                descricao,
                tipo,
                categoria,
                valor,
                mes,
                ano
            )

            print(mensagem)

        elif opcao == "2":
            mes = ler_inteiro("Mês: ")
            ano = ler_inteiro("Ano: ")
            tipo = input("Tipo ou Enter para todos: ").strip().lower()
            categoria = input(
                "Categoria ou Enter para todas: "
            ).strip().lower()

            if tipo != "" and tipo not in TIPOS:
                print("Tipo inválido.")
                continue

            if categoria != "" and categoria not in CATEGORIAS:
                print("Categoria inválida.")
                continue

            encontradas = consultar_movimentacoes(
                movimentacoes,
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
                    total_encontrado += movimentacao["valor"]

                print("Quantidade encontrada:", len(encontradas))
                print(
                    "Total encontrado:",
                    formatar_moeda(total_encontrado)
                )

        elif opcao == "3":
            mes = ler_inteiro("Mês: ")
            ano = ler_inteiro("Ano: ")

            receitas, despesas, saldo, classificacao = calcular_resumo(
                movimentacoes,
                mes,
                ano
            )

            print("Total de receitas:", formatar_moeda(receitas))
            print("Total de despesas:", formatar_moeda(despesas))
            print("Saldo:", formatar_moeda(saldo))
            print("Classificação:", classificacao)

            totais = agrupar_despesas(movimentacoes, mes, ano)

            if len(totais) > 0:
                print("Despesas por categoria:")

                for categoria in totais:
                    print(
                        categoria,
                        "-",
                        formatar_moeda(totais[categoria])
                    )

                maiores = encontrar_maiores_categorias(totais)

                print(
                    "Categoria(s) com maior despesa:",
                    ", ".join(maiores)
                )
                print(
                    "Valor da maior despesa por categoria:",
                    formatar_moeda(totais[maiores[0]])
                )

        elif opcao == "4":
            print("Categorias:", ", ".join(CATEGORIAS))

            categoria = input("Categoria: ").strip().lower()
            valor = ler_valor("Valor do limite: ")
            mes = ler_inteiro("Mês: ")
            ano = ler_inteiro("Ano: ")

            sucesso, mensagem = definir_limite(
                limites,
                categoria,
                valor,
                mes,
                ano
            )

            print(mensagem)

        elif opcao == "5":
            print("Categorias:", ", ".join(CATEGORIAS))

            categoria = input("Categoria: ").strip().lower()
            mes = ler_inteiro("Mês: ")
            ano = ler_inteiro("Ano: ")

            total, limite, status, diferenca = verificar_limite(
                movimentacoes,
                limites,
                categoria,
                mes,
                ano
            )

            print("Total gasto:", formatar_moeda(total))
            print("Situação:", status)

            if limite is not None:
                print("Limite:", formatar_moeda(limite))

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


if __name__ == "__main__":
    main()