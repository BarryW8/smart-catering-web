import request from '@/utils/request'

const api = 'user-server/sysRole'

// 根据角色信息查询用户
export function findRoleUser(data) {
  return request({
    url: api + '/findRoleUser',
    method: 'get',
    data,
    isParams: true
  })
}

// 新增角色用户信息
export function saveRoleUser(data) {
  return request({
    url: api + '/saveRoleUser',
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
