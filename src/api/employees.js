import request from '@/utils/request'

/**
 * 获取员工简单信息
 */
export const getEmployeeSimple = () => {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工列表
 */
export const getEmployeeList = data => {
  return request({
    url: '/sys/user',
    params: data
  })
}

/**
 * 批量导入员工
 * @param {*} data
 */
export const importEmployee = data => {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}
