<template>
  <div class="dashboard-container">
    <div class="app-container">
      <upload-excel :on-success="onSuccess"></upload-excel>
    </div>
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  data () {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    async onSuccess ({ header, results }) {
      if (this.type === 'user') {
        // 员工导入
        const userRelations = {
          入职日期: 'timeOfEntry',
          手机号: 'mobile',
          姓名: 'username',
          转正日期: 'correctionTime',
          工号: 'workNumber'
        }

        // 遍历results，把中文的属性，变成英文的属性
        const arr = []
        results.forEach(item => {
          // 获取所有中文的key，做成的数组
          const userInfo = {}
          Object.keys(item).forEach(key => {
            if (
              userRelations[key] === 'timeOfEntry' ||
              userRelations[key] === 'correctionTime'
            ) {
              // 这里的时间处理要转成后台需要的时间格式
              userInfo[userRelations[key]] = new Date(
                this.formatDate(item[key], '/')
              )
              return
            }
            userInfo[userRelations[key]] = item[key]
          })

          arr.push(userInfo)
        })

        // 批量导入
        await importEmployee(arr)
        // 提示
        this.$message.success('导入成功~')
      }

      this.$router.back()
    },
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>
