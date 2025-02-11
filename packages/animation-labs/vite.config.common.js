import path from 'path';

export const commonOption = {
  base: './',
  resolve: {
    alias: {
      '@model': path.resolve(__dirname, './src/model'),
      '@view': path.resolve(__dirname, './src/view'),
      '@demo': path.resolve(__dirname, './src/demo'),
    },
  },
};
