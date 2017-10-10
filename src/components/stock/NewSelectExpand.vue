<template>
  <div>
    <Row class="expand-row" style="padding: 1rem;">
      <i-col span="24" style="width: 100%">
      <span>如果无法买入则按顺序购买的备用买入股票列表：</span>
      <p style="word-wrap: break-word;word-break: normal">{{ row['backup_list'] }}</p>
      </i-col>
    </Row>
  </div>
</template>
<script>
  export default {
    props: {
      row: Object
    }
  };
</script>
