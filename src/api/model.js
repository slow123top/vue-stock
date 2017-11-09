/**
 * Created by Hu_2015 on 2017/6/15.
 */
//导入我的模型指标信息
import {MY_MODEL_INDEXS} from './indexinfo'


//锁定指标标签函数（注意有嵌套模型的状况）
function getLockedLogo(formValidate) {
  let locked = '';
  let intoMarketLocked = '';
  let outMarketLocked = '';
  let windCtrlLocked = '';
  let secondLocked = '';
  let modelLockedCount = 0;
//  入市指标
  formValidate.intoMarketListTemp.forEach((ele) => {
    if (ele.className === '') {
      //  有嵌套模型的状况下
      modelLockedCount = ele.modelPara.substring(ele.modelPara.indexOf('[IN]') + 4, ele.modelPara.lastIndexOf('[IN]')).split('A').length - 1;
      for (let i = 0; i < modelLockedCount; i++) {
        intoMarketLocked += ele.locked + '-'
      }

    } else {
      //单个指标
      intoMarketLocked += ele.locked + '-';
    }
  });
  intoMarketLocked = intoMarketLocked.substring(0, intoMarketLocked.length - 1);
//  出市指标
  if (formValidate.outMarketListTemp.length === 0) {
    outMarketLocked = '1';
  } else {
    formValidate.outMarketListTemp.forEach((ele) => {
      if (ele.className === '') {
        if (ele.modelPara.indexOf('[SELL]') !== -1) {
          modelLockedCount = ele.modelPara.substring(ele.modelPara.indexOf('[SELL]') + 6, ele.modelPara.lastIndexOf('[SELL]')).split('A').length - 1;
          for (let i = 0; i < modelLockedCount; i++) {
            outMarketLocked += ele.locked + '-'
          }
        }
      } else {
        outMarketLocked += ele.locked + '-';
      }
    });
    outMarketLocked = outMarketLocked === '' ? '1' : outMarketLocked.substring(0, outMarketLocked.length - 1);
  }
//  风控指标
  if (formValidate.windCtrlListTemp.length === 0) {
    windCtrlLocked = '1';
  } else {
    formValidate.windCtrlListTemp.forEach((ele) => {
      if (ele.className === '') {
        if (ele.modelPara.indexOf('[DAN_CON]') !== -1) {
          modelLockedCount = ele.modelPara.substring(ele.modelPara.indexOf('[DAN_CON]') + 9, ele.modelPara.lastIndexOf('[DAN_CON]')).split('C').length - 1;
          for (let i = 0; i < modelLockedCount; i++) {
            windCtrlLocked += ele.locked + '-'
          }
        }
      } else {
        windCtrlLocked += ele.locked + '-';
      }
    });
    windCtrlLocked = windCtrlLocked === '' ? '1' : windCtrlLocked.substring(0, windCtrlLocked.length - 1);
  }
//  二次筛选指标
  formValidate.secondListTemp.forEach((ele) => {
    if (ele.className === '') {
      //  有嵌套模型的状况下
      modelLockedCount = ele.modelPara.substring(ele.modelPara.indexOf('[SECOND]') + 8, ele.modelPara.lastIndexOf('[SECOND]')).split('B').length - 1;
      for (let i = 0; i < modelLockedCount; i++) {
        secondLocked += ele.locked + '-'
      }
    } else {
      //单个指标
      secondLocked += ele.locked + '-';
    }
    secondLocked = secondLocked.substring(0, secondLocked.length - 1);
  });
  locked += intoMarketLocked + '|' + outMarketLocked + '|' + windCtrlLocked + '|' + secondLocked;
  return locked;
}
export const resolveLocked = function (modelPara, selectedIndexs) {
  let lockStr = modelPara.substring(modelPara.indexOf('[LOCK]') + 6, modelPara.lastIndexOf('[LOCK]'));
  let lockArr = lockStr.split('|');
  let intoMarketLock = lockArr[0].split('-');
  let outMarketLock = [];
  let windCtrlLock = [];
  if (modelPara.indexOf('[SELL]') !== -1) {
    outMarketLock = outMarketLock.concat(lockArr[1].split('-'));
  }
  if (modelPara.indexOf('[DAN_CON]') !== -1) {
    windCtrlLock = windCtrlLock.concat(lockArr[2].split('-'));
  }
  let secondLock = lockArr[3].split('-');
  let lock = intoMarketLock.concat(outMarketLock).concat(windCtrlLock).concat(secondLock);
  for (let i = 0; i < selectedIndexs.length; i++) {
    selectedIndexs[i].locked = Number(lock[i]);
  }
};

