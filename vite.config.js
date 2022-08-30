const ip = require("ip");

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import styleImport from "vite-plugin-style-import";
import { svgBuilder } from "./src/plugin/icons/svgBuilder";
import AutoImport from "unplugin-auto-import/vite" // 自动导入插件
import Components from "unplugin-vue-components/vite" // 自动导入组件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

const srcPath = path.resolve(__dirname, 'src')

// function _resolve(dir) {
//   return path.resolve(__dirname, dir);
// }
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': `${srcPath}`
    },
  },
  plugins: [
    vue(),
    svgBuilder("./src/plugin/icons/svg/"),
    AutoImport ({
      imports: [
        "vue",
        "vue-router",
        {
          '@/utils/request': ['request']
        }
      ], // 自动导入vue和vue-router相关函数
      resolvers: [ElementPlusResolver()]
      // dts: "src/auto-import.d.ts" // 生成 `auto-import.d.ts` 全局声明
    }),
    Components({
      dirs: ['src/components'], // 配置需要默认导入的自定义组件文件夹，该文件夹下的所有组件都会自动 import
      resolvers: [ElementPlusResolver()]
    })
  ],
  server: {
    // 服务配置
    port: 9528, // 类型： number 指定服务器端口;
    open: true, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
    //proxy look for https://vitejs.cn/config/#server-proxy
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
