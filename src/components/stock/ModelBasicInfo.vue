<template>
  <Row type="flex" justify="space-between" style="background:#f5f7f9;margin: 0 0 1rem 0">
    <i-col span="24" style="background: #fff;padding:1rem;border-radius: 10px;font-size: 1rem">
      <span class="title-name">模型信息</span>
      <el-table :data="arrData" style="width: 100%;" size="small">
        <el-table-column align="center" prop="model_name" label="模型名称"></el-table-column>
        <el-table-column align="center" prop="into_indicator" label="入市指标">
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
        <el-table-column align="center" prop="out_indicator" label="出市指标">
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
        <el-table-column align="center" prop="wind_indicator" label="风控指标">
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
        <el-table-column align="center" prop="second_indicator" label="二次筛选指标">
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
        <el-table-column align="center" prop="test_range" label="回测区间"></el-table-column>
        <el-table-column align="center" prop="hold_date" label="持有期"></el-table-column>
        <el-table-column align="center" prop="buy_rate" label="买入费率">

        </el-table-column>
        <el-table-column align="center" prop="sold_rate" label="卖出费率">

        </el-table-column>
        <el-table-column align="center" prop="model_pressure_rate" label="模型压力费率"></el-table-column>
        <el-table-column align="center" prop="stop_profit" label="止盈"></el-table-column>
        <el-table-column align="center" prop="stop_loss" label="止损"></el-table-column>
      </el-table>
    </i-col>
    <i-col span="24" style="background: #fff;padding:1rem;border-radius: 10px">

      <span class="title-name">收益统计</span>
      <Row type="flex" justify="start">
        <i-col span="2">
          <div class="result-title">总收益率</div>
          <div :style="profitStyle[isEqualZero(statisticalInfo[1].replace('%',''))]">{{statisticalInfo[1]}}</div>
        </i-col>
        <i-col span="3">
          <div class="result-title">年化收益率（复利）</div>
          <div :style="profitStyle[isEqualZero(statisticalInfo[5].replace('%',''))]">{{statisticalInfo[5]}}</div>
        </i-col>
        <i-col span="2">
          <div class="result-title">最大回撤</div>
          <div :style="profitStyle[isEqualZero(statisticalInfo[2].replace('%',''))]">{{statisticalInfo[2]}}</div>
        </i-col>
        <i-col span="2">
          <div class="result-title">胜率</div>
          <div :style="profitStyle[isEqualZero(statisticalInfo[3].replace('%',''))]">{{statisticalInfo[3]}}</div>
        </i-col>
        <i-col span="2">
          <div class="result-title">空仓占比</div>
          <div :style="profitStyle[isEqualZero(statisticalInfo[4].replace('%',''))]">{{statisticalInfo[4]}}</div>
        </i-col>
        <i-col span="3" v-if="statisticalInfo.length >6">
          <div class="result-title">平均每日选股数量</div>
          <div :style="profitStyle[isEqualZero(statisticalInfo[6].replace('%',''))]">{{statisticalInfo[6]}}</div>
        </i-col>
      </Row>
    </i-col>
  </Row>
</template>
<script>
  import {classifyIndicator, indicatorToDes} from '../../api/model'
  export default {
    props: {
      statisticalInfo: {
        type: Array,
        default: function () {
          return []
        }
      },
      modelName: {
        type: String,
        default: function () {
          return ''
        }
      }
    },
    data() {
      return {
        arrData: this.data(),
        profitStyle: {
          equalZero: {
            'font-size':'1.2rem',
            'color': '#000000',
            'text-align':'center'
          },
          lessThanZero: {
            'font-weight': 'bold',
            'color': '#00c261',
            'font-size':'1.2rem',
            'text-align':'center'
          },
          moreThanZero: {
            'font-weight': 'bold',
            'color': '#ff0000',
            'font-size':'1.2rem',
            'text-align':'center'
          }
        },
      }
    },
    methods: {
      data(){
        let dataTemp = [];
        const statisticalInfo = this.statisticalInfo;
        const controller = this.$store.state.controller;
//        返回表格内容
        dataTemp.push({
          model_name: this.modelName,
          into_indicator:this.getIntoMarketList(),
          out_indicator:this.getOutMarketList(),
          wind_indicator:this.getWindCtrlList(),
          second_indicator:this.getSecondList(),
          test_range: statisticalInfo[0][0] + '~' + statisticalInfo[0][1],
          hold_date: controller.holdDate,
          buy_rate: controller.buyRate + '‱',
          sold_rate: controller.sellRate + '‱',
          model_pressure_rate: controller.pressureRate + '‱',
          max_hold: controller.maxDailyHold,
          stop_profit: controller.stopProfit + '%',
          stop_loss: controller.stopLoss + '%'
        });
        return dataTemp;
      },
      getIntoMarketList(){
        let intoMarket = classifyIndicator(this.$store.state.selectedIndexs, 'A', 'intoMarket');
        return indicatorToDes(intoMarket, this.$store.state.symbol.andOrNotIntoMarketLeft, this.$store.state.symbol.andOrNotIntoMarketRight);
      },
      getOutMarketList(){
        let outMarket = classifyIndicator(this.$store.state.selectedIndexs, 'sell', 'outMarket');
        return outMarket.length === 0 ? ['无'] : indicatorToDes(outMarket, this.$store.state.symbol.andOrNotOutMarketLeft, this.$store.state.symbol.andOrNotOutMarketRight);
      },
      getWindCtrlList(){
        let windCtrl = classifyIndicator(this.$store.state.selectedIndexs, 'C', 'intoMarket');
        return windCtrl.length === 0 ? ['无'] : indicatorToDes(windCtrl, this.$store.state.symbol.andOrNotWindCtrlLeft, this.$store.state.symbol.andOrNotWindCtrlRight);
      },
      getSecondList(){
        let second = classifyIndicator(this.$store.state.selectedIndexs, 'B', 'second');
        return indicatorToDes(second, '', '');
      },
//      判断与0的关系
      isEqualZero(param){
        if (Number(param) === 0.00) {
          return 'equalZero';
        } else {
          if (param < 0) {
            return 'lessThanZero';
          }
          return 'moreThanZero';
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet">
  .ivu-table .demo-table-bellow-zero {
    /*background-color: #187;*/
    color: #00c261;
  }

  .ivu-table .demo-table-above-zero {
    /*background-color: #187;*/
    color: #ff0000;
  }
  span.title-name{
    font-size: 1.2rem;
    font-weight: bold;
  }
  .ivu-table .demo-table-equal-zero {
    /*background-color: #187;*/
    color: #000000;
  }
  .result-title{
    text-align: center;
  }
  .show-overflow {
    /*width: 200px;*/
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .text-center{
    text-align: center;
  }
</style>
