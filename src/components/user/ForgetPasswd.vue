<template>
  <div style="height: 45rem">
    <Row type="flex" justify="center">
      <i-col span="24" style="text-align: center;padding: 1rem 0">
        <h2>找回密码</h2>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="12" style="padding: 1rem 0">
        <Steps :current="currentStep" style="margin: auto">
          <Step title="确认账号"></Step>
          <Step title="安全验证"></Step>
          <Step title="重置密码"></Step>
        </Steps>
      </i-col>
    </Row>
    <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="0">
      <Row type="flex" justify="start" v-if="isTrue==='confirm'">
        <i-col span="5" offset="6">
          <Form-item prop="phoneOrEmail">
            <i-input size="large" v-model="formValidate.phoneOrEmail" placeholder="请输入邮箱或手机">

            </i-input>
          </Form-item>
          <Form-item>
            <i-input size="large" v-model="formValidate.verifyCode" style="width: 50%">
            </i-input>
            <img :src="img" alt="" style="width: 30%;height: 36px;margin-left:1rem;margin-bottom: -1rem">
            <a href="#" @click="getImgQrCode">换一张</a>
          </Form-item>
          <Form-item>
            <Button long type="primary" @click="confirmAccount">
              下一步
















            </Button>
          </Form-item>
        </i-col>
      </Row>
      <Row type="flex" justify="start" v-else-if="isTrue==='verify'">
        <i-col span="5" offset="6">


          <span>{{validateType}}</span><span>{{errorPhoneOrEmail}}</span>

          <Form-item>
            <i-input size="large" v-model="verifyCode" placeholder="请输入验证码" style="width:50%"></i-input>
            <Button size="large" style="width:30%;float:right" @click="getQrCode"
                    v-if="!verifyCodeLoding">
              获取验证码

            </Button>
            <Button size="large" :disabled="true" style="width:7rem;float:right" v-else>{{verifyCodeLodingTime}}s














            </Button>
          </Form-item>
          <Form-item>
            <Button type="primary" long @click="safeValidate">
              下一步















            </Button>
          </Form-item>

        </i-col>

      </Row>
      <Row type="flex" justify="start" v-else-if="isTrue==='reset'">
        <i-col span="5" offset="6">
          <Form-item prop="passwd">
            <i-input type="password" size="large" v-model="formValidate.passwd" placeholder="请输入新密码">

            </i-input>
          </Form-item>
          <Form-item prop="passwdCheck">
            <i-input type="password" size="large" v-model="formValidate.passwdCheck" placeholder="确认密码">

            </i-input>
          </Form-item>
          <Form-item>
            <Button type="primary" long @click="resetPasswd">
              确定

            </Button>
          </Form-item>
        </i-col>
      </Row>
      <Row type="flex" justify="center" v-else>
        <i-col span="12" style="text-align: center">
          <p style="text-align: center;font-size: 1rem">恭喜,千投量化网{{errorPhoneOrEmail}}重置密码成功</p>
          <Button type="primary" @click="midiaLogin">
            前往登录







          </Button>
        </i-col>
      </Row>
    </i-form>
  </div>
</template>
<script>
  import {postRemoteReqTodo,BASE_API_URL} from '../../api/api'
  export default{
    mounted(){
      this.img = BASE_API_URL+'/image/getimagecode?random=' + Math.random();
    },
    data(){
//        校验邮箱或者手机
      const validateEmailTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('邮箱或手机不能为空'));
          this.iconMailTel = '';
        } else if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|(^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$)/.test(value)) {
          callback(new Error('邮箱或者手机格式不正确'));
        } else {
          callback();
        }
      };
//      校验密码和确认密码
      const validatePasswd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('新密码不能为空'));
        } else if (!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(value)) {
          callback(new Error('密码支持数字和字母和特殊符号至少两种'));
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('密码6-20位'));
        } else {
          if (value !== '' && this.formValidate.passwdCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs.formValidate.validateField('passwdCheck');
          }
          callback();
        }


      };
      const validatePasswdCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formValidate.passwd) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        verifyCodeLoding: false,
        verifyCodeId: '',
        verifyCode: '',
        verifyCodeLodingTime: 60,
        currentStep: 0,
        formValidate: {
          phoneOrEmail: '',
          passwd: '',
          passwdCheck: '',
          verifyCode: ''
        },
        ruleValidate: {
          phoneOrEmail: [{
            validator: validateEmailTel,
            trigger: 'blur'
          }],
          passwd: [
            {
              validator: validatePasswd,
              trigger: 'blur'
            }
          ],
          passwdCheck: [
            {
              validator: validatePasswdCheck,
              trigger: 'blur'
            }
          ]
        },
