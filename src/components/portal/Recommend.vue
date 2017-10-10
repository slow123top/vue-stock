<template>
  <div class="recommend">
    <Row type="flex" justify="center" style="text-align: center;font-size: 1.5rem">
      <i-col span="15">
        推荐模型
      </i-col>
    </Row>
    <Row :gutter="16" type="flex" justify="start" align="bottom" style="margin-top: 1rem">
      <i-col :md=12 :lg=8>

        <good-model :title="title1"></good-model>

      </i-col>
      <i-col :md=12 :lg=8>
        <good-model :title="title2"></good-model>

      </i-col>
      <i-col :md=12 :lg=8>
        <good-model :title="title3"></good-model>

      </i-col>
      <i-col :md=12 :lg=8>
        <good-model :title="title4"></good-model>
      </i-col>
      <i-col :md=12 :lg=8>
        <a href="#">>>查看更多好模型</a>
      </i-col>
    </Row>


  </div>

</template>
<script>
  import GoodModel from './GoodModel'

  export default{
    components: {
      GoodModel,

    },
    data(){
      return {
        title1: "长阳短柱",
        title2: "模型2号",
        title3: "模型3号",
        title4: "模型三号"
      }
    }
  }
</script>
<style scoped>
  .recommend {
    padding: 1rem 5rem;
    /*background-color: #FFFFFF;*/
  }
</style>
