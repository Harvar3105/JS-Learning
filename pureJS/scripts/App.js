import Engine, { Ball, Brick } from "./engine.js";
import GameUI from "./gameUI.js";
import { State } from "./state.js";


// https://stackoverflow.com/questions/64752006/calculate-a-position-based-on-an-angle-a-speed-and-a-starting-position

// =============== ENTRY POINT ================
console.log("App startup...");
main();

function main() {
    validateIndexHtml();
    let iframe = parent.document.getElementById("frameElement");
    let stopwatch = parent.document.getElementById("stopwatch");
    let width = iframe.offsetWidth;
    let height = iframe.offsetHeight;

    
    const urlParams = new URLSearchParams(window.parent.location.search);
    console.log(urlParams.get);
    let brickWidth = 100;
    let brickHeigth = 25;
    let ballRadius = 30;

    let appDiv = document.querySelector("#App");
    let leftArrow = parent.document.querySelector('#LeftArrow');
    let rightArrow = parent.document.querySelector('#RightArrow');

    let lowerVolume = parent.document.querySelector('#LowerVolume');
    let onOffVolume = parent.document.querySelector('#MuteUnmuteVolume');
    let higherVolume = parent.document.querySelector('#HigherVolume');

    
    var engine = new Engine(640, 360, new State(), 0.15);
    if (urlParams.size != 0){
        console.log("urlparams");
        var state = new State();

        var levelData = JSON.parse(urlParams.get("MapLevel").replace("\\", "\\\\"));
        console.log(levelData);
        var bricks = levelData.split("(").filter(item => item.includes(")"));
        var allbricks = [];
        var counter = 0;
        for(var brick of bricks){
            brick.replace("),", "").replace(")", "");
            allbricks.push(parseBrick(brick, counter++));
            //counter++;
        }
        //console.log("allbricks:");
        //console.log(allbricks);
        state.bricks = allbricks;

        engine.gameState = state;
        console.log(engine.gameState.bricks);
    } 



    let gameUI = new GameUI(engine, appDiv, width, height);

    window.onresize = () => {
        gameUI.changeScreenSize(parent.document.getElementById("frameElement").offsetWidth, parent.document.getElementById("frameElement").offsetHeight);
        gameUI.setScreenDimensions();
    }

    lowerVolume.addEventListener('click', () => {
        engine.changeVolume(-0.2);
        iframe.focus();
    });

    onOffVolume.addEventListener('click', () => {
        engine.toggleSound();
        if (onOffVolume.src === 'resources\\noteNeon.png') onOffVolume.src = 'resources\\xNeon.png';
        else if (onOffVolume.src === 'resources\\xNeon.png') onOffVolume.src = 'resources\\noteNeon.png';
        iframe.focus();
    });

    higherVolume.addEventListener('click', () => {
        engine.changeVolume(0.2);
        iframe.focus();
    });

    leftArrow.addEventListener('mousedown', () => {
        if (!engine.isPaused) engine.startMovePaddle(engine.paddle, -1);
        console.log("cal")
    });
    leftArrow.addEventListener('mouseup', () => {
        engine.stopMovePaddle(engine.paddle, -1);
        iframe.focus();
    });
    rightArrow.addEventListener('mousedown', () => {
        if (!engine.isPaused) engine.startMovePaddle(engine.paddle, 1);
    });
    rightArrow.addEventListener('mouseup', () => {
        engine.stopMovePaddle(engine.paddle, 1);
        iframe.focus();
    });

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ф':
            case 'a':
                if (!engine.isPaused) engine.startMovePaddle(engine.paddle, -1);
                engine.playMusic(true);
                break;
            case 'в':
            case 'd':
                if (!engine.isPaused) engine.startMovePaddle(engine.paddle, 1);
                engine.playMusic(true);
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ф':
            case 'a':
                engine.stopMovePaddle(engine.paddle, -1);
                break;
            case 'в':
            case 'd':
                engine.stopMovePaddle(engine.paddle, 1);
                break;
        }

    });

    document.addEventListener('keypress', (e) => {
        switch (e.key){
            case 'c':
                engine.isPaused = false;
                console.log("Engine state: " + engine.isPaused);
                engine.gameState.startStopwatch();
                break;
            case 'p':
                engine.isPaused = true;
                console.log("Engine state: " + engine.isPaused);
                engine.gameState.stopStopwatch();
                break;
            // default:
            //     console.log(e.key);
        }
    })

    prepareBall(engine, ballRadius);
    // Draw and initialize bricks
    if (urlParams.size === 0){
        engine.prepareBricks(brickWidth, brickHeigth);
    }

    // draw ui as fast as possible - on repeat
    gameUI.draw();
    engine.isPaused = false;
    Repeater(gameUI, engine, '', stopwatch);
}

function parseBrick(brickData, counter){
    var data = brickData.split(",");
    console.log(data[2]);
    var brick = new Brick(counter, Number(data[3]), Number(data[4]), data[2].replace(" ", ""));
    brick.left = Number(data[5]);
    brick.top = Number(data[6].replace(')', ''));
    return brick;
}

function validateIndexHtml() {
    if (document.querySelectorAll("#App").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
    if (document.querySelectorAll("div").length != 1) {
        throw Error("More or less than one div found in index.html!");
    }
}

function convertTime( engine){

    var seconds = engine.gameState.seconds;
    var minutes = Math.round(seconds / 60);
    var secondsToDisplay = seconds % 60;
    if (minutes < 10){
        minutes = "0" + minutes
    }
    if (secondsToDisplay < 10){
        secondsToDisplay = "0" + secondsToDisplay
    }
    var time = minutes + ":" + secondsToDisplay;
    return time
}

function Repeater(ui, engine, prevCol = '', stopwatch){
    setTimeout(() => {
        if (!engine.isPaused) { //If not
            engine.ball.move();
            
            stopwatch.innerText = convertTime(engine);
            ui.draw(); 
            var curCol = checkBricks(engine);

            if (prevCol == 'pcol' && curCol == 'pcol'){ // Used to prevent ball stuck in paddle.
                curCol = ''; // reset current collusion result for future
                engine.ball.top -= engine.ball.radius;
                engine.ball.directionY *= -1;
            }

            var win = engine.checkWinningState();
            if (win){
                engine.gameState.result = 'Congratulations, You Won!';
                engine.gameState.save();
                ui.drawEndScreen();
                return;
            } else if (win === false){
                engine.gameState.result = 'You Lost';
                ui.drawEndScreen();
                engine.gameState.save();
                return;
            }
        } else {
            ui.draw();
            ui.drawPauseMenu();
        }

        Repeater(ui, engine, curCol, stopwatch);
    }, 0);
}

function prepareBall(engine, radius){
    engine.ball = new Ball(engine.paddle.left + engine.paddle.width / 2, engine.paddle.top - radius, radius);
    console.log(engine.ball);
}

function checkBricks(engine){
    const brickElements = document.querySelectorAll('[id^="brick"]');
    const ball = document.getElementById('ball');
    const paddle = document.getElementById('paddle');
    const wallLeft = document.getElementById('wall-left');
    const wallRight = document.getElementById('wall-right');
    const bottom = document.getElementById('bottom');
    const top = document.getElementById('top');

    const elementsToCheck = [paddle, wallLeft, wallRight, bottom, top];

    for (const element of elementsToCheck){
        const result = engine.checkOverlaping(ball, element);
        if (result && element.id === 'paddle') return 'pcol'
        else if (result) return;
    }

    for (let brick of brickElements){
        const result = engine.checkOverlaping(ball, brick);
        if (result) return;
    } 
}

