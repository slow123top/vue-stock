<template>
  <i-form ref="formValidate" :label-width="60">
    <Form-item label="公告标题" prop="name">
      <Input placeholder="请输入公告标题"></Input>
    </Form-item>
    <Form-item label="公告内容" prop="passwd" style="margin-bottom: 0">
      <VueUEditor :randomId="randomId" :ueditorConfig="editorConfig" style="line-height: 1;height: 30rem"></VueUEditor>
    </Form-item>
    <Form-item style="margin-top: 1rem;text-align: center">
      <Button type="primary">提交</Button>
    </Form-item>
  </i-form>
</template>
<script>
  import VueUEditor from 'vue-ueditor'
  export default{
    data(){
      return {
        randomId: 'editor_' + (Math.random() * 100000000000000000),
        editorConfig: {
          scaleEnabled: true,
          //启用自动保存
//          enableAutoSave: false,
          //自动保存间隔时间， 单位ms
//          saveInterval: 0
        }
      }
    },
    components: {
      VueUEditor
    },
    methods: {
      aa(){
        setTimeout(function () {
          UE.getEditor(this.randomId).execCommand('drafts');
        }, 500);
        console.log(UE.getEditor(this.randomId).getContent());
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet" scoped>

</style>
