<template>
  <div>
    <Modal v-model="myModelModal" :mask-closable="false" width="360">
      <Spin fix size="large">
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
        <i-col span="3" style="height:100%;overflow:auto;background:#fff;border-radius:10px;padding: .5rem">
          <Row type="flex" justify="center" v-if="myModels.length"
               style="text-align: center;font-size: 1rem;">
            <i-col span="24">
              我的模型列表










            </i-col>
          </Row>
          <Row v-for="(model,index) in myModels" type="flex" justify="space-between" :key="model"
               style="box-sizing: border-box;padding: .3rem;line-height: 2">
            <i-col span="24">
              <!--:style="trackInfo[index]['style']"-->
              <Button long :style="trackInfo[index]['style']" @click="getCurrentModelReport(index)">
                {{model.modelName}}



              </Button>
            </i-col>
          </Row>
          <Row type="flex" justify="space-between" style="box-sizing: border-box;padding: .5rem">
            <i-col span="24">
              <Button type="dashed" long icon="plus-round" @click="createNewModel">
                创建新模型


              </Button>
            </i-col>
          </Row>
        </i-col>
        <i-col span="21" v-if="report" style="height:100%;overflow:auto">
          <Row type="flex" justify="center" style="background:#ffffff;padding: .5rem;border-radius: 10px 10px 0 0">
            <i-col span="24" style="text-align: right">
              <span v-if="myModels[currentModelIndex].isTracking" style="font-size: 1rem;color: #ff0000;float: left">已加入实盘跟踪</span>
              <span v-else style="font-size: 1rem;float: left">未加入实盘跟踪</span>
              <Button size="large" type="primary" icon="ios-paw" v-if="myModels[currentModelIndex].isTracking"
                      @click="getTrack">
                查看实盘跟踪报告

              </Button>
              <Button size="large" type="primary" icon="ios-paw" v-else @click="addTrack">加入实盘跟踪</Button>
              <Button size="large" type="success" icon="edit" @click="editModel">编辑</Button>
              <Button size="large" type="error" icon="trash-a" @click="deleteModel">删除</Button>
            </i-col>
          </Row>
          <AllReport :report="report" :modelName="modelName"></AllReport>
        </i-col>
      </Row>
    </transition>
  </div>
