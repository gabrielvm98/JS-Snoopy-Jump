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
    context.drawImage(player.img, player.x, player.y, player.width, player.height);



    for (let index = 0; index < platformArray.length; index++) {
        let platform = platformArray[index];

        if (detectCollision(player, platform)){
            velocityY = -8;
        }

        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);        
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

    platform = {
        img : platformImg,
        x : boardWidth/4,
        y : boardHeight - 150,
        width : platformWidth,
        height : platformHeight,
        type : 0
    }
    platformArray.push(platform);
}

function detectCollision(a ,b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y &&  //a's bottom left corner passes b's top left corner
           velocityY >= 0;
}