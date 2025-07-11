// Função para adicionar nova linha
function addLinha() {
  const tabela = document.querySelector('#tabelaMeses tbody');
  const novaLinha = tabela.insertRow();

  for (let i = 0; i < 12; i++) {
    const celula = novaLinha.insertCell();
    celula.textContent = '-';
    celula.addEventListener('dblclick', editarCelula);
  }
}

// Permitir edição nas células já existentes
document.addEventListener('DOMContentLoaded', () => {
  const celulas = document.querySelectorAll('#tabelaMeses tbody td');
  celulas.forEach(celula => {
    celula.addEventListener('dblclick', editarCelula);
  });
});

// Função para editar uma célula
function editarCelula(evento) {
  const celula = evento.target;
  const valorAtual = celula.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = valorAtual;
  input.style.width = '90%';

  input.addEventListener('blur', () => {
    celula.textContent = input.value;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      celula.textContent = input.value;
    }
  });

  celula.textContent = '';
  celula.appendChild(input);
  input.focus();
}