import { getToken } from "@/utils/auth";
import router from "@/router";
import store from "@/store";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // css初始化
import getPageTitle from "@/utils/get-page-title";
import { constantRoutes } from '@/router'
const whiteList = ["/login"]; // 不重定向白名单

NProgress.configure({ showSpinner: false }); // 进度条

router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start();

  document.title = getPageTitle(to.meta.title);
  const token = getToken();

  // 有token，已经登录
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.userInfo
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          await store.dispatch('user/UserInfo')
          // 权限
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes')

          // dynamically add accessible routes
          router.options.routes = [...constantRoutes, ...accessRoutes]
          // router.addRoutes(accessRoutes)
          accessRoutes.forEach((item) => router.addRoute(item));

          // 框架原因，通配符路由只能添加到最后，不然动态路由刷新会跳404
          // router.options.routes.push({ path: '*', redirect: '/404', hidden: true })
          // router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])

          next({ ...to, replace: true })
        } catch (error) {
          // 移除token并跳转到登录页
          // await store.dispatch('user/resetToken')
          // Message.error({
          //   message: error || '出现错误，请稍后再试'
          // })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) //否则全部重定向到登录页
      NProgress.done()
    }
  }
//     // 动态路由权限
//     if (powerType === "2") {
//       const { routes } = store.getters;
//       // 权限正常
//       if (Array.isArray(routes) && routes.length > 0) {
//         next();
//       } else {
//         // 已经登录但是强制刷新页面
//         const result = await store.dispatch("GetUserInfo", token);
//         if (Array.isArray(result) && result.length > 0) {
//           // 与路由表过滤权限
//           const routes = await store.dispatch("GenerateRoutes", result);
//           routes.forEach((item) => router.addRoute(item));

//           next({ ...to, replace: true });
//         } else {
//           alert("无权限");
//           return false;
//         }
//       }
//     } else {
//       // 静态路由权限
//       next();
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next();
//     } else {
//       next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
//     }
//   }
//   NProgress.done();
// });

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
