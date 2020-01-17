/**
 * Created by cym on 2020/1/15.
 */
import React, { Component } from 'react'
import {View,Text, Dimensions, StyleSheet,Animated,Easing,TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window')

export default class LoadingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            rotateX:new Animated.Value(0),
        }

        this.rotateAnimated = Animated.timing(
            this.state.rotateX,
            {
                toValue: 360,
                duration: 1000,
                easing: Easing.linear,
            }
        );
    }
    showLoading=()=>{
        this.setState({visible:true});
    }
    hideLoading=()=>{
        this.setState({visible:false});
    }
    componentDidMount(){
      this._startAnimated();
    }
    _startAnimated() {
        this.state.rotateX.setValue(0);
        this.rotateAnimated.start(() => this._startAnimated());
    }
    render(){
        const rotateX = this.state.rotateX.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
        });
        if(this.state.visible){
            return (

                    <View style={styles.wrapper}>
                        <TouchableOpacity style={styles.mask} onPress={() => LoadingComponentRef.hideLoading()}>
                            <View style={styles.loading}>
                                <View><Text style={styles.title}>请求中</Text></View>
                                <Animated.View     style={{
                                    marginLeft:10,
                                    width: 20,
                                    height: 20,
                                    transform: [
                                    {rotate:rotateX},
                                ]
                            }}><AntDesign name="loading2" size={20} color="#fff"/></Animated.View>
                            </View>
                        </TouchableOpacity>
                    </View>

            )
        }else{
            return <View/>
        }
    }
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
    },
    loading:{
        position: 'absolute',
        top: height / 2 - 100,
        left: width / 2 - 70,
        width: 200,
        height: 140,
        display:'flex',
        flexDirection:'row'
    },
    title:{
        color:'#fff'
    },
});