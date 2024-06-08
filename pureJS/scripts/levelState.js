export default class LevelState{
    id;
    bricks = [];

    constructor(){
        var keys = this.getAllIds();
        if (keys.length == 0) this.id = 'Level-' + 1;
        else this.setId(keys);
        console.log(this)
    }

    setId(keys){
        var num = 0;
        while (true){
            if (keys.includes(num)) ++num;
            else {
                this.id = 'Level-' + num;
                return;
            }
        }
    }

    getAllIds(){
        let result = [];
        var storage = Object.keys(localStorage).filter(key => key.startsWith('Level-'));
        for (var key of storage){
            result.push(key.replace('Level-', ''));
        }
        return result;
    }

    save(){
        this.bricks = this.bricks.filter(brick => brick.setting !== 'deleted');
        localStorage.setItem(this.id, this);
    }

    toString(){
        return this.id + ': Data-' + this.bricks.toString();
    }
}