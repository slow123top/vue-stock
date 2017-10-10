<template>
  <div class="register">
    <login-header></login-header>
    <Register></Register>
    <login-footer></login-footer>
  </div>

</template>
<script>
  import LoginHeader from 'components/menhu/header'
  import Register from 'components/user/register'
  import LoginFooter from 'components/menhu/footer'
  export default {
    components: {
      LoginHeader,
      Register,
      LoginFooter
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>

  /*.login{*/
  /*min-height: 40rem;*/
  /*}*/
</style>
