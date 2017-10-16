<template>
  <div>
    <Modal v-model="myModelModal" :mask-closable="false" :closable="false" width="360">
      <Spin size="large">
        <Icon type="load-c" size=18
                                                       class="demo-spin-icon-load"
              style="line-height: 2rem;border-radius: 20px"></Icon>
        <div>{{myModalModalInfo}}</div>
      </Spin>
      <div slot="footer">
      </div>
    </Modal>
    <transition name="el-zoom-in-top">
      <Row type="flex" :gutter="16" v-show="modal"
           style="height:50rem;background:#e3e8ee;font-size: 0.875rem;border-radius:10px;padding:1rem">
        <i-col span="3" style="height:100%;overflow:auto;background:#fff;border-radius: 10px">
          <Row type="flex" justify="center" v-if="trackModels.length" style="text-align: center;font-size: 1rem">
            <i-col span="24">
              实盘跟踪模型列表





            </i-col>
          </Row>
          <Row v-for="(model,index) in trackModels" type="flex" justify="space-between" :key="model"
               style="padding: .3rem;line-height: 1">
            <i-col span="24">
              <!--:style="trackInfo[index]['style']"-->
              <Button long :style="trackInfo[index]['style']" @click="getTrack(index)">
                {{model.modelName}}





              </Button>
            </i-col>
          </Row>
          <Row type="flex" justify="space-between" style="box-sizing: border-box;padding: .5rem">
            <i-col span="24">
              <Button type="dashed" long icon="plus-round" v-if="trackModels.length !== 3" @click="addTrackModels">
                添加实盘跟踪模型（仅限3个）





              </Button>
            </i-col>
          </Row>
        </i-col>
        <i-col span="21" v-if="report" style="height:100%;overflow:auto">
          <Row type="flex" justify="center" style="background:#ffffff;padding: .5rem;border-radius: 10px 10px 0 0">
            <i-col span="24" style="text-align: right">
              <Button size="large" type="primary" icon="edit" @click="editModel">编辑</Button>
              <Button size="large" type="error" icon="trash-a" @click="cancelTrack">撤销实盘跟踪</Button>
            </i-col>
          </Row>
          <AllReport :report="report" :modelName="modelName"></AllReport>
          <!--模型基本信息-->
        </i-col>
      </Row>
    </transition>
  </div>
</template>
<script>
  import AllReport from './ResultChildren.vue'
  import {postRemoteReqTodo, getRemoteReqTodo} from '../../api/api'
  import {resolveIndicator} from '../../api/model'
  import {loginTimeoutPrompt, jumpLogin} from '../../api/tools'
  export default {
    mounted(){
      const that = this;
//          若刷新页面
      getRemoteReqTodo('/stock/mymodels', [], []).then(res => {
        if (res.data.status === 'SUCCESS') {
          this.trackModels.splice(0, this.trackModels.length);
          let trackModels = this.trackModels;
          if (!res.data.returnModel && typeof res.data.returnModel === 'object') {
            this.$message.warning('您当前没有跟踪模型');
          } else {
            res.data.returnModel.forEach(function (model) {
              if (model.track === 1) {
                trackModels.push({
                  modelId: model.modelId,
                  modelName: model.modelName,
                  modelPara: model.modelPara,
                  modelInfo: model.modelInfo,
                  isTracking: model.track
                })
              }
            });
//          如果是查看某一个模型的实盘跟踪 那么就先调用获取实盘跟踪的函数
            if (this.$route.query.model_sa_asd !== undefined) {
              let modelId = that.$route.query.model_sa_asd.replace(/\%/g, '-');
              let currentIndex;
              this.trackModels.forEach(function (item, index) {
                if (item.modelId === modelId) {
                  currentIndex = index;
                }
              });
              this.getTrack(currentIndex);
            }
            if (that.trackModels.length === 0) {
              this.$message.warning('您当前没有跟踪模型');
            }
          }

        } else if (res.data.status === 'ERROR') {
          this.$Notice.error({
            title: res.data.message
          });
        } else if (res.data.status === 'USER_NOT_FOUND') {
          jumpLogin(this);
        } else {
          this.$Notice.error({
            title: '实盘跟踪模型显示异常，请重试'
          });
        }
        this.modal = true;
      }).catch(() => {
        this.$message.error('实盘跟踪模型获取异常，请重试');
      });
    },
    data() {
      return {
//          模型指标转换出来的模型信息
        report: '',
        modal: false,
        myModelModal: false,
        myModalModalInfo: '',
        modelIndexToDes: [],
        isTracking: false,
        formValidate: {
          currentInputIndex: this.$store.state.currentInputIndex,
          selectedIndexs: this.$store.state.selectedIndexs,
          controller: this.$store.state.controller,
          holdDateCanRun: 1,
          lossCanRun: 1,
          profitCanRun: 1,
          feeCanRun: 1
        },
        trackModels: [],
//        myModels: this.$store.state.myModels,
        currentModelIndex: 0,
        chartSize: {
          width: '100%',
          height: '20rem',
        },
        clickTrack: '',
//        基本信息列表
      }
    },
    computed: {
      reportTitle(){
        return !this.clickTrack ? '单次回测报告' : '实盘跟踪报告'
      },
      modelName(){
        return this.trackModels[this.currentModelIndex].modelName;
      },
//      实盘信息
      trackInfo(){
        let temp = [];
        for (let i = 0; i < this.trackModels.length; i++) {
          temp.push({
            style: {
              'overflow': 'hidden',
              'text-overflow': 'ellipsis',
              'white-space': 'nowrap'
            }
          });
        }

        if (this.clickTrack) {
          temp[this.currentModelIndex].style.background = '#2d8cf0';
          temp[this.currentModelIndex].style.color = '#fff';
        }

        return temp;
      }
    },
    methods: {
      changePage (current) {
        this.currentPage = current;
      },
      // 编辑模型
      editModel() {
        //          首先删除所有存在的指标
        this.$store.state.andOrNot = 'customize';
        resolveIndicator(this.$store.state.selectedIndexs, this.trackModels[this.currentModelIndex].modelPara, this.$store.state.controller, this.$store.state.symbol);
        this.$router.push('/model/newModel');
      },

      cancelTrack(){
        postRemoteReqTodo('/stock/track/canceltrack', {modelId: this.trackModels[this.currentModelIndex].modelId}).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
//              撤销实盘跟踪成功
            this.trackModels.splice(this.currentModelIndex, 1);
            this.report = '';
            this.clickTrack = '';
            this.currentModelIndex = 0;
          } else if (data['status'] === 'ERROR') {
//            失败
            this.$Notice.error({
              title: data['message']
            })
          } else if (data['status'] === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(this);
          } else {
            this.$Notice.error({
              title: '撤销实盘跟踪出现异常，请重试'
            })
          }
        }).catch(() => {
          this.$Notice.error({
            title: '连接服务器出现异常，请重试'
          })
        });
      },
      addTrackModels(){
        this.$router.push('/model/myModel');
      },
