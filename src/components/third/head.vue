<template>
  <div>
    <Row type="flex" style="height: 2rem;background-color: #2C3E50;color:#FFFFFF;margin-bottom: 5rem;font-size: 1rem">
      <i-col span="6" offset="2">
        logo
      </i-col>
      <i-col span="8" offset="8">
        <ul>
          <li><a href="">注册</a></li>
          <li><a href="">登录</a></li>
          <li><a href="">产品</a></li>
          <li><a href="">服务</a></li>
          <li><a href="">关于</a></li>
        </ul>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="20">
        <div id="head-img"></div>
      </i-col>
    </Row>
  </div>

</template>
<script>
  export default{}
</script>
<style lang="scss" rel="stylesheet" scoped>
  #head-img {
    padding: 0 5rem;
    min-height: 20rem;
    background-image: url("../../img/third.jpg");
  }

  ul {
    font-size: 1rem;
    li {
      float: left;
    }
    a {
      color: #FFFFFF;
    }
  }
</style>
