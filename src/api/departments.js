import request from '@/utils/request'

/**
 * 获取部门列表
 */
export const getDepartments = () => {
  return request({
    url: '/company/department'
  })
}
