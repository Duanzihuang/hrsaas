<template>
  <div>
    <div class="dashboard-container">
      <div class="app-container">
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userForm"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="新密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width:300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="UserInfo" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { saveUserDetailById } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
// 导入子组件
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data () {
    return {
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        //   专门存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUser () {
      try {
        await this.$refs.userForm.validate()
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password
        }) // 将新密码的值替换原密码的值
        this.$message.success('保存成功~')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
