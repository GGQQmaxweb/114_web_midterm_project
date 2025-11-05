document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const scoreDisplay = document.getElementById('score');
    const scoreSumitForm = document.getElementById('scoreSumitForm')
    const grid = 20;
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
    const imageOverlay = document.getElementById('imageOverlay');
    const scoresound  = new Audio('audio/scoresound.mp3');
    scoresound.volume = 0.3;
    const BGM = new Audio('audio/沙威瑪.mp3');
    const gameoverSound =  new Audio('audio/gameover.mp3');
    BGM.volume = 0.1;
    gameoverSound.volume = .3
    
    const snakeBodyImg = new Image();
    snakeBodyImg.src = 'image/snake/body/body.png'; 
    const FoodImg = new Image();
    FoodImg.src = 'image/food/Food.png'; 
    const snakeheadImg = new Image();
    snakeheadImg.src = 'image/snake/head/head.png'; 

    const pageBackground = document.querySelector('.page-background');

    const BGM_LOOP_START_TIME = 3.3; 
    const BGM_LOOP_END_TIME = 76;
    BGM.addEventListener('timeupdate', function() {

        if (this.currentTime >= BGM_LOOP_END_TIME) {
            this.currentTime = BGM_LOOP_START_TIME;
        }
    });
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
        food.x = 300;
        food.y = 220;
    }

    getFirstFood();
    
    function gameLoop() {

        if (waitingForKey) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.fillStyle = 'red';
            ctx.drawImage(FoodImg,food.x, food.y, grid, grid);
           // ctx.drawImage(snakeHeadImg, snake[0].x, snake[0].y, grid, grid);
            // ctx.fillRectfood.x, food.y, grid, grid);
            // ctx.fillStyle = 'lime';
            ctx.drawImage(snakeheadImg, snake[0].x, snake[0].y, grid, grid);

        // 2. 迴圈只畫身體 (從索引 1 開始)
        for (let i = 1; i < snake.length; i++) {
            ctx.drawImage(snakeBodyImg, snake[i].x, snake[i].y, grid, grid);
        }
            requestAnimationFrame(gameLoop);
            return;
        }

        if (!running) return;
        requestAnimationFrame(gameLoop);
        scoreDisplay.textContent = `分數: ${snake.length - 3}`;
        if (++count < 35) return;
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
            scoresound.currentTime = 0;
            scoresound.play();
            getRandomFood();
        } else {
            snake.pop();
        }

        // ctx.fillStyle = 'red';
        ctx.drawImage(FoodImg,food.x, food.y, grid, grid);

        ctx.drawImage(snakeheadImg, snake[0].x, snake[0].y, grid, grid);

        // 2. 迴圈只畫身體 (從索引 1 開始)
        for (let i = 1; i < snake.length; i++) {
            ctx.drawImage(snakeBodyImg, snake[i].x, snake[i].y, grid, grid);
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
        pageBackground.style.opacity = '1';
        startBtn.style.display = 'none';
        pageBackground.style.opacity = '1';
        imageOverlay.style.opacity = '.8';

        waitingForKey = true;
        requestAnimationFrame(gameLoop);
    scoreDisplay.textContent = "請按方向鍵或 WASD 開始遊戲";

    function startOnKey(e) {
        if (validKeys.includes(e.key.toLowerCase())) {
            waitingForKey = false;
            running = true;
            BGM.play();
            pageBackground.style.animation = 'pulseScale 2s infinite ease-in-out';
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
        scoresound.pause();
        scoresound.currentTime = 0;
        BGM.pause();
        BGM.currentTime = 0;
        pageBackground.style.opacity = '0';
        gameoverSound.play();
        gameoverSound.currentTime = 0;
    alert('遊戲結束！你的分數是: ' + (snake.length - 3));
    //window.location.reload();
    running = false;
    canvas.style.display = 'none';
    
    scoreSumitForm.style.display = 'block';
}
});



