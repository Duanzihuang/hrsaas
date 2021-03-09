import Layout from '@/layout'

export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/permission'),
      name: 'permissions',
      meta: {
        title: '权限管理',
        icon: 'lock',
        name: 'permissions'
      }
    }
  ]
}