</template>
<script>
  import AllReport from './ResultChildren.vue'
  import {postRemoteReqTodo, getRemoteReqTodo} from '../../api/api'
  import {resolveIndicator} from '../../api/model'
  import {loginTimeoutPrompt, jumpLogin, descObj, ascObj} from '../../api/tools'
  export default {
    mounted(){
//          若刷新页面
      getRemoteReqTodo('/stock/mymodels', [], []).then(res => {
        if (res.data.status === 'SUCCESS') {
          this.$store.state.myModels.splice(0, this.$store.state.myModels.length);
          this.$store.commit('GET_MYMODELS', {
            returnModel: res.data.returnModel
          });
        } else if (res.data.status === 'ERROR') {
          this.$Notice.error({
            title: res.data.message
          });
        } else if (res.data.status === 'USER_NOT_FOUND') {
          jumpLogin(this);
        } else {
          this.$Notice.error({
            title: '我的模型显示异常，请重试'
          });
        }
        this.modal = true;
      }).catch(() => {
        this.$message.error('我的模型获取异常，请重试');
      });
    },
    data() {
      return {
//          模型指标转换出来的模型信息
        reportTemp: '',
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
        myModels: this.$store.state.myModels,
        currentModelIndex: 0,
        chartSize: {
          width: '100%',
          height: '20rem',
        },
        clickTrack: '',
      }
    },
    computed: {
      reportTitle(){
        return !this.clickTrack ? '单次回测报告' : '实盘跟踪报告'
      },
      modelName(){
        return this.myModels[this.currentModelIndex].modelName;
      },
//      实盘信息
      trackInfo(){
        let temp = [];
        for (let i = 0; i < this.myModels.length; i++) {
          temp.push({
            style: {
              'overflow': 'hidden',
              'text-overflow': 'ellipsis',
              'white-space': 'nowrap'
            },
            styleTrack: {}
          });

        }
        if (this.clickTrack !== '') {
          if (!this.clickTrack) {
            temp[this.currentModelIndex].style.background = '#f90';
            temp[this.currentModelIndex].style.color = '#fff';
            temp[this.currentModelIndex].styleTrack.background = '';
            temp[this.currentModelIndex].styleTrack.color = '';
          }
        }
        return temp;
      }
    },
    methods: {
      changePage (current) {
        this.currentPage = current;
      },
      getCurrentModelReport(index) {
        this.report = '';
        this.myModelModal = true;
        this.myModalModalInfo = '正在获取模型报告，请您耐心等待...';
        let modelId = this.myModels[index].modelId;
        postRemoteReqTodo('/stock/getreportbymodelid', {modelId: modelId, loopType: 0}).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
            this.report = JSON.parse(data['report']['report']);
            resolveIndicator(this.$store.state.selectedIndexs, this.myModels[index].modelPara, this.$store.state.controller, this.$store.state.symbol);
            this.clickTrack = false;
            this.currentModelIndex = index;
          } else if (data.status === 'USER_NOT_FOUND') {
            jumpLogin(this);
          } else if (data.status === 'ERROR') {
            this.$Notice.error({
              title: data['message']
            });
          } else {
            this.$Notice.error('当前模型报告显示异常，请重试');
          }
          this.myModelModal = false;
        }).catch(() => {
          this.$message.error('连接服务器异常，请重试');
        })
      },
      // 创建新模型
      createNewModel() {
        this.$store.state.selectedIndexs.splice(0, this.$store.state.selectedIndexs.length);
        this.$router.push('/model/newModel');
      },
      // 编辑模型
      editModel() {
        //          首先删除所有存在的指标
        this.$store.state.andOrNot = 'customize';
        resolveIndicator(this.$store.state.selectedIndexs, this.myModels[this.currentModelIndex].modelPara, this.$store.state.controller, this.$store.state.symbol);
        this.$router.push('/model/newModel');
      },
      // 删除模型  若模型为实盘跟踪模型  第一次是撤销实盘跟踪  之后才能删除模型
      deleteModel() {
        getRemoteReqTodo('/stock/deletemymodel', ['modelId'], [this.myModels[this.currentModelIndex].modelId]).then(res => {
          let data = res.data;
//          console.log('sss');
          if (data['status'] === 'SUCCESS') {
//            右侧模型报告消失   回归初始化
            this.myModels.splice(this.currentModelIndex, 1);
            this.report = '';
            this.clickTrack = '';
            this.currentModelIndex = 0;
          } else if (data['status'] === 'ERROR') {
            this.$Notice.error({
              title: data['message']
            })
          } else if (data.status === 'USER_NOT_FOUND') {
            loginTimeoutPrompt(this);
          } else {
            this.$Notice.error({
              title: '您的模型删除出现了异常，请重试'
            });
          }
        }).catch(() => {
          this.$Notice.error({
            title: '连接服务器出现异常，请重试'
          });
        })
      },
//    加入实盘跟踪  addTrack
      addTrack(){
        const that = this;
        let setTimeOut;
//        console.log('ads');
        function getAddTrackStatus() {
          getRemoteReqTodo('/stock/track/addtrack', ['modelId'], [that.myModels[that.currentModelIndex].modelId]).then(res => {
            let data = res.data;
//            console.log('ads');
            if (data['status'] === 'SUCCESS') {
//              加入实盘跟踪 成功
              that.myModels[that.currentModelIndex].isTracking = 1;
              clearTimeout(setTimeOut);
            } else if (data['status'] === 'ERROR') {
//            失败
              clearTimeout(setTimeOut);
              that.$Notice.error({
                title: data['message']
              });
            } else if (data['status'] === 'WAITING') {
              setTimeOut = setTimeout(
                getAddTrackStatus
                , 2000);
            } else if (data['status'] === 'USER_NOT_FOUND') {
              loginTimeoutPrompt(that);
            } else {
              that.$Notice.error({
                title: '加入实盘跟踪出现异常，请重试'
              });
            }
          }).catch(() => {
            that.$Notice.error({
              title: '加入实盘跟踪出现异常，请重试'
            });
          });
        }

        getAddTrackStatus();
      },
//撤销实盘跟踪
      cancelTrack(index){
        postRemoteReqTodo('/stock/track/canceltrack', {modelId: this.myModels[index].modelId}).then(res => {
          let data = res.data;
          if (data['status'] === 'SUCCESS') {
//              撤销实盘跟踪成功
            this.myModels[index].isTracking = 0;
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
//      查看实盘跟踪
      getTrack(){
//          变色 #2d8cf0
        this.myModelModal = true;
//        查看某一个模型的实盘跟踪报告
        this.$router.push({
          path: '/model/trackmodel',
          query: {model_sa_asd: this.myModels[this.currentModelIndex].modelId.replace(/\-/g, '%')}
        });
      },
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
