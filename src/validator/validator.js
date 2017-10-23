/**
 * Created by Hu_2015 on 2017/6/11.
 */
import store from '../vuex/store'
import $ from 'jquery'
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
// function errorMargin(li,i) {
//   $(li).eq(i).css({
//     'margin-bottom':'2.5rem'
//   });
// };
// function errorMarginCancel(li,j,) {
//   $(li).eq(i).css({
//     'margin-bottom':'1rem'
//   });
// }
//限制模型名称的长度
// let store.state.currentInputIndex.parentIndex = store.state.currentInputIndex.store.state.currentInputIndex.parentIndex;
// let store.state.currentInputIndex.childIndex = store.state.currentInputIndex.store.state.currentInputIndex.childIndex;
//controller B C检验器 一些A指标  如代码类
function validator(regExp, min, max, errorMessage, canRunParam) {
  return (rule, value, callback) => {
    if (value === '' || !new RegExp(regExp).test(value)) {
      store.state.controller[canRunParam] = 0;
      callback(new Error(errorMessage));
    } else {
      if (value < min || value > max) {
        store.state.controller[canRunParam] = 0;
        min !== -Infinity && max !== Infinity ? callback(new Error('范围:' + min + '~' + max)) : callback(new Error('范围:大于等于' + min));
      } else {
        canRunParam === 'canRun' ? store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex][canRunParam] = 1 :
          store.state.controller[canRunParam] = 1;
        callback();
      }
    }
  }
}
//无比较的校验器
function A_validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    if (value === '' || !new RegExp(regExp).test(value)) {
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
        'margin-bottom': '2.5rem'
      });
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 1;
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
          'margin-bottom': '2.5rem'
        });
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
        callback();
        let errorMargin = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params.every(function (item) {
          return item.errorType !== 1 && item.errorType !== 2;
        });
        if (errorMargin) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
            'margin-bottom': '1rem'
          });
        }
        ;
      }
    }
  }
};
//判断正数
function A_positiveValidator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
        'margin-bottom': '2.5rem'
      });
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value <= min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
          'margin-bottom': '2.5rem'
        });
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的
        if (store.state.currentInputIndex.childIndex === 0) {
          let child0 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
          let child1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value;
          if (Number(child0) > Number(child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 1) {
          let child0 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
          let child1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value;
          if (Number(child0) > Number(child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();

          }
        } else if (store.state.currentInputIndex.childIndex === 2) {
          let child2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value;
          let child3 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[3].value;
          if (Number(child2) > Number(child3)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else {
          let child2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value;
          let child3 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[3].value;
          if (Number(child2) > Number(child3)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        }
        let errorMargin = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params.every(function (item) {
          return item.errorType !== 1 && item.errorType !== 2;
        });
        if (errorMargin) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
            'margin-bottom': '1rem'
          });
        }

      }
    }

  }
}
//A0001系列N1<=N2
function A0001validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
        'margin-bottom': '2.5rem'
      });
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
          'margin-bottom': '2.5rem'
        });
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的
        if (store.state.currentInputIndex.childIndex === 0) {
          let child0 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
          let child1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value;
          if (Number(child0) > Number(child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 1) {
          let child0 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
          let child1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value;
          if (Number(child0) > Number(child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();

          }
        } else if (store.state.currentInputIndex.childIndex === 2) {
          let child2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value;
          let child3 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[3].value;
          if (Number(child2) > Number(child3)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 3) {
          let child2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value;
          let child3 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[3].value;
          if (Number(child2) > Number(child3)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 4) {
          let child4 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[4].value;
          let child5 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[5].value;
          if (Number(child4) > Number(child5)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else {
          let child4 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[4].value;
          let child5 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[5].value;
          if (Number(child4) > Number(child5)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            callback();
          }

        }

        let errorMargin = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params.every(function (item) {
          return item.errorType !== 1 && item.errorType !== 2;
        });
        if (errorMargin) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
            'margin-bottom': '1rem'
          });
        }

      }
    }

  }
};
//A0002系列  N1<N2
function A0002validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {

    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
        'margin-bottom': '2.5rem'
      });
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
          'margin-bottom': '2.5rem'
        });
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的

        if (store.state.currentInputIndex.childIndex === 0) {
          let child0 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
          let child1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value;
          if (Number(child0) >= Number(child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 1) {
          let child0 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
          let child1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value;
          if (Number(child0) >= Number(child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 2) {
          let child2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value;
          let child3 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[3].value;
          if (Number(child2) >= Number(child3)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 3) {
          let child2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value;
          let child3 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[3].value;
          if (Number(child2) >= Number(child3)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {

              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 4) {
          let child4 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[4].value;
          let child5 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[5].value;
          if (Number(child4) >= Number(child5)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else {
          let child4 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[4].value;
          let child5 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[5].value;
          if (Number(child4) >= Number(child5)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }

        }
        let errorMargin = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params.every(function (item) {
          return item.errorType !== 1 && item.errorType !== 2;
        });
        if (errorMargin) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
            'margin-bottom': '1rem'
          });
        }
      }
    }
  }
};
//A0017  复杂比较
function A0017validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
        'margin-bottom': '2.5rem'
      });
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
          'margin-bottom': '2.5rem'
        });
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的
        let child0 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value);
        let child1 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value);
        let child2 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value);
        let child3 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[3].value);
        if (store.state.currentInputIndex.childIndex === 0) {

          if (!(child0 <= child2 && child2 <= child3 && child3 <= child1 && child0 < child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
              'margin-bottom': '2.5rem'
            });
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            for (let i = 1; i < 4; i++) {
              if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].errorType === 3) {
                $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + i).removeClass('ivu-form-item-error');
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].canRun = 1;
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].showMessage = false;
              }
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].errorType = 0;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 1) {
          if (!(child0 <= child2 && child2 <= child3 && child3 <= child1 && child0 < child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
              'margin-bottom': '2.5rem'
            });
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType = 0;
            for (let i = 1; i < 3; i++) {
              if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].errorType === 3) {
                $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + i).removeClass('ivu-form-item-error');
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].canRun = 1;
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].showMessage = false;
              }
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].errorType = 0;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 2) {
          if (!(child0 <= child2 && child2 <= child3 && child3 <= child1 && child0 < child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
              'margin-bottom': '2.5rem'
            });
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType = 0;
            for (let i = 1; i < 3; i++) {
              if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].errorType === 3) {
                $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - i).removeClass('ivu-form-item-error');
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].canRun = 1;
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].showMessage = false;
              }
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].errorType = 0;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else {
          if (!(child0 <= child2 && child2 <= child3 && child3 <= child1 && child0 < child1)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
              'margin-bottom': '2.5rem'
            });
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            for (let i = 3; i > 0; i--) {
              // console.log(store.state.currentInputIndex.childIndex);
              if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].errorType === 3) {
                $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - i).removeClass('ivu-form-item-error');
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].canRun = 1;
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].showMessage = false;
              }
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].errorType = 0;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        }
        let errorMargin = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params.every(function (item) {
          return item.errorType === 0;
        });
        if (errorMargin) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
            'margin-bottom': '1rem'
          });
        }
      }
    }
  }
};
//A0010系列 N1<=M<=N2 N1<N2
function A0010validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
        'margin-bottom': '2.5rem'
      });
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
          'margin-bottom': '2.5rem'
        });
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的
        let child0 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value);
        let child1 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value);
        let child2 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value);
        if (store.state.currentInputIndex.childIndex === 0) {
          if (!(child1 <= child0 && child0 <= child2 && child1 < child2)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            for (let i = 1; i < 3; i++) {
              if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].errorType === 3) {
                $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + i).removeClass('ivu-form-item-error');
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].canRun = 1;
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + i].showMessage = false;
              }
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else if (store.state.currentInputIndex.childIndex === 1) {
          if (!(child1 <= child0 && child0 <= child2 && child1 < child2)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + i).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else {
          if (!(child1 <= child0 && child0 <= child2 && child1 < child2)) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功
            for (let i = 2; i > 0; i--) {
              if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].errorType === 3) {
                $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - i).removeClass('ivu-form-item-error');
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].canRun = 1;
                store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - i].showMessage = false;
              }
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        }
        let errorMargin = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params.every(function (item) {
          return item.errorType !== 1 && item.errorType !== 2;
        });
        if (errorMargin) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
            'margin-bottom': '1rem'
          });
        }
      }
    }
  }
};
//A0040
function A0040validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
        'margin-bottom': '2.5rem'
      });
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
          'margin-bottom': '2.5rem'
        });
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的
        let child1 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value);
        let child2 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value);
        if (store.state.currentInputIndex.childIndex === 1) {
          if (child1 > child2) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功

            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else {
          if (child1 > child2) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功

            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;

            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        }
        let errorMargin = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params.every(function (item) {
          return item.errorType !== 1 && item.errorType !== 2;
        });
        if (errorMargin) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
            'margin-bottom': '1rem'
          });
        }
      }
    }
  }
};
//A0052
function A0052validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
        'margin-bottom': '2.5rem'
      });
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
          'margin-bottom': '2.5rem'
        });
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的
        let child1 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[1].value);
        let child2 = Number(store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[2].value);
        if (store.state.currentInputIndex.childIndex === 1) {
          if (child1 >= child2) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功

            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex + 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex + 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        } else {
          if (child1 >= child2) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex).addClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 3;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 0;
            callback(new Error(errorMessage[2]));
          } else {
            //  如果比较大小成功

            if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].errorType === 3) {
              $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(store.state.currentInputIndex.childIndex - 1).removeClass('ivu-form-item-error');
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].canRun = 1;
              store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex - 1].showMessage = false;
            }
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].canRun = 1;
            callback();
          }
        }
        let errorMargin = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params.every(function (item) {
          return item.errorType !== 1 && item.errorType !== 2;
        });
        if (errorMargin) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).css({
            'margin-bottom': '1rem'
          });
        }
      }
    }
  }
};
///^(([1-9]\d*)|0)(\.\d{1,2})?$/ 带0的保留后两位的小数
///^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/
//A0008 A0009 市值类校验器
//第一个输入框
function A0008M1validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(0).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(0).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的
        let brother1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
        let brother2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].value;
        let select1Value = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].value;
        let select2Value = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].value;
        if (brother1 * select1Value > brother2 * select2Value) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(0).addClass('ivu-form-item-error');
          store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].errorType = 3;
          store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 0;
          callback(new Error(errorMessage[2]));
        } else {
          //  如果比较大小成功
          if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].errorType === 3) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(2).removeClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].canRun = 1;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].showMessage = false;
          }
          if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].errorType === 3) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(1).removeClass('ivu-form-item-error');
            // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].canRun = 1;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].showMessage = false;
          }
          if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].errorType === 3) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(3).removeClass('ivu-form-item-error');
            // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].canRun = 1;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].showMessage = false;
          }
          store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[store.state.currentInputIndex.childIndex].errorType = 0;
          // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 1;
          callback();
        }
      }

    }

  }
};
//第二个输入框
function A0008M2validator(regExp, min, max, errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].showMessage = true;
    if (value === '' || !new RegExp(regExp).test(value)) {
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].errorType = 1;
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(2).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].canRun = 0;
      callback(new Error(errorMessage[0]));
    } else {
      if (value < min || value > max) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(2).addClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].errorType = 2;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].canRun = 0;
        callback(new Error(errorMessage[1]));
      } else {
        //只有这个地方是不同的
        let brother1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
        let brother2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].value;
        let select1Value = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].value;
        let select2Value = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].value;
        if (brother1 * select1Value > brother2 * select2Value) {
          $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(2).addClass('ivu-form-item-error');
          store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].errorType = 3;
          store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 0;
          callback(new Error(errorMessage[2]));
        } else {
          //  如果比较大小成功
          if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].errorType === 3) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(0).removeClass('ivu-form-item-error');
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 1;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].showMessage = false;
          }
          if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].errorType === 3) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(1).removeClass('ivu-form-item-error');
            // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].canRun = 1;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].showMessage = false;
          }
          if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].errorType === 3) {
            $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(3).removeClass('ivu-form-item-error');
            // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].canRun = 1;
            store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].showMessage = false;
          }
          store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 1;
          callback();
        }
      }

    }

  }
};
//A0008 select1校验器
function A0008Select1validator(errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].showMessage = true;
    //只有这个地方是不同的
    let brother1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
    let brother2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].value;
    let select1Value = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].value;
    let select2Value = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].value;
    if (brother1 * select1Value > brother2 * select2Value) {
      //有错误  就在第一个输入框上面
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(1).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].errorType = 3;
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 0;
      callback(new Error(errorMessage));
    } else {
      //  如果比较大小成功
      if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].errorType === 3) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(0).removeClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 1;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].showMessage = false;
      }
      if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].errorType === 3) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(2).removeClass('ivu-form-item-error');
        // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[store.state.currentInputIndex.childIndex].canRun = 1;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].showMessage = false;
      }
      if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[store.state.currentInputIndex.childIndex].errorType === 3) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(3).removeClass('ivu-form-item-error');
        // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].canRun = 1;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].showMessage = false;
      }
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 1;
      callback();
    }
  }
}
;
//A0008 select2校验器
function A0008Select2validator(errorMessage) {
  return (rule, value, callback) => {
    store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].showMessage = true;
    //只有这个地方是不同的
    let brother1 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].value;
    let brother2 = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].value;
    let select1Value = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].value;
    let select2Value = store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].value;
    if (brother1 * select1Value > brother2 * select2Value) {
      //有错误  就在第一个输入框上面
      $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(1).addClass('ivu-form-item-error');
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].errorType = 3;
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 0;
      callback(new Error(errorMessage));
    } else {
      //  如果比较大小成功
      if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].errorType === 3) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(0).removeClass('ivu-form-item-error');
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 1;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].showMessage = false;
      }
      if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].errorType === 3) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(2).removeClass('ivu-form-item-error');
        // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[store.state.currentInputIndex.childIndex].canRun = 1;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params2[0].showMessage = false;
      }
      if (store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].errorType === 3) {
        $('ul.selected-indexs>li').eq(store.state.currentInputIndex.parentIndex).find('.ivu-form-item').eq(1).removeClass('ivu-form-item-error');
        // store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select2[0].canRun = 1;
        store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].select1[0].showMessage = false;
      }
      store.state.selectedIndexs[store.state.currentInputIndex.parentIndex].params[0].canRun = 1;
      callback();
    }
  }
}
;
//A0001 A0005 A0016
export const A0001_N1N2validator = A0001validator(/^[1-9]\d*$/, 1, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间', 'N1<=N2']);
export const A0001_M1M2validator = A0001validator(/^-?(([1-9]\d*)|0)(\.\d{1,2})?$/, -Infinity, Infinity, ['请输入小数(保留小数点后1-2位)', '', 'M1<=M2']);
export const A0005_M1M2validator = A0001validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, 0, Infinity, ['请输入>=0的小数,保留1~2位', '数字应大于等于0', 'M1<=M2']);
///^(0|[1-9][0-9]*)+?(.[0-9]{1,2})?$/
//A0050系列  校验正整数  无比较大小
export const positiveIntegerValidator = A_validator(/^[1-9]\d*$/, 1, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间']);
//A0002校验器
export const A0002_N1N2validator = A0002validator(/^[1-9]\d*$/, 1, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间', 'N1<N2']);
//A0008 A0009
export const A0008_M1validator = A0008M1validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, -Infinity, Infinity, ['请输入数字,M1>=0', '', 'M1<=M2']);
export const A0008_M2validator = A0008M2validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, -Infinity, Infinity, ['请输入数字,M2>=0', '', 'M1<=M2']);
export const A0008_select1Validator = A0008Select1validator('M1<=M2');
export const A0008_select2Validator = A0008Select2validator('M1<=M2');
// export const A0008_Selectvalidator = A0008_Selectvalidator('M1<=M2');
export const A0026_N3N4validator = A0001validator(/^[1-9]\d*$/, 1, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间', 'N3<N4']);
export const A0026_M1M2validator = A0002validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, 0, Infinity, ['请输入>=0的小数,保留1~2位', '数字应大于等于0', 'M1<M2']);
//A0010
export const A0010_MN1N2validator = A0010validator(/^[1-9]\d*$/, 1, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间', 'N1<=M<=N2']);
//A0017-A0020类  复杂指标比较大小
export const A0017_N1N2N3N4validator = A0017validator(/^[1-9]\d*$/, 1, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间', 'N1<=N3<=N4 <=N2,N1<N2']);
//A0027 系列
export const A0027SLMValidator = A_validator(/^[1-9]\d*$/, 2, 200, ['请输入大于0的数字(不含小数)', '数字应介于2~200之间']);
//A0030 Day系列
export const A0030DayValidator = A_validator(/^[1-9]\d*$/, 2, 90, ['请输入大于0的数字(不含小数)', '数字应介于2~90之间']);
//A0030 K D系列
export const A0030KDValidator = A_validator(/^[1-9]\d*$/, 2, 30, ['请输入大于0的数字(不含小数)', '数字应介于2~30之间']);
//A0031系列  M1 M2有范围限制
export const A0031_M1M2validator = A0001validator(/^-?(([1-9]\d*)|0)(\.\d{1,2})?$/, -150, 150, ['请输入小数,保留1~2位', '数字介于-150~150', 'M1<=M2']);
//A0040
export const A0040_Mvalidator = A0040validator(/^[1-9]\d*$/, 1, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间', 'M<=N']);
export const A0040_Nvalidator = A0040validator(/^[1-9]\d*$/, 2, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间', 'M<=N']);
export const A0041_M1M2validator = A0001validator(/^-?(([1-9]\d*)|0)(\.\d{1,2})?$/, -1, 1, ['请输入小数,保留1~2位', '数字应介于-1~1之间', 'M1<=M2']);
//A0034系列  大于等于2的正整数
export const A0034_validator = A_validator(/^[1-9]\d*$/, 2, 1000, ['请输入大于0的数字(不含小数)', '数字应介于2~1000之间']);
//A0036系列 M1 M2均大于0  正数
export const A0036_M1M2validator = A_positiveValidator(/^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/, 0, Infinity, ['请输入>0的小数,保留1~2位', '数字大于0']);
//A0038系列
export const A0038_validator = A_positiveValidator(/^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/, 0, Infinity, ['请输入>0的小数,保留1~2位', '数字大于0', 'M1<=M2']);
//A0042校验器
export const A0042_validator = A_validator(/^-?(([1-9]\d*)|0)(\.\d{1,2})?$/, -1, 1, ['请输入小数,保留1~2位', '数字应介于-1~1之间']);
//A0052
export const A0052_N1N2validator = A0052validator(/^[1-9]\d*$/, 1, 1000, ['请输入大于0的数字(不含小数)', '数字应介于1~1000之间', 'N1<N2']);
//B C指标校验器

//持有期校验器
export const holdDate_validator = validator(/^\+?[1-9]\d*$/, 1, 1000, '请输入数字(不含小数)', 'holdDateCanRun');
//买入费率校验器
export const buyRate_validator = validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, -Infinity, Infinity, '请输入>=0的小数,保留1~2位', 'buyRateCanRun');
//卖出费率校验器
export const sellRate_validator = validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, -Infinity, Infinity, '请输入>=0的小数,保留1~2位', 'sellRateCanRun');
//模型压力费率校验器
export const pressureRate_validator = validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, -Infinity, Infinity, '请输入>=0的小数,保留1~2位', 'pressureRateCanRun');
//最大每日持股数校验器
export const maxHold_validator = validator(/^[1-9]\d*$/, 1, 20, '请输入数字(不含小数)', 'maxHoldCanRun');
//止盈止损的校验器
export const stopProfit_validator = validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, 0, 1000, '请输入>=0的小数,保留1~2位', 'stopProfitCanRun');
export const stopLoss_validator = validator(/^(([1-9]\d*)|0)(\.\d{1,2})?$/, 0, 1000, '请输入>=0的小数,保留1~2位', 'stopLossCanRun');
//模型名称不能为空  校验器
export const modelName_validator = (rule, value, callback) => {
  if (value === '') {
    store.state.controller['modelNameCanRun'] = 0;
    callback(new Error('请输入模型名称'));
  } else {
    store.state.controller['modelNameCanRun'] = 1;
    callback();
  }
}
//B指标校验器
export const secondScreen_validator = A_validator(/^[1-9]\d*$/, 1, 1000, ['请输入数字(不含小数)', '数字应介于1~1000之间']);
//C指标校验器
export const windControl_validator = A_validator(/^[1-9]\d*$/, 2, Infinity, ['请输入数字(不含小数)', '数字应大于等于2']);
//代码类即股票池类指标校验器
export const stockPool_validator = A_validator(/^\d{0,6}$/, -Infinity, Infinity, ['请输入6位以内的数字串', '']);
//上市日期类指标校验器
export const listingDate_validator = A_validator(/^[1-9]\d*$/, -Infinity, Infinity, ['请输入大于0的数字(不含小数)', '']);
