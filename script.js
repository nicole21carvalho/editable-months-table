const CHAVE_STORAGE = 'tabela-meses';
const TOTAL_COLUNAS = 13; // nome do item + 12 meses
const VAZIO = '';

const corpo = document.querySelector('#tabela tbody');
const avisoVazio = document.getElementById('vazio');

// ---------- Dados ----------

function carregarLinhas() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    if (Array.isArray(salvo)) return salvo;
  } catch {
    // Dados corrompidos ou storage bloqueado: começa com uma linha em branco
  }
  return [novaLinhaVazia()];
}

function salvarLinhas() {
  const linhas = [...corpo.rows].map((linha) =>
    [...linha.cells].slice(0, TOTAL_COLUNAS).map((celula) => celula.textContent)
  );
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(linhas));
  } catch {
    // Sem storage disponível: a tabela continua funcionando, só não fica salva
  }
}

function novaLinhaVazia() {
  return Array(TOTAL_COLUNAS).fill(VAZIO);
}

// ---------- Interface ----------

function criarLinha(valores) {
  const linha = document.createElement('tr');

  valores.forEach((valor, indice) => {
    const celula = document.createElement(indice === 0 ? 'th' : 'td');
    if (indice === 0) celula.scope = 'row';
    celula.textContent = valor;
    celula.tabIndex = 0;
    celula.classList.add('editavel');
    linha.append(celula);
  });

  const celulaAcoes = document.createElement('td');
  const remover = document.createElement('button');
  remover.type = 'button';
  remover.className = 'remover';
  remover.textContent = '✕';
  remover.setAttribute('aria-label', 'Remover linha');
  celulaAcoes.append(remover);
  linha.append(celulaAcoes);

  return linha;
}

function renderizar(linhas) {
  corpo.replaceChildren(...linhas.map(criarLinha));
  atualizarAvisoVazio();
}

function atualizarAvisoVazio() {
  avisoVazio.hidden = corpo.rows.length > 0;
}

function editar(celula) {
  if (celula.querySelector('input')) return;

  const valorOriginal = celula.textContent;
  const campo = document.createElement('input');
  campo.type = 'text';
  campo.value = valorOriginal;
  campo.setAttribute('aria-label', 'Editar célula');

  let finalizado = false;
  const finalizar = (confirmar) => {
    if (finalizado) return;
    finalizado = true;
    celula.textContent = confirmar ? campo.value.trim() : valorOriginal;
    celula.focus();
    if (confirmar) salvarLinhas();
  };

  campo.addEventListener('blur', () => finalizar(true));
  campo.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') finalizar(true);
    if (evento.key === 'Escape') finalizar(false);
  });

  celula.replaceChildren(campo);
  campo.focus();
  campo.select();
}

// ---------- Eventos ----------

document.getElementById('adicionar').addEventListener('click', () => {
  const linha = criarLinha(novaLinhaVazia());
  corpo.append(linha);
  atualizarAvisoVazio();
  salvarLinhas();
  editar(linha.cells[0]);
});

document.getElementById('limpar').addEventListener('click', () => {
  if (!confirm('Apagar todas as linhas da tabela?')) return;
  renderizar([]);
  salvarLinhas();
});

corpo.addEventListener('dblclick', (evento) => {
  const celula = evento.target.closest('.editavel');
  if (celula) editar(celula);
});

corpo.addEventListener('keydown', (evento) => {
  const celula = evento.target.closest('.editavel');
  if (celula && evento.target === celula && (evento.key === 'Enter' || evento.key === 'F2')) {
    evento.preventDefault();
    editar(celula);
  }
});

corpo.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.remover');
  if (!botao) return;
  botao.closest('tr').remove();
  atualizarAvisoVazio();
  salvarLinhas();
});

renderizar(carregarLinhas());
