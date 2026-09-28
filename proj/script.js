// ==========================================
// LOCALIZAITEM
// Sistema de organização de produtos
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const formProduto = document.getElementById("formProduto");

const nome = document.getElementById("nome");
const categoria = document.getElementById("categoria");
const localizacao = document.getElementById("localizacao");
const descricao = document.getElementById("descricao");

const listaProdutos = document.getElementById("listaProdutos");

const pesquisa = document.getElementById("pesquisa");

const semProdutos = document.getElementById("semProdutos");

const contador = document.getElementById("contador");

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

    const div = document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;
}


// ==========================================
// NOTIFICAÇÃO
// ==========================================

function mostrarNotificacao(mensagem) {

    notificacao.textContent = mensagem;

    notificacao.classList.add("mostrar");

    setTimeout(() => {

        notificacao.classList.remove("mostrar");

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


        // Verifica se os campos foram preenchidos

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


        // Adiciona produto

        produtos.push(novoProduto);


        // Salva

        salvarDados();


        // Atualiza tela

        renderizarProdutos();


        atualizarContador();


        // Limpa formulário

        formProduto.reset();


        // Volta para a tela inicial

        document
            .getElementById("telaCadastro")
            .classList.add("escondida");

        document
            .getElementById("telaInicio")
            .classList.remove("escondida");


        mostrarNotificacao(
            "✅ Produto adicionado com sucesso!"
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

        listaProdutos.style.display = "none";

        semProdutos.style.display = "block";

        return;
    }


    if (produtosFiltrados.length === 0) {

        listaProdutos.style.display = "none";

        semProdutos.style.display = "block";

        semProdutos.querySelector("h2").textContent =
            "Nenhum produto encontrado";

        semProdutos.querySelector("p").textContent =
            "Tente pesquisar por outro nome ou categoria.";

        return;
    }


    listaProdutos.style.display = "grid";

    semProdutos.style.display = "none";


    produtosFiltrados.forEach(produto => {

        const card =
            document.createElement("article");


        card.className = "produto-card";


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

            <button
                class="btn-ver"
                onclick="abrirProduto(${produto.id})"
            >
                👁️ Ver produto
            </button>

        `;


        listaProdutos.appendChild(card);

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
            produto => produto.id === id
        );


    if (!produto) return;


    document
        .getElementById("telaInicio")
        .classList.add("escondida");

    document
        .getElementById("telaProduto")
        .classList.remove("escondida");


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
            produto => produto.id === id
        );


    if (!produto) return;


    editarId.value =
        produto.id;

    editarNome.value =
        produto.nome;

    editarCategoria.value =
        produto.categoria;

    editarLocalizacao.value =
        produto.localizacao;

    editarDescricao.value =
        produto.descricao;


    modalEditar.classList.remove("escondido");

}


// ==========================================
// FECHAR EDIÇÃO
// ==========================================

function fecharEdicao() {

    modalEditar.classList.add("escondido");

}


// ==========================================
// SALVAR EDIÇÃO
// ==========================================

formEditar.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            Number(editarId.value);


        const produto =
            produtos.find(
                produto => produto.id === id
            );


        if (!produto) return;


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


        modalEditar.classList.add("escondido");


        // Atualiza a tela do produto

        abrirProduto(id);


        mostrarNotificacao(
            "✅ Produto atualizado!"
        );

    }
);


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

function excluirProduto(id) {

    const produto =
        produtos.find(
            produto => produto.id === id
        );


    if (!produto) return;


    const confirmar =
        confirm(
            `Deseja excluir "${produto.nome}"?`
        );


    if (!confirmar) return;


    produtos =
        produtos.filter(
            produto => produto.id !== id
        );


    salvarDados();

    renderizarProdutos();

    atualizarContador();


    voltarInicio();


    mostrarNotificacao(
        "🗑️ Produto excluído!"
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

renderizarProdutos();

atualizarContador();