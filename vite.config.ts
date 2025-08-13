import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import nodePolyfills from 'vite-plugin-node-polyfills';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      include: ['stream'],
      globals: { Buffer: true, process: true }
    })
  ],
  optimizeDeps: {
    include: ['@solana/wallet-adapter-wallets'],
  },
  build: {
    rollupOptions: {
      external: ['@solana/wallet-adapter-wallets'], // 👈 prevents Rollup from trying to bundle it
      plugins: [
        nodePolyfills({
          include: ['stream'],
          globals: { Buffer: true, process: true }
        })
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
