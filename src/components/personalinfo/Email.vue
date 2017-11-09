<template>

  <transition name="el-zoom-in-center">
    <Row type="flex" justify="center" v-show="modal" style="padding: 1rem;height: 100%">
      <i-col span="10" v-if="!isBind">
        <Row type="flex" justify="center">
          <i-col span="24" v-if="bindConfirm==='fail'">
            <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <Form-item label="邮箱" prop="bindEmail">
                <i-input size="large" v-model="formValidate.bindEmail" placeholder="请输入要绑定的邮箱"></i-input>
              </Form-item>
              <Form-item label="验证码">
                <i-input size="large" v-model="verifyCode" placeholder="请输入验证码" style="width: 50%"></i-input>
                <Button size="large" type="primary" style="width:7rem;float:right" @click="getQrCode('formValidate')"
                        v-if="!verifyCodeLoding">
                  发送验证码













                </Button>
                <Button size="large" type="primary" :disabled="true" style="width:7rem;float:right" v-else>重新发送({{verifyCodeLodingTime}})</Button>
              </Form-item>
              <Form-item>
                <Button size="large" long type="primary" @click="bind('formValidate')">立即绑定</Button>
              </Form-item>
            </i-form>
          </i-col>
          <i-col span="24" v-else>
            <p style="text-align: center;font-size: 2rem">
              <Icon type="checkmark-circled" color="#3eb94e"></Icon>
              &nbsp恭喜,成功绑定邮箱{{hasBind}}到千投量化网
            </p>
          </i-col>
        </Row>

      </i-col>
      <!--修改手机号-->
      <i-col span="10" v-else>
        <Row type="flex" justify="center">
          <i-col span="24" v-if="verifySucc==='confirm'">
            <!--<Tooltip content="请选择验证方式" placement="left">-->
            <i-select size="large" v-model="oldTool" placeholder="选择当前验证方式">
              <i-option v-for="(item,index) in verifyTool" :value="item.value" :key="index">{{item.label}}</i-option>
            </i-select>
            <!--</Tooltip>-->
            <i-input size="large" v-model="verifyCode" placeholder="请输入验证码"
                     style="width: 50%;margin-top: 1rem"></i-input>
            <Button size="large" type="primary" style="width:7rem;margin-top:1rem;float:right" @click="getModiQrCode"
                    v-if="!verifyCodeLoding">
              发送验证码













            </Button>
            <Button size="large" type="primary" :disabled="true" style="width:7rem;margin-top:1rem;float:right"
                    v-else>
              重新发送({{verifyCodeLodingTime}})












            </Button>
            <Button size="large" long type="primary" @click="verify" style="margin-top: 1rem">下一步</Button>
          </i-col>
          <!--新手机号-->
          <i-col span="24" v-else-if="verifySucc==='confirmNew'">
            <i-form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="100">
              <Form-item label="邮箱" prop="newEmail">
                <i-input size="large" v-model="formValidate1.newEmail" placeholder="请输入新邮箱"></i-input>
              </Form-item>
              <Form-item label="验证码">
                <i-input size="large" v-model="verifyCode" placeholder="请输入验证码" style="width: 50%"></i-input>
                <Button size="large" type="primary" style="width:7rem;float:right"
                        @click="getNewQrCode('formValidate1')"
                        v-if="!verifyCodeLoding">
                  发送验证码















                </Button>
                <Button size="large" type="primary" :disabled="true" style="width:7rem;float:right" v-else>重新发送({{verifyCodeLodingTime}})</Button>
              </Form-item>
              <Form-item>
                <Button size="large" long type="primary" @click="modeify('formValidate1')">确认修改</Button>
              </Form-item>
            </i-form>
          </i-col>
          <i-col span="24" v-else>
            <p style="text-align: center;font-size: 2rem">
              <Icon type="checkmark-circled" color="#3eb94e"></Icon>
              &nbsp恭喜,成功修改邮箱为{{changeEmail}}

            </p>
          </i-col>
        </Row>
      </i-col>
    </Row>
  </transition>
