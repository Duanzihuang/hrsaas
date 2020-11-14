import request from '@/utils/request'

/**
 * 获取部门列表
 */
export const getDepartments = () => {
  return request({
    url: '/company/department'
  })
}

/**
 * 根据id删除部门
 * @param {*} id 部门id
 */
export const deleteDepartmentById = id => {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

/**
 * 新增部门
 */
export const addDepartment = data => {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

/**
 * 根据ID查询部门详情
 */
export const getDepartmentById = id => {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 修改部门
 */
export const editDepartment = data => {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
