import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/petclinic/api': {
        target: 'http://localhost:9966',
        changeOrigin: true,
      },
    },
  },
});
