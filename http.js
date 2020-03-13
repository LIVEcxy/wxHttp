/*
*
* @Description:基于wx.request 封装的ajax请求库params 和 wx.request参数格式相同
* @Version: 3.0
* @Autor: liusm
* @Date: 2019-12-12 16:21:16
* @LastEditors: liusm
* @LastEditTime: 2020-03-13 09:19:57
*
*   let upData = {
*      methods: 'POST',
*      url:'baidu.com/xx?a=1',
*      data:{
*        data_a:'A',
*        data_b:'B',
*      },
*      success: (res) => {
*        console.log('success',res)
*      },
*      error: (res) => {
*        console.log('error',res)
*      }
*    }
*    http.post(upData)
*
*   @api          服务接口名称
*   @params       服务接口拼接参数
*   @isShowMsg    是否需要默认弹窗         默认  true
*   @isCallBack   是否需要触发回调         默认  true
*
*/
'use strict'

const app = getApp();

const showMsg = (msg,isShowMsg = true) => {
    //  封装弹窗方法，避免多次判断isShowMsg设置项
    if(isShowMsg === false){
        //  判断isShowMsg是否设置不弹出默认弹窗
        return console.log(`isShowMsg is ${isShowMsg}`)
    }
    wx.showModal({
        title: '提示',
        showCancel: false,
        content: msg,
    })
}

const http = {
    post(params) {
        //  避免多次showLoading!
        wx.hideLoading()
        wx.showLoading({
            title: '加载中',
            mask: true
        })

        if (!params.hasOwnProperty('isCallBack')) {
            //  默认isCallBack为true
            params.isCallBack = true;
        }
        wx.request({
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            url: `${app.globalData.PubUrl}/Api/${params.api}?${params.params}`,
            data: params.data,
            success: (res) => {
                if(!params.isCallBack){
                    //  如设置isCallBack为false 则结束回调逻辑
                    return console.log('isCallBack is false');
                }

                switch (res.statusCode) {
                    case 200:
                        if (params.success) {
                            if (res.data.Code === 1 && res.data.WsCode === 1) {
                                params.success(res);
                            } else if (res.data.WsCode === -1000) {
                                wx.showModal({
                                  content: '亲，授权信息无效，请重新登录~',
                                  showCancel: false,
                                  success: function (res) {
                                    if (res.cancel) {
                                      //点击取消,默认隐藏弹框
                                    } else {
                                      //点击确定跳登录界面
                                      wx.navigateTo({
                                        url: '/pages/login/login',
                                      })
                                    }
                                  }
                                })
                              } else {
                                showMsg(res.data.Msg,params.isShowMsg)
                                if (params.fail) {
                                    params.fail(res)
                                }
                                else {
                                    throw "fail callback function is undefined"
                                }
                            };
                        } else {
                            throw "success callback function is undefined"
                        }
                        break;
                    case 404:
                        showMsg('资源未找到，请稍后重试',params.isShowMsg)
                    case 500:
                        showMsg('服务器错误，请稍后重试',params.isShowMsg)
                        break
                    default:
                        break;
                }
            },
            fail: function (res) {
                if(!params.isCallBack){
                    return console.log('isCallBack is false');
                }
                if (params.fail) {
                    showMsg(res.data.Msg,params.isShowMsg)
                    params.fail(res)
                }
                else {
                    throw "fail callback function is undefined"
                }
            },
            complete(res) {
                wx.hideLoading();
                if(!params.isCallBack){
                    return console.log('isCallBack is false');
                }
                if (params.complete) {
                    params.complete(res)
                }
                else {
                    console.warn("complete callback function is undefined")
                }
            }
        })
    }
}

export { http };