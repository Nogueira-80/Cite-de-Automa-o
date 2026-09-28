// ==========================================
// LOCALIZAITEM
// Sistema de organização de produtos
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const formProduto =
    document.getElementById("formProduto");

const nome =
    document.getElementById("nome");

const categoria =
    document.getElementById("categoria");

const localizacao =
    document.getElementById("localizacao");

const descricao =
    document.getElementById("descricao");

const listaProdutos =
    document.getElementById("listaProdutos");

const pesquisa =
    document.getElementById("pesquisa");

const semProdutos =
    document.getElementById("semProdutos");

const contador =
    document.getElementById("contador");

const produtoDetalhes =
    document.getElementById("produtoDetalhes");


// ==========================================
// MODAL EDITAR
// ==========================================

const modalEditar =
    document.getElementById("modalEditar");

const formEditar =
    document.getElementById("formEditar");

const editarId =
    document.getElementById("editarId");

const editarCodigo =
    document.getElementById("editarCodigo");

const editarNome =
    document.getElementById("editarNome");

const editarCategoria =
    document.getElementById("editarCategoria");

const editarLocalizacao =
    document.getElementById("editarLocalizacao");

const editarDescricao =
    document.getElementById("editarDescricao");


// ==========================================
// NOTIFICAÇÃO
// ==========================================

const notificacao =
    document.getElementById("notificacao");


// ==========================================
// BANCO DE DADOS
// ==========================================

let produtos =
    JSON.parse(
        localStorage.getItem("localizaItens")
    ) || [];


// ==========================================
// GERAR CÓDIGO AUTOMÁTICO
// ==========================================

function gerarCodigoProduto() {

    let maiorNumero = 0;


    produtos.forEach(produto => {

        if (!produto.codigo) return;


        const numero =
            parseInt(
                produto.codigo
                    .replace("LZI-", "")
            );


        if (
            !isNaN(numero) &&
            numero > maiorNumero
        ) {

            maiorNumero = numero;

        }

    });


    const proximoNumero =
        maiorNumero + 1;


    return `LZI-${String(proximoNumero).padStart(4, "0")}`;

}


// ==========================================
// CORRIGIR PRODUTOS ANTIGOS
// ==========================================

function verificarCodigosAntigos() {

    let alterou = false;


    produtos.forEach(produto => {

        if (!produto.codigo) {

            produto.codigo =
                gerarCodigoProduto();

            alterou = true;

        }

    });


    if (alterou) {

        salvarDados();

    }

}


// ==========================================
// SALVAR DADOS
// ==========================================

function salvarDados() {

    localStorage.setItem(
        "localizaItens",
        JSON.stringify(produtos)
    );

}


// ==========================================
// ESCAPAR HTML
// ==========================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto;

    return div.innerHTML;

}


// ==========================================
// NOTIFICAÇÃO
// ==========================================

function mostrarNotificacao(mensagem) {

    notificacao.textContent =
        mensagem;

    notificacao.classList.add(
        "mostrar"
    );


    setTimeout(() => {

        notificacao.classList.remove(
            "mostrar"
        );

    }, 2500);

}


// ==========================================
// ABRIR CADASTRO
// ==========================================

function abrirCadastro() {

    document
        .getElementById("telaInicio")
        .classList.add("escondida");


    document
        .getElementById("telaCadastro")
        .classList.remove("escondida");

}


// ==========================================
// VOLTAR PARA INÍCIO
// ==========================================

function voltarInicio() {

    document
        .getElementById("telaCadastro")
        .classList.add("escondida");


    document
        .getElementById("telaProduto")
        .classList.add("escondida");


    document
        .getElementById("telaInicio")
        .classList.remove("escondida");


    fecharEdicao();

}


// ==========================================
// ADICIONAR PRODUTO
// ==========================================

