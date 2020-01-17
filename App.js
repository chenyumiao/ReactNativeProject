import React,{ Component } from 'react';
import {StatusBar} from 'react-native';
import { Provider,observer } from "mobx-react";
import {SafeAreaView} from 'react-navigation'
import Router from './src/pages/Router';
import store from './src/stores/index';
import {colors} from './src/assets/styles/colors-theme';
import {handleNavigationChange} from './src/common/history';
import LoadingView from './src/common/loading';


@observer
export default class App extends Component {

    render() {
        return (
            <Provider {...store}>
                <SafeAreaView
                    style={{flex: 1}}
                    forceInset={{
                      top: 'always',
                      bottom: 'always'
                    }}>
                    <StatusBar
                        animated={true}
                        barStyle={'light-content'}
                        backgroundColor={colors.statusBarColor}
                        translucent={true}/>
                    <Router onNavigationStateChange={handleNavigationChange}/>
                    <LoadingView ref={(ref) => {
                        global.LoadingComponentRef = ref;
                    }}/>
                </SafeAreaView>
            </Provider>
        );
    }
}