<template>
  <div>

    <Modal v-model="modalQrcode" width="360" :mask-closable="false" :closable="false">
      <p slot="header" style="font-size: 1rem;text-align:center">
        <span>微信支付</span>
      </p>
      <div style="text-align:center;min-height: 40%;font-size: 1rem;color:#ff0000">
        <div>￥{{Number(formValidate.recharge).toFixed(2)}}</div>
        <qrcode ref="qrCode" :logo="formValidate.logo"></qrcode>
        <div>支付完成前,请不要关闭此页面</div>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" long @click="close">关闭</Button>
      </div>
    </Modal>
    <transition name="el-zoom-in-center">
      <Row type="flex" justify="center" v-show="modal" style="padding: 1rem;height: 100%">
        <i-col span="24">
          <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="200">
            <Form-item label="充值" prop="recharge">
              <i-input size="large" v-model="formValidate.recharge" placeholder="1元代表1个千投量化点数"
                       style="width:20rem"></i-input>
            </Form-item>
            <Form-item label="充值方式">
              <el-radio-group v-model="pay" fill="#FF9933" @change="changePay">
                <el-radio-button label="ZHIFUBAO">支付宝</el-radio-button>
                <el-radio-button label="WEIXIN">微信</el-radio-button>
              </el-radio-group>
            </Form-item>
            <Form-item v-if="!(pay==='WEIXIN')">
              <Button size="large" type="primary" :loading="loadingZhifubao" @click="submitAlipay('formValidate')"
                      style="width: 20rem">
                <span v-if="!loadingZhifubao">支付宝支付</span>
                <span v-else>加载中...</span>
              </Button>
            </Form-item>
            <Form-item v-else>
              <Button size="large" type="primary" :loading="loadingWeixin" @click="getQrCode('formValidate')"
                      style="width: 20rem">
                <span v-if="!loadingWeixin">生成二维码</span>
                <span v-else>加载中...</span>
              </Button>
            </Form-item>
          </i-form>
          <div id="payJump">
          </div>
        </i-col>
      </Row>
    </transition>
  </div>


</template>
<script>
  import qrcode from 'qrcode-vue/src/qrcode-vue'
  import {postRemoteReqTodo, getRemoteReqTodo, BASE_API_URL} from '../../api/api'
  import {loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  import $ from 'jquery'
  export default{
    mounted(){
      this.getPoint();
    },
    data(){
      const validateRecharge = (rule, value, callback) => {
        if (value === '' || !/^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/.test(value)) {
          callback(new Error('请输入合法金额,格式如:1或者0.1或者0.01'));
        } else {
          if (value > 1000000) {
            callback(new Error('单次充值限额为1000000'));
          } else {
            callback();
          }
        }
      };
      return {
        modal: false,
        loadingZhifubao: false,
        loadingWeixin: false,
        pay: 'ZHIFUBAO',
        poll: '',
        size: 0,
        modalQrcode: false,
        formValidate: {
          recharge: '',
          logo: BASE_API_URL + '/img/logoqrcode.jpg',
        },
        ruleValidate: {
          recharge: [{validator: validateRecharge, trigger: 'blur'}]
        }
      }
    },
    methods: {
//        页面加载完  获取我的点数
      getPoint(){
        getRemoteReqTodo('/user/myaccount', [], []).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
            this.modal = true;
          } else if (data['status'] === 'ERROR') {
            this.$message.error(data['message']);
          } else if (data['status'] === 'USER_NOT_FOUND') {
            jumpLogin(this);
          }
        })
      },

//        关闭模态框
      close(){
//          取消轮询
        clearInterval(this.poll);
//          关闭模态窗口
        this.modalQrcode = false;

      },
//        转换支付方式
      changePay(pay){
        if (pay === 'WEIXIN') {
          this.formValidate.isQrCode = false;
        }
      },
//      微信支付
      getQrCode(name){

        const that = this;

        that.$refs[name].validate((valid) => {
          if (valid) {
            that.loadingWeixin = true;
            postRemoteReqTodo('/payapi/pay', {
              amount: that.formValidate.recharge,
              body: '千投订单' + new Date().getTime(),
              type: that.pay
            }).then(response => {
//                加载完成
              that.loadingWeixin = false;
              const data = response.data;
              if (data['status'] === 'SUCCESS') {
                that.$refs.qrCode.update(data['payBack']['payBackStr'], 200);
                that.modalQrcode = true;
//                每隔3s查询扫码状态
                that.poll = setInterval(function () {
                  getRemoteReqTodo('/payapi/paystate', ['orderId'], [data['payBack']['orderId']]).then(res => {
                    if (res.data === 'SUCCESS') {
                      clearInterval(that.poll);
//                      支付成功提示信息
                      that.modalQrcode = false;
                      that.$message.success('支付成功！');
                    } else if (data['status'] === 'ERROR') {
                      that.$message.error(data['message']);
                    } else if (data['status'] === 'USER_NOT_FOUND') {
                      loginTimeoutPrompt(that);
                    }
                  })
                }, 3000);
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
//      支付宝支付
      submitAlipay(name){
        const that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.loadingZhifubao = true;
            postRemoteReqTodo('/payapi/pay', {
              amount: that.formValidate.recharge,
              body: '千投订单' + new Date().getTime(),
              type: that.pay
            }).then(response => {
              const data = response.data;
              if (data['status'] === 'SUCCESS') {
//                that.str = data['payBack']['payBackStr'];
                $('#payJump').append(data['payBack']['payBackStr']);
//                that.loadingZhifubao = false;
              } else if (data['status'] === 'ERROR') {
                that.$message.error(data['message']);
                that.loadingZhifubao = false;
              } else if (data['status'] === 'USER_NOT_FOUND') {
                loginTimeoutPrompt(that);
              }
            })
          }
        })
      },
    },
    computed: {},
    components: {
      qrcode
    }
  }
</script>
<style>

</style>
