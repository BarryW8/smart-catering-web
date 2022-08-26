const ip = require("ip");

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import styleImport from "vite-plugin-style-import";
import { svgBuilder } from "./src/plugin/icons/svgBuilder";
import AutoImport from "unplugin-auto-import/vite" // 自动导入插件
import Components from "unplugin-vue-components/vite" // 自动导入组件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const path = require("path");

function _resolve(dir) {
  return path.resolve(__dirname, dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": _resolve("src"),
    },
  },
  plugins: [
    vue(),
    svgBuilder("./src/plugin/icons/svg/"),
    AutoImport ({
      imports: ["vue", "vue-router"], // 自动导入vue和vue-router相关函数
      resolvers: [ElementPlusResolver()]
      // dts: "src/auto-import.d.ts" // 生成 `auto-import.d.ts` 全局声明
    }),
    Components({
      dirs: ['src/components'], // 配置需要默认导入的自定义组件文件夹，该文件夹下的所有组件都会自动 import
      resolvers: [ElementPlusResolver()]
    })
    /* styleImport({
      libs: [
        {
          libraryName: "element-plus",
          esModule: true,
          resolveStyle: (name) => {
            return `element-plus/lib/theme-chalk/${name}.css`;
          },
          resolveComponent: (name) => {
            return `element-plus/lib/${name}`;
          },
        },
      ],
    }), */
  ],
  server: {
    hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
    // 服务配置
    port: 9528, // 类型： number 指定服务器端口;
    open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
    cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
    host: true,
    https: false //whether open https 开启https首次运行比较慢 且有个输入密码过程
    //proxy look for https://vitejs.cn/config/#server-proxy
    // proxy: {
    //   '/api': {
    //     target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_URL,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  // server: {
  //   port: 9000,
  //   cors: true,
  //   host: ip.address(),
  //   /* proxy: {
  //     "/epgms": {
  //       target: "http://10.10.8.14:9999/mock/5f23d33facd7311a719430ed/epgms/",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/epgms/, ""),
  //     },
  //   }, */
  // },
});
