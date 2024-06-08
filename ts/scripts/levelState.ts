import { Brick } from "./gameEngine";

export default class LevelState{
    id: string | undefined;
    bricks: Array<Brick> = [];

    constructor(){
        var keys = this.getAllIds();
        if (keys.length == 0) this.id = 'Level-' + 1;
        else this.setId(keys);
        console.log(this)
    }

    setId(keys: Array<string>): void{
        var num: number = 0;
        while (true){
            if (keys.includes(num.toString())) ++num;
            else {
                this.id = 'Level-' + num;
                return;
            }
        }
    }

    getAllIds() : Array<string>{
        let result: string[] = [];
        var storage = Object.keys(localStorage).filter(key => key.startsWith('Level-'));
        for (var key of storage){
            result.push(key.replace('Level-', ''));
        }
        return result;
    }

    save(): void{
        this.bricks = this.bricks.filter(brick => brick.setting !== 'deleted');
        localStorage.setItem(this.id!, this.toString());
    }

    toString(): string{
        return this.id + ': Data-' + this.bricks.toString();
    }
}