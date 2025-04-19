import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias: {
      "@components" : path.resolve(__dirname, "src/components"),
      "@hooks" : path.resolve(__dirname, "src/hooks"),
      "@libs" : path.resolve(__dirname, "src/libs"),
      "@descriptions" : path.resolve(__dirname, "src/descriptions"),
      "@store" : path.resolve(__dirname, "src/store"),
      "@api" : path.resolve(__dirname, "src/api"),
      "@ui" : path.resolve(__dirname, "src/components/ui"),
      "@parts" : path.resolve(__dirname, "src/components/parts"),
      "@layouts" : path.resolve(__dirname, "src/components/layouts"),
      "@pages" : path.resolve(__dirname, "src/components/pages"),
    }
  }
})
