const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  username: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  companyId: state => state.user.userInfo.companyId,
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  routes: state => state.permission.routes,
  userInfo: state => state.user.userInfo
}
export default getters
