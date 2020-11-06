import { login } from '@/api/user'
import { setToken } from '@/utils/auth'

const state = {
  token: null
}

const mutations = {
  setToken (state, token) {
    state.token = token
  }
}

const actions = {
  async asyncLogin ({ commit }, data) {
    const res = await login(data)

    // 在仓库中存储token
    commit('setToken', res)

    // 把token保存到本地
    setToken(res)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
