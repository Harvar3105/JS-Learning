import ConstructorEngine from "./ConstructorEngine.js";
import ConstructorUI from "./constructorUI.js";
import LevelState from "./levelState.js";

const urlParams = new URLSearchParams(window.parent.location.search);
//console.log(window.parent.location.search.toString());
//console.log(urlParams);
if (urlParams.size != 0) main();

//TODO: Make able to change sbbp, leftRight offset, top offset.
function main(){
    let iframe = parent.document.getElementById("frameElement");
    let width = iframe.offsetWidth;
    let height = iframe.offsetHeight;

    let appDiv = document.querySelector("#App");
    let cancel = parent.document.querySelector('#cancel');
    let confirm = parent.document.querySelector('#confirm');

    let constructorEngine = new ConstructorEngine(640, 360, new LevelState());
    let constructorUI = new ConstructorUI(constructorEngine, appDiv, width, height);

    window.onresize = () => {
        constructorUI.changeScreenSize(parent.document.getElementById("frameElement").offsetWidth, parent.document.getElementById("frameElement").offsetHeight);
        constructorUI.setScreenDimensions();
    }

    cancel.addEventListener('mousedown', () => {
        window.parent.location.replace('./constructor.html');
    })
    confirm.addEventListener('mousedown', () => {
        constructorEngine.constructorState.save();
        console.log(constructorEngine.constructorState);
        window.parent.location.replace('./levels.html');
    })

    constructorEngine.prepareBricks(Number(urlParams.get('width')), Number(urlParams.get('heigth')));
    constructorUI.draw();
    console.log(constructorEngine.constructorState.bricks);
    //Repeater(constructorUI, constructorEngine);
}

// function Repeater(ui, engine){
//     setTimeout(() => {
//         ui.draw();
//         Repeater(ui, engine);
//     }, 60);
// }

