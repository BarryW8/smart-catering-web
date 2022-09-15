import request from '@/utils/request'

const api = 'user-server/sysUser'

// 根据用户信息查询角色
export function findUserRole(data) {
  return request({
    url: api + '/findUserRole',
    method: 'get',
    data,
    isParams: true
  })
}

// 新增用户角色信息
export function saveUserRole(data) {
  return request({
    url: api + '/saveUserRole',
    method: 'post',
    data
  })
}

// 新增/编辑
export function save(data) {
  return request({
    url: api + '/save',
    method: 'post',
    data
  })
}

// 详情
export function findById(data) {
  return request({
    url: api + '/findById',
    method: 'get',
    data,
    isParams: true
  })
}

// 分页列表
export function findPage(data) {
  return request({
    url: api + '/findPage',
    method: 'post',
    data
  })
}

// 删除
export function deleteById(data) {
  return request({
    url: api + '/deleteById',
    method: 'get',
    data,
    isParams: true
  })
}

// 系统用户登录
export function login(data) {
  return request({
    url: api + '/login',
    method: 'post',
    data
  })
}

// 系统用户退出登录
export function logout() {
  return request({
    url: api + '/logout',
    method: 'get'
  })
}

// 登录后，获取系统用户信息
export function userInfo() {
  return request({
    url: api + '/userInfo',
    method: 'get'
  })
}
