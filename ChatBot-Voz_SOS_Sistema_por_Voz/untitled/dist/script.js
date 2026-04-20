class EnterpriseVoiceSystem {
  constructor() {
    // 1. Inicialización de APIs
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.logToConsole('Sistema', 'Speech API no soportada en este entorno.', true);
      return;
    }
    
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'es-MX';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    
    // 2. Estado de la Aplicación
    this.state = {
      isListening: false,
      isEmergency: false
    };

    // 3. Bindings de la Interfaz
    this.dom = {
      masterBtn: document.getElementById('master-btn'),
      btnText: document.querySelector('.btn-text'),
      statusPanel: document.getElementById('status-panel'),
      statusText: document.getElementById('system-status'),
      subText: document.getElementById('system-subtext'),
      chatLog: document.getElementById('chat-log'),
      inputBox: document.getElementById('command-input'),
      sendBtn: document.getElementById('send-btn'),
      statusDot: document.querySelector('.status-dot')
    };

    // Poner la hora actual en el init log
    document.getElementById('init-time').innerText = this.getTimeStamp();

    this.bindEvents();
  }

  // --- CONTROLADORES DE EVENTOS ---
  bindEvents() {
    this.dom.masterBtn.addEventListener('click', () => this.toggleListening());
    
    this.dom.sendBtn.addEventListener('click', () => this.handleTextInput());
    this.dom.inputBox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleTextInput();
    });

    this.recognition.onstart = () => this.updateUIState('listening');
    this.recognition.onend = () => {
      if (!this.state.isEmergency) this.updateUIState('standby');
      this.state.isListening = false;
    };
    
    this.recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      this.logToConsole('Operador (Voz)', transcript);
      this.processCommand(transcript);
    };

    this.recognition.onerror = (e) => {
      this.logToConsole('Error', `Fallo en hardware de audio: ${e.error}`);
      this.updateUIState('standby');
    };
  }

  // --- LÓGICA PRINCIPAL ---
  toggleListening() {
    if (this.state.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
        this.state.isListening = true;
      } catch (err) {
        console.error('Instancia de reconocimiento ya activa.', err);
      }
    }
  }

  handleTextInput() {
    const text = this.dom.inputBox.value.trim();
    if (text) {
      this.logToConsole('Operador (Texto)', text);
      this.processCommand(text);
      this.dom.inputBox.value = '';
    }
  }

  processCommand(rawCommand) {
    const cmd = rawCommand.toLowerCase();
    
    // Diccionario de Comandos (Patrón Estrategia simplificado)
    if (cmd.includes("emergencia")) {
      this.triggerEmergencyProtocol("Protocolo Alpha activado. Desplegando unidades.");
    } 
    else if (cmd.includes("ayuda")) {
      this.systemResponse("Asistencia técnica en línea. Indique su requerimiento.");
    }
    else if (cmd.includes("llamar")) {
      this.systemResponse("Estableciendo conexión encriptada con centro de mando.");
    }
    else if (cmd.includes("ubicación")) {
      this.systemResponse("Coordenadas telemétricas aseguradas y transmitidas.");
    }
    else if (cmd.includes("cancelar")) {
      this.resetSystem("Autorización recibida. Protocolos cancelados.");
    }
    else {
      this.systemResponse("Comando no reconocido en la base de datos.");
    }
  }

  // --- MÉTODOS DE SALIDA Y UI ---
  triggerEmergencyProtocol(message) {
    this.state.isEmergency = true;
    this.dom.statusPanel.classList.remove('listening');
    this.dom.statusPanel.classList.add('emergency');
    document.body.classList.add('emergency-lockdown');
    this.dom.statusText.innerText = "ALERTA CRÍTICA";
    this.dom.subText.innerText = "Transmitiendo telemetría...";
    this.dom.statusDot.style.background = "var(--danger)";
    this.dom.statusDot.style.boxShadow = "0 0 8px var(--danger)";
    this.systemResponse(message);
  }

  resetSystem(message) {
    this.state.isEmergency = false;
    this.dom.statusPanel.classList.remove('emergency');
    document.body.classList.remove('emergency-lockdown');
    this.dom.statusDot.style.background = "var(--success)";
    this.dom.statusDot.style.boxShadow = "0 0 8px var(--success)";
    this.systemResponse(message);
    this.updateUIState('standby');
  }

  systemResponse(message) {
    this.logToConsole('Sistema', message, true);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-MX';
    window.speechSynthesis.speak(utterance);
  }

  updateUIState(mode) {
    if (this.state.isEmergency) return; // Bloquear UI si hay emergencia
    
    if (mode === 'listening') {
      this.dom.statusPanel.classList.add('listening');
      this.dom.statusText.innerText = "Escuchando Entorno";
      this.dom.subText.innerText = "Procesando firma de audio...";
      this.dom.masterBtn.classList.add('active-state');
      this.dom.btnText.innerText = "Detener Monitoreo";
    } else {
      this.dom.statusPanel.classList.remove('listening');
      this.dom.statusText.innerText = "Standby";
      this.dom.subText.innerText = "Sistema seguro y encriptado";
      this.dom.masterBtn.classList.remove('active-state');
      this.dom.btnText.innerText = "Activar Monitoreo de Voz";
    }
  }

  logToConsole(sender, message, isSystem = false) {
    const div = document.createElement('div');
    div.className = `log-entry ${isSystem ? 'system-log' : 'user-log'}`;
    div.innerHTML = `<span class="timestamp">${this.getTimeStamp()}</span> <strong>${sender}:</strong> ${message}`;
    
    this.dom.chatLog.appendChild(div);
    this.dom.chatLog.scrollTop = this.dom.chatLog.scrollHeight;
  }

  getTimeStamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0]; // Retorna HH:MM:SS
  }
}

// Arrancar el sistema cuando el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
  const sosApp = new EnterpriseVoiceSystem();
});