<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width:50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width:50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width:50%"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width:50%"
          placeholder="请选择"
        >
          <!-- 遍历只能遍历组件的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width:50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @focus="getDepartmentsData"
        />
        <!-- 放置一个tree组件 -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          default-expand-all=""
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width:50%"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  name: 'AddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      EmployeeEnum, // 在data中定义数据
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getDepartmentsData () {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode (node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 保存员工信息
    async btnOk () {
      try {
        await this.$refs.formRef.validate()
        // 调用新增接口
        await addEmployee(this.formData) // 新增员工
        this.$message.success('新增成功~')
        // 调用父组件的刷新方法
        this.$parent.getEmployeeListData()
        // 关闭窗口
        this.$parent.showDialog = false
      } catch (error) {}
    },
    btnCancel () {
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 取消验证
      this.$refs.formRef.resetFields() // 重置校验结果
      // 让父组件关闭窗口
      this.$emit('update:show-dialog', false)
    }
  }
}
</script>
