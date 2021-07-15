<template>
  <div>
    <!-- 错误显示表 -->
    <template v-if="errorTableData.length">
      <h1 style="color: #f56c6c">错误信息展示</h1>

      <a-table
        :dataSource="errorTableData"
        bordered
        class="import-error-table"
        style="width: 100%"
        rowKey="row"
      >
        <a-table-column
          title="错误行号"
          key="row"
          dataIndex="row"
          width="180"
        ></a-table-column>
        <a-table-column
          title="错误原因"
          key="reason"
          dataIndex="reason"
        ></a-table-column>
      </a-table>
    </template>
    <!-- 数据列表 -->
    <h1>数据列表</h1>
    <a-table
      :cell-class-name="checkCell"
      :dataSource="tableData"
      :pagination="dataPagination"
      bordered
      style="width: 100%"
      :loading="isLoading"
      rowKey="key"
    >
      <a-table-column
        align="center"
        title="行号"
        key="key"
        dataIndex="key"
        width="50"
      ></a-table-column>

      <a-table-column
        :key="field"
        :title="label"
        :dataIndex="field"
        align="left"
        headerAlign="center"
        v-for="(label, field) of fields"
        :customRender="(text,record,index) => text"
      >
        <!-- 自定义错误显示 -->
        <template slot-scope="scope">
          <a-tooltip
            :content="errorData[scope.$index][field]"
            class="item"
            effect="dark"
            placement="top"
            v-if="errorData[scope.$index] && errorData[scope.$index][field]"
          >
            <div>{{ scope.row[field] || "&nbsp;" }}</div>
          </a-tooltip>
          <template v-else>{{scope.row[field]}}</template>
        </template>
      </a-table-column>
    </a-table>

    <div class="ant-import-action">
      <a-button @click="handlePre" size="large" type="primary">重新上传</a-button>
      <a-button
        type="primary"
        size="large"
        :loading="isLoading"
        @click="handleRequest"
      >下一步</a-button>
    </div>
  </div>
</template>

<script>
import Schema from 'async-validator'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'AntImportData',
  props: {
    rules: {
      type: Object,
      default () {
        return {}
      }
    },
    fields: {
      type: Object,
      required: true
    },
    requestFn: {
      type: Function,
      required: true
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    formatter: Object,
    append: Object
  },
  inject: ['goNext', 'goPre'],
  data () {
    return {
      isLoading: false,
      errorData: {},
      dataPagination: { defaultCurrent: 1,  defaultPageSize: 10, hideOnSinglePage: true}
    }
  },
  computed: {
    errorTableData () {
      const errorData = this.errorData
      const errorTableData = []
      for (const index in errorData) {
        let messageArr = []
        for (const field in errorData[index]) {
          messageArr.push(errorData[index][field])
        }
        errorTableData.push({
          row: Number(index) + 1,
          reason: messageArr.join('、')
        })
      }

      return errorTableData
    }
  },
  methods: {
    // 检查单元格是否错误
    checkCell ({ row, column, rowIndex }) {
      if (this.errorData[rowIndex] && this.errorData[rowIndex][column.property]) {
        return 'ant-import-error-cell'
      }
    },

    // 校检数据
    validateData () {
      if (this.rules) {
        var validator = new Schema(this.rules)
        const errorData = []
        this.tableData.forEach((item, index) => {
          //添加key
          this.tableData[index].key = index + 1
          validator.validate(item, (errors, fileds) => {
            if (errors) {
              errorData[index] = []
              errors.forEach((error) => {
                errorData[index][error.field] = error.message
              })
            }
          })
        })

        this.errorData = errorData
      }
    },

    handlePre () {
      this.$emit('pre')
    },

    // 根据value找到key
    findKey (obj, value, compare = (a, b) => a === b) {
      let key = Object.keys(obj).find(k => compare(obj[k], value))
      if (!isNaN(Number(key))) {
        key = Number(key)
      }
      return key
    },

    // 根据 formatter 改变值
    changeData (tableData) {
      const formatter = this.formatter
      if (formatter) {
        tableData = tableData.map((item) => {
          for (const key in item) {
            if (formatter[key]) {
              if (typeof formatter[key] === 'function') {
                item[key] = formatter[key](item[key], item)
              } else {
                item[key] = this.findKey(formatter[key], item[key])
              }
            }
          }
          return item
        })
      }

      return tableData
    },

    // 发送请求
    async handleRequest () {
      if (this.isLoading) return

      if (this.errorTableData.length) {
        this.$notification.error({
          title: '提示',
          message: '请处理完错误后重新上传'
        })
        return
      }

      this.isLoading = true
      let tableData = cloneDeep(this.tableData)
      // 改变值
      tableData = this.changeData(tableData)
      // 增加附加数据
      const appendData = this.append
      if (appendData) {
        tableData = tableData.map((item) => {
          return Object.assign({}, item, appendData)
        })
      }
      try {
        await this.requestFn(tableData)
        this.$message.success('导入成功')
        this.goNext()
      } catch (error) {
        this.errorData = error
        this.$message.error('导入失败, 请重试')
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted () {
    this.validateData()
  }
}
</script>

<style>
.import-error-table {
  margin-bottom: 20px;
}

.ant-import-error-cell {
  color: white;
  background: #f56c6c !important;
}
.ant-import-error-cell:hover {
  background-color: #f56c6c !important;
  background: #f56c6c !important;
}
</style>
