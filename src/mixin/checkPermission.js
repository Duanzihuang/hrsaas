import store from '@/store'

export default {
  methods: {
    // 检验权限点是否有权限
    checkPermission (point) {
      if (store.getters.userInfo.roles && store.getters.userInfo.roles.points) {
        return store.getters.userInfo.roles.points.includes(point)
      }

      return false
    }
  }
}