</template>
<script>
  import {postRemoteReqTodo, getRemoteReqTodo} from '../../api/api'
  import {loginTimeoutPrompt, changeEmail, changePhone, jumpLogin} from '../../api/tools'
  export default{
    mounted(){
      const that = this;
//      that.modal = true;
      getRemoteReqTodo('/user/infomation/getuserinfo', [], []).then(res => {
        let data = res.data;
        that.modal = true;
        if (data['status'] === 'SUCCESS') {
          let user = data['userInfo'];
          that.user.phone = user['phone'] !== '' ? changePhone(user['phone']) : user['phone'];
          that.user.email = user['email'] !== '' ? changeEmail(user['email']) : user['email'];
          that.user.realPhone = user['phone'];
          that.oldTool = user['email'];
          that.user.realEmail = user['email'];
          that.isBind = user['email'] === '' ? false : true;
        } else if (data['status'] === 'ERROR') {
          that.$message.error(data['message']);
        } else if (data['status'] === 'USER_NOT_FOUND') {
          jumpLogin(that);
        }
      }).catch(() => {
        that.$message.error('连接异常，请您稍后再试');
      })
    },
    data(){
//        校验绑定的邮箱
      const that = this;
      const validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('邮箱不能为空'));
//          (^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|
        } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
          callback(new Error('邮箱格式不正确'));
        } else {
          // 校验手机是否已经被绑定
          postRemoteReqTodo('/user/bind/existphoneoremail', {
            phoneOrEmail: value
          }).then(res => {
            if (res.data.status === 'SUCCESS') {
              callback();
            } else if (res.data.status === 'ERROR') {
              callback(new Error(res.data.message));
            } else if (res.data.status === 'USER_NOT_FOUND') {
              loginTimeoutPrompt(that);
              callback();
            }
          });
        }
      };
      return {
        modal: false,
        setval: '',
        user: {},
        oldTool: '',
        isBind: false,
        verifyCodeLoding: false,
        verifyCodeLodingTime: 60,
        verifyCode: '',
        verifyCodeId: '',
        formValidate: {
          bindEmail: ''
        },
        formValidate1: {
          newEmail: ''
        },
        verifySucc: 'confirm',
        bindConfirm: 'fail',
        ruleValidate: {
          bindEmail: [
            {
              validator: validateEmail,
              trigger: 'blur'
            }
          ]
        },
        ruleValidate1: {
          newEmail: [
            {required: true, message: '请填写邮箱', trigger: 'blur'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
//              {
//            validator: validateEmail,
//            trigger: 'blur'
//          }
          ]
        }
      }
    },
    computed: {
      hasBind(){
        return changeEmail(this.formValidate.bindEmail);
      },
      changeEmail(){
        return changeEmail(this.formValidate1.newEmail);
      },
      verifyTool(){
        if (this.user.phone !== '' && this.user.email !== '') {
          return [
            {
              value: this.user.realPhone,
              label: this.user.phone
            }, {
              value: this.user.realEmail,
              label: this.user.email
            }
          ]
        } else {
          return [
            {
              value: this.user.realEmail,
              label: this.user.email
            }
          ]
        }
      }
    },
    methods: {
      getQrCode(name){
//          向绑定的邮箱发送验证码
        const that = this;

        that.$refs[name].validate((valid) => {
          if (valid) {
            that.verifyCodeLoding = true;
            that.setval = setInterval(function () {
              if (that.verifyCodeLodingTime === 1) {
                clearInterval(that.setval);
                that.verifyCodeLoding = false;
                that.verifyCodeLodingTime = 60;

              } else {
                that.verifyCodeLoding = true;
                that.verifyCodeLodingTime--;
              }
            }, 1000);
            postRemoteReqTodo('/verifycode/getverifycode', {
              subject: '千投量化网绑定邮箱验证码',
              content: '欢迎绑定邮箱到千投量化网',
              phoneOrEmail: that.formValidate.bindEmail
            }).then(res => {
              let data = res.data;
              if (data['status'] === 'SUCCESS') {
                that.verifyCodeId = data['verifyCodeId'];
              } else if (data['status'] === 'ERROR') {
                that.$message.error(data['message']);
              } else if (data['status'] === 'USER_NOT_FOUND') {
                loginTimeoutPrompt(that);
              }
            }).catch(() => {
              that.$message.error('连接异常，请您稍后再试');
            })
          }
        })

      },
      bind(name){
//          立即绑定
        const that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            if (that.verifyCode === '') {
              that.$Message.error('请输入验证码');
            } else {
              postRemoteReqTodo('/user/bind/phoneoremail', {
                phoneOrEmail: that.formValidate.bindEmail,
                verifyCode: that.verifyCode,
                verifyCodeId: that.verifyCodeId
              }).then(res => {
                let data = res.data;
                if (data['status'] === 'SUCCESS') {
//                    如果绑定成功
                  that.bindConfirm = 'success';
                  that.$store.state.isBindEmail = true;
                  that.$store.state.email = changeEmail(that.formValidate.bindEmail);
//                  that.$Message.success(data['message']);
//                  that.isBind = true;
                } else if (data['status'] === 'ERROR') {
                  that.$message.error(data['message']);
//                  that.isBind = false;
                } else if (data['status'] === 'USER_NOT_FOUND') {
                  loginTimeoutPrompt(that);
                }
//          恢复验证码相关参数  公用
                clearInterval(that.setval);
                that.verifyCodeLoding = false;
                that.verifyCodeLodingTime = 60;
                that.verifyCode = '';
              }).catch(() => {
                that.$message.error('连接异常，请您稍后再试');
              })
            }
          }
        })


      },
