/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

// import {Navigator} from 'react-native-deprecated-custom-components'
import Home from './home/Home'
import Monitor from './monitor/Monitor'
import Alarm from './alarm/Alarm'
import Function from './function/Function'
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './my/MyPage'
import Toast,{DURATION} from 'react-native-easy-toast'
import BaseComponent from './BaseComponent'
export const ACTION_HOME={A_SHOW_TOAST:'showToast',A_RESTART:'restart',A_THEME:'theme'};
export const FLAG_TAB={
    flag_homeTab: 'tb_home',
    flag_monitorTab: 'tb_monitor',
    flag_alarmTab: 'tb_alarm',
    flag_functionTab: 'tb_function',
    flag_popularTab:'tb_popular',
    flag_trendingTab:'tb_trending',
    flag_favoriteTab:'tb_favorite',
    flag_my:'tb_my'
};
// import codePush from 'react-native-code-push'
export default class Main extends BaseComponent {
    constructor(props) {
        super(props);
        let selectedTab=this.props.selectedTab?this.props.selectedTab:'tb_home';
        this.state = {
            selectedTab: selectedTab,
            theme:this.props.theme,
}
}



    /**
     * 向CodePush服务器检查更新
     */
    // update(){
    //     codePush.sync({
    //         updateDialog: {
    //             appendReleaseDescription: true,
    //             descriptionPrefix:'更新内容',
    //             title:'更新',
    //             mandatoryUpdateMessage:'',
    //             mandatoryContinueButtonLabel:'更新',
    //         },
    //         mandatoryInstallMode:codePush.InstallMode.ON_NEXT_RESTART,
    //     });
    // }
    componentDidMount(){

        super.componentDidMount();
        this.listener = DeviceEventEmitter.addListener('ACTION_HOME',
            (action,params) => this.onAction(action,params));
        // this.update();
    }

    /**
     * 通知回调事件处理
     * @param action
     * @param params
     */
    onAction(action,params){
        if(ACTION_HOME.A_RESTART===action){
            this.onRestart(params)
        }else if(ACTION_HOME.A_SHOW_TOAST===action){
            this.toast.show(params.text,DURATION.LENGTH_LONG);
        }
    }
    componentWillUnmount(){
        super.componentWillUnmount();
        if (this.listener) {
            this.listener.remove();
        }
    }

    /**
     * 重启首页
     * @param jumpToTab 默认显示的页面
     */
    onRestart(jumpToTab){
        this.props.navigator.resetTo({
            component:HomePage,
            params:{
                ...this.props,
                selectedTab:jumpToTab
            }
        })
    }
    _renderTab(Component, selectedTab, title, renderIcon,badge) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
                title={title}
                renderIcon={() => <Image style={styles.image}
                                         source={renderIcon}/>}
                renderSelectedIcon={() =><Image style={[styles.image, this.state.theme.styles.tabBarSelectedIcon]}
                                                source={renderIcon}/>}
                renderBadge={()=>{
                    let textData = badge;
                    if (textData) {
                        return (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{textData}</Text>
                            </View>
                        )
                    }

                }}
                    onPress={() => this.setState({selectedTab: selectedTab})}>
                <Component {...this.props} theme={this.state.theme}/>
            </TabNavigator.Item>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTab(Home,'tb_home','首页',require('../../res/Image/Tab/tab_home_nor.png'),2)}
                    {this._renderTab(Monitor,'tb_monitor','监控',require('../../res/Image/Tab/tab_monitor_nor.png'),null)}
                    {this._renderTab(Alarm,'tb_alarm','告警',require('../../res/Image/Tab/tab_alarm_nor.png'),123)}
                    {this._renderTab(Function,'tb_function','功能',require('../../res/Image/Tab/tab_subsystem_nor.png'),null)}
                    {/*{this._renderTab(PopularPage,'tb_popular','告警',require('../../res/images/ic_polular.png'))}*/}
                    {/*{this._renderTab(TrendingPage,'tb_trending','趋势',require('../../res/images/ic_trending.png'))}*/}
                    {/*{this._renderTab(FavoritePage,'tb_favorite','收藏',require('../../res/images/ic_favorite.png'))}*/}
                    {/*{this._renderTab(MyPage,'tb_my','我的',require('../../res/images/ic_my.png'))}*/}
                </TabNavigator>


                <Toast ref={(toast)=>this.toast=toast}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: 22,
        width: 22,
    },
    badge: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -2,
        right: -5,
        minWidth: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'red',
    },
    badgeText:{
        fontSize:10,
        color:'white'
    }
});

