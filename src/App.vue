<template lang="pug">
  div#app
    header
      div
        h1 logo
        ul
          -var item = ['首页','产品&服务','量化投资','关于我们']
          -for (var i=0;i<4;i++)
            li=item[i]
    Swiper
</template>
<script>
  import Swiper from './components/Awesome.vue'
  export default {
    components: {
      Swiper
    }
  }
</script>
<style scoped lang="scss">
  $color: rgba(10, 105, 153, .2);
  body {
    margin: 0;
    width: 100%;
    height: 1080px;
  }

  header {
    width: 100%;
    height: 3rem;
    position: fixed;
    background-color: $color;
    z-index: 999;
  }

  h1 {
    float: left;
    margin-left: 20rem;
  }

  ul {
    float: right;
    list-style: none;
    margin-right: 10rem;
    line-height: 3rem;
    li {
      font-size: 1rem;
      float: left;
      padding: 0 1rem;
      cursor: pointer;
      color: #000000;
      &:hover {
        background-color: #FFFFFF;
      }
    }

  }


</style>
