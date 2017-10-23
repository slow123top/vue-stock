<template>
  <Row type="flex" justify="center" style="padding: .5rem;background: #fff;border-radius: 10px">
    <i-col span="12">
      <Row type="flex" justify="center">
        <i-col span="4" style="font-size: 1rem">
          展示区间：



        </i-col>
        <i-col span="10">
          <el-date-picker
            v-model="startDate"
            :editable="false"
            :clearable="false"
            size="small"
            type="date"
            placeholder="选择日期"
            :picker-options="startDateLimit"
            @change="changeStartDate">
          </el-date-picker>

        </i-col>
        <i-col span="10">
          <el-date-picker
            v-model="endDate"
            :editable="false"
            :clearable="false"
            size="small"
            type="date"
            placeholder="选择日期"
            :picker-options="endDateLimit"
            @change="changeEndDate">
          </el-date-picker>

        </i-col>
      </Row>
    </i-col>
    <i-col span="24">
      <echarts :options="option" :chartSize="chartSize"></echarts>
    </i-col>
  </Row>
</template>
<script>
  import echarts from 'vue2-echarts/src/ECharts/ECharts'
  export default {
    props: {
      chartDrop: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    data() {
      const that = this;
      return {
        chartSize: {
          width: '100%',
          height: '30rem'
        },
        option: this.getOption(this.chartDrop['date'], this.chartDrop['mondel_drop']),
        startDateLimit: {
          disabledDate(time) {
            return time.getTime() < new Date(that.chartDrop['date'][0]) - 8.64e7;
          }
        },
        startDate: this.chartDrop['date'][0],
        endDate: this.chartDrop['date'][that.chartDrop['date'].length - 1],
        endDateLimit: {
          disabledDate(time) {
            return time.getTime() > new Date(that.chartDrop['date'][that.chartDrop['date'].length - 1]);
          }
        }
      }
    },
    methods: {
      //        修改开始日期
      changeStartDate(value){
        const that = this;
        if (new Date(value).getTime() >= new Date(this.endDate).getTime()) {
          this.startDate = this.chartDrop['date'][0];
          this.changeStartDate();
        } else {
          let optionDate = this.chartDrop['date'].filter(item => {
            return new Date(item).getTime() >= new Date(value).getTime();
          });
          let optionData = this.chartDrop['mondel_drop'].slice(this.chartDrop['date'].length - optionDate.length);
          optionDate = optionDate.filter(item => {
            return new Date(item).getTime() <= new Date(that.endDate).getTime();
          });
          optionData = optionData.slice(0, optionDate.length);
          this.option = this.getOption(optionDate, optionData);
        }
      },
//      修改结束日期
      changeEndDate(value){
        const that = this;
        if (new Date(value).getTime() <= new Date(this.startDate).getTime()) {
          this.endDate = this.chartDrop['date'][this.chartDrop['date'].length - 1];
          this.changeEndDate();
        } else {
          let optionDate = this.chartDrop['date'].filter(item => {
            return new Date(item).getTime() <= new Date(value).getTime();
          });
          let optionData = this.chartDrop['mondel_drop'].slice(0, optionDate.length);
          optionDate = optionDate.filter(item => {
            return new Date(item).getTime() >= new Date(that.startDate).getTime();
          });
          optionData = optionData.slice(optionData.length - optionDate.length);
          this.option = this.getOption(optionDate, optionData);
        }
      },
      getOption(date, data){
        let option = {
          title: {
            text: '模型资金净值回撤曲线'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return params[0].name + '<br/>' + params[0].seriesName + ':' + params[0].value.toFixed(2) + '%';
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
//              data: this.chartDrop['date'],
            data: date,

          },
          dataZoom: [{
            start: 0,
            end: 100
          },
            {
              type: 'inside',
            }
          ],
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (value) {
                return value.toFixed(2) + '%';
              },
            }
          },
          series: [{
            name: '模型资金净值回撤',
            type: 'line',
//          data: this.chartDrop['mondel_drop']
            data: data
          }]
        };
        return option;
      }
    },
    components: {
      echarts
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
</style>
