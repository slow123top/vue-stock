<template>
  <div>
    <ModelFunds :chartModel="chartModel"></ModelFunds>
    <ModelFundsBack :chartDrop="chartDrop"></ModelFundsBack>
  </div>
</template>
<script>
  import ModelFunds       from './ModelFunds'
  import ModelFundsBack from './ModelFundsBack'
  export default {
    props: {
      chartModelDrop: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        chartModel: this.chartModelDrop,
        chartDrop: this.chartModelDrop
      }
    },
    components: {
      ModelFunds,
      ModelFundsBack
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
</style>
