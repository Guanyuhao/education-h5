import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const singlePackages = new Set([
  'react',
  'react-dom',
  'echarts',
  // 你可以继续添加需要单独打包的库
]);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const packageName = id.toString().split('node_modules/')[1].split('/')[0].toString();
            // 如果该依赖在 singlePackages 集合中，则单独打包
            if (singlePackages.has(packageName)) {
              return packageName;
            }
            return 'vendors'; // 其他第三方库打包到 vendors.js
          }
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      }
    }
  }
})