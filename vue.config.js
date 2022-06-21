const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/wp-content/themes/drweedy-v3/assets/js/vue/vue-admin-sales-rep/dist/',
  indexPath: 'index.php'
})