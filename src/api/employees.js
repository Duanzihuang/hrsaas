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

/** **
 *  新增员工的接口
 * **/
export function addEmployee (data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * 删除员工
 */
export const delEmployee = id => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 * 保存员工信息
 */
export const saveUserDetailById = data => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail (id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail (id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob (data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
