<template>

  <VueUEditor :ueditorConfig="editorConfig" style="line-height: 1;height: 30rem"></VueUEditor>

</template>
<script>
  import VueUEditor from 'vue-ueditor'
  export default{
    data(){
      return {
        editorConfig: {
          scaleEnabled: true
        }
      }
    },
    components: {
      VueUEditor
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>

</style>
