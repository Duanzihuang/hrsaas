<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织结构内容-头部   -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @add-dept="addDept" />
        <!-- 放置一个el-tree -->
        <el-tree :data="depts" :props="{ label: 'name' }" default-expand-all>
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @del-dept="getDepartmentsData"
            @add-dept="addDept"
            @edit-dept="editDept"
          />
        </el-tree>
      </el-card>
    </div>
    <add-update-dept ref="addUpdateDeptRef"></add-update-dept>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddUpdateDept from './components/add-update-dept'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddUpdateDept
  },
  data () {
    return {
      company: {}, // 公司
      depts: [] // 部门列表
    }
  },
  created () {
    this.getDepartmentsData()
  },
  methods: {
    async getDepartmentsData () {
      const res = await getDepartments()
      this.company = {
        name: res.companyName,
        manager: '负责人',
        id: ''
      }
      this.depts = tranListToTreeData(res.depts, '')
    },
    // 新增部门
    addDept (node) {
      this.$refs.addUpdateDeptRef.treeNode = node
      this.$refs.addUpdateDeptRef.mode = 'add'
      this.$refs.addUpdateDeptRef.dialogVisible = true
    },
    // 修改部门
    editDept (node) {
      this.$refs.addUpdateDeptRef.treeNode = node
      this.$refs.addUpdateDeptRef.mode = 'edit'
      this.$refs.addUpdateDeptRef.dialogVisible = true
      this.$refs.addUpdateDeptRef.getDepartment(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
