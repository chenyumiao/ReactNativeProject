import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    Dimensions,
    PermissionsAndroid,
    TouchableOpacity,
    Animated,
    Button
} from 'react-native';

import { MapView,MapTypes,Geolocation,Overlay,MapApp } from 'react-native-baidu-map';
const { Marker} = Overlay;
const { width,height } = Dimensions.get('window');

export default class BaiduMapDemo extends Component {
    constructor() {
        super();
        this.state = {
            zoomControlsVisible: true,
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            mapType: MapTypes.NORMAL,
            zoom: 15,
            clickMessage: '',
            poiMessage: '',
            center:{
                longitude: 108.877889,
                latitude: 34.195759,
            },
            markers:[

            ],
            scrollYBottom:new Animated.Value(-150),
            marker:{title:'',longitude:'',latitude:''}
        };

    }
    componentDidMount(){

    }
    //地图加载完毕
    mapLoaded=(e)=>{
        Geolocation.getCurrentPosition('bd09ll')
            .then(data => {
                console.log('当前位置--'+JSON.stringify(data));
                this.setState({
                    center: {
                        longitude: data.longitude,
                        latitude: data.latitude
                    },
                    markers: [{
                        longitude: data.longitude,
                        latitude: data.latitude,
                        title: data.district + data.street,
                        uri:'bridgeicon'
                    },{longitude:108.87637050219752,latitude:34.189456238718584,title:'测试点1',uri:'roadicon'},
                        {longitude:108.8932227135647,latitude:34.19204665338615,title:'测试点2', uri:'slopeicon'}]
                })
            })
            .catch(e =>{
                console.warn(e, 'error');
            })
    }
    //地图空白处点击
    mapClick=(e)=>{
        let json = JSON.stringify(e);
        let oriMarkers = this.state.markers;
        Geolocation.reverseGeoCode(31.262580,121.609842).then(res =>{
            alert('222--'+JSON.stringify(res));
        }).catch(e =>{
            console.log(e);
        });
       let title = this.reverseCode(e.latitude,e.longitude,(title)=>{
           let arr = [{"longitude": e.longitude, "latitude": e.latitude, "title": title, uri: 'slopeicon'}];
           console.log(JSON.stringify(arr));
           this.setState({
               center: {
                   longitude: e.longitude,
                   latitude: e.latitude,
               },
               markers: arr.concat(oriMarkers),
           })
       });

    }
    //地图描点点击
    markerClick=(e)=>{
        this.setState({
            marker:{title:e.title,longitude:e.position.longitude,latitude:e.position.latitude},
        },function () {
            Animated.timing(
                this.state.scrollYBottom,
                {
                    toValue: 0,
                    duration: 500,   //动画时长500毫秒
                }
            ).start();
        });
    }
    //动画隐藏
    _hiddenTipView=()=>{
        Animated.timing(
            this.state.scrollYBottom,
            {
                toValue: -150,
                duration: 500,   //动画时长500毫秒
            }).start();
    }
    //反向地理编码
    reverseCode = (lat,lng,callback)=>{
        let fetchOptions = {
            method: 'get'
        };
        let url = 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=xcmGd36XOxnDtBId26f5K3X2rz7XwqdG&output=json&coordtype=bd09ll&location='+lat+','+lng;
        fetch(url, fetchOptions)
            .then((response) => response.text())
            .then((responseText) => {
                let response = JSON.parse(responseText);
                //console.log(JSON.stringify(response));
                callback(response.result.formatted_address);
            }).done();
    }
    openDrivingRoute() {
        const startPoint = {
            longitude: 113.904453,
            latitude: 22.544045,
            name: '地点1'
        };
        const endPoint = {
            longitude: 113.994453,
            latitude: 22.544045,
            name: '地点2'
        };
        MapApp.openDrivingRoute(startPoint, endPoint);
    }
    render() {
        const {marker,scrollYBottom} = this.state;

        return (
            <View style={styles.container}>
                <MapView
                    zoomControlsVisible={this.state.zoomControlsVisible} //默认true,是否显示缩放控件,仅支持android
                    trafficEnabled={this.state.trafficEnabled} //默认false,是否显示交通线
                    baiduHeatMapEnabled={this.state.baiduHeatMapEnabled} //默认false,是否显示热力图
                    mapType={this.state.mapType} //地图模式,NORMAL普通 SATELLITE卫星图
                    zoom={this.state.zoom} //缩放等级,默认为10
                    center={this.state.center} // 地图中心位置
                    onMapLoaded={this.mapLoaded.bind(this)}
                    onMarkerClick={this.markerClick.bind(this)}
                    onMapClick={this.mapClick.bind(this)}
                    style={styles.map}
                >
                    {this.state.markers.map(marker => (
                        <Marker
                            location={{longitude:marker.longitude,latitude:marker.latitude}}
                            title={marker.title}
                            icon={{ uri: marker.uri }}
                        />
                    ))}
                </MapView>



                    <Animated.View style={{ position:"absolute",left:0,bottom:scrollYBottom,height:150,width: width,backgroundColor:'#fff',zIndex:100}}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={this._hiddenTipView}>
                            <Text>{marker.title}</Text>
                            <Text>{marker.longitude}</Text>
                            <Text>{marker.latitude}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                <Text onPress={ () => this.openDrivingRoute() }  style={styles.drive}>驾车2</Text>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        position:'relative',
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    map: {
        width: width,
        height: height - 80,
    },
    list: {
        flexDirection: 'row',
        paddingLeft: 10,
        marginBottom: 5,
    },
    drive:{
        position:'absolute',
        left:0,
        bottom:120,
        backgroundColor:'green',
        zIndex:99,
        color:'#fff'
    }
});