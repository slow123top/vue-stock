/**
 * Created by Hu_2015 on 2017/5/14.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations.js';
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    url: '',
    andOrNot: 'and',
    currentInputIndex: {
      parentIndex: 0,
      childIndex: 0
    },
    //入市指标  出市指标  风控指标的左右括号符号
    symbol:{
      andOrNotIntoMarketLeft: '',
      andOrNotIntoMarketRight: '',
      andOrNotOutMarketLeft: '',
      andOrNotOutMarketRight: '',
      andOrNotWindCtrlLeft: '',
      andOrNotWindCtrlRight: '',
    },
    //用户信息  登录和未登录
    user: {
      isLogin: false,
      nickName: '',
      email: '',
      phone: '',
      points: '',
      isEmail: true,
      userType: ''
    },
    //是否做过智能回测
    isGenetic: false,
    //是否已经绑定过手机
    isBindPhone: '',
    //是否已经绑定过邮箱不
    isBindEmail: '',
    phone: '',
    email: '',
    //关于当前运行模型的信息
    model: {
      //模型ID
      modelId: '',
      //模型指标组合
      modelPara: '',
      modelInfo: '',
      //模型名称
      modelName: '',
      report: '',
      startTime: '',
      endTime: '',
      isRun: false
    },
    //指标的详细信息
    // 我的模型
    myModels: [],
    historyModels: [],

    // 运行结果
    runResult: {},
    // 函数判断运行结果是否为空
    runResultIsEmpty: function (result) {
      let a;
      for (a in result) {
        return false;
      }
      return true;
    },
    // 模型资金净值曲线数据
    selectedIndexs: [],
    secondaryScreen: [],
    controller: {
      modelName: '模型一号',
      holdDate: 10,
      backStart: '',
      backEnd: '',
      buyRate: 3,
      sellRate: 13,
      pressureRate: 0,
      maxDailyHold: 5,
      stopProfit:40,
      stopLoss:20,
      holdDateCanRun: 1,
      buyRateCanRun: 1,
      sellRateCanRun: 1,
      pressureRateCanRun: 1,
      maxHoldCanRun: 1,
      modelNameCanRun: 1,
      stopProfitCanRun:1,
      stopLossCanRun:1
    }
  },
  mutations,
  // mutations: {
  //   //是否做过智能回测
  //   ISGENETIC(state, payload){
  //     state.isGenetic = payload.isGenetic;
  //   },
  //   //赋值是否登陆
  //   ISLOGIN(state, payload){
  //     state.user.isLogin = payload.isLogin;
  //     state.user.email = payload.email;
  //     state.user.phone = payload.phone;
  //     state.user.nickName = payload.nickName;
  //     state.user.isEmail = payload.isEmail;
  //     state.user.points = payload.points;
  //     state.user.userType = payload.userType;
  //   },
  //   // 回测结果放在localstorage里面  直接取得
  //   EDITREPORT(state, payload){
  //     state.model.report = payload.report;
  //     // console.log();
  //   },
  //   //清空指标 创建模型时使用
  //   EMPTY_INDEX(state){
  //     state.selectedIndexs.splice(0, state.selectedIndexs.length);
  //   },
  //   //后台获取我的模型
  //   GET_MYMODELS(state, payload){
  //
  //     if (payload.returnModel !== null) {
  //       let model;
  //       for (let i = 0; i < payload.returnModel.length; i++) {
  //         model = payload.returnModel[i];
  //         state.myModels.push({
  //           modelId: model.modelId,
  //           modelName: model.modelName,
  //           modelPara: model.modelPara,
  //           modelInfo: model.modelInfo,
  //           // report: JSON.parse(model.report.replace(/\'/g, '\"')),
  //           isTracking: model.track
  //         })
  //       }
  //     }
  //
  //   },
  //   //后台获取历史模型
  //   GET_HISTORYS(state, payload){
  //     if (payload.returnModel !== null) {
  //       let model;
  //       let statisticalInfo;
  //       for (let i = 0; i < payload.returnModel.length; i++) {
  //         model = payload.returnModel[i];
  //         statisticalInfo = JSON.parse(model.report.replace(/\'/g, '\"'));
  //         state.historyModels.push({
  //           modelId: model.modelId,
  //           test_time: new Date(model.startTime).format('yyyy-MM-dd hh:mm:ss'),
  //           model_name: model.modelPara.substring(model.modelPara.indexOf('[NAME]') + 6, model.modelPara.lastIndexOf('[NAME]')),
  //           model_para: model.modelPara,
  //           model_info: model.modelInfo,
  //           test_range: statisticalInfo[0][0] + '~' + statisticalInfo[0][1],
  //           sum_profit: statisticalInfo[1],
  //           max_back: statisticalInfo[2],
  //           win_rate:statisticalInfo[3],
  //           empty_rate: statisticalInfo[4],
  //           year_profit: statisticalInfo[5],
  //           cellClassName: {
  //             sum_profit: Number(statisticalInfo[1].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[1].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
  //             max_back: Number(statisticalInfo[2].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[2].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
  //             win_rate: Number(statisticalInfo[3].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[3].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
  //             empty_rate: Number(statisticalInfo[4].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[4].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
  //             year_profit: Number(statisticalInfo[5].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[5].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero')
  //           }
  //         });
  //       }
  //     }
  //   },
  //   //选择指标
  //   SELECTINDEXS(state, payload){
  //     const CLASS_NAME = payload.indexClass;
  //     const INDEX_ID = payload.indexId;
  //     const INDEXS = payload.indexs;
  //     const andOrNotSymbol ={
  //       'and':'&',
  //       'or':'|',
  //       'not':'$'
  //     };
  //     if (CLASS_NAME === 'price-index') {
  //       for (let i = 0; i < INDEXS.price.length; i++) {
  //         if (INDEXS.price[i].number === INDEX_ID || INDEXS.price[i].number === INDEX_ID.replace('sell', 'A')) {
  //           state.selectedIndexs.push({
  //             className: INDEX_ID,
  //             nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //             params: [],
  //             message: INDEXS.price[i].message,
  //             radios: [],
  //             select1: [],
  //             params2: [],
  //             select2: [],
  //             selects: [],
  //             // selectModelClass:payload.selectModelClass,
  //             canRun:1
  //           });
  //           if (INDEXS.price[i].hasOwnProperty('radios')) {
  //             for (let j = 0; j < INDEXS.price[i].radios.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
  //                 value: INDEXS.price[i].radios[0].value,
  //                 threeFlag: INDEXS.price[i].radios[0].threeFlag,
  //                 label1: INDEXS.price[i].radios[0].label1,
  //                 value1: INDEXS.price[i].radios[0].value1,
  //                 label2: INDEXS.price[i].radios[0].label2,
  //                 value2: INDEXS.price[i].radios[0].value2,
  //                 label3: INDEXS.price[i].radios[0].threeFlag ? INDEXS.price[i].radios[0].label3 : '',
  //                 value3: INDEXS.price[i].radios[0].threeFlag ? INDEXS.price[i].radios[0].value3 : ''
  //
  //               })
  //             }
  //
  //           }
  //           for (let j = 0; j < INDEXS.price[i].params.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
  //               canRun: 1,
  //               label: INDEXS.price[i].params[j].label,
  //               value: INDEXS.price[i].params[j].value,
  //               validator: INDEXS.price[i].params[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //
  //           }
  //           break;
  //         }
  //
  //       }
  //     } else if (CLASS_NAME === 'market-value-index') {
  //       // 市值类指标比较特殊  比较复杂
  //       for (let i = 0; i < INDEXS.marketValue.length; i++) {
  //         if (INDEXS.marketValue[i].number === INDEX_ID|| INDEXS.marketValue[i].number === INDEX_ID.replace('sell', 'A')) {
  //           state.selectedIndexs.push({
  //             className: INDEX_ID,
  //             nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //             params: [],
  //             select1: [],
  //             params2: [],
  //             select2: [],
  //             message: INDEXS.marketValue[i].message,
  //             radios: [],
  //             selects: [],
  //             canRun:1
  //
  //             // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
  //           });
  //           if (INDEXS.marketValue[i].hasOwnProperty('radios')) {
  //             for (let j = 0; j < INDEXS.marketValue[i].radios.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
  //                 value: INDEXS.marketValue[i].radios[0].value,
  //                 threeFlag: INDEXS.marketValue[i].radios[0].threeFlag,
  //                 label1: INDEXS.marketValue[i].radios[0].label1,
  //                 value1: INDEXS.marketValue[i].radios[0].value1,
  //                 label2: INDEXS.marketValue[i].radios[0].label2,
  //                 value2: INDEXS.marketValue[i].radios[0].value2,
  //                 label3: INDEXS.marketValue[i].radios[0].threeFlag ? INDEXS.marketValue[i].radios[0].label3 : '',
  //                 value3: INDEXS.marketValue[i].radios[0].threeFlag ? INDEXS.marketValue[i].radios[0].value3 : ''
  //
  //               })
  //             }
  //
  //           }
  //           // 第一个input
  //           for (let j = 0; j < INDEXS.marketValue[i].params.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
  //               canRun: 1,
  //               label: INDEXS.marketValue[i].params[j].label,
  //               value: Number(INDEXS.marketValue[i].params[j].value),
  //               validator: INDEXS.marketValue[i].params[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //
  //           }
  //           // 第一个select
  //           for (let j = 0; j < INDEXS.marketValue[i].select1.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].select1.push({
  //               value: 100000000,
  //               optionList: [{
  //                 value: 1000000,
  //                 label: '百万'
  //               }, {
  //                 value: 10000000,
  //                 label: '千万'
  //               }, {
  //                 value: 100000000,
  //                 label: '亿'
  //               }, {
  //                 value: 1000000000,
  //                 label: '十亿'
  //               }, {
  //                 value: 10000000000,
  //                 label: '百亿'
  //               }, {
  //                 value: 100000000000,
  //                 label: '千亿'
  //               }],
  //               canRun: 1,
  //               validator: INDEXS.marketValue[i].select1[j].validator,
  //               errorType: 0,
  //               showMessage: true
  //             })
  //
  //           }
  //           // 第二个input
  //           for (let j = 0; j < INDEXS.marketValue[i].params2.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params2.push({
  //               canRun: 1,
  //               label: INDEXS.marketValue[i].params2[j].label,
  //               value: Number(INDEXS.marketValue[i].params2[j].value),
  //               validator: INDEXS.marketValue[i].params2[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //           }
  //           // 第二个select
  //           for (let j = 0; j < INDEXS.marketValue[i].select2.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].select2.push({
  //               value: 100000000,
  //               optionList: [{
  //                 value: 1000000,
  //                 label: '百万'
  //               }, {
  //                 value: 10000000,
  //                 label: '千万'
  //               }, {
  //                 value: 100000000,
  //                 label: '亿'
  //               }, {
  //                 value: 1000000000,
  //                 label: '十亿'
  //               }, {
  //                 value: 10000000000,
  //                 label: '百亿'
  //               }, {
  //                 value: 100000000000,
  //                 label: '千亿'
  //               }],
  //               canRun: 1,
  //               validator: INDEXS.marketValue[i].select2[j].validator,
  //               errorType: 0,
  //               showMessage: true
  //             })
  //
  //           }
  //         }
  //
  //       }
  //     } else if (CLASS_NAME === 'listing-date-index') {
  //       for (let i = 0; i < INDEXS.listingDate.length; i++) {
  //         if (INDEXS.listingDate[i].number === INDEX_ID|| INDEXS.listingDate[i].number === INDEX_ID.replace('sell', 'A')) {
  //           state.selectedIndexs.push({
  //             className: INDEX_ID,
  //             nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //             params: [],
  //             message: INDEXS.listingDate[i].message,
  //             radios: [],
  //             select1: [],
  //             params2: [],
  //             select2: [],
  //             selects: [],
  //             canRun:1
  //             // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
  //           });
  //           if (INDEXS.listingDate[i].hasOwnProperty('radios')) {
  //             for (let j = 0; j < INDEXS.listingDate[i].radios.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
  //                 value: INDEXS.listingDate[i].radios[0].value,
  //                 threeFlag: INDEXS.listingDate[i].radios[0].threeFlag,
  //                 label1: INDEXS.listingDate[i].radios[0].label1,
  //                 value1: INDEXS.listingDate[i].radios[0].value1,
  //                 label2: INDEXS.listingDate[i].radios[0].label2,
  //                 value2: INDEXS.listingDate[i].radios[0].value2,
  //                 label3: INDEXS.listingDate[i].radios[0].threeFlag ? INDEXS.listingDate[i].radios[0].label3 : '',
  //                 value3: INDEXS.listingDate[i].radios[0].threeFlag ? INDEXS.listingDate[i].radios[0].value3 : ''
  //
  //               })
  //             }
  //
  //           }
  //           for (let j = 0; j < INDEXS.listingDate[i].params.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
  //               canRun: 1,
  //               label: INDEXS.listingDate[i].params[j].label,
  //               value: INDEXS.listingDate[i].params[j].value,
  //               validator: INDEXS.listingDate[i].params[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //
  //           }
  //           break;
  //         }
  //
  //       }
  //     } else if (CLASS_NAME === 'code-index') {
  //       for (let i = 0; i < INDEXS.code.length; i++) {
  //         if (INDEXS.code[i].number === INDEX_ID|| INDEXS.code[i].number === INDEX_ID.replace('sell', 'A')) {
  //           state.selectedIndexs.push({
  //             className: INDEX_ID,
  //             nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //             params: [],
  //             message: INDEXS.code[i].message,
  //             radios: [],
  //             select1: [],
  //             params2: [],
  //             select2: [],
  //             selects: [],
  //             canRun:1
  //             // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
  //           });
  //           if (INDEXS.code[i].hasOwnProperty('radios')) {
  //             for (let j = 0; j < INDEXS.code[i].radios.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
  //                 value: INDEXS.code[i].radios[0].value,
  //                 threeFlag: INDEXS.code[i].radios[0].threeFlag,
  //                 label1: INDEXS.code[i].radios[0].label1,
  //                 value1: INDEXS.code[i].radios[0].value1,
  //                 label2: INDEXS.code[i].radios[0].label2,
  //                 value2: INDEXS.code[i].radios[0].value2,
  //                 label3: INDEXS.code[i].radios[0].threeFlag ? INDEXS.code[i].radios[0].label3 : '',
  //                 value3: INDEXS.code[i].radios[0].threeFlag ? INDEXS.code[i].radios[0].value3 : ''
  //               })
  //             }
  //
  //           }
  //           for (let j = 0; j < INDEXS.code[i].params.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
  //               canRun: 1,
  //               label: INDEXS.code[i].params[j].label,
  //               value: INDEXS.code[i].params[j].value,
  //               validator: INDEXS.code[i].params[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //
  //           }
  //           break;
  //         }
  //
  //       }
  //     } else if (CLASS_NAME === 'trade-index') {
  //       for (let i = 0; i < INDEXS.trade.length; i++) {
  //         if (INDEXS.trade[i].number === INDEX_ID|| INDEXS.trade[i].number === INDEX_ID.replace('sell', 'A')) {
  //           state.selectedIndexs.push({
  //             className: INDEX_ID,
  //             nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //             params: [],
  //             message: INDEXS.trade[i].message,
  //             radios: [],
  //             select1: [],
  //             params2: [],
  //             select2: [],
  //             selects: [],
  //             canRun:1
  //             // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
  //           });
  //           if (INDEXS.trade[i].hasOwnProperty('radios')) {
  //             for (let j = 0; j < INDEXS.trade[i].radios.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
  //                 value: INDEXS.trade[i].radios[0].value,
  //                 threeFlag: INDEXS.trade[i].radios[0].threeFlag,
  //                 label1: INDEXS.trade[i].radios[0].label1,
  //                 value1: INDEXS.trade[i].radios[0].value1,
  //                 label2: INDEXS.trade[i].radios[0].label2,
  //                 value2: INDEXS.trade[i].radios[0].value2,
  //                 label3: INDEXS.trade[i].radios[0].threeFlag ? INDEXS.trade[i].radios[0].label3 : '',
  //                 value3: INDEXS.trade[i].radios[0].threeFlag ? INDEXS.trade[i].radios[0].value3 : ''
  //
  //               })
  //             }
  //
  //           }
  //           for (let j = 0; j < INDEXS.trade[i].params.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
  //               canRun: 1,
  //               label: INDEXS.trade[i].params[j].label,
  //               value: INDEXS.trade[i].params[j].value,
  //               validator: INDEXS.trade[i].params[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //
  //           }
  //           break;
  //         }
  //       }
  //
  //
  //     } else if (CLASS_NAME === 'classic-index') {
  //       //            经典类指标
  //       for (let i = 0; i < INDEXS.classic.length; i++) {
  //         if (INDEXS.classic[i].number === INDEX_ID|| INDEXS.classic[i].number === INDEX_ID.replace('sell', 'A')) {
  //           state.selectedIndexs.push({
  //             className: INDEX_ID,
  //             nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //             params: [],
  //             message: INDEXS.classic[i].message,
  //             radios: [],
  //             select1: [],
  //             params2: [],
  //             select2: [],
  //             selects: [],
  //             canRun:1
  //             // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
  //           });
  //           if (INDEXS.classic[i].hasOwnProperty('radios')) {
  //             for (let j = 0; j < INDEXS.classic[i].radios.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
  //                 value: INDEXS.classic[i].radios[0].value,
  //                 threeFlag: INDEXS.classic[i].radios[0].threeFlag,
  //                 label1: INDEXS.classic[i].radios[0].label1,
  //                 value1: INDEXS.classic[i].radios[0].value1,
  //                 label2: INDEXS.classic[i].radios[0].label2,
  //                 value2: INDEXS.classic[i].radios[0].value2,
  //                 label3: INDEXS.classic[i].radios[0].threeFlag ? INDEXS.classic[i].radios[0].label3 : '',
  //                 value3: INDEXS.classic[i].radios[0].threeFlag ? INDEXS.classic[i].radios[0].value3 : ''
  //
  //               })
  //             }
  //
  //           }
  //           for (let j = 0; j < INDEXS.classic[i].params.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
  //               canRun: 1,
  //               label: INDEXS.classic[i].params[j].label,
  //               value: INDEXS.classic[i].params[j].value,
  //               validator: INDEXS.classic[i].params[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //
  //           }
  //           break;
  //         }
  //
  //       }
  //     } else if (CLASS_NAME === 'secondary-screen') {
  //       //            二次筛选指标
  //       for (let i = 0; i < INDEXS.secondaryScreen.length; i++) {
  //         if (INDEXS.secondaryScreen[i].number === INDEX_ID) {
  //           state.selectedIndexs.push({
  //             className: INDEX_ID,
  //             nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //             params: [],
  //             message: INDEXS.secondaryScreen[i].message,
  //             radios: [],
  //             select1: [],
  //             params2: [],
  //             select2: [],
  //             selects: []
  //           });
  //           if (INDEXS.secondaryScreen[i].hasOwnProperty('radios')) {
  //             for (let j = 0; j < INDEXS.secondaryScreen[i].radios.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
  //                 value: INDEXS.secondaryScreen[i].radios[0].value,
  //                 threeFlag: INDEXS.secondaryScreen[i].radios[0].threeFlag,
  //                 label1: INDEXS.secondaryScreen[i].radios[0].label1,
  //                 value1: INDEXS.secondaryScreen[i].radios[0].value1,
  //                 label2: INDEXS.secondaryScreen[i].radios[0].label2,
  //                 value2: INDEXS.secondaryScreen[i].radios[0].value2,
  //                 label3: INDEXS.secondaryScreen[i].radios[0].threeFlag ? INDEXS.secondaryScreen[i].radios[0].label3 : '',
  //                 value3: INDEXS.secondaryScreen[i].radios[0].threeFlag ? INDEXS.secondaryScreen[i].radios[0].value3 : ''
  //
  //               })
  //             }
  //
  //           }
  //           for (let j = 0; j < INDEXS.secondaryScreen[i].params.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
  //               canRun: 1,
  //               label: INDEXS.secondaryScreen[i].params[j].label,
  //               value: INDEXS.secondaryScreen[i].params[j].value,
  //               validator: INDEXS.secondaryScreen[i].params[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //
  //           }
  //           break;
  //         }
  //
  //       }
  //     } else if (CLASS_NAME === 'wind-control') {
  //       //            二次筛选指标
  //       for (let i = 0; i < INDEXS.windControl.length; i++) {
  //         if (INDEXS.windControl[i].number === INDEX_ID) {
  //           state.selectedIndexs.push({
  //             className: INDEX_ID,
  //             nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //             params: [],
  //             message: INDEXS.windControl[i].message,
  //             radios: [],
  //             selects: [],
  //             select1: [],
  //             params2: [],
  //             select2: [],
  //             canRun:1
  //           });
  //           //添加select
  //           if (INDEXS.windControl[i].hasOwnProperty('selects')) {
  //             for (let j = 0; j < INDEXS.windControl[i].selects.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].selects.push({
  //                 value: INDEXS.windControl[i].selects[j].value,
  //                 label: INDEXS.windControl[i].selects[j].label,
  //                 optionList: []
  //               });
  //               for (let t = 0; t < INDEXS.windControl[i].selects[j].optionList.length; t++) {
  //                 const optionLists = INDEXS.windControl[i].selects[j].optionList;
  //                 state.selectedIndexs[state.selectedIndexs.length - 1].selects[0].optionList.push({
  //                   value: optionLists[t].label,
  //                   label: optionLists[t].label
  //                 })
  //               }
  //             }
  //           }
  //           if (INDEXS.windControl[i].hasOwnProperty('radios')) {
  //             for (let j = 0; j < INDEXS.windControl[i].radios.length; j++) {
  //               state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
  //                 value: INDEXS.windControl[i].radios[0].value,
  //                 threeFlag: INDEXS.windControl[i].radios[0].threeFlag,
  //                 label1: INDEXS.windControl[i].radios[0].label1,
  //                 value1: INDEXS.windControl[i].radios[0].value1,
  //                 label2: INDEXS.windControl[i].radios[0].label2,
  //                 value2: INDEXS.windControl[i].radios[0].value2,
  //                 label3: INDEXS.windControl[i].radios[0].threeFlag ? INDEXS.windControl[i].radios[0].label3 : '',
  //                 value3: INDEXS.windControl[i].radios[0].threeFlag ? INDEXS.windControl[i].radios[0].value3 : ''
  //
  //               })
  //             }
  //
  //           }
  //           for (let j = 0; j < INDEXS.windControl[i].params.length; j++) {
  //             state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
  //               canRun: 1,
  //               label: INDEXS.windControl[i].params[j].label,
  //               value: INDEXS.windControl[i].params[j].value,
  //               validator: INDEXS.windControl[i].params[j].validator,
  //               showMessage: true,
  //               errorType: 0
  //             })
  //
  //           }
  //           break;
  //         }
  //
  //       }
  //     }
  //   },
  //   //选择模型
  //   SELECTMODEL(state, payload){
  //     const INDEX = payload.index;
  //     const andOrNotSymbol ={
  //       'and':'&',
  //       'or':'|',
  //       'not':'$'
  //     };
  //     state.selectedIndexs.push({
  //       modelId: state.myModels[INDEX].modelId,
  //       nextRelationship:state.andOrNot !=='customize'?andOrNotSymbol[state.andOrNot]:'',
  //       modelName: state.myModels[INDEX].modelName,
  //       modelPara: state.myModels[INDEX].modelPara,
  //       modelInfo: state.myModels[INDEX].modelInfo,
  //       className: '',
  //       number:payload.number,
  //       params: [],
  //       radios: [],
  //       selectModelClass:payload.selectModelClass
  //     });
  //   },
  //   //异步插入模型
  //
  //   //  赋值回测区间
  //   GET_TEST_RANGE(state, payload){
  //     state.model.startTime = payload.startTime;
  //     state.model.endTime = payload.endTime;
  //   },
  //   //赋值默认回测起点和回测重点
  //   START_END(state, payload){
  //     state.controller.backStart = payload.backStart;
  //     state.controller.backEnd = payload.backEnd;
  //   },
  //   //  获取当前指标的指向  获取当前输入框的指向
  //   GET_CURRENT_DIRCTION(state, payload){
  //     state.currentInputIndex.parentIndex = payload.parentIndex;
  //     state.currentInputIndex.childIndex = payload.childIndex;
  //   }
  //
  // },
  //异步分发
  actions: {}
})
