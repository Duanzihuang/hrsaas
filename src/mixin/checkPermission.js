import store from '@/store'

export default {
  methods: {
    // 检验是否有该权限点的权限
    checkPermission (point) {
      if (store.getters.userInfo.roles && store.getters.userInfo.roles.points) {
        return store.getters.userInfo.roles.points.includes(point)
      }

      return false
    }
  }
}
