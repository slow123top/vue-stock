<template>
  <transition name="el-zoom-in-top">
    <div v-show="modal">
      <banner></banner>
      <model-feature></model-feature>
      <!--<vArticle></vArticle>-->
      <!--<platform></platform>-->
      <!--<recommend></recommend>-->
      <guide></guide>
      <!--<other></other>-->
    </div>
  </transition>
</template>
<script>
  import   banner        from './Banner'
  import ModelFeature from './ModelFeature'
  import platform     from './Platform'
  import vArticle      from './Article'
  import recommend     from './Recommend'
  //  import other            from './Other'
  import guide from './Guide'
  export default {
    mounted(){
      this.modal = true;
    },
    data(){
      return {
        modal: false,
      }
    },
    components: {
      banner,
      ModelFeature,
      platform,
      vArticle,
      recommend,
//      other,
      guide
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>

</style>
