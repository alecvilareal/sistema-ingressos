    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      // Adicione esta linha para garantir que todos os caminhos dos assets
      // são absolutos, a partir da raiz do site.
      base: '/', 
    });