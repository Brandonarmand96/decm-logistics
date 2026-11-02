import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['nexus-mark.svg'],
            manifest: {
                name: 'DECM Nexus Control Tower',
                short_name: 'Nexus',
                description: 'Logistics and procurement operations workspace',
                theme_color: '#082e6b',
                background_color: '#f4f1e9',
                display: 'standalone',
                start_url: '/',
                icons: [
                    { src: '/nexus-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
                    { src: '/nexus-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
                ]
            },
            workbox: { navigateFallback: '/index.html' }
        })
    ]
});
