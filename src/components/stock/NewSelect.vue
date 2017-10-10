<template>
  <Row type="flex" justify="start" style="margin:0 0 1rem 0">
    <i-col span="24" style="background: #fff;padding:1rem;border-radius: 10px">
      <h2 style="text-align: center">最新交易指令</h2>
      <i-table border :columns="columns" no-data-text="明天无操作，持仓不变" :data="data" ref="table"></i-table>
    </i-col>
  </Row>
</template>
<script>
  import newSelectExpand from './NewSelectExpand'
  export default {
    props: {
      newDaySelect: {
        type: Array,
        dafault: []
      }
    },
    data () {
      return {
        data: this.getData(),
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(newSelectExpand, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            "title": "下一个交易日买入股票列表",
            "key": "buy_list",
            align: 'center',
          },
          {
            "title": "下一个交易日卖出股票列表",
            "key": "sold_list",
            align: 'center',
          },
          {
            "title": " 如果无法买入则按顺序购买的备用买入列表",
            "key": "backup_list",
            align: 'center',
            ellipsis: true
          }
        ]
      }
    },
    methods: {
      getData(){
        let newSelect = this.newDaySelect;
        let dataTemp = [];
        dataTemp.push({
          "buy_list": newSelect[0].join(','),
          "sold_list": newSelect[1].join(','),
          "backup_list": newSelect[2].join(',')
        });
        return dataTemp;
      }
    },
    components: {
      newSelectExpand
    }
  }
</script>

