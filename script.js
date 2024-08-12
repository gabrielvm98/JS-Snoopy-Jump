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
let velocityY = 0;
let initialVelocityY = -8; 
let gravity = 0.4;



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
    

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("touchstart", movePlayerTouch);
}



function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, boardHeight);



    player.x += velocityX;    
    context.drawImage(player.img, player.x, player.y, player.width, player.height);
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

}

function movePlayerTouch(e) {
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