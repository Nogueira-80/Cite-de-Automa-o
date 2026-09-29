let produtos = JSON.parse(localStorage.getItem("localizaItemProdutos")) || [];
let produtoAtual = null;

const telaInicio=document.getElementById("telaInicio");
const telaCadastro=document.getElementById("telaCadastro");
const telaProduto=document.getElementById("telaProduto");
const listaProdutos=document.getElementById("listaProdutos");
const semProdutos=document.getElementById("semProdutos");
const contador=document.getElementById("contador");
const pesquisa=document.getElementById("pesquisa");
const formProduto=document.getElementById("formProduto");
const produtoDetalhes=document.getElementById("produtoDetalhes");
const modalEditar=document.getElementById("modalEditar");
const formEditar=document.getElementById("formEditar");
const modalRetirar=document.getElementById("modalRetirar");
const formRetirar=document.getElementById("formRetirar");
const notificacao=document.getElementById("notificacao");

function salvarDados(){
  try{ localStorage.setItem("localizaItemProdutos", JSON.stringify(produtos)); }
  catch(e){ mostrarNotificacao("⚠️ Não foi possível salvar os dados."); }
}

function normalizarCategoria(categoria){
  return categoria.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}
function hashTexto(texto){
  const nome=normalizarCategoria(texto);
  let hash=0;
  for(let i=0;i<nome.length;i++){ hash=nome.charCodeAt(i)+((hash<<5)-hash); hash|=0; }
  return Math.abs(hash)%360;
}
function obterCorCategoria(categoria){ return `hsl(${hashTexto(categoria)}, 70%, 38%)`; }
function corComAlpha(categoria,alpha){ return `hsl(${hashTexto(categoria)}, 70%, 38%, ${alpha})`; }

function escaparHTML(texto){
  const div=document.createElement("div");
  div.textContent=texto;
  return div.innerHTML;
}

function esconderTodasTelas(){
  telaInicio.classList.add("escondida");
  telaCadastro.classList.add("escondida");
  telaProduto.classList.add("escondida");
}

function voltarInicio(){
  esconderTodasTelas();
  telaInicio.classList.remove("escondida");
  carregarProdutos();
  window.scrollTo({top:0,behavior:"smooth"});
}

function abrirCadastro(){
  esconderTodasTelas();
  telaCadastro.classList.remove("escondida");
  window.scrollTo({top:0,behavior:"smooth"});
  setTimeout(()=>{ const nome=document.getElementById("nome"); if(nome) nome.focus(); },100);
}

function classeEstoque(qtd){
  if(qtd<=0) return "estoque-zero";
  if(qtd<=5) return "estoque-baixo";
  return "estoque-ok";
}
function textoEstoque(qtd){
  if(qtd<=0) return "Sem estoque";
  return `${qtd} em estoque`;
}

formProduto.addEventListener("submit", function(event){
  event.preventDefault();
  const nome=document.getElementById("nome").value.trim();
  const categoria=document.getElementById("categoria").value.trim();
  const codigo=document.getElementById("codigo").value.trim();
  const quantidade=Number(document.getElementById("quantidade").value);
  const localizacao=document.getElementById("localizacao").value.trim();
  const descricao=document.getElementById("descricao").value.trim();

  if(!nome||!categoria||!codigo||!localizacao||!descricao||isNaN(quantidade)||quantidade<0){
    mostrarNotificacao("⚠️ Preencha todos os campos corretamente!");
    return;
  }

  produtos.push({
    id:Date.now(), nome, categoria, codigo, quantidade,
    localizacao, descricao,
    criadoEm:new Date().toLocaleDateString("pt-BR")
  });

  salvarDados();
  formProduto.reset();
  mostrarNotificacao("✅ Produto cadastrado!");
  setTimeout(()=>{ voltarInicio(); },400);
});

