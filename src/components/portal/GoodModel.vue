<template>
  <Card>
    <p slot="title">{{title}}</p>
    <Echarts :options="option" :chartSize="chartSize"></Echarts>
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
            },
        option: {

          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['最高气温', '最低气温']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            }
          },
          series: [
            {
              name: '最高气温',
              type: 'line',
              data: [11, 11, 15, 13, 12, 13, 10],
//              markPoint: {
//                data: [
//                  {type: 'max', name: '最大值'},
//                  {type: 'min', name: '最小值'}
//                ]
//              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            },
            {
              name: '最低气温',
              type: 'line',
              data: [1, -2, 2, 5, 3, 2, 0],
//              markPoint: {
//                data: [
//                  {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
//                ]
//              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'},
                  [{
                    symbol: 'none',
                    x: '90%',
                    yAxis: 'max'
                  }, {
                    symbol: 'circle',
                    label: {
                      normal: {
                        position: 'start',
                        formatter: '最大值'
                      }
                    },
                    type: 'max',
                    name: '最高点'
                  }]
                ]
              }
            }
          ]
        }
      }
    }
  }
</script>
<style>

</style>
