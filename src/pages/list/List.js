import React,{ Component  } from 'react';
import { Image, FlatList, StyleSheet, Text, View,Picker,Platform,Button,TouchableOpacity,ScrollView} from "react-native";
import AppStorage from '../../common/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { observer, inject } from "mobx-react";
import {colors} from '../../assets/styles/colors-theme';
import history from '../../common/history';
import ListService from '../../services/ListService';

@inject(["listStore"]) // 注入对应的store
@observer // 监听当前组件
export default class SampleAppMovies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            language:'',
            date: new Date(),
            mode: 'date',
            show: false,
            dateStr:'',
            name:props.navigation.state.params.name
        };
        // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向会变为空
        // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
       // this.fetchData = this.fetchData.bind(this);

        this.store = this.props.listStore; //通过props来导入访问已注入的store
        this.listService = new ListService(props);
    }
    static navigationOptions = {
        title:'List', //设置导航条标题
    };
    async componentDidMount() {
        let params = {
            'supervisionCategory':1,
            'supervisionType':1,
            'supervisionResult':null,
            'supervisionStatus':null,
            'supervisionCycle':'2020-01',
            'commonField':null,
            'orderColumn':'createTime',
            'orderDirection':'desc'
        }
        let token = await AppStorage.get('token');
        if(!token){
            const data = await this.listService.getToken();
            AppStorage.save('token',data.result);
        }
        const res = await this.listService.getList(params);
       // alert(JSON.stringify(res))
        if(res && res.records){
            this.setState({
                data:res.records
            });
        }
    }
    setDate = (event, date) => {
        date = date || this.state.date;
        let str = this.formatDate(date,'yyyy-MM-dd hh:mm:ss');

        this.setState({
            show: false ,
            date,
            dateStr:str
        });
    }
    formatDate = (date,fmt)=>{
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;

    }
    show = mode => {
        this.setState({
            show: true,
            mode,
        });
    }
    datepicker = () => {
        this.show('date');
    }
    timepicker = () => {
        this.show('time');
    }

    render() {
        const { show, date, mode,dateStr,name } = this.state;
        const { list, timer } = this.store;


        return (
            <View style={{marginTop:32}}>
                    <Text>上个页面传过来的参数：{name}</Text>
                    <View>
                        <FlatList
                            data={this.state.data}
                            renderItem={this.renderItem.bind(this)}
                            style={styles.list}
                        />
                    </View>
                    <View>
                        <Picker
                            selectedValue={this.state.language}
                            style={{height: 50, width: 100}}
                            onValueChange={(itemValue, itemIndex) =>
            this.setState({language: itemValue})
          }>
                            <Picker.Item label="Java" value="java" />
                            <Picker.Item label="JavaScript" value="js" />
                        </Picker>
                    </View>

                    <View style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%'}}>
                        <View>
                            <Button onPress={this.datepicker.bind(this)} title="Show date picker!" />
                        </View>
                        <View style={{marginTop:20}}>
                            <Button onPress={this.timepicker.bind(this)} title="Show time picker!" />
                        </View>
                        { show && <DateTimePicker value={date}
                                                  mode={mode}
                                                  is24Hour={true}
                                                  display="default"
                                                  onChange={this.setDate.bind(this)} />
                        }
                        <View><Text>{dateStr}</Text></View>
                    </View>

                    <View>
                        <Button title="点击" onPress={()=>this.store.tick()}></Button>
                        <View><Text>{timer}</Text></View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={() => history.push(this, '/Detail', {name: 'suannai'})}>
                        <Text style={styles.buttonText}>跳转到Detail</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => LoadingComponentRef.showLoading()}>
                        <Text style={styles.buttonText}>出现全局loading</Text>
                    </TouchableOpacity>


            </View>
        );
    }

    renderItem({ item }) {
        // { item }是一种“解构”写法，请阅读ES2015语法的相关文档
        // item也是FlatList中固定的参数名，请阅读FlatList的相关文档
        const navigate = this.props.navigation;
        return (
            <View style={styles.container} >
                <Text style={styles.title}>{item.assetName}</Text>
                <Text style={styles.year}>{item.diseaseType}</Text>
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
        backgroundColor: "#F5FCFF",
        marginBottom:10
    },
    rightContainer: {
        flex: 1
    },
    title: {
        marginRight:10,
        textAlign: "center"
    },
    year: {
        textAlign: "center"
    },
    thumbnail: {
        width: 53,
        height: 81
    },
    list: {
        paddingTop: 20,
        backgroundColor: "#F5FCFF"
    },
    button: {
        marginTop: 20,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.statusBarColor
    },
    buttonText: {
        color: '#fff'
    }
    });
