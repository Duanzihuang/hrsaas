<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <el-button type="primary" @click="addRole">+ 新增角色</el-button>
            <el-table :data="roles" border stripe style="margin-top:20px;">
              <el-table-column type="index" label="序号" sortable width="150px">
              </el-table-column>
              <el-table-column
                prop="name"
                label="角色名"
                sortable
                width="200px"
              >
              </el-table-column>
              <el-table-column prop="description" label="描述" width="400px">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="assign(scope.row.id)"
                    >权限分配</el-button
                  >
                  <el-button type="text" @click="editRole(scope.row.id)"
                    >编辑</el-button
                  >
                  <el-button type="text" @click="delRole(scope.row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height:60px;"
            >
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-size="query.pagesize"
                layout="prev, pager, next"
                :total="total"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :show-icon="true"
              :closable="false"
            >
            </el-alert>
            <el-form
              style="margin-top:20px;"
              label-width="180px"
              :inline="false"
              size="normal"
            >
              <el-form-item label="企业名称">
                <el-input
                  style="width:500px;"
                  v-model="companyData.name"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  style="width:500px;"
                  v-model="companyData.companyAddress"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="企业电话">
                <el-input
                  style="width:500px;"
                  v-model="companyData.companyPhone"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  style="width:500px;"
                  v-model="companyData.mailbox"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  style="width:500px;"
                  v-model="companyData.remarks"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog
        center
        :title="title"
        :visible.sync="dialogVisible"
        width="600px"
        @close="closeDialog"
      >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input
              v-model="form.description"
              placeholder="请输入角色描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 给角色分配权限弹出框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="showPermDialog"
        center
        @close="onClosePermDialog"
      >
        <el-tree
          ref="permTreeRef"
          :data="treePermList"
          show-checkbox
          node-key="id"
          check-strictly
          default-expand-all
          :default-checked-keys="permIds"
          :props="defaultProps"
        >
        </el-tree>
        <div slot="footer">
          <el-button @click="onClosePermDialog">取 消</el-button>
          <el-button type="primary" @click="onAssignPerm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAllRoles,
  getCompanyInfo,
  addRole,
  updateRole,
  getRoleById,
  deleteRole,
  assignPerm
} from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  data () {
    return {
      activeName: 'first',
      roles: [],
      total: 0, // 总条数
      query: {
        page: 1,
        pagesize: 5
      },
      companyData: {},
      // 角色新增 & 修改
      dialogVisible: false,
      mode: 'add', // 默认是新增
      form: {
        name: '',
        description: ''
      },
      showPermDialog: false, // 是否显示分配权限对话框
      treePermList: [], // 权限列表树形菜单
      permIds: [], // 该角色拥有的权限id数组
      roleId: null, // 角色id
      defaultProps: {
        label: 'name'
      },
      rules: {
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    title () {
      return this.mode === 'add' ? '新增角色' : '修改角色'
    }
  },
  mounted () {
    this.getRolesListData()
    this.getCompanyInfoData()
  },
  methods: {
    async getRolesListData () {
      const res = await getAllRoles(this.query)

      this.total = res.total
      this.roles = res.rows
    },
    // 页码改变
    handleCurrentChange (page) {
      this.query.page = page
      this.getRolesListData()
    },
    // 根据公司ID，获取公司相关信息
    async getCompanyInfoData () {
      const res = await getCompanyInfo(this.companyId)

      this.companyData = res
    },
    addRole () {
      this.mode = 'add'
      this.dialogVisible = true
    },
    async editRole (id) {
      const res = await getRoleById(id)

      this.form = res
      this.mode = 'edit'
      this.dialogVisible = true
    },
    async delRole (id) {
      try {
        await this.$confirm('确定删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await deleteRole(id)

        this.$message({ type: 'success', message: '删除角色成功' })

        this.query.page = 1
        this.getRolesListData()
      } catch (error) {
        console.log(error)
      }
    },
    // 提交（新增、修改）
    async submit () {
      try {
        await this.$refs.formRef.validate()

        // 发请求
        let res = null
        if (this.mode === 'add') {
          // 新增
          res = await addRole(this.form)
        } else {
          res = await updateRole(this.form)
        }

        this.$message({
          type: 'success',
          message: this.mode === 'add' ? '新增角色成功' : '修改角色成功'
        })

        this.dialogVisible = false
        this.getRolesListData()
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog () {
      this.form = {
        name: '',
        description: ''
      }
      this.$refs.formRef.clearValidate() // 移除校验
      this.$refs.formRef.resetFields() // 把字段值设置为空
    },
    // 打开权限分配
    async assign (id) {
      this.roleId = id
      this.treePermList = tranListToTreeData(await getPermissionList(), '0')

      const { permIds } = await getRoleById(id)
      this.permIds = permIds

      this.showPermDialog = true
    },
    // 分配权限
    async onAssignPerm () {
      const checkedIds = this.$refs.permTreeRef.getCheckedKeys()

      await assignPerm({
        id: this.roleId,
        permIds: checkedIds
      })

      this.$message.success('授权成功~')
      this.showPermDialog = false
    },
    // 关闭授权框
    onClosePermDialog () {
      this.permIds = []
      this.showPermDialog = false
    }
  }
}
</script>

<style></style>
