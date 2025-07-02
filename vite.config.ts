import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      __USER_API_URL__: JSON.stringify(env.VITE_USER_API_URL),
    },
    server: {
      port: 5173, // o el que quieras
    },
  };
});