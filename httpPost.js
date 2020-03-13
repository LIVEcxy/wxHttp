/*
 * @Description:
 * @Version: 2.0
 * @Autor: liusm
 * @Date: 2019-12-12 16:21:16
 * @LastEditors: liusm
 * @LastEditTime: 2020-03-13 09:19:15
 *
 * api          服务接口名称
 * params       服务接口拼接参数
 * isShowMsg    是否需要默认弹窗         默认  true
 * isCallBack   是否需要触发回调         默认  true
 */
const app = getApp();
const { http } = require('http.js');

// 登录接口
const httpLogin = {
	send(params) {
		if (!params.hasOwnProperty('url')) {
			throw 'url is null';
		} else {
			params.api = `User${params.url}`;
			params.params = `Code=${params.Code}&conn=${app.globalData.conn}`;
			http.post(params);
		}
	}
};

export { httpLogin };