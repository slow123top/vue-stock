<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row type="flex">
      <i-col :span="spanLeft" class="layout-menu-left">
        <Menu active-name="1" theme="dark" width="auto">
          <div class="article-search">
            <Input placeholder="请输入文章关键字" style="width: 300px"></Input>
          </div>
          <Menu-item name="1">
            <span class="layout-text" @click="">上穿均线上穿均线上穿均线</span>
          </Menu-item>
          <Menu-item name="2">
            <span class="layout-text">文章二</span>
          </Menu-item>
          <Menu-item name="3">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="4">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="5">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="6">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="7">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="8">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="9">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="10">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="11">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="12">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="13">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="14">
            <span class="layout-text">文章三</span>
          </Menu-item>
          <Menu-item name="15">
            <span class="layout-text">文章三</span>
          </Menu-item>
        </Menu>
      </i-col>
      <i-col :span="spanRight">
        <router-view>

        </router-view>
      </i-col>
    </Row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        spanLeft: 5,
        spanRight: 19
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft === 5 ? 14 : 24;
      }
    },
    methods: {
      toggleClick () {
        if (this.spanLeft === 5) {
          this.spanLeft = 2;
          this.spanRight = 22;
        } else {
          this.spanLeft = 5;
          this.spanRight = 19;
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 3rem;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  .layout-menu-left {
    background: #464c5b;
  }

  .layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-hide-text .layout-text {
    display: none;
  }

  .ivu-col {
    transition: width .2s ease-in-out;
  }

  .layout-ceiling {
    width: 100%;
    background: rgba(70, 76, 91, .5);
    position: fixed;
    padding: 10px 0;
    /*overflow: hidden;*/
    z-index: 10;
  }

  .layout-ceiling-main {
    color: #FFFFFF;
    float: right;
    margin-right: 10rem;
    font-size: 1rem;
  }

  .article-search {
    height: 3rem;
  }

  /*.layout-ceiling-main a {*/
  /*color: #FFFFFF;*/
  /*}*/
</style>
