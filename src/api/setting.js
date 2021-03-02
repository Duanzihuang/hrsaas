import request from '@/utils/request'

/**
 * 获取所有角色
 * @param {} data 参数，里面有 page、pagesize
 */
export const getAllRoles = data => {
  return request({
    url: '/sys/role',
    params: data
  })
}

/**
 * 根据公司id，获取公司信息
 */
export const getCompanyInfo = companyId => {
  return request({
    url: `/company/${companyId}`
  })
}

/**
 * 新增角色
 */
export const addRole = data => {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 根据ID获取角色详情
 * @param {*} data
 */
export const getRoleById = id => {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * 修改角色
 */
export const updateRole = data => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * 根据id删除角色
 */
export const deleteRole = id => {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

/**
 * 给角色分配权限
 */
// 给角色分配权限
export const assignPerm = data => {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
