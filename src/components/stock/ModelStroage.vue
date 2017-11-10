<template>
  <Row type="flex" justify="center">
    <i-col span="24">

      <el-table :height="800" size="small" :data="tableData" style="width: 100%" @sort-change="sortChange">
        <el-table-column type="index" align="center" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="模型名称"></el-table-column>
        <el-table-column align="center" prop="into_indicator"
                         label="入市指标">
          <template slot-scope="scope">
            <el-tooltip placement="right" :enterable="false">
              <div class="show-overflow">{{scope.row.into_indicator.join('')}}</div>
              <div slot="content">
                <ul>
                  <li class="text-center" v-for="into in scope.row.into_indicator">
                    {{into}}
                  </li>
                </ul>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="out_indicator"
                         label="出市指标">
          <template slot-scope="scope">
            <el-tooltip placement="right" :enterable="false">
              <div class="show-overflow">{{scope.row.out_indicator.join('')}}</div>
              <div slot="content">
                <ul>
                  <li class="text-center" v-for="out in scope.row.out_indicator">
                    {{out}}
                  </li>
                </ul>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="second_indicator"
                         label="二次筛选指标">
          <template slot-scope="scope">
            <el-tooltip placement="right" :enterable="false">
              <div class="show-overflow">{{scope.row.second_indicator.join('')}}</div>
              <div slot="content">
                <ul>
                  <li class="text-center" v-for="second in scope.row.second_indicator">
                    {{second}}
                  </li>
                </ul>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="wind_indicator"
                         label="风控指标">
          <template slot-scope="scope">
            <el-tooltip placement="right" :enterable="false">
              <div class="show-overflow">{{scope.row.wind_indicator.join('')}}</div>
              <div slot="content">
                <ul>
                  <li class="text-center" v-for="wind in scope.row.wind_indicator">
                    {{wind}}
                  </li>
                </ul>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="test_range" label="回测区间"></el-table-column>
        <el-table-column align="center" sortable prop="year_profit" :width="200" label="年化收益率（复利）">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.year_profit>0),'equal-zero':(scope.row.year_profit===0),'bellow-zero':(scope.row.year_profit<0)}">{{scope.row.year_profit+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="max_back" label="最大回撤">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.max_back>0),'equal-zero':(scope.row.max_back===0),'bellow-zero':(scope.row.max_back<0)}">{{scope.row.max_back+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="win_rate" label="胜率">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.win_rate>0),'equal-zero':(scope.row.win_rate===0),'bellow-zero':(scope.row.win_rate<0)}">{{scope.row.win_rate+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="empty_rate" label="空仓占比">
          <template slot-scope="scope">
            <span
              :class="{'above-zero':(scope.row.empty_rate>0),'equal-zero':(scope.row.empty_rate===0),'bellow-zero':(scope.row.empty_rate<0)}">{{scope.row.empty_rate+"%"}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>-->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="rebuildModel(scope.$index)" type="text">重建模型</el-button>
          </template>
        </el-table-column>
      </el-table>

    </i-col>

  </Row>
</template>
<script>
  import {
    CONTROLLER,
    resolveIndicator,
    indicatorToDes,
    classifyIndicator
  } from '../../api/model'
  import {getRemoteReqTodo} from '../../api/api'
  import {descObj, ascObj, loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  export default{
    mounted(){
      this.getModelStorage();
    },
    data(){
      return {
        tableData: [],
        modelStorage: [],
      }
    },
    methods: {
//        重建模型
      rebuildModel(index){
        this.$store.state.andOrNot = 'customize';
        resolveIndicator(this.$store.state.selectedIndexs, this.modelStorage[index].modelPara,  this.$store.state.controller, this.$store.state.symbol);
        this.$router.push('/model');
      },
      sortChange(param){
        if (param.order === 'descending') {
          this.modelStorage = this.modelStorage.sort(descObj(param.prop));
        } else if (param.order === 'ascending') {
          this.modelStorage = this.modelStorage.sort(ascObj(param.prop));
        } else {
          this.modelStorage = this.modelStorage.sort(descObj('time'));
        }
      },
      getModelStorage(){
        let that = this;
        getRemoteReqTodo('/stock/modelstorage', [], []).then(res => {
          let data = res.data;
          if (data.status === 'SUCCESS') {
            that.modelStorage.splice(0, that.modelStorage.length);
            that.tableData.splice(0, that.tableData.length);
            let selectedIndexsTemp = [];
            let symbol = {
              andOrNotIntoMarketLeft: '',
              andOrNotIntoMarketRight: '',
              andOrNotOutMarketLeft: '',
              andOrNotOutMarketRight: '',
              andOrNotWindCtrlLeft: '',
              andOrNotWindCtrlRight: '',
            };
            let modelPara = '';
            let report = {};
            let conCtrl = {};
            data.modelStorages.forEach(item => {
              modelPara = item.modelPara;
              resolveIndicator(selectedIndexsTemp, modelPara, conCtrl, symbol);
              if (item.report !== null) {
                report = JSON.parse(item.report.replace(/\s+/g, ''));
              } else {
                report = {
                  score: '',
                  drop: '',
                  win: '',
                  none_fate: ''
                }
              }
              let controller = CONTROLLER(modelPara);
              that.modelStorage.push({
                name: modelPara.substring(modelPara.indexOf('[NAME]') + 6, modelPara.lastIndexOf('[NAME]')),
                into_indicator: indicatorToDes(classifyIndicator(selectedIndexsTemp, 'A', 'intoMarket'), symbol.andOrNotIntoMarketLeft, symbol.andOrNotIntoMarketRight),
                out_indicator: modelPara.indexOf('[SELL]') !== -1 ? indicatorToDes(classifyIndicator(selectedIndexsTemp, 'sell', 'outMarket'),
                  symbol.andOrNotOutMarketLeft, symbol.andOrNotOutMarketRight) : ['无'],
                wind_indicator: modelPara.indexOf('[DAN_CON]') !== -1 ? indicatorToDes(classifyIndicator(selectedIndexsTemp, 'C', 'windCtrl'),
                  symbol.andOrNotWindCtrlLeft, symbol.andOrNotWindCtrlRight) : ['无'],
                second_indicator: indicatorToDes(classifyIndicator(selectedIndexsTemp, 'B', 'second'), '', ''),
                test_range:controller[1]+'~'+controller[2],
                year_profit: report['score'],
                max_back: report['drop'],
                win_rate: report['win'],
                empty_rate: report['none_fate'],
                modelPara: modelPara
              });
              that.tableData = that.modelStorage;
            });
          } else if (data.status === 'USER_NOT_FOUND') {
            jumpLogin(that);
          } else {
//            出现错误
            that.$message.error(data.message);
          }
        });
      }
    }
  }
</script>
<style scoped>
  .show-overflow {
    /*width: 200px;*/
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .text-center{
    text-align: center;
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
