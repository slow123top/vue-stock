<template>
  <div id="app">
    <div class="layout">
      <Row type="flex">
        <i-col span="5" class="layout-menu-left">
          <i-menu theme="dark" width="auto" @on-select="aa">
            <div class="layout-logo-left">欢迎系统管理员：{{managerName}}</div>
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                上传提交












              </template>
              <Menu-item name="1-1">
                量化文章






              </Menu-item>
              <Menu-item name="1-2">
                官方公告

              </Menu-item>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                导航二













              </template>
              <Menu-item name="2-1">选项 1</Menu-item>
              <Menu-item name="2-2">选项 2</Menu-item>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                导航三













              </template>
              <Menu-item name="3-1">选项 1</Menu-item>
              <Menu-item name="3-2">选项 2</Menu-item>
            </Submenu>
          </i-menu>
        </i-col>
        <i-col span="19">
          <div class="layout-header"></div>
          <div class="layout-breadcrumb">
            <Breadcrumb>
              <Breadcrumb-item href="#">首页</Breadcrumb-item>
              <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
              <Breadcrumb-item>某应用</Breadcrumb-item>
            </Breadcrumb>
          </div>
          <div class="layout-content">
            <router-view></router-view>
          </div>
          <div class="layout-copy">
            2011-2016 &copy; 威海市千投信息技术有限公司













          </div>
        </i-col>
      </Row>
    </div>
  </div>
</template>
<script>
  import router from './router'
  export default{
    data(){
      return {
        managerName: "张三"
      }
    },
    methods: {
      aa(name){
        switch (name) {
          case '1-1':
            return router.push('/backstage/article');
            break;
          case '1-2':
            return router.push('/backstage/official');
            break;
          default:
            break;
        }


      },
      officialUpload(){
        router.push('/backstage/2/official');

      }
    },
    components: {
//      ArticleContent
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-content {
    /*min-height: 200px;*/
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    /*padding: 10px 0 20px;*/
    color: #9ea7b4;
  }

  .layout-menu-left {
    background: #464c5b;
    height: 60rem;
  }

  .layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    color: #FFFFFF;
    border-radius: 3px;
    margin: 15px auto;
  }
</style>
