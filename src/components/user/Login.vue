<template>
  <div class="login">
    <Row type="flex" justify="center" :style="style">
      <i-col :xs="4" :sm="4" :md="5" :lg="4" style="">
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
            <!--<Form-item prop="qrCode">-->
            <!--<i-input size="large" v-model="formValidate.qrCode" :icon="iconQrCode" placeholder="请输入验证码"-->
            <!--style="width: 50%" @on-enter="handleSubmit('formValidate')"></i-input>-->
            <!--<img :src="img" alt="" style="width: 30%;height: 36px;margin-bottom: -1rem">-->
            <!--<a @click="getQrCode">换一张</a>-->
            <!--</Form-item>-->
            <div id="slide-wrapper">
              <input type="hidden" value="" id="lockable"/>
              <div id="slider">
                <span id="label">
                  <!--<Icon type="arrow-right-c" :size="20" style="margin-top: .5rem"></Icon>-->
                </span>
                <span id="lableTip">拖动滑块验证</span>
              </div>
            </div>
            <Form-item style="margin-bottom: 0;vertical-align: middle">
              <Button size="large" type="primary" :loading="logining" @click="handleSubmit('formValidate')" long
                      :disabled="loginDisabled">
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
  import $ from 'jquery'
  import {SliderUnlock} from '../../api/jquery.slideunlock.min'
  import {loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  import 'babel-polyfill'
  //    import Promise from 'promise'
  export default {
    mounted(){
      let slider = new SliderUnlock("#slider", {}, () => {
        this.validateLogin('formValidate',slider);
      }, () => {
        $(".warn").text("index:" + slider.index + "， max:" + slider.max + ",lableIndex:" + slider.lableIndex + ",value:" + $("#lockable").val() + " date:" + new Date().getUTCDate());
      });
      slider.init();
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
        loginDisabled: true,
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
      validateLogin(name,slider){
        this.$refs[name].validate((valid) => {
          if (!valid) {
            this.loginDisabled = true;
            slider.reset();
          } else {
            this.loginDisabled = false;
          }
        })
      },
      //验证成功函数
      handleSubmit(name, slider) {
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
                }
              ).then(response => {
                const data = response.data;
                if (data['status'] === 'SUCCESS') {
//                跳转到创建模型
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
                    let user = data['userInfo'];
                    resolve(user);
                  } else if (data['status'] === 'ERROR') {
                    that.$message.error(data['message']);
                  } else if (data['status'] === 'USER_NOT_FOUND') {
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
        this.img = BASE_API_URL + '/image/getimagecode?random=' + Math.random();
      },
      mailTelChange(){
//          为了安全  只要邮箱或者手机改变  密码就要清空
        this.formValidate.passwd = '';
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  .login {
    background-image: url("../../img/loginbg.jpg");
    background-repeat: no-repeat;
  }

  .ivu-i-input-wrapper-large .ivu-i-input-icon {
    /*color: #3eb94e;*/
  }

  #slide-wrapper {
    width: 100%;
    position: relative;
    background: #ECF0F1;
    margin: 1rem auto;
  }

  #slider {
    padding: .5rem 1rem;
    position: relative;
    border-radius: 2px;
    background-color: #FDEB9C;
    overflow: hidden;
    text-align: center;
  }

  #slider.success {
    background-color: #E5EE9F;
  }

  #label {
    width: 2rem;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #E67E22;
    background-image: url('../../img/jiantou.png');
    z-index: 999;
    cursor: pointer;

  }
</style>
