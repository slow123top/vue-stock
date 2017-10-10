<template>
  <div style="width:100%;background:#f5f7f9">
    <start></start>
    <Affix :offset-top="20">
      <Poptip trigger="hover" placement="right-start" style="padding:0">
        <Button type="info" shape="circle" icon="chevron-right">
        </Button>
        <div class="api" slot="content" style="font-size:14px;padding:0">
          <i-menu width="auto" @on-select="selectTitle" :active-name="activeName">
            <Menu-item name="1">
              <Icon type="arrow-graph-up-right"></Icon>
              <span>回测历史</span>
            </Menu-item>
            <Menu-item name="2">
              <Icon type="ios-home-outline"></Icon>
              <span>我的模型</span>
            </Menu-item>
            <Menu-item name="3">
              <Icon type="ios-analytics"></Icon>
              <span>创建模型</span>
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
    <end></end>
  </div>
</template>
<script>
  import start from './components/menhu/header'
  import end from './components/menhu/footer'
  export default {
    // store,
    data() {
      return {
        spanLeft: 4,
        spanRight: 20
      }
    },
    computed: {
      iconSize() {
        return this.spanLeft === 4 ? 14 : 24;
      },
      activeName() {
        if (this.$route.path === '/newModel') {
          return '3';
        } else if (this.$route.path === '/myModel') {
          return '2';
        } else if (this.$route.path === '/history') {
          return '1';
        } else {
          return '3';
        }
      }

    },
    methods: {

      selectTitle(name) {
        switch (name) {
          case '1':
            this.$router.push('/model/history');
            break;
          case '2':
            this.$router.push('/model/myModel');
            break;
          case '3':
            this.$store.state.selectedIndexs.splice(0, this.$store.state.selectedIndexs.length);
            this.$router.push('/newModel');
            break;

        }
      }
    },
    components: {
      start,
      end
    }
  }
</script>
<style lang="scss" rel="stylesheet">
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-ceiling {
    width: 100%;
    background: rgba(70, 76, 91, .2);
    position: fixed;
    /*padding: 10px 0;*/
    /*overflow: hidden;*/
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
    /*margin: 0 auto;*/
  }

  .layout-content {
    min-height: 45rem;
    margin-top: 1rem;
    /*overflow: hidden;*/
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