function carregarProdutos(){
  const termo=pesquisa.value.toLowerCase().trim();
  const filtrados=produtos.filter(p=>
    p.nome.toLowerCase().includes(termo) ||
    p.categoria.toLowerCase().includes(termo) ||
    p.localizacao.toLowerCase().includes(termo) ||
    (p.codigo||"").toLowerCase().includes(termo)
  );

  listaProdutos.innerHTML="";
  contador.textContent=`${produtos.length} ${produtos.length===1?"produto cadastrado":"produtos cadastrados"}`;

  if(filtrados.length===0){
    listaProdutos.style.display="none";
    semProdutos.style.display="block";
    return;
  }
  listaProdutos.style.display="grid";
  semProdutos.style.display="none";

  filtrados.forEach(p=>{
    const card=document.createElement("div");
    card.className="produto-card";
    const cor=obterCorCategoria(p.categoria);
    const fundo=corComAlpha(p.categoria,0.10);
    const borda=corComAlpha(p.categoria,0.30);
    const qtd=Number(p.quantidade)||0;

    card.innerHTML=`
      <div class="produto-icone">📦</div>
      <h3>${escaparHTML(p.nome)}</h3>
      <div>
        <span class="categoria" style="color:${cor};background:${fundo};border-color:${borda};">${escaparHTML(p.categoria)}</span>
        <span class="badge-codigo">#${escaparHTML(p.codigo||"-")}</span>
        <span class="badge-estoque ${classeEstoque(qtd)}">${textoEstoque(qtd)}</span>
      </div>
      <div class="local">📍 <strong>Localização:</strong><br>${escaparHTML(p.localizacao)}</div>
      <button class="btn-ver" onclick="visualizarProduto(${p.id})">👁️ Ver produto</button>
    `;
    listaProdutos.appendChild(card);
  });
}
pesquisa.addEventListener("input", carregarProdutos);

function visualizarProduto(id){
  const p=produtos.find(item=>item.id===id);
  if(!p) return;
  produtoAtual=p;
  esconderTodasTelas();
  telaProduto.classList.remove("escondida");

  const cor=obterCorCategoria(p.categoria);
  const fundo=corComAlpha(p.categoria,0.10);
  const borda=corComAlpha(p.categoria,0.30);
  const qtd=Number(p.quantidade)||0;

  produtoDetalhes.innerHTML=`
    <div class="detalhe-cabecalho">
      <div class="detalhe-icone">📦</div>
      <div>
        <h2>${escaparHTML(p.nome)}</h2>
        <span class="categoria" style="color:${cor};background:${fundo};border-color:${borda};">${escaparHTML(p.categoria)}</span>
        <span class="badge-codigo">#${escaparHTML(p.codigo||"-")}</span>
        <span class="badge-estoque ${classeEstoque(qtd)}">${textoEstoque(qtd)}</span>
      </div>
    </div>
    <div class="detalhe-info"><h3>📍 LOCALIZAÇÃO</h3><p>${escaparHTML(p.localizacao)}</p></div>
    <div class="detalhe-info"><h3>📝 DESCRIÇÃO DA POSIÇÃO</h3><p>${escaparHTML(p.descricao)}</p></div>
    <div class="detalhe-info"><h3>📅 CADASTRADO EM</h3><p>${escaparHTML(p.criadoEm)}</p></div>
    <div class="acoes-produto">
      <button class="btn-editar" onclick="abrirEdicao()">✏️ Editar</button>
      <button class="btn-retirar" onclick="abrirRetirada()">📤 Retirar do estoque</button>
      <button class="btn-excluir" onclick="excluirProduto()">🗑️ Excluir</button>
    </div>
  `;
  window.scrollTo({top:0,behavior:"smooth"});
}

