import request from '@/utils/request'

const api = 'user-server/sysRole'

// 根据角色信息查询用户
export function findByRoleId(data) {
  return request({
    url: api + '/findByRoleId',
    method: 'get',
    data
  })
}

// 新增角色用户信息
export function saveRoleUser(data) {
  return request({
    url: api + '/saveRoleUser',
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

// 分页查询
export function findPage(data) {
  return request({
    url: api + '/findPage',
    method: 'post',
    data,
    isParams: true
  })
}

// 删除
export function deleteById(data) {
  return request({
    url: api + '/deleteById',
    method: 'get',
    data
  })
}
