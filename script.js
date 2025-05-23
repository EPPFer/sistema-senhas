// Função que cria a lista de atendimentos para o chefe
function renderQueueForChief() {
  const list = document.getElementById('queueListChief');
  list.innerHTML = '';

  queue.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Motivo: ${item.reason} - Prioridade: ${item.urgent ? 'URGENTE' : 'Normal'}`;
    li.style.cursor = 'pointer';
    li.style.backgroundColor = item.urgent ? '#ffcccc' : '#fff';
    li.onclick = () => {
      // O chefe pode chamar qualquer um que clicar
      callNext(index);
    };
    list.appendChild(li);
  });
}

// Função para chamar o atendimento pelo índice da fila
function callNext(index) {
  if (queue.length === 0) {
    alert('Não há atendimentos na fila');
    return;
  }

  const called = queue.splice(index, 1)[0];
  alert(`Chamando ${called.name} para atendimento.`);
  // Atualiza lista do chefe e usuários
  renderQueueForChief();
  renderQueue();
  playSound();
}