export const resolveParaLock = function (modelPara, selectedIndexs) {
  let tempArr = [];
  let indicator = {};
  let lockStr = modelPara.substring(modelPara.indexOf('[LOCK]') + 6, modelPara.lastIndexOf('[LOCK]'));
  let lockArr = lockStr.split('|');
  let intoMarketLock = lockArr[0].split('-');
  intoMarketLock.forEach(ele => {
    tempArr.push(ele.split('_'));
  });
  let outMarketLock = [];
  let windCtrlLock = [];
  if (modelPara.indexOf('[SELL]') !== -1) {
    outMarketLock = outMarketLock.concat(lockArr[1].split('-'));
    outMarketLock.forEach(ele => {
      tempArr.push(ele.split('_'));
    });
  }
  if (modelPara.indexOf('[DAN_CON]') !== -1) {
    windCtrlLock = windCtrlLock.concat(lockArr[2].split('-'));
    windCtrlLock.forEach(ele => {
      tempArr.push(ele.split('_'));
    });
  }
  let secondLock = lockArr[3].split('-');
  secondLock.forEach(ele => {
    tempArr.push(ele.split('_'));
  });
  // console.log(tempArr);
  for (let i = 0; i < selectedIndexs.length; i++) {
    indicator = selectedIndexs[i];
    if (!indicator.params.length&&!indicator.radios.length) {
      selectedIndexs[i].locked = Number(tempArr[i][0]);
      tempArr[i].splice(0, 1);
    } else {
      // console.log(tempArr);
      if (indicator.selects.length !== 0) {
        for (let j = 0; j < indicator.selects.length; j++) {
          selectedIndexs[i].selects[j].locked = Number(tempArr[i][j]);
        }
        tempArr[i].splice(0, indicator.selects.length);
      }
      if (indicator.params.length !== 0) {
        for (let j = 0; j < indicator.params.length; j++) {
          selectedIndexs[i].params[j].locked = Number(tempArr[i][j]);
        }
        tempArr[i].splice(0, indicator.params.length);
      }
      if (indicator.params2.length !== 0) {
        for (let j = 0; j < indicator.params2.length; j++) {
          selectedIndexs[i].params2[j].locked = Number(tempArr[i][j]);
        }
        tempArr[i].splice(0, indicator.params2.length);
      }
      if (indicator.radios.length !== 0) {
        for (let j = 0; j < indicator.radios.length; j++) {
          selectedIndexs[i].radios[j].locked = Number(tempArr[i][j]);
        }
        tempArr[i].splice(0, indicator.radios.length);
      }
    }

  }
};
function notIncludeRelationship(model, includeLogo) {
  let a;
  if (includeLogo === '[IN]') {
    a = model.modelPara.substring(model.modelPara.indexOf('[IN]') + 4, model.modelPara.lastIndexOf('[IN]'));
  } else if (includeLogo === '[SELL]') {
    a = model.modelPara.substring(model.modelPara.indexOf('[SELL]') + 6, model.modelPara.lastIndexOf('[SELL]'));
  } else if (includeLogo === '[DAN_CON]') {
    a = model.modelPara.substring(model.modelPara.indexOf('[DAN_CON]') + 9, model.modelPara.lastIndexOf('[DAN_CON]'));
  }
  return '(' + a + ')';
};
function str(leftBracket, rightBracket, arr, includeLogo) {
  let tempA = '';
  let end = 0;
  arr.forEach(function (ele, index) {

    if (ele.className === '') {
      //  单个对象是模型
      if (ele.modelPara.indexOf(includeLogo) !== -1) {
        tempA += notIncludeRelationship(ele, includeLogo);
        // if (index !== arr.length - 1) {
        tempA += ele.nextRelationship;
        end = index;
        // }
      }
    } else {
      //单个对象不是模型
      tempA += ele.className + '-';
      //A0008 A0009
      if (ele.hasOwnProperty('select1') && ele.select1.length !== 0) {
        tempA += ele.params[0].value * ele.select1[0].value + '_' + ele.params2[0].value * ele.select2[0].value;
        // tempAInfo += ele.params[0].value * ele.select1[0].value + '_' + ele.params2[0].value * ele.select2[0].value;
      } else {
        //带输入框
        ele.params.forEach(eleChild => {
          tempA += eleChild.value + '_';
          // tempAInfo += eleChild.value + '_';
        });
        //带单选框的
        ele.radios.forEach(eleRadioChild => {
          tempA += eleRadioChild.value + '_';
          // tempAInfo += eleRadioChild.value + '_';
        });
        tempA = tempA.substring(0, tempA.length - 1);

      }
      tempA += ele.nextRelationship;
      end = index;
    }
  });
  tempA = tempA.substring(0, tempA.lastIndexOf(arr[end].nextRelationship));
  return tempA === '' ? tempA : leftBracket + tempA + rightBracket;
};
//组合参数锁定功能
function combineParaLock(indicator) {
  let lock = '';
  indicator.selects.forEach(ele => {
    lock += ele.locked + '_';
  });
  indicator.params.forEach(ele => {
    lock += ele.locked + '_';
  });
  indicator.params2.forEach(ele => {
    lock += ele.locked + '_';
  });
  indicator.radios.forEach(ele => {
    lock += ele.locked + '_';
  });
  return lock.substring(0, lock.length - 1);

};
export const combineLockStr = function (formValidate) {
  let arr = [];
  let locked = '';
  let intoMarketLocked = '';
  let outMarketLocked = '';
  let windCtrlLocked = '';
  let secondLocked = '';
  let temp = [];
  let indicatorStr = '';
//  入市指标
  formValidate.intoMarketListTemp.forEach((ele) => {
    indicatorStr = ele.modelPara;
    if (ele.className === '') {
      //  有嵌套模型的状况下 对嵌套模型里面的每一个指标的每一个参数进行锁定组合
      arr = indicatorStr.substring(indicatorStr.indexOf('[IN]') + 4, indicatorStr.lastIndexOf('[IN]')).replace(/\(|\)/g, '').split(/\&|\||\$/);
      for (let i = 0; i < arr.length; i++) {
        temp = arr[i].substring(arr[i].indexOf('-') + 1).split('_');
        for (let j = 0; j < temp.length; j++) {
          intoMarketLocked += ele.locked + '_';
        }
        intoMarketLocked += intoMarketLocked + '-';
      }
    } else {
      //单个指标无参数的情况
      //单个指标有参数的情况
      intoMarketLocked += (!ele.params.length&&!ele.radios.length ? ele.locked : combineParaLock(ele)) + '-';
    }
  });
  intoMarketLocked = intoMarketLocked.substring(0, intoMarketLocked.length - 1);
//  出市指标
  if (formValidate.outMarketListTemp.length === 0) {
    outMarketLocked = '1';
  } else {
    formValidate.outMarketListTemp.forEach((ele) => {
      indicatorStr = ele.modelPara;
      if (ele.className === '') {
        if (indicatorStr.indexOf('[SELL]') !== -1) {
          arr = indicatorStr.substring(indicatorStr.indexOf('[SELL]') + 6, indicatorStr.lastIndexOf('[SELL]')).replace(/\(|\)/g, '').split(/\&|\||\$/);
          for (let i = 0; i < arr.length; i++) {
            temp = arr[i].substring(arr[i].indexOf('-') + 1).split('_');
            for (let j = 0; j < temp.length; j++) {
              outMarketLocked += ele.locked + '_';
            }
            outMarketLocked += outMarketLocked + '-';
          }
        }
      } else {
        outMarketLocked += (!ele.params.length&&!ele.radios.length ? ele.locked : combineParaLock(ele)) + '-';
      }
    });
    outMarketLocked = outMarketLocked === '' ? '1' : outMarketLocked.substring(0, outMarketLocked.length - 1);
  }
//  风控指标
  if (formValidate.windCtrlListTemp.length === 0) {
    windCtrlLocked = '1';
  } else {
    formValidate.windCtrlListTemp.forEach((ele) => {
      indicatorStr = ele.modelPara;
      if (ele.className === '') {
        if (indicatorStr.indexOf('[DAN_CON]') !== -1) {
          arr = indicatorStr.substring(indicatorStr.indexOf('[DAN_CON]') + 9, indicatorStr.lastIndexOf('[DAN_CON]')).replace(/\(|\)/g, '').split(/\&|\||\$/);
          for (let i = 0; i < arr.length; i++) {
            temp = arr[i].substring(arr[i].indexOf('-') + 1).split('_');
            for (let j = 0; j < temp.length; j++) {
              windCtrlLocked += ele.locked + '_';
            }
            windCtrlLocked += windCtrlLocked + '-';
          }
        }
      } else {
        windCtrlLocked += (!ele.params.length&&!ele.radios.length ? ele.locked : combineParaLock(ele)) + '-';
      }
    });
    windCtrlLocked = windCtrlLocked === '' ? '1' : windCtrlLocked.substring(0, windCtrlLocked.length - 1);
  }
//  二次筛选指标
  formValidate.secondListTemp.forEach((ele) => {
    indicatorStr = ele.modelPara;
    if (ele.className === '') {
      //  有嵌套模型的状况下
      arr = indicatorStr.substring(indicatorStr.indexOf('[SECOND]') + 8, indicatorStr.lastIndexOf('[SECOND]')).replace(/\(|\)/g, '').split(/\&|\||\$/);
      for (let i = 0; i < arr.length; i++) {
        temp = arr[i].substring(arr[i].indexOf('-') + 1).split('_');
        for (let j = 0; j < temp.length; j++) {
          secondLocked += ele.locked + '_';
        }
        secondLocked += secondLocked + '-'
      }
    } else {
      //单个指标
      secondLocked += (!ele.params.length&&!ele.radios.length ? ele.locked : combineParaLock(ele)) + '-';
    }
    secondLocked = secondLocked.substring(0, secondLocked.length - 1);
  });
  locked += intoMarketLocked + '|' + outMarketLocked + '|' + windCtrlLocked + '|' + secondLocked;
  return locked;

};
//日期格式化
Date.prototype.format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

