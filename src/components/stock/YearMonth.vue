<template>
  <Row type="flex" justify="start" style="margin:0 0 1rem 0">
    <i-col span="24" style="background: #fff;padding:1rem;border-radius: 10px">
      <h2 style="text-align: center">年/月盈利分布表</h2>
      <i-table border :columns="columns" :data="datas"></i-table>
    </i-col>
  </Row>
</template>
<script>
  export default {
    props: {
      tableProfitInfo: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        datas: this.data(),
        columns: [{
          "title": "年份_月份",
          "key": "year_month",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "1月",
          "key": "Jan",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "2月",
          "key": "Feb",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "3月",
          "key": "Mar",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "4月",
          "key": "Apr",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "5月",
          "key": "May",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "6月",
          "key": "Jun",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "7月",
          "key": "Jul",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "8月",
          "key": "Aug",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "9月",
          "key": "Sep",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "10月",
          "key": "Oct",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "11月",
          "key": "Nov",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "12月",
          "key": "Dec",
          align: 'center',
//                    "sortable": true
        }, {
          "title": "年度盈利率",
          "key": "year_profit",
          align: 'center',
//                    "sortable": true
        }]
      }
    },
    methods: {
      data(){
        let yearMonth = this.tableProfitInfo;
        let dataTemp = [];
        let yearMonthTemp;
//          去除0
        for (let i = 0; i < yearMonth.length; i++) {
          yearMonthTemp = yearMonth[i].map(function (item) {
            return item === 0 ? '' : item;
          });
          dataTemp.push({
            "year_month": yearMonthTemp[0],
            "Jan": yearMonthTemp[1],
            "Feb": yearMonthTemp[2],
            "Mar": yearMonthTemp[3],
            "Apr": yearMonthTemp[4],
            "May": yearMonthTemp[5],
            "Jun": yearMonthTemp[6],
            "Jul": yearMonthTemp[7],
            "Aug": yearMonthTemp[8],
            "Sep": yearMonthTemp[9],
            "Oct": yearMonthTemp[10],
            "Nov": yearMonthTemp[11],
            "Dec": yearMonthTemp[12],
            "year_profit": yearMonthTemp[13],
            cellClassName: {
              Jan: Number(yearMonthTemp[1].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[1].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Feb: Number(yearMonthTemp[2].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[2].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Mar: Number(yearMonthTemp[3].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[3].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Apr: Number(yearMonthTemp[4].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[4].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              May: Number(yearMonthTemp[5].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[5].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Jun: Number(yearMonthTemp[6].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[6].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Jul: Number(yearMonthTemp[7].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[7].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Aug: Number(yearMonthTemp[8].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[8].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Sep: Number(yearMonthTemp[9].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[9].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Oct: Number(yearMonthTemp[10].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[10].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Nov: Number(yearMonthTemp[11].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[11].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              Dec: Number(yearMonthTemp[12].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[12].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero'),
              year_profit: Number(yearMonthTemp[13].replace(/\%/g, '')) < 0 ? 'demo-table-bellow-zero' : (Number(yearMonthTemp[13].replace(/\%/g, '')) === 0 ? 'demo-table-equal-zero' : 'demo-table-above-zero')
            }
          });
        }
        return dataTemp;
      }
    }
  }
</script>
