const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              '@primary-color': '#ec5a54', 
              '@light-primary-color':'#f49d9a',
              '@switch-color':'#ec5a54',
              '@primary': '#ec5a54', 
              '@main-bg':'#4e4f57',
              '@app-bg':'#4e4f57',
              '@body-background':'#4e4f57'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};