const TerserPlugin = require('terser-webpack-plugin')
const Timestamp = new Date().getTime()
module.exports = {
  devServer: {
    // 跨域代理
    proxy: {
      '/dr-web': {
        target: 'https://dr.sit.ihomefnt.org',
        ws: false,
        changeOrigin: true
      }
    },
    overlay: {
      warnings: true,
      errors: true
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#586287', // 全局主色
          'link-color': '#586287',// 链接色，
          'error-color':'#E96C2E',
          'body-background':'#f5f5f5',
          'component-background':'#fff',
          'heading-color':'#5c5c5c',
          'text-color':'#5c5c5c',
          'text-color-secondary':'#d1d1d1',
          'text-color-dark':'#fff',
          'warming-color':'#c65050',
          'success-color':'#6ba469',
          'boder-coloe-base':'#e8e8e8',
          /*按钮重置样式*/
          'btn-height-lg': '48px',//大按钮基本高度为48
          'btn-height-base': '36px',//默认按钮基本高度为36
          'btn-height-sm': '28px',//小按钮基本高度为28
          'btn-border-radius-lg':'24px', // 此设置不生效，通过basestyle.css去控制
          'btn-border-radius-base': '18px', //设置按钮圆角
          'btn-border-radius-sm' : '14px', //设置小按钮圆角
          'btn-padding-lg':'0 20px',
          'btn-padding-base':'0 16px',
          'btn-padding-sm':'0 12px',
          'btn-font-size-sm':'12px',
          'btn-default-color':'#5c5c5c',
          'btn-default-bg':'#f5f5f5',
          'btn-default-border':'#f5f5f5',
          'btn-danger-color':'#5c5c5c',
          'btn-danger-border':'#f5f5f5',
          /*input重置样式*/
          'input-height-base': '36px',//设置默认input基本高度为36
          'input-height-lg': '48px',//设置大input基本高度为36
          'input-height-sm': '28px',//设置小input基本高度为36
          'input-padding-horizontal-lg' : '20px',
          'input-border-color':'#fff',
          'input-padding-vertical-base' : '4px',
          'input-padding-vertical-sm' : '1px',
          'input-padding-vertical-lg' : '6px',
          /*Modal对话框样式*/
          'modal-mask-bg': 'rgba(0, 0, 0, 0.8)', //设置对话框背景，透明度
          'font-family':'"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif',
          'pagination-font-family':'"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif',
          /*form*/
          'label-color':'#C7C7C7',
          'label-required-color':'#E96C2E',
          /*shadow */
          'shadow-color' : 'rgba(0, 0, 0, .1)',
          'box-shadow-base': '0 0 30px 0 rgba(0, 0, 0, .1)',
          'shadow-1-up': '0 0 30px 0 rgba(0, 0, 0, .1)',
          'shadow-1-down':'0 0 30px 0 rgba(0, 0, 0, .1)',
          'shadow-1-left' :'0 0 30px 0 rgba(0, 0, 0, .1)',
          'shadow-1-right' :'0 0 30px 0 rgba(0, 0, 0, .1)',
          'shadow-2' : '0 0 30px 0 rgba(0, 0, 0, .1)',
          /*分辨率设置 */
          'screen-xs' : '1024px',
          'screen-sm' : '1280px',
          'screen-md' : '1366px',
          'screen-lg' : '1440px',
          'screen-xl' : '1680px',
          'screen-xxl' : '1920px'
        },
        javascriptEnabled: true
      }
    }
  },
  // configureWebpack:config => {
  //   externals:{
  //     "vue": "Vue"
  //   },
  //   optimization: {
  //     minimizer: [new TerserPlugin({ terserOptions: { compress: { drop_console: true } } })]
  //   }
  // },
  chainWebpack: (config) => {
    config.output.filename(`[name].t=${Timestamp}.js`).end();
    config.output.chunkFilename(`[name].t=${Timestamp}.js`).end();
  },
  publicPath: process.env.NODE_ENV === 'production'? '/qt/': '/'
}
