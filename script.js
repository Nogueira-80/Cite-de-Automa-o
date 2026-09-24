// ==========================================
// LOCALIZAITEM
// Sistema de organização de itens
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const formItem = document.getElementById("formItem");

const nome = document.getElementById("nome");
const categoria = document.getElementById("categoria");
const posicao = document.getElementById("posicao");
const descricao = document.getElementById("descricao");

const listaItens = document.getElementById("listaItens");

const pesquisa = document.getElementById("pesquisa");

const estadoVazio = document.getElementById("estadoVazio");

const totalItens = document.getElementById("totalItens");

const totalCategorias =
    document.getElementById("totalCategorias");

const quantidadeEncontrada =
    document.getElementById("quantidadeEncontrada");

const btnLimparTudo =
    document.getElementById("btnLimparTudo");


// ==========================================
// MODAL
// ==========================================

const modal = document.getElementById("modal");

const fecharModal =
    document.getElementById("fecharModal");

const formEditar =
    document.getElementById("formEditar");

const editarId =
    document.getElementById("editarId");

const editarNome =
    document.getElementById("editarNome");

const editarCategoria =
    document.getElementById("editarCategoria");

const editarPosicao =
    document.getElementById("editarPosicao");

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

let itens =
    JSON.parse(
        localStorage.getItem("localizaItens")
    ) || [];


// ==========================================
// SALVAR NO LOCALSTORAGE
// ==========================================

function salvarDados() {

    localStorage.setItem(
        "localizaItens",
        JSON.stringify(itens)
    );
}


// ==========================================
// ESCAPAR TEXTO
// Evita problemas ao mostrar dados
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
// ADICIONAR ITEM
// ==========================================

formItem.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const novoItem = {

            id: Date.now(),

            nome: nome.value.trim(),

            categoria:
                categoria.value.trim(),

            posicao:
                posicao.value.trim(),

            descricao:
                descricao.value.trim(),

            data:
                new Date().toLocaleDateString(
                    "pt-BR"
                )

        };


        itens.push(novoItem);


        salvarDados();

        renderizarItens();

        atualizarEstatisticas();


        formItem.reset();


        mostrarNotificacao(
            "✅ Item adicionado com sucesso!"
        );

    }
);


// ==========================================
// RENDERIZAR ITENS
// ==========================================

function renderizarItens() {

    const termo =
        pesquisa.value
            .toLowerCase()
            .trim();


    const itensFiltrados =
        itens.filter(item => {

            return (

                item.nome
                    .toLowerCase()
                    .includes(termo)

                ||

                item.categoria
                    .toLowerCase()
                    .includes(termo)

                ||

                item.posicao
                    .toLowerCase()
                    .includes(termo)

                ||

                item.descricao
                    .toLowerCase()
                    .includes(termo)

            );

        });


    listaItens.innerHTML = "";


    quantidadeEncontrada.textContent =
        `${itensFiltrados.length} ${
            itensFiltrados.length === 1
                ? "item encontrado"
                : "itens encontrados"
        }`;


    if (itensFiltrados.length === 0) {

        listaItens.style.display = "none";

        estadoVazio.style.display = "block";

        return;
    }


    listaItens.style.display = "grid";

    estadoVazio.style.display = "none";


    itensFiltrados.forEach(item => {

        const card =
            document.createElement("article");

        card.className = "card-item";


        card.innerHTML = `

            <div class="card-topo">

                <div>

                    <h3>
                        📦 ${escaparHTML(item.nome)}
                    </h3>

                    <span class="categoria">
                        ${escaparHTML(item.categoria)}
                    </span>

                </div>

            </div>


            <div class="info">

                <span>📍</span>

                <div>
                    <strong>Localização</strong><br>
                    ${escaparHTML(item.posicao)}
                </div>

            </div>


            <div class="descricao">

                <strong>📝 Descrição:</strong>

                <br><br>

                ${escaparHTML(item.descricao)}

            </div>


            <div class="info">

                <span>📅</span>

                <div>
                    Cadastrado em ${escaparHTML(item.data)}
                </div>

            </div>


            <div class="acoes">

                <button
                    class="btn-editar"
                    onclick="abrirEdicao(${item.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirItem(${item.id})"
                >
                    🗑️ Excluir
                </button>

            </div>

        `;


        listaItens.appendChild(card);

    });

}


// ==========================================
// PESQUISA
// ==========================================

pesquisa.addEventListener(
    "input",
    renderizarItens
);


// ==========================================
// ABRIR EDIÇÃO
// ==========================================

function abrirEdicao(id) {

    const item =
        itens.find(item => item.id === id);


    if (!item) return;


    editarId.value = item.id;

    editarNome.value = item.nome;

    editarCategoria.value =
        item.categoria;

    editarPosicao.value =
        item.posicao;

    editarDescricao.value =
        item.descricao;


    modal.classList.add("ativo");
}


// ==========================================
// FECHAR MODAL
// ==========================================

fecharModal.addEventListener(
    "click",
    function() {

        modal.classList.remove("ativo");

    }
);


// Fechar clicando fora do modal

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            modal.classList.remove("ativo");

        }

    }
);


// ==========================================
// SALVAR EDIÇÃO
// ==========================================

formEditar.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            Number(editarId.value);


        const item =
            itens.find(item => item.id === id);


        if (!item) return;


        item.nome =
            editarNome.value.trim();

        item.categoria =
            editarCategoria.value.trim();

        item.posicao =
            editarPosicao.value.trim();

        item.descricao =
            editarDescricao.value.trim();


        salvarDados();

        renderizarItens();

        atualizarEstatisticas();


        modal.classList.remove("ativo");


        mostrarNotificacao(
            "✅ Item atualizado!"
        );

    }
);


// ==========================================
// EXCLUIR ITEM
// ==========================================

function excluirItem(id) {

    const item =
        itens.find(item => item.id === id);


    if (!item) return;


    const confirmar =
        confirm(
            `Deseja excluir "${item.nome}"?`
        );


    if (!confirmar) return;


    itens =
        itens.filter(item => item.id !== id);


    salvarDados();

    renderizarItens();

    atualizarEstatisticas();


    mostrarNotificacao(
        "🗑️ Item excluído!"
    );
}


// ==========================================
// LIMPAR TODOS
// ==========================================

btnLimparTudo.addEventListener(
    "click",
    function() {

        if (itens.length === 0) {

            mostrarNotificacao(
                "Não existem itens cadastrados."
            );

            return;
        }


        const confirmar =
            confirm(
                "Tem certeza que deseja apagar TODOS os itens?"
            );


        if (!confirmar) return;


        itens = [];


        salvarDados();

        renderizarItens();

        atualizarEstatisticas();


        mostrarNotificacao(
            "🗑️ Todos os itens foram removidos."
        );

    }
);


// ==========================================
// ESTATÍSTICAS
// ==========================================

function atualizarEstatisticas() {

    totalItens.textContent =
        itens.length;


    const categorias =
        new Set(
            itens.map(
                item =>
                    item.categoria
                        .toLowerCase()
                        .trim()
            )
        );


    totalCategorias.textContent =
        categorias.size;
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

renderizarItens();

atualizarEstatisticas();