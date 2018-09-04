<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="/">
        XRP Checker
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg" />
      <!-- <b-navbar-nav class="d-md-down-none">
        <b-nav-item class="px-2" v-on:click="tabChange(1)">{{ $t('menu.balanceAsset') }}</b-nav-item>
        <b-nav-item class="px-2" v-on:click="tabChange(2)">{{ $t('menu.transaction') }}</b-nav-item>
        <b-nav-item class="px-2" v-on:click="tabChange(5)">{{ $t('menu.profitEstimate') }}</b-nav-item>
        <b-nav-item class="px-2" v-on:click="tabChange(3)">{{ $t('menu.updatePlan') }}</b-nav-item>
        <b-nav-item class="px-2" v-on:click="tabChange(4)">{{ $t('menu.termsOfService') }}</b-nav-item>
      </b-navbar-nav> -->
      <b-navbar-nav class="ml-auto">
        <b-dropdown size="md" id="ddown_secondary" text="Language" variant="light" class="language-switcher mr-3" v-if="getLang() == 'en'">
          <b-dropdown-item href="#">English (Current)</b-dropdown-item>
          <b-dropdown-item :href="changeLang('de')">German</b-dropdown-item>
          <b-dropdown-item :href="changeLang('ja')">Japanese</b-dropdown-item>
        </b-dropdown>

        <b-dropdown size="md" id="ddown_secondary" text="Language" variant="light" class="language-switcher mr-3" v-else-if="getLang() == 'de'">
          <b-dropdown-item href="#">Deutsch (Position)</b-dropdown-item>
          <b-dropdown-item :href="changeLang('en')">Englisch</b-dropdown-item>
          <b-dropdown-item :href="changeLang('ja')">Japanisch</b-dropdown-item>
        </b-dropdown>

        <b-dropdown size="md" id="ddown_secondary" text="Language" variant="light" class="language-switcher mr-3" v-else >
          <b-dropdown-item href="#">日本語</b-dropdown-item>
          <b-dropdown-item :href="changeLang('en')">英語</b-dropdown-item>
          <b-dropdown-item :href="changeLang('de')">ドイツ語</b-dropdown-item>
        </b-dropdown>
      </b-navbar-nav>
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarNavCustom :navItems="nav"></SidebarNavCustom>
        <div id="xrptipbot">
          <iframe src="https://www.xrptipbot.com/donate/button?to=tarotaro080808&amp;network=twitter&amp;amount=0.2&amp;label=null&amp;labelpt=null&amp;unique=null" width="180" height="60" class="xrptipbot-tipper" marginheight="0" align="top" scrolling="no" frameborder="0" style="width: 275px; height: 60px; border: none;"></iframe>
        </div>
      </AppSidebar>
      <main class="main">
        <template>
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <span class="active">{{ getName() }}</span>
            </li>
          </ol>
        </template>
        <div class="container-fluid">
          <router-view></router-view>

          <b-card>
            <b-row>
              <b-col cols="6" sm="4">
                <span role="menuitem" v-on:click="tabChange(1)" target="_self" class="font-xs dropdown-item"><i class="nav-icon icon-wallet"></i>{{ $t('menu.balanceAsset') }}</span>
              </b-col>
              <b-col cols="6" sm="4">
                <span role="menuitem" v-on:click="tabChange(2)" target="_self" class="font-xs dropdown-item"><i class="nav-icon cui-clipboard icons"></i>{{ $t('menu.transaction') }}</span>
              </b-col>
              <b-col cols="6" sm="4">
                <span role="menuitem" v-on:click="tabChange(5)" target="_self" class="font-xs dropdown-item"><i class="nav-icon cui-puzzle icons"></i>{{ $t('menu.profitEstimate') }}</span>
              </b-col>
              <b-col cols="6" sm="4">
                <span role="menuitem" v-on:click="subpage('timeline')" target="_self" class="font-xs dropdown-item"><i class="nav-icon cui-chart icons"></i>{{ $t('menu.timeline') }}</span>
              </b-col>
              <b-col cols="6" sm="4">
                <span role="menuitem" v-on:click="tabChange(3)" target="_self" class="font-xs dropdown-item"><i class="nav-icon icon-doc"></i>{{ $t('menu.updatePlan') }}</span>
              </b-col>
              <b-col cols="6" sm="4">
                <span role="menuitem" v-on:click="tabChange(4)" target="_self" class="font-xs dropdown-item"><i class="nav-icon icon-doc"></i>{{ $t('menu.termsOfService') }}</span>
              </b-col>
            </b-row>
          </b-card>
        </div>
      </main>
    </div>
    <TheFooter>
      @tarotaro080808　|　<a href="https://twitter.com/tarotaro080808" target="_blank">Twitter</a>
      <!--footer-->
    </TheFooter>
  </div>
</template>

<script>
import nav from '@/_nav'
import { Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarMinimizer, SidebarNav, Footer as TheFooter, Breadcrumb } from '@coreui/vue'
import SidebarNavCustom from './SidebarNavCustom'
import { sidebarCssClasses, validBreakpoints, checkBreakpoint } from '@coreui/vue/src/shared/classes'
import toggleClasses from '@coreui/vue/src/shared/toggle-classes'

