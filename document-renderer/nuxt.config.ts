import { Configuration } from '@nuxt/types';

const config: Configuration = {
    mode: 'universal',
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: ['~/assets/styles/globals.less'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [{ src: '@/plugins/vue-apexchart', ssr: false }],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: ['@nuxt/typescript-build'],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/bulma',
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {},
    server: {
        host: '0.0.0.0',
        port: 4300,
    },
    serverMiddleware: [{ path: '/health', handler: (req, res) => res.end('Healthy') }],
    typescript: {
        typeCheck: true,
    },
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {},
        standalone: true,
        devtools: true,
        loaders: {
            less: {},
        },
        postcss: {
            preset: {
                features: {
                    customProperties: false,
                },
            },
        },
    },
    styleResources: {
        less: './assets/styles/less/*.less',
    },
};

export default config;
