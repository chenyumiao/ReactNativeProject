import React,{ Component  } from 'react';
import {  StyleSheet, Text, View ,Button,PermissionsAndroid,ToastAndroid,FlatList} from "react-native";
import RNFS from 'react-native-fs';
import SQLiteStorage from 'react-native-sqlite-storage';

let db;
export default class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbData:[]
        };
        this.download = this.download.bind(this);
      //  this.openDb = this.openDb().bind(this);
        this.create = this.create.bind(this);
        this.insert = this.insert.bind(this);
        this.delete = this.delete.bind(this);
        this.inquire = this.inquire.bind(this);
    }

    componentDidMount() {

    }
    //第一步，权限认证
    download(){
        try {
            const granted =  PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                    'Cool Photo App needs access to your camera ' +
                    'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the write storage');
                this.getToken();
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }

        var path = 'file:///sdcard/szewec/reactNative';
        RNFS.mkdir(path)
            .then(() => {console.log('success');this.getToken();},()=>console.log('fail'));

        console.log('下载db库');
        console.log('DocumentDirectoryPath=' + RNFS.DocumentDirectoryPath);
        console.log('CachesDirectoryPath=' + RNFS.CachesDirectoryPath);
        console.log('DocumentDirectoryPath=' + RNFS.DocumentDirectoryPath);
        console.log('TemporaryDirectoryPath=' + RNFS.TemporaryDirectoryPath);
        console.log('LibraryDirectoryPath=' + RNFS.LibraryDirectoryPath);
        console.log('ExternalDirectoryPath=' + RNFS.ExternalDirectoryPath);
        console.log('ExternalStorageDirectoryPath=' + RNFS.ExternalStorageDirectoryPath);
    }
    //第二步，获取token
    getToken(){
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        let url = 'http://cloud-test.gcnao.cn:8080/account/appLogin?username=minglai&password=a123456&accountType=PERSONAL';
        fetch(url, fetchOptions)
            .then((response) => response.text())
            .then((responseText) => {
                let response = JSON.parse(responseText);
                let token = response.result;
                this.downloadDb(token);
            }).done();
    }
    //第三步，下载数据库
    downloadDb(token){
        //设置下载参数
        alert('download--'+token);
        var dbUrl = 'http://10.0.10.59:8081/road/app/system/attachment/downloadAppDBFile?dbType=ASSET&version=10.00.0211.1';
        var toFile = 'file:///sdcard/szewec/reactNative/react_asset.db';
        const options = {
            fromUrl: dbUrl,
            toFile: toFile,
            headers:{'Content-type':'application/json;charset=utf-8','Authorization':token},
            background: true,
            progressDivider: 5,
            begin: (res) => {
                //开始下载时回调
                console.log('begin', res);
            },
            progress: (res) => {
                //下载过程中回调，根据options中设置progressDivider:5，则在完成5%，10%，15%，...，100%时分别回调一次，共回调20次。
                console.log('progress', res)
            }
        }
        const ret = RNFS.downloadFile(options);//调用downloadFile开始下载
        console.log(ret.jobId); //打印一下看看jobId
        ret.promise.then(res => {
            //下载完成时执行
            console.log(res);
            console.log('下载成功');
        }).catch(err => {
                //下载出错时执行
                console.log(err)
            });
    }

    //打开db库
    openDb(){
        let database_name = "react_asset.db";//数据库文件
        let database_version = "1.0";//版本号
        let database_displayname = "MySQLite";
        let database_size = -1;//-1应该是表示无限制
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            ()=>{
                this._successDB('open');
            },
            (err)=>{
                this._errorDB('open',err);
            });
    }
    _successDB(name){
        console.log("SQLiteStorage "+name+" success");
    }
    _errorDB(name, err) {
        console.log("SQLiteStorage " + name +'error');
        console.log(err); //打印错误日志
    }

    //step1-----创建表
    create(){
        if(!db){
            this.openDb();
        }
        //创建用户表
        db.transaction((tx)=> {
            tx.executeSql('CREATE TABLE IF NOT EXISTS USER(' +
                'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                'name VARCHAR,'+
                'age VARCHAR,' +
                'sex VARCHAR)'
                , [], ()=> {
                    this._successDB('executeSql');
                }, (err)=> {
                    this._errorDB('executeSql', err);
                });
        }, (err)=> {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息
            this._errorDB('transaction', err);
        }, ()=> {
            this._successDB('transaction');
        })
    }
    //step2---插入表
    insert(){
        if (!db) {
            this.openDb();
        }
        let userData = [{name:'张三',age:'20',sex:'男'},{name:'李四',age:'21',sex:'男'},{name:'王五',age:'22',sex:'男'}];
        for(let i=0;i<=10000;i++){
            userData.push({name:'张三',age:'20',sex:'男'});
        }
        let len = userData.length;
        let sql = 'INSERT INTO user(name,age,sex) values';
        db.transaction((tx)=>{
           // let params = [];
            for(let user of userData){
                let params = [];
                let name= user.name;
                let age = user.age;
                let sex = user.sex;
               // sql += '(?,?,?),';
                sql = 'INSERT INTO user(name,age,sex) values(?,?,?)'
                params.push(name);params.push(age);params.push(sex);
                tx.executeSql(sql,params,(tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('Insert success');
                        } else {
                            console.log('Insert failed');
                        }
                    }
                );
            }
            sql = sql.substring(0,sql.length-1);
            // tx.executeSql(sql,params,(tx, results) => {
            //         if (results.rowsAffected > 0) {
            //             console.log('Insert success');
            //         } else {
            //             console.log('Insert failed');
            //         }
            //     }
            // );
        },(error)=>{
            this._errorDB('transaction', error);
            ToastAndroid.show("数据插入失败",ToastAndroid.SHORT);
        },()=>{
            this._successDB('transaction insert data');
            ToastAndroid.show("成功插入 "+len+" 条用户数据",ToastAndroid.SHORT);
        });
    }
    //step3---查询表
    inquire(){
        if(!db){
            this.openDb();
        }
        db.transaction((tx)=>{
            tx.executeSql("select * from user", [],(tx,results)=>{
                let len = results.rows.length;
                var arr = [];
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                   // alert(JSON.stringify(u));
                   arr.push(u);
                }
                this.setState({dbData:arr});
            });
        },(error)=> {//打印异常信息
            console.log(error);
        });
    }
    //step4---删除表
    delete(){
        if (!db) {
            this.openDb();
        }
        db.transaction((tx)=>{
            tx.executeSql('delete from user',[],()=> {
                this._successDB('delete');
            }, (err)=> {
                this._errorDB('delete', err);
            });
        })
    }
    //渲染列表数据
    renderData(data){
        return (
            <View style={styles.list}>
                <Text>{data.item.name}</Text>
                <Text>{data.item.age}</Text>
                <Text>{data.item.sex}</Text>
            </View>
        );
    }
    //生成列表的唯一主键
    _keyExtractor = (item, index) => {
        return item.id;
    }
    render() {
        return (
            <View>
                <Button onPress={this.download} title="下载db库"/>
                <Button onPress={this.create} title="创建表"/>
                <Button onPress={this.insert} title="插入表"/>
                <Button onPress={this.inquire} title="查询表"/>
                <Button onPress={this.delete} title="删除表"/>

                <FlatList
                    data={this.state.dbData}
                    renderItem={this.renderData.bind(this)}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },

    back:{
        paddingLeft:20,
    },
    list:{
       display:'flex',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop:10
    }
});
