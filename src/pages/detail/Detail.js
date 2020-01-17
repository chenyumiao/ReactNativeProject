import React,{ Component  } from 'react';
import {  StyleSheet, Text, View } from "react-native";


export default class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {
        const navigate = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text>this is detail page</Text>
                <Text style={styles.back}  onPress={() => navigate.goBack()}>back</Text>
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
    }
});
