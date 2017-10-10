<template>
  <div>
    <!--升级和续费-->
    <Modal :mask-closable="false" v-model="modalUpGrade"
           title="回测卡升级"
           @on-ok="okUpGrade"
           width="800">
      <Row type="flex" justify="center" style="font-size: 1rem;">
        <i-col span="24">
          <i-form :label-width="100">
            <Form-item label="可升级到">
              <i-select size="large" v-model="upGrade1" @on-change="calUpgradePoint" style="width: 15rem">
                <i-option v-for="item in upGradeList" :value="item.value" :key="item">
                  {{item.label}}










                </i-option>
              </i-select>
            </Form-item>
            <Form-item label="升级卡信息" v-if="upGradeList.length">
              <i-input v-model="upGradeList[currentIndex].cardDescription" type="textarea" :rows="5" readonly></i-input>
            </Form-item>
            <Form-item label="消费点数">
              <p style="font-size: 1rem;color: #ff0000;font-weight: bold">{{price.actualPrice}}</p>
            </Form-item>
          </i-form>
        </i-col>
      </Row>
    </Modal>
    <transition name="el-zoom-in-center">
      <Row type="flex" justify="center" v-show="modal" style="padding: 1rem;height: 100%">
        <i-col span="24">
          <p style="font-size: 1rem"><span style="color: #2d8cf0">{{$store.state.user.nickName}}</span>&nbsp剩余点数：<span
            style="font-size: 2rem;color: #ff0000">{{myPoint}}</span></p>
        </i-col>
        <i-col span="24" style="margin-top: 1rem">
          <p style="font-size: 1rem">千投量化网回测卡：</p>
          <!--<i-table></i-table>-->
          <i-table :columns="columns" :data="data"></i-table>
        </i-col>
      </Row>
    </transition>
  </div>