export default {
  name: 'full',
  components: {
    AppHeader,
    AppSidebar,
    TheFooter,
    Breadcrumb,
    SidebarToggler,
    SidebarNav,
    SidebarMinimizer,
    SidebarNavCustom
  },
  data: function () {
    return {
      pageName: 'トップページ',
      nav: nav.items,
    }
  },
  created () {
    if (this.$route.params.lang === 'ja' || this.$route.params.lang === 'en' || this.$route.params.lang === 'de') {
      this.$i18n.locale = this.$route.params.lang
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter((route) => route.name || route.meta.label )
    }
  },
  methods: {
    getName () {
      if (this.$route.meta.label === 'タイムライン') {
        this.pageName = this.$t("menu.topPage") + " " + this.$t("menu.separate") + " " + this.$t("menu.timeline")
      } else if (this.$store.state.tab === 1) {
        this.pageName = this.$t("menu.topPage") + " " + this.$t("menu.separate") + " " + this.$t("menu.balanceAsset")
      } else if (this.$store.state.tab === 2) {
        this.pageName = this.$t("menu.topPage") + " " + this.$t("menu.separate") + " " + this.$t("menu.transaction")
      } else if (this.$store.state.tab === 3) {
        this.pageName = this.$t("menu.topPage") + " " + this.$t("menu.separate") + " " + this.$t("menu.updatePlan")
      } else if (this.$store.state.tab === 4) {
        this.pageName = this.$t("menu.topPage") + " " + this.$t("menu.separate") + " " + this.$t("menu.termsOfService")
      } else if (this.$store.state.tab === 5) {
        this.pageName = this.$t("menu.topPage") + " " + this.$t("menu.separate") + " " + this.$t("menu.profitEstimate")
      }
      return this.pageName
    },
    getLang () {
      return this.$i18n.locale
    },
    changeLang (lang) {
      let res
      let param = ''
      let url = ''

      if (this.$route.meta.label === 'タイムライン') {
        url = 'timeline'
      }
      if (this.$route.query.q !== undefined) {
        param = "?q="+this.$route.query.q
      }
      if (lang == 'en' || lang == 'de') {
        res = `/${lang}/${url}${param}`
      } else if (lang == 'ja') {
        res = `/${url}${param}`
      } else {
        res = "#"
      }
      return res
    },

    toggle (force) {
      const [display, mobile] = [this.display, this.mobile]
      let cssClass = sidebarCssClasses[0]
      if (!mobile && display && checkBreakpoint(display, validBreakpoints)) {
        cssClass = `sidebar-${display}-show`
      }
      toggleClasses(cssClass, sidebarCssClasses, force)
    },

    tabChange: function (state) {
      this.$store.commit('setTab', state)
      let lang

      if (this.$i18n.locale === 'en') {
        lang = 'en/'
      } else if (this.$i18n.locale === 'de') {
        lang = 'de/'
      } else {
        lang = ''
      }

      if (this.$route.meta.label === 'タイムライン') {
        if (this.$route.query.q !== undefined) {
          this.$router.push({ path: `/${lang}`, query: { q: this.$route.query.q }})
        } else {
          this.$router.push({ path: `/${lang}` })
        }
      }
    },

    subpage: function (url) {
      let lang

      if (this.$i18n.locale === 'en') {
        lang = 'en/'
      } else if (this.$i18n.locale === 'de') {
        lang = 'de/'
      } else {
        lang = ''
      }

      if (this.$route.query.q !== undefined) {
        this.$router.push({ path: `/${lang}${url}`, query: { q: this.$route.query.q }})
      } else {
        this.$router.push({ path: `/${lang}${url}` })
      }
    },
    onSwipeRight: function () {
      if (window.innerWidth < 769) {
        this.toggle(true);  

      }
    }
  }
}
</script>
<style scoped>
  .dropdown-item {
    padding: 10px;
  }
  .navbar-brand {
    color: #283a71;
    font-weight: bold;
  }
  .main .container-fluid {
    padding-left: 10px;
    padding-right: 10px;
  }
  #xrptipbot {
    padding-left: 10px;
    padding-right: 5px;
    margin-bottom: 40px;
  }
  @media (max-width: 767px) {
    #xrptipbot {
      margin-bottom: 65px;
    }
  }
  #xrptipbot iframe {
    max-width: 100%;
  }
  .vtouchobj {
    user-select: auto !important;
  }
  html:not([dir="rtl"]) .sidebar {
    margin-left: -230px;
  }
  html:not([dir="rtl"]) .sidebar-show .sidebar {
    margin-left: 0 !important;
  }
  @media (min-width: 576px) {
    html:not([dir="rtl"]) .sidebar-show.sidebar-fixed .main, html:not([dir="rtl"]) .sidebar-show.sidebar-fixed .app-footer {
      margin-left: 230px;
    }
  }
  @media (max-width: 768px) {
    .vtouchobj {
      user-select: none !important;
    }
  }
  @media (min-width: 992px) {
    .sidebar-fixed .sidebar {
      width: 230px;
    }
    html:not([dir="rtl"]) .sidebar-lg-show .sidebar {
      margin-left: 0 !important;
    }
  }
  @media (min-width: 576px) and (min-width: 992px) {
    html:not([dir="rtl"]) .sidebar-lg-show.sidebar-fixed .main, html:not([dir="rtl"]) .sidebar-lg-show.sidebar-fixed .app-footer {
      margin-left: 230px;
    }
  }
  
  @media (max-width: 991.98px) {
    .sidebar {
      width: 230px;
    }
  }


</style>