function abrirEdicao(){
  if(!produtoAtual) return;
  document.getElementById("editarId").value=produtoAtual.id;
  document.getElementById("editarNome").value=produtoAtual.nome;
  document.getElementById("editarCategoria").value=produtoAtual.categoria;
  document.getElementById("editarCodigo").value=produtoAtual.codigo||"";
  document.getElementById("editarQuantidade").value=produtoAtual.quantidade||0;
  document.getElementById("editarLocalizacao").value=produtoAtual.localizacao;
  document.getElementById("editarDescricao").value=produtoAtual.descricao;
  modalEditar.classList.remove("escondido");
  setTimeout(()=>{ document.getElementById("editarNome").focus(); },100);
}
function fecharEdicao(){ modalEditar.classList.add("escondido"); }

formEditar.addEventListener("submit", function(event){
  event.preventDefault();
  const id=Number(document.getElementById("editarId").value);
  const p=produtos.find(item=>item.id===id);
  if(!p) return;

  const quantidade=Number(document.getElementById("editarQuantidade").value);
  p.nome=document.getElementById("editarNome").value.trim();
  p.categoria=document.getElementById("editarCategoria").value.trim();
  p.codigo=document.getElementById("editarCodigo").value.trim();
  p.localizacao=document.getElementById("editarLocalizacao").value.trim();
  p.descricao=document.getElementById("editarDescricao").value.trim();

  if(!p.nome||!p.categoria||!p.codigo||!p.localizacao||!p.descricao||isNaN(quantidade)||quantidade<0){
    mostrarNotificacao("⚠️ Preencha todos os campos corretamente!");
    return;
  }
  p.quantidade=quantidade;

  salvarDados();
  produtoAtual=p;
  fecharEdicao();
  visualizarProduto(p.id);
  mostrarNotificacao("✅ Produto atualizado!");
});

function abrirRetirada(){
  if(!produtoAtual) return;
  const qtd=Number(produtoAtual.quantidade)||0;
  document.getElementById("labelEstoqueAtual").textContent=`Estoque atual: ${qtd} un. Quantidade a retirar:`;
  const input=document.getElementById("qtdRetirar");
  input.value="";
  input.max=qtd>0?qtd:1;
  modalRetirar.classList.remove("escondido");
  setTimeout(()=>input.focus(),100);
}
function fecharRetirada(){ modalRetirar.classList.add("escondido"); }

formRetirar.addEventListener("submit", function(event){
  event.preventDefault();
  if(!produtoAtual) return;
  const atual=Number(produtoAtual.quantidade)||0;
  const qtdRetirar=Number(document.getElementById("qtdRetirar").value);

  if(!qtdRetirar||qtdRetirar<=0){
    mostrarNotificacao("⚠️ Informe uma quantidade válida!");
    return;
  }
  if(qtdRetirar>atual){
    mostrarNotificacao("⚠️ Quantidade maior que o estoque disponível!");
    return;
  }

  produtoAtual.quantidade=atual-qtdRetirar;
  salvarDados();
  fecharRetirada();
  visualizarProduto(produtoAtual.id);
  mostrarNotificacao(`📤 ${qtdRetirar} unidade(s) retirada(s) do estoque!`);
});

function excluirProduto(){
  if(!produtoAtual) return;
  const confirmar=confirm(`Deseja excluir "${produtoAtual.nome}"?`);
  if(!confirmar) return;
  produtos=produtos.filter(item=>item.id!==produtoAtual.id);
  salvarDados();
  produtoAtual=null;
  mostrarNotificacao("🗑️ Produto excluído!");
  setTimeout(()=>{ voltarInicio(); },400);
}

function mostrarNotificacao(mensagem){
  notificacao.textContent=mensagem;
  notificacao.classList.add("mostrar");
  setTimeout(()=>{ notificacao.classList.remove("mostrar"); },2500);
}

modalEditar.addEventListener("click", function(event){ if(event.target===modalEditar) fecharEdicao(); });
modalRetirar.addEventListener("click", function(event){ if(event.target===modalRetirar) fecharRetirada(); });
document.addEventListener("keydown", function(event){ if(event.key==="Escape"){ fecharEdicao(); fecharRetirada(); } });

carregarProdutos();