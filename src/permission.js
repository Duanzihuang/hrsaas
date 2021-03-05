import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = store.getters.token

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (!store.getters.userId) {
        // 为什么要写await 因为我们想获取完资料再去放行
        const res = await store.dispatch('user/asyncGetUserInfo')

        const routes = await store.dispatch(
          'permisson/filterMenus',
          res.roles.menus
        )

        // 设置动态路由
        router.addRoutes([
          ...routes,
          {
            path: '*',
            redirect: '/404',
            hidden: true
          }
        ])

        // 加await的意思是 强制等待获取完用户资料之后 才去放行  就能保证 用户进到页面时候 有资料
        // 添加完路由之后 不能用next()  要用next(to.path) 否则地址不能生效 这算是一个已知 的小缺陷
        // 执行完addRoutes 必须执行next(to.path) 不能执行 next() 这是一个已知的问题缺陷
        next(to.path) // 解决直接执行next()时的异常，解决强制刷新浏览器页面不渲染内容的bug
      } else {
        next()
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
