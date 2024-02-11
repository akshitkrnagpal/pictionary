import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { socketIO } from './src/server/vite-plugin';

export default defineConfig({
  plugins: [tsconfigPaths(), socketIO(), react()],
});
