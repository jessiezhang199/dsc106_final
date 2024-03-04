

import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default {
  base: '/dsc106_final/',
  plugins: [sveltekit()],
  resolve: {
    alias: {
      components: resolve(__dirname, './src/components')
    }
  }
};
