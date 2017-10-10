<template>
  <div>
    <model-basic-info :statisticalInfo="statisticalInfo" :modelName="modelNameTemp"></model-basic-info>
    <Echarts :chartModelDrop="chartsHoldingsInfo"></Echarts>
    <hold-report :chartsHoldingsInfo="chartsHoldingsInfo"></hold-report>
    <year-month :tableProfitInfo="tableProfitInfo"></year-month>
    <new-select :newDaySelect="newDaySelect"></new-select>
  </div>
</template>
<script>
  import ModelBasicInfo from './ModelBasicInfo'
  import Echarts from './Echarts'
  import HoldReport from './HoldReport'
  import YearMonth from './YearMonth'
  import NewSelect from './NewSelect'
  export default {
    props: {
      report: {
        type: Object,
        default: function () {
          return {}
        }
      },
      modelName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        statisticalInfo: this.report['statistical_info'],
        chartsHoldingsInfo: this.report['charts_holdings_info'],
        tableProfitInfo: this.report['table_profit_info'],
        newDaySelect: this.report['new_day_select'],
        aferRun: false,
        modelNameTemp: this.modelName
      }
    },
    components: {
      ModelBasicInfo,
      Echarts,
      HoldReport,
      YearMonth,
      NewSelect
    },
    methods: {}
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  span {
    color: #FF0000;
  }
</style>
