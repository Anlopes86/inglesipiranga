// Sistema de Quiz Interativo
class Quiz {
    constructor(questions, containerId) {
        this.questions = questions;
        this.currentQuestion = 0;
        this.score = 0;
        this.container = document.getElementById(containerId);
        this.userAnswers = [];
        this.init();
    }

    init() {
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const isLastQuestion = this.currentQuestion === this.questions.length - 1;
        
        this.container.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${((this.currentQuestion + 1) / this.questions.length) * 100}%"></div>
                    </div>
                    <p class="question-counter">Pergunta ${this.currentQuestion + 1} de ${this.questions.length}</p>
                </div>
                
                <div class="question-card">
                    <h2 class="question-text">${question.question}</h2>
                    
                    <div class="options-container">
                        ${question.options.map((option, index) => `
                            <button class="option-btn" onclick="quiz.selectAnswer(${index})" data-index="${index}">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">${option}</span>
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="quiz-actions">
                        <button id="nextBtn" class="next-btn" onclick="quiz.nextQuestion()" disabled>
                            ${isLastQuestion ? 'Finalizar Quiz' : 'Próxima Pergunta'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    selectAnswer(selectedIndex) {
        // Remove seleção anterior
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        const selectedBtn = document.querySelector(`[data-index="${selectedIndex}"]`);
        selectedBtn.classList.add('selected');
        
        // Armazena resposta
        this.userAnswers[this.currentQuestion] = selectedIndex;
        
        // Habilita botão próximo
        document.getElementById('nextBtn').disabled = false;
    }

    nextQuestion() {
        const question = this.questions[this.currentQuestion];
        const userAnswer = this.userAnswers[this.currentQuestion];
        
        // Verifica se está correto
        if (userAnswer === question.correct) {
            this.score++;
        }
        
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let message = '';
        let emoji = '';
        
        if (percentage >= 90) {
            message = 'Excelente! Você domina o conteúdo!';
            emoji = '🏆';
        } else if (percentage >= 70) {
            message = 'Muito bem! Bom desempenho!';
            emoji = '🎉';
        } else if (percentage >= 50) {
            message = 'Razoável. Continue estudando!';
            emoji = '📚';
        } else {
            message = 'Precisa estudar mais. Não desista!';
            emoji = '💪';
        }
        
        this.container.innerHTML = `
            <div class="results-container">
                <div class="results-card">
                    <div class="results-emoji">${emoji}</div>
                    <h2>Quiz Finalizado!</h2>
                    <div class="score-display">
                        <div class="score-number">${this.score}/${this.questions.length}</div>
                        <div class="score-percentage">${percentage}%</div>
                    </div>
                    <p class="results-message">${message}</p>
                    
                    <div class="results-actions">
                        <button class="restart-btn" onclick="quiz.restart()">Tentar Novamente</button>
                        <button class="review-btn" onclick="quiz.showReview()">Ver Respostas</button>
                    </div>
                </div>
            </div>
        `;
    }

    showReview() {
        let reviewHTML = `
            <div class="review-container">
                <h2>Revisão das Respostas</h2>
        `;
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            reviewHTML += `
                <div class="review-question ${isCorrect ? 'correct' : 'incorrect'}">
                    <h3>Pergunta ${index + 1}: ${question.question}</h3>
                    <p class="user-answer">Sua resposta: ${question.options[userAnswer]} ${isCorrect ? '✅' : '❌'}</p>
                    ${!isCorrect ? `<p class="correct-answer">Resposta correta: ${question.options[question.correct]} ✅</p>` : ''}
                    ${question.explanation ? `<p class="explanation"><strong>Explicação:</strong> ${question.explanation}</p>` : ''}
                </div>
            `;
        });
        
        reviewHTML += `
                <button class="restart-btn" onclick="quiz.restart()">Tentar Novamente</button>
            </div>
        `;
        
        this.container.innerHTML = reviewHTML;
    }

    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.showQuestion();
    }
}

// Jogo da Memória
class MemoryGame {
    constructor(cards, containerId) {
        this.cards = [...cards, ...cards]; // Duplica as cartas
        this.container = document.getElementById(containerId);
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.shuffle();
        this.init();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    init() {
        this.container.innerHTML = `
            <div class="memory-game">
                <div class="game-stats">
                    <div class="stat">
                        <span class="stat-label">Movimentos:</span>
                        <span id="moves">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Tempo:</span>
                        <span id="timer">00:00</span>
                    </div>
                </div>
                <div class="memory-grid">
                    ${this.cards.map((card, index) => `
                        <div class="memory-card" data-index="${index}" onclick="memoryGame.flipCard(${index})">
                            <div class="card-front">?</div>
                            <div class="card-back">${card}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60).toString().padStart(2, '0');
            const seconds = (this.timer % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    flipCard(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        
        if (card.classList.contains('flipped') || this.flippedCards.length === 2) {
            return;
        }
        
        card.classList.add('flipped');
        this.flippedCards.push(index);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('moves').textContent = this.moves;
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;
        const firstCard = document.querySelector(`[data-index="${first}"]`);
        const secondCard = document.querySelector(`[data-index="${second}"]`);
        
        if (this.cards[first] === this.cards[second]) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            this.matchedPairs++;
            
            if (this.matchedPairs === this.cards.length / 2) {
                this.gameComplete();
            }
        } else {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
        }
        
        this.flippedCards = [];
    }

    gameComplete() {
        clearInterval(this.timerInterval);
        setTimeout(() => {
            alert(`Parabéns! Você completou o jogo em ${this.moves} movimentos e ${Math.floor(this.timer / 60)}:${(this.timer % 60).toString().padStart(2, '0')}!`);
        }, 500);
    }
}

