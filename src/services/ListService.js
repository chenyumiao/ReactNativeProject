/**
 * Created by cym on 2020/1/16.
 */
import Http from '../common/http';
import Url from '../common/interface';
import AppStorage from '../common/storage';

 class ListService extends Http{
    /**
     * 获取token
     * @return {Promise<void>}
     */
    async getToken(){
        const url= Url.tokenUrl;
        const  res = await this.postJson(url,{},'',true,false);
        return res;
    }
    /**
     * 获取列表
     * @return {Promise<void>}
     */
    async getListData(param){
        const url= Url.listUrl;
        const  res =  this.postJson(url,param,'',true,true);
        return res;
    }
}
const listService = new ListService();
export {listService};
