

import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default {
  base: '/jessiezhang199/',
  plugins: [sveltekit()],
  resolve: {
    alias: {
      components: resolve(__dirname, './src/components')
    }
  }
};
