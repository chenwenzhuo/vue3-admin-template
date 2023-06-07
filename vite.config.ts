import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import path from 'path'

import {viteMockServe} from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    let env = loadEnv(mode, process.cwd());
    return {
        plugins: [
            vue(),
            createSvgIconsPlugin({
                // Specify the icon folder to be cached
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                // Specify symbolId format
                symbolId: 'icon-[dir]-[name]',
            }),
            viteMockServe({
                localEnabled: command === 'serve',
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        //scss全局变量配置
        css: {
            preprocessorOptions: {
                scss: {
                    javascriptEnabled: true,
                    additionalData: '@import "./src/styles/variables.scss";',
                },
            },
        },
        //代理跨域
        server: {
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_SERVE,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ''),
                }
            }
        }
    }
})
