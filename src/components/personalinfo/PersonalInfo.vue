<template>
  <div>
    <Modal v-model="modal" :mask-closable="false" width="360">
      <Spin fix size="large">
        <Icon type="load-c" size=18
                                             class="demo-spin-icon-load"
              style="line-height: 2rem;border-radius: 20px"></Icon>
        <div>加载中...</div>
      </Spin>
      <div slot="footer">
      </div>
    </Modal>
    <Row type="flex" justify="center"
         style="background: #f7f7f7;height: 50rem;">
      <i-col span="3" style="text-align: center;background-color: #1c2438">
        <i-menu :active-name="activeName" theme="dark" width="auto" @on-select="selectTitle"
                @on-open-change="onOpenChange" style="border-radius: 10px 0 0 0">
          <Submenu name="user">
            <template slot="title">
              <Icon type="person"></Icon>
              个人中心




            </template>
            <Menu-item name="phone">
              <Icon type="android-phone-portrait"></Icon>
              <span v-if="!isBindPhone">绑定手机</span>
              <span v-else>修改手机{{phone}}</span>
            </Menu-item>
            <!--<Menu-item name="modify-phone" v-if="isBindPhone">-->
            <!--<Icon type="android-phone-portrait"></Icon>-->
            <!--手机{{phone}}-->

            <!--</Menu-item>-->
            <Menu-item name="email" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
              <Icon type="email"></Icon>
              <span v-if="!isBindEmail">
              绑定邮箱
            </span>
              <span v-else>
              修改邮箱{{email}}
            </span>
            </Menu-item>
            <Menu-item name="user-update" v-if="isBindPhone||isBindEmail">
              <Icon type="ios-compose"></Icon>
              修改密码

            </Menu-item>
            <Menu-item name="user-wallet">
              <Icon type="bag"></Icon>
              我的钱包

            </Menu-item>
          </Submenu>
          <Submenu name="recharge">
            <template slot="title">
              <Icon type="social-yen"></Icon>
              <span>充值中心</span>
            </template>
            <Menu-item name="recharge-point">
              <Icon type="pricetags"></Icon>
              充值点数

            </Menu-item>
            <Menu-item name="recharge-card">
              <Icon type="card"></Icon>
              购买回测卡

            </Menu-item>
          </Submenu>
          <Submenu name="pay">
            <template slot="title">
              <Icon type="ios-keypad"></Icon>
              <span>消费记录</span>
            </template>
            <Menu-item name="deduct-point">
              <Icon type="ios-drag"></Icon>
              消费点数记录

            </Menu-item>
            <Menu-item name="pay-point">
              <Icon type="record"></Icon>
              充值点数记录

            </Menu-item>
            <Menu-item name="pay-card">
              <Icon type="clipboard"></Icon>
              购买回测卡记录

            </Menu-item>
            <!---->
          </Submenu>
          <Submenu name="pay">
            <template slot="title">
              <Icon type="navigate"></Icon>
              <span>操作指引</span>
            </template>
            <Menu-item name="create-model">
              <Icon type="arrow-graph-up-right"></Icon>
              <span class="layout-text">创建模型</span>
            </Menu-item>
            <Menu-item name="my-model">
              <Icon type="ios-home"></Icon>
              <span class="layout-text">我的模型</span>
            </Menu-item>
            <Menu-item name="history-model">
              <Icon type="ios-analytics"></Icon>
              <span class="layout-text">回测历史</span>
            </Menu-item>
          </Submenu>

        </i-menu>
      </i-col>
      <i-col span="21"
             style="background-color: #1c2438;height: 100%;">
        <div style="background-color: #fff;height: 100%;width:100%;">
          <router-view></router-view>
        </div>
      </i-col>
      <!--<i-col></i-col>-->
    </Row>
  </div>

</template>
<script>
  import {getRemoteReqTodo} from '../../api/api'
  import {changePhone, changeEmail,jumpLogin} from '../../api/tools'
  export default {

    data(){
      return {
        modal: false,
      }
    },
    computed: {
      isBindPhone(){
        if (this.$store.state.isBindPhone !== '') {
          return this.$store.state.isBindPhone
        }
      },
      isBindEmail(){
        if (this.$store.state.isBindEmail !== '') {
          return this.$store.state.isBindEmail
        }
      },
      phone(){
        if (this.$store.state.phone !== '') {
          return this.$store.state.phone
        }
      },
      email(){
        if (this.$store.state.email !== '') {
          return this.$store.state.email
        }
      },
      activeName() {
        if (this.$route.path === '/personalInfo/updatepasswd') {
          return 'user-update';
        } else if (this.$route.path === '/personalInfo/recharge') {
          return 'recharge-point';
        } else if (this.$route.path === '/personalInfo/buycard') {
          return 'recharge-card';
        } else if (this.$route.path === '/personalInfo/mywallet') {
          return 'user-wallet';
        } else if (this.$route.path === '/personalInfo/deducpoints') {
          return 'deduct-point';
        } else if (this.$route.path === '/personalInfo/rechargerecord') {
          return 'pay-point';
        } else if (this.$route.path === '/personalInfo/buycardrecord') {
          return 'pay-card';
        } else if (this.$route.path === '/personalInfo/phone') {
          return 'phone';
        } else if (this.$route.path === '/personalInfo/email') {
          return 'email';
        }
      }
    },
    methods: {
      selectTitle(name){
        switch (name) {
          case 'user-update':
//              修改密码
            this.$router.push('/personalInfo/updatepasswd');
            break;
          case 'phone':
//              修改密码
            this.$router.push('/personalInfo/phone');
            break;
          case 'email':
//              修改密码
            this.$router.push('/personalInfo/email');
            break;
          case 'recharge-point':
//              充点
            this.$router.push('/personalInfo/recharge');
            break;
          case 'recharge-card':
//              购卡
            this.$router.push('/personalInfo/buycard');
            break;
          case 'user-wallet':
            this.$router.push('/personalInfo/mywallet');
            break;
//            扣点数记录
          case 'deduct-point':
            this.$router.push('/personalInfo/deducpoints');
//            this.$router.push('/mywallet');
            break;
          case 'pay-point':
            this.$router.push('/personalInfo/rechargerecord');
            break;
          case 'pay-card':
            this.$router.push('/personalInfo/buycardrecord');
            break;
          case 'create-model':
//              创建模型
            this.$router.push('/model/newModel');
            break;
          case 'my-model':
//              我的模型
            this.$router.push('/model/myModel');
            break;
          case 'history-model':
//              回测历史
            this.$router.push('/model/history');
            break;
          default:
            break;
        }
      },
      onOpenChange(){
        const that = this;
        getRemoteReqTodo('/user/infomation/getuserinfo', [], []).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
            let user = data['userInfo'];
            that.$store.state.phone = user['phone'] !== '' ? changePhone(user['phone']) : user['phone'];
            that.$store.state.email = user['email'] !== '' ? changeEmail(user['email']) : user['email'];
            that.$store.state.isBindPhone = user['phone'] === '' ? false : true;
            that.$store.state.isBindEmail = user['email'] === '' ? false : true;
          } else if (data['status'] === 'ERROR') {
            that.$message.error(data.message);
          } else if (data['status'] === 'USER_NOT_FOUND') {
            jumpLogin(that);
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>

</style>
