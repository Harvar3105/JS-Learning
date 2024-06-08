export default class ConstructorUI{
    // real screen dimensions
    #width = -1;
    #height = -1;

    constructorEngine = null;
    appContainer = null; //Div element with id

    #scaleX = 1;
    #scaleY = 1;

    constructor(engine, appContainer, width, height) {
        this.constructorEngine = engine;
        this.appContainer = appContainer;
        this.#width = width;
        this.#height = height;
        this.setScreenDimensions();

        console.log(this);
    }

    changeScreenSize(width, height){
        this.#width = width;
        this.#height = height;
    }

    setScreenDimensions() {
        // this.width = width || document.documentElement.clientWidth;
        // this.height = height || document.documentElement.clientHeight;

        this.#scaleX = this.#width / this.constructorEngine.width;
        this.#scaleY = this.#height / this.constructorEngine.height;

    }

    calculateScaledX(x) {
        return x * this.#scaleX | 0;
    }

    calculateScaledY(y) {
        return y * this.#scaleY | 0;
    }

    drawBorderSingle(id, left, top, width, height, color) {
        let border = document.createElement('div');
        border.id = id;

        border.style.zIndex = 10;
        border.style.position = 'fixed';

        border.style.left = left + 'px';
        border.style.top = top + 'px';

        border.style.width = width + 'px';
        border.style.height = height + 'px';
        border.style.backgroundColor = color;

        this.appContainer.append(border);
    }

    drawBorder() {
        // top border
        this.drawBorderSingle('top', 0, 0, this.#width, this.calculateScaledY(this.constructorEngine.borderThickness), 'red');
        // left
        this.drawBorderSingle('wall-left', 0, 0, this.calculateScaledX(this.constructorEngine.borderThickness), this.#height, 'red');
        // right
        this.drawBorderSingle('wall-right', this.#width - this.calculateScaledX(this.constructorEngine.borderThickness), 0, this.calculateScaledX(this.constructorEngine.borderThickness), this.#height, 'red');
        // bottom
        this.drawBorderSingle('bottom', 0, this.#height - this.calculateScaledY(this.constructorEngine.borderThickness), this.#width, this.calculateScaledY(this.constructorEngine.borderThickness), 'blue');
    }

    draw() {
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();

        this.drawBorder();
        for (let brick of this.constructorEngine.constructorState.bricks){
            if (brick == undefined) continue;
            this.drawBrick(brick);
        }
    }

    drawBrick(brick){
        let div = document.createElement('div');
        div.id = 'cBrick-' + brick.id;

        switch (brick.setting){
            case 'breakable':
                div.style.backgroundColor = '#0bf707';
                break;
            case 'unbreakable':
                div.style.backgroundColor = '#ff0022';
                break;
            case 'deleted':
                div.style.backgroundColor = '#000000';
                break;
        }
        

        div.style.zIndex = 10;
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(brick.left) + 'px';
        div.style.top = this.calculateScaledY(brick.top) + 'px';

        div.style.width = this.calculateScaledX(brick.width) + 'px';
        div.style.height = this.calculateScaledY(brick.height) + 'px';
        
        div.style.border = '1px solid #0000FF';

        div.onclick = () => {
            this.constructorEngine.changeState(div.id);
            this.draw();
        }

        //console.log(div);
        this.appContainer.append(div);
    }
}