<template>
  <transition name="el-zoom-in-center">
    <Row type="flex" justify="center" v-show="modal" style="padding: 1rem;height: 100%">
      <i-col span="24">
        <p>购买(续费)回测卡消费记录</p>
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
  import {loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  export default{
    mounted(){
      getRemoteReqTodo('/user/recording/buycard', [], []).then(res => {
        let data = res.data;
        if (data['status'] === 'SUCCESS') {
          if (data['cardBuyRecording'].length === 0) {
            this.dataTemp = data['cardBuyRecording'];
          } else {
            let dataTemp = this.dataTemp;
            data['cardBuyRecording'].forEach(item => {
              dataTemp.push({
                order_number: item.cardBuyId,
                card_name: item.cardName,
                type: item.type,
                create_time: new Date(item.buyTime).format('yyyy-MM-dd hh:mm:ss'),
                quantity: item.days,
                pay_points: item.actualPoints
              })
            });
          }
        } else if (data['status'] === 'USER_NOT_FOUND') {
          jumpLogin(this);
        } else {
          this.$message.error(data['message']);
        }
        this.modal = true;
      }).catch(() => {
        this.$message.error('连接异常，请您稍后再试');
      })
    },
    data(){
      return {
        modal: false,
        dataTemp: [],
        pageSize: 10,
        currentPage: 1,
        showHeader: false,
        columns: [
          {
            "title": '创建时间',
            "key": 'create_time',
            align: 'center',
//            sortable: true,
          },
          {
            title: '编号',
            key: 'order_number',
            align: 'center',
//            ellipsis: true
          },
          {
            title: '卡名',
            key: 'card_name',
            align: 'center'
          },
          {
            title: '购卡类型',
            key: 'type',
            align: 'center',
//            width: 100
          },
          {
            title: '购买量',
            key: 'quantity',
            align: 'center',
          },
          {
            title: '支付点数',
            key: 'pay_points',
            align: 'center',
          },
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
</style>
