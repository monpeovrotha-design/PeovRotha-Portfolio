const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        if (name && email && message) {
            console.log('Form Data:', { name, email, message });
            const successMessage = document.createElement('div');
            successMessage.textContent = '✓ Message sent successfully!';
            successMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 1rem 2rem;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(successMessage);
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
            this.reset();
        }
    });
}
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .stat').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});g
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in';
document.querySelectorAll('.project-link').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const productId = btn.dataset.product;
        if (action === 'snake') {
            startSnakeGame();
        } else if (productId) {
            window.location.href = `store.html?product=${encodeURIComponent(productId)}`;
        } else {
            window.location.href = 'store.html';
        }
    });
});
let _snakeInterval = null;
let _snakeState = null;

function startSnakeGame() {
    if (document.querySelector('.game-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
        <div class="game-container" role="dialog" aria-label="Snake game">
            <canvas class="snake-canvas" id="snakeCanvas" width="480" height="480"></canvas>
            <aside class="game-sidebar">
                <div class="game-info">
                    <h3>Snake</h3>
                    <p>Use arrow keys or WASD to move. Press <strong>Esc</strong> to quit.</p>
                    <p class="score">Score: <span id="snakeScore">0</span> pts</p>
                    <p class="apples">Apples: <span id="snakeApples">0</span></p>
                    <p class="speed">Speed Level: <span id="snakeSpeed">1</span></p>
                </div>
                <div class="game-controls">
                    <button class="pause-game">Pause</button>
                    <button class="close-game">Close</button>
                </div>
            </aside>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('snakeScore');
    const applesEl = document.getElementById('snakeApples');
    const speedEl = document.getElementById('snakeSpeed');
    const pauseBtn = overlay.querySelector('.pause-game');
    const closeBtn = overlay.querySelector('.close-game');
    const grid = 20;
    const cols = Math.floor(canvas.width / grid);
    const rows = Math.floor(canvas.height / grid);
    
    _snakeState = {
        dir: { x: 1, y: 0 },
        snake: [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }],
        food: null,
        applesEaten: 0,
        score: 0,
        running: true,
        paused: false,
        speed: 1,
        baseSpeed: 200
    };
    
    function placeFood() {
        let x, y, ok;
        do {
            x = Math.floor(Math.random() * cols);
            y = Math.floor(Math.random() * rows);
            ok = !_snakeState.snake.some(s => s.x === x && s.y === y);
        } while (!ok);
        _snakeState.food = { x, y };
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const darkGreen = '#22410dff';
        const lightGreen = '#4a7c2c';
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? darkGreen : lightGreen;
                ctx.fillRect(i * grid, j * grid, grid, grid);
            }
        }
        

        if (_snakeState.food) {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(_snakeState.food.x * grid, _snakeState.food.y * grid, grid, grid);
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(_snakeState.food.x * grid + 2, _snakeState.food.y * grid + 2, grid - 4, grid - 4);
        }
        
        _snakeState.snake.forEach((s, index) => {
            if (index === 0) {
                ctx.fillStyle = '#000000';
                ctx.fillRect(s.x * grid, s.y * grid, grid, grid);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(s.x * grid, s.y * grid, grid, grid);
            } else {
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(s.x * grid, s.y * grid, grid, grid);
            }
        });
    }
    
    function step() {
        if (!_snakeState.running || _snakeState.paused) return;
        const head = { ..._snakeState.snake[0] };
        head.x += _snakeState.dir.x;
        head.y += _snakeState.dir.y;
        if (head.x < 0) head.x = cols - 1;
        if (head.x >= cols) head.x = 0;
        if (head.y < 0) head.y = rows - 1;
        if (head.y >= rows) head.y = 0;
        if (_snakeState.snake.some(s => s.x === head.x && s.y === head.y)) {
            endGame();
            return;
        }
        
        _snakeState.snake.unshift(head);
        
        if (_snakeState.food && head.x === _snakeState.food.x && head.y === _snakeState.food.y) {
            _snakeState.applesEaten += 1;
            _snakeState.score += 5;
            applesEl.textContent = _snakeState.applesEaten;
            scoreEl.textContent = _snakeState.score;
            const newSpeed = Math.floor(_snakeState.applesEaten / 3) + 1;
            if (newSpeed !== _snakeState.speed) {
                _snakeState.speed = newSpeed;
                speedEl.textContent = _snakeState.speed;
                gameLoop();
            }
            placeFood();
        } else {
            _snakeState.snake.pop();
        }
        draw();
    }
    function gameLoop() {
        clearInterval(_snakeInterval);
        const interval = Math.max(50, _snakeState.baseSpeed - (_snakeState.speed - 1) * 30);
        _snakeInterval = setInterval(step, interval);
    }
    
    function endGame() {
        _snakeState.running = false;
        clearInterval(_snakeInterval);
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.className = 'game-over-screen';
        gameOverOverlay.innerHTML = `
            <div class="game-over-content">
                <h2>GAME OVER</h2>
                <div class="game-over-stats">
                    <div class="stat-row">
                        <span class="stat-label">Final Score:</span>
                        <span class="stat-value">${_snakeState.score} pts</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Apples Eaten:</span>
                        <span class="stat-value">${_snakeState.applesEaten}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Speed Level:</span>
                        <span class="stat-value">${_snakeState.speed}</span>
                    </div>
                </div>
                <button class="restart-btn">Play Again</button>
            </div>
        `;
        
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(gameOverOverlay);
        gameOverOverlay.querySelector('.restart-btn').addEventListener('click', () => {
            closeGame();
            startSnakeGame();
        });
    }
    
    function closeGame() {
        clearInterval(_snakeInterval);
        window.removeEventListener('keydown', keyHandler);
        const ov = document.querySelector('.game-overlay');
        if (ov) ov.remove();
        _snakeState = null;
    }
    
    function keyHandler(e) {
        if (!_snakeState || !_snakeState.running) return;
        const k = e.key;
        if (k === 'Escape') return closeGame();
        if (k === 'p') {
            _snakeState.paused = !_snakeState.paused;
            pauseBtn.textContent = _snakeState.paused ? 'Resume' : 'Pause';
            return;
        }
        
        let nx = _snakeState.dir.x;
        let ny = _snakeState.dir.y;
        if (k === 'ArrowUp' || k === 'w') { nx = 0; ny = -1; }
        if (k === 'ArrowDown' || k === 's') { nx = 0; ny = 1; }
        if (k === 'ArrowLeft' || k === 'a') { nx = -1; ny = 0; }
        if (k === 'ArrowRight' || k === 'd') { nx = 1; ny = 0; }
        if (nx === -_snakeState.dir.x && ny === -_snakeState.dir.y) return;
        _snakeState.dir = { x: nx, y: ny };
    }
    
    placeFood();
    draw();
    gameLoop();
    window.addEventListener('keydown', keyHandler);
    pauseBtn.addEventListener('click', () => {
        _snakeState.paused = !_snakeState.paused;
        pauseBtn.textContent = _snakeState.paused ? 'Resume' : 'Pause';
    });
    closeBtn.addEventListener('click', closeGame);
}
