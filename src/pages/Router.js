/**
 * Created by cym on 2020/1/14.
 */
import {createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import List from './list/List';
import Detail from './detail/Detail';
import {TabNav} from './tab/TabNav';

function generateRoute(path, screen) {
    return {
        path,
        screen
    }
}


const stackRouterMap = {
    List: generateRoute('/List', List),
    Detail: generateRoute('/Detail', Detail),
    main: TabNav
}

const stackNavigate = createStackNavigator(stackRouterMap, {
    initialRouteName: 'main',
    mode: 'card',
    headerMode: 'none'
})

const Router = createAppContainer(stackNavigate)

export default Router

