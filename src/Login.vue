<template>
  <div class="login">
    <login-header></login-header>
    <Login></Login>
    <login-footer></login-footer>
  </div>

</template>
<script>
  import LoginHeader from 'components/menhu/header'
  import Login from 'components/user/login'
  import LoginFooter from 'components/menhu/footer'
  export default {
    components: {
      LoginHeader,
      Login,
      LoginFooter
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>

  /*.login{*/
    /*min-height: 40rem;*/
  /*}*/
</style>
