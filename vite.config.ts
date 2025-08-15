import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        // Keep CSS split by chunk instead of a single file
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                // Create smaller vendor chunks per package to avoid one huge vendor.js
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        const afterNm = id.split('node_modules/')[1];
                        // Get the top-level package name (handles scoped packages like @scope/pkg)
                        const pkg = afterNm.startsWith('@')
                            ? afterNm.split('/', 3).slice(0, 2).join('/')
                            : afterNm.split('/', 2)[0];
                        return `vendor-${pkg.replace(/[@/]/g, '-')}`;
                    }
                    // Default: let Rollup decide for app code (use React.lazy for deeper splits)
                    return undefined;
                },
                // Optional: keep deterministic names per chunk
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'assets/css/[name]-[hash][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                },
            },
        },
    },
});