formProduto.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const novoProduto = {

            id: Date.now(),

            codigo:
                gerarCodigoProduto(),

            nome:
                nome.value.trim(),

            categoria:
                categoria.value.trim(),

            localizacao:
                localizacao.value.trim(),

            descricao:
                descricao.value.trim(),

            data:
                new Date().toLocaleDateString(
                    "pt-BR"
                )

        };


        if (
            !novoProduto.nome ||
            !novoProduto.categoria ||
            !novoProduto.localizacao ||
            !novoProduto.descricao
        ) {

            mostrarNotificacao(
                "⚠️ Preencha todos os campos."
            );

            return;

        }


        produtos.push(
            novoProduto
        );


        salvarDados();

        renderizarProdutos();

        atualizarContador();


        formProduto.reset();


        document
            .getElementById("telaCadastro")
            .classList.add(
                "escondida"
            );


        document
            .getElementById("telaInicio")
            .classList.remove(
                "escondida"
            );


        mostrarNotificacao(
            `✅ Produto ${novoProduto.codigo} adicionado!`
        );

    }
);


// ==========================================
// RENDERIZAR PRODUTOS
// ==========================================

function renderizarProdutos() {

    const termo =
        pesquisa.value
            .toLowerCase()
            .trim();


    const produtosFiltrados =
        produtos.filter(produto => {

            return (

                produto.nome
                    .toLowerCase()
                    .includes(termo)

                ||

                produto.codigo
                    .toLowerCase()
                    .includes(termo)

                ||

                produto.categoria
                    .toLowerCase()
                    .includes(termo)

                ||

                produto.localizacao
                    .toLowerCase()
                    .includes(termo)

                ||

                produto.descricao
                    .toLowerCase()
                    .includes(termo)

            );

        });


    listaProdutos.innerHTML = "";


    if (produtos.length === 0) {

        listaProdutos.style.display =
            "none";

        semProdutos.style.display =
            "block";

        return;

    }


    if (produtosFiltrados.length === 0) {

        listaProdutos.style.display =
            "none";

        semProdutos.style.display =
            "block";


        semProdutos.querySelector(
            "h2"
        ).textContent =
            "Nenhum produto encontrado";


        semProdutos.querySelector(
            "p"
        ).textContent =
            "Tente pesquisar pelo nome ou código do produto.";

        return;

    }


    listaProdutos.style.display =
        "grid";

    semProdutos.style.display =
        "none";


    produtosFiltrados.forEach(produto => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "produto-card";


        card.innerHTML = `

            <div class="produto-icone">
                📦
            </div>


            <h3>
                ${escaparHTML(produto.nome)}
            </h3>


            <span class="categoria">
                ${escaparHTML(produto.categoria)}
            </span>


            <div class="local">

                📍 <strong>Localização:</strong><br>

                ${escaparHTML(produto.localizacao)}

            </div>


            <div
                style="
                    margin: 12px 0;
                    padding: 10px;
                    background: rgba(34, 197, 94, 0.08);
                    border: 1px solid rgba(34, 197, 94, 0.20);
                    border-radius: 8px;
                "
            >

                🔖 <strong>Código:</strong>

                <span
                    style="
                        color: #4ade80;
                        font-weight: bold;
                    "
                >
                    ${escaparHTML(produto.codigo)}
                </span>

            </div>


            <button
                class="btn-ver"
                onclick="abrirProduto(${produto.id})"
            >
                👁️ Ver produto
            </button>

        `;


        listaProdutos.appendChild(
            card
        );

    });

}


// ==========================================
// PESQUISA
// ==========================================

pesquisa.addEventListener(
    "input",
    renderizarProdutos
);


// ==========================================
// ABRIR PRODUTO
// ==========================================

