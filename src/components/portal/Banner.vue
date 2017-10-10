<template>
  <div>
    <el-carousel trigger="click" height="35rem" :interval="10000">
      <el-carousel-item>
        <Row class="layout-banner" type="flex" justify="center">
          <i-col span="24" style="text-align: center;font-size: 2rem;color: #FFFFFF;margin-bottom: 10rem">
            <!--Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif-->
            <span style="font-family: sans-serif;font-size: 3rem;">千投量化平台</span><br>
            <span style="font-size: 1.5rem">专注打造科学量化模型，让更多人享受量化果实</span>
          </i-col>
          <i-col span="5" style="text-align: center">
            <Button type="success" size="large" style="width: 10rem;font-size: 1.2rem" @click="createModel">创建模型
            </Button>
          </i-col>
          <i-col span="5" style="text-align: center">
            <Button type="primary" size="large" style="width: 10rem;font-size: 1.2rem" @click="getMyModels">我的模型
            </Button>
          </i-col>
        </Row>
      </el-carousel-item>
      <el-carousel-item>
        <Row class="layout-banner2" type="flex" justify="center">
          <i-col span="24" style="text-align: center;font-size: 2rem;color: #FFFFFF;margin-bottom: 10rem">
            <span style="font-family: sans-serif;font-size: 3rem;">单次回测卡</span><br>
            <span style="font-size: 1.5rem">一次购买，无限回测，按年购买更有好礼享不停</span>
          </i-col>
          <i-col span="5" style="text-align: center">
            <Button type="primary" size="large"
                    style="width: 10rem;font-size: 1.2rem;background: transparent;border: 1px solid #ffffff"
                    @click="guide">了解详情
            </Button>
          </i-col>
        </Row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
  import {BASE_API_URL} from '../../api/api'
  export default {
    data(){
      return {}
    },
    methods: {
      createModel(){
//            创建模型
        if (this.$store.state.user.isLogin) {
          this.$store.commit('EMPTY_INDEX');
          this.$router.push('/model');
        } else {
          this.$router.push('/login');
        }
      },
      getMyModels(){
        if (this.$store.state.user.isLogin) {
          this.$router.push('/model/myModel');
        } else {
          this.$router.push('/login');
        }
      },
      guide(){
        this.$router.push('/help/guide');
      }
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>
  .layout-banner {
    background: url('../../img/banner.png');
    background-repeat: no-repeat;
    min-height: 35rem;
    padding: 5rem 0;
  }

  .layout-banner2 {
    @extend .layout-banner;
    background: url("../../img/banner2.png");
  }

  .slogan {
    width: 30rem;
    margin: auto;
    font-size: 3rem;
    color: #FFFFFF;
    p {
      text-align: center;
    }
  }

  .description {
    width: 30rem;
    margin: auto;
  }

  hr {
    border: 5px solid;
    width: 5rem;
    margin: auto;
  }
</style>
