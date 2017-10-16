<template>
  <Row type="flex" justify="center" style="padding: 1rem;margin-bottom: 1rem">
    <i-col span="5" style="border-right: 1px solid;">
      <div class="model" @click="createModel">
        <div>
          <Icon type="arrow-graph-up-right" size="48" color="#5b9dde"></Icon>
        </div>
        <p>创建模型<br><span>自由构建<br>
        轻松运用与或非功能</span></p>


      </div>
    </i-col>
    <i-col span="5">
      <div class="model" @click="myModel">
        <div>
          <Icon type="ios-home" size="48" color="#5b9dde"></Icon>
        </div>
        <p>我的模型<br><span>便捷存储<br>
          灵活操作自存量化模型</span></p>
      </div>
    </i-col>
  </Row>
</template>
<script>
  import {getRandomModel} from '../../api/api'
  export default {
    methods: {
      createModel(){
        this.$store.commit('EMPTY_INDEX');
        getRandomModel(this.$store.state.selectedIndexs,this);
        this.$router.push('model');
      },
      myModel(){
        this.$router.push('/model/myModel');
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  .model {
    /*background-color: #3f913f;*/
    margin: auto;
    width: 100%;
    height: 16rem;
    float: left;
    cursor: pointer;
    transition: 500ms;
    div {
      width: 3rem;
      height: 3rem;
      margin: auto;
    }
    p {
      text-align: center;
      font-size: 1.5rem;
      color: #000000;
      span {

        color: #657180;
      }
    }

    &:hover {
      background-color: #e5e5e5;
    }
  }
</style>
