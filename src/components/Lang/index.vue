<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <el-dropdown trigger="click" @command="handleCommand">
      <!-- 这里必须加一个div -->
      <div>
        <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="zh" :disabled="$i18n.locale === 'zh'"
          >中文</el-dropdown-item
        >
        <el-dropdown-item command="en" :disabled="$i18n.locale === 'en'"
          >en</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    handleCommand (val) {
      Cookie.set('language', val) // 切换多语言
      this.$i18n.locale = val // 设置给本地的i18n插件
    }
  }
}
</script>
