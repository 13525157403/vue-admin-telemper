import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/authenticate',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUserList(data) {
  return request({
    url: '/api/asset/management/manage/user/list',
    method: 'get',
    params: data
  })
}

export function getRoleList(data) {
  return request({
    url: '/api/asset/management/manage/roles/list',
    method: 'get',
    params: data
  })
}

export function getAreaParent(data) {
  return request({
    url: '/api/huabei/manage/user/getAreaParent',
    method: 'get',
    data
  })
}
export function getAreaInfo() {
  return request({
    url: '/api/huabei/manage/user/getAreaInfo',
    method: 'get'
  })
}

export function updatePwdAdmin(data) {
  return request({
    url: '/api/asset/management/manage/user/password',
    method: 'put',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/api/asset/management/manage/user',
    method: 'post',
    data
  })
}

export function windowLoginConfirm(data) {
  return request({
    url: '/api/huabei/windowLoginConfirm',
    method: 'get',
    params: data
  })
}

export function editUser(data) {
  return request({
    url: '/api/asset/management/manage/user/putUser',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/asset/management/manage/user/' + data.id,
    method: 'delete',
    data
  })
}
export function sysdict(data) {
  return request({
    url: `/api/asset/management/sys-dict/list/${data}`,
    method: 'get',
  })
}
export function sysdicttree(data) {
  return request({
    url: `/api/asset/management/sys-dict/tree/${data}`,
    method: 'get',
  })
}
export function sysdictlist(data) {
  return request({
    url: `/api/asset/management/sys-dict/list/${data}`,
    method: 'get',
  })
}



