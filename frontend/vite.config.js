import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from 'tailwindcss'

/* src/index.css */



// https://vite.dev/config/
export default defineConfig({
  server:{
    
  },
  plugins: [react()],
})
