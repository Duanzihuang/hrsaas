<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="cancel">
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="submit" type="primary">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getAllRoles } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [], // 角色列表
      checkList: []
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { rows } = await getAllRoles({ page: 1, pagesize: 20 })

      this.list = rows
    },
    async getUserRoleIdsById (id) {
      const { roleIds } = await getUserDetailById(id)

      this.checkList = roleIds
    },
    cancel () {
      this.$emit('update:showRoleDialog', false)
    },
    async submit () {
      const res = await assignRoles({
        id: this.userId,
        roleIds: this.checkList
      })

      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
