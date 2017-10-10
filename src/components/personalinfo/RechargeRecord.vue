<template>
  <transition name="el-zoom-in-center">
    <Row type="flex" justify="center" v-show="modal" style="padding: 1rem;height: 100%">
      <i-col span="24">
        <i-table :columns="columns" :data="tableData"></i-table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="data.length" :current="1" @on-change="changePage" show-total></Page>
          </div>
        </div>
      </i-col>
    </Row>
  </transition>
</template>
<script>
  import {postRemoteReqTodo, getRemoteReqTodo} from '../../api/api'
  import {jumpLogin} from '../../api/tools'
  export default{
    mounted(){
      const that = this;
//      that.modal = true;
      getRemoteReqTodo('/user/recording/recharge', [], []).then(res => {
        let data = res.data;
        if (data['status'] === 'SUCCESS') {
          if (data['rechargeRecording'].length === 0) {
            that.dataTemp = [];
          } else {
            data['rechargeRecording'].forEach(item => {
              that.dataTemp.push({
                number: item.payOrderId,
                points: item.amount,
                create_time: new Date(item.creatTime).format('yyyy-MM-dd hh:mm:ss'),
                pay_type: item.type === 'WEIXIN' ? '微信' : '支付宝',
                pay_amount: item.amount
              })
            });
          }
        } else if (data['status'] === 'USER_NOT_FOUND') {
//            连接超时
          jumpLogin(that);
        } else {
//            输出错误信息
          that.$message.error(data['message']);
        }
        that.modal = true;
      }).catch(() => {
        that.$message.error('连接服务器异常');
      })
    },
    data(){
      return {
        modal: false,
        dataTemp: [],
        pageSize: 10,
        currentPage: 1,
        columns: [
          {
            title: '创建时间',
            key: 'create_time',
            align: 'center',
            sortable: true
          },
          {
            title: '编号',
            key: 'number',
            align: 'center',
            ellipsis: true
          },
          {
            title: '获得点数',
            key: 'points',
            align: 'center'
          },
          {
            title: '支付方式',
            key: 'pay_type',
            align: 'center',
          },
          {
            title: '支付金额',
            key: 'pay_amount',
            align: 'center',
          }
        ]
      }

    },
    computed: {
      data(){
        return this.dataTemp;
      },
      tableData(){
        return this.dataTemp.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      }

    },
    methods: {
      changePage(current){
        this.currentPage = current;

      }
    }
  }
</script>
<style>
  .demo-spin-col {
    height: 3rem;
    position: relative;
    /*border: 1px solid #eee;*/
  }
</style>
