<template>
<div>
  <!-- 提示列表 -->
  <div v-if="tips && tips.length" style="margin-top: 20px;">
    <a-alert type="warning" :key="index" v-for="(item, index) of tips" :message="index + 1 + '、' + item" showIcon closable> </a-alert>
  </div>
  <div class="ant-import-upload-uploader">
    <!-- 上传组件 -->
    <a-upload-dragger accept=".xls,.xlsx" listType="picture-card" :beforeUpload="beforeUpload" :fileList="fileList" :customRequest="fakeRequeset" :showUploadList="false" action="/">
      <a-icon type="cloud-upload" class="ant-icon-upload" />
      <div class="ant-upload__text">
        将填写后的文件拖到此处，或
        <em>点击上传</em>
      </div>
    </a-upload-dragger>
  </div>

  <!-- 操作 -->
  <div class="ant-import-action">
    <a-space>
      <a-button type="primary" size="large" @click="goPre">上一步</a-button>
      <a-button type="primary" size="large" :loading="isLoading" @click="handleGoNext">下一步</a-button>
    </a-space>
  </div>
</div>
</template>

<script>
// 上传文件页面
import excel from '../excel'

export default {
  name: 'AntImportUpload',
  props: {
    tips: Array,
    fields: {
      type: Object,
      required: true
    }
  },
  inject: ['goNext', 'goPre'],
  data () {
    return {
      fileList: [],
      isLoading: false
    }
  },
  methods: {
    // 假上传
    fakeRequeset () {
      this.fileList = []
    },
    // 检测文件类型
    checkType (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      const extArr = ['xlsx', 'xls', 'csv']
      return extArr.includes(fileExt)
    },
    // 上传错处提示
    uploadError (message) {
      this.$notification.error({
        title: '上传出错了',
        message: message
      })
    },
    // 检测表头
    checkTableTitle (columns, fields) {
      const titles = Object.values(fields)
      titles.forEach((item) => {
        if (!columns.includes(item)) {
          this.$notification.error({
            title: '数据错处了',
            message: item + ' 列未找到'
          })
        }
      })
    },
    handleGoNext () {
      this.$notification.error({
        title: '提示',
        message: '请先上传数据'
      })
    },

    // 改变 tableData 的 key, 并且过滤掉不需要的字段
    changeDatakeyAndFilter (arr) {
      const fields = this.fields
      return arr.map((item) => {
        var res = {}
        for (const key in fields) {
          res[key] = item[fields[key]]
        }
        return res
      })
    },

    async beforeUpload (file) {
      if (this.isLoading) return

      // 检测文件类型
      if (!this.checkType(file)) {
        this.uploadError('文件：' + file.name + ' 文件类型错误，请在模板文件上修改后上传')
        return false
      }

      this.isLoading = true
      try {
        const {
          columns,
          tableData
        } = await excel(file)

        if (!(columns.length && tableData.length)) {
          this.uploadError('请打开模板文件, 并填写数据')
        } else {
          this.checkTableTitle(columns, this.fields)
          this.$emit('upload', columns, this.changeDatakeyAndFilter(tableData))
          this.goNext()
        }
      } catch (e) {
        // eslint-disable-next-line
        window.console.error(e)
        this.uploadError('文件读取出错，请重新上传')
      } finally {
        this.isLoading = false
      }

      return false
    }
  }
}
</script>

<style>
.ant-import-upload-tips {
  padding: 0 20px;
  line-height: 20px;
  list-style-type: decimal;
}

.ant-import-upload-uploader {
  margin-top: 20px;
  text-align: center;
}

.ant-icon-upload {
  font-size: 50px;
  line-height: 1.2;
  align: center;
}
</style>
