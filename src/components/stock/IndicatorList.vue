<template>
  <div>
    <Menu mode="horizontal" :active-name="activeName" @on-select="select">
      <Submenu name="1">
        <template slot="title">
          入市指标组合





        </template>
        <Menu-item name="1-1">价格类指标</Menu-item>
        <Menu-item name="1-2">市值类指标</Menu-item>
        <Menu-item name="1-3">上市日期类指标</Menu-item>
        <Menu-item name="1-4">股票池筛选指标</Menu-item>
        <Menu-item name="1-5">交易量类指标</Menu-item>
        <Menu-item name="1-6">经典指标</Menu-item>
        <!--<Menu-item name="1-7">定制指标</Menu-item>-->
        <Menu-item name="1-8">我的模型入市指标组合</Menu-item>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          出市指标组合





        </template>
        <Menu-item name="2-1">价格类指标</Menu-item>
        <Menu-item name="2-2">市值类指标</Menu-item>
        <Menu-item name="2-3">上市日期类指标</Menu-item>
        <Menu-item name="2-4">股票池筛选指标</Menu-item>
        <Menu-item name="2-5">交易量类指标</Menu-item>
        <Menu-item name="2-6">经典指标</Menu-item>
        <!--<Menu-item name="2-7">定制指标</Menu-item>-->
        <Menu-item name="2-8">我的模型出市指标组合</Menu-item>
      </Submenu>
      <Submenu name="4">
        <template slot="title">
          风控指标组合





        </template>
        <Menu-item name="4-1">趋势类指标</Menu-item>
        <Menu-item name="4-2">我的模型风控指标组合</Menu-item>
      </Submenu>
      <Menu-item name="3">
        二次筛选指标





      </Menu-item>
      <!--<Submenu name="4">-->
      <!--<template slot="title">-->
      <!--风控指标-->


      <!--</template>-->
      <!--<Menu-item name="4-1">我的模型风控指标组合</Menu-item>-->
      <!--</Submenu>-->

      <!--<Menu-item style="float: right">-->
      <!--<i-select v-model="queryIndexInit" filterable placeholder="搜索选股指标,仅支持中文搜索" @on-change="queryIndexChange">-->
      <!--<i-option v-for="item1 in queryIndexs" :value="item1.value" :key="item1">-->
      <!--{{ item1.label }}-->
      <!--</i-option>-->
      <!--</i-select>-->
      <!--</Menu-item>-->
    </Menu>
    <Row type="flex" justify="center">
      <i-col span="24" style="height: 15rem;overflow:auto;background-color: #ffffff;padding: .5rem">
        <ul class="index" v-if="activeName === '1-1'">
          <li :id="indexClass.number" v-for="indexClass in indexs['price']" class="price-index" :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectIndex(indexClass.number)">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '1-2'">
          <li :id="indexClass.number" v-for="indexClass in indexs.marketValue" class="market-value-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectIndex(indexClass.number)">
              {{indexClass.message}}






            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '1-3'">
          <li :id="indexClass.number" v-for="indexClass in indexs.listingDate" class="listing-date-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectIndex(indexClass.number)">
              {{indexClass.message}}






            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '1-4'">
          <li :id="indexClass.number" v-for="indexClass in indexs.code" class="code-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectIndex(indexClass.number)">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '1-5'">
          <li :id="indexClass.number" v-for="indexClass in indexs.trade" class="trade-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectIndex(indexClass.number)">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '1-6'">
          <li :id="indexClass.number" v-for="indexClass in indexs.classic" class="classic-index" :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectIndex(indexClass.number)">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="my-model" v-if="activeName === '1-8'">
          <li v-for="(item,index) in myModels" :key="item"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectModel(index)">
              {{item.modelName}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '2-1'">
          <li :id="indexClass.number" v-for="indexClass in indexs['price']" class="price-index" :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem"
                    @click="selectIndexSell(indexClass.number,'sell')">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '2-2'">
          <li :id="indexClass.number" v-for="indexClass in indexs.marketValue" class="market-value-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem"
                    @click="selectIndexSell(indexClass.number,'sell')">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '2-3'">
          <li :id="indexClass.number" v-for="indexClass in indexs.listingDate" class="listing-date-index"
              :key="indexClass" style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem"
                    @click="selectIndexSell(indexClass.number,'sell')">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '2-4'">
          <li :id="indexClass.number" v-for="indexClass in indexs.code" class="code-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem"
                    @click="selectIndexSell(indexClass.number,'sell')">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '2-5'">
          <li :id="indexClass.number" v-for="indexClass in indexs.trade" class="trade-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem"
                    @click="selectIndexSell(indexClass.number,'sell')">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '2-6'">
          <li :id="indexClass.number" v-for="indexClass in indexs.classic" class="classic-index" :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem"
                    @click="selectIndexSell(indexClass.number,'sell')">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="my-model" v-if="activeName === '2-8'">
          <li v-for="(item,index) in myModels" :key="item"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectModelOutMarket(index)">
              {{item.modelName}}





            </Button>
          </li>
        </ul>

        <ul class="index" v-if="activeName === '4-1'">
          <li :id="indexClass.number" v-for="indexClass in indexs.windControl" class="classic-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectIndex(indexClass.number)">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
        <ul class="my-model" v-if="activeName === '4-2'">
          <li v-for="(item,index) in myModels" :key="item"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectModelWindCtrl(index)">
              {{item.modelName}}





            </Button>
          </li>
        </ul>
        <ul class="index" v-if="activeName === '3'">
          <li :id="indexClass.number" v-for="indexClass in indexs.secondaryScreen" class="classic-index"
              :key="indexClass"
              style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem">
            <Button size="large" style="width:35rem" @click="selectIndex(indexClass.number)"
                    :disabled="secondaryScreenOnlyOnce">
              {{indexClass.message}}





            </Button>
          </li>
        </ul>
      </i-col>
    </Row>

  </div>
</template>
<script>
  import {createModelIndexs, MY_MODEL_INDEXS} from '../../api/indexinfo'
  export default{
    props: {
      secondaryScreenOnlyOnce: {
        type: Boolean,
        default: false
      }
//      myModels: {
//        type: Array,
//        default: function () {
//          return [];
//        }
//      }
    },
    data(){
      return {
        activeName: '1-1',
        myModels: this.$store.state.myModels,
        indexs: createModelIndexs,
        indicators: MY_MODEL_INDEXS,
      }
    },
    methods: {
      select(name){
        this.activeName = name;
//        this.$emit('selectActiveName', name);
      },
      selectIndex(indicatorId){
        this.$store.commit('SELECT_INDICATOR', {
          indicators: this.indicators,
          indicatorId: indicatorId,
        });
      },
      selectIndexSell(indicatorId, sell){
//        标识出出市指标
        let temp = indicatorId.replace('A', sell);
//        触发vuex 选择指标
        this.$store.commit('SELECT_INDICATOR', {
          indicators: this.indicators,
          indicatorId: temp,
        });
      },
      selectModelOutMarket(index){
        this.$store.commit('SELECTMODEL', {
          modelIndex: index,
          index: index,
          number: 'MODEL' + index,
          selectModelClass: 'outMarket'
        });
      },
      selectModelWindCtrl(index){
        this.$store.commit('SELECTMODEL', {
          modelIndex: index,
          index: index,
          number: 'MODEL' + index,
          selectModelClass: 'windCtrl'
        });
      },
      selectModel(index){
        this.$store.commit('SELECTMODEL', {
          modelIndex: index,
          index: index,
          number: 'MODEL' + index,
          selectModelClass: 'intoMarket'
        });
      }
    },
    computed: {}
  }
</script>
<style rel="stylesheet">

</style>
