<template>
  <div style="width:100%;background:#f5f7f9">
    <Affix :offset-top="100" style="position: absolute;z-index:20000;">
      <Tooltip placement="right-start" style="padding:0">
        <Button type="primary" icon="chevron-right"></Button>
        <div class="api" slot="content" style="font-size:14px;">
          <i-menu theme="dark" width="auto" @on-select="selectTitle" :active-name="activeName">
            <Menu-item name="create-model">
              <Icon type="arrow-graph-up-right"></Icon>
              <span>创建模型</span>
            </Menu-item>
            <Menu-item name="model-storage">
              <Icon type="home"></Icon>
              <span>模型仓库</span>
            </Menu-item>
            <Menu-item name="my-model">
              <Icon type="ios-home"></Icon>
              <span>我的模型</span>
            </Menu-item>
            <Menu-item name="once-test">
              <Icon type="ios-analytics"></Icon>
              <span>单次回测记录</span>
            </Menu-item>
            <Menu-item name="intelligent-test">
              <Icon type="outlet"></Icon>
              <span>智能回测记录</span>
            </Menu-item>
            <Menu-item name="rule-talk" v-if="!$store.state.user.userType">
              <Icon type="outlet"></Icon>
              <span>规则议会模型</span>
            </Menu-item>
          </i-menu>
        </div>
      </Tooltip>
    </Affix>
    <Row type="flex" justify="start">
      <i-col span="24" style="padding:1rem;min-height:40rem">
        <router-view></router-view>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import {getRandomModel} from '../../api/api'
  export default {
    data() {
      return {}
    },
    computed: {
      activeName() {
        if (this.$route.path === '/model/history') {
          return 'once-test';
        } else if (this.$route.path === '/model/myModel') {

          return 'my-model';
        } else if (this.$route.path === '/model/newModel') {
          return 'create-model';
        } else if (this.$route.path === '/model/genetictest') {
          return 'intelligent-test';
        } else if (this.$route.path === '/model/modelstorage') {
          return 'model-storage';
        }  else if (this.$route.path === '/model/ruletalk') {
          return 'rule-talk';
        }else {
          return 'create-model';
        }
      },
    },
    methods: {
      selectTitle(name) {
        switch (name) {
          case 'create-model':
            getRandomModel(this.$store.state.selectedIndexs, this);
            this.$router.push('/model/newModel');
            break;
          case 'my-model':
            this.$store.state.model.isRun = false;
            this.$router.push('/model/myModel');
            break;
          case 'once-test':
            this.$router.push('/model/history');
            break;
          case 'intelligent-test':
            this.$router.push('/model/genetictest');
            break;
          case 'model-storage':
            this.$router.push('/model/modelstorage');
            break;
          case 'rule-talk':
            this.$router.push('/model/ruletalk');
            break;
          default:
            break;
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-ceiling {
    width: 100%;
    background: rgba(70, 76, 91, .2);
    position: fixed;
    z-index: 10;
  }

  .layout-logo {
    border-radius: 3px;
    float: left;
    margin-left: 10rem;
    img {
      width: 12rem;
    }
  }

  .layout-nav {
    margin-left: 10rem;
    float: left;
  }

  .layout-content {
    min-height: 45rem;
    margin-top: 1rem;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-menu-left {
    background: #464c5b;
  }

  .layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .ivu-poptip-inner > .ivu-poptip-body {
    padding: 0;
  }
</style>
