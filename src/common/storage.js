/**
 * Created by cym on 2020/1/16.
 */
import AsyncStorage from '@react-native-community/async-storage';

class AppStorage {
        /**
       * 获取
       * @param key
       * @returns {Promise<T>|*|Promise.<TResult>}
       */
         static async get(key) {
           const value = await AsyncStorage.getItem(key);
           return value;
         }
         /**
       * 保存
       * @param key
       * @param value
       * @returns {*}
       */
     static async save(key, value) {
             return await AsyncStorage.setItem(key, value);
         }
         /**
       * 更新
       * @param key
       * @param value
       * @returns {Promise<T>|Promise.<TResult>}
       */
     static update(key, value) {
             return AppStorage.get(key).then((item) => {
                     value = typeof value === 'string' ? value : Object.assign({}, item, value);
                     return AsyncStorage.setItem(key, JSON.stringify(value));
                 });
         }

         /**
       * 删除
       * @param key
       * @returns {*}
       */
     static delete(key) {
             return AsyncStorage.removeItem(key);
         }
     }

 export default AppStorage;
