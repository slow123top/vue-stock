<template>
  <div style="background-color: rgb(245, 247, 249);padding: 1rem">
    <!--提示保存模型是否要修改名称-->
    <Modal :mask-closable="false" :closable="false" v-model="modalModelName"
           title="提示"
           @on-ok="okSave"
           width="360">
      <p>是否使用以下名称作为模型名称？</p>
      <i-input v-model="$store.state.controller.modelName"></i-input>
    </Modal>
    <Row type="flex" justify="center" :gutter="16" style="margin:1rem 0">
      <i-col span="12">
        <el-radio-group v-model="resultRadio" @change="reslutChange(resultRadio)">
          <el-radio-button label="all">回测概览</el-radio-button>
          <el-radio-button label="modelFunds">模型资金净值曲线</el-radio-button>
          <el-radio-button label="modelFundsBack">模型资金回撤曲线</el-radio-button>
          <el-radio-button label="holdReport">持仓表</el-radio-button>
          <el-radio-button label="yearMonth">年月盈利表</el-radio-button>
          <el-radio-button label="newSelect">新交易日的选股信息</el-radio-button>
        </el-radio-group>
      </i-col>
      <i-col span="2">
        <Button type="success" size="large" @click="edit" style="font-size: 1rem">继续编辑
        </Button>
      </i-col>
      <i-col span="2">
        <Button type="success" size="large" @click="saveResult" style="font-size: 1rem">保存模型

        </Button>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="20">
        <All :report="$store.state.model.report" :modelName="$store.state.controller.modelName"
             v-if="result[0]&&!isBaseInfo"></All>
        <ModelFunds :chartModel="$store.state.model.report['charts_holdings_info']" v-if="result[1]"></ModelFunds>
        <ModelFundsBack :chartDrop="$store.state.model.report['charts_holdings_info']"
                        v-if="result[2]"></ModelFundsBack>
        <HoldReport :chartsHoldingsInfo="$store.state.model.report['charts_holdings_info']"
                    v-if="result[3]"></HoldReport>
        <YearMonth :tableProfitInfo="$store.state.model.report['table_profit_info']" v-if="result[4]"></YearMonth>
        <NewSelect :newDaySelect="$store.state.model.report['new_day_select']" v-if="result[5]"></NewSelect>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import All            from './ResultChildren'
  import YearMonth          from './YearMonth'
  import NewSelect       from './NewSelect'
  import HoldReport      from './HoldReport'
  import ModelFunds       from './ModelFunds'
  import ModelFundsBack from './ModelFundsBack'
  import {postRemoteReqTodo} from '../../api/api'
  import {combineIndicator, resolveIndicator,resolveParaLock} from '../../api/model'
  import {jumpLogin, loginTimeoutPrompt} from '../../api/tools'
  export default {
    beforeMount(){
//      const that = this;
//        分析模型指标  重新赋值select
      let modelIdTemp = this.$route.query.temp_sa_asd;
      let str = localStorage.getItem(modelIdTemp);
      if (str === null) {
        this.$router.replace('/notfound');
      } else {
//        获取当前页面报告
        this.$store.commit('EDITREPORT', {
          report: JSON.parse(str)
        });
//      modelInfo
        postRemoteReqTodo('/stock/getmodelruninfobymodelid', {
          modelId: modelIdTemp.replace(/\%/g, '-'),
          loopType: 0
        }).then(res => {
          let data = res.data;
          if (data.status === 'SUCCESS') {
            this.modelPara = data.model.modelPara;
            this.$store.state.andOrNot = 'customize';
            resolveIndicator(this.$store.state.selectedIndexs, this.modelPara, this.$store.state.controller, this.$store.state.symbol);
            resolveParaLock(this.modelPara,this.$store.state.selectedIndexs);
            console.log();
            this.isBaseInfo = this.$store.state.selectedIndexs.some(function (item) {
              return item.className === '';
            });
          } else if (data.status === 'USER_NOT_FOUND') {
            jumpLogin(this);
          } else {
            this.$message.error(data.message);
          }
        }).catch(() => {
          this.$message.error('获取当前回测结果异常');
        });

      }
    },
    mounted(){
    },
    data() {
      return {
        isBaseInfo: true,
        modelPara: '',
        andOrNot: '',
        modalModelName: false,
        resultRadio: 'all',
        result: [1, 0, 0, 0, 0, 0],
        aferRun: false,
      }
    },
    components: {
      All,
      YearMonth,
      NewSelect,
      HoldReport,
      ModelFunds,
      ModelFundsBack
    },
    computed: {},
    methods: {
      reslutChange(reslut){
        switch (reslut) {
          case 'all':
            this.result = [1, 0, 0, 0, 0, 0];
            break;
          case 'modelFunds':
            this.result = [0, 1, 0, 0, 0, 0];
            break;
          case 'modelFundsBack':
            this.result = [0, 0, 1, 0, 0, 0];
            break;
          case 'holdReport':
            this.result = [0, 0, 0, 1, 0, 0];
            break;
          case 'yearMonth':
            this.result = [0, 0, 0, 0, 1, 0];
            break;
          case 'newSelect':
            this.result = [0, 0, 0, 0, 0, 1];
            break;
          default:
            break;
        }
      },
      saveResult() {
        this.modalModelName = true;
      },
      edit() {
        this.$router.push('/model/newModel');
      },
      okSave(){
//        const that = this;
        //        获取模型信息
        if (this.$store.state.controller.modelName === '') {
          this.$message.error('请输入模型名称');
        } else {
          postRemoteReqTodo('/stock/savemodel', {
            modelId: this.$route.query.temp_sa_asd.replace(/\%/g, '-'),
            modelName: this.$store.state.controller.modelName,
            modelPara: this.modelPara,
            modelInfo: 'dasdas',
            report: JSON.stringify(this.$store.state.model.report),
            loopType: 0
          }).then(res => {
            if (res.data.status === 'SUCCESS') {
              this.$message.success('已成功保存到我的模型');
            } else if (res.data.status === 'ERROR') {
              this.$message.error(res.data.message);
            } else if (res.data.status === 'USER_NOT_FOUND') {
              loginTimeoutPrompt(this);
            }
          }).catch(() => {
            this.$message.error('保存模型异常');
          });
        }

      }
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  span {
    color: #FF0000;
  }
</style>
