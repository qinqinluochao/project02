/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
} from 'react-native'
import Main from './Main'
import Login from './Login'
import ThemeDao from '../expand/dao/ThemeDao'
import SplashScreen from 'react-native-splash-screen'
import DataRepository from '../expand/dao/Data'
let dataRepository  = new DataRepository();
export default class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state={
            result: null,
        }
    }

    componentDidMount() {
        new ThemeDao().getTheme().then((data)=>{
            this.theme=data;
        });
        // this.timer=setTimeout(()=> {
        //     // SplashScreen.hide();
        //     this.props.navigator.resetTo({
        //         component: Login,
        //         params:{
        //             theme:this.theme,
        //             ...this.props
        //         }
        //     });
        // }, 1000);

        this._checkNeedUpdate().then((isUpdate)=>{
            if (isUpdate === false) {
                return this._checkUser()
            } else {
                // 欢迎页面有关跟新交互代码逻辑
            }
        }).then((isSaved)=> {
            isSaved
                ? this._toLogin()
                : this._pushToLoginPage();
        })
    }

    componentWillUnmount(){
        // 组件卸载后取消定时器，防止多余异常出现
        // this.timer && clearTimeout(this.timer);
    }

    /**
     * 验证app是否需要跟新
     * @returns {Promise}
     * @private
     */
    _checkNeedUpdate() {
        let url='/app/v2/version/get';
        let params = {
            appId: 'YiYi',
            os: Platform.OS,
        };
        return new Promise((resolve, reject)=> {
            dataRepository.fetchNetRepository('POST', url, params)
                .then(response=>{
                    dataRepository.fetchLocalRepository(url).then((localData)=> {
                            // console.log(localData);
                            // console.log(response.data);
                            // 根据是否需要跟新执行不同逻辑
                            if (response.data.version === localData.version){
                                resolve(false);
                            } else {
                                dataRepository.saveRepository(url, response.data)
                                    .then((error)=>{
                                        reject(error);
                                    });
                            }
                        })
                        .catch(error=>{
                            reject(error)
                        });

                    this.setState({
                        result: response
                    })
                })
        });
    }

    /**
     * 验证用户是否已经登录
     * @returns {Promise}
     * @private
     */
    _checkUser(){
        return new Promise((resolve, reject)=> {
            dataRepository.fetchLocalRepository('user')
                .then((userData)=>{
                    // console.log(userData, '获取本地用户信息');
                    if (userData) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(error=>{
                    reject(error)
                })
        })
    }

    /**
     * 用户已经登录，获取本地用户信息，发送登录操作
     * @private
     */

    _toLogin(){
        dataRepository.fetchLocalRepository('user').then((userData)=>{
            let url = '/app/v2/user/login';
            let params = {
                appId: 'YiYi',
                username: userData.username,
                password: userData.password
            };
            dataRepository.fetchNetRepository('POST', url, params)
                .then((response)=> {
                    if (response['success'] === true){
                        this._pushToMainPage();
                    } else {
                        console.log('response.info')
                    }
                })
                .catch(error=> {
                    console.log(error);
                })
        });
    }

    _pushToMainPage(){
        this.props.navigator.resetTo({
            component: Main,
            params: {
                ...this.props,
                theme: this.theme
            }
        })
    }

    _pushToLoginPage(){
        this.props.navigator.resetTo({
            component: Login,
            params: {
                ...this.props,
                theme: this.theme
            }
        })
    }

    render() {
        // return null;
        let newVersion = JSON.stringify(this.state.result);
        let  oldVersion;
        dataRepository.fetchLocalRepository('/app/v2/version/get')
            .then((result)=>{
                oldVersion = result;
                alert(JSON.stringify(oldVersion));
            });
        return(
            <View style={styles.container}>
                <Text>检查是否跟新</Text>
                <Text>老版本信息</Text>
                <Text>{newVersion}</Text>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tips: {
        fontSize: 29
    }
})
