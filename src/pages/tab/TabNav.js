/**
 * Created by cym on 2020/1/14.
 */
import React,{ Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
// 矢量图
import AntDesign from 'react-native-vector-icons/AntDesign';
// import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../assets/styles/colors-theme';
import DatabaseScreen from './Database';
import MapScreen from './Map';
import PhotoScreen from './Photo';
import PermissionScreen from "./Permission";

export const TabNav = createBottomTabNavigator({
        Permission: {
            screen: PermissionScreen,
            navigationOptions: {
                tabBarLabel: '操作权限',
                tabBarIcon: ({focused, tintColor}) => (
                    <AntDesign focused={focused} name="mail" size={18} color={tintColor}/>
                )
            }
        },
        Database: {
            screen: DatabaseScreen,
            navigationOptions: {
                tabBarLabel: '数据库',
                tabBarIcon: ({focused, tintColor}) => (
                    <AntDesign focused={focused} name="setting" size={18} color={tintColor}/>
                )
            }
        },
        Map: {
            screen: MapScreen,
            navigationOptions: {
                tabBarLabel: '地图',
                tabBarIcon: ({focused, tintColor}) => (
                    <AntDesign focused={focused} name="enviromento" size={18} color={tintColor}/>
                )
            }
        },
        Photo: {
            screen: PhotoScreen,
            navigationOptions: {
                tabBarLabel: '照片',
                tabBarIcon: ({focused, tintColor}) => (
                    <AntDesign focused={focused} name="contacts" size={18} color={tintColor}/>
                )
            }
        }
    }, {
        tabBarOptions: {
            // label和icon的前景色 活跃状态下（选中）
            activeTintColor: colors.statusBarColor,
            // label和icon的背景色 不活跃状态下
            inactiveBackgroundColor: colors.white,
            // label和icon的前景色 不活跃状态下(未选中)
            inactiveTintColor: colors.dark,
            showIcon: true,
            showLabel: true,
        }
    }
);
