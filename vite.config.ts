import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom'] },
  base: mode === 'github-pages' ? '/2026_GANZITHON_TEAM_17_FE/' : '/',
}));
