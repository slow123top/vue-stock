<template>
  <div>
    <!--<head>-->
    <!--<title>千投</title>-->
    <!--</head>-->
    <start></start>
    <router-view></router-view>
    <end></end>

    <Poptip trigger="hover" placement="left" width="200" style="position: fixed;bottom:150px;right: 20px;z-index: 999;">
      <Avatar shape="square" icon="person-stalker" size="large" style="width:45px;background-color: rgba(45, 140, 240,.8);"/>
      <div slot="content" style="text-align: center">
        <p class="t-weight">欢迎加入千投量化QQ群</p>
        <p class="t-weight">643033887</p>
        <img src="./img/hitqtqq.jpg" alt="千投量化公众号">
      </div>
    </Poptip>
    <Poptip trigger="hover" placement="left" width="200" style="position: fixed;bottom:100px;right: 20px;z-index: 999;">
      <Avatar shape="square" icon="chatbubbles" size="large" style="width:45px;background-color: rgba(45, 140, 240,.8)"/>

      <div slot="content" style="text-align: center">
        <p class="t-weight">扫一扫千投量化微信公众号</p>
        <img src="./img/public.jpg" alt="千投量化公众号">
      </div>
    </Poptip>
    <Back-top :right="20" :bottom="55"></Back-top>
  </div>
</template>
<script>
  import start from './components/Header'
  import end from './components/Footer'
  export default {
    components: {
      start,
      end
    },
    methods: {
      weixin(){
        return false;
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>
  img {
    width: 90%;
    height: 90%;
  }

  .t-weight {
    font-weight: bold;
  }
</style>
