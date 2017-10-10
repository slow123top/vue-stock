<template>
  <Row type="flex" justify="center" style="width: 100%">
    <i-col span="3">
      <i-menu width="auto" @on-select="selectTitle">
        <Menu-item name="question">
        <Icon type="help-circled"></Icon>
        <span class="layout-text">常见问题</span>
        </Menu-item>
        <Menu-item name="guide">
        <Icon type="arrow-right-c"></Icon>
        <span class="layout-text">新手指南</span>
        </Menu-item>
        <Menu-item name="about">
        <Icon type="ios-people"></Icon>
        <span class="layout-text">关于我们</span>
        </Menu-item>
        <Menu-item name="company-statement">
        <Icon type="playstation"></Icon>
        <span class="layout-text">公司声明</span>
        </Menu-item>
      </i-menu>
    </i-col>
    <i-col span="21" style="padding: 1rem;background-color: #e3e8ee">
      <div>
      <router-view></router-view>
      </div>
    </i-col>
  </Row>
</template>
<script>
  export default {
    data(){
      return {
        modal: false,
        title: '常见问题'
      }
    },
    computed: {
      activeName(){
        let routePath = this.$route.path;
        if (routePath === '/help/companystate') {

          return 'company-statement';
        } else if (routePath === '/help/question') {
          return 'question'
        } else if (routePath === '/help/guide') {
          return 'guide'
        } else if (routePath === '/help/about') {
          return 'about'
        }
      }
    },
    methods: {
      selectTitle(name){
        switch (name) {
          case 'company-statement':
            this.$router.push('/help/companystate');
            break;
          case 'question':
//            this.modal = true;
            this.$router.push('/help/question');
            break;
          case 'guide':
//            this.modal = true;
            this.$router.push('/help/guide');
            break;
          case 'about':
//            this.modal = true;
            this.$router.push('/help/about');
            break;
          default:
            break;
        }
      },
      openChange(name){
        let isQuestion = name.some(function (item, index) {
          return item === 'question' && index === name.length - 1;
        });
        let isGuide = name.some(function (item, index) {
          return item === 'guide' && index === name.length - 1;
        });
        let isAbout = name.some(function (item, index) {
          return item === 'about' && index === name.length - 1;
        });
        let isState = name.some(function (item, index) {
          return item === 'company-statement' && index === name.length - 1;
        });
        if (isQuestion) {
          this.activeName = ['question'];
        } else if (isGuide) {
          this.activeName = ['guide'];
        } else if (isAbout) {
          this.activeName = ['about'];
        } else if (isState) {
          this.activeName = ['company-statement'];
        }
      }
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>
  .title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .transition {
    &:nth-of-type(1) {
      * {
        margin-top: .5rem;
      }

      h1 {
        color: #2d8cf0;
      }

      p {
        font-size: 1rem;
      }

      .explain {
        &:before {
          content: '注:';
          font-weight: bold;
        }
        /*margin-left: 1rem;*/
        color: #FF0000;
      }

      ul {
        margin-left: 3rem;
        font-size: 1rem;
        list-style: disc;
      }
    }
    &:nth-of-type(2) {
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
    }
    &:nth-of-type(3) {
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
    }
    &:nth-of-type(4) {
      p {
        font-size: 1rem;
        font-weight: bold;
      }
      ol {
        margin-left: 1rem;
        list-style: decimal;
        font-size: 1rem;
      }
      li {
        margin-top: .5rem;
      }
    }
  }
</style>
