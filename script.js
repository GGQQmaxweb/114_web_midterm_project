document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const scoreDisplay = document.getElementById('score');
    const scoreSumitForm = document.getElementById('scoreSumitForm')
    const grid = 20;
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
    const imageOverlay = document.getElementById('imageOverlay');
    const nameInput = document.getElementById('name'); 
    const emailInput = document.getElementById('email'); 
    const settingsMenu = document.getElementById('settingsMenu');
    const colorThemePicker = document.getElementById('colorThemePicker');
    let count = 0;
    let snake = [{x: 120, y: 220}, {x: 100, y: 220}, {x: 80, y: 220}];
    let dx = grid;
    let dy = 0;
    let inputQueue = [];
    let food = {x: 0, y: 0};
    let running = false; 
    let waitingForKey = false;

function loadLastInput() {
    const savedName = localStorage.getItem('playerName');
    const savedEmail = localStorage.getItem('playerEmail');

    if (savedName) {
        nameInput.value = savedName;
    }
    if (savedEmail) {
        emailInput.value = savedEmail;
    }
}
scoreSumitForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const playerName = nameInput.value;
    const playerEmail = emailInput.value;


    localStorage.setItem('playerName', playerName);
    localStorage.setItem('playerEmail', playerEmail);

    alert(`分數已記錄！\n姓名: ${playerName}\nEmail: ${playerEmail}`);

});

    function getRandomFood() {
        let onSnake;
        do {
            food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
            food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
            onSnake = snake.some(part => part.x === food.x && part.y === food.y);
        } while (onSnake);
    }
    function getFirstFood() {
        food.x = 260;
        food.y = 220;
    }
    function gameLoop() {

        if (waitingForKey) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = fruitColor;
            ctx.fillRect(food.x, food.y, grid, grid);
            ctx.fillStyle = snakeColor;
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
       if (inputQueue.length > 0) {

 let nextMove = inputQueue.shift(); 


if ((nextMove.dx !== 0 && dx !== -nextMove.dx) || 
 (nextMove.dy !== 0 && dy !== -nextMove.dy)) 
            {
dx = nextMove.dx;
dy = nextMove.dy;
 }
}
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

        ctx.fillStyle = fruitColor;
        ctx.fillRect(food.x, food.y, grid, grid);

        ctx.fillStyle = snakeColor;
        for (let part of snake) {
            ctx.fillRect(part.x, part.y, grid, grid);
        }
    }
    getFirstFood();
    


    document.addEventListener('keydown', function(e) {
        if (!running) return; 
        let lastDx = (inputQueue.length > 0) ? inputQueue[inputQueue.length - 1].dx : dx;
        let lastDy = (inputQueue.length > 0) ? inputQueue[inputQueue.length - 1].dy : dy;

if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && lastDy === 0) {
            inputQueue.push({ dx: 0, dy: -grid });
 }
 else if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && lastDy === 0) {
 inputQueue.push({ dx: 0, dy: grid });
 }
else if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && lastDx === 0) {
inputQueue.push({ dx: -grid, dy: 0 });
 }
else if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && lastDx === 0) {
 inputQueue.push({ dx: grid, dy: 0 });
 }
  

    });
    function loadLastTheme() {
        const savedTheme = localStorage.getItem('selectedThemeValue');
        if (savedTheme) {
            colorThemePicker.value = savedTheme;
        }
    }  
    startBtn.addEventListener('click', () => {
      
    const selectedTheme = colorThemePicker.value; 
        localStorage.setItem('selectedThemeValue', selectedTheme);
        
        const colors = selectedTheme.split(',');
        
        snakeColor = colors[0];
        fruitColor = colors[1];
        
        settingsMenu.style.display = 'none';
        startBtn.style.display = 'none';
        
        canvas.style.display = 'block';
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

         document.addEventListener('keydown', startOnKey);
    });


    function gameEnd() {
    alert('遊戲結束！你的分數是: ' + (snake.length - 3));

    running = false;
 
    canvas.style.display = 'none';
    scoreSumitForm.style.display = 'block';
}
    loadLastInput();
    loadLastTheme();
});



