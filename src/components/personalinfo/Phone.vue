<template>
  <transition name="el-zoom-in-center">
    <Row type="flex" justify="center" v-show="modal" style="padding: 1rem;height: 100%">
      <i-col span="10" v-if="!isBind">
        <Row type="flex" justify="center">
          <i-col span="24" v-if="bindConfirm==='fail'">
            <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <Form-item label="手机号" prop="bindPhone">
                <i-input size="large" v-model="formValidate.bindPhone" placeholder="请输入要绑定的手机号"></i-input>
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
              恭喜,成功绑定手机{{hasBind}}到千投量化网






            </p>
          </i-col>
        </Row>
      </i-col>
      <!--修改手机号-->
      <i-col span="10" v-else>
        <Row type="flex" justify="center">
          <i-col span="24" v-if="verifySucc==='confirm'">

            <i-select size="large" v-model="oldTool" placeholder="选择当前验证方式">
              <i-option v-for="(item,index) in verifyTool" :value="item.value" :key="index">{{item.label}}</i-option>
            </i-select>

            <i-input size="large" v-model="verifyCode" placeholder="请输入验证码"
                     style="width: 50%;margin-top: 1rem"></i-input>
            <Button size="large" type="primary" style="width:7rem;float:right;margin-top: 1rem" @click="getModiQrCode"
                    v-if="!verifyCodeLoding">
              发送验证码













            </Button>
            <Button size="large" type="primary" :disabled="true" style="width:7rem;float:right;margin-top: 1rem" v-else>
              重新发送({{verifyCodeLodingTime}})











            </Button>
            <Button size="large" long type="primary" @click="verify" style="margin-top: 1rem">下一步</Button>
          </i-col>
          <!--新手机号-->
          <i-col span="24" v-else-if="verifySucc==='confirmNew'">
            <i-form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="100">

              <Form-item label="手机号" prop="newPhone">
                <i-input size="large" v-model="formValidate1.newPhone" placeholder="请输入新手机号"></i-input>
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
            <!--</i-form>-->
          </i-col>
          <i-col span="24" v-else>
            <p style="text-align: center;font-size: 2rem">
              <Icon type="checkmark-circled" color="#3eb94e"></Icon>
              &nbsp恭喜,成功修改手机号为{{changePhone}}













            </p>
          </i-col>
        </Row>

      </i-col>
    </Row>

  </transition>

