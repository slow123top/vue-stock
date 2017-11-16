<template>
  <!--<transition name="el-zoom-in-top">-->
    <Row type="flex" justify="center"
         style="min-height:45rem;padding: 1rem;background: #fff;border-radius: 10px">
      <i-col span="24">
        <div class="s-history">
          <span>搜索历史回测模型（支持模糊搜索）：</span>
          <el-select size="large" v-model="search" filterable placeholder="请输入模型名称" :clearable="true"
                     @change="getFilterHistory"
                     style="width: 30rem">
            <el-option
              v-for="item in filterHistory"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData" v-loading="loading" element-loading-text="正在获取单次回测记录..." style="width: 100%;"
                  size="small" border @sort-change="sortChange">
          <el-table-column type="index" align="center" :width="60"></el-table-column>
          <el-table-column align="center" sortable="custom" prop="test_time" label="时间"></el-table-column>
          <el-table-column align="center" prop="model_name" label="模型名称"></el-table-column>
          <el-table-column align="center" sortable="custom" prop="test_range" label="回测区间"></el-table-column>
          <el-table-column align="center" sortable="custom" prop="sum_profit" label="总收益率">
            <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.sum_profit.replace('%','')>0),'equal-zero':(scope.row.sum_profit.replace('%','')===0),'bellow-zero':(scope.row.sum_profit.replace('%','')<0)}">{{scope.row.sum_profit}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" sortable="custom" prop="year_profit" label="年化收益率（复利）" :width="200">
            <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.year_profit.replace('%','')>0),'equal-zero':(scope.row.year_profit.replace('%','')===0),'bellow-zero':(scope.row.year_profit.replace('%','')<0)}">{{scope.row.year_profit}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" sortable="custom" prop="max_back" label="最大回撤">
            <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.max_back.replace('%','')>0),'equal-zero':(scope.row.max_back.replace('%','')===0),'bellow-zero':(scope.row.max_back.replace('%','')<0)}">{{scope.row.max_back}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" sortable="custom" prop="empty_rate" label="空仓占比">
            <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.empty_rate.replace('%','')>0),'equal-zero':(scope.row.empty_rate.replace('%','')===0),'bellow-zero':(scope.row.empty_rate.replace('%','')<0)}">{{scope.row.empty_rate}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" sortable="custom" prop="win_rate" label="胜率">
            <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.win_rate.replace('%','')>0),'equal-zero':(scope.row.win_rate.replace('%','')===0),'bellow-zero':(scope.row.win_rate.replace('%','')<0)}">{{scope.row.win_rate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" plain
                         @click="buildModel(scope.$index+ (currentPage - 1) * pageSize, scope.row)">重建模型
              </el-button>
              <el-button type="danger" size="small" plain
                         @click="removeModel(scope.$index+ (currentPage - 1) * pageSize, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <el-pagination layout="total,prev, pager, next" :page-size="pageSize" :current-page.sync="currentPage"
                           :total="data.length" @current-change="changePage"></el-pagination>
          </div>
        </div>
      </i-col>
    </Row>
  <!--</transition>-->
</template>
<script>
  import {resolveIndicator} from '../../api/model'
  import {getRemoteReqTodo} from '../../api/api'
  import {ascObj, descObj, loginTimeoutPrompt, jumpLogin} from '../../api/tools'

  export default {
    mounted() {
//          若刷新页面
      getRemoteReqTodo('/stock/historymodels', [], []).then(res => {
        //首先清空我的模型  再重新获取
        if (res.data.status === 'SUCCESS') {
          this.$store.state.historyModels.splice(0, this.$store.state.historyModels.length);
          this.$store.commit('GET_HISTORYS', {
            returnModel: res.data.returnModel
          });
          this.data = this.$store.state.historyModels;
          this.tableData = this.data.slice(0, this.pageSize);
          this.historyModels = JSON.parse(JSON.stringify(this.$store.state.historyModels));
          this.loading = false;
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
        loading: true,
        search: '',
        historyModelModal: false,
        historyModels: [],
        pageSize: 20,
        currentPage: 1,
        nest: [],
        data: [],
        tableData: [],
      }
    },
    computed: {
      filterHistory() {
        let temp = [];
        this.$store.state.historyModels.forEach(item => {
          temp.push({
            label: item.model_name,
            value: item.modelId
          });
        });
        return temp;
      }
//        历史模型的全部数据
//      data(){
//        return this.historyModels;
//      },
////      某一页的历史模型数据
//      tableData(){
//        return this.historyModels.slice((this.currentPage - 1) * 10, this.currentPage * 10);
//      }
    },
    methods: {

//        筛选出搜索出的历史模型
      getFilterHistory(arg) {
        if (arg.length === 0) {
          this.data = this.$store.state.historyModels;
          this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        } else {
          let temp = [];
          this.data.splice(0, this.data);

          this.data = this.historyModels.filter(item => {
            return item.model_name === arg;
          });
          this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        }
      },
//        重建模型
      buildModel(index) {
        this.$store.state.andOrNot = 'customize';
        resolveIndicator(this.$store.state.selectedIndexs, this.data[index].model_para, this.$store.state.controller, this.$store.state.symbol);
        this.$router.push('/model');
      },
      removeModel(index) {
        getRemoteReqTodo('/stock/deletehistory', ['modelId'], [this.historyModels[index].modelId]).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
            this.data.splice(index, 1);
            this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
          } else if (data['status'] === 'ERROR') {
            this.$Notice.error({
              title: data['message']
            })
          } else if (data['status'] === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(this);
          } else {
            this.$message.error(data['message']);
          }
        })
      },
      changePage(current) {
        this.currentPage = current;
        this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      },
      sortChange(param) {
        if (param.order === 'descending') {
          this.data.sort(descObj(param.prop));
          this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        } else if (param.order === 'ascending') {
          this.data.sort(ascObj(param.prop));
          this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        } else {
          return true;
        }
      }
    }

  }
</script>
<style scoped>
  span {
  }

  .s-history {
    margin-bottom: 1rem;
    text-align: right;
  }

  .above-zero {
    color: #ff0000;
  }

  .equal-zero {
    color: #000;
  }

  .bellow-zero {
    color: #00c261;
  }
</style>
