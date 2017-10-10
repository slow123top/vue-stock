<template>
  <div>
    <Modal :mask-closable="false" v-model="modalBuy"
           title="提示"
           @on-ok="okBuy"
           width="600">
      <p style="font-size: 1rem">
        您将消费{{price.actualPrice}}点数，是否继续？
    </p>
    </Modal>
    <transition name="el-zoom-in-center">
      <Row type="flex" justify="center" v-show="modal" style="padding: 1rem 0;height: 100%">
        <i-col span="24">
          <i-form ref="formValidate" :label-width="100">
            <Form-item label="回测卡种类" prop="recharge">
              <el-radio-group v-model="cardNumber" @change="changeCard">
                <el-radio-button v-for="(card,index) in cardInfo" :label="card.cardNumber" :key="card"
                                 :disabled="card.disabled">{{card.cardName}}

                </el-radio-button>
              </el-radio-group>
            </Form-item>
            <Form-item label="回测卡信息">
              <p style="font-size: 0.875rem;color: #ff0000">{{help}}</p>
            </Form-item>
            <Form-item label="购买量">
              <el-radio-group size="small" v-model="amount" @change="changeAmount">
                <el-radio-button :label="item.amount" v-for="item in buyCardAmount" :key="item"><span
                  v-if="!item.isSelected" class="r-month">{{item.notSelectName}}</span>
                  <span class="r-month" v-else>{{item.selectName}}</span>
                </el-radio-button>
                <el-tooltip effect="light" v-for="item in buyCardAmountDiscount" :content="item.content" placement="top"
                            :key="item">
                  <el-radio-button :label="item.amount"><span
                    v-if="!item.isSelected" class="r-month">{{item.notSelectName}}<img src="../../img/discount(2).png"
                                                                                       alt="折扣"></span>
                    <span class="r-month" v-else>{{item.selectName}}<img src="../../img/discount(2).png"
                                                                         alt="折扣"></span>
                  </el-radio-button>
                </el-tooltip>
              </el-radio-group>
            </Form-item>
            <Form-item class="demo-spin-col">
              <Spin fix v-if="loading" style="text-align: left">正在计算价格...</Spin>
              消费点数：<span style="font-size: 1rem;color: #FF0000;font-weight: bold">{{price.actualPrice}}点</span>
            </Form-item>
            <Form-item>
              <Button size="large" type="primary" @click="buyCard"><span v-if="buy">立即购买</span><span v-else>续费</span>
              </Button>
              <router-link to="/personalInfo/recharge">点数不够？立即充值</router-link>
            </Form-item>
          </i-form>
        </i-col>
      </Row>
    </transition>
  </div>
