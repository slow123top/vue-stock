<template>
  <Row type="flex" justify="center" style="padding: 1rem 0">
    <Button type="info" style="font-size: 1.5rem" @click="register">立即注册</Button>
  </Row>
</template>
<script>
  export default {
      methods:{
        register(){
          this.$router.push('/register');
        }
      }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>

</style>
