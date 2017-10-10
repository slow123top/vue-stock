<template>
  <transition name="el-zoom-in-top">
    <Row type="flex" justify="center" v-show="modal"
         style="padding: 1rem 5rem 1rem 1rem;background-color: #fff;border-radius: 10px">
      <i-col span="24">
        <p class="title">重要说明</p>
      </i-col>
      <i-col span="24">
        <section>
          <h2>1.单次回测卡</h2>
          <p class="content">单次回测卡可用于回测消费使用，有以下几点说明：</p>
          <ul>
            <li><router-link to="/personalInfo/buycard">购买回测卡</router-link>之前，请先<router-link to="/login">登录</router-link>。</li>
            <li>购买回测卡仅限于点数购买，若您的点数不足，请先<router-link to="/personalInfo/recharge">充值</router-link>点数。</li>
            <li>用户只能拥有一种类型的回测卡。</li>
            <li>单次回测卡可以升级和续费。</li>
          </ul>
          <h3>下图中是关于购买单次回测卡详情说明：</h3>
          <img src="../../img/buycard.png" alt="购买单次回测卡图示">
        </section>
        <section>
          <h2>2.指标</h2>
          <!--<Icon type="record" color="#80848f" size="24"></Icon>-->
          <!--选股指标，至少选一个-->
          <!--&lt;!&ndash;3091f2&ndash;&gt;-->
          <!--<Icon type="record" color="#3091f2" size="24"></Icon>-->
          <!--二次筛选指标，必选一个-->
          <!---->
          <!--&lt;!&ndash;#3091f2 #19be6b #FF9933&ndash;&gt;-->
          <!--<Icon type="record" color="#19be6b" size="24"></Icon>-->
          <!--风控指标，可选一个或不选-->
          <!--<Icon type="record" color="#FF9933" size="24"></Icon>-->
          <!--我的模型，可与其他指标和模型自由组合-->

          <p class="content"><span style="font-weight:bold;color: #80848f">选股指标（灰色）：</span><span>包括价格类指标到经典类指标，与我的模型至少要选择一个；</span>
          </p>
          <p class="content"><span style="font-weight:bold;color: #3091f2">二次筛选指标（蓝色）：</span><span>您必须选择一个；</span></p>
          <p class="content"><span style="font-weight:bold;color: #19be6b">风控指标（绿色）：</span><span>您可选可不选，若选择只能选择一个</span>
          </p>
          <p class="content"><span style="font-weight:bold;color: #FF9933">我的模型（橙色）：</span><span>也就是已经保存的模型，与选股指标至少选择一个。我的模型通过与或非功能，可以和其他任意选股指标或者模型自由组合。</span>
          </p>
        </section>
        <section>
          <h2>3.回测区间</h2>
          <p class="content">回测区间，即回测起点与回测终点的时间差。</p>
          <p class="content">回测起点最早可以从<span style="color: #ff0000">2016-01-04</span>开始。</p>
          <p class="content">回测终点最晚可以到最新的一天，是动态变化的。</p>
        </section>
        <section>
          <h2>4.回测计费</h2>
          <p class="content">如果回测区间（回测起点与回测终点的时间差）是在1年以内，则回测既不会使用回测卡也不会消耗点数。</p>
          <p class="content">如果回测区间（回测起点与回测终点的时间差）是大于1年，并且用户拥有回测卡或者点数，则回测选择其中一种消费。</p>
          <ul>
            <li>使用回测卡说明：回测区间不超过回测卡允许的时间范围。比如单次5年回测卡，回测区间不超过5年可以使用。此时将不再消费点数。</li>
            <li>消费点数说明：消费的点数等于回测区间的上取整年数，比如回测区间是2年，则消费2个点数；回测区间是5年多不超过6年，则消费6个点数。</li>
          </ul>
          <p class="content">如果回测区间（回测起点与回测终点的时间差）是大于1年，并且用户没有回测卡和点数，需要先充值再回测。</p>
        </section>
        <section>
          <h2>5.千投量化支持的浏览器</h2>

          <p class="content">千投量化建议用户使用chrome谷歌浏览器，也支持Opera、Firefox、搜狗、QQ、百度、UC、360等最新版本的浏览器；支持IE10及其以上版本的浏览器。</p>
        </section>
      </i-col>
      <i-col span="24">
        <p class="title">回测简易流程</p>
      </i-col>
      <i-col span="24" style="border-top: 2px solid">
        <section>
          <h2>1.创建模型。选择指标,把所有条件填写完整后,运行回测</h2>
          <img src="../../img/create.png" alt="创建模型流程和回测">
        </section>
        <section>
          <h2>2.回测结果</h2>
          <img src="../../img/testresult.png" alt="回测结果">
        </section>
        <section>
          <h2>3.我的模型</h2>
          <h3>(1)首先要进入我的模型页面</h3>
          <div>
            <img src="../../img/mymodel.png" alt="进入我的模型">
          </div>
          <h3>(2)我的模型页面,查看已保存模型的回测结果</h3>
          <div>
            <img src="../../img/modelresult.png" alt="模型回测结果">
          </div>
        </section>
        <section>
          <h2>4.加入实盘跟踪</h2>
          <h3>(1)首先加入实盘</h3>
          <div>
            <img src="../../img/addtrack.png" alt="加入实盘跟踪">
          </div>
          <h3>(2)查看实盘跟踪结果</h3>
          <div>
            <img src="../../img/trackresult.png" alt="实盘跟踪结果">
          </div>
        </section>
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
  * {
    line-height: 2;
  }

  p.title {
    font-size: 1.5rem;
    /*font-weight: bold;*/
    text-align: center;
  }

  p.content {
    font-size: 1rem;
  }

  h3 {
    color: #000000;

  }

  h3 {
    color: #000000;
  }

  img {
    width: 100%;
  }

  ul {
    font-size: 1rem;
    margin-left: 1rem;
    list-style: disc;
    color: #ff0000;
  }
</style>

