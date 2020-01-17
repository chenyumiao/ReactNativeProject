/**
 * Created by cym on 2020/1/14.
 */
import {observable, action} from 'mobx'
import { listService } from '../services/ListService';
import AppStorage from '../common/storage';

class ListStore {
    @observable list = [];
    @observable timer = 0;

    @action
    async getList(params){
        let token = await AppStorage.get('token');
       // if(!token){
            const data = await listService.getToken();
            AppStorage.save('token',data.result);
       // }
        const res = await listService.getListData(params);
        if(res && res.records){
            this.list = res.records;
        }else{
            this.list = [];
        }
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