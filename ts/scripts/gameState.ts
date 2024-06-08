import { Brick } from "./gameEngine";

export default class GameState {
    private id: string | undefined;
    public points: number = 0;
    public bricks: Array<Brick> = [];
    public result: string = '';
    public seconds: number = 0;

    private intervalId: number | undefined;

    constructor(){
        var keys = this.getAllIds()
        if (keys.length == 0) this.id = '1';
        else this.setId(keys);
        console.log(this)
    }

    startStopwatch(): void {
        if (this.intervalId != null) return;

        this.intervalId = setInterval(() => {
            this.seconds += 1;
            // console.log(this.seconds);

        }, 1000);
    }

    stopStopwatch(): void {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    setId(keys: Array<string>): void{
        var num = 0;
        while (true){
            if (keys.includes(num.toString())) ++num;
            else {
                this.id = num.toString();
                return;
            }
        }
    }

    getAllIds(): string[]{
        let result: string[] = [];
        var storage = Object.keys(localStorage);
        for (var item of storage){
            result.push(item)
        }
        return result;
    }

    save(): void{
        localStorage.setItem(this.id!, this.toString());
    }

    toString(): string{
        return this.id + ': Scored - ' + this.points + ' | ' + this.result + ' | ' + this.seconds;
    }
}