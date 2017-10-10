<template>
  <transition name="el-zoom-in-top">
    <Row type="flex" justify="center" v-show="historyModelModal"
         style="min-height:45rem;padding: 1rem;background: #fff;border-radius: 10px">
      <i-col span="24">
        <i-table size="large" border :columns="columns" :data="tableData" @on-sort-change="sortChange"></i-table>
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
  import {resolveIndicator} from '../../api/model'
  import {getRemoteReqTodo} from '../../api/api'
  import {ascObj, descObj, loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  export default {
    mounted(){
//          若刷新页面
      getRemoteReqTodo('/stock/historymodels', [], []).then(res => {
        //首先清空我的模型  再重新获取
        if (res.data.status === 'SUCCESS') {
          this.$store.state.historyModels.splice(0, this.$store.state.historyModels.length);
          this.$store.commit('GET_HISTORYS', {
            returnModel: res.data.returnModel
          });
        } else if (res.data.status === 'ERROR') {
          this.$message.error(res.data.message);
        } else if (res.data.status === 'USER_NOT_FOUND') {
          jumpLogin(this);
        } else {
          this.$message.error('您的回测显示异常，请重试');
        }
        this.historyModelModal = true;
      }).catch(() => {
        this.$message.error('连接服务器异常，请您稍后重试');
      });
    },
    data() {
      return {
        historyModelModal: false,
        historyModels: this.$store.state.historyModels,
        pageSize: 10,
        currentPage: 1,
        nest: [],
        columns: [
          {
            title: '时间',
            key: 'test_time',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '模型名称',
            key: 'model_name',
            align: 'center',
          }, {
            title: '回测区间',
            key: 'test_range',
            align: 'center',
          }, {
            title: '总收益率',
            key: 'sum_profit',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '年化收益率（复利）',
            key: 'year_profit',
            align: 'center',
            sortable: 'custom',
//            width:'250'
          },
          {
            title: '最大回撤',
            key: 'max_back',
            align: 'center',
            sortable: 'custom'
          }, {
            title: '胜率',
            key: 'win_rate',
            align: 'center',
            sortable: 'custom'
          }, {
            title: '空仓占比',
            key: 'empty_rate',
            align: 'center',
            sortable: 'custom'
          }, {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
//                  size: 'large'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index + (this.currentPage - 1) * 10)
                    }
                  }
                }, '重建模型'),
                h('Button', {
                  props: {
                    type: 'error',
//                  size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index + (this.currentPage - 1) * 10)
                    }
                  }
                }, '删除')
              ]);
            }
          }]
      }
    },
    computed: {
//        历史模型的全部数据
      data(){
        return this.historyModels;
      },
//      某一页的历史模型数据
      tableData(){
        return this.historyModels.slice((this.currentPage - 1) * 10, this.currentPage * 10);
      }
    },
    methods: {
//        重建模型
      show (index) {
        this.$store.state.andOrNot = 'customize';
        resolveIndicator(this.$store.state.selectedIndexs, this.data[index].model_para,  this.$store.state.controller, this.$store.state.symbol);
        this.$router.push('/model');
      },
      remove (index) {
        getRemoteReqTodo('/stock/deletehistory', ['modelId'], [this.historyModels[index].modelId]).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
            this.historyModels.splice(index, 1);
          } else if (data['status'] === 'ERROR') {
            this.$Notice.error({
              title: data['message']
            })
          } else if (data['status'] === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(this);
          } else {

          }
        })
      },
      changePage (current) {
        this.currentPage = current;
      },
      sortChange(param){
        if (param.order === 'desc') {
          this.historyModels = this.historyModels.sort(descObj(param.key));
        } else if (param.order === 'asc') {
          this.historyModels = this.historyModels.sort(ascObj(param.key));
        } else {
          return true;
        }
      }
    }

  }
</script>
