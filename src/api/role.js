import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/api/asset/management/roles/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/api/asset/management/roles/roles',
    method: 'get'
  })
}

export function getRoleList(data) {
  return request({
    url: '/api/asset/management/manage/roles/list',
    method: 'get',
    params: data
  })
}

export function addRole(data) {
  return request({
    url: '/api/asset/management/manage/roles',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/api/asset/management/manage/roles',
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/api/asset/management/manage/roles/' + data.id,
    method: 'delete',
    data
  })
}






export function getPriList(data) {
  return request({
    url: '/api/asset/management/manage/authority/tree',
    method: 'get',
    params: data
  })
}

export function updatePriv(data) {
  return request({
    url: '/api/asset/management/manage/authority',
    method: 'put',
    data
  })
}
