<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    center
    width="50%"
    @close="closeDialog"
  >
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="120px"
      :inline="false"
      size="normal"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="form.manager"
          placeholder="请选择部门负责人"
          @focus="getEmployee"
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartment,
  getDepartmentById,
  editDepartment
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddUpdateDept',
  data () {
    // 校验同级目录下是否有相同名称的部门了
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = null

      // 新增时候的校验规则
      if (this.mode === 'add') {
        isRepeat = depts
          .filter(item => item.pid === this.treeNode.id)
          .some(item => item.name === value)
      } else {
        // 修改时候的校验规则
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts
          .filter(
            item => item.id !== this.form.id && item.pid === this.treeNode.pid
          )
          .some(item => item.name === value)
      }

      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    // 校验部门编码是否重复
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = null

      if (this.mode === 'add') {
        isRepeat = depts.some(item => item.code === value)
      } else {
        // 编辑模式  因为编辑模式下 不能算自己
        isRepeat = depts
          .filter(item => item.code !== this.treeNode.code)
          .some(item => item.code === value)
      }

      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }
    return {
      dialogVisible: false,
      mode: '',
      treeNode: null, // 添加或是编辑时候的节点
      employees: [], // 员工列表
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人名称
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          {
            validator: checkNameRepeat,
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          {
            validator: checkCodeRepeat,
            trigger: 'blur'
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      }
    }
  },
  computed: {
    title () {
      return this.mode === 'add' ? '新增部门' : '编辑部门'
    }
  },
  methods: {
    async getEmployee () {
      const res = await getEmployeeSimple()

      this.employees = res
    },
    // 根据id，获取部门信息
    async getDepartment (id) {
      const res = await getDepartmentById(id)

      this.form = res
    },
    // 提交
    submit () {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return

        let res = null
        let message = ''
        // 新增
        if (this.mode === 'add') {
          // 设置新增部门的父节点
          this.form.pid = this.treeNode.id
          res = await addDepartment(this.form)
          message = '新增部门成功'
        } else {
          message = '修改部门成功'
          res = await editDepartment(this.form)
        }
        // 提示
        this.$message({
          type: 'success',
          message
        })
        // 关闭当前对话框
        this.dialogVisible = false
        // 调用父组件的查询方法
        this.$parent.getDepartmentsData()
      })
    },
    // 关闭对话框
    closeDialog () {
      // 清空内容
      this.$refs.formRef.clearValidate()
      this.$refs.formRef.resetFields()
      // 重置模型数据
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人名称
        introduce: '' // 部门介绍
      }
    }
  }
}
</script>