//controller
export const CONTROLLER = (modelPara) => {
  let temp = [];
  let controller = modelPara.substring(modelPara.indexOf('CONTROL-') + 8, modelPara.lastIndexOf('[OUT]')).split('_');
  for (let i = 0; i < controller.length; i++) {
    temp.push(controller[i]);
  }

  return temp;
}
//单个指标信息分解  像A0001-1_1
const SINGLE_SPLITED_INDEX = (para) => {
  return {
    indexName: para.substring(0, para.indexOf('-')),
    indexValue: para.substring(para.indexOf('-') + 1).split('_')
  }
};

const splitABC = (para, selectedIndexs, symbol) => {
  //para代表  单个指标信息
  const myModelIndexs = MY_MODEL_INDEXS;
  const index = SINGLE_SPLITED_INDEX(para);
  // console.log(symbol);
  //  A B C指标
  selectedIndexs.push({
    className: index.indexName,
    nextRelationship: symbol,
    params: [],
    message: myModelIndexs[index.indexName.replace('sell', 'A')].message,
    radios: [],
    select1: [],
    params2: [],
    select2: [],
    selects: [],
    locked: 0,
    type: index.indexName
  });
  //因为有出市指标
  index.indexName = index.indexName.replace('sell', 'A');
  //输入框不为空
  if (index.indexName === 'A0008' || index.indexName === 'A0009') {
    //下拉框不为空  主要是A0008和A0009
    //       // 有下拉选择
    selectedIndexs[selectedIndexs.length - 1].params.push({
      canRun: 1,
      label: myModelIndexs[index.indexName].params[0].label,
      value: index.indexValue[0].toString() < 9 ? index.indexValue[0] / 1000000 : index.indexValue[0] / 100000000,
      validator: myModelIndexs[index.indexName].params[0].validator,
      errorType: 0,
      showMessage: true,
      locked: 0
    });
    // 第一个select
    selectedIndexs[selectedIndexs.length - 1].select1.push({
      value: index.indexValue[0].toString() < 9 ? 1000000 : 100000000,
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
      validator: myModelIndexs[index.indexName].select1[0].validator,
      errorType: 0,
      showMessage: true
    });
    // 第二个input
    selectedIndexs[selectedIndexs.length - 1].params2.push({
      canRun: 1,
      label: myModelIndexs[index.indexName].params2[0].label,
      value: index.indexValue[1].toString() < 9 ? index.indexValue[1] / 1000000 : index.indexValue[1] / 100000000,
      validator: myModelIndexs[index.indexName].params2[0].validator,
      errorType: 0,
      showMessage: true,
      locked: 0
    });

    // 第二个select

    selectedIndexs[selectedIndexs.length - 1].select2.push({
      value: index.indexValue[1].toString() < 9 ? 1000000 : 100000000,
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
      validator: myModelIndexs[index.indexName].select2[0].validator,
      errorType: 0,
      showMessage: true
    })
  }
  else if (index.indexName === 'C0001') {
    //添加 C0001 selects
    selectedIndexs[selectedIndexs.length - 1].selects.push({
      value: index.indexValue[0],
      label: myModelIndexs[index.indexName].selects[0].label,
      optionList: [],
      locked: 0
    });
    for (let t = 0; t < myModelIndexs[index.indexName].selects[0].optionList.length; t++) {
      const optionLists = myModelIndexs[index.indexName].selects[0].optionList;
      selectedIndexs[selectedIndexs.length - 1].selects[0].optionList.push({
        value: optionLists[t].label,
        label: optionLists[t].label
      });
    }
    //添加C0001 params
    selectedIndexs[selectedIndexs.length - 1].params.push({
      canRun: 1,
      label: myModelIndexs[index.indexName].params[0].label,
      value: index.indexValue[1],
      validator: myModelIndexs[index.indexName].params[0].validator,
      errorType: 0,
      showMessage: true,
      locked: 0
    });
    //添加C0001 radios
    selectedIndexs[selectedIndexs.length - 1].radios.push({
      value: index.indexValue[index.indexValue.length - 1],
      threeFlag: myModelIndexs[index.indexName].radios[0].threeFlag,
      label1: myModelIndexs[index.indexName].radios[0].label1,
      value1: myModelIndexs[index.indexName].radios[0].value1,
      label2: myModelIndexs[index.indexName].radios[0].label2,
      value2: myModelIndexs[index.indexName].radios[0].value2,
      label3: myModelIndexs[index.indexName].radios[0].threeFlag ? myModelIndexs[index.indexName].radios[0].label3 : '',
      value3: myModelIndexs[index.indexName].radios[0].threeFlag ? myModelIndexs[index.indexName].radios[0].value3 : '',
      locked: 0
    })
  } else {
    if (myModelIndexs[index.indexName].params.length !== 0) {

      for (let j = 0; j < myModelIndexs[index.indexName].params.length; j++) {
        //填写值
        selectedIndexs[selectedIndexs.length - 1].params.push({
          canRun: 1,
          label: myModelIndexs[index.indexName].params[j].label,
          value: index.indexValue[j],
          validator: myModelIndexs[index.indexName].params[j].validator,
          errorType: 0,
          showMessage: true,
          locked: 0
        });
        // console.log(myModelIndexs[index.indexName]);
      }
    }
    //单选框不为空
    if (myModelIndexs[index.indexName].hasOwnProperty('radios') && myModelIndexs[index.indexName].radios.length !== 0) {
      selectedIndexs[selectedIndexs.length - 1].radios.push({
        value: index.indexValue[index.indexValue.length - 1],
        threeFlag: myModelIndexs[index.indexName].radios[0].threeFlag,
        label1: myModelIndexs[index.indexName].radios[0].label1,
        value1: myModelIndexs[index.indexName].radios[0].value1,
        label2: myModelIndexs[index.indexName].radios[0].label2,
        value2: myModelIndexs[index.indexName].radios[0].value2,
        label3: myModelIndexs[index.indexName].radios[0].threeFlag ? myModelIndexs[index.indexName].radios[0].label3 : '',
        value3: myModelIndexs[index.indexName].radios[0].threeFlag ? myModelIndexs[index.indexName].radios[0].value3 : '',
        locked: 0
      })
    }
  }

};
//重建模型  编辑模型  解析指标
export const resolveIndicator = (selectedIndicator, modelPara, controller, symbol) => {
  selectedIndicator.splice(0, selectedIndicator.length);
  const modelController = CONTROLLER(modelPara);
  //模型名称  智能回测时，模型名称是没有的  故而需要判断一下
  controller.modelName = modelPara.indexOf('[NAME]') !== -1 ? modelPara.substring(modelPara.indexOf('[NAME]') + 6, modelPara.lastIndexOf('[NAME]')) : controller.modelName;
  //持有期
  controller.holdDate = modelController[0];
  //起始日期
  controller.backStart = modelController[1];
  //结束日期
  controller.backEnd = modelController[2];
  //买入费率
  controller.buyRate = modelController[3];
  //卖出费率
  controller.sellRate = modelController[4];
  //压力费率
  controller.pressureRate = modelController[5];
  //最大持股
  controller.maxDailyHold = modelController[6];
  controller.stopProfit = modelController[7] === undefined ? 1000 : modelController[7];
  controller.stopLoss = modelController[8] === undefined ? 1000 : modelController[8];
//  解析入市指标
  let pos = 0;
  let nextRelationship = '';
  let intoMarket = modelPara.substring(modelPara.indexOf('[IN]') + 4, modelPara.lastIndexOf('[IN]'));
  let leftBracket = intoMarket.substring(0, intoMarket.indexOf('A'));
  symbol.andOrNotIntoMarketLeft = leftBracket;
  pos += leftBracket.length;
  let intoMarketArr = intoMarket.replace(/\(|\)/g, '').split(/\&|\||\$/);

  //解析每一个指标  加入到已选指标中
  for (let i = 0; i < intoMarketArr.length; i++) {
    pos += intoMarketArr[i].length;
    if (intoMarket.indexOf('A', pos) !== -1) {
      nextRelationship = intoMarket.substring(pos, intoMarket.indexOf('A', pos));
      pos += nextRelationship.length;
    } else {
      nextRelationship = '';
    }
    // console.log(pos);
    // console.log(pos);
    splitABC(intoMarketArr[i], selectedIndicator, nextRelationship);
  }
  let rightBracket = intoMarket.substring(pos);
  symbol.andOrNotIntoMarketRight = rightBracket;
//  解析出市指标
  if (modelPara.indexOf('[SELL]') !== -1) {
    let pos = 0;
    let nextRelationship = '';
    let outMarket = modelPara.substring(modelPara.indexOf('[SELL]') + 6, modelPara.lastIndexOf('[SELL]'));
    let leftBracket = outMarket.substring(0, outMarket.indexOf('A'));
    pos += leftBracket.length;
    let outMarketArr = outMarket.replace(/\(|\)/g, '').split(/\&|\||\$/);
    //解析每一个指标  加入到已选指标中
    for (let i = 0; i < outMarketArr.length; i++) {
      pos += outMarketArr[i].length;
      if (outMarket.indexOf('A', pos) !== -1) {
        nextRelationship = outMarket.substring(pos, outMarket.indexOf('A', pos));
        pos += nextRelationship.length;
      } else {
        nextRelationship = '';
      }
      splitABC(outMarketArr[i].replace('A', 'sell'), selectedIndicator, nextRelationship);
    }
    let rightBracket = outMarket.substring(pos);
    symbol.andOrNotOutMarketLeft = leftBracket;
    symbol.andOrNotOutMarketRight = rightBracket;
  }
//  解析风控指标
  if (modelPara.indexOf('[DAN_CON]') !== -1) {
    let pos = 0;
    let nextRelationship = '';
    let windCtrl = modelPara.substring(modelPara.indexOf('[DAN_CON]') + 9, modelPara.lastIndexOf('[DAN_CON]'));
    //左括号
    let leftBracket = windCtrl.substring(0, windCtrl.indexOf('C'));
    pos += leftBracket.length;
    let windCtrlArr = windCtrl.replace(/\(|\)/g, '').split(/\&|\||\$/);
    //解析每一个指标  加入到已选指标中
    for (let i = 0; i < windCtrlArr.length; i++) {
      pos += windCtrlArr[i].length;
      if (windCtrl.indexOf('C', pos) !== -1) {
        nextRelationship = windCtrl.substring(pos, windCtrl.indexOf('C', pos));
        pos += nextRelationship.length;
      } else {
        nextRelationship = '';
      }
      splitABC(windCtrlArr[i], selectedIndicator, nextRelationship);
    }
    //右括号
    let rightBracket = windCtrl.substring(pos);
    symbol.andOrNotWindCtrlLeft = leftBracket;
    symbol.andOrNotWindCtrlRight = rightBracket;
  }
  //二次筛选指标
  let second = modelPara.substring(modelPara.indexOf('[SECOND]') + 8, modelPara.lastIndexOf('[SECOND]'));
  splitABC(second, selectedIndicator, '');
};
export const combineIndicator = (formValidate, ctrl) => {

  let intoMarketComb = '';
  let outMarketComb = '';
  let windCtrlComb = '';
  let secondComb = '';
  let locked = '';
  //controller
  let controller = 'CONTROL-' + ctrl.holdDate + '_' + new Date(ctrl.backStart).format('yyyy-MM-dd') + '_' +
    new Date(ctrl.backEnd).format('yyyy-MM-dd') + '_' + ctrl.buyRate + '_' + ctrl.sellRate + '_' +
    ctrl.pressureRate + '_' + ctrl.maxDailyHold + '_' + ctrl.stopProfit + '_' + ctrl.stopLoss;
//  入市指标
  intoMarketComb = str(formValidate.andOrNotIntoMarketLeft, formValidate.andOrNotIntoMarketRight, formValidate.intoMarketListTemp, '[IN]');

//  出市指标和锁定标签项
  if (formValidate.outMarketListTemp.length !== 0) {
    outMarketComb = str(formValidate.andOrNotOutMarketLeft, formValidate.andOrNotOutMarketRight, formValidate.outMarketListTemp, '[SELL]');
  }
//  风控指标
  if (formValidate.windCtrlListTemp.length !== 0) {
    let end = 0;
    formValidate.windCtrlListTemp.forEach((ele, index) => {
      if (ele.className === '') {
        if (ele.modelPara.indexOf('[DAN_CON]') !== -1) {
          windCtrlComb += '(' + ele.modelPara.substring(ele.modelPara.indexOf('[DAN_CON]') + 9, ele.modelPara.lastIndexOf('[DAN_CON]')) + ')';

          windCtrlComb += ele.nextRelationship;
          end = index;
        }
      } else {
        if (!ele.params.length && !ele.radios.length) {
          windCtrlComb += ele.className + '-0';
        } else if (!ele.params.length && ele.radios.length) {
          windCtrlComb += ele.className + '-';
          ele.radios.forEach(eleRadioChild => {
            windCtrlComb += eleRadioChild.value;
          });
        } else {
          windCtrlComb += ele.className + '-';
          ele.selects.forEach(eleChild => {
            windCtrlComb += eleChild.value + '_';
          });
          ele.params.forEach(eleChild => {
            windCtrlComb += eleChild.value + '_';
          });
          ele.radios.forEach(eleRadioChild => {
            windCtrlComb += eleRadioChild.value + '_';
          });
          windCtrlComb = windCtrlComb.substring(0, windCtrlComb.length - 1);
        }

        windCtrlComb += ele.nextRelationship;
        end = index;

      }
    });
    windCtrlComb = windCtrlComb.substring(0, windCtrlComb.lastIndexOf(formValidate.windCtrlListTemp[end].nextRelationship));
    windCtrlComb = windCtrlComb === '' ? windCtrlComb : formValidate.andOrNotWindCtrlLeft + windCtrlComb + formValidate.andOrNotWindCtrlRight;

  }
//  二次筛选指标
  formValidate.secondListTemp.forEach((ele) => {
    if (!ele.params.length && !ele.radios.length) {
      secondComb += ele.className + '-0';
    } else if (!ele.params.length && ele.radios.length) {
      secondComb += ele.className + '-';
      ele.radios.forEach(eleRadioChild => {
        secondComb += eleRadioChild.value;
      });
    } else {
      secondComb += ele.className + '-';
      ele.params.forEach(eleChild => {
        secondComb += eleChild.value + '_';
      });
      ele.radios.forEach(eleRadioChild => {
        secondComb += eleRadioChild.value + '_';
      });
      secondComb = secondComb.substring(0, secondComb.length - 1);
    }
  });
  locked = combineLockStr(formValidate);
//  最后返回组合的字符串
  return '[NAME]' + ctrl.modelName + '[NAME]' + '[IN]' + intoMarketComb + '[IN]' + '[OUT]'
    + controller + '[OUT]' + '[SECOND]' + secondComb + '[SECOND]' + (windCtrlComb === '' ? '' : '[DAN_CON]' + windCtrlComb + '[DAN_CON]')
    + (outMarketComb === '' ? '' : '[SELL]' + outMarketComb + '[SELL]') + '[LOCK]' + locked + '[LOCK]';
};
//从所有的指标信息中分类出入市  出市 风控和二次筛选指标
export const classifyIndicator = (allIndicator, tag, logo) => {
  return allIndicator.filter(function (item) {
    return item.className.indexOf(tag) !== -1 || (item.className === '' && item.selectModelClass === logo);
  });
};
//指标转化为详细描述信息
export const indicatorToDes = (arr, leftSymbol, rightSymbol) => {
  // console.log(arr);
  let modelInfo = [];
  let everyModelInfo = '';
  let everySelectedIndex = {};
  for (let i = 0; i < arr.length; i++) {
    everySelectedIndex = arr[i];
    // if (everySelectedIndex.className === '') {
    //   everyModelInfo = everySelectedIndex.modelName;
    //   console.log(everyModelInfo);
    // } else {
    everyModelInfo = everySelectedIndex.message;
    //若有下拉框  进行替换
    if (everySelectedIndex.select1.length !== 0) {
      for (let j = 0; j < everySelectedIndex.select1[0].optionList.length; j++) {
        if (everySelectedIndex.select1[0].optionList[j].value === everySelectedIndex.select1[0].value) {
          everyModelInfo = everyModelInfo.replace(everySelectedIndex.params[0].label, everySelectedIndex.params[0].value + everySelectedIndex.select1[0].optionList[j].label);
        }
      }
      for (let j = 0; j < everySelectedIndex.select2[0].optionList.length; j++) {
        if (everySelectedIndex.select2[0].optionList[j].value === everySelectedIndex.select2[0].value) {
          everyModelInfo = everyModelInfo.replace(everySelectedIndex.params2[0].label, everySelectedIndex.params2[0].value + everySelectedIndex.select2[0].optionList[j].label);
        }
      }
    } else if (everySelectedIndex.radios.length !== 0) {
//专门为C0001写的模型信息查看
      if (everySelectedIndex.hasOwnProperty('selects') && everySelectedIndex.selects.length !== 0) {
        for (let j = 0; j < everySelectedIndex.selects[0].optionList.length; j++) {
          everyModelInfo = everyModelInfo.replace(everySelectedIndex.selects[0].label, everySelectedIndex.selects[0].value);
        }
      }
      for (let j = 0; j < everySelectedIndex.params.length; j++) {
        everyModelInfo = everyModelInfo.replace(everySelectedIndex.params[j].label, everySelectedIndex.params[j].value);
      }
      // 若有单选框  进行替换

      if (everySelectedIndex.radios[0].threeFlag) {
        switch (everySelectedIndex.radios[0].value) {
          case '0':
            everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2 + '/' + everySelectedIndex.radios[0].label3, everySelectedIndex.radios[0].label1);
            break;
          case '1':
            everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2 + '/' + everySelectedIndex.radios[0].label3, everySelectedIndex.radios[0].label2);
            break;
          case '2':
            everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2 + '/' + everySelectedIndex.radios[0].label3, everySelectedIndex.radios[0].label3);
            break;
        }
        // 有三个单选
      } else {
        // 有两个单选
        switch (everySelectedIndex.radios[0].value) {
          case '0':
            everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2, everySelectedIndex.radios[0].label1 === '否' ? '不' : everySelectedIndex.radios[0].label1);
            break;
          case '1':
            everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2, everySelectedIndex.radios[0].label2 === '是' ? '' : everySelectedIndex.radios[0].label2);
            break;
        }
      }
    } else {
      for (let j = 0; j < everySelectedIndex.params.length; j++) {
        everyModelInfo = everyModelInfo.replace(everySelectedIndex.params[j].label, everySelectedIndex.params[j].value);
      }
    }

    // }

    modelInfo.push(everyModelInfo);
    if (i !== arr.length - 1) {
      modelInfo.push(everySelectedIndex.nextRelationship);
    }
  }
  // if(modelInfo.length === 0){
  //   modelInfo.push('无');
  // }
  modelInfo.unshift(leftSymbol);
  modelInfo.push(rightSymbol);
  return modelInfo;
};
//指标转为描述函数
export const modelIndexToDes = (selectedIndexs, andOrNot) => {

  let modelInfo = [];
  let andOrNotToDes = {
    'and': '与',
    'or': '或',
    'not': '依次删除掉'
  };
  // let controller = that.$store.state.controller;
  // const statisticalInfo = that.$store.state.model.report['statistical_info'];
  // 首先添加基础信息
  // 模型名称
  let everyModelInfo = '';
  let everySelectedIndex = {};
  for (let i = 0; i < selectedIndexs.length; i++) {
    everySelectedIndex = selectedIndexs[i];
    if (everySelectedIndex.className !== '') {
      everyModelInfo = everySelectedIndex.message;
      //若有下拉框  进行替换
      if (everySelectedIndex.select1.length !== 0) {
        for (let j = 0; j < everySelectedIndex.select1[0].optionList.length; j++) {
          if (everySelectedIndex.select1[0].optionList[j].value === everySelectedIndex.select1[0].value) {
            everyModelInfo = everyModelInfo.replace(everySelectedIndex.params[0].label, everySelectedIndex.params[0].value + everySelectedIndex.select1[0].optionList[j].label);
          }
        }
        for (let j = 0; j < everySelectedIndex.select2[0].optionList.length; j++) {
          if (everySelectedIndex.select2[0].optionList[j].value === everySelectedIndex.select2[0].value) {
            everyModelInfo = everyModelInfo.replace(everySelectedIndex.params2[0].label, everySelectedIndex.params2[0].value + everySelectedIndex.select2[0].optionList[j].label);
          }
        }
      } else if (everySelectedIndex.radios.length !== 0) {
//专门为C0001写的模型信息查看
        if (everySelectedIndex.hasOwnProperty('selects') && everySelectedIndex.selects.length !== 0) {
          for (let j = 0; j < everySelectedIndex.selects[0].optionList.length; j++) {
            everyModelInfo = everyModelInfo.replace(everySelectedIndex.selects[0].label, everySelectedIndex.selects[0].value);
          }
        }
        for (let j = 0; j < everySelectedIndex.params.length; j++) {
          everyModelInfo = everyModelInfo.replace(everySelectedIndex.params[j].label, everySelectedIndex.params[j].value);
        }
        // 若有单选框  进行替换

        if (everySelectedIndex.radios[0].threeFlag) {
          switch (everySelectedIndex.radios[0].value) {
            case '0':
              everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2 + '/' + everySelectedIndex.radios[0].label3, everySelectedIndex.radios[0].label1);
              break;
            case '1':
              everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2 + '/' + everySelectedIndex.radios[0].label3, everySelectedIndex.radios[0].label2);
              break;
            case '2':
              everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2 + '/' + everySelectedIndex.radios[0].label3, everySelectedIndex.radios[0].label3);
              break;
          }
          // 有三个单选
        } else {
          // 有两个单选
          switch (everySelectedIndex.radios[0].value) {
            case '0':
              everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2, everySelectedIndex.radios[0].label1 === '否' ? '不' : everySelectedIndex.radios[0].label1);
              break;
            case '1':
              everyModelInfo = everyModelInfo.replace(everySelectedIndex.radios[0].label1 + '/' + everySelectedIndex.radios[0].label2, everySelectedIndex.radios[0].label2 === '是' ? '' : everySelectedIndex.radios[0].label2);
              break;
          }
        }
      } else {
        for (let j = 0; j < everySelectedIndex.params.length; j++) {
          everyModelInfo = everyModelInfo.replace(everySelectedIndex.params[j].label, everySelectedIndex.params[j].value);
        }
      }
    } else {
      //  若是模型
      everyModelInfo = everySelectedIndex.modelName;
    }

    modelInfo.push(everyModelInfo);
  }
  modelInfo.push('选股指标关系：' + andOrNotToDes[andOrNot]);

  return modelInfo;
}