</template>
<script>
  import {getRemoteReqTodo, postRemoteReqTodo} from '../../api/api'
  import {loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  export default{
    mounted(){
      const that = this;
//      that.modal = true;
      getRemoteReqTodo('/user/myaccount', [], []).then(res => {
        let data = res.data;
        if (data['status'] === 'SUCCESS') {
          that.myPoint = data['account']['points'];
          that.dataTemp = data['account']['myCards'];
          that.dataTemp.forEach(function (item) {
            if (new Date().getTime() - item.validTime > 0 || item.value === 20) {
              item.canUpgrade = false;
            } else {
              item.canUpgrade = true;
            }
          })
        } else if (data['status'] === 'ERROR') {
          that.$message.error(data['message']);
        } else if (data['status'] === 'USER_NOT_FOUND') {
          jumpLogin(that);
        }
        that.modal = true;
      })
    },
    data(){
      // 校验第4个
      return {
        modal: false,
        price: '',
        myPoint: '',
        myCard: '',
        cardType: ['单次回测卡', '智能回测卡'],
        currentIndex: 0,
        modalUpGrade: false,
        modalRenewalFee: false,
        upGrade1: '',
//        upGradePoint: '',
        upGradeList: [],
        renewalFee1: '',
//        renewalFeePoint: '',
        renewalFeeList: [
          {
            value: 1,
            label: '1个月'
          },
          {
            value: 2,
            label: '2个月'
          },
          {
            value: 3,
            label: '3个月'
          },
          {
            value: 4,
            label: '4个月'
          },
          {
            value: 5,
            label: '5个月'
          },
          {
            value: 6,
            label: '6个月'
          },
          {
            value: 7,
            label: '7个月'
          },
          {
            value: 8,
            label: '8个月'
          },
          {
            value: 9,
            label: '9个月'
          },
          {
            value: 10,
            label: '10个月'
          },
          {
            value: 11,
            label: '11个月'
          },
          {
            value: 12,
            label: '1年'
          },
          {
            value: 24,
            label: '2年'
          },
          {
            value: 36,
            label: '3年'
          }
        ],
        columns: [
          {
            "title": "卡名",
            "key": "cardName",
            align: 'center'
          }, {
            "title": "详细信息",
            "key": "cardDescription",
            align: 'center'
          },
          {
            "title": "类型",
            "key": "type",
            align: 'center'
          },
          {
            "title": "到期时间",
            "key": "validTime",
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    disabled: !this.dataTemp[params.index].canUpgrade
//                  size: 'large'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.upGrade(params.index)
                    }
                  }
                }, '升级'),
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  on: {
                    click: () => {
                      this.renewalFee(params.index)
                    }
                  }
                }, '续费')
              ]);
            }
          }
        ],
        dataTemp: []
      }
    },
    computed: {
      data(){
        const that = this;
        let temp = [];
        if (this.dataTemp.length !== 0) {
          this.dataTemp.forEach(function (item) {
            temp.push({
              cardName: item.cardName,
              cardNumber: item.cardNumber,
              type: that.cardType[item.type],
              validTime: new Date(item.validTime).format('yyyy-MM-dd'),
//              validTime: '',
              cardDescription: item.cardDescription
            })
          })
        }
        return temp;
      }
    },
    methods: {
      upGrade(index){
//升级
        const that = this;
        this.currentIndex = index;
//        获取点卡信息
        new Promise(function (reslove) {
          getRemoteReqTodo('/card/cardinfo', [], []).then(res => {
            let data = res.data;
            if (data['status'] === 'SUCCESS') {
              that.upGradeList.splice(0, that.upGradeList.length);
////            获取可以升级到的卡
              data['card'].forEach(function (item) {
                if (item.type === that.dataTemp[index].type && item.value > that.dataTemp[index].value) {
                  that.upGradeList.push({
                    value: item.cardNumber,
                    label: item.cardName,
                    cardDescription: item.cardDescription
                  })
                }
              });
              reslove();
            } else if (data['status'] === 'USER_NOT_FOUND') {
              loginTimeoutPrompt(that);
            } else {
              that.$message.error(data['message']);
            }
          })
        }).then(function () {
          return new Promise(function (resolve) {
//            select 赋初始值
            that.upGrade1 = that.upGradeList[0].value;
//            计算价格
            postRemoteReqTodo('/card/calcprice/upgradecard',
              {
                formerCardNumber: that.dataTemp[that.currentIndex].cardNumber,
                upgradeCardNumber: that.upGrade1
              }).then(res => {
              let data = res.data;
              if (data['status'] === 'SUCCESS') {
                that.price = data['price'];
                that.modalUpGrade = true;
              }
            })
          })
        }).catch(() => {
          this.$message.error('连接异常，请您稍后再试');
        })

      },
      calUpgradePoint(value){
//          计算升级所需点数
        const that = this;
        let index = this.currentIndex;
        let dataTemp = this.dataTemp;
        postRemoteReqTodo('/card/calcprice/upgradecard',
          {
            formerCardNumber: dataTemp[index].cardNumber,
            upgradeCardNumber: value
          }).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
            that.price = data['price'];
          } else if (data['status'] === 'USER_NOT_FOUND') {
            jumpLogin(that);
          } else {
            that.$message.error(data['message']);
          }
        }).catch(() => {
          that.$message.error('连接异常，请您稍后再试');
        })
      },
      okUpGrade(){
//          确定升级
        const that = this;
        if (that.upGrade1 === '') {
          that.$message.error('请选择要升级的回测卡');
        } else {
          new Promise(function (resolve, reject) {
            postRemoteReqTodo('/card/buy/upgradecard',
              {
                formerCardNumber: that.dataTemp[that.currentIndex].cardNumber,
                upgradeCardNumber: that.upGrade1,
                originalPrice: that.price.originalPrice,
                actualPrice: that.price.actualPrice
              }
            ).then(res => {
              let data = res.data;
              if (data['status'] === 'SUCCESS') {
                that.$Message.success(data['message']);
                resolve();
              } else if (data['message'] === 'USER_NOT_FOUND') {
                loginTimeoutPrompt(that);
              } else {
                that.$Message.error(data['message']);
              }
            })
          }).then(function () {
//              获取升级后的信息
            getRemoteReqTodo('/user/myaccount', [], []).then(res => {
              let data = res.data;
              if (data['status'] === 'SUCCESS') {
                that.myPoint = data['account']['points'];
                that.dataTemp = data['account']['myCards'];
                that.dataTemp.forEach(function (item) {
                  if (new Date().getTime() - item.validTime > 0 || item.value === 20) {
                    item.canUpgrade = false;
                  } else {
                    item.canUpgrade = true;
                  }
                })
              } else {
                that.$message.error(data['message']);
              }
            })
          }).catch(() => {
            that.$message.error('连接异常，请您稍后再试');
          })
        }
      },
      renewalFee(){
//          续费
        this.$router.push('/personalInfo/buycard');
      }
    }
  }
</script>
<style scoped>

</style>