function abrirProduto(id) {

    const produto =
        produtos.find(
            produto =>
                produto.id === id
        );


    if (!produto) return;


    document
        .getElementById("telaInicio")
        .classList.add(
            "escondida"
        );


    document
        .getElementById("telaProduto")
        .classList.remove(
            "escondida"
        );


    produtoDetalhes.innerHTML = `

        <div class="detalhe-cabecalho">

            <div class="detalhe-icone">
                📦
            </div>


            <div>

                <h2>
                    ${escaparHTML(produto.nome)}
                </h2>


                <span class="categoria">
                    ${escaparHTML(produto.categoria)}
                </span>

            </div>

        </div>


        <div
            style="
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(34, 197, 94, 0.08);
                border: 1px solid rgba(34, 197, 94, 0.25);
                border-radius: 10px;
            "
        >

            <strong>
                🔖 Código do produto
            </strong>


            <div
                style="
                    font-size: 22px;
                    font-weight: bold;
                    color: #4ade80;
                    margin-top: 6px;
                "
            >
                ${escaparHTML(produto.codigo)}
            </div>

        </div>


        <div class="detalhe-info">

            <h3>
                📍 LOCALIZAÇÃO
            </h3>

            <p>
                ${escaparHTML(produto.localizacao)}
            </p>

        </div>


        <div class="detalhe-info">

            <h3>
                📝 DESCRIÇÃO DA POSIÇÃO
            </h3>

            <p>
                ${escaparHTML(produto.descricao)}
            </p>

        </div>


        <div class="detalhe-info">

            <h3>
                📅 CADASTRADO EM
            </h3>

            <p>
                ${escaparHTML(produto.data)}
            </p>

        </div>


        <div class="acoes-produto">

            <button
                class="btn-editar"
                onclick="abrirEdicao(${produto.id})"
            >
                ✏️ Editar
            </button>


            <button
                class="btn-excluir"
                onclick="excluirProduto(${produto.id})"
            >
                🗑️ Excluir
            </button>

        </div>

    `;

}


// ==========================================
// ABRIR EDIÇÃO
// ==========================================

function abrirEdicao(id) {

    const produto =
        produtos.find(
            produto =>
                produto.id === id
        );


    if (!produto) return;


    editarId.value =
        produto.id;

    editarCodigo.value =
        produto.codigo || "";

    editarNome.value =
        produto.nome;

    editarCategoria.value =
        produto.categoria;

    editarLocalizacao.value =
        produto.localizacao;

    editarDescricao.value =
        produto.descricao;


    modalEditar.classList.remove(
        "escondido"
    );

}


// ==========================================
// FECHAR EDIÇÃO
// ==========================================

function fecharEdicao() {

    modalEditar.classList.add(
        "escondido"
    );

}


// ==========================================
// SALVAR EDIÇÃO
// ==========================================

formEditar.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            Number(
                editarId.value
            );


        const produto =
            produtos.find(
                produto =>
                    produto.id === id
            );


        if (!produto) return;


        const novoCodigo =
            editarCodigo.value.trim();


        if (!novoCodigo) {

            mostrarNotificacao(
                "⚠️ O código do produto não pode ficar vazio."
            );

            editarCodigo.focus();

            return;

        }


        // Atualiza todos os dados

        produto.codigo =
            novoCodigo;

        produto.nome =
            editarNome.value.trim();

        produto.categoria =
            editarCategoria.value.trim();

        produto.localizacao =
            editarLocalizacao.value.trim();

        produto.descricao =
            editarDescricao.value.trim();


        salvarDados();

        renderizarProdutos();

        atualizarContador();


        modalEditar.classList.add(
            "escondido"
        );


        abrirProduto(id);


        mostrarNotificacao(
            `✅ Produto ${produto.codigo} atualizado!`
        );

    }
);


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

function excluirProduto(id) {

    const produto =
        produtos.find(
            produto =>
                produto.id === id
        );


    if (!produto) return;


    const confirmar =
        confirm(
            `Deseja excluir "${produto.nome}"?`
        );


    if (!confirmar) return;


    produtos =
        produtos.filter(
            produto =>
                produto.id !== id
        );


    salvarDados();

    renderizarProdutos();

    atualizarContador();

    voltarInicio();


    mostrarNotificacao(
        `🗑️ Produto ${produto.codigo} excluído!`
    );

}


// ==========================================
// CONTADOR
// ==========================================

function atualizarContador() {

    if (produtos.length === 0) {

        contador.textContent =
            "0 produtos cadastrados";

        return;

    }


    contador.textContent =
        `${produtos.length} ${
            produtos.length === 1
                ? "produto cadastrado"
                : "produtos cadastrados"
        }`;

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

verificarCodigosAntigos();

renderizarProdutos();

atualizarContador();