//        验证方式  手机或者邮箱
        validateType: '',
        img: '',
//        切换条件
        isTrue: 'confirm'

      }
    },
    computed: {
      errorPhoneOrEmail(){
        return this.formValidate.phoneOrEmail.substring(0, 3) + '******' + this.formValidate.phoneOrEmail.substring(9);
      }
    },
    methods: {
//        确认账号
      confirmAccount(){
        const that = this;
        postRemoteReqTodo('/user/getpassword/existphoneoremail', {
          phoneOrEmail: that.formValidate.phoneOrEmail,
          verifyCode: that.formValidate.verifyCode
        }).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
//确认账号成功 到达第二步
            that.isTrue = 'verify';
            that.currentStep = 1;
            that.verifyType = that.formValidate.phoneOrEmail.indexOf('@') !== -1 ? '邮箱验证' : '手机验证';
          } else if (data['status'] === 'ERROR') {
            that.$Message.error(data['message']);
          } else if (data['status'] === 'USER_NOT_FOUND') {
            that.$store.commit('ISLOGIN', {
              isLogin: false,
              email: '',
              nickName: '',
              points: '',
              myPoints: ''
            });
            that.$router.push('/login');
          }
        })
      },
//      安全验证
//      首先获取验证码
      getQrCode(){
        const that = this;

        that.verifyCodeLoding = true;
        let setval = setInterval(function () {
          if (that.verifyCodeLodingTime === 1) {
            that.verifyCodeLoding = false;
            that.verifyCodeLodingTime = 60;
            clearInterval(setval);
          } else {
            that.verifyCodeLoding = true;
            that.verifyCodeLodingTime--;
          }
        }, 1000);
//          that.modalOld = true;
        postRemoteReqTodo('/verifycode/getverifycode', {
          subject: that.formValidate.phoneOrEmail.indexOf('@') !== -1 ? '千投量化网找回密码验证码' : '',
          content: that.formValidate.phoneOrEmail.indexOf('@') !== -1 ? '千投量化网找回密码' : '',
          phoneOrEmail: that.formValidate.phoneOrEmail
        }).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
            that.verifyCodeId = data['verifyCodeId'];
//            安全验证成功

          } else if (data['status'] === 'ERROR') {
            that.$Message.error(data['message']);
          } else if (data['status'] === 'USER_NOT_FOUND') {
            that.$store.commit('ISLOGIN', {
              isLogin: false,
              email: '',
              nickName: '',
              points: '',
              myPoints: ''
            });
            that.$router.push('/login');
          }
        })
      },
//      然后进行验证
      safeValidate(){
        const that = this;
        postRemoteReqTodo('/verifycode/verify', {
          verifyCode: that.verifyCode,
          verifyCodeId: that.verifyCodeId
        }).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
//                  验证成功
            that.isTrue = 'reset';
            that.currentStep = 2;
          } else if (data['status'] === 'ERROR') {
            that.$Message.error(data['message']);
          } else if (data['status'] === 'USER_NOT_FOUND') {
            that.$store.commit('ISLOGIN', {
              isLogin: false,
              email: '',
              nickName: '',
              points: '',
              myPoints: ''
            });
            that.$router.push('/login');
          }
        })
      },
//最后找回密码
      resetPasswd(){
        const that = this;
        postRemoteReqTodo('/user/getpassword/getpassword.do', {
          phoneOrEmail: that.formValidate.phoneOrEmail,
          password: that.formValidate.passwd,
          confirmPassword: that.formValidate.passwdCheck
        }).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
//                  重置密码成功
            that.isTrue = 'other';
          } else if (data['status'] === 'ERROR') {
            that.$Message.error(data['message']);
          } else if (data['status'] === 'USER_NOT_FOUND') {
            that.$store.commit('ISLOGIN', {
              isLogin: false,
              email: '',
              nickName: '',
              points: '',
              myPoints: ''
            });
            that.$router.push('/login');
          }
        })
      },
//重置后可以直接登录
      midiaLogin(){
        this.$router.push('/login');
      },
//      获取图片验证码
      getImgQrCode(){
        this.img = BASE_API_URL+'/image/getimagecode?random=' + Math.random();
      }
    }
  }
</script>
<style scoped>

</style>
