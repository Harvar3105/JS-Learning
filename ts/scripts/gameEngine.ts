import GameState from "./gameState";


export class Paddle {
    public readonly width: number = 200;
    public readonly height: number = 20;
    public left: number;
    public top: number;

    public color: string;

    private screenWidth: number = 1;
    private screenHeigth: number = 1;

    private intervalId: number | undefined; //Time interval between steps
    private moveStep: number = 5; //Default 30
    private intervalSpeed: number = 1; //Time in ms. RefreshRate. Default 50

    constructor(left = 0.5, top = 0.5, color = 'grey', width: number, height: number) {
        this.left = left;
        this.top = top;
        this.color = color;
        this.screenWidth = width;
        this.screenHeigth = height;
        
        console.log("Frame Width: " + this.screenWidth);
        console.log("Frame Heigth: " + this.screenHeigth);
    }

    validateAndFixPosition(borderThickness: number): void {
        if (this.left < borderThickness) {
            this.left = borderThickness;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        if ((this.left + this.width) > this.screenWidth - borderThickness) {
            this.left = (this.screenWidth - borderThickness) - (this.width);
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        // console.log(this.left);
    }

    startMove(step: number, borderThickness: number): void {
        if (this.intervalId != null) return;

        this.intervalId = setInterval(() => {
            this.left += step * this.moveStep;
            // 0 - border
            this.validateAndFixPosition(borderThickness);

        }, this.intervalSpeed);
    }

    stopMove(borderThickness: number): void {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.validateAndFixPosition(borderThickness);
    }
}

export class Brick {
    id: string;
    randomColor: string;
    setting: string;

    width: number;
    height: number;

    left: number = 0;
    top: number = 0;

    //FIXME: line 80, 81. Ignores banned colors
    constructor(id: string | number, width = 100, height = 25, setting = 'breakable'){
        this.id = id.toString();
        this.width = width;
        this.height = height;

        this.setting = setting;

        var color = '#' + Math.floor(Math.random() *16777215).toString(16);
        if (color == '#897ac6') color = '#111';
        this.randomColor = color;

        //console.log(this.randomColor)
    }

    setPosition(left: number, top: number): void{
        this.left = left;
        this.top = top;
    }

    toString() : string{
        return "(" + this.id + ', ' + this.randomColor + ', ' + this.setting + ', ' + this.width + ', ' + this.height + ', ' + this.left + ', ' + this.top + ")";
    }
}

export class Ball {
    public radius: number;
    private moveStep: number = 1.5;

    public directionX: number = getRandomArbitrary(-0.5, 0.5, 0.3); // Used to calculate start direction. Do not set close to 1
    public directionY: number = -1 * Math.sqrt(this.moveStep * this.moveStep - this.directionX * this.directionX); //return from sqrt is always positive

    public color: string;

    public top: number;
    public left: number;

    constructor(left: number, top: number, color: string = 'grey', radius: number = 20){
        this.left = left;
        this.top = top;
        this.color = color;
        this.radius = radius;
    }

    bounceFromPaddle(angle: number): void{
        const directionChange = getRandomArbitrary(-angle, angle, 0);
        this.directionX += directionChange;
        if (this.directionX > -0.2 && this.directionX < 0.2) {
            if (this.directionX < 0) this.directionX = -0.25;
            else this.directionX = 0.25;
        }
        this.directionY = -1 * Math.sqrt(this.moveStep * this.moveStep - this.directionX * this.directionX);
    }
    
    move(): void{
        this.left += this.directionX * this.moveStep;
        this.top += this.directionY * this.moveStep;
    }
}

export default class GameEngine {
    public width: number;
    public height: number;
    public borderThickness: number = 10;

    public readonly leftRightOffset: number = 70;
    public readonly topOffset: number = 50;
    public readonly sbbp: number = 60; //Space Between Bricks and Paddle. Goes from top to buttom. 100 default

    //Brick Fill Sides coordinates
    bfsTop: number;
    bfsBottom: number;
    bfsLeft: number;
    bfsRight: number;

    public ball: Ball | null = null;
    public paddle: Paddle;
    protected readonly paddleBounceAngle: number = 0.15;

    public isPaused: boolean;
    public gameState: GameState;
    public gameLost = false;

    //sounds
    private readonly winningSound;
    private readonly loseSound;
    private readonly paddleImpact;
    private readonly brickDestroy;
    private readonly music;

    private volume = 1;
    private soundOnOff = true;

    constructor( width: number, height: number, state: GameState, paddleBounceAngle: number) {
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

        this.winningSound = new Audio('winningSound.mp3');
        this.loseSound = new Audio('loseSound.mp3');
        this.paddleImpact = new Audio('paddleImpact.mp3');
        this.brickDestroy = new Audio('brickDestroy.mp3');
        this.music = new Audio('pixelgroove-77930.mp3');

        this.music.loop = true;

        this.gameState.startStopwatch();

        console.log("bfsBottom: " + this.bfsBottom);
    }

    prepareBricks(brickWidth: number, brickHeigth: number): void{
        //console.log('Caalled, engine');
        let amount: number = this.calculateAvailableAmount(brickWidth, brickHeigth);
        
        var counter: number = 0;
        while (counter < amount){
            this.gameState.bricks[counter] = new Brick(counter, brickWidth, brickHeigth);
            counter++;
        }
    
        let extraSpacing: number = ((this.bfsRight - this.bfsLeft) % brickWidth) / 2
    
        let X: number = 0;
        let Y: number = this.bfsTop;
    
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

    startMovePaddle(paddle: Paddle, step: number): void {
        paddle.startMove(step, this.borderThickness);
    }

    stopMovePaddle(paddle: Paddle): void {
        paddle.stopMove(this.borderThickness);
    }

    calculateAvailableAmount(brickWidth: number, brickHeigth: number): number{
        var boxWidth: number = this.width - this.leftRightOffset * 2
        var boxHeigth: number = this.bfsBottom - this.topOffset

        console.log("Available length: " + boxWidth);
        console.log("Available heigth: " + boxHeigth);

        var variableWidth: number = 0;
        var widthCounter: number = 0;
        var variableHeigth: number = 0;
        var heigthCounter: number = 0;
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

    checkOverlaping(ball: HTMLElement | null, obstacle: HTMLElement | null): boolean{
        const ballRect: DOMRect = ball!.getBoundingClientRect();
        const obstacleRect: DOMRect = obstacle!.getBoundingClientRect();
    
        const ballCenterX: number = ballRect.left + ((ballRect.right - ballRect.left) / 2);
        const ballCenterY: number = ballRect.top + ((ballRect.bottom - ballRect.top) / 2);
    
        const vectorsProjection: number = this.ball!.radius * Math.cos(Math.PI / 4);
        const ballVecRight: number = ballCenterX + vectorsProjection;
        const ballVecTop: number = ballCenterY - vectorsProjection;
        const ballVecLeft: number = ballCenterX - vectorsProjection;
        const ballVecBottom: number = ballCenterY + vectorsProjection;
    
        // console.log(ballCenterX);
        // console.log(ballCenterY);
        // a < b - a is higher than b
        let result: boolean;
        result = this.overlapingFromBelow(ballRect, obstacleRect, ballCenterX, obstacle!);
        if (result) return true;
        result = this.overlapingFromRight(ballRect, obstacleRect, ballCenterY, obstacle!);
        if (result) return true;
        result = this.overlapingFromTop(ballRect, obstacleRect, ballCenterX, obstacle!);
        if (result) return true;
        result = this.overlapingFromLeft(ballRect, obstacleRect, ballCenterY, obstacle!);
        if (result) return true;
        result = this.overlapingFromCorners(obstacleRect, ballCenterX, ballCenterY, ballVecBottom, ballVecRight, ballVecTop, ballVecLeft, obstacle!);
        if (result) return true;
    
        return false;
    }
    
    overlapingFromBelow(ballRect: DOMRect, obstacleRect: DOMRect, ballCenterX: number, obstacle: HTMLElement): boolean{
        if ((ballRect.top < obstacleRect.bottom) && (ballRect.bottom > obstacleRect.bottom) &&
            (ballCenterX > obstacleRect.left) && (ballCenterX < obstacleRect.right)) {
    
                if (obstacle.id.startsWith('brick-')){
                    //console.log(this.gameState.bricks[obstacle.id.replace('brick-', '')]);
                    //console.log(this.gameState.bricks[obstacle.id.replace('brick-', '')].setting);
                    //console.log(this.gameState.bricks[obstacle.id.replace('brick-', '')].setting === 'breakable');
                    if (this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))].setting === 'breakable'){
                        delete this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                    this.ball!.directionY *= -1;
                    return true;
                } else if (obstacle.id == 'bottom' || obstacle.id == 'paddle') {
                    this.gameLost = true;
                } else if (obstacle.id == 'top'){
                    this.ball!.directionY *= -1;
                    return true;
                } else if (obstacle.id.startsWith('wall-')){
                    this.ball!.directionX *= -1;
                    return true;
                }
        }
        return false;
    }
    
    overlapingFromRight(ballRect: DOMRect, obstacleRect: DOMRect, ballCenterY: number, obstacle: HTMLElement): boolean{
        if ((ballCenterY < obstacleRect.bottom) && (ballCenterY > obstacleRect.top) &&
            (ballRect.left < obstacleRect.right) && (ballRect.right > obstacleRect.right)) {
    
                if (obstacle.id.startsWith('brick-')){
                    if (this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))].setting === 'breakable'){
                        delete this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                    this.ball!.directionX *= -1;
                    return true;
                } else if (obstacle.id == 'paddle'){
                    this.ball!.bounceFromPaddle(this.paddleBounceAngle);
                    this.paddleImpact.play();
                    return true;
                } else if (obstacle.id == 'bottom') {
                    this.gameLost = true;
                } else if (obstacle.id == 'top'){
                    this.ball!.directionY *= -1;
                    return true;
                } else if (obstacle.id.startsWith('wall-')){
                    this.ball!.directionX *= -1;
                    return true;
                }
        }
        return false;
    }
    
