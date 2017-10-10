<template>
  <transition name="el-zoom-in-center">
    <Row type="flex" justify="center" v-show="modal" style="padding: 1rem;height: 100%">
      <i-col span="24">
        <i-table :columns="columns" :data="tableData"></i-table>
        <div style="margin-top: 10px">
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
      getRemoteReqTodo('/user/recording/consume', [], []).then(res => {
        let data = res.data;
        if (data['status'] === 'SUCCESS') {
          if (data['consumeRecording'].length === 0) {
            that.dataTemp = [];
          } else {
            data['consumeRecording'].forEach(item => {
              that.dataTemp.push({
                number: item.consumeId,
                action: item.detail,
                create_time: new Date(item.consumeTime).format('yyyy-MM-dd hh:mm:ss'),
                deduction_points: item.points
              })
            });
          }
        } else if (data['status'] === 'USER_NOT_FOUND') {
          jumpLogin(that);
        } else {
          that.$message.error(data['message']);
        }
        that.modal = true;
      })
    },
    data(){
      return {
        modal: false,
        pageSize: 10,
        currentPage: 1,
        columns: [
          {
            title: '创建时间',
            key: 'create_time',
            align: 'center',
//            sortable: true
          },
          {
            title: '编号',
            key: 'number',
            align: 'center',
//            ellipsis: true
          },
          {
            title: '详细信息',
            key: 'action',
            align: 'center'
          },

          {
            title: '消费点数',
            key: 'deduction_points',
            align: 'center',
          }
        ],
        dataTemp: [],
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
