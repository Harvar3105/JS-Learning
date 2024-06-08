export class Paddle {
    width = 200;
    height = 20;
    left;
    top;

    color;

    screenWidth = 1;
    screenHeigth = 1;

    #intervalId = null; //Time interval between steps
    moveStep = 5; //Default 30
    intervalSpeed = 1; //Time in ms. RefreshRate. Default 50

    constructor(left = this.screenWidth/2, top = this.screenHeigth/2, color = 'grey', width, height) {
        this.left = left;
        this.top = top;
        this.color = color;
        this.screenWidth = width;
        this.screenHeigth = height;
        
        console.log("Frame Width: " + this.screenWidth);
        console.log("Frame Heigth: " + this.screenHeigth);
    }

    validateAndFixPosition(borderThickness) {
        if (this.left < borderThickness) {
            this.left = borderThickness;
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }

        if ((this.left + this.width) > this.screenWidth - borderThickness) {
            this.left = (this.screenWidth - borderThickness) - (this.width);
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }

        // console.log(this.left);
    }

    startMove(step, borderThickness) {
        if (this.#intervalId !== null) return;

        this.#intervalId = setInterval(() => {
            this.left += step * this.moveStep;
            // 0 - border
            this.validateAndFixPosition(borderThickness);

        }, this.intervalSpeed);
    }

    stopMove(borderThickness) {
        if (!this.#intervalId) return;
        clearInterval(this.#intervalId);
        this.#intervalId = null;
        this.validateAndFixPosition(borderThickness);
    }
}

export class Brick {
    id;
    randomColor;
    setting;

    width;
    height;

    left;
    top;

    //FIXME: line 80, 81. Ignores banned colors
    constructor(id, width = 100, height = 25, setting = 'breakable'){
        this.id = id;
        this.width = width;
        this.height = height;

        this.setting = setting;

        var color = '#' + Math.floor(Math.random() *16777215).toString(16);
        if (color == '#897ac6') color = '#111';
        this.randomColor = color;

        //console.log(this.randomColor)
    }

    setPosition(left, top){
        this.left = left;
        this.top = top;
    }

    toString(){
        return "(" + this.id + ', ' + this.randomColor + ', ' + this.setting + ', ' + this.width + ', ' + this.height + ', ' + this.left + ', ' + this.top + ")";
    }
}

export class Ball {
    radius;
    moveStep = 1.5;

    directionX = getRandomArbitrary(-0.5, 0.5, 0.3); // Used to calculate start direction. Do not set close to 1
    directionY = -1 * Math.sqrt(this.moveStep * this.moveStep - this.directionX * this.directionX); //return from sqrt is always positive

    color;

    top;
    left;

    constructor(left = this.screenWidth/2, top = this.screenHeigth/2, color = 'grey', radius = 20){
        this.left = left;
        this.top = top;
        this.color = color;
        this.radius = radius;
    }

    bounceFromPaddle(angle){
        const directionChange = getRandomArbitrary(-angle, angle, 0);
        this.directionX += directionChange;
        if (this.directionX > -0.2 && this.directionX < 0.2) {
            if (this.directionX < 0) this.directionX = -0.25;
            else this.directionX = 0.25;
        }
        this.directionY = -1 * Math.sqrt(this.moveStep * this.moveStep - this.directionX * this.directionX);
    }
    
    move(){
        this.left += this.directionX * this.moveStep;
        this.top += this.directionY * this.moveStep;
    }
}

export default class Engine {
    width;
    height;
    borderThickness = 10;

    leftRightOffset = 70;
    topOffset = 50;
    sbbp = 60; //Space Between Bricks and Paddle. Goes from top to buttom. 100 default

    //Brick Fill Sides coordinates
    bfsTop;
    bfsBottom;
    bfsLeft;
    bfsRight;

    ball = null;
    paddle = null;
    paddleBounceAngle = 0.15;

    isPaused;
    gameState;
    gameLost = false;

    //sounds
    winningSound;
    loseSound;
    paddleImpact;
    brickDestroy;
    music;

    volume = 1;
    soundOnOff = true;

    constructor( width, height, state, paddleBounceAngle) {
        this.isPaused = false;
        this.gameState = state;

        this.width = width;
        this.height = height;

        this.paddle = new Paddle((width - 300) / 2, (height) * 4 / 5, 'green', width, height);
        this.paddleBounceAngle = paddleBounceAngle;

        this.bfsTop = this.topOffset;
        this.bfsLeft = this.leftRightOffset;
        this.bfsRight = width - this.leftRightOffset;
        this.bfsBottom = (height - 50) - this.sbbp - ((height - 50) * 1 / 5); //50 - Paddle size

        this.winningSound = new Audio('..\\resources\\winningSound.mp3');
        this.loseSound = new Audio('..\\resources\\loseSound.mp3');
        this.paddleImpact = new Audio('..\\resources\\paddleImpact.mp3');
        this.brickDestroy = new Audio('..\\resources\\brickDestroy.mp3');
        this.music = new Audio('..\\resources\\pixelgroove-77930.mp3');

        this.music.loop = true;

        this.gameState.startStopwatch();

        console.log("bfsBottom: " + this.bfsBottom);
    }

    prepareBricks(brickWidth, brickHeigth){
        //console.log('Caalled, engine');
        let amount = this.calculateAvailableAmount(brickWidth, brickHeigth);
        
        var counter = 0;
        while (counter < amount){
            this.gameState.bricks[counter] = new Brick(counter, brickWidth, brickHeigth);
            counter++;
        }
    
        let extraSpacing = ((this.bfsRight - this.bfsLeft) % brickWidth) / 2
    
        let X = 0;
        let Y = this.bfsTop;
    
        for (let brick of this.gameState.bricks){
            if (X + brickWidth + this.bfsLeft <= this.bfsRight) {
                brick.setPosition(X + this.bfsLeft + extraSpacing, Y);
                X += brickWidth;
            } else {
                Y += brickHeigth;
                X = 0;
                brick.setPosition(X + this.bfsLeft + extraSpacing, Y);
                X += brickWidth;
            }
        }
    
        console.log(this.gameState.bricks);
    
    }

    startMovePaddle(paddle, step) {
        paddle.startMove(step, this.borderThickness);
    }

    stopMovePaddle(paddle) {
        paddle.stopMove(this.borderThickness);
    }

    calculateAvailableAmount(brickWidth, brickHeigth){
        var boxWidth = this.width - this.leftRightOffset * 2
        var boxHeigth = this.bfsBottom - this.topOffset

        console.log("Available length: " + boxWidth);
        console.log("Available heigth: " + boxHeigth);

        var variableWidth = 0;
        var widthCounter = 0;
        var variableHeigth = 0;
        var heigthCounter = 0;
        while (variableWidth + brickWidth <= boxWidth){
            variableWidth += brickWidth;
            ++widthCounter;
        }

        while (variableHeigth + brickHeigth <= boxHeigth){
            variableHeigth += brickHeigth;
            ++heigthCounter;
        }

        return heigthCounter * widthCounter;
    }

    checkOverlaping(ball, obstacle){
        const ballRect = ball.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
    
        const ballCenterX = ballRect.left + ((ballRect.right - ballRect.left) / 2);
        const ballCenterY = ballRect.top + ((ballRect.bottom - ballRect.top) / 2);
    
        const vectorsProjection = this.ball.radius * Math.cos(Math.PI / 4);
        const ballVecRight = ballCenterX + vectorsProjection;
        const ballVecTop = ballCenterY - vectorsProjection;
        const ballVecLeft = ballCenterX - vectorsProjection;
        const ballVecBottom = ballCenterY + vectorsProjection;
    
        // console.log(ballCenterX);
        // console.log(ballCenterY);
        // a < b - a is higher than b
        let result;
        result = this.overlapingFromBelow(ballRect, obstacleRect, ballCenterX, obstacle);
        if (result) return true;
        result = this.overlapingFromRight(ballRect, obstacleRect, ballCenterY, obstacle);
        if (result) return true;
        result = this.overlapingFromTop(ballRect, obstacleRect, ballCenterX, obstacle);
        if (result) return true;
        result = this.overlapingFromLeft(ballRect, obstacleRect, ballCenterY, obstacle);
        if (result) return true;
        result = this.overlapingFromCorners(obstacleRect, ballCenterX, ballCenterY, ballVecBottom, ballVecRight, ballVecTop, ballVecLeft, obstacle);
        if (result) return true;
    
        return false;
    }
    
    overlapingFromBelow(ballRect, obstacleRect, ballCenterX, obstacle){
        if ((ballRect.top < obstacleRect.bottom) && (ballRect.bottom > obstacleRect.bottom) &&
            (ballCenterX > obstacleRect.left) && (ballCenterX < obstacleRect.right)) {
    
                if (obstacle.id.startsWith('brick-')){
                    //console.log(this.gameState.bricks[obstacle.id.replace('brick-', '')]);
                    //console.log(this.gameState.bricks[obstacle.id.replace('brick-', '')].setting);
                    //console.log(this.gameState.bricks[obstacle.id.replace('brick-', '')].setting === 'breakable');
                    if (this.gameState.bricks[obstacle.id.replace('brick-', '')].setting === 'breakable'){
                        delete this.gameState.bricks[obstacle.id.replace('brick-', '')];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                    this.ball.directionY *= -1;
                    return true;
                } else if (obstacle.id == 'bottom' || obstacle.id == 'paddle') {
                    this.gameLost = true;
                } else if (obstacle.id == 'top'){
                    this.ball.directionY *= -1;
                    return true;
                } else if (obstacle.id.startsWith('wall-')){
                    this.ball.directionX *= -1;
                    return true;
                }
        }
        return false;
    }
    
    overlapingFromRight(ballRect, obstacleRect, ballCenterY,obstacle){
        if ((ballCenterY < obstacleRect.bottom) && (ballCenterY > obstacleRect.top) &&
            (ballRect.left < obstacleRect.right) && (ballRect.right > obstacleRect.right)) {
    
                if (obstacle.id.startsWith('brick-')){
                    if (this.gameState.bricks[obstacle.id.replace('brick-', '')].setting === 'breakable'){
                        delete this.gameState.bricks[obstacle.id.replace('brick-', '')];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                    this.ball.directionX *= -1;
                    return true;
                } else if (obstacle.id == 'paddle'){
                    this.ball.bounceFromPaddle(this.paddleBounceAngle);
                    this.paddleImpact.play();
                    return true;
                } else if (obstacle.id == 'bottom') {
                    this.gameLost = true;
                } else if (obstacle.id == 'top'){
                    this.ball.directionY *= -1;
                    return true;
                } else if (obstacle.id.startsWith('wall-')){
                    this.ball.directionX *= -1;
                    return true;
                }
        }
        return false;
    }
    
    overlapingFromTop(ballRect, obstacleRect, ballCenterX, obstacle){
        if ((ballRect.bottom > obstacleRect.top) && (ballRect.top < obstacleRect.top) &&
            (ballCenterX > obstacleRect.left) && (ballCenterX < obstacleRect.right)) {
    
                if (obstacle.id.startsWith('brick-') ){
                    if (this.gameState.bricks[obstacle.id.replace('brick-', '')].setting === 'breakable'){
                        delete this.gameState.bricks[obstacle.id.replace('brick-', '')];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                    this.ball.directionY *= -1;
                    return true;
                } else if (obstacle.id == 'paddle'){
                    this.ball.bounceFromPaddle(this.paddleBounceAngle);
                    this.paddleImpact.play();
                    return true;
                } else if (obstacle.id == 'bottom') {
                    this.gameLost = true;
                } else if (obstacle.id == 'top'){
                    this.ball.directionY *= -1;
                    return true;
                } else if (obstacle.id.startsWith('wall-')){
                    this.ball.directionX *= -1;
                    return true;
                }
    
        }
        return false;
    }
    
    overlapingFromLeft(ballRect, obstacleRect, ballCenterY, obstacle){
        if ((ballRect.right > obstacleRect.left) && (ballRect.left < obstacleRect.left) && 
            (ballCenterY > obstacleRect.top) && (ballCenterY < obstacleRect.bottom)) {
    
                if (obstacle.id.startsWith('brick-') ){
                    if (this.gameState.bricks[obstacle.id.replace('brick-', '')].setting === 'breakable'){
                        delete this.gameState.bricks[obstacle.id.replace('brick-', '')];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                    this.ball.directionX *= -1;
                    return true;
                } else if (obstacle.id == 'paddle'){
                    this.ball.directionY *= -1;
                    this.ball.directionX *= -1;
                    this.paddleImpact.play();
                    return true;
                } else if (obstacle.id == 'bottom') {
                    this.gameLost = true;
                } else if (obstacle.id == 'top'){
                    this.ball.directionY *= -1;
                    return true;
                } else if (obstacle.id.startsWith('wall-')){
                    this.ball.directionX *= -1;
                    return true;
                }
    
        }
        return false;
    }
    
    overlapingFromCorners(obstacleRect, ballCenterX, ballCenterY, ballVecBottom, ballVecRight, ballVecTop, ballVecLeft, obstacle){
        if (((ballVecRight > obstacleRect.left) && (ballCenterX < obstacleRect.left) && 
            (ballVecBottom > obstacleRect.top) && (ballCenterY < obstacleRect.top))
            ||
            ((ballVecRight > obstacleRect.left) && (ballCenterX < obstacleRect.left) && 
            (ballVecTop < obstacleRect.bottom) && (ballCenterY > obstacleRect.bottom))
            ||
            ((ballVecLeft < obstacleRect.right) && (ballCenterX > obstacleRect.right) && 
            (ballVecTop < obstacleRect.bottom) && (ballCenterY > obstacleRect.bottom))
            ||
            ((ballVecLeft < obstacleRect.right) && (ballCenterX > obstacleRect.right) && 
            (ballVecBottom > obstacleRect.top) && (ballCenterY < obstacleRect.top))){
    
                if (obstacle.id.startsWith('brick-') ){
                    if (this.gameState.bricks[obstacle.id.replace('brick-', '')].setting === 'breakable'){
                        delete this.gameState.bricks[obstacle.id.replace('brick-', '')];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                } else if (obstacle.id == 'bottom') {
                    this.gameLost = true;
                }
                this.ball.directionX *= -1;
                this.ball.directionY *= -1;
                this.paddleImpact.play();
                return true;
        }
        return false;
    }

    checkWinningState(){
        //console.log(this.gameState.bricks);
        if (this.gameState.bricks.filter(item => item != null && item.setting != "unbreakable").length == 0) {
            this.winningSound.play();
            return true;
        }
        else if (this.gameLost){
            this.loseSound.play();
            return false;
        }
        else return;
    }

    playMusic(onOff){
        if (onOff){
            if (this.music.paused || this.music.ended) this.music.play();
        } else {
            if (this.music.paused || this.music.ended) return;
            this.music.pause();
        }
    }

    toggleSound(){
        if (this.soundOnOff) {
            this.winningSound.muted = true;
            this.loseSound.muted = true;
            this.paddleImpact.muted = true;
            this.brickDestroy.muted = true;
            this.music.muted = true;
            this.soundOnOff = false;
        } else {
            this.winningSound.muted = false;
            this.loseSound.muted = false;
            this.paddleImpact.muted = false;
            this.brickDestroy.muted = false;
            this.music.muted = false;
        }
    }

    changeVolume(amount){
        if (this.volume + amount < 0) this.volume = 0;
        else if (this.volume + amount > 1) this.volume = 1;
        else this.volume += amount;
        this.winningSound.volume = this.volume;
        this.loseSound.volume = this.volume;
        this.paddleImpact.volume = this.volume;
        this.brickDestroy.volume = this.volume;
        this.music.volume = this.volume;
    }
}

function getRandomArbitrary(min, max, limits) {
    let res = Math.random() * (max - min) + min;
    while(res > -limits && res < limits){
        res = Math.random() * (max - min) + min;
    }
    return res;
  }
  

