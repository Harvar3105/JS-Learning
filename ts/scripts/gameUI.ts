import GameEngine, { Ball, Brick, Paddle } from "./gameEngine";

export default class GameUI {
    // real screen dimensions
    private width: number = -1;
    private height: number = -1;

    engine: GameEngine;
    appContainer: HTMLElement; //Div element with id

    private scaleX: number = 1;
    private scaleY: number = 1;

    constructor(engine: GameEngine, appContainer: HTMLElement, width: number, height: number) {
        this.engine = engine;
        this.appContainer = appContainer;
        this.width = width;
        this.height = height;
        this.setScreenDimensions();

        console.log(this); 
    }

    changeScreenSize(width: number, height: number): void{
        this.width = width;
        this.height = height;
    }

    setScreenDimensions(): void {
        // this.width = width || document.documentElement.clientWidth;
        // this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.engine.width;
        this.scaleY = this.height / this.engine.height;

    }

    calculateScaledX(x: number) : number {
        return x * this.scaleX | 0;
    }

    calculateScaledY(y: number) : number {
        return y * this.scaleY | 0;
    }

    drawBorderSingle(id: string, left: number, top: number, width: number, height: number, color: string) {
        let border: HTMLElement = document.createElement('div');
        border.id = id;

        border.style.zIndex = '10';
        border.style.position = 'fixed';

        border.style.left = left + 'px';
        border.style.top = top + 'px';

        border.style.width = width + 'px';
        border.style.height = height + 'px';
        border.style.backgroundColor = color;

        this.appContainer.append(border);
    }

    drawBorder(): void {
        // top border
        this.drawBorderSingle('top', 0, 0, this.width, this.calculateScaledY(this.engine.borderThickness), 'red');
        // left
        this.drawBorderSingle('wall-left', 0, 0, this.calculateScaledX(this.engine.borderThickness), this.height, 'red');
        // right
        this.drawBorderSingle('wall-right', this.width - this.calculateScaledX(this.engine.borderThickness), 0, this.calculateScaledX(this.engine.borderThickness), this.height, 'red');
        // bottom
        this.drawBorderSingle('bottom', 0, this.height - this.calculateScaledY(this.engine.borderThickness), this.width, this.calculateScaledY(this.engine.borderThickness), 'blue');
    }

    drawPaddle(paddle: Paddle): void {
        let div: HTMLElement = document.createElement('div');
        div.id = 'paddle';

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(paddle.left) + 'px';
        div.style.top = this.calculateScaledY(paddle.top) + 'px';

        div.style.width = this.calculateScaledX(paddle.width) + 'px';
        div.style.height = this.calculateScaledY(paddle.height) + 'px';

        div.style.backgroundColor = paddle.color;
        div.style.border = '1px solid black'

        this.appContainer.append(div);
    }

    draw(): void {
        // clear previous render
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();

        this.drawBorder();
        this.drawPaddle(this.engine.paddle);
        for (let brick of this.engine.gameState.bricks){
            if (brick == undefined) continue;
            this.drawBrick(brick);
        }
        this.drawBall(this.engine.ball!);
    }

    drawBrick(brick: Brick): void{
        let div: HTMLElement = document.createElement('div');
        div.id = 'brick-' + brick.id;

        

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        if (brick.setting == "unbreakable"){
            div.style.backgroundColor = "#17181a";
        } else{
            div.style.backgroundColor = brick.randomColor;
        }

        div.style.left = this.calculateScaledX(brick.left) + 'px';
        div.style.top = this.calculateScaledY(brick.top) + 'px';

        div.style.width = this.calculateScaledX(brick.width) + 'px';
        div.style.height = this.calculateScaledY(brick.height) + 'px';
        
        div.style.border = '1px solid #0000FF';

        //console.log(div);
        this.appContainer.append(div);
    }

    drawBall(ball: Ball): void{
        let ballElement: HTMLElement = document.createElement('div');
        ballElement.id = "ball";
        
        ballElement.style.backgroundColor = ball.color;
        ballElement.style.zIndex = '10';
        ballElement.style.position = 'fixed';

        ballElement.style.left = this.calculateScaledX(ball.left) + 'px';
        ballElement.style.top = this.calculateScaledY(ball.top) + 'px';

        //scale must be equal in both directions. Calculate avg?
        ballElement.style.width = this.calculateScaledX(ball.radius) + 'px';
        ballElement.style.height = this.calculateScaledX(ball.radius) + 'px';
        ballElement.style.border = 'solid 3px black';
        ballElement.style.borderRadius = '50%';

        // ballElement.style.color = 'red';
        // ballElement.innerText = '0';
        this.appContainer.append(ballElement);
    }

    drawPauseMenu(): void{
        let menu: HTMLElement = document.createElement('div');
        let text: HTMLElement = document.createElement('p');

        menu.style.position = 'fixed';
        menu.style.backgroundColor = '#111';
        menu.style.width = this.calculateScaledX(this.engine.width) + 'px';
        menu.style.height = this.calculateScaledY(this.engine.height) + 'px';
        menu.style.opacity = '0.7';
        menu.style.zIndex = '12';
        
        text.style.position = 'fixed';
        text.style.width = this.calculateScaledX(this.engine.width) + 'px';
        text.style.height = this.calculateScaledY(this.engine.height) + 'px';
        text.innerText = "PAUSED\nPress C to continue";
        text.style.color = '#fff';
        text.style.textAlign = 'center';
        text.style.fontSize = 50 + 'px';
        text.style.letterSpacing = 0.3 + 'rem';
        text.style.marginTop = 25 + '%';
        text.style.zIndex = '13';
        
        menu.classList.add('pauseMenu');

        menu.append(text);
        this.appContainer.append(menu);
    }

    drawEndScreen(): void{
        let screen: HTMLElement = document.createElement('div');
        let text: HTMLElement = document.createElement('p');

        screen.style.position = 'fixed';
        screen.style.background = '#111';
        screen.style.width = this.calculateScaledX(this.engine.width) + 'px';
        screen.style.height = this.calculateScaledY(this.engine.height) + 'px';
        screen.style.opacity = '0.7';
        screen.style.zIndex = '12';
        
        text.style.position = 'fixed';
        text.style.width = this.calculateScaledX(this.engine.width) + 'px';
        text.style.height = this.calculateScaledY(this.engine.height) + 'px';
        text.innerText = this.engine.gameState.result + '\nYou have scored: ' + this.engine.gameState.points;
        text.style.color = '#fff';
        text.style.textAlign = 'center';
        text.style.fontSize = 50 + 'px';
        text.style.letterSpacing = 0.3 + 'rem';
        text.style.marginTop = 25 + '%';
        text.style.zIndex = '13';

        screen.append(text);
        this.appContainer.append(screen);
    }

}