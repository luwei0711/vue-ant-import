<template>
  <div class="ant-import-finish">
    <div>
      <a-icon type="check-circle" class="ant-icon-success" />
    </div>
    <div>导入成功</div>
    <div class="ant-import-action">
      <a-button
        @click="handleFinish"
        type="primary"
        size="large"
      >查看详情</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AntImportFinish',
  data () {
    return {}
  },
  methods: {
    handleFinish () {
      this.$emit('finish')
    }
  },
  mounted () {}
}
</script>

<style>
.ant-import-finish {
  text-align: center;
}

.ant-import-finish .ant-icon-success {
  font-size: 150px;
  line-height: 1.2;
  color: #67c23a;
}
</style>
