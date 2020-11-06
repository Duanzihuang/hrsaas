import Layout from '@/layout'

export default {
  path: '/attendances',
  name: 'attendances',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤',
        icon: 'skill'
      }
    }
  ]
}
