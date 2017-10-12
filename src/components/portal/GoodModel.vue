<template>
  <Card>
    <p slot="title">{{title}}</p>
    <!--<Echarts :options="option" :chartSize="chartSize"></Echarts>-->
    <span>年盈利率</span>
    <span>月盈利率</span>
    <span>最大回撤</span>
    <Button type="error" style="float: right">详情</Button>
  </Card>
</template>
<script>
  import Echarts from 'vue2-echarts/src/ECharts/ECharts'

  export default{
    props: {
      title: String
    },
    components: {
      Echarts
    },
    data(){
      return {
        chartSize:{
            width:'100%',
          height:'15rem'
            }
      }
    }
  }
</script>
<style>

</style>
