<template>
  <div class="ant-import-download">
    <a :href="filepath" :underline="false" @click="handleDownload" target="_blank">
      <a-icon type="file-excel" class="ant-icon-document" />
    </a>
    <div>
      <a :href="filepath" :underline="false" @click="handleDownload" target="_blank">点击下载模板文件</a>
    </div>

    <div class="ant-import-action">
      <a-button @click="handleDownload" type="success" style="backgroundColor: #67C23A" size="large">
        <a :href="filepath" :underline="false" style="backgroundColor: #67C23A;color: white" target="_blank">下载模板</a>
      </a-button>
      <a-button @click="handleNext" type="primary" size="large">下一步</a-button>
    </div>
  </div>
</template>

<script>
// 下载文件页面
import Cookie from 'js-cookie'

export default {
  name: 'AntImportDownload',
  props: {
    filepath: {
      type: String,
      required: true
    },
    mustdownload: {
      type: Boolean,
      required: true
    }
  },
  inject: ['goNext'],
  data () {
    return {
      hasDownload: false
    }
  },
  methods: {
    // 点击下载
    handleDownload () {
      Cookie.set('ant-import-download-' + this.filepath, true)
      this.hasDownload = true
    },

    // 点击下一步
    handleNext () {
      if (this.hasDownload) {
        this.goNext()
      } else {
        this.$message.error('您还未下载模板文件')
      }
    },

    // 判断是否已经下载
    checkHasDownload () {
      if (this.mustdownload) {
        this.hasDownload = Cookie.get('ant-import-download-' + this.filepath)
      } else {
        this.hasDownload = true
      }
    }
  },
  mounted () {
    // 判断是否下载过
    this.checkHasDownload()
  }
}
</script>

<style scoped>
  .ant-import-download {
    text-align: center;
  }

  .ant-import-download .ant-icon-document {
    font-size: 150px;
    line-height: 1.2;
    color: #67c23a;
  }
</style>
