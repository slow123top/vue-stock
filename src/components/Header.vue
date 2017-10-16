<template>
  <Row type="flex" justify="space-between" style="height: 4rem;border-bottom: 1px solid #e3e8ee">
    <i-col span="4" offset="2">
      <router-link to="/portal"><img src="../img/logo.png" alt="千投量化"></router-link>
    </i-col>
    <i-col span="12" style="padding: 1rem 0">
      <Row class="menu" type="flex" justify="end">
        <i-col span="3">
          <router-link to="/" style="color: #000000">首页</router-link>
        </i-col>
        <i-col span="3" style="color: #000000">
          <a class="m-children" @click="createModel">创建模型</a>
        </i-col>
        <i-col span="3">
          <Dropdown trigger="click" @on-click="useModel">
            <a class="m-children" href="javascript:void(0)">
              使用模型

              <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list">
              <Dropdown-item name="my-model">我的模型</Dropdown-item>
              <Dropdown-item name="model-storage">模型仓库</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </i-col>
        <i-col span="3">
          <a class="m-children" @click="getTrackModel">实盘跟踪</a>
        </i-col>
        <i-col span="3">
          <Dropdown trigger="click" @on-click="selectReacharge">
            <a class="m-children" href="javascript:void(0)">
              充值中心



              <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list">
              <Dropdown-item name="point">充值点数</Dropdown-item>
              <Dropdown-item name="card">购买回测卡</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </i-col>
        <i-col span="3">
          <Dropdown trigger="click" @on-click="selectHelp">
            <a class="m-children" href="javascript:void(0)">
              更多



              <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list">
              <Dropdown-item name="guide">新手指南</Dropdown-item>
              <Dropdown-item name="intelligent">智能回测</Dropdown-item>
              <Dropdown-item name="question">常见问题</Dropdown-item>
              <Dropdown-item name="about">关于我们</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </i-col>
      </Row>
    </i-col>
    <i-col span="5" style="padding: .5rem 0">
      <Button type="primary" size="large" style="width: 5rem" @click="login" v-if="!isLogin">登录</Button>
      <Button size="large" style="width: 5rem" @click="register" v-if="!isLogin">注册</Button>
      <!--我的点数-->
      <Tooltip :content="'昵称：'+$store.state.user.nickName" placement="right">
        <Dropdown trigger="click" @on-click="selectMenu"
                  style="margin-left: 20px;font-size: 1rem;margin-top: .3rem;"
                  v-if="isLogin">
          <a href="javascript:void(0)" style="font-weight: bold">
            <!--{{$store.state.user.nickName}}-->
            <span
              style="display: inline-block;margin-bottom:-.5rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap">
              {{$store.state.user.nickName}}
            </span>
            <Icon type="arrow-down-b"></Icon>
          </a>
          <Dropdown-menu slot="list" style="z-index: 999">
            <Dropdown-item name="personal-main">个人主页</Dropdown-item>
            <Dropdown-item name="recharge">充值点数</Dropdown-item>
            <Dropdown-item name="buycard">购买回测卡</Dropdown-item>
            <Dropdown-item name="once">单次回测记录</Dropdown-item>
            <Dropdown-item name="intelligent">智能回测记录</Dropdown-item>
            <Dropdown-item name="logout">
              注销


            </Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </Tooltip>
    </i-col>
  </Row>
</template>
<script>
  import Login from './user/Login'
  import {getRemoteReqTodo, BASE_API_URL, getRandomModel} from '../api/api'
  import {jumpLogin} from '../api/tools'
  export default{
    mounted(){
      const that = this;
      getRemoteReqTodo('/user/infomation/getuserinfo', [], []).then(res => {
        let data = res.data;
        if (data['status'] === 'SUCCESS') {
          let user = data['userInfo'];
          that.$store.commit('ISLOGIN', {
            isLogin: true,
            email: user['email'],
            phone: user['phone'],
            nickName: user['nickName'],
            points: user['points'],
            isEmail: user['email'] === '' ? false : true,
            userType: user['userType']
          });
        } else if (data['status'] === 'ERROR') {
          that.$store.commit('ISLOGIN', {
            isLogin: false,
            email: '',
            nickName: '',
            myPoints: ''
          });
        } else if (data['status'] === 'USER_NOT_FOUND') {
          localStorage.clear();
          that.$store.commit('ISLOGIN', {
            isLogin: false,
            email: '',
            nickName: '',
            points: '',
            myPoints: ''
          });
//          如果是主页  就不要跳转登录页面了
          if (that.$route.path.indexOf('/') === -1) {

            that.$router.push('/login');
          }

        }
      })
    },
    data(){
      return {
        logining: false,
        nickName: '',
        logoSrc: BASE_API_URL + '/img/logo.png',
//        myPoints: '',
      }
    },
    methods: {
      createModel(){
        if (this.$store.state.user.isLogin) {
          this.$store.commit('EMPTY_INDEX');
          getRandomModel(this.$store.state.selectedIndexs, this);
          this.$router.push('/model');
        } else {
          jumpLogin(this);
        }
      },

      getTrackModel(){
//          进入实盘跟踪
        if (this.$store.state.user.isLogin) {
          this.$router.push('/model/trackmodel');
        } else {
          jumpLogin(this);
        }
      },
      login(){
//        this.logining = true;
        this.$router.push('/login');
      },
      register(){
        this.$router.push('/register');
      },
      useModel(name){
        switch (name) {
          case 'my-model':
            this.$router.push('/model/myModel');
            break;
          case 'model-storage':
            this.$router.push('/model/modelstorage');
            break;
          default:
            break;
        }
      },
      selectReacharge(name){
        switch (name) {
          case 'point':
            this.$router.push('/personalInfo/recharge');
            break;
          case 'card':
            this.$router.push('/personalInfo/buycard');
            break;
          default:
            break;
        }
      },
      selectMenu(name){
        switch (name) {
          case 'personal-main':
            this.$router.push('/personalInfo');
            break;
          case 'personal-model':
            this.$router.push('/model/myModel');
            break;
          case 'once':
            this.$router.push('/model/history');
            break;
          case 'intelligent':
            this.$router.push('/model/genetictest');
            break;
          case 'recharge':
            this.$router.push('/personalInfo/recharge');
            break;
          case 'buycard':
            this.$router.push('/personalInfo/buycard');
            break;
          case 'logout':
//            注销
            localStorage.clear();
            this.$store.commit('ISLOGIN', {
              isLogin: false,
              email: '',
              nickName: '',
              points: '',
              myPoints: ''
            });
//            getRemoteReqTodo('/user/logout',[],[]);
            location.href = BASE_API_URL + '/user/logout';
//            this.$router.push('/portal');
            break;
          default:
            break;
        }
      },
      selectHelp(name){
        switch (name) {
          case 'question':
            this.$router.push('/help');
            break;
          case 'guide':
            this.$router.push('/help/guide');
            break;
          case 'intelligent':
            this.$router.push('/help/geneticdoc');
            break;
          case 'about':
            this.$router.push('/help/about');
            break;
        }
      }
    },

    computed: {
      isLogin: function () {
        if (this.$store.state.user.isLogin !== '') {
          return this.$store.state.user.isLogin;
        }
      }
    },
    components: {
      Login
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>
  .layout-header {
    height: 4rem;
    background-color: #FFFFFF;
  }

  .menu {
    font-size: 1rem;
    color: #000000;

  }

  a.m-children {
    color: #495060;
  }

  img {
    width: 12rem;
    height: 3.5rem;
  }

</style>
