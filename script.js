document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const scoreDisplay = document.getElementById('score');
    const scoreSumitForm = document.getElementById('scoreSumitForm')
    const grid = 20;
    let count = 0;
    let snake = [{x: 160, y: 160}];
    let dx = grid;
    let dy = 0;
    let food = {x: 0, y: 0};
    let running = false; 

    function getRandomFood() {
        food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
        food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
    }


    getRandomFood();

    function gameLoop() {
        if (!running) return;
        requestAnimationFrame(gameLoop);
        scoreDisplay.textContent = `分數: ${snake.length - 1}`;
        if (++count < 10) return;
        count = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let head = {x: snake[0].x + dx, y: snake[0].y + dy};

        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameEnd();
        }

        for (let part of snake) {
            if (head.x === part.x && head.y === part.y) {
                gameEnd();
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
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
        else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
        else if (e.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
        else if (e.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
    });

    startBtn.addEventListener('click', () => {
        canvas.style.display = 'block';
        startBtn.style.display = 'none';
        running = true;  
        requestAnimationFrame(gameLoop);
    });
    function gameEnd() {
    alert('遊戲結束！你的分數是: ' + (snake.length - 1));
    //window.location.reload();
    running = false;
    canvas.style.display = 'none';
    
    scoreSumitForm.style.display = 'block';
}
});



