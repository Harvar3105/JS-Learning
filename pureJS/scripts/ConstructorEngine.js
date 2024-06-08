import { Brick } from "./engine.js";

export default class ConstructorEngine {
    width;
    height;
    borderThickness = 10;

    leftRightOffset = 70;
    topOffset = 50;
    sbbp = 60; //Space Between Bricks and Paddle. Goes from top to buttom

    //Brick Fill Sides coordinates
    bfsTop;
    bfsBottom;
    bfsLeft;
    bfsRight;

    constructorState;

    constructor( width = 640, height = 360, state, paddleBounceAngle = 0.15) {
        this.constructorState = state;

        this.width = width;
        this.height = height;

        this.bfsTop = this.topOffset;
        this.bfsLeft = this.leftRightOffset;
        this.bfsRight = width - this.leftRightOffset;
        this.bfsBottom = (height - 50) - this.sbbp - ((height - 50) * 1 / 5); //50 - Paddle size

        console.log("bfsBottom: " + this.bfsBottom);
    }

    prepareBricks(brickWidth, brickHeigth){
        //console.log('Called const engine');
        let amount = this.calculateAvailableAmount(brickWidth, brickHeigth);

        if (this.constructorState.bricks.length != 0) this.constructorState.bricks = [];
        
        var counter = 0;
        while (counter < amount){
            this.constructorState.bricks[counter] = new Brick(counter, brickWidth, brickHeigth);
            counter++;
        }
    
        let extraSpacing = ((this.bfsRight - this.bfsLeft) % brickWidth) / 2
    
        let X = 0;
        let Y = this.bfsTop;
    
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

    calculateAvailableAmount(brickWidth, brickHeigth){
        var boxWidth = this.width - this.leftRightOffset * 2;
        var boxHeigth = this.bfsBottom - this.topOffset;
        console.log('BFS bottom: ' + this.bfsBottom);
        console.log("Available length: " + boxWidth);
        console.log("Available heigth: " + boxHeigth);

        var variableWidth = 0;
        var widthCounter = 0;
        var variableHeigth = 0;
        var heigthCounter = 0;
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
    
    changeState(id){
        let brick = this.constructorState.bricks[id.replace('cBrick-', '')];
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
