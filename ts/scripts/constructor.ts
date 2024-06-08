import ConstructorEngine from "./constructorEngine";
import ConstructorUI from "./constructorUI";
import LevelState from "./levelState";

const urlParams = new URLSearchParams(window.parent.location.search);
if (urlParams.size != 0) main();

//TODO: Make able to change sbbp, leftRight offset, top offset.
function main(){
    let iframe: HTMLElement | null = parent.document.getElementById("frameElement");
    let width: number = iframe!.offsetWidth;
    let height: number = iframe!.offsetHeight;

    let appDiv: HTMLElement | null = document.querySelector<HTMLElement>("#App");
    let cancel: HTMLElement | null = parent.document.querySelector<HTMLElement>('#cancel');
    let confirm: HTMLElement | null = parent.document.querySelector<HTMLElement>('#confirm');

    let constructorEngine: ConstructorEngine = new ConstructorEngine(640, 360, new LevelState());
    let constructorUI: ConstructorUI = new ConstructorUI(constructorEngine, appDiv!, width, height);

    window.onresize = () => {
        constructorUI.changeScreenSize(parent.document.getElementById("frameElement")!.offsetWidth, parent.document.getElementById("frameElement")!.offsetHeight);
        constructorUI.setScreenDimensions();
    }

    cancel!.addEventListener('mousedown', () => {
        window.parent.location.replace('./constructor.html');
    })
    confirm!.addEventListener('mousedown', () => {
        constructorEngine.constructorState.save();
        console.log(constructorEngine.constructorState);
        window.parent.location.replace('./levels.html');
    })

    constructorEngine.prepareBricks(Number(urlParams.get('width')), Number(urlParams.get('heigth')));
    constructorUI.draw();
    console.log(constructorEngine.constructorState.bricks);
    //Repeater(constructorUI, constructorEngine);
}
