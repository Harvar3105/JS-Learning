export class State {
    id;
    points = 0;
    bricks = [];
    result = '';
    seconds = 0;

    #intervalId = null;

    constructor(){
        var keys = this.getAllIds()
        if (keys.length == 0) this.id = 1
        else this.setId(keys);
        console.log(this)
    }

    startStopwatch() {
        if (this.#intervalId !== null) return;

        this.#intervalId = setInterval(() => {
            this.seconds += 1;

        }, 1000);
    }

    stopStopwatch() {
        if (!this.#intervalId) return;
        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    setId(keys){
        var num = 0;
        while (true){
            if (keys.includes(num)) ++num;
            else {
                this.id = num;
                return;
            }
        }
    }

    getAllIds(){
        let result = [];
        var storage = Object.keys(localStorage);
        for (var item of storage){
            result.push(item.key)
        }
        return result;
    }

    save(){
        localStorage.setItem(this.id, this);
    }

    toString(){
        return this.id + ': Scored - ' + this.points + ' | ' + this.result + ' | ' + this.seconds;
    }
}