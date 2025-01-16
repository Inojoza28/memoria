 /* ------------------- VARIÁVEIS E CONFIGURAÇÕES ------------------- */
    // Símbolos das cartas
    const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let boardLocked = false;
    let matchesFound = 0;
    let moves = 0;
    let timerInterval = null;
    let secondsElapsed = 0;
    let gameStarted = false;
    
    // Elementos da tela inicial e jogo
    const initialScreen = document.getElementById('initial-screen');
    const mainTitle = document.getElementById('main-title');
    const startBtn = document.getElementById('start-btn');
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const infoBar = document.getElementById('info-bar');
    const moveCounterEl = document.getElementById('move-counter');
    const timerEl = document.getElementById('timer');
    const board = document.getElementById('game-board');
    const resetBtn = document.getElementById('reset-btn');
    const closeBtn = document.getElementById('close-btn');
    const victoryOverlay = document.getElementById('victory-overlay');
    const finalTimeEl = document.getElementById('final-time');
    const finalMovesEl = document.getElementById('final-moves');
    const playAgainBtn = document.getElementById('play-again-btn');
    const gameContainer = document.getElementById('game-container');
    
    // Objetos de áudio
    const matchSound = new Audio('assets/match.mp3');
    const notMatchSound = new Audio('assets/not-match.mp3');
    const winSound = new Audio('assets/win.mp3');
    matchSound.volume = 0.5;
    notMatchSound.volume = 0.5;
    winSound.volume = 0.7;
    
    /* ------------------- FUNÇÕES AUXILIARES ------------------- */
    
    // Função para embaralhar o array
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    
    // Atualiza o contador de jogadas
    function updateMoves() {
      moveCounterEl.textContent = moves;
    }
    
    // Atualiza o cronômetro do jogo
    function updateTimer() {
      const minutes = Math.floor(secondsElapsed / 60);
      const seconds = secondsElapsed % 60;
      timerEl.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Inicia o cronômetro do jogo
    function startTimer() {
      clearInterval(timerInterval);
      secondsElapsed = 0;
      updateTimer();
      timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimer();
      }, 1000);
    }
    
    // Cria o tabuleiro do jogo
    function createBoard() {
      board.innerHTML = '';
      cards = [];
      matchesFound = 0;
      moves = 0;
      updateMoves();
      firstCard = null;
      secondCard = null;
      boardLocked = false;
      clearInterval(timerInterval);
      startTimer();
      hideVictoryOverlay();
      infoBar.classList.add('active');
      board.classList.add('active');
      
      const doubleSymbols = shuffle([...symbols, ...symbols]);
      
      doubleSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        // Estrutura para efeito flip 3D
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.textContent = '?';
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        cardFront.textContent = symbol;
        
        cardInner.appendChild(cardBack);
        cardInner.appendChild(cardFront);
        card.appendChild(cardInner);
        
        card.addEventListener('click', () => flipCard(card));
        
        cards.push(card);
        board.appendChild(card);
      });
    }
    
    // Lida com a virada da carta
    function flipCard(card) {
      if (!gameStarted) return;
      if (boardLocked || card.querySelector('.card-inner').classList.contains('flip')) return;
      
      card.querySelector('.card-inner').classList.add('flip');
      
      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        boardLocked = true;
        moves++;
        updateMoves();
        checkForMatch();
      }
    }
    
    // Verifica se as duas cartas selecionadas são iguais
    function checkForMatch() {
  const isMatch = firstCard && secondCard && (firstCard.dataset.symbol === secondCard.dataset.symbol);
  
  if (isMatch) {
    matchSound.play();
    
    // Armazena as referências locais das faces frontais das duas cartas
    const front1 = firstCard.querySelector('.card-front');
    const front2 = secondCard.querySelector('.card-front');
    
    // Usa um delay menor para acionar o efeito match (300ms)
    setTimeout(() => {
      front1.classList.add('match');
      front2.classList.add('match');
    }, 50);
    
    matchesFound++;
    resetTurn();
    if (matchesFound === symbols.length) {
      endGame();
    }
  } else {
    notMatchSound.play();
    setTimeout(() => {
      if (firstCard) {
        firstCard.querySelector('.card-inner').classList.remove('flip');
      }
      if (secondCard) {
        secondCard.querySelector('.card-inner').classList.remove('flip');
      }
      resetTurn();
    }, 1000);
  }
}
    
    // Reseta a seleção das cartas
    function resetTurn() {
      [firstCard, secondCard] = [null, null];
      boardLocked = false;
    }
    
    // Finaliza o jogo e exibe o overlay de vitória
    function endGame() {
      clearInterval(timerInterval);
      setTimeout(() => {
        finalTimeEl.textContent = timerEl.textContent;
        finalMovesEl.textContent = moves;
        victoryOverlay.classList.add('visible');
        winSound.play();
        gameStarted = false;
      }, 500);
    }
    
    // Esconde o overlay de vitória (para iniciar um novo jogo)
    function hideVictoryOverlay() {
      victoryOverlay.classList.remove('visible');
    }
    
    // Função para iniciar o jogo (após o countdown)
    function initGame() {
  gameStarted = true;
  createBoard();
  mainTitle.classList.add('top');
  
  // Exibe o título do jogo
  const gameTitle = document.getElementById('game-title');
  if (gameTitle) {
    gameTitle.classList.add('visible');
  }
}

    
    /* ------------------- CONTROLE DA TELA INICIAL E DO COUNTDOWN ------------------- */
    
    function startCountdown() {
      let count = 3;
      countdownTimerEl.textContent = count;
      countdownOverlay.style.display = 'flex';
      
      const countdownInterval = setInterval(() => {
        count--;
        countdownTimerEl.textContent = count;
        if (count === 0) {
          clearInterval(countdownInterval);
          countdownOverlay.style.display = 'none';
          // Inicia o jogo após o countdown
          initGame();
        }
      }, 1000);
    }
    
    // Inicia o jogo: oculta a tela inicial, exibe o countdown e o container do jogo
    function startGame() {
      initialScreen.style.display = 'none';
      gameContainer.style.display = 'block';
      startCountdown();
    }
    
    // Reinicia o jogo
    function resetGame() {
      createBoard();
    }
    
    // Fecha o jogo e retorna à tela inicial
    function closeGame() {
      // Para o cronômetro e oculta o container de jogo
      clearInterval(timerInterval);
      gameContainer.style.display = 'none';
      // Remove a classe que posiciona o título no topo
      mainTitle.classList.remove('top');
      // Exibe novamente a tela inicial
      initialScreen.style.display = 'flex';
    }
    
    // Reinicia o jogo após vitória
    playAgainBtn.addEventListener('click', () => {
      victoryOverlay.classList.remove('visible');
      startGame();
    });
    
    // Eventos dos botões
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    closeBtn.addEventListener('click', closeGame);
    
    // Inicializa a visualização: Esconde o container de jogo e o overlay de countdown
    function initializeApp() {
      gameContainer.style.display = 'none';
      countdownOverlay.style.display = 'none';
    }
    
    window.onload = initializeApp;