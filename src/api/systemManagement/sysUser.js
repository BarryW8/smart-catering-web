import request from '@/utils/request'

const api = 'user-server/sysUser'

// 获取扫码手机号
export function getScanLogin(params) {
  return request({
    url: api + '/login/getScanLogin',
    method: 'get',
    params: params
  })
}

// 根据用户信息查询路内车场
export function findStreetParkingByUserId(params) {
  return request({
    url: api + '/findStreetParkingByUserId',
    method: 'get',
    params: params
  })
}

// 新增用户路内车场信息
export function saveUserStreetParking(params) {
  return request({
    url: api + '/saveUserStreetParking',
    method: 'post',
    data: params
  })
}

// 用户授权车场分页列表
export function findParkingList(params) {
  return request({
    url: api + '/findParkingList',
    method: 'post',
    data: params
  })
}

// 根据用户信息查询车场
export function findParkingByUserId(params) {
  return request({
    url: api + '/findParkingByUserId',
    method: 'get',
    params: params
  })
}

// 新增用户车场信息
export function saveUserParking(params) {
  return request({
    url: api + '/saveUserParking',
    method: 'post',
    data: params
  })
}

// 根据用户信息查询角色
export function findBySysUserId(params) {
  return request({
    url: api + '/findByUserId',
    method: 'get',
    params: params
  })
}

// 新增用户角色信息
export function saveSysUserRole(params) {
  return request({
    url: api + '/saveUserRole',
    method: 'post',
    data: params
  })
}

// 新增系统用户
export function saveSysUser(params) {
  return request({
    url: api + '/save',
    method: 'post',
    data: params
  })
}

// 查询系统用户详情
export function sysUserInfo(params) {
  return request({
    url: api + '/findById',
    method: 'get',
    params: params
  })
}

// 查询系统用户分页列表
export function sysUserPage(params) {
  return request({
    url: api + '/findPage',
    method: 'post',
    data: params
  })
}

// 删除系统用户
export function delSysUser(params) {
  return request({
    url: api + '/deleteById',
    method: 'get',
    params: params
  })
}

// 校验用户名唯一
export function checkUserName(modelId, name) {
  return request({
    url: api + '/nameUnique?modelId=' + modelId + '&name=' + name,
    method: 'get'
  })
}

// 校验旧密码
export function checkPassword(params) {
  return request({
    url: api + '/checkPassword',
    method: 'get',
    params: params
  })
}

// 修改或重置密码
export function editPassword(params) {
  return request({
    url: api + '/editPassword',
    method: 'post',
    data: params
  })
}

// 系统用户登录
export function login(params) {
  return request({
    url: api + '/login',
    method: 'post',
    data: params
  })
}

// 系统用户退出登录
export function logout(params) {
  return request({
    url: api + '/logout',
    method: 'post',
    data: params
  })
}

// 登录后，获取系统用户信息
export function getInfo() {
  return request({
    url: api + '/sysUserInfo',
    method: 'get'
  })
}

// 获取在线用户信息
export function getOnlineUser(params) {
  return request({
    url: api + '/getOnlineUser',
    method: 'post',
    data: params
  })
}

// 在线用户下线
export function offline(params) {
  return request({
    url: api + '/offline',
    method: 'post',
    data: params
  })
}
