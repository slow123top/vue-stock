<template>
  <Row type="flex" justify="center" style="margin:0 0 1rem 0">
    <i-col span="24" style="background: #fff;padding:1rem;border-radius: 10px">
      <h2 style="text-align: center">持仓表</h2>
      <i-table border :columns="columns" :data="tableData" @on-sort-change="sortChange"></i-table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="data.length" :current="currentPage" @on-change="changePage" show-total></Page>
        </div>
      </div>
    </i-col>
  </Row>
</template>
<script>
  import {ascObj, descObj} from '../../api/tools'
  export default {
    props: {
      chartsHoldingsInfo: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    data () {
      return {
        data: this.getData(),
        tableData: this.getData().slice(0, 10),
        pageSize: 10,
        currentPage: 1,
        columns: [
          {
            "title": "日期",
            "key": "time",
            align: 'center',
            "sortable": 'custom'
          },
          {
            "title": "卖出股票",
            "key": "sold_stock",
            align: 'center'
          },
          {
            "title": "买入股票",
            "key": "buy_stock",
            align: 'center'
          },
          {
            "title": "当日实际持仓股票",
            "key": "hold_report",
            align: 'center',
          },
          {
            "title": "当日盈利率",
            "key": "profit",
            align: 'center',
            "sortable": 'custom'
          }
        ]
      }
    },
    methods: {
      getData(){
        let holdingDate = this.chartsHoldingsInfo['date'];
        let holdingReport = this.chartsHoldingsInfo['holding_report'];
        let dataTemp = [];
        for (let i = holdingReport.length - 1; i >= 0; i--) {
          dataTemp.push({
            "time": holdingDate[i],
            "sold_stock": holdingReport[i][0].join(','),
            "buy_stock": holdingReport[i][1].join(','),
            "hold_report": holdingReport[i][2].join(','),
            "profit": holdingReport[i][3],
            cellClassName: {
              profit: Number(holdingReport[i][3].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(holdingReport[i][3].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
            }
          });
        }
        return dataTemp;
      },
      changePage (current) {
        this.currentPage = current;
        this.tableData = this.data.slice((this.currentPage - 1) * 10, this.currentPage * 10);
      },
//      分页排序
      sortChange(param){
        if (param.order === 'desc') {
          this.data.sort(descObj(param.key));
          this.tableData = this.data.slice((this.currentPage - 1) * 10, this.currentPage * 10);
        } else if (param.order === 'asc') {
          this.data.sort(ascObj(param.key));
          this.tableData = this.data.slice((this.currentPage - 1) * 10, this.currentPage * 10);
        } else {
          return true;
        }
      },
    }
  }
</script>

