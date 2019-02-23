const pkg = require('./package')
const bodyParser = require('body-parser')
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'leaf',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js + Vuetify.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ],

  },
  plugins: [
    '~/plugins/vuetify.js',
    { src: '~plugins/mavon-editor', ssr: false }
  ],
  css: [
     '~/assets/style/app.styl',
     { src: '~/node_modules/highlight.js/styles/railscasts.css', lang: 'css' }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    extend(config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  },
  modules: [
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
  ],
  axios: {
    baseURL: process.env.BASE_URL || 'https://leaf-it.firebaseio.com',
    credentials: false
  },
  env: {
    baseUrl: process.env.BASE_URL || 'https://leaf-it.firebaseio.com',
    fbAPIKey: 'AIzaSyDOsnIWgXthFdwNBmjJBY2zzblwY7iJupc'
  },
}
