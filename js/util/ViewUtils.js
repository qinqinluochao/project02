/**
 * ViewUtils
 * @flow
 **/
'use strict'

import React from 'react';
import {
    TouchableHighlight,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';
let {width, height} = Dimensions.get('window');
export default class ViewUtils {
    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param icon 左侧图标
     * @param text 显示的文本
     * @param tintStyle 图标着色
     * @param expandableIco 右侧图标
     * @return {XML}
     */
    static getSettingItem(callBack, icon, text, tintStyle, expandableIco) {
        return (
            <TouchableHighlight
                onPress={callBack}>
                <View style={[styles.setting_item_container]}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        {icon ?
                            <Image source={icon} resizeMode='stretch'
                                   style={[{opacity: 1, width: 16, height: 16, marginRight: 10,}, tintStyle]}/> :
                            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}}/>
                        }
                        <Text>{text}</Text>
                    </View>
                    <Image source={expandableIco ? expandableIco : require('../../res/images/ic_tiaozhuan.png')}
                           style={[{
                               marginRight: 10,
                               height: 22,
                               width: 22,
                               alignSelf: 'center',
                               opacity: 1
                           }, tintStyle]}/>
                </View>
            </TouchableHighlight>
        )
    }

    /**
     * 获取个人信息页的Item
     * @param callBack 单击item的回调
     * @param leftIcon 左侧图标
     * @param text 显示的文本
     * @param expandableIco 右侧图标
     * @param rightText 显示右侧文本
     * @return {XML}
     */
    static getCellItem(callBack, leftIcon, text, expandableIco, rightText) {
        return (
            <TouchableHighlight
                onPress={callBack}>
                <View style={[styles.cell_item_container]}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        {leftIcon ?
                            <Image source={leftIcon} resizeMode='stretch'
                                   style={{opacity: 1, width: 16, height: 16, marginRight: 14}}/> :
                            <View style={{opacity: 1, width: 0, height: 0, marginRight: 10,}}/>
                        }
                        <Text style={{color: 'rgb(126,126,126)', fontSize: 14}}>{text}</Text>
                    </View>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        {expandableIco ?
                            <Image source={expandableIco}
                                   style={{
                                       height: 22,
                                       width: 22,
                                       opacity: 1
                                   }}/> :
                            <Text
                                numberOfLines={2}
                                style={{
                                    color: 'rgb(68,68,68)',
                                    fontSize: 14,
                                    width: width * 0.6,
                                    textAlign: 'right'
                                }}>{rightText ? rightText : '--'}</Text>
                        }
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    /**
     * 获取代理商cell
     * @param leftIcon 左侧图标
     * @param text 显示的文本
     * @param expandableIco 右侧图标
     * @param rightText 显示右侧文本
     * @return {XML}
     */
    static getCompanyCellItem(leftIcon, text, expandableIco, rightText) {
        return (
            <View style={[styles.cell_item_container]}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {
                        leftIcon ?
                            <Image source={leftIcon}
                                   resizeMode='stretch'
                                   style={{opacity: 1, width: 16, height: 16, marginRight: 14}}/> :
                            <View></View>


                    }
                    <Text style={{color: 'rgb(126,126,126)', fontSize: 14, textAlign: 'left'}}>{text}</Text>
                </View>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {expandableIco ?
                        <Image source={expandableIco}
                               style={{
                                   height: 22,
                                   width: 22,
                                   opacity: 1
                               }}/> :
                        <Text style={{color: 'rgb(68,68,68)', fontSize: 14}}>{rightText ? rightText : '--'}</Text>
                    }
                </View>
            </View>
        )
    }

    static getLeftButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8}}
            onPress={callBack}>
            <Image
                style={{width: 26, height: 26,}}
                source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
        </TouchableOpacity>
    }

    static getRightButton(title, callBack) {
        return <TouchableOpacity
            style={{alignItems: 'center',}}
            onPress={callBack}>
            <View style={{marginRight: 10}}>
                <Text style={{fontSize: 20, color: '#FFFFFF',}}>{title}</Text>
            </View>
        </TouchableOpacity>
    }

    /**
     * 获取更多按钮
     * @param callBack
     * @returns {XML}
     */
    static getMoreButton(callBack) {
        return <TouchableHighlight
            underlayColor={'transparent'}
            ref="moreMenuButton"
            style={{padding: 5}}
            onPress={callBack}
        >
            <View style={{paddingRight: 8}}>
                <Image
                    style={{width: 24, height: 24,}}
                    source={require('../../res/images/ic_more_vert_white_48pt.png')}
                />
            </View>
        </TouchableHighlight>
    }

    /**
     * 获取分享按钮
     * @param callBack
     * @returns {XML}
     */
    static getShareButton(callBack) {
        return <TouchableHighlight
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Image
                style={{width: 20, height: 20, opacity: 0.9, marginRight: 10, tintColor: 'white'}}
                source={require('../../res/images/ic_share.png')}/>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    cell_item_container: {
        backgroundColor: 'white',
        padding: 10, height: 44,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
})