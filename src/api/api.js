/**
 * Created by Hu_2015 on 2017/6/12.
 */
import axios from 'axios'
//传递数据转换类
import qs from 'qs'
import {resolveIndicator} from './model.js'
function toQs(param) {
  return qs.stringify(param);
}
//
const axiosInstance = axios.create({
  baseURL: 'https://www.qiantoulianghua.com',
  headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   "Access-Control-Allow-Origin": "*",
    "P3P": "CP='CAO PSA OUR'",
    'cache-control': 'no-cache'

  },
  timeout: 30000,
  withCredentials: true
});
//导出常量
export const BASE_API_URL = 'https://www.qiantoulianghua.com';
//测试远程调用 异步请求函数 post方法
export const postRemoteReqTodo = (url, params) => {
  return axiosInstance.post(url + '?a=' + Math.random(), toQs(params));
};
//测试远程调用 异步请求 get方法
export const getRemoteReqTodo = (url, params, values) => {
  if (params.length !== 0) {
    let a = '';
    for (let i = 0; i < params.length; i++) {
      a = a+'&' + params[i] + '=' + values[i];
    }
    return axiosInstance.get(url + '?a=' + Math.random() + '&' + a.substring(1));
  }
  return axiosInstance.get(url + '?a=' + Math.random());
};

//创建模型获取随机默认模型  并解析出来
export const getRandomModel = function (selectedIndicatorList,that) {
  getRemoteReqTodo('/stock/randommodel', ['number','type'], [1,1]).then(res => {
    let data =res.data;
    let modelPara = data.modelStorages[0].modelPara;
    // console.log(data);
    that.$store.state.andOrNot = 'customize';
    resolveIndicator(that.$store.state.selectedIndexs, modelPara,  that.$store.state.controller, that.$store.state.symbol);
  })
}

//模型仓库
// export const getModelStroage = function () {
//   getRemoteReqTodo('/stock/modelstorage',[],[]).then(res=>{
//     console.log(res);
//   });
// }


