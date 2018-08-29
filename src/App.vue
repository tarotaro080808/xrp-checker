<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
  // CoreUI Icons Set
  @import '~@coreui/icons/css/coreui-icons.min.css';
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome.scss';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/scss/simple-line-icons.scss';
  /* Import Flag Icons Set */
  @import '~flag-icon-css/css/flag-icon.min.css';
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  // Import Main styles for this application

  @import url('https://fonts.googleapis.com/css?family=Lato');
  @font-face{
    font-family: 'Noto Sans Cjk';
    src: url('./assets/fonts/NotoSansCJKjp-DemiLight.eot');
    src: url('./assets/fonts/NotoSansCJKjp-DemiLight.eot?#iefix') format('embedded-opentype'),
        url('./assets/fonts/NotoSansCJKjp-DemiLight.woff') format('woff'),
        url('./assets/fonts/NotoSansCJKjp-DemiLight.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face{
    font-family: 'Noto Sans Cjk';
    src: url('./assets/fonts/NotoSansCJKjp-Medium.eot');
    src: url('./assets/fonts/NotoSansCJKjp-Medium.eot?#iefix') format('embedded-opentype'),
        url('./assets/fonts/NotoSansCJKjp-Medium.woff') format('woff'),
        url('./assets/fonts/NotoSansCJKjp-Medium.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }

  @import 'assets/scss/style';

  
</style>
