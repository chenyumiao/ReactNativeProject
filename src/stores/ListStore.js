/**
 * Created by cym on 2020/1/14.
 */
import {observable, action} from 'mobx'

class ListStore {
    @observable list = [];
    @observable timer = 0;

    @action
    setList=(data)=>{
        this.list = data
    }

    @action
    resetTimer=() =>{
        this.timer = 0
    }

    @action
    tick=() =>{
        this.timer += 1
    }
}

const listStore = new ListStore();
export {listStore};