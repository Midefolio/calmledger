import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), nodePolyfills({
    include: ['stream'],
    globals: { Buffer: true, process: true }
  })],
    optimizeDeps: {
    include: ['@solana/wallet-adapter-wallets'],
  },
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills({
          include: ['stream'],
          globals: { Buffer: true, process: true }
        })
      ]
    }
  }
})
