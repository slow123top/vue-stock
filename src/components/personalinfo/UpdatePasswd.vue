<template>
  <transition name="el-zoom-in-center">
    <Row type="flex" justify="center" v-show="modal" style="padding: 1rem;height: 100%">
      <i-col span="10">
        <Row type="flex" justify="center">
          <i-col span="24" v-if="verifySucc==='confirm'">
            <!--<i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">-->
            <!--<Form-item label="验证工具">-->
            <i-select size="large" v-model="oldTool" placeholder="选择当前验证工具">
              <i-option v-for="item in verifyTool" :value="item.value" :key="item">{{item.label}}</i-option>
            </i-select>
            <!--</Form-item>-->
            <!--<Form-item label="验证码">-->
            <i-input size="large" v-model="verifyCode" placeholder="请输入验证码"
                     style="width: 50%;margin-top: 1rem"></i-input>
            <Button size="large" type="primary" style="width:7rem;float:right;margin-top: 1rem" @click="getModiQrCode"
                    v-if="!verifyCodeLoding">
              发送验证码






            </Button>
            <Button size="large" type="primary" :disabled="true" style="width:7rem;float:right;margin-top: 1rem" v-else>
              重新发送({{verifyCodeLodingTime}})


            </Button>
            <!--</Form-item>-->
            <!--<Form-item>-->
            <Button size="large" long type="primary" @click="verify" style="margin-top: 1rem">下一步</Button>
            <!--</Form-item>-->
            <!--</i-form>-->
          </i-col>
          <i-col span="24" v-else-if="verifySucc==='confirmNew'">
            <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <Form-item label="新密码" prop="newPasswd">
                <i-input size="large" type="password" v-model="formValidate.newPasswd" placeholder="请输入新密码"
                         :icon="iconPasswd"></i-input>
              </Form-item>
              <Form-item label="确认密码" prop="confirmPasswd" :lable-width="150">
                <i-input size="large" type="password" v-model="formValidate.confirmPasswd" placeholder="请再次输入新密码"
                         :icon="iconPasswdCheck"></i-input>
              </Form-item>
              <Form-item>
                <Button size="large" long type="primary" @click="modifyPasswd('formValidate')">确认修改</Button>
              </Form-item>
            </i-form>
          </i-col>
          <i-col span="24" v-else>
            <p style="text-align: center;font-size: 2rem">
              <Icon type="checkmark-circled" color="#3eb94e"></Icon>
              &nbsp密码修改成功


            </p>
          </i-col>
        </Row>
      </i-col>
    </Row>

  </transition>
