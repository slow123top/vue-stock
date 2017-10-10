<template>
  <div class="register">
    <Row type="flex" justify="center" :style="style">
      <i-col span="5">
        <Card style="font-size:1rem">
          <p slot="title" style="text-align: center;font-size: 1rem">注册</p>
          <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="0"
                  style="font-size:1rem">
            <Form-item prop="name" style="vertical-align: middle">
              <i-input size="large" v-model="formValidate.name" placeholder="昵称,长度为1-20" :icon="iconNickName"
                       :maxlength="20"
                       @on-enter="handleSubmit('formValidate')"></i-input>
            </Form-item>
            <Form-item prop="mailTel">
              <i-input size="large" v-model="formValidate.mailTel" placeholder="邮箱或手机" :icon="iconMailTel"
                       @on-enter="handleSubmit('formValidate')"></i-input>
            </Form-item>
            <Form-item prop="qrCode" v-if="qrCodeDis">
              <i-input size="large" v-model="formValidate.qrCode" placeholder="请输入验证码" style="width:50%"
                       :icon="iconQrCode" @on-enter="handleSubmit('formValidate')"></i-input>
              <Button size="large" type="primary" style="width:7rem;float:right" @click="getQrCode"
                      v-if="!verifyCodeLoding">
                获取验证码

              </Button>
              <Button size="large" type="primary" :disabled="true" style="width:7rem;float:right" v-else>{{verifyCodeLodingTime}}s</Button>
            </Form-item>
            <Form-item prop="passwd">
              <i-input size="large" type="password" v-model="formValidate.passwd"
                       placeholder="密码（6-20位，支持字母、数字和特殊符号至少两种）"
                       :icon="iconPasswd" @on-enter="handleSubmit('formValidate')"></i-input>
            </Form-item>
            <Form-item prop="passwdCheck">
              <i-input size="large" type="password" v-model="formValidate.passwdCheck" placeholder="确认密码"
                       :icon="iconPasswdCheck" @on-enter="handleSubmit('formValidate')"></i-input>
            </Form-item>
            <Form-item style="margin-bottom: 0">
              <Button size="large" type="primary" @click="handleSubmit('formValidate')" long>注册</Button>
            </Form-item>
            <Form-item>
                            <span style="margin-left: 4rem">
                已有账户？立即<router-link to="/login">登录</router-link>
              </span>
            </Form-item>
            <Form-item label="其他方式登录">
              <!--<a href="#"><img src="../../img/qq1.png" alt=""></a>-->
              <a :href="weixinImg"><img src="../../img/wechat.png" alt="微信登录"></a>
            </Form-item>
          </i-form>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import {postRemoteReqTodo, getRemoteReqTodo, BASE_API_URL} from '../../api/api'
  //  import Promise from 'promise'
  export default {
    data() {
//        校验昵称
      const validateNickName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('昵称不能为空'));
          this.iconNickName = '';
        } else {
//            请求后端校验昵称
          postRemoteReqTodo('/user/register/verify/nickname', {
            nickname: value
          }).then(response => {
            const data = response.data;

            if (data['status'] === 'SUCCESS') {
              callback();
              this.iconNickName = 'checkmark-circled';
            } else {
              callback(new Error(data['message']));
              this.iconNickName = '';
            }
          });

        }
      };
      // 验证密码和确认密码
      const validatePasswd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'));
          this.iconPasswd = '';
        } else if (!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(value)) {
          callback(new Error('密码支持数字和字母和特殊符号至少2种'));
          this.iconPasswd = '';
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('密码6-20位'));
          this.iconPasswd = '';
        } else {
          if (value !== '' && this.formValidate.passwdCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs.formValidate.validateField('passwdCheck');
          }
          callback();
          this.iconPasswd = 'checkmark-circled';
        }


      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
          this.iconPasswdCheck = '';
        } else if (value !== this.formValidate.passwd) {
          callback(new Error('两次输入密码不一致'));
          this.iconPasswdCheck = '';
        } else {
          callback();
          this.iconPasswdCheck = 'checkmark-circled';
        }
      };
      // 校验邮箱和手机
      const validateEmailTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('邮箱或手机不能为空'));
          this.iconMailTel = '';
          this.qrCodeDis = false;
        } else if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|(^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$)/.test(value)) {
          callback(new Error('邮箱或者手机格式不正确'));
          this.qrCodeDis = false;
          this.iconMailTel = '';
        } else {
          // 若校验的是手机号   则获取验证码
          postRemoteReqTodo('/user/register/verify/phoneoremail',
            {
              phoneOrEmail: value
            },
          ).then(response => {
            const data = response.data;

//            console.log(data);
            if (data['status'] === 'SUCCESS') {
              callback();
              this.qrCodeDis = true;
              this.iconMailTel = 'checkmark-circled';
            } else {
              callback(new Error(data['message']));
              this.qrCodeDis = false;
              this.iconMailTel = '';
            }
          });
        }
      };
      // 如果是手机和邮箱验证正确  校验验证码
      const validateQrCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('验证码不能为空'));
          this.iconQrCode = '';
        } else {
          const that = this;
          // 与后端返回的验证码做比较
          postRemoteReqTodo('/verifycode/verify',
            {
              verifyCodeId: that.verifyCodeId,
              verifyCode: that.formValidate.qrCode
            },
          ).then(response => {
            const data = response.data;

            if (data['status'] === 'SUCCESS') {
              callback();
              this.iconQrCode = 'checkmark-circled';
            } else {
              callback(new Error('验证码错误'));
              this.iconQrCode = '';
            }
          });
        }
      };
      return {
        weixinImg: BASE_API_URL + '/user/login/wechat',
        weixinImgSrc: BASE_API_URL + '/img/wechat.png',
        iconNickName: '',
        iconPasswd: '',
        iconPasswdCheck: '',
        iconMailTel: '',
        iconQrCode: '',
        verifyCodeId: '',
        qrCodeDis: false,
        verifyCodeLoding: false,
        verifyCodeLodingTime: 60,
        style: {
          "min-height": "50rem",
          "padding": "5rem 0",
        },
        img: '',
        formValidate: {
          name: '',
          mailTel: '',
          qrCode: '',
          date: '',
          time: '',
          desc: '',
          passwd: '',
          passwdCheck: '',
          verificationCode: ''
        },
        ruleValidate: {
          name: [{
            validator: validateNickName,
            trigger: 'blur'
          }],
          passwd: [{
            validator: validatePasswd,
            trigger: 'blur'
          }],
          passwdCheck: [{
            validator: validatePassCheck,
            trigger: 'blur'
          }],
          qrCode: [{
            validator: validateQrCode,
            trigger: 'blur'
          }],
          mailTel: [{

            validator: validateEmailTel,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        const that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            new Promise(function (resolve, reject) {
              // 提交
              postRemoteReqTodo('/user/register/newuser', {
                nickname: that.formValidate.name,
                password: that.formValidate.passwd,
                confirmPassword: that.formValidate.passwdCheck,
                phoneOrEmail: that.formValidate.mailTel,
                verifyCode: that.formValidate.qrCode,
                verifyCodeId: that.verifyCodeId
              }).then(response => {
                const data = response.data;
                if (data['status'] === 'SUCCESS') {
//                  如果注册成功  直接登录
                  that.$Message.success(data['message']);
                  that.$router.push('/');
                  resolve();
                } else {
                  this.$Message.error(data['message']);
                }
              });
            }).then(function () {
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
                  that.$message.error(data['message']);
                } else if (data['status'] === 'USER_NOT_FOUND') {
                  that.$store.commit('ISLOGIN', {
                    isLogin: false,
                    email: '',
                    nickName: '',
                    myPoints: ''
                  });
                  that.$router.push('/login');
                }
              })
            })
          }
        });


      },
      getQrCode() {
        // 获取验证码
        const that = this;
        postRemoteReqTodo('/verifycode/getverifycode',
          {
            phoneOrEmail: that.formValidate.mailTel,
            subject: that.formValidate.mailTel.indexOf('@') !== -1 ? '千投量化网用户注册验证码' : '',
            content: that.formValidate.mailTel.indexOf('@') !== -1 ? '欢迎注册千投量化网' : ''
          }
        ).then(response => {
          const data = response.data;
          if (data['status'] === 'SUCCESS') {
            that.verifyCodeId = data['verifyCodeId'];
//              60s后重新获取
            that.verifyCodeLoding = true;
            let interVal = setInterval(function () {
              if (that.verifyCodeLodingTime === 1) {
                that.verifyCodeLoding = false;
                that.verifyCodeLodingTime = 60;
                clearInterval(interVal);
              } else {
                that.verifyCodeLodingTime--;
              }
            }, 1000)
          } else {
//              如果获取验证码异常  抛出错误

          }
        });

      }
    },
    computed: {}
  }
</script>
<style lang="scss" rel="stylesheet">
  .register {
    background-image: url("../../img/loginbg.jpg");
    background-repeat: no-repeat;
  }

  .ivu-input-wrapper-large .ivu-input-icon {
    color: #3eb94e;
  }

  /*.login{*/

  /*min-height: 40rem;*/

  /*}*/
</style>
