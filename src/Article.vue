<template>
  <div>
    <article-header></article-header>
    <Row type="flex" :gutter="16" justify="center" style="height: 45rem;padding: 1rem;font-size: 1rem">
      <i-col span="3">
        <ul class="articles">
          <li><a href="" @click.prevent="aa">测试</a></li>
          <li><a href="/article?23">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
          <li><a href="#">文章一</a></li>
        </ul>
      </i-col>
      <i-col span="20">
        <!--设置路由-->
        <div v-html="articleContent"></div>
        <!--<router-view></router-view>-->
      </i-col>
    </Row>
    <article-footer></article-footer>
  </div>
</template>
<script>
  import ArticleHeader from './components/menhu/header'
  import ArticleFooter from './components/menhu/footer'
  export default {
    data(){
      return {
        articleContent: ''
      }
    },
    components: {
      ArticleHeader,
      ArticleFooter
    },
    methods: {
      aa () {
        this.$http.get("/article").then(
          (response) => {
            this.articleContent = response.body;

          }
        )
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  .articles {
    /*overflow-x: hidden;*/
    height: 100%;
    overflow: auto;
    word-wrap: break-word;
  }
</style>