//      查看实盘跟踪
      getTrack(index){
//          变色 #2d8cf0
        this.report = '';
        const that = this;
        let setTimeOut;
        that.myModelModal = true;
        that.myModalModalInfo = '正在获取实盘跟踪报告，请您耐心等待...';
//        手动运行实盘跟踪模型
        function getRunTrackStatus() {
          getRemoteReqTodo('/stock/track/runtrackmodel', ['modelId'], [that.trackModels[index].modelId]).then(res => {
            let data = res.data;
            if (data['status'] === 'WAITING') {
              setTimeOut = setTimeout(
                getRunTrackStatus
                , 2000);
            } else if (data['status'] === 'SUCCESS') {
              clearTimeout(setTimeOut);
              setTimeOut = setTimeout(function () {
                getTrackReport();
              }, 2000);
            } else if (data['status'] === 'ERROR') {
              that.$Notice.error({
                title: data['message']
              });
//              that.clickTrack = true;
//              that.currentModelIndex = index;
              clearTimeout(setTimeOut);
              that.myModelModal = false;
            } else {
              that.$Notice.error({
                title: '实盘跟踪报告显示异常，请重试'
              });
            }
          }).catch(() => {
            that.$Notice.error({
              title: '连接服务器异常，请重试'
            });
          })
        }

//        获取报告
        function getTrackReport() {
          getRemoteReqTodo('/stock/track/gettrackreport', ['modelId'], [that.trackModels[index].modelId]).then(res => {
            let data = res.data;
            if (data['status'] === 'RUNNING') {
              clearTimeout(setTimeOut);
              setTimeOut = setTimeout(
                getTrackReport
                , 2000);
            } else if (data['status'] === 'SUCCESS') {
//              成功获取报告
              that.report = JSON.parse(data['report']['report'].replace(/\'/g, '\"'));
              resolveIndicator(that.$store.state.selectedIndexs, that.trackModels[index].modelPara, that.$store.state.controller, that.$store.state.symbol);
              that.clickTrack = true;
              that.currentModelIndex = index;
              that.myModelModal = false;
              clearTimeout(setTimeOut);
            } else if (data['status'] === 'ERROR') {
              that.$Notice.error({
                title: data['message']
              });
              clearTimeout(setTimeOut);
              that.myModelModal = false;
            }
          })
        }

        getRunTrackStatus();
      }
    },
    components: {
      AllReport
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
