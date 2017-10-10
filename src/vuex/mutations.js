/**
 * Created by Hu_2015 on 2017/6/11.
 */
//赋值是否登陆
export const ISLOGIN = (state, payload) => {
  state.user.isLogin = payload.isLogin;
  state.user.email = payload.email;
  state.user.phone = payload.phone;
  state.user.nickName = payload.nickName;
  state.user.isEmail = payload.isEmail;
  state.user.points = payload.points;
  state.user.userType = payload.userType;
};
// 回测结果放在localstorage里面  直接取得
export const EDITREPORT = (state, payload) => {
  state.model.report = payload.report;
  // console.log();
};
//清空指标 创建模型时使用
export const EMPTY_INDEX = (state) => {
  state.selectedIndexs.splice(0, state.selectedIndexs.length);
};
//后台获取我的模型
export const GET_MYMODELS = (state, payload) => {
  if(!(!payload.returnModel&&typeof payload.returnModel === 'object')){
    let model;
    for (let i = 0; i < payload.returnModel.length; i++) {
      model = payload.returnModel[i];
      state.myModels.push({
        modelId: model.modelId,
        modelName: model.modelName,
        modelPara: model.modelPara,
        modelInfo: model.modelInfo,
        isTracking: model.track
      })
    }
  }
};
//后台获取历史模型
export const GET_HISTORYS = (state, payload) => {
  if (payload.returnModel !== null) {
    let model;
    let statisticalInfo;
    for (let i = 0; i < payload.returnModel.length; i++) {
      model = payload.returnModel[i];
      statisticalInfo = JSON.parse(model.report.replace(/\'/g, '\"'));
      state.historyModels.push({
        modelId: model.modelId,
        test_time: new Date(model.startTime).format('yyyy-MM-dd hh:mm:ss'),
        model_name: model.modelPara.substring(model.modelPara.indexOf('[NAME]') + 6, model.modelPara.lastIndexOf('[NAME]')),
        model_para: model.modelPara,
        model_info: model.modelInfo,
        test_range: statisticalInfo[0][0] + '~' + statisticalInfo[0][1],
        sum_profit: statisticalInfo[1],
        max_back: statisticalInfo[2],
        win_rate: statisticalInfo[3],
        empty_rate: statisticalInfo[4],
        year_profit: statisticalInfo[5],
        cellClassName: {
          sum_profit: Number(statisticalInfo[1].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[1].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
          max_back: Number(statisticalInfo[2].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[2].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
          win_rate: Number(statisticalInfo[3].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[3].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
          empty_rate: Number(statisticalInfo[4].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[4].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
          year_profit: Number(statisticalInfo[5].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(statisticalInfo[5].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero')
        }
      });
    }
  }
};
//选择指标
export const SELECT_INDICATOR = (state, payload) => {
//  指标全集
  const INDICATORS = payload.indicators;
//  指标id
  let INDICATOR_ID = payload.indicatorId;
//与或非符号对象
  const andOrNotSymbol = {
    'and': '&',
    'or': '|',
    'not': '$'
  };
  //一个指标作为一个对象加入已选择指标集合中
  state.selectedIndexs.push({
    className: INDICATOR_ID,
    nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
    params: [],
    message: INDICATOR_ID.indexOf('sell')===-1?INDICATORS[INDICATOR_ID].message:INDICATORS[INDICATOR_ID.replace('sell', 'A')].message,
    radios: [],
    select1: [],
    params2: [],
    select2: [],
    selects: [],
    locked:0,
    type:INDICATOR_ID
  });
  INDICATOR_ID = INDICATOR_ID.replace('sell', 'A');
  if (INDICATORS[INDICATOR_ID].hasOwnProperty('select1') && INDICATORS[INDICATOR_ID].select1.length !== 0) {
    for (let j = 0; j < INDICATORS[INDICATOR_ID].select1.length; j++) {
      //有第一个select
      state.selectedIndexs[state.selectedIndexs.length - 1].select1.push({
        value: 100000000,
        optionList: [{
          value: 1000000,
          label: '百万'
        }, {
          value: 10000000,
          label: '千万'
        }, {
          value: 100000000,
          label: '亿'
        }, {
          value: 1000000000,
          label: '十亿'
        }, {
          value: 10000000000,
          label: '百亿'
        }, {
          value: 100000000000,
          label: '千亿'
        }],
        canRun: 1,
        validator: INDICATORS[INDICATOR_ID].select1[j].validator,
        errorType: 0,
        showMessage: true
      })
    }
  }

  // 第二个input
  if (INDICATORS[INDICATOR_ID].hasOwnProperty('params2') && INDICATORS[INDICATOR_ID].params2.length !== 0) {
    for (let j = 0; j < INDICATORS[INDICATOR_ID].params2.length; j++) {
      state.selectedIndexs[state.selectedIndexs.length - 1].params2.push({
        canRun: 1,
        label: INDICATORS[INDICATOR_ID].params2[j].label,
        value: Number(INDICATORS[INDICATOR_ID].params2[j].value),
        validator: INDICATORS[INDICATOR_ID].params2[j].validator,
        showMessage: true,
        errorType: 0
      })
    }
  }
  // 第二个select
  if (INDICATORS[INDICATOR_ID].hasOwnProperty('select2') && INDICATORS[INDICATOR_ID].select2.length !== 0) {
    for (let j = 0; j < INDICATORS[INDICATOR_ID].select2.length; j++) {
      state.selectedIndexs[state.selectedIndexs.length - 1].select2.push({
        value: 100000000,
        optionList: [{
          value: 1000000,
          label: '百万'
        }, {
          value: 10000000,
          label: '千万'
        }, {
          value: 100000000,
          label: '亿'
        }, {
          value: 1000000000,
          label: '十亿'
        }, {
          value: 10000000000,
          label: '百亿'
        }, {
          value: 100000000000,
          label: '千亿'
        }],
        canRun: 1,
        validator: INDICATORS[INDICATOR_ID].select2[j].validator,
        errorType: 0,
        showMessage: true
      })
    }
  }

  if (INDICATORS[INDICATOR_ID].hasOwnProperty('selects')) {
    for (let j = 0; j < INDICATORS[INDICATOR_ID].selects.length; j++) {
      state.selectedIndexs[state.selectedIndexs.length - 1].selects.push({
        value: INDICATORS[INDICATOR_ID].selects[j].value,
        label: INDICATORS[INDICATOR_ID].selects[j].label,
        optionList: []
      });
      for (let t = 0; t < INDICATORS[INDICATOR_ID].selects[j].optionList.length; t++) {
        const optionLists = INDICATORS[INDICATOR_ID].selects[j].optionList;
        state.selectedIndexs[state.selectedIndexs.length - 1].selects[0].optionList.push({
          value: optionLists[t].label,
          label: optionLists[t].label
        })
      }
    }
  }

//  对每一个子对象添加参数集合
  if (INDICATORS[INDICATOR_ID].params.length !== 0) {
    for (let j = 0; j < INDICATORS[INDICATOR_ID].params.length; j++) {
      state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
        canRun: 1,
        label: INDICATORS[INDICATOR_ID].params[j].label,
        value: INDICATORS[INDICATOR_ID].params[j].value,
        validator: INDICATORS[INDICATOR_ID].params[j].validator,
        showMessage: true,
        errorType: 0
      })
    }
  }
  if (INDICATORS[INDICATOR_ID].hasOwnProperty('radios') && INDICATORS[INDICATOR_ID].radios.length !== 0) {
    for (let j = 0; j < INDICATORS[INDICATOR_ID].radios.length; j++) {
      state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
        value: INDICATORS[INDICATOR_ID].radios[0].value,
        threeFlag: INDICATORS[INDICATOR_ID].radios[0].threeFlag,
        label1: INDICATORS[INDICATOR_ID].radios[0].label1,
        value1: INDICATORS[INDICATOR_ID].radios[0].value1,
        label2: INDICATORS[INDICATOR_ID].radios[0].label2,
        value2: INDICATORS[INDICATOR_ID].radios[0].value2,
        label3: INDICATORS[INDICATOR_ID].radios[0].threeFlag ? INDICATORS[INDICATOR_ID].radios[0].label3 : '',
        value3: INDICATORS[INDICATOR_ID].radios[0].threeFlag ? INDICATORS[INDICATOR_ID].radios[0].value3 : ''
      })
    }


  }

};
//选择指标
export const SELECTINDEXS = (state, payload) => {
  const CLASS_NAME = payload.indexClass;
  const INDEX_ID = payload.indexId;
  const INDEXS = payload.indexs;
  const andOrNotSymbol = {
    'and': '&',
    'or': '|',
    'not': '$'
  };
  if (CLASS_NAME === 'price-index') {
    for (let i = 0; i < INDEXS.price.length; i++) {
      if (INDEXS.price[i].number === INDEX_ID || INDEXS.price[i].number === INDEX_ID.replace('sell', 'A')) {
        state.selectedIndexs.push({
          className: INDEX_ID,
          nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
          params: [],
          message: INDEXS.price[i].message,
          radios: [],
          select1: [],
          params2: [],
          select2: [],
          selects: [],
          canRun: 1
        });
        if (INDEXS.price[i].hasOwnProperty('radios')) {
          for (let j = 0; j < INDEXS.price[i].radios.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
              value: INDEXS.price[i].radios[0].value,
              threeFlag: INDEXS.price[i].radios[0].threeFlag,
              label1: INDEXS.price[i].radios[0].label1,
              value1: INDEXS.price[i].radios[0].value1,
              label2: INDEXS.price[i].radios[0].label2,
              value2: INDEXS.price[i].radios[0].value2,
              label3: INDEXS.price[i].radios[0].threeFlag ? INDEXS.price[i].radios[0].label3 : '',
              value3: INDEXS.price[i].radios[0].threeFlag ? INDEXS.price[i].radios[0].value3 : ''

            })
          }
        }
        for (let j = 0; j < INDEXS.price[i].params.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
            canRun: 1,
            label: INDEXS.price[i].params[j].label,
            value: INDEXS.price[i].params[j].value,
            validator: INDEXS.price[i].params[j].validator,
            showMessage: true,
            errorType: 0
          })
        }
        break;
      }

    }
  } else if (CLASS_NAME === 'market-value-index') {
    // 市值类指标比较特殊  比较复杂
    for (let i = 0; i < INDEXS.marketValue.length; i++) {
      if (INDEXS.marketValue[i].number === INDEX_ID || INDEXS.marketValue[i].number === INDEX_ID.replace('sell', 'A')) {
        state.selectedIndexs.push({
          className: INDEX_ID,
          nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
          params: [],
          select1: [],
          params2: [],
          select2: [],
          message: INDEXS.marketValue[i].message,
          radios: [],
          selects: [],
          canRun: 1

          // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
        });
        if (INDEXS.marketValue[i].hasOwnProperty('radios')) {
          for (let j = 0; j < INDEXS.marketValue[i].radios.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
              value: INDEXS.marketValue[i].radios[0].value,
              threeFlag: INDEXS.marketValue[i].radios[0].threeFlag,
              label1: INDEXS.marketValue[i].radios[0].label1,
              value1: INDEXS.marketValue[i].radios[0].value1,
              label2: INDEXS.marketValue[i].radios[0].label2,
              value2: INDEXS.marketValue[i].radios[0].value2,
              label3: INDEXS.marketValue[i].radios[0].threeFlag ? INDEXS.marketValue[i].radios[0].label3 : '',
              value3: INDEXS.marketValue[i].radios[0].threeFlag ? INDEXS.marketValue[i].radios[0].value3 : ''

            })
          }

        }
        // 第一个input
        for (let j = 0; j < INDEXS.marketValue[i].params.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
            canRun: 1,
            label: INDEXS.marketValue[i].params[j].label,
            value: Number(INDEXS.marketValue[i].params[j].value),
            validator: INDEXS.marketValue[i].params[j].validator,
            showMessage: true,
            errorType: 0
          })

        }
        // 第一个select
        for (let j = 0; j < INDEXS.marketValue[i].select1.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].select1.push({
            value: 100000000,
            optionList: [{
              value: 1000000,
              label: '百万'
            }, {
              value: 10000000,
              label: '千万'
            }, {
              value: 100000000,
              label: '亿'
            }, {
              value: 1000000000,
              label: '十亿'
            }, {
              value: 10000000000,
              label: '百亿'
            }, {
              value: 100000000000,
              label: '千亿'
            }],
            canRun: 1,
            validator: INDEXS.marketValue[i].select1[j].validator,
            errorType: 0,
            showMessage: true
          })
        }
        // 第二个input
        for (let j = 0; j < INDEXS.marketValue[i].params2.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params2.push({
            canRun: 1,
            label: INDEXS.marketValue[i].params2[j].label,
            value: Number(INDEXS.marketValue[i].params2[j].value),
            validator: INDEXS.marketValue[i].params2[j].validator,
            showMessage: true,
            errorType: 0
          })
        }
        // 第二个select
        for (let j = 0; j < INDEXS.marketValue[i].select2.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].select2.push({
            value: 100000000,
            optionList: [{
              value: 1000000,
              label: '百万'
            }, {
              value: 10000000,
              label: '千万'
            }, {
              value: 100000000,
              label: '亿'
            }, {
              value: 1000000000,
              label: '十亿'
            }, {
              value: 10000000000,
              label: '百亿'
            }, {
              value: 100000000000,
              label: '千亿'
            }],
            canRun: 1,
            validator: INDEXS.marketValue[i].select2[j].validator,
            errorType: 0,
            showMessage: true
          })

        }
      }

    }
  } else if (CLASS_NAME === 'listing-date-index') {
    for (let i = 0; i < INDEXS.listingDate.length; i++) {
      if (INDEXS.listingDate[i].number === INDEX_ID || INDEXS.listingDate[i].number === INDEX_ID.replace('sell', 'A')) {
        state.selectedIndexs.push({
          className: INDEX_ID,
          nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
          params: [],
          message: INDEXS.listingDate[i].message,
          radios: [],
          select1: [],
          params2: [],
          select2: [],
          selects: [],
          canRun: 1
          // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
        });
        if (INDEXS.listingDate[i].hasOwnProperty('radios')) {
          for (let j = 0; j < INDEXS.listingDate[i].radios.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
              value: INDEXS.listingDate[i].radios[0].value,
              threeFlag: INDEXS.listingDate[i].radios[0].threeFlag,
              label1: INDEXS.listingDate[i].radios[0].label1,
              value1: INDEXS.listingDate[i].radios[0].value1,
              label2: INDEXS.listingDate[i].radios[0].label2,
              value2: INDEXS.listingDate[i].radios[0].value2,
              label3: INDEXS.listingDate[i].radios[0].threeFlag ? INDEXS.listingDate[i].radios[0].label3 : '',
              value3: INDEXS.listingDate[i].radios[0].threeFlag ? INDEXS.listingDate[i].radios[0].value3 : ''

            })
          }

        }
        for (let j = 0; j < INDEXS.listingDate[i].params.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
            canRun: 1,
            label: INDEXS.listingDate[i].params[j].label,
            value: INDEXS.listingDate[i].params[j].value,
            validator: INDEXS.listingDate[i].params[j].validator,
            showMessage: true,
            errorType: 0
          })

        }
        break;
      }

    }
  } else if (CLASS_NAME === 'code-index') {
    for (let i = 0; i < INDEXS.code.length; i++) {
      if (INDEXS.code[i].number === INDEX_ID || INDEXS.code[i].number === INDEX_ID.replace('sell', 'A')) {
        state.selectedIndexs.push({
          className: INDEX_ID,
          nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
          params: [],
          message: INDEXS.code[i].message,
          radios: [],
          select1: [],
          params2: [],
          select2: [],
          selects: [],
          canRun: 1
          // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
        });
        if (INDEXS.code[i].hasOwnProperty('radios')) {
          for (let j = 0; j < INDEXS.code[i].radios.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
              value: INDEXS.code[i].radios[0].value,
              threeFlag: INDEXS.code[i].radios[0].threeFlag,
              label1: INDEXS.code[i].radios[0].label1,
              value1: INDEXS.code[i].radios[0].value1,
              label2: INDEXS.code[i].radios[0].label2,
              value2: INDEXS.code[i].radios[0].value2,
              label3: INDEXS.code[i].radios[0].threeFlag ? INDEXS.code[i].radios[0].label3 : '',
              value3: INDEXS.code[i].radios[0].threeFlag ? INDEXS.code[i].radios[0].value3 : ''
            })
          }

        }
        for (let j = 0; j < INDEXS.code[i].params.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
            canRun: 1,
            label: INDEXS.code[i].params[j].label,
            value: INDEXS.code[i].params[j].value,
            validator: INDEXS.code[i].params[j].validator,
            showMessage: true,
            errorType: 0
          })

        }
        break;
      }

    }
  } else if (CLASS_NAME === 'trade-index') {
    for (let i = 0; i < INDEXS.trade.length; i++) {
      if (INDEXS.trade[i].number === INDEX_ID || INDEXS.trade[i].number === INDEX_ID.replace('sell', 'A')) {
        state.selectedIndexs.push({
          className: INDEX_ID,
          nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
          params: [],
          message: INDEXS.trade[i].message,
          radios: [],
          select1: [],
          params2: [],
          select2: [],
          selects: [],
          canRun: 1
          // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
        });
        if (INDEXS.trade[i].hasOwnProperty('radios')) {
          for (let j = 0; j < INDEXS.trade[i].radios.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
              value: INDEXS.trade[i].radios[0].value,
              threeFlag: INDEXS.trade[i].radios[0].threeFlag,
              label1: INDEXS.trade[i].radios[0].label1,
              value1: INDEXS.trade[i].radios[0].value1,
              label2: INDEXS.trade[i].radios[0].label2,
              value2: INDEXS.trade[i].radios[0].value2,
              label3: INDEXS.trade[i].radios[0].threeFlag ? INDEXS.trade[i].radios[0].label3 : '',
              value3: INDEXS.trade[i].radios[0].threeFlag ? INDEXS.trade[i].radios[0].value3 : ''

            })
          }

        }
        for (let j = 0; j < INDEXS.trade[i].params.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
            canRun: 1,
            label: INDEXS.trade[i].params[j].label,
            value: INDEXS.trade[i].params[j].value,
            validator: INDEXS.trade[i].params[j].validator,
            showMessage: true,
            errorType: 0
          })

        }
        break;
      }
    }


  } else if (CLASS_NAME === 'classic-index') {
    //            经典类指标
    for (let i = 0; i < INDEXS.classic.length; i++) {
      if (INDEXS.classic[i].number === INDEX_ID || INDEXS.classic[i].number === INDEX_ID.replace('sell', 'A')) {
        state.selectedIndexs.push({
          className: INDEX_ID,
          nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
          params: [],
          message: INDEXS.classic[i].message,
          radios: [],
          select1: [],
          params2: [],
          select2: [],
          selects: [],
          canRun: 1
          // indexs.price[i].hasOwnProperty('radios') ? indexs.price[i].radios : []
        });
        if (INDEXS.classic[i].hasOwnProperty('radios')) {
          for (let j = 0; j < INDEXS.classic[i].radios.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
              value: INDEXS.classic[i].radios[0].value,
              threeFlag: INDEXS.classic[i].radios[0].threeFlag,
              label1: INDEXS.classic[i].radios[0].label1,
              value1: INDEXS.classic[i].radios[0].value1,
              label2: INDEXS.classic[i].radios[0].label2,
              value2: INDEXS.classic[i].radios[0].value2,
              label3: INDEXS.classic[i].radios[0].threeFlag ? INDEXS.classic[i].radios[0].label3 : '',
              value3: INDEXS.classic[i].radios[0].threeFlag ? INDEXS.classic[i].radios[0].value3 : ''

            })
          }

        }
        for (let j = 0; j < INDEXS.classic[i].params.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
            canRun: 1,
            label: INDEXS.classic[i].params[j].label,
            value: INDEXS.classic[i].params[j].value,
            validator: INDEXS.classic[i].params[j].validator,
            showMessage: true,
            errorType: 0
          })

        }
        break;
      }

    }
  } else if (CLASS_NAME === 'secondary-screen') {
    //            二次筛选指标
    for (let i = 0; i < INDEXS.secondaryScreen.length; i++) {
      if (INDEXS.secondaryScreen[i].number === INDEX_ID) {
        state.selectedIndexs.push({
          className: INDEX_ID,
          nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
          params: [],
          message: INDEXS.secondaryScreen[i].message,
          radios: [],
          select1: [],
          params2: [],
          select2: [],
          selects: []
        });
        if (INDEXS.secondaryScreen[i].hasOwnProperty('radios')) {
          for (let j = 0; j < INDEXS.secondaryScreen[i].radios.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
              value: INDEXS.secondaryScreen[i].radios[0].value,
              threeFlag: INDEXS.secondaryScreen[i].radios[0].threeFlag,
              label1: INDEXS.secondaryScreen[i].radios[0].label1,
              value1: INDEXS.secondaryScreen[i].radios[0].value1,
              label2: INDEXS.secondaryScreen[i].radios[0].label2,
              value2: INDEXS.secondaryScreen[i].radios[0].value2,
              label3: INDEXS.secondaryScreen[i].radios[0].threeFlag ? INDEXS.secondaryScreen[i].radios[0].label3 : '',
              value3: INDEXS.secondaryScreen[i].radios[0].threeFlag ? INDEXS.secondaryScreen[i].radios[0].value3 : ''

            })
          }

        }
        for (let j = 0; j < INDEXS.secondaryScreen[i].params.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
            canRun: 1,
            label: INDEXS.secondaryScreen[i].params[j].label,
            value: INDEXS.secondaryScreen[i].params[j].value,
            validator: INDEXS.secondaryScreen[i].params[j].validator,
            showMessage: true,
            errorType: 0
          })

        }
        break;
      }

    }
  } else if (CLASS_NAME === 'wind-control') {
    //            二次筛选指标
    for (let i = 0; i < INDEXS.windControl.length; i++) {
      if (INDEXS.windControl[i].number === INDEX_ID) {
        state.selectedIndexs.push({
          className: INDEX_ID,
          nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
          params: [],
          message: INDEXS.windControl[i].message,
          radios: [],
          selects: [],
          select1: [],
          params2: [],
          select2: [],
          canRun: 1
        });
        //添加select
        if (INDEXS.windControl[i].hasOwnProperty('selects')) {
          for (let j = 0; j < INDEXS.windControl[i].selects.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].selects.push({
              value: INDEXS.windControl[i].selects[j].value,
              label: INDEXS.windControl[i].selects[j].label,
              optionList: []
            });
            for (let t = 0; t < INDEXS.windControl[i].selects[j].optionList.length; t++) {
              const optionLists = INDEXS.windControl[i].selects[j].optionList;
              state.selectedIndexs[state.selectedIndexs.length - 1].selects[0].optionList.push({
                value: optionLists[t].label,
                label: optionLists[t].label
              })
            }
          }
        }
        if (INDEXS.windControl[i].hasOwnProperty('radios')) {
          for (let j = 0; j < INDEXS.windControl[i].radios.length; j++) {
            state.selectedIndexs[state.selectedIndexs.length - 1].radios.push({
              value: INDEXS.windControl[i].radios[0].value,
              threeFlag: INDEXS.windControl[i].radios[0].threeFlag,
              label1: INDEXS.windControl[i].radios[0].label1,
              value1: INDEXS.windControl[i].radios[0].value1,
              label2: INDEXS.windControl[i].radios[0].label2,
              value2: INDEXS.windControl[i].radios[0].value2,
              label3: INDEXS.windControl[i].radios[0].threeFlag ? INDEXS.windControl[i].radios[0].label3 : '',
              value3: INDEXS.windControl[i].radios[0].threeFlag ? INDEXS.windControl[i].radios[0].value3 : ''

            })
          }

        }
        for (let j = 0; j < INDEXS.windControl[i].params.length; j++) {
          state.selectedIndexs[state.selectedIndexs.length - 1].params.push({
            canRun: 1,
            label: INDEXS.windControl[i].params[j].label,
            value: INDEXS.windControl[i].params[j].value,
            validator: INDEXS.windControl[i].params[j].validator,
            showMessage: true,
            errorType: 0
          })

        }
      }

    }
  }
};
//选择模型
export const SELECTMODEL = (state, payload) => {
  const INDEX = payload.index;
  const andOrNotSymbol = {
    'and': '&',
    'or': '|',
    'not': '$'
  };
  state.selectedIndexs.push({
    modelId: state.myModels[INDEX].modelId,
    nextRelationship: state.andOrNot !== 'customize' ? andOrNotSymbol[state.andOrNot] : '',
    modelIndex:payload.modelIndex,
    modelName: state.myModels[INDEX].modelName,
    modelPara: state.myModels[INDEX].modelPara,
    modelInfo: state.myModels[INDEX].modelInfo,
    className: '',
    number: payload.number,
    params: [],
    radios: [],
    selectModelClass: payload.selectModelClass,
    locked:0
  });
};
//异步插入模型

//  赋值回测区间
export const GET_TEST_RANGE = (state, payload) => {
  state.model.startTime = payload.startTime;
  state.model.endTime = payload.endTime;
};
//赋值默认回测起点和回测重点
export const START_END = (state, payload) => {
  state.controller.backStart = payload.backStart;
  state.controller.backEnd = payload.backEnd;
};
//  获取当前指标的指向  获取当前输入框的指向
export const GET_CURRENT_DIRCTION = (state, payload) => {
  state.currentInputIndex.parentIndex = payload.parentIndex;
  state.currentInputIndex.childIndex = payload.childIndex;
}
