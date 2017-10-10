<template>
  <div style="width:100%;background:#f5f7f9">
    <Affix :offset-top="100" style="position: absolute;z-index:999;">
      <Poptip placement="right-start" trigger="hover" style="padding:0">
        <Button type="info" shape="circle" icon="chevron-right">
        </Button>
        <div class="api" slot="content" style="font-size:14px;">
          <i-menu theme="dark" width="auto" @on-select="selectTitle" :active-name="activeName">
            <Menu-item name="1">
              <Icon type="arrow-graph-up-right"></Icon>
              <span>创建模型</span>
            </Menu-item>
            <Menu-item name="2">
              <Icon type="ios-home"></Icon>
              <span>我的模型</span>
            </Menu-item>
            <Menu-item name="3">
              <Icon type="ios-analytics"></Icon>
              <span>单次回测记录</span>
            </Menu-item>
            <Menu-item name="4" v-if="$store.state.user.userType===0">
              <Icon type="outlet"></Icon>
              <span>智能回测记录</span>
            </Menu-item>
          </i-menu>
        </div>
      </Poptip>
    </Affix>
    <Row type="flex" justify="start">
      <i-col span="24" style="padding:1rem;min-height:40rem">
        <router-view></router-view>
      </i-col>
    </Row>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    computed: {
      activeName() {
        if (this.$route.path === '/model/history') {
          return '3';
        } else if (this.$route.path === '/model/myModel') {

          return '2';
        } else if (this.$route.path === '/model/newModel') {
          return '1';
        } else if (this.$route.path === '/model/genetictest') {
          return '4';
        } else {
          return '1';
        }
      },
    },
    methods: {
      selectTitle(name) {
        switch (name) {
          case '1':
            this.$store.state.selectedIndexs.splice(0, this.$store.state.selectedIndexs.length);
            this.$router.push('/model/newModel');
            break;
          case '2':
            this.$store.state.model.isRun = false;
            this.$router.push('/model/myModel');
            break;
          case '3':
            this.$router.push('/model/history');
            break;
          case '4':
            this.$router.push('/model/genetictest');
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
