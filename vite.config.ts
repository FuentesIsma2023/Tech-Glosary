import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // **Añade esta línea para corregir las rutas relativas**
  base: './', 
  
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});