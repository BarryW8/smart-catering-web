import request from '@/utils/request'

const api = 'user-server/sysUser'

// 根据用户信息查询角色
export function findByUserId(data) {
  return request({
    url: api + '/findByUserId',
    method: 'get',
    data
  })
}

// 新增用户角色信息
export function saveUserRole(data) {
  return request({
    url: api + '/saveUserRole',
    method: 'post',
    data,
    isParams: true
  })
}

// 新增/编辑
export function save(data) {
  return request({
    url: api + '/save',
    method: 'post',
    data,
    isParams: true
  })
}

// 详情
export function findById(data) {
  return request({
    url: api + '/findById',
    method: 'get',
    data
  })
}

// 分页列表
export function findPage(data) {
  return request({
    url: api + '/findPage',
    method: 'post',
    data,
    isParams: true
  })
}

// 删除
export function delSysUser(data) {
  return request({
    url: api + '/deleteById',
    method: 'get',
    data
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
export function logout(data) {
  return request({
    url: api + '/logout',
    method: 'post',
    data,
    isParams: true
  })
}

// 登录后，获取系统用户信息
export function getInfo() {
  return request({
    url: api + '/sysUserInfo',
    method: 'get'
  })
}
