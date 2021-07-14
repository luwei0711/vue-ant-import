<template>
  <div>
    <a-modal :title="title" :visible="visible" :width="dialogWidth" @close="handlClose" append-to-body v-if="visible"
      :footer="null">
      <a-steps :current="currentStep">
        <a-step title="下载模板" />
        <a-step title="上传文件" />
        <a-step title="确认数据" />
        <a-step title="完成" />
      </a-steps>
      <!-- 下载模板 -->
      <ant-import-download :filepath="filepath" :mustdownload="mustdownload" v-if="currentStep === 0" />

      <!-- 上传Excel -->
      <ant-import-upload :fields="fields" :tips="tips" @upload="handleUpload" v-if="currentStep === 1" />

      <!-- 数据展示 -->
      <ant-import-data :append="append" :fields="fields" :formatter="formatter" :request-fn="requestFn" :rules="rules"
        :table-data="tableData" @pre="handleStep3Pre" v-if="currentStep === 2" />

      <!-- 导入结束 -->
      <ant-import-finish @finish="handleFinish" v-if="currentStep === 3" />
    </a-modal>
  </div>
</template>

<script>
  import AntImportDownload from './components/AntImportDownload'
  import AntImportUpload from './components/AntImportUpload'
  import AntImportData from './components/AntImportData'
  import AntImportFinish from './components/AntImportFinish'

  export default {
    name: 'AntImport',
    props: {
      // 文件路径
      filepath: {
        type: String,
        required: true
      },
      mustdownload: {
        type: Boolean,
        required: true
      },
      // 请求方法
      requestFn: {
        type: Function,
        required: true
      },
      // 导入字段
      fields: {
        type: Object,
        required: true
      },
      // 是否显示弹窗
      visible: {
        type: Boolean,
        required: true
      },
      // 标题
      title: {
        type: String,
        default: '批量导入'
      },
      // 增加附加数据
      append: Object,
      // 提示信息，数组
      tips: Array,
      // 验证规则
      rules: Object,
      // 格式化数据
      formatter: {
        type: Object,
        validator(formatter) {
          for (const key in formatter) {
            if (!(formatter[key] instanceof Object)) {
              // eslint-disable-next-line
              console.error(`${key}的值必须为 对象 或 函数`)
              return false
            }
          }
          return true
        }
      },
      // 弹窗宽度
      dialogWidth: {
        type: String,
        default: '80%'
      }
    },
    components: {
      AntImportData,
      AntImportUpload,
      AntImportFinish,
      AntImportDownload
    },
    provide() {
      return {
        goPre: this.preStep,
        goNext: this.nextStep
      }
    },
    data() {
      return {
        tableData: [],
        columns: [],
        currentStep: 0
      }
    },
    methods: {
      // 上传
      handleUpload(columns, tableData) {
        this.columns = columns
        this.tableData = tableData
      },
      // 初始化数据
      initData() {
        this.tableData = []
        this.columns = []
        this.currentStep = 0
      },
      // 关闭
      handlClose() {
        this.initData()
        this.$emit('close')
        this.$emit('update:visible', false)
      },
      // 结束
      handleFinish() {
        this.handlClose()
        this.$emit('finish')
      },
      // 下一步
      nextStep() {
        this.currentStep++
      },
      // 上一步
      preStep() {
        this.currentStep--
      },
      // 第3步 -> 第2步
      handleStep3Pre() {
        this.tableData = []
        this.columns = []
        this.preStep()
      }
    },
    mounted() {}
  }
</script>

<style>
  .ant-import-action {
    margin-top: 20px;
    text-align: center;
  }
</style>
