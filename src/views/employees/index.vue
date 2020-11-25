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
          <el-button type="primary" size="small" @click="showDialog = true"
            >新增员工</el-button
          >
        </div>
      </page-tools>
      <el-table :data="employees" style="width: 100%">
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column prop="username" label="姓名" sortable>
        </el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="{ row }">
            <img
              @click="showQrCode(row.staffPhoto)"
              v-imgerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
            />
          </template>
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
          <template slot-scope="{ row }">
            <el-button
              @click="$router.push(`employees/detail/${row.id}`)"
              type="text"
              >查看</el-button
            >
            <el-button type="text">转正</el-button>
            <el-button type="text">调岗</el-button>
            <el-button type="text">离职</el-button>
            <el-button type="text">角色</el-button>
            <el-button @click="deleteUser(row.id)" type="text">删除</el-button>
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
    <!-- 放置新增组件 -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showQrCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
import QrCode from 'qrcode'
export default {
  name: 'Employees',
  components: {
    'add-employee': AddDemployee
  },
  data () {
    return {
      query: {
        page: 1,
        size: 10
      },
      employees: [],
      total: 0,
      showDialog: false, // 是否显示新增组件
      showQrCodeDialog: false // 是否显示二维码弹框
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
    async deleteUser (id) {
      try {
        await this.$confirm('确定删除该员工吗？')
        await delEmployee(id)
        this.getEmployeeListData()
        this.$message.success('删除员工成功')
      } catch (error) {}
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
    },
    // 弹出显示二维码的对话框
    showQrCode (url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showQrCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    }
  }
}
</script>

<style></style>
