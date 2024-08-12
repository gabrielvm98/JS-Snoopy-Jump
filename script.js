//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//player
let playerWidth = 46;
let playerHeight = 46;
let playerX = boardWidth/2 - playerWidth/2;
let playerY = boardHeight*7/8 - playerHeight;
let playerRightImg;
let playerLeftImg;

let player = {
    img : null,
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}

//physics
let velocityX = 0; 
let velocityY = -8;
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;



window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    
    playerRightImg = new Image();
    playerRightImg.src = "./snoopy-R.png";    
    playerLeftImg = new Image();
    playerLeftImg.src = "./snoopy-L.png";    

    player.img = playerRightImg;    

    playerRightImg.onload = function() {
        context.drawImage(player.img, player.x, player.y, player.width, player.height);
    }
    

    platformImg = new Image();
    platformImg.src = "./platform.png";


    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("touchstart", movePlayerTouch);
}



function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, boardHeight);



    player.x += velocityX;   
    if(player.x > boardWidth) {
        player.x = 0
    }
    else if(player.x + player.width < 0){
        player.x = boardWidth
    }
    player.y += velocityY;
    velocityY += gravity;
    if(player.y > board.height){
        gameOver = true;
    };
    context.drawImage(player.img, player.x, player.y, player.width, player.height);



    for (let index = 0; index < platformArray.length; index++) {
        let platform = platformArray[index];

        if (velocityY < 0 && player.y < boardHeight*11/16) {
            platform.y += 4; //slide platform down
        }

        if (detectCollision(player, platform) && velocityY >= 0.4 && player.y >= 75){
            if(platform.type == 0) {
                velocityY = -8;
            }
            if(platform.type == 1) {
                //velocityY = -16;
            }
            if(platform.type == 2) {
                gameOver = true;
            }
        }

        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
        if (platform.type == 2) {
            // Cambia la operación de composición para el filtro rojo
            context.globalCompositeOperation = 'source-atop';
        
            // Dibuja un rectángulo rojo semitransparente sobre la imagen
            context.fillStyle = 'rgba(255, 0, 0, 0.5)';
            context.fillRect(platform.x, platform.y, platform.width, platform.height);
        
            // Restablece la operación de composición a la predeterminada
            context.globalCompositeOperation = 'source-over';
        }        
    }

    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        if(platformArray[0].type == 0){
            newPlatform(); 
        }        
        platformArray.shift(); //removes first element from the array        
    }


    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Game Over", boardWidth*2.5/7, boardHeight*13/16);
        context.fillText("Press 'Space' or Refresh to Restart", boardWidth/7, boardHeight*7/8);
    }
}



function movePlayer(e) {
    if(e.code == "ArrowRight" || e.code == "KeyD"){
        velocityX = 4;
        player.img = playerRightImg;
    }
    else if(e.code == "ArrowLeft" || e.code == "KeyA"){
        velocityX = -4;
        player.img = playerLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        player = {
            img : playerRightImg,
            x : playerX,
            y : playerY,
            width : playerWidth,
            height : playerHeight
        }
        velocityX = 0;
        velocityY = -8;

        score = 0;
        maxScore = 0;
        gameOver = false;

        placePlatforms();
    }
}
function movePlayerTouch(e) {
    console.log("Touch start detected");
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    if (touch.clientX > screenWidth / 2) {
        velocityX = 4;
        player.img = playerRightImg;
    } else {
        velocityX = -4;
        player.img = playerLeftImg;
    }
}

function placePlatforms() {
    platformArray = [];

    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight,
        type : 0
    }
    platformArray.push(platform);    

    for (let index = 0; index < 6; index++) {
        let randomX = Math.floor(Math.random() * boardWidth * 3/4);

        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*index - 150,
            width : platformWidth,
            height : platformHeight,
            type : 0
        }    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3/4);

    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight,
        type : 0
    }    
    platformArray.push(platform);

    let chance = Math.random()
    if(chance<=0.20){
        randomX = Math.floor(Math.random() * boardWidth * 3/4);
        let platformX = {
            img : platformImg,
            x : randomX,
            y : -platformHeight - 36,
            width : platformWidth,
            height : platformHeight,
            type : 2
        }    
        platformArray.push(platformX);
    }
}

function detectCollision(a ,b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = 10*Math.floor(5*Math.random()); 
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}