    overlapingFromTop(ballRect: DOMRect, obstacleRect: DOMRect, ballCenterX: number, obstacle: HTMLElement): boolean{
        if ((ballRect.bottom > obstacleRect.top) && (ballRect.top < obstacleRect.top) &&
            (ballCenterX > obstacleRect.left) && (ballCenterX < obstacleRect.right)) {
    
                if (obstacle.id.startsWith('brick-') ){
                    if (this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))].setting === 'breakable'){
                        delete this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                    this.ball!.directionY *= -1;
                    return true;
                } else if (obstacle.id == 'paddle'){
                    this.ball!.bounceFromPaddle(this.paddleBounceAngle);
                    this.paddleImpact.play();
                    return true;
                } else if (obstacle.id == 'bottom') {
                    this.gameLost = true;
                } else if (obstacle.id == 'top'){
                    this.ball!.directionY *= -1;
                    return true;
                } else if (obstacle.id.startsWith('wall-')){
                    this.ball!.directionX *= -1;
                    return true;
                }
    
        }
        return false;
    }
    
    overlapingFromLeft(ballRect: DOMRect, obstacleRect: DOMRect, ballCenterY: number, obstacle: HTMLElement): boolean{
        if ((ballRect.right > obstacleRect.left) && (ballRect.left < obstacleRect.left) && 
            (ballCenterY > obstacleRect.top) && (ballCenterY < obstacleRect.bottom)) {
    
                if (obstacle.id.startsWith('brick-') ){
                    if (this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))].setting === 'breakable'){
                        delete this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                    this.ball!.directionX *= -1;
                    return true;
                } else if (obstacle.id == 'paddle'){
                    this.ball!.directionY *= -1;
                    this.ball!.directionX *= -1;
                    this.paddleImpact.play();
                    return true;
                } else if (obstacle.id == 'bottom') {
                    this.gameLost = true;
                } else if (obstacle.id == 'top'){
                    this.ball!.directionY *= -1;
                    return true;
                } else if (obstacle.id.startsWith('wall-')){
                    this.ball!.directionX *= -1;
                    return true;
                }
    
        }
        return false;
    }
    
    overlapingFromCorners(obstacleRect: DOMRect, ballCenterX: number, ballCenterY: number, ballVecBottom: number,
        ballVecRight: number, ballVecTop: number, ballVecLeft: number, obstacle: HTMLElement): boolean{

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
                    if (this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))].setting === 'breakable'){
                        delete this.gameState.bricks[Number(obstacle.id.replace('brick-', ''))];
                        this.brickDestroy.play();
                    }
                    this.gameState.points += 5;
                } else if (obstacle.id == 'bottom') {
                    this.gameLost = true;
                }
                this.ball!.directionX *= -1;
                this.ball!.directionY *= -1;
                this.paddleImpact.play();
                return true;
        }
        return false;
    }

    checkWinningState(){
        //console.log(this.gameState.bricks);
        if (this.gameState.bricks.filter((item: Brick) => item != null && item.setting != "unbreakable").length == 0) {
            this.winningSound.play();
            return true;
        }
        else if (this.gameLost){
            this.loseSound.play();
            return false;
        }
        else return;
    }

    playMusic(onOff: boolean): void{
        if (onOff){
            if (this.music.paused || this.music.ended) this.music.play();
        } else {
            if (this.music.paused || this.music.ended) return;
            this.music.pause();
        }
    }

    toggleSound(): void{
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

    changeVolume(amount: number): void{
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

function getRandomArbitrary(min: number, max: number, limits: number): number {
    let res: number = Math.random() * (max - min) + min;
    while(res > -limits && res < limits){
        res = Math.random() * (max - min) + min;
    }
    return res;
  }
  

