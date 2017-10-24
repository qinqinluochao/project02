/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ImageBackground,

} from 'react-native'

import Main from './Main'
import DataRepository from '../expand/dao/Data'
import CompanyPage from './my/CompanyListPage'
import ForgetPasswordPage from './my/ForgetPasswordPage'
import SetUpServer from './my/SetUpServer'
import Storage from '../common/StorageClass'
import JPushModule from 'jpush-react-native';

let dataRepository = new DataRepository();
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let storage = new Storage();

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushMsg: '',
            username: '',
            userpwd: '',


        }
    }

    loginInMainPage() {
        let url = '/app/v2/user/login';
        let params = {
            appId: 'YiYi',
            username: this.state.username,
            password: this.state.userpwd
        };
        //进行登录

        dataRepository.fetchNetRepository('POST', url, params)
            .then((response) => {

                if (response['success'] === true) {

                    // 保存用户登录信息
                    dataRepository.saveRepository('user', params)
                        .then(() => {
                            console.log('用户信息已经保存');
                        });
                    //根据登录返回 classes 判断是代理商还是普通用户
                    // alert('登录成功');

                    if (response.data.classes === '代理商用户') {
                        // alert('代理商');

                        this._pushToCompanyPage();

                    } else {
                        alert('普通用户');
                        // 获取用户信息 主要保存：companyId、userId
                        //
                        let userUrl = '/app/v2/user/info/get';
                        let UserParams = {
                            userId: response.data.userId,
                        };
                        // alert(JSON.stringify(response.data));

                        dataRepository.fetchNetRepository('POST', userUrl, UserParams)
                            .then((response) => {
                                // alert(JSON.stringify(response.data));

                                if (response['success'] === true) {
                                    //获取企业 主要保存企业唯一码：stamp

                                    let companyUrl = '/app/v2/company/info/get';
                                    let companyParams = {
                                        companyId: response.data.companyId,
                                    };
                                    dataRepository.fetchNetRepository('POST', companyUrl, companyParams)
                                        .then((companyResponse) => {
                                            if (companyResponse['success'] === true) {
                                                // 保存用户登录返回信息
                                                // alert(JSON.stringify(companyResponse.data));
                                                this.setState({
                                                   tag: companyResponse.data.stamp,
                                                   alias:  companyResponse.data.userId,
                                                });
                                                dataRepository.saveRepository(url, {
                                                    companyId: response.data.companyId,
                                                    stamp: companyResponse.data.stamp,
                                                    userId: response.data.userId
                                                })
                                                    .then(() => {

                                                    let tag = companyResponse.data.stamp;
                                                    let alias = response.data.userId;
                                                        JPushModule.setTags()
                                                        {

                                                            if (tag !== undefined) {
                                                                /*
                                                                * 请注意这个接口要传一个数组过去，这里只是个简单的示范
                                                                */
                                                                JPushModule.setTags([tag], () => {
                                                                    console.log("Set tag succeed");
                                                                }, () => {
                                                                    console.log("Set tag failed");
                                                                });
                                                            }
                                                        }
                                                        JPushModule.setAlias()
                                                        {
                                                            if (alias !== undefined) {
                                                                JPushModule.setAlias(alias, () => {
                                                                    console.log("Set alias succeed");
                                                                }, () => {
                                                                    console.log("Set alias failed");
                                                                });
                                                            }
                                                        }


                                                        this._pushToMainPage();
                                                    })
                                                    .catch(error => {
                                                        alert(error)
                                                    });
                                            } else {
                                                console.log('获取数据失败')

                                            }
                                        });

                                } else {
                                    console.log('获取数据失败')
                                }
                            })
                            .catch(error => {
                                alert(error)
                            });
                    }

                } else {
                    console.log('获取数据失败')
                    alert(JSON.stringify(response.info));
                }

            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * 路由到主页面
     * @private
     */
    _pushToMainPage() {
        this.props.navigator.replace({
            component: Main,
            params: {
                theme: this.theme,
                ...this.props
            }
        });
    }

    /**
     * 登录到企业列表
     * @private
     */
    _pushToCompanyPage() {
        this.props.navigator.push({
            component: CompanyPage,
            params: {
                theme: this.theme,
                ...this.props
            }
        });
    }

    /**
     * 登录到手机验证
     * @private
     */
    _pushToForgetPasswordPage() {
        this.props.navigator.push({
            component: ForgetPasswordPage,
            params: {
                theme: this.theme,
                ...this.props
            }
        });
    }

    /**
     * 登录到服务器设置
     * @private
     */
    _pushToSetUpServerPage() {
        this.props.navigator.push({
            component: SetUpServer,
            params: {
                theme: this.theme,
                ...this.props
            }
        });
    }

    /*设置背景图片*/

    render() {
        return (<View style={styles.container}>

            <ImageBackground style={styles.bgImageSize}
                             source={require('../../res/Image/Login/ic_login_bg.png')}>
                <Image style={styles.loginImg}
                       source={require('../../res/Image/Login/ic_login_logo.png')}/>
                <Text style={styles.logoText}>义益云监控</Text>

                <View style={styles.loginTextBg}>
                    <View style={styles.item}>
                        <Image source={require('../../res/Image/Login/ic_user_key_nor.png')}
                               style={styles.iconKeyStyle}/>
                        <TextInput
                            ref="inputLoginName"
                            // autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholder="请输入用户名"
                            clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({username: input})}>
                        </TextInput>
                    </View>
                    <View style={styles.item}>
                        <Image source={require('../../res/Image/Login/ic_password_key_nor.png')}
                               style={styles.iconKeyStyle}/>
                        <TextInput
                            ref="inputLoginPwd"
                            underlineColorAndroid="transparent"
                            placeholder="请输入密码"
                            clearTextOnFocus={true}
                            secureTextEntry={true}
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({userpwd: input})}>
                        </TextInput>
                    </View>
                </View>
            </ImageBackground>

            <ImageBackground style={styles.loginBtnBgImg} source={require('../../res/Image/Login/ic_loginBtn_bg.png')}>

                <TouchableOpacity style={styles.login}
                                  underlayColor='transparent'
                                  onPress={() => {
                                      this.loginInMainPage()
                                  }}>
                    <Text style={styles.loginText}>登录</Text>
                </TouchableOpacity>
            </ImageBackground>

            <View style={styles.viewBottomStyle}>
                <View>
                    <TouchableOpacity onPress={() => {
                        this._pushToForgetPasswordPage()
                    }}>
                        <Text style={styles.textBottomStyle}>忘记密码</Text>
                    </TouchableOpacity>

                </View>
                <View>
                    <Text> | </Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => {
                        this._pushToSetUpServerPage()
                    }}>
                        <Text style={styles.textBottomStyle}>服务器设置</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </View>)
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(235,235,235)'

    },
    login: {
        height: 40,
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 18,
        alignSelf: 'center',
        color: '#FFF'
    },
    bgImageSize: {
        marginTop: 0,
        left: 0,
        right: 0,
        width: width,
        height: height * 0.5,
    },
    loginImg: {
        marginTop: 60,
        alignSelf: 'center',
    },
    logoText: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: '600'
    },
    loginTextBg: {
        backgroundColor: 'white',
        alignSelf: 'center',
        width: width - 30,
        height: height * 0.3,
        marginTop: 49,
        borderRadius: 5,
        shadowColor: 'rgba(19,171,228,0.5)',
        shadowOffset: {h: 15, w: 20},
        shadowRadius: 20,
        shadowOpacity: 0.7,
    },
    loginBtnBgImg: {
        marginTop: 85,
        width: width * 0.7,
        height: 40,
        alignSelf: 'center',
    },
    iconKeyStyle: {
        left: 0,
        marginTop: 20,
    },
    textInputSize: {
        marginTop: 20,
        left: 15,
        width: width * 0.69,
        height: 50,
        textAlign: 'left'
    },
    viewBottomStyle: {
        marginTop: width * 0.40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBottomStyle: {
        fontSize: 15,
        color: 'rgb(102,102,102)'
    }


});
