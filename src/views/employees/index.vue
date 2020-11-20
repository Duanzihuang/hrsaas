<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before> 共{{ total }}条记录 </template>
        <div slot="after">
          <el-button
            type="success"
            size="small"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button type="danger" size="small" @click="exportData"
            >excel导出</el-button
          >
          <el-button type="primary" size="small">新增员工</el-button>
        </div>
      </page-tools>
      <el-table :data="employees" style="width: 100%">
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column prop="username" label="姓名" sortable>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" sortable>
        </el-table-column>
        <el-table-column
          label="聘用形式"
          prop="formOfEmployment"
          :formatter="formatEmployment"
          sortable
        >
        </el-table-column>
        <el-table-column prop="departmentName" label="部门" sortable>
        </el-table-column>
        <el-table-column label="入职时间" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.timeOfEntry | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enableState"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable width="300px">
          <template>
            <el-button type="text">查看</el-button>
            <el-button type="text">转正</el-button>
            <el-button type="text">调岗</el-button>
            <el-button type="text">离职</el-button>
            <el-button type="text">角色</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle">
        <el-pagination
          style="margin-top:20px;"
          layout="prev, pager, next"
          :current-page="query.page"
          :total="total"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import { formatDate } from '@/filters'
import EmployeeEnum from '@/api/constant/employees'
export default {
  name: 'Employees',
  data () {
    return {
      query: {
        page: 1,
        size: 10
      },
      employees: [],
      total: 0
    }
  },
  created () {
    this.getEmployeeListData()
  },
  methods: {
    async getEmployeeListData () {
      const res = await getEmployeeList(this.query)

      this.employees = res.rows
      this.total = res.total
    },
    // 格式化聘用形式
    formatEmployment (row, col, cellValue) {
      const item = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return item && item.value
    },
    handleCurrentChange (page) {
      this.query.page = page

      this.getEmployeeListData()
    },
    // 导出excel
    exportData () {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }

      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.total
        })
        // 得到二维数组
        const data = this.formatJson(headers, rows)

        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader, // 复杂表头
          merges: ['A1:A2', 'B1:F1', 'G1:G2'] // 合并选项
        })

        // 示例
        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    // 该方法负责将数组转化成二维数组
    // 该方法把[{username:'管理员',workNumber:'9002',mobile:'13800000002'}] ==> [[管理员,9002,'13800000002']]
    formatJson (headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(
              type => type.id === item[headers[key]]
            )
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        }) // [管理员,9002,'13800000002']
      }) //[[管理员,9002,'13800000002'],[xxx,xxx,xxx]]
    }
  }
}
</script>

<style></style>
