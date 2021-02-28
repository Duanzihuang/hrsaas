<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>
        <!-- 靠右的按钮 -->
        <page-tools>
          <template #after>
            <el-button type="primary" size="small" @click="add(1, '0')"
              >添加权限</el-button
            >
          </template>
        </page-tools>
        <!-- 树形权限菜单 -->
        <el-table
          :data="list"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
        >
          <el-table-column prop="name" label="菜单名称" sortable>
          </el-table-column>
          <el-table-column prop="code" label="权限标识" align="center" sortable>
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center">
          </el-table-column>
          <el-table-column align="center">
            <template slot-scope="{ row }">
              <el-button
                @click="add(2, row.id)"
                v-if="row.type === 1"
                type="text"
                >添加</el-button
              >
              <el-button @click="edit(row.id)" type="text">编辑</el-button>
              <el-button @click="del(row.id)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </h2>
    </div>
    <!-- 权限新增、编辑对话框 -->
    <el-dialog :title="getText" :visible.sync="dialogVisible">
      <el-form
        :model="formData"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>

      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  getPermissionDetail,
  delPermission
} from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'PermissionList',
  data () {
    return {
      list: [], // 权限列表
      dialogVisible: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getPermissionListData()
  },
  computed: {
    getText () {
      return this.formData.id ? '修改权限' : '新增权限'
    }
  },
  watch: {
    dialogVisible (newValue) {
      if (!newValue) {
        this.formData = {
          name: '', // 名称
          code: '', // 标识
          description: '', // 描述
          type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
          pid: '', // 因为做的是树 需要知道添加到哪个节点下了
          enVisible: '0' // 开启
        }
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    async getPermissionListData () {
      const res = await getPermissionList()

      this.list = tranListToTreeData(res, '0')
    },
    add (type, pid) {
      this.formData.type = type
      this.formData.pid = pid

      this.dialogVisible = true
    },
    async edit (id) {
      this.formData = await getPermissionDetail(id)

      this.dialogVisible = true
    },
    async del (id) {
      try {
        await this.$confirm('确定要删除该数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delPermission(id)
        this.getPermissionListData()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 新增 & 修改
    onSubmit () {
      this.$refs.form
        .validate()
        .then(() => {
          if (this.formData.id) {
            return updatePermission(this.formData)
          }

          return addPermission(this.formData)
        })
        .then(() => {
          this.$message.success('操作成功~')
          this.getPermissionListData()
          this.dialogVisible = false
        })
    }
  }
}
</script>

<style></style>
