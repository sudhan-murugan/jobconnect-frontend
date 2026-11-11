import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Fail instead of silently moving to another port. The backend's CORS
    // allow-list expects http://localhost:5173.
    strictPort: true,
  },
  // Vitest (npm test) reuses this config. jsdom simulates a browser in Node,
  // so components can be rendered and clicked without opening a real browser.
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    restoreMocks: true, // undo vi.spyOn()/mocks after every test
  },
})
