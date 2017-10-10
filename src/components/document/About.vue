<template>
  <transition name="el-zoom-in-top">
    <Row type="flex" justify="center" v-show="modal"
         style="height:45rem;background-color: #fff;padding: 1rem;border-radius: 10px">

      <i-col span="16">
        <p class="title">关于我们</p>
        <p>近年中国A股市场跌拓起伏，折戟沉沙者众多。冷静分析发现，股票投资的根本在于优质模型的发现、回测和实战。于是就有了千投量化，致力于为A股投资者提供一个可视化、公式化、智能化的量化模型生成与回测平台。



        <p>
          平台的最大特色是指标取值配置灵活、回测区间可动态调整、支持智能回测、计算速度快、UI交互性强、易操作、开放性好。</p>
        <p>
          一群交叉具备高性能并行计算背景、机器学习领域背景、十多年量化投资经验以及能够持续开发强大模型能力的匠人，怀揣为投资者提供简洁但强大武器的梦想，全力打造“千投量化”。为投资者提供工具层面和算法层面的多重优质服务，帮助投资者进行科学武装，让投资者在内在和外在上得到提升。我们与广大客户一起分享成长的喜悦。
        </p>
        <p class="foot">千投量化<br>2017年7月</p>
      </i-col>
      <i-col span="16">
        <p class="title">联系我们</p>
        <p><span style="font-weight: bold">邮箱：</span>info@hitqt.com</p>
      </i-col>
    </Row>
  </transition>
</template>
<script>
  export default{
    data(){
      return {
        modal: true
      }
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>
  p {
    font-size: 1rem;
    line-height: 2;
    margin-top: 1rem;
    /*text*/
    /*font-weight: bold;*/
  }

  .title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .foot {
    float: right;
  }
</style>

