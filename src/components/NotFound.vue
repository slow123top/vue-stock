<template>
  <Row type="flex" justify="center" style="height: 45rem;text-align: center">
    <i-col span="24">
      <div class="not-found">404</div>
      <div class="page-not-found">Page Not Found</div>
      <div class="not-found-description">
        对不起,没有找到您所需要的页面,可能是URL不确定,或者页面已被移除。

      </div>
    </i-col>
    <i-col span="24">
      <Button type="primary" size="large" style="width: 10rem;font-size: 1.5rem" @click="backHome">回到首页</Button>
    </i-col>
  </Row>
</template>
<script>
  export default {
    methods: {
      backHome(){
        this.$router.push('/');
      }
    }
  }
</script>
<style scoped>
  .not-found {
    font-size: 10rem;
    font-weight: bold;
  }

  .page-not-found {
    font-size: 3rem;
  }

  .not-found-description {
    font-size: 1.5rem;
  }
</style>
