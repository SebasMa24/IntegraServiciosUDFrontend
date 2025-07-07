import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      __USER_API_URL__: JSON.stringify(env.VITE_USER_API_URL),
      __QUERIES_API_URL__: JSON.stringify(env.VITE_QUERIES_API_URL),
      __RESOURCE_API_URL__: JSON.stringify(env.VITE_RESOURCE_API_URL),
      __OPERATION_API_URL__: JSON.stringify(env.VITE_OPERATION_API_URL),
    },
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
      sourcemap: false, // Desactiva sourcemaps en producción
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  };
});