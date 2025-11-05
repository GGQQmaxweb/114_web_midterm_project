document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const scoreDisplay = document.getElementById('score');
    const scoreSumitForm = document.getElementById('scoreSumitForm')
    const grid = 20;
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
    const imageOverlay = document.getElementById('imageOverlay');

    let count = 0;
    let snake = [{x: 120, y: 220}, {x: 100, y: 220}, {x: 80, y: 220}];
    let dx = grid;
    let dy = 0;
    let food = {x: 0, y: 0};
    let running = false; 
    let waitingForKey = false;
    let isInputLocked = false;

    function getRandomFood() {
        food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
        food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
    }
    function getFirstFood() {
        food.x = 260;
        food.y = 220;
    }

    getFirstFood();
    
    function gameLoop() {

        if (waitingForKey) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'red';
            ctx.fillRect(food.x, food.y, grid, grid);
            ctx.fillStyle = 'lime';
            for (let part of snake) {
                ctx.fillRect(part.x, part.y, grid, grid);
            }
            requestAnimationFrame(gameLoop);
            return;
        }

        if (!running) return;
        requestAnimationFrame(gameLoop);
        scoreDisplay.textContent = `分數: ${snake.length - 3}`;
        if (++count < 20) return;
        count = 0;
        isInputLocked = false;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let head = {x: snake[0].x + dx, y: snake[0].y + dy};

        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameEnd();
            return;
        }

        for (let part of snake) {
            if (head.x === part.x && head.y === part.y) {
                gameEnd();
                return;
            }
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            getRandomFood();
        } else {
            snake.pop();
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, grid, grid);

        ctx.fillStyle = 'lime';
        for (let part of snake) {
            ctx.fillRect(part.x, part.y, grid, grid);
        }
    }

    document.addEventListener('keydown', function(e) {
        if (!running) return; 
        if (e.key === 'ArrowUp' && dy === 0) {isInputLocked = true; dx = 0; dy = -grid; }
        else if (e.key === 'ArrowDown' && dy === 0) {isInputLocked = true; dx = 0; dy = grid; }
        else if (e.key === 'ArrowLeft' && dx === 0) {isInputLocked = true; dx = -grid; dy = 0; }
        else if (e.key === 'ArrowRight' && dx === 0) {isInputLocked = true; dx = grid; dy = 0; }
        else if (e.key.toLowerCase() === 'w' && dy === 0) {isInputLocked = true; dx = 0; dy = -grid; }
        else if (e.key.toLowerCase() === 's' && dy === 0) {isInputLocked = true; dx = 0; dy = grid; }
        else if (e.key.toLowerCase() === 'a' && dx === 0) {isInputLocked = true; dx = -grid; dy = 0; }
        else if (e.key.toLowerCase() === 'd' && dx === 0) {isInputLocked = true; dx = grid; dy = 0; }
    });

    startBtn.addEventListener('click', () => {
        canvas.style.display = 'block';
        startBtn.style.display = 'none';
        imageOverlay.style.opacity = '.8';
        waitingForKey = true;
        requestAnimationFrame(gameLoop);
    scoreDisplay.textContent = "請按方向鍵或 WASD 開始遊戲";

    function startOnKey(e) {
        if (validKeys.includes(e.key)) {
            waitingForKey = false;
            running = true;
            imageOverlay.style.opacity = '0';
            scoreDisplay.textContent = `分數: 0`;
            requestAnimationFrame(gameLoop);
            document.removeEventListener('keydown', startOnKey);
        }
    }
    //     waitingForKey = true;

    //    running = true;
    //    requestAnimationFrame(gameLoop);
        // running = true;  
        // requestAnimationFrame(gameLoop);
         document.addEventListener('keydown', startOnKey);
    });


    function gameEnd() {
    alert('遊戲結束！你的分數是: ' + (snake.length - 3));
    //window.location.reload();
    running = false;
    canvas.style.display = 'none';
    
    scoreSumitForm.style.display = 'block';
}
});



