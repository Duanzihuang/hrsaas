<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height:40px;width:100%;"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" align="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span
              >操作
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deleteDepartmentById } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand (command) {
      switch (command) {
        case 'add':
          this.$emit('add-dept', this.treeNode)
          break
        case 'edit':
          this.$emit('edit-dept', this.treeNode)
          break
        case 'del':
          this.$confirm('确定删除该部门吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              await deleteDepartmentById(this.treeNode.id)

              this.$emit('del-dept')
            })
            .catch(() => {})

          break

        default:
          break
      }
    }
  }
}
</script>
