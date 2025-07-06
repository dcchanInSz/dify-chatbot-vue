import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      vue(),
      dts({
        include: ['src/lib'],
        outDir: 'dist/types',
      }),
    ],
    build: isLib
      ? {
          lib: {
            entry: resolve(__dirname, 'src/lib/index.ts'),
            name: 'DifyChatbot',
            fileName: format => `dify-chatbot-vue.${format}.js`,
            formats: ['es', 'umd'],
          },
          rollupOptions: {
            external: ['vue'],
            output: {
              globals: {
                vue: 'Vue',
              },
            },
          },
          cssCodeSplit: true,
          sourcemap: true,
        }
      : undefined,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})
