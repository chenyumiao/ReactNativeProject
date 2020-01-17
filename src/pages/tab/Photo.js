import React from 'react';
import {
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import history from '../../common/history';
const { width,height } = Dimensions.get('window');

export default class Photo extends React.Component {
    //初始化一个对象，path本地路径
    _imageObj = {
        path: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            imageUrl: 'timg',
            imageArr:[]
        }
    }

    _beginUpImage =()=> {
        let params = {
            path:  this._imageObj['path'],    //本地文件地址
        };
        this.uploadImage('uploadImage', params)
            .then( res=>{
                console.log('success');
            }).catch( err=>{
            //请求失败
            console.log('flied');
        })
    };

    uploadImage =(url, params)=> {
        return new Promise(function (resolve, reject) {
            var ary = params.path.split('/');
            console.log('2222222' + ary);
            let formData = new FormData();
            let file = {uri: params.path, type: 'multipart/form-data', name: ary[ary.length-1]};
            formData.append("file", file);

            fetch('http://localhost:8010/birds/' + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'identity'
                },
                body: JSON.stringify(formData),
            }).then((response) => response.json())
                .then((responseData)=> {
                    console.log('uploadImage', responseData);
                    resolve(responseData);
                })
                .catch((err)=> {
                    console.log('err', err);
                    reject(err);
                });
        });
    };

    //从相册中选择单张图片：
    _openPicker =()=> {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {
            console.log("111111" + JSON.stringify(image));
            this.setState({
                imageUrl: {uri: image['path']},
                imageArr:[{path:image['path']}]
            });
            this._imageObj = image;
        })
    };
    //从相册中选择多张图片：
    _openTwoPicker =()=> {
        ImagePicker.openPicker({
            multiple: true
        }).then(images => {
            console.log('multiple---'+JSON.stringify(images));
            let arr = [];
            for(let item of images){
                arr.push({'path':item.path});
            }
            this.setState({
                imageArr:arr
            })
        });
    };
    //拍照：
    _openCamera =()=> {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.setState({
                imageUrl: {uri: image['path']},
                imageArr:[{path:image['path']}]
            });
        });
    };

    render() {
        const {imageArr} = this.state;
        return (
            <ScrollView  style={{height:height}}>
                <View style={styles.container}>
                    { imageArr.length>0 && imageArr.map(imageItem=> (
                    <Image style={{width: 300, height: 300}}
                           source={{uri:imageItem.path}}/>
                   ))}
                    <TouchableOpacity style={{width: 80, height: 60, backgroundColor: '#ffaaaa', marginTop: 20,flex: 1,justifyContent: 'center', alignItems: 'center'}}
                                      onPress={this._openPicker}>
                        <Text>从相册中选择单张图片</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 80, height: 60, backgroundColor: '#ffaaaa', marginTop: 20,flex: 1,justifyContent: 'center', alignItems: 'center'}}
                                      onPress={this._openTwoPicker}>
                        <Text>从相册中选择多张图片</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 80, height: 60, backgroundColor: '#ffaaaa', marginTop: 20,flex: 1,justifyContent: 'center', alignItems: 'center'}}
                                      onPress={this._openCamera}>
                        <Text>拍照</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 80, height: 60, backgroundColor: '#ffaa00', marginTop: 20,flex: 1,justifyContent: 'center', alignItems: 'center'}}
                                      onPress={this._beginUpImage}>
                        <Text>上传图片</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 80, height: 60, backgroundColor: 'green', marginTop: 20,flex: 1,justifyContent: 'center', alignItems: 'center'}}
                                      onPress={()=>history.push(this,'/List', {name: 'cym'})}>
                        <Text>跳转list</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150,
    },
});

