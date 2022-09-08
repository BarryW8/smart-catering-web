import request from '@/utils/request'

const api = 'user-server/sysMenu'

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

// 列表
export function getList(data) {
  return request({
    url: api + '/getList',
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
