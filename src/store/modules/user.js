import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(), // 登录之后的用户token
  userInfo: {} // 用户信息
}

const mutations = {
  setToken (state, token) {
    state.token = token
  },
  removeToken (state) {
    // 删除cookies中的token
    removeToken()

    state.token = null
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}

const actions = {
  // 登录
  async asyncLogin ({ commit }, data) {
    const res = await login(data)

    // 在仓库中存储token
    commit('setToken', res)

    // 把token保存到本地
    setToken(res)
  },
  // 获取用户信息
  async asyncGetUserInfo ({ commit }) {
    // 获取用户信息
    const res = await getUserInfo()

    // 获取个人信息
    const res2 = await getUserDetailById(res.userId)

    // 在仓库中存储用户信息
    commit('setUserInfo', { ...res, ...res2 })

    return res
  },
  // 退出
  async asyncLogout ({ commit }) {
    // 移除token
    commit('removeToken')
    // 移除userInfo
    commit('removeUserInfo')
    // 触发 permission/resetRoutes
    commit('permission/resetRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
