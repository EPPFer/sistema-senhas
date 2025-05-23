// Senha de acesso para entrar no sistema
const ACCESS_PASSWORD = "senha123"; // troque essa senha para algo seguro!

const loginScreen = document.getElementById("login-screen");
const app = document.getElementById("app");
const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password-input");
const loginError = document.getElementById("login-error");

const urgentCheckbox = document.getElementById("urgent");
const urgentReasonInput = document.getElementById("urgent-reason");
const requestBtn = document.getElementById("request-btn");
const requestMessage = document.getElementById("request-message");
const nameInput = document.getElementById("name");
const reasonInput = document.getElementById("reason");

const queueList = document.getElementById("queue-list");

const callNextBtn = document.getElementById("call-next");
const markAttendedBtn = document.getElementById("mark-attended");
const currentCall = document.getElementById("current-call");

const newRequestSound = document.getElementById("new-request-sound");
const callSound = document.getElementById("call-sound");

let queue = [];
let currentIndex = -1;

// Login handler
loginBtn.addEventListener("click", () => {
  if (passwordInput.value === ACCESS_PASSWORD) {
    loginScreen.style.display = "none";
    app.style.display = "block";
    renderQueue();
  } else {
    loginError.style.display = "block";
  }
});

// Mostrar/ocultar campo justificativa da urgência
urgentCheckbox.addEventListener("change", () => {
  urgentReasonInput.style.display = urgentCheckbox.checked ? "block" : "none";
});

// Solicitar senha
requestBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const reason = reasonInput.value.trim();
  const urgent = urgentCheckbox.checked;
  const urgentReason = urgentReasonInput.value.trim();

  if (!name || !reason) {
    alert("Preencha seu nome e motivo do despacho.");
    return;
  }
  if (urgent && !urgentReason) {
    alert("Por favor, justifique a urgência.");
    return;
  }

  // Criar o pedido
  const request = {
    id: Date.now(),
    name,
    reason: urgent ? urgentReason : reason,
    urgent,
    timestamp: Date.now(),
    attended: false
  };

  queue.push(request);
  sortQueue();
  renderQueue();
  requestMessage.textContent = `Senha gerada para ${name}. Aguarde seu chamado.`;
  nameInput.value = "";
  reasonInput.value = "";
  urgentCheckbox.checked = false;
  urgentReasonInput.value = "";
  urgentReasonInput.style.display = "none";

  // Som de novo pedido
  newRequestSound.play();
});

// Ordenar fila (urgentes no topo, por ordem de chegada)
function sortQueue() {
  queue.sort((a, b) => {
    if (a.attended && !b.attended) return 1;
    if (!a.attended && b.attended) return -1;

    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;

    return a.timestamp - b.timestamp;
  });
}

// Renderizar a fila na tabela
function renderQueue() {
  queueList.innerHTML = "";
  let pos = 1;
  queue.forEach((item) => {
    if (item.attended) return;
    const tr = document.createElement("tr");
    if (item.urgent) tr.classList.add("urgent");

    tr.innerHTML = `
      <td>${pos++}</td>
      <td>${item.name}</td>
      <td>${item.reason}</td>
      <td>${item.urgent ? "Sim" : "Não"}</td>
    `;
    queueList.appendChild(tr);
  });
  updateButtons();
}

// Chamar próximo da fila
callNextBtn.addEventListener("click", () => {
  // Pular atendidos
  do {
    currentIndex++;
  } while (currentIndex < queue.length && queue[currentIndex].attended);

  if (currentIndex >= queue.length) {
    currentCall.textContent = "Fila vazia.";
    markAttendedBtn.disabled = true;
    callSound.pause();
    callSound.currentTime = 0;
    return;
  }

  const current = queue[currentIndex];
  currentCall.textContent = `Chamando: ${current.name} - ${current.reason} ${current.urgent ? "(URGENTE)" : ""}`;
  markAttendedBtn.disabled = false;

  // Tocar som de chamada
  callSound.play();
});

// Marcar como atendido
markAttendedBtn.addEventListener("click", () => {
  if (currentIndex < 0 || currentIndex >= queue.length) return;

  queue[currentIndex].attended = true;
  currentCall.textContent = "";
  markAttendedBtn.disabled = true;
  renderQueue();
});

// Atualizar botões conforme fila
function updateButtons() {
  if (queue.filter(i => !i.attended).length === 0) {
    callNextBtn.disabled = true;
    markAttendedBtn.disabled = true;
    currentCall.textContent = "Fila vazia.";
  } else {
    callNextBtn.disabled = false;
  }
}
