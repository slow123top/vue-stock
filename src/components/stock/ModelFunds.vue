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
      chartModel: {
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
        option: this.getOption(this.chartModel['date'], this.chartModel['mondel_score']),
        startDateLimit: {
          disabledDate(time) {
            return time.getTime() < new Date(that.chartModel['date'][0]) - 8.64e7;
          }
        },
        startDate: this.chartModel['date'][0],
        endDate: this.chartModel['date'][that.chartModel['date'].length - 1],
        endDateLimit: {
          disabledDate(time) {
            return time.getTime() > new Date(that.chartModel['date'][that.chartModel['date'].length - 1]);
          }
        }
      }
    },
    methods: {
//        修改开始日期
      changeStartDate(value){
        const that = this;
        if (new Date(value).getTime() >= new Date(this.endDate).getTime()) {
          this.startDate = this.chartModel['date'][0];
          this.changeStartDate();
        } else {
          let optionDate = this.chartModel['date'].filter(item => {
            return new Date(item).getTime() >= new Date(value).getTime();
          });
          let optionData = this.chartModel['mondel_score'].slice(this.chartModel['date'].length - optionDate.length);
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
          this.endDate = this.chartModel['date'][this.chartModel['date'].length - 1];
          this.changeEndDate();
        } else {
          let optionDate = this.chartModel['date'].filter(item => {
            return new Date(item).getTime() <= new Date(value).getTime();
          });
          let optionData = this.chartModel['mondel_score'].slice(0, optionDate.length);
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
            text: '模型资金净值曲线'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return params[0].name + '<br/>' + params[0].seriesName + ':' + params[0].value.toFixed(2);
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
//              data: this.chartModel['date'],
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
                return value;
              },
            }
          },
          series: [{
            name: '模型资金净值',
            type: 'line',
//            data: this.chartModel['mondel_score'],
            data: data,
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
