<template>
  <div>
    <!--<head>-->
    <!--<title>千投</title>-->
    <!--</head>-->
    <start></start>
    <router-view></router-view>
    <end></end>
    <Back-top></Back-top>
  </div>
</template>
<script>
  import start from './components/Header'
  import end from './components/Footer'
  import $ from 'jquery'
  export default {
    components: {
      start,
      end
    }
  }
</script>
<style lang="scss" rel="stylesheet">
</style>
