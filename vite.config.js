import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/canadian-medical/', // https://github.com/misunka/canadian-medical

})