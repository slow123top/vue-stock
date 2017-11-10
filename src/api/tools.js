/**
 * Created by Hu_2015 on 2017/7/8.
 */
//uuid
export const generateUUID = () => {
  let d = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};
//升序排序
export const ascObj = function (field) {
  return field === 'time'||field === 'test_time' ? function (a, b) {
    return new Date(a[field]) - new Date(b[field]);
  } : function (a, b) {
    if (String(a[field]).indexOf('%') !== -1) {
      return a[field].replace('%', '') - b[field].replace('%', '');
    } else {
      return a[field] - b[field];
    }
  }
};
//降序排序
export const descObj = function (field) {
  return field === 'time'||field === 'test_time' ? function (a, b) {
    return new Date(b[field]) - new Date(a[field]);
  } : function (a, b) {
    if (String(a[field]).indexOf('%') !== -1) {
      return b[field].replace('%', '') - a[field].replace('%', '');
    } else {
      return b[field] - a[field];
    }

  }
};
//登录超时  点击按钮 提示
export const loginTimeoutPrompt = function (that) {
  that.$Modal.confirm({
    title: '提示',
    render: (h) => {
      return h('div', {
        style: {
          fontSize: '1rem',
          textAlign: 'center'
        }
      }, '登陆超时,是否重新登录?')
    },
    okText: '重新登录',
    cancelText: '取消',
    onOk: () => {
      //  点击之后重新登录  localstorage清空  session过期
      that.$store.commit('ISLOGIN', {
        isLogin: false
      });
      that.$router.push('/login');
      localStorage.clear();
    }
  });
};

//登陆超时 直接刷新  提示
export const jumpLogin = function (that) {
  //  localstorage清空 用户信息清空  进入登录页面
  that.$store.commit('ISLOGIN', {
    isLogin: false
  });
  that.$router.push('/login');
  localStorage.clear();
};
//邮箱伪装函数
export const changeEmail = function (email) {
  return email.substring(0, 3) + '***' + email.substring(email.indexOf('@') - 1);
};
//手机伪装函数
export const changePhone = function (phone) {
  return phone.substring(0, 3) + '******' + phone.substring(9);
}
//封装入市  出市 或者风控字符串  便于回测前的检查
export const checkStr = function (leftBracket, rightBracket, arr) {
  let a = '';
  for (let i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      a += arr[i]['className'];
    } else {
      a += arr[i]['className'] + arr[i]['nextRelationship'];
    }
  }
  return leftBracket + a + rightBracket;
};
//检查括号是否平衡
export const isBracketBalance = function (str) {
  var leftBracketNum = 0,  // 用于保存左括号个数的变量
    strLength = str.length; // 把字符串的长度付给一个变量增加程序的性能

  // 通过for循环来读取字符串中的一个一个的字符
  for (var i = 0; i < strLength; i++) {
    var temp = str.charAt(i); // 付给临时变量增加程序的性能
    if (temp === '(') // 如果是左括号，则leftBracketNum++
    {
      leftBracketNum++;
    }
    if (temp === ')') // 如果是右括号，则leftBracketNum--
    {
      leftBracketNum--;
    }
  }
  // 最后判断leftBracketNum，如果为0表示平衡否则不平衡
  if (leftBracketNum === 0) {
    return true;
  } else {
    return false;
  }
}
