import { asyncRoutes } from '@/router'
import setting from '@/settings'
import Layout from '@/components/Layout/index.vue'

// 遍历后台返回的菜单，生成动态路由(仅用于菜单展示)
const filterAsyncRoutes = (routes) => {
  const res = []

  routes.forEach(item => {
    let route = {
      path: item.routePath,
      name: item.label,
      meta: {
        title: item.label,
        icon: item.iconPath
      },
      hidden: !!item.isHide
    }

    // 重新封装路由字段
    if (item.linkType && item.linkType === 1) { // 外链
      route = {
        path: item.routePath,
        meta: { title: item.label, icon: item.iconPath }
      }
    } else { // 内链
      if (item.pagePath) {
        if (item.pagePath === 'Layout') {
          route.component = Layout
        } else if (item.pagePath === 'Layout2') {
          route.component = { render(c) { return c('router-view') } }
        } else {
          // 先屏蔽掉，不要导致没有用到的文件报语法错误(正式调用接口时启用)
          route.component = import.meta.glob('@/views/'+item.pagePath)

          // 收集页面按钮权限
          if (item.perms) { route.meta.menu = item.perms.split(',') }
        }
      }

      if (item.children && item.children instanceof Array && item.children.length > 0) {
        route.children = filterAsyncRoutes(item.children)
      }

      // 处理按钮
      // item.perms.forEach()
    }

    res.push(route)
  })

  return res
}

// 路由扁平化
const getFlatRoutes = routes => {
  const res = []

  routes.forEach(item => {
    let route = {
      path: item.routePath,
      name: item.label,
      meta: {
        title: item.label,
        icon: item.iconPath
      },
      hidden: !!item.isHide
    }

    // 重新封装路由字段
    if (item.linkType && item.linkType === 1) { // 外链
      route = {
        path: item.routePath,
        meta: { title: item.label, icon: item.iconPath }
      }
    } else { // 内链
      if (item.pagePath) {
        if (item.pagePath === 'Layout') { route.component = Layout }
      }

      if (item.children && item.children instanceof Array && item.children.length > 0) {
        route.children = formatRouter(item.children, [])
      }
    }

    res.push(route)
  })

  return res
}

const formatRouter = (routes, list = []) => {
  routes.forEach(item => {
    let route = {
      path: item.routePath,
      name: item.label,
      meta: {
        title: item.label,
        icon: item.iconPath
      },
      hidden: !!item.isHide
    }

    // 重新封装路由字段
    if (item.linkType && item.linkType === 1) { // 外链
      route = {
        path: item.routePath,
        meta: { title: item.label, icon: item.iconPath }
      }
    } else { // 内链
      if (item.pagePath) {
        if (item.pagePath === 'Layout2') {
          route.component = Layout
        } else {
          route.component = import.meta.glob('@/views/'+item.pagePath)
          // 收集页面按钮权限
          if (item.perms) { route.meta.menu = item.perms.split(',') }
        }
      }

      if (item.children && item.children instanceof Array && item.children.length > 0) {
        const arr = formatRouter(item.children, list)
        list.concat(arr)
      }
    }

    list.push(route)
  })
  return list
}

const state = {
  permissionRoutes: [],
  permissionButtons: [] // 按钮权限
}

const mutations = {
  // 路由
  SET_ROUTES: (state, routes) => {
    state.permissionRoutes = routes
  },
  // 按钮
  SET_PERMISSION_MENU: (state, menu) => {
    state.permissionButtons = menu
  }
}

const actions = {
  // 构建路由
  generateRoutes({ commit, state }) {
    return new Promise(resolve => {
      let accessRoutes
      let flatRoutes

      if (setting.routerPermission) {
        // 后台权限路由
        accessRoutes = filterAsyncRoutes(state.permissionRoutes)
        // 路由降级
        flatRoutes = getFlatRoutes(state.permissionRoutes)
      } else {
        // 开放所有本地注册路由
        accessRoutes = asyncRoutes
        flatRoutes = asyncRoutes
      }
      commit('SET_ROUTES', accessRoutes)
      resolve(flatRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
