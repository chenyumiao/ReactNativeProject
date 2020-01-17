/**
 * Created by cym on 2020/1/15.
 */

import fetchIntercept from 'fetch-intercept'
import constants from './constants';
import AppStorage from './storage';

const fetchApi = fetch;

fetchIntercept.register({
    request: function (url, config) {
        return [url, config];
    },
    requestError: function (error) {
        return Promise.reject(error);
    },
    response: function (res) {
        return res;
    },
    responseError: function (error) {
        return Promise.reject(error);
    }
});

export default class Http {
    constructor(props){

    }
    async request(method, url, params,errorMsg, showLoading = true,hideLoading, acceptType = 'application/json') {
        // 如果url不全，则自动补全
        if(url.indexOf('http://') < 0 && url.indexOf('https://') < 0){
            url = constants.serverUrl + '/' + url;
        }

        if(showLoading){
            LoadingComponentRef.showLoading();
        }

        let res = null;
        let timer = null;

        try {
            const options = {
                method: method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                    'accept': acceptType
                },
                timeout:120*1000
            }
            let token = await AppStorage.get('token');
            if(token){
                options.headers = {
                    ...options.headers,
                    'Authorization':token
                }
            };
            if(method === 'POST' || method === 'PUT') {
                options.body = JSON.stringify(params || {})
            }
            console.log(JSON.stringify(options));
            res = await fetchApi(url, options)
        } catch (e) {
            LoadingComponentRef.hideLoading();
            console.log('请求失败--'+e);
        }
      // alert(JSON.stringify(res));
        if(res.status && res.status >= 200 && res.status < 300) {
            const contentType = res.headers.get('Content-Type');
            if(hideLoading){
                LoadingComponentRef.hideLoading();
            }
            if(contentType.indexOf('text/plain') >= 0 || contentType.indexOf('text/html') >= 0){
                return res.text()
            }else{
                const responseJson = await res.json();
                if (responseJson && !responseJson.jsonError) {
                    return responseJson
                } else {
                    console.log(responseJson.jsonError[0]._exceptionMessageCode || '请求失败'+','+responseJson.jsonError[0]._exceptionMessage);
                }
            }
        } else {
            LoadingComponentRef.hideLoading();

            if (res.status === 401) {
                console.log('请求超时--'+JSON.stringify(res));
            } else if (res.ok) {
                try {
                    const responseJson = await res.json();
                    const { message } = responseJson;
                    console.log('请求失败--'+message);
                } catch (e) {
                   console.log( '服务未知错误'+e);
                }
            }
        }
    }

    /**
     * GET 后台数据
     * @param url
     * @param errorMsg 报错消息
     * @returns {Promise<*>}
     */
    async getJson(url, errorMsg,showLoading = true){
        return await this.request('GET', url, null,errorMsg, showLoading)
    }

    /**
     * POST请求
     * @param url
     * @param params
     * @param errorMsg 报错消息
     * @returns {Promise.<void>}
     */
    async postJson(url, params, errorMsg, showLoading = true,hideLoading){
        return await this.request('POST', url, params,errorMsg, showLoading,hideLoading)
    }

}