//      修改邮箱先发送验证码
      getModiQrCode(){
        const that = this;
        that.verifyCodeLoding = true;
        that.setval = setInterval(function () {
          if (that.verifyCodeLodingTime === 1) {
            clearInterval(that.setval);
            that.verifyCodeLoding = false;
            that.verifyCodeLodingTime = 60;
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
        }).catch(() => {
          that.$message.error('连接异常，请您稍后再试');
        })

      },
//      验证原来验证方式
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
            that.verifyCode = '';
          }).catch(() => {
            that.$message.error('连接异常，请您稍后再试');
          })
        }

      },
//      然后验证新的
      getNewQrCode(name){
        const that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.verifyCodeLoding = true;
            that.setval = setInterval(function () {
              if (that.verifyCodeLodingTime === 1) {
                clearInterval(that.setval);
                that.verifyCodeLoding = false;
                that.verifyCodeLodingTime = 60;

              } else {
                that.verifyCodeLoding = true;
                that.verifyCodeLodingTime--;
              }
            }, 1000);
            postRemoteReqTodo('/verifycode/getverifycode', {
              subject: '千投信息网新邮箱验证码',
              content: '新邮箱验证码',
              phoneOrEmail: that.formValidate1.newEmail
            }).then(res => {
              let data = res.data;
              if (data['status'] === 'SUCCESS') {
                that.verifyCodeId = data['verifyCodeId'];
              } else if (data['status'] === 'ERROR') {
                that.$message.error(data['message']);
              } else if (data['status'] === 'USER_NOT_FOUND') {
                loginTimeoutPrompt(that);
              }
            }).catch(() => {
              that.$message.error('连接异常，请您稍后再试');
            })
          }
        })

      },
//      确认修改

      modeify(name){
        const that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            postRemoteReqTodo('/user/bind/phoneoremail', {
              phoneOrEmail: that.formValidate1.newEmail,
              verifyCode: that.verifyCode,
              verifyCodeId: that.verifyCodeId
            }).then(res => {
              let data = res.data;
              clearInterval(that.setval);
              that.verifyCode = '';
              that.verifyCodeLoding = false;
              that.verifyCodeLodingTime = 60;
              if (data['status'] === 'SUCCESS') {
//                that.$Message.success(data['message']);
//                成功的提示信息
                that.verifySucc = 'sadas';
                that.$store.state.email = changeEmail(that.formValidate1.newEmail);
//                TODO
              } else if (data['status'] === 'ERROR') {
                that.$message.error(data['message']);
              } else if (data['status'] === 'USER_NOT_FOUND') {
                loginTimeoutPrompt(that);
              }
            }).catch(() => {
              that.$message.error('连接异常，请您稍后再试');
            })
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
