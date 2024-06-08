import { Brick } from "./gameEngine";
import LevelState from "./levelState";

export default class ConstructorEngine {
    width: number;
    height: number;
    borderThickness: number = 10;

    leftRightOffset: number = 70;
    topOffset: number = 50;
    sbbp: number = 60; //Space Between Bricks and Paddle. Goes from top to buttom

    //Brick Fill Sides coordinates
    bfsTop: number;
    bfsBottom: number;
    bfsLeft: number;
    bfsRight: number;

    constructorState;

    constructor( width: number = 640, height: number = 360, state: LevelState) {
        this.constructorState = state;

        this.width = width;
        this.height = height;

        this.bfsTop = this.topOffset;
        this.bfsLeft = this.leftRightOffset;
        this.bfsRight = width - this.leftRightOffset;
        this.bfsBottom = (height - 50) - this.sbbp - ((height - 50) * 1 / 5); //50 - Paddle size

        console.log("bfsBottom: " + this.bfsBottom);
    }

    prepareBricks(brickWidth: number, brickHeigth: number): void{
        //console.log('Called const engine');
        let amount: number = this.calculateAvailableAmount(brickWidth, brickHeigth);

        if (this.constructorState.bricks.length != 0) this.constructorState.bricks = [];
        
        var counter: number = 0;
        while (counter < amount){
            this.constructorState.bricks[counter] = new Brick(counter, brickWidth, brickHeigth);
            counter++;
        }
    
        let extraSpacing: number = ((this.bfsRight - this.bfsLeft) % brickWidth) / 2
    
        let X: number = 0;
        let Y: number = this.bfsTop;
    
        for (let brick of this.constructorState.bricks){
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
    
        console.log(this.constructorState.bricks);
    
    }

    calculateAvailableAmount(brickWidth: number, brickHeigth: number): number{
        var boxWidth: number = this.width - this.leftRightOffset * 2;
        var boxHeigth: number = this.bfsBottom - this.topOffset;
        console.log('BFS bottom: ' + this.bfsBottom);
        console.log("Available length: " + boxWidth);
        console.log("Available heigth: " + boxHeigth);

        var variableWidth: number = 0;
        var widthCounter: number = 0;
        var variableHeigth: number = 0;
        var heigthCounter: number = 0;
        while (variableWidth + brickWidth <= boxWidth){
            variableWidth += brickWidth;
            ++widthCounter;
            console.log('variableWidth: ' + variableWidth);
        }

        while (variableHeigth + brickHeigth <= boxHeigth){
            variableHeigth += brickHeigth;
            ++heigthCounter;
            console.log('variableHeigth: ' + variableHeigth);
        }

        console.log('Available bricks amount: ' + heigthCounter * widthCounter);
        return heigthCounter * widthCounter;
    }
    
    changeState(id: string): void{
        let brick: Brick = this.constructorState.bricks[Number(id.replace('cBrick-', ''))];
        switch (brick.setting){
            case 'breakable':
                brick.setting = 'unbreakable';
                break;
            case 'unbreakable':
                
                brick.setting = 'deleted';
                break;
            case 'deleted':
                brick.setting = 'breakable';
        }
    }
}