</template>
<script>
  import {getRemoteReqTodo, postRemoteReqTodo} from '../../api/api'
  import {loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  export default{
    mounted(){
      const that = this;
      getRemoteReqTodo('/user/infomation/getuserinfo', [], []).then(res => {
        let data = res.data;
        that.modal = true;
        if (data['status'] === 'SUCCESS') {
          let user = data['userInfo'];
          that.isBindOrEmail = true;
          that.user.phone = user['phone'] !== '' ? user['phone'].substring(0, 3) + '******' + user['phone'].substring(9) : user['phone'];
          that.user.email = user['email'] !== '' ? user['email'].substring(0, 3) + '***' + user['email'].substring(user['email'].indexOf('@') - 1) : user['email'];
          that.user.realPhone = user['phone'];
          that.oldTool = user['phone'];
          that.user.realEmail = user['email'];
          if (user['phone'] !== '' && user['email'] === '') {
            that.verifyTool.push({
              value: that.user.realPhone,
              label: that.user.phone
            });
          } else if (user['phone'] === '' && user['email'] !== '') {
            that.verifyTool.push({
              value: that.user.realEmail,
              label: that.user.email
            });
          } else if (user['phone'] !== '' && user['email'] !== '') {
            that.verifyTool.push({
              value: that.user.realPhone,
              label: that.user.phone
            });
            that.verifyTool.push({
              value: that.user.realEmail,
              label: that.user.email
            });
          }
//              如果都没绑定

        } else if (data['status'] === 'ERROR') {
          that.$message.error(data['message']);
        } else if (data['status'] === 'USER_NOT_FOUND') {
          jumpLogin(that);
        }
      })
    },
    data(){
      // 验证密码和确认密码
      const validatePasswd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'));
          this.iconPasswd = '';
        } else if (!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(value)) {
          callback(new Error('密码支持数字和字母和特殊符号至少两种'));
          this.iconPasswd = '';
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('密码6-20位'));
          this.iconPasswd = '';
        } else {
          if (value !== '' && this.formValidate.confirmPasswd !== '') {
            // 对第二个密码框单独验证
            this.$refs.formValidate.validateField('confirmPasswd');
          }
          callback();
          this.iconPasswd = 'checkmark-circled';
        }


      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
          this.iconPasswdCheck = '';
        } else if (value !== this.formValidate.newPasswd) {
          callback(new Error('两次输入密码不一致'));
          this.iconPasswdCheck = '';
        } else {
          callback();
          this.iconPasswdCheck = 'checkmark-circled';
        }
      };
      return {
        setval: '',
        modal: false,
        verifyTool: [],
        isBindOrEmail: false,
        verifyCodeLoding: false,
        verifyCodeLodingTime: 60,
        verifyCode: '',
        user: {},
        iconPasswd: '',
        iconPasswdCheck: '',
        formValidate: {
          newPasswd: '',
          confirmPasswd: ''
        },
        oldTool: '',
        verifySucc: 'confirm',
        ruleValidate: {
          newPasswd: [{validator: validatePasswd, trigger: 'blur'}],
          confirmPasswd: [{validator: validatePassCheck, trigger: 'blur'}]
        }
      }

    },
    computed: {},
    methods: {
      getModiQrCode(){
        const that = this;
        that.verifyCodeLoding = true;
        that.setval = setInterval(function () {
          if (that.verifyCodeLodingTime === 1) {
            that.verifyCodeLoding = false;
            that.verifyCodeLodingTime = 60;
            clearInterval(that.setval);
          } else {
            that.verifyCodeLoding = true;
            that.verifyCodeLodingTime--;
          }
        }, 1000);
        postRemoteReqTodo('/verifycode/getverifycode', {
          subject: that.oldTool.indexOf('@') !== -1 ? '千投量化网修改邮箱验证码' : '',
          content: that.oldTool.indexOf('@') !== -1 ? '千投量化网修改邮箱' : '',
          phoneOrEmail: that.oldTool
        }).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
            that.verifyCodeId = data['verifyCodeId'];
          } else if (data['status'] === 'ERROR') {
            that.$message.error(data['message']);
          } else if (data['status'] === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(that);
          }
        })
      },
      verify(){
        const that = this;
        if (that.verifyCode === '') {
          that.$Message.error('请输入验证码');
        } else {
          postRemoteReqTodo('/verifycode/verify', {
            verifyCode: that.verifyCode,
            verifyCodeId: that.verifyCodeId
          }).then(res => {
            let data = res.data;
            if (data['status'] === 'SUCCESS') {
//                  跳转到验证新页面
              that.verifySucc = 'confirmNew';

            } else if (data['status'] === 'ERROR') {
              that.$message.error(data['message']);
              that.verifySucc = 'confirm';
            } else if (data['status'] === 'USER_NOT_FOUND') {
              loginTimeoutPrompt(that);
            }
            clearInterval(that.setval);
            that.verifyCodeLoding = false;
            that.verifyCodeLodingTime = 60;
//          that.verifyCode = '';
          })
        }

      },
      modifyPasswd(name){
        const that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            postRemoteReqTodo('/user/password/change', {
              password: that.formValidate.newPasswd,
              confirmPassword: that.formValidate.confirmPasswd,
              verifyCode: that.verifyCode,
              verifyCodeId: that.verifyCodeId
            }).then(res => {
              let data = res.data;
              if (data['status'] === 'SUCCESS') {
                that.modalNew = false;
                that.verifySucc = 'sdas';
                that.$Message.success(data['message']);
              } else if (data['status'] === 'ERROR') {
                that.$message.error(data['message']);
              } else if (data['status'] === 'USER_NOT_FOUND') {
                loginTimeoutPrompt(that);
              }
              that.verifyCode = '';
              that.verifyCodeLoding = false;
              that.verifyTime = 60;
            });
          }
        })
      }
    }
  }
</script>
<style>
  .ivu-input-wrapper-large .ivu-input-icon {
    color: #3eb94e;
  }
</style>
