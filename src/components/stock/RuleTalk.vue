<template>
  <el-row type="flex" justify="center" style="width: 100%;">
    <el-col :span="24">
      <el-table :data="currentRuleTalk" style="width: 100%;" size="small" border @sort-change="sortChange">
        <el-table-column type="index" align="center" :width="60"></el-table-column>
        <el-table-column align="center" sortable="custom" prop="time" label="创建日期"></el-table-column>
        <el-table-column align="center" prop="modelStr" label="模型串" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" prop="intoMarket" label="入市指标">
          <template slot-scope="scope">
            <el-tooltip placement="right" :enterable="false">
              <div class="show-overflow">{{scope.row.intoMarket.join('')}}</div>
              <div slot="content">
                <ul>
                  <li class="text-center" v-for="intoMarketItem in scope.row.intoMarket">
                    {{intoMarketItem}}
                  </li>
                </ul>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="outMarket" label="出市指标">
          <template slot-scope="scope">
            <el-tooltip placement="right" :enterable="false">
              <div class="show-overflow">{{scope.row.outMarket.join('')}}</div>
              <div slot="content">
                <ul>
                  <li class="text-center" v-for="outMarketItem in scope.row.outMarket">
                    {{outMarketItem}}
                  </li>
                </ul>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="windCtrl" label="风控指标">
          <template slot-scope="scope">
            <el-tooltip placement="right" :enterable="false">
              <div class="show-overflow">{{scope.row.windCtrl.join('')}}</div>
              <div slot="content">
                <ul>
                  <li class="text-center" v-for="windCtrlItem in scope.row.windCtrl">
                    {{windCtrlItem}}
                  </li>
                </ul>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column align="center" prop="second" label="二次筛选指标">
          <template slot-scope="scope">
            <el-tooltip placement="right" :enterable="false">
              <div class="show-overflow">{{scope.row.second.join('')}}</div>
              <div slot="content">
                <ul>
                  <li class="text-center" v-for="secondItem in scope.row.second">
                    {{secondItem}}
                  </li>
                </ul>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable="custom" prop="score" label="模型评分">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.score>0),'equal-zero':(scope.row.score===0),'bellow-zero':(scope.row.score<0)}">{{scope.row.score}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable="custom" prop="ability" label="日均选股数">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.ability>0),'equal-zero':(scope.row.ability===0),'bellow-zero':(scope.row.ability<0)}">{{scope.row.ability}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable="custom" prop="profit" label="年化收益率（复利）" :width="200">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.profit>0),'equal-zero':(scope.row.profit===0),'bellow-zero':(scope.row.profit<0)}">{{scope.row.profit+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable="custom" prop="drop" label="最大回撤">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.drop>0),'equal-zero':(scope.row.drop===0),'bellow-zero':(scope.row.drop<0)}">{{scope.row.drop+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable="custom" prop="noneFate" label="空仓占比">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.noneFate>0),'equal-zero':(scope.row.noneFate===0),'bellow-zero':(scope.row.noneFate<0)}">{{scope.row.noneFate+"%"}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable="custom" prop="win" label="胜率">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.win>0),'equal-zero':(scope.row.win===0),'bellow-zero':(scope.row.win<0)}">{{scope.row.win+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain
                       @click="buildModel(scope.$index+ (currentPage - 1) * pageSize, scope.row)">重建模型
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <el-pagination layout="total,prev, pager, next" :page-size="pageSize" :current-page.sync="currentPage"
                         :total="ruleTalk.length" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
  import {postRemoteReqTodo, getRemoteReqTodo} from '../../api/api'
  import {ascObj, descObj, loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  import {
    CONTROLLER,
    resolveIndicator,
    indicatorToDes,
    classifyIndicator
  } from '../../api/model'
  export default{
    mounted(){
      this.getRuleModel();
    },
    data(){
      return {
        currentRuleTalk: [],
        ruleTalk: [],
        pageSize: 20,
        currentPage: 1,
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {

        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      getRuleModel(){
        getRemoteReqTodo('/stock/font/getruleparliament', [], []).then(res => {
          if (res.data.status === 'SUCCESS') {
            let selectedIndexsTemp = [];
            let symbol = {
              andOrNotIntoMarketLeft: '',
              andOrNotIntoMarketRight: '',
              andOrNotOutMarketLeft: '',
              andOrNotOutMarketRight: '',
              andOrNotWindCtrlLeft: '',
              andOrNotWindCtrlRight: '',
            };
            let conCtrl = {};
            let ruleParliaments = res.data.ruleParliaments;
            let report = {};
            ruleParliaments.forEach(item => {
              report = JSON.parse(item.report.replace(/\'/g, '\"'));
              resolveIndicator(selectedIndexsTemp, item.modelPara, conCtrl, symbol);
              this.ruleTalk.push({
                time: new Date(item.saveTime).format("yyyy-MM-dd hh:mm:ss"),
                modelStr: item.modelPara,
                intoMarket: indicatorToDes(classifyIndicator(selectedIndexsTemp, 'A', 'intoMarket'), symbol.andOrNotIntoMarketLeft, symbol.andOrNotIntoMarketRight),
                outMarket: item.modelPara.indexOf('[SELL]') !== -1 ? indicatorToDes(classifyIndicator(selectedIndexsTemp, 'sell', 'outMarket'),
                  symbol.andOrNotOutMarketLeft, symbol.andOrNotOutMarketRight) : ['无'],
                second: indicatorToDes(classifyIndicator(selectedIndexsTemp, 'B', 'second'), '', ''),
                windCtrl: item.modelPara.indexOf('[DAN_CON]') !== -1 ? indicatorToDes(classifyIndicator(selectedIndexsTemp, 'C', 'windCtrl'),
                  symbol.andOrNotWindCtrlLeft, symbol.andOrNotWindCtrlRight) : ['无'],
                score: item.score.toFixed(2),
                profit: report['score'],
                ability: report['select_stock_ability'].toFixed(0),
                noneFate: report['none_fate'],
                win: report['win'],
                drop: report['drop'],
              });
            });
          } else if (res.data.status === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(this);
          } else {
            this.$message.error(res.data.message);
          }
        });
      },
      changePage(page){
        this.currentPage = page;
        this.currentRuleTalk = this.ruleTalk.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      },
      buildModel(index, row){
        this.$store.state.andOrNot = 'customize';
        resolveIndicator(this.$store.state.selectedIndexs, this.ruleTalk[index].modelStr, this.$store.state.controller, this.$store.state.symbol);
        this.$router.push('/model');

      },
      sortChange({column, prop, order}){
        if (order === 'descending') {
          this.ruleTalk.sort(descObj(prop));
        } else if (order === 'ascending') {
          this.ruleTalk.sort(ascObj(prop));
        } else {
          this.ruleTalk.sort(descObj('time'));
        }
      }
    },
    watch: {
      ruleTalk: function (obj) {
        this.currentRuleTalk = obj.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      }
    }
  }
</script>
<style scoped>
  .above-zero {
    color: #ff0000;
  }

  .equal-zero {
    color: #000;
  }

  .bellow-zero {
    color: #00c261;
  }
  .show-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .text-center{
    text-align: center;
  }
</style>
