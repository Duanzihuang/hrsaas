<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织结构内容-头部   -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" />
        <!-- 放置一个el-tree -->
        <el-tree :data="depts" :props="{ label: 'name' }" default-expand-all>
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <tree-tools slot-scope="{ data }" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Departments',
  components: {
    TreeTools
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
        manager: '负责人'
      }
      this.depts = tranListToTreeData(res.depts, '')
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
