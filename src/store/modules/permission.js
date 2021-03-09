import { constantRoutes, asyncRoutes, resetRouter } from '@/router'

const state = {
  routes: constantRoutes // 静态路由，所有登录进来的人都能访问的路由
}

const mutations = {
  setRoutes (state, newRoutes) {
    // 把静态路由与动态路由进行合并
    state.routes = [...constantRoutes, ...newRoutes]
  },
  // 重置routes
  resetRoutes (state, newRoutes) {
    // 重置路由(包含重置之前路由中动态添加的规则 addRoutes)
    resetRouter()

    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  filterMenus ({ commit }, menus) {
    const routes = []
    menus.forEach(menu => {
      routes.push(...asyncRoutes.filter(item => item.name === menu))
    })

    commit('setRoutes', routes)

    return routes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