</template>
<script>
  import {postRemoteReqTodo, getRemoteReqTodo} from '../../api/api'
  import {loginTimeoutPrompt, jumpLogin, changeEmail, changePhone} from '../../api/tools'
  export default{
    mounted(){
      const that = this;
      getRemoteReqTodo('/user/infomation/getuserinfo', [], []).then(res => {
        let data = res.data;
        that.modal = true;
        if (data['status'] === 'SUCCESS') {
          let user = data['userInfo'];
          that.user.phone = user['phone'] !== '' ? changePhone(user['phone']) : user['phone'];
          that.user.email = user['email'] !== '' ? changeEmail(user['email']) : user['email'];
          that.user.realPhone = user['phone'];
          that.oldTool = user['phone'];
          that.user.realEmail = user['email'];
          that.isBind = user['phone'] === '' ? false : true;
        } else if (data['status'] === 'ERROR') {
          that.$message.error(data['message']);
        } else if (data['status'] === 'USER_NOT_FOUND') {
          jumpLogin(that);
        }

      })
    },
    data(){
//        校验绑定的手机号
      const that = this;
      const validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机不能为空'));
        } else if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
          callback(new Error('手机格式不正确'));
        } else {
          // 校验手机是否已经被绑定
          postRemoteReqTodo('/user/bind/existphoneoremail', {
            phoneOrEmail: value
          }).then(res => {
            let data = res.data;
            if (data['status'] === 'SUCCESS') {
              callback();
            } else if (data['status'] === 'ERROR') {
              callback(new Error(data['message']));
            } else if (data['status'] === 'USER_NOT_FOUND') {
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
        formValidate0: {},
        ruleValidate0: {},
        formValidate: {
          bindPhone: '',
        },
        formValidate1: {
          newPhone: ''
        },
        ruleValidate1: {
          newPhone: [{
            validator: validatePhone,
            trigger: 'blur'
          }]
        },
//        formValidate1: {
//          newPhone: ''
//        },
        modi: false,
        bindConfirm: 'fail',
        verifySucc: 'confirm',
        ruleValidate: {
          bindPhone: [
            {
              validator: validatePhone,
              trigger: 'blur'
            }
          ]
        },
//        ruleValidate1: {
//
//        }
      }
    },
    computed: {
      hasBind(){
        return changePhone(this.formValidate.bindPhone);
      },
      changePhone(){
        return changePhone(this.formValidate1.newPhone);
      },
      verifyTool(){
        if (this.user.email !== '' && this.user.phone !== '') {
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
              value: this.user.realPhone,
              label: this.user.phone
            }
          ]
        }

      }
    },
    methods: {
      getQrCode(name){
//          向绑定的手机发送验证码
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
              subject: '',
              content: '',
              phoneOrEmail: that.formValidate.bindPhone
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
                phoneOrEmail: that.formValidate.bindPhone,
                verifyCode: that.verifyCode,
                verifyCodeId: that.verifyCodeId
              }).then(res => {
                let data = res.data;
                if (data['status'] === 'SUCCESS') {
//                  显示绑定信息
                  that.bindConfirm = 'success';
//            更改全局绑定手机的变化
                  that.$store.state.isBindPhone = true;
                  that.$store.state.phone = changePhone(that.formValidate.bindPhone);
                } else if (data['status'] === 'ERROR') {
                  that.$message.error(data['message']);
                  //                    验证码清空 便于重新输入
                  that.verifyCode = '';
//                  that.isBind = false;
                } else if (data['status'] === 'USER_NOT_FOUND') {
//                    验证码清空 便于重新输入
                  that.verifyCode = '';
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
        });

      },
//      修改手机号先发送验证码
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
        if (that.verifyCode !== '') {
          postRemoteReqTodo('/verifycode/verify', {
            verifyCode: that.verifyCode,
            verifyCodeId: that.verifyCodeId
          }).then(res => {
            let data = res.data;
            clearInterval(that.setval);
            that.verifyCodeLoding = false;
            that.verifyCodeLodingTime = 60;
            that.verifyCode = '';
            if (data['status'] === 'SUCCESS') {
//                  跳转到验证新页面
              that.verifySucc = 'confirmNew';
            } else if (data['status'] === 'ERROR') {
              that.$message.error(data['message']);
              that.verifySucc = 'confirm';
            } else if (data['status'] === 'USER_NOT_FOUND') {
              loginTimeoutPrompt(that);
              that.verifySucc = 'confirm';
            }
          }).catch(() => {
            that.$message.error('连接异常，请您稍后再试');
          })
        } else {
          that.$Message.error('验证码不能为空');
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
              subject: '',
              content: '',
              phoneOrEmail: that.formValidate1.newPhone
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
      modeify(name){
        const that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            postRemoteReqTodo('/user/bind/phoneoremail', {
              phoneOrEmail: that.formValidate1.newPhone,
              verifyCode: that.verifyCode,
              verifyCodeId: that.verifyCodeId
            }).then(res => {
              let data = res.data;
              if (data['status'] === 'SUCCESS') {
//                that.$Message.success(data['message']);
                that.verifySucc = 'asdasas';
//                that.$store.state.isBindPhone = true;
                that.$store.state.phone = changePhone(that.formValidate1.newPhone);
//                成功的提示信息

              } else if (data['status'] === 'ERROR') {
                that.$message.error(data['message']);
              } else if (data['status'] === 'USER_NOT_FOUND') {
                loginTimeoutPrompt(that);
              }
              clearInterval(that.setval);
              that.verifyCode = '';
              that.verifyCodeLoding = false;
              that.verifyCodeLodingTime = 60;
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
