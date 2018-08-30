<template>
  <nav class="sidebar-nav">
    <VuePerfectScrollbar class="scroll-area" :settings="psSettings" @ps-scroll-y="scrollHandle">
    <ul class="nav">
      <template v-for="(item, index) in navItems">
        <template v-if="item.title">
          <SidebarNavTitle :key="index" :name="item.name" :classes="item.class" :wrapper="item.wrapper"/>
        </template>
        <template v-else-if="item.divider">
          <SidebarNavDivider :key="index" :classes="item.class"/>
        </template>        
        <template v-else-if="item.label">
          <SidebarNavLabel :key="index" :name="item.name" :url="item.url" :icon="item.icon" :label="item.label" :classes="item.class"/>
        </template>

        <template v-else-if="item.tab == 1">
          <li v-bind:key="index" data-v-1282947e="" class="nav-item">
            <div data-v-1282947e="">
              <div class="nav-link" v-on:click="tabChange(1)">
                <i class="nav-icon icon-wallet"></i> {{ $t('menu.balanceAsset') }}
              </div>
            </div>
          </li>
        </template>

        <template v-else-if="item.tab == 2">
          <li v-bind:key="index" data-v-1282947e="" class="nav-item">
            <div data-v-1282947e="">
              <div class="nav-link" v-on:click="tabChange(2)">
                <i class="nav-icon cui-clipboard icons"></i> {{ $t('menu.transaction') }}
              </div>
            </div>
          </li>
        </template>

        <template v-else-if="item.tab == 3">
          <li v-bind:key="index" data-v-1282947e="" class="nav-item">
            <div data-v-1282947e="">
              <div class="nav-link" v-on:click="tabChange(3)">
                <i class="nav-icon icon-doc"></i> {{ $t('menu.updatePlan') }}
              </div>
            </div>
          </li>
        </template>

        <template v-else-if="item.tab == 4">
          <li v-bind:key="index" data-v-1282947e="" class="nav-item">
            <div data-v-1282947e="">
              <div class="nav-link" v-on:click="tabChange(4)">
                <i class="nav-icon icon-doc"></i> {{ $t('menu.termsOfService') }}
              </div>
            </div>
          </li>
        </template>

        <template v-else-if="item.tab == 5">
          <li v-bind:key="index" data-v-1282947e="" class="nav-item">
            <div data-v-1282947e="">
              <div class="nav-link" v-on:click="tabChange(5)">
                <i class="nav-icon cui-puzzle icons"></i> {{ $t('menu.profitEstimate') }}
              </div>
            </div>
          </li>
        </template>

        <template v-else-if="item.tab == 'donate'">
          <li v-bind:key="index" data-v-1282947e="" class="nav-item">
            <div data-v-1282947e="">
              <a class="nav-link" :href="item.url" target="_blank">
                <i class="nav-icon cui-user icons"></i> {{ $t('menu.donate') }}
              </a>
            </div>
          </li>
        </template>

        <template v-else-if="item.tab == 'timeline'">
          <li v-bind:key="index" data-v-1282947e="" class="nav-item">
            <div data-v-1282947e="">
              <a class="nav-link" v-on:click="subpage(item.url)" target="_blank">
                <i class="nav-icon cui-chart icons"></i> {{ $t('menu.timeline') }}
              </a>
            </div>
          </li>
        </template>

        <template v-else>
          <template v-if="item.children">
            <!-- First level dropdown -->
            <SidebarNavDropdown :key="index" :name="item.name" :url="item.url" :icon="item.icon">
              <template v-for="(childL1, index1) in item.children">
                <template v-if="childL1.children">
                  <!-- Second level dropdown -->
                  <SidebarNavDropdown :key="index1" :name="childL1.name" :url="childL1.url" :icon="childL1.icon">
                    <li :key="index2" class="nav-item" v-for="(childL2, index2) in childL1.children">
                      <SidebarNavLink :name="childL2.name" :url="childL2.url" :icon="childL2.icon" :badge="childL2.badge" :variant="item.variant"/>
                    </li>
                  </SidebarNavDropdown>
                </template>
                <template v-else>
                  <SidebarNavItem :key="index1" :classes="item.class">
                    <SidebarNavLink :name="childL1.name" :url="childL1.url" :icon="childL1.icon" :badge="childL1.badge" :variant="item.variant"/>
                  </SidebarNavItem>
                </template>
              </template>
            </SidebarNavDropdown>
          </template>
          <template v-else>
            <SidebarNavItem :key="index" :classes="item.class">
              <SidebarNavLink :name="item.name" :url="item.url" :icon="item.icon" :badge="item.badge" :variant="item.variant"/>
            </SidebarNavItem>
          </template>
        </template>
      </template>
    </ul>
    <slot></slot>
    </VuePerfectScrollbar>
  </nav>
</template>

<script>
import SidebarNavDivider from '@coreui/vue/src/components/Sidebar/SidebarNavDivider'
import SidebarNavDropdown from '@coreui/vue/src/components/Sidebar/SidebarNavDropdown'
import SidebarNavLink from '@coreui/vue/src/components/Sidebar/SidebarNavLink'
import SidebarNavTitle from '@coreui/vue/src/components/Sidebar/SidebarNavTitle'
import SidebarNavItem from '@coreui/vue/src/components/Sidebar/SidebarNavItem'
import SidebarNavLabel from '@coreui/vue/src/components/Sidebar/SidebarNavLabel'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { sidebarCssClasses, validBreakpoints, checkBreakpoint } from '@coreui/vue/src/shared/classes'
import toggleClasses from '@coreui/vue/src/shared/toggle-classes'

export default {
  name: 'SidebarNavCustom',
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    },
    defaultOpen: {
      type: Boolean,
      default: true
    },
    display: {
      type: String,
      default: 'lg'
    },
    mobile: {
      type: Boolean,
      default: false
    }

  },
  components: {
    SidebarNavDivider,
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle,
    SidebarNavItem,
    SidebarNavLabel,
    VuePerfectScrollbar
  },
  data () {
    return {
      psSettings: {
        maxScrollbarLength: 200,
        minScrollbarLength: 40,
        suppressScrollX: true,
        wheelPropagation: false,
        interceptRailY: styles => ({ ...styles, height: 0 }),
      }
    }
  },
  methods: {
    toggle (force) {
      const [display, mobile] = [this.display, this.mobile]
      let cssClass = sidebarCssClasses[0]
      if (!mobile && display && checkBreakpoint(display, validBreakpoints)) {
        cssClass = `sidebar-${display}-show`
      }
      toggleClasses(cssClass, sidebarCssClasses, force)
    },

    scrollHandle (evt) {
       console.log(evt)
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
          this.$router.push('/' + lang + '?q=' + this.$route.query.q)
        } else {
          this.$router.push('/' + lang)
        }
      }
      if (window.innerWidth < 769) {
        this.toggle();
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
        this.$router.push('/' + lang + url + '?q=' + this.$route.query.q)
      } else {
        this.$router.push('/' + lang + url)
      }
    }
  }
}
</script>

<style scoped lang="css">
  .scroll-area {
    position: absolute;
    height: 100%;
    margin: auto;
  }
    .sidebar .sidebar-nav {
    width: 230px;
  }
  .sidebar .nav {
    width: 230px;
  }
</style>
