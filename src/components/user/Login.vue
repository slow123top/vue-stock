<template>
  <div class="login">
    <Row type="flex" justify="center" :style="style">
      <i-col span="5">
        <Card>
          <p slot="title" style="text-align: center;font-size: 1rem">登录</p>
          <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="0"
          >
            <Form-item prop="mailTel">
              <i-input size="large" v-model="formValidate.mailTel" placeholder="邮箱或手机"
                       @on-enter="handleSubmit('formValidate')" @on-change="mailTelChange">
                <span slot="prepend"><Icon type="person"></Icon></span>
              </i-input>
            </Form-item>
            <Form-item prop="passwd">
              <i-input size="large" type="password" v-model="formValidate.passwd" placeholder="请输入密码"
                       @on-enter="handleSubmit('formValidate')">
                <span slot="prepend"><Icon type="locked"></Icon></span>
              </i-input>
            </Form-item>
            <Form-item prop="qrCode">
              <i-input size="large" v-model="formValidate.qrCode" :icon="iconQrCode" placeholder="请输入验证码"
                       style="width: 50%" @on-enter="handleSubmit('formValidate')"></i-input>
              <img :src="img" alt="" style="width: 30%;height: 36px;margin-bottom: -1rem">
              <a @click="getQrCode">换一张</a>
            </Form-item>
            <Form-item style="margin-bottom: 0;vertical-align: middle">
              <Button size="large" type="primary" :loading="logining" @click="handleSubmit('formValidate')" long>
                <span v-if="!logining">登录</span>
                <span v-else>登录中...</span>
              </Button>
            </Form-item>
            <Form-item>
              <span>
                没有账户？立即<router-link to="/register">注册</router-link>
              </span>
              <router-link target="_blank" to="/forgetpassword" style="float: right">忘记密码?</router-link>
            </Form-item>
            <Form-item label="其他方式登录">
              <!--<a href="#"><img src="../../img/qq.png" alt=""></a>-->
              <a :href="weixinImg"><img src="../../img/wechat.png" alt=""></a>
              <!--<Button shape="circle" type="text"><img src="../../img/wechat.png" alt=""></Button>-->
            </Form-item>
          </i-form>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import {postRemoteReqTodo, getRemoteReqTodo, BASE_API_URL} from '../../api/api'
  import {loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  import 'babel-polyfill'
  //    import Promise from 'promise'
  export default {
    mounted(){
      this.img = BASE_API_URL + '/image/getimagecode?random=' + Math.random();
    },
    data () {
//   校验验证码
      const validateQrCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('验证码不能为空'));
          this.iconQrCode = '';
        } else {
          callback();
        }
      };
      return {
        weixinImg: BASE_API_URL + '/user/login/wechat',
        logining: false,
        iconQrCode: '',
        style: {
          "height": "50rem",
          "padding": "10rem 0",
        },
        img: '',
        formValidate: {
          name: '',
          mailTel: '',
          passwd: '',
          qrCode: ''
        },
        ruleValidate: {
          mailTel: [
            {required: true, message: '邮箱或手机不能为空', trigger: 'blur'}
          ],
          passwd: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          qrCode: [{
            validator: validateQrCode,
            trigger: 'blur'
          }],
        }
      }
    },
    methods: {
      handleSubmit(name) {
        const that = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            that.logning = true;
            // 提交
            return new Promise(function (resolve, reject) {
              postRemoteReqTodo(
                '/user/login',
                {
                  phoneOrEmail: that.formValidate.mailTel,
                  password: that.formValidate.passwd,
                  verifyCode: that.formValidate.qrCode
                }
              ).then(response => {
                const data = response.data;
//                console.log(res);
                if (data['status'] === 'SUCCESS') {
//                跳转到创建模型
//                  that.$store.commit('ISLOGIN', {
//                    isLogin: true,
//                  });
                  that.$router.push('/');
                  resolve();
                } else {
                  that.$message.error(data['message']);
                  that.formValidate.qrCode = '';
                }
              }).catch(() => {
                that.$message.error('连接服务器异常');
              });
            }).then(function () {
              return new Promise(function (resolve, reject) {
                getRemoteReqTodo('/user/infomation/getuserinfo', [], []).then(res => {
                  let data = res.data;
                  if (data['status'] === 'SUCCESS') {
//                    console.log('成功');
                    let user = data['userInfo'];
                    resolve(user);
                  } else if (data['status'] === 'ERROR') {
//                    console.log('错误');
                    that.$message.error(data['message']);
                  } else if (data['status'] === 'USER_NOT_FOUND') {
//                    console.log('用户不存在');
//                    loginTimeoutPrompt(that);
                    jumpLogin(that);
                  }
                })
              })
            }).then(function (user) {
              that.$store.commit('ISLOGIN', {
                isLogin: true,
                email: user['email'],
                phone: user['phone'],
                nickName: user['nickName'],
                points: user['points'],
                isEmail: user['email'] === '' ? false : true,
                userType: user['userType']
              });
            })
          }
        })
      },
      getQrCode(){
//          getRemoteReqTodo('')
        this.img = BASE_API_URL + '/image/getimagecode?random=' + Math.random();
      },
      mailTelChange(){
//          为了安全  只要邮箱或者手机改变  密码就要清空
        this.formValidate.passwd = '';
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet">
  .login {
    background-image: url("../../img/loginbg.jpg");
    background-repeat: no-repeat;
  }

  .ivu-i-input-wrapper-large .ivu-i-input-icon {
    /*color: #3eb94e;*/
  }

  /*.login{*/
  /*min-height: 40rem;*/
  /*}*/
</style>
