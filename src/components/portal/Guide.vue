<template>
  <Row type="flex" justify="center">
    <i-col span="12" style="padding: 1rem">
      <Row type="flex" justify="center">
        <i-col span="10">
          <hr>
        </i-col>
        <i-col span="4">
          <p style="text-align: center;font-size: 1.5rem;margin-top: -1rem">新手导航</p>
        </i-col>
        <i-col span="10">
          <hr>
        </i-col>
      </Row>
    </i-col>
    <i-col span="18" style="padding: 1rem">
      <Row type="flex" justify="center">
        <i-col span="2" style="text-align: center">
            <Icon type="person-add" size="56" style="color: #2d8cf0"></Icon>
          <p>注册</p>
        </i-col>
        <i-col span="1">
          <Icon type="ios-arrow-thin-right" size="56"></Icon>
        </i-col>
        <i-col span="2" style="text-align: center">
          <Icon type="arrow-graph-up-right" size="56" style="color: #2d8cf0"></Icon>
            <!--<Icon type="settings" ></Icon>-->
          <p>创建模型</p>
        </i-col>
        <i-col span="1">
          <Icon type="ios-arrow-thin-right" size="56"></Icon>
        </i-col>
        <!--<Icon type="ios-arrow-thin-right"></Icon>-->
        <i-col span="2" style="text-align: center">
          <Icon type="gear-b" size="56" style="color: #2d8cf0"></Icon>
            <!--<Icon type="laptop" size="56"></Icon>-->
         <p>回测</p>
        </i-col>
        <i-col span="1">
          <Icon type="ios-arrow-thin-right" size="56"></Icon>
        </i-col>
        <i-col span="2" style="text-align: center">
          <Icon type="bookmark" size="56" style="color: #2d8cf0"></Icon>
          <p>保存模型</p>
        </i-col>
        <i-col span="1">
          <Icon type="ios-arrow-thin-right" size="56"></Icon>
        </i-col>
        <i-col span="2" style="text-align: center">
          <Icon type="ios-home" size="56" style="color: #2d8cf0"></Icon>
          <p>我的模型</p>
        </i-col>
        <i-col span="1">
          <Icon type="ios-arrow-thin-right" size="56"></Icon>
        </i-col>
        <i-col span="2" style="text-align: center">
          <Icon type="ios-paw" size="56" style="color: #2d8cf0"></Icon>
          <p>实盘跟踪</p>
        </i-col>
      </Row>
    </i-col>
  </Row>
</template>
<script>

  export default {}
</script>
<style rel="stylesheet" lang="scss" scoped>
  .icon {
    width: 5rem;
    height: 5rem;
    margin: auto;
    /*border: 2px solid;*/
    /*border-radius: 50%;*/
  }
  p {
    /*text-align: center;*/
    font-size: 1.2rem;
  }
</style>
