/**
 * Created by Hu_2015 on 2017/2/26.
 */
import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '../components/article/HomePage'


import Article from '../components/backstage/Article'
import Official from '../components/backstage/Officialannounce'
import store from '../vuex/store'
//门户
import Portal from '../components/portal/Portal'
//登录和注册
import Login from '../components/user/Login'
import Register from '../components/user/Register'
import ForgetPasswd from '../components/user/ForgetPasswd'
import NotFound from '../components/NotFound'

//模型模块
import Model from '../components/stock/Stock'
import NewModel from '../components/stock/SelectIndex'
import Result from '../components/stock/Result'
import MyModel from '../components/stock/MyModel'
import Track from '../components/stock/Track'
import History from '../components/stock/History'
import ModelStorage from '../components/stock/ModelStroage.vue'
// import GeneticTest from '../components/stock/GeneticTest'
import GeneticTest from '../components/stock/GeneticTest'

//个人信息
import PersonalInfo from '../components/personalinfo/PersonalInfo'
import Recharge from '../components/personalinfo/Recharge'
import BuyCard from '../components/personalinfo/BuyCard'
import MyWallet from '../components/personalinfo/MyWallet'
import BuyCardRecord from '../components/personalinfo/BuyCardRecord'
import RechargeRecord from '../components/personalinfo/RechargeRecord'
import DeducPoints from '../components/personalinfo/DeducPoints'
import UpdatePasswd from '../components/personalinfo/UpdatePasswd'
import Phone from '../components/personalinfo/Phone'
import Email from '../components/personalinfo/Email'
//说明文档模块
import Document from '../components/document/Document'
import CompanyState from '../components/document/CompanyState'
import Question from '../components/document/Question'
import Guide from '../components/document/Guide'
import About from '../components/document/About'
import GeneticDoc from '../components/document/GeneticDoc'
Vue.use(Router)
const router = new Router({
  //创建路由
  // mode: 'history',
  routes: [
    {
      name: 'portal',
      path: '/portal',
      title: '首页',
      meta: {
        title: '用户中心'
      },
      component: Portal
    },
    {
      path: '/',
      redirect: '/portal'
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (store.state.user.isLogin) {
          next(false);
        } else {
          next();
        }
      }
    },
    {
      name: 'register',
      path: '/register',
      component: Register
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage
    },
    {
      path: '/notfound',
      component: NotFound
    },
    {
      path: '/help',
      component: Document,
      children: [
        {
          name: 'companystate',
          path: 'companystate',
          component: CompanyState
        },
        {
          name: 'question',
          path: 'question',
          component: Question
        }, {
          path: '/help',
          redirect: '/help/question'
        }, {
          path: 'guide',
          component: Guide
        },
        {
          path: 'about',
          component: About
        },
        {
          path: 'geneticdoc',
          component: GeneticDoc
        }
        // {
        //   name: 'exemption',
        //   path: 'exemption',
        //   component: Mianze
        // }
      ]
    },
    //忘记密码
    {
      path: '/forgetpassword',
      name: 'forgetPassword',
      component: ForgetPasswd
    },
    // 我的模型 创建模型  历史回测
    {
      path: '/model',
      component: Model,
      children: [{
        //创建新模型
        name: 'newModel',
        path: 'newModel',
        component: NewModel
      }, {
        //我的模型
        path: 'myModel',
        component: MyModel
      },
        {
          path: 'modelstorage',
          component: ModelStorage
        },
        {
          path: 'trackmodel',
          component: Track
        },
        {
          //历史回测
          path: 'history',
          component: History
        },
        {
          path: '/model',
          redirect: '/model/newModel'
        },
        {
          path: 'singletest',
          component: Result,

        },
        // {
        //   path: 'genetictest',
        //   component: GeneticTest
        // },
        {
          path: 'genetictest',
          component: GeneticTest
        }
      ]
    },
    {
      path: '/backstage/article', //

      name: 'article',
      component: Article

    }, {
      path: '/backstage/official',
      name: 'official',
      component: Official
    },
    //个人信息
    {
      name: 'personalInfo',
      path: '/personalInfo',
      component: PersonalInfo,
      // beforeEnter: (to, from, next) => {
      //   if (store.state.user.isLogin) {
      //     next();
      //   } else {
      //     next('/login');
      //   }
      // },
      children: [
        {
          //修改密码
          path: 'updatepasswd',
          component: UpdatePasswd
        },
        {
          //手机设置
          path: 'phone',
          component: Phone
        },
        {
          //邮箱设置
          path: 'email',
          component: Email
        },
        {
          //充值
          path: 'recharge',
          component: Recharge
        },
        {
          path: 'buycard',
          component: BuyCard
        }, {
          path: 'mywallet',
          component: MyWallet
        },
        {
          path: '/personalInfo',
          redirect: '/personalInfo/mywallet'
        },
        {
          path: 'buycardrecord',
          component: BuyCardRecord
        },
        {
          path: 'rechargerecord',
          component: RechargeRecord
        },
        {
          path: 'deducpoints',
          component: DeducPoints
        }
      ]
    }
  ]
})
// router.beforeEach((to, from, next) => {
// if (from.path.indexOf('/login') !== -1 || to.path.indexOf('/login') !== -1) {
//   if (!store.state.user.isLogin) {
//     //没有登录  登录页面
//     next();
//   } else {
//     next('/');
//   }
// }
// else {
//   //其他到程序中去判断
//   next();
// }
// });

export default router;