</template>
<script>
  import {postRemoteReqTodo, getRemoteReqTodo} from '../../api/api'
  import {loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  export default{
    mounted(){
      const that = this;
      new Promise(function (resolve, reject) {
        getRemoteReqTodo('/user/myaccount', [], []).then(res => {
          let data = res.data;
//          console.log(res);
          let status = data['status'];
          if (status === 'SUCCESS') {
            that.myCards = data['account']['myCards'];
            resolve(data['account']['myCards']);
          } else if (status === 'USER_NOT_FOUND') {
            jumpLogin(that);
          } else if (status === 'ERROR') {
            that.$message.error(data['message']);
          } else {

          }
        }).catch(() => {
          that.$message.error('连接异常，请您稍后再试');
        })
      }).then(function (myCards) {
        return new Promise(function (reslove, reject) {
          getRemoteReqTodo('/card/cardinfo', [], []).then(res => {
            let data = res.data;
//            console.log(res);
            if (data['status'] === 'SUCCESS') {
              data.card.forEach(function (item) {
                that.cardInfo.push({
                  cardNumber: item.type + '-' + item.cardNumber,
                  cardDescription: item.cardDescription,
                  cardName: item.cardName,
                  cardType: item.type,
                  disabled: false
                })
              });
              if (myCards.length === 0) {
//用户没有卡  则显示立即购买
                that.buy = true;
//                默认是第一张卡
                that.cardNumber = res.data.card[0].type + '-' + res.data.card[0].cardNumber;
              } else {
//                  用户

//                同种类型的卡不能选
                for (let i = 0; i < myCards.length; i++) {
                  let myCard = myCards[i];
                  for (let j = 0; j < that.cardInfo.length; j++) {
                    let card = that.cardInfo[j];
                    if (card.cardType === myCard.type && Number(card.cardNumber.split('-')[1]) !== myCard.cardNumber) {
                      that.cardInfo[j].disabled = true;
                    }
                  }
                }
                that.cardNumber = myCards[0].type + '-' + myCards[0].cardNumber;
                that.buy = false;
              }

//              that.cardInfo = res.data.card;
              reslove();
            } else if (data['status'] === 'ERROR') {
              that.$message.error(data['message']);
            } else if (data['status'] === 'USER_NOT_FOUND') {
//                登录超时
              loginTimeoutPrompt(that);
            }
            that.modal = true;
          });
        })
      }).then(function () {
          that.buyCardAmount[0].isSelected = true;
          postRemoteReqTodo('/card/calcprice/buycard', {
            cardNumber: Number(that.cardNumber.split('-')[1]),
            months: that.amount,
          }).then(res => {
            that.price = res.data.price;
            that.loading = false;
          });
        }
      );
    },
    data(){
      // 校验第4个
      return {
        buy: true,
        modal: false,
        modalBuy: false,
        fillPointMessage: '',
        cardNumber: '',
        cardIndex: 0,
        amount: '1',
        price: '',
        loading: false,
        myCards: [],
        cardInfo: [],
        buyCardAmount: [
          {
            amount: '1',
            notSelectName: '1',
            selectName: '1个月',
            isSelected: false
          }, {
            amount: '2',
            notSelectName: '2',
            selectName: '2个月',
            isSelected: false

          }, {
            amount: '3',
            notSelectName: '3',
            selectName: '3个月',
            isSelected: false

          }, {
            amount: '4',
            notSelectName: '4',
            selectName: '4个月',
            isSelected: false

          }, {
            amount: '5',
            notSelectName: '5',
            selectName: '5个月',
            isSelected: false

          }, {
            amount: '6',
            notSelectName: '6',
            selectName: '6个月',
            isSelected: false

          }, {
            amount: '7',
            notSelectName: '7',
            selectName: '7个月',
            isSelected: false

          }, {
            amount: '8',
            notSelectName: '8',
            selectName: '8个月',
            isSelected: false

          }, {
            amount: '9',
            notSelectName: '9',
            selectName: '9个月',
            isSelected: false

          }
        ],
        buyCardAmountDiscount: [
          {
            amount: '10',
            content: '买满10个月回测卡，立享官网价格9.5折',
            notSelectName: '10',
            selectName: '10个月',
            isSelected: false
          },
          {
            amount: '11',
            content: '买满11个月回测卡，立享官网价格9折',
            notSelectName: '11',
            selectName: '11个月',
            isSelected: false
          },
          {
            amount: '12',
            content: '买满1年回测卡，立享官网价格8.5折',
            notSelectName: '1年',
            selectName: '1年',
            isSelected: false
          },
          {
            amount: '24',
            content: '买满2年回测卡，立享官网价格7折',
            notSelectName: '2年',
            selectName: '2年',
            isSelected: false
          },
          {
            amount: '36',
            content: '买满3年回测卡，立享官网价格5折',
            notSelectName: '3年',
            selectName: '3年',
            isSelected: false
          },
        ]

      }

    },
    computed: {
      help: function () {
        return this.cardInfo.length !== 0 && this.cardInfo[this.cardIndex].cardDescription;
      }
    },
    methods: {
      changeCard(para){
//          每次改变卡号的时候  判断是续费还是立即购买
        const that = this;
        let type = Number(para.split('-')[0]);
        let number = Number(para.split('-')[1]);
        if (this.myCards.length !== 0) {
          for (let i = 0; i < this.myCards.length; i++) {
            if (this.myCards[i].type === type && this.myCards[i].cardNumber === number) {
              this.buy = false;
            } else {
              this.buy = true;
            }
          }
        }

//        加载中
        this.loading = true;
//        获取当前点卡信息
        this.cardInfo.forEach(function (item, index) {
          if (item.cardNumber === para) {
            that.cardIndex = index;
          }
        });
//        that.loading = true;
        postRemoteReqTodo('/card/calcprice/buycard', {
          cardNumber: Number(para.split('-')[1]),
          months: that.amount
        }).then(res => {
          that.loading = false;
          if (res.data.status === 'SUCCESS') {
            that.price = res.data.price;
          } else if (res.data.status === 'ERROR') {
            that.$message.error(res.data.message);
          } else if (res.data.status === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(that);
          }
        }).catch(() => {
          that.$message.error('连接异常，请您稍后再试');
        });
      },
      changeAmount(para){
        const that = this;
        that.loading = true;
        for (let i = 0; i < that.buyCardAmount.length; i++) {
          (that.buyCardAmount[i].isSelected === true) && (that.buyCardAmount[i].isSelected = false);
        }
        for (let i = 0; i < that.buyCardAmountDiscount.length; i++) {
          (that.buyCardAmountDiscount[i].isSelected === true) && (that.buyCardAmountDiscount[i].isSelected = false);
        }
        if (that.amount === '12') {
          that.buyCardAmountDiscount[2].isSelected = true;
        } else if (that.amount === '24') {
          that.buyCardAmountDiscount[3].isSelected = true
        } else if (that.amount === '36') {
          that.buyCardAmountDiscount[4].isSelected = true;
        } else if (that.amount === '10') {
          that.buyCardAmountDiscount[0].isSelected = true;
        } else if (that.amount === '11') {
          that.buyCardAmountDiscount[1].isSelected = true;
        } else {
          that.buyCardAmount[Number(that.amount) - 1].isSelected = true;
        }
        postRemoteReqTodo('/card/calcprice/buycard', {
          cardNumber: Number(that.cardNumber.split('-')[1]),
          months: para
        }).then(res => {
          that.loading = false;
          if (res.data.status === 'SUCCESS') {
            that.price = res.data.price;
          } else if (res.data.status === 'ERROR') {
            that.$Message.error(res.data.message);
          } else if (res.data.status === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(that);
          }
        }).catch(() => {
          that.$Message.error('连接异常，请您稍后重试');
        });
      },
      buyCard(){
//          立即购买
        this.modalBuy = true;
      },
//      确认购买
      okBuy(){
        postRemoteReqTodo('/card/buy/buycard',
          {
            cardNumber: Number(this.cardNumber.split('-')[1]),
            months: this.amount,
            actualPrice: this.price.actualPrice,
            originalPrice: this.price.originalPrice,
            cardType: this.cardInfo[this.cardIndex].cardType
          }).then(res => {
          let data = res.data;
          this.modalBuy = false;
          if (data['status'] === 'SUCCESS') {
            this.$message.success(data['message']);
            this.$router.push('/personalInfo/mywallet');
//            console.log(res);
          } else if (data['status'] === 'ERROR') {
//              点数不足
            this.$message.error(data['message']);
          } else if (data['status'] === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(this);
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>
  img {
    width: 12px;
    float: right;
  }

  .r-month {
    display: inline-block;
    width: 3.5rem;
  }
</style>
