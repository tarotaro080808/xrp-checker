// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
// import firebase from 'firebase'

import firebase from 'firebase/app'
import 'firebase/database'

import VueAnalytics from 'vue-analytics'
import "./registerServiceWorker";

Vue.use(VueAnalytics, {
  id: 'UA-113631042-1',
  router
})
Vue.use(Vuex)
Vue.use(BootstrapVue)

const data = require('./resource.json');
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'ja',
  messages: data
});

const config = {
  apiKey: 'AIzaSyBkChUSLxdlYgDkZwgBSZZqiQktZpHUvqY',
  authDomain: 'xrp-checker.firebaseapp.com',
  databaseURL: 'https://xrp-checker.firebaseio.com',
  projectId: 'xrp-checker',
  storageBucket: 'xrp-checker.appspot.com',
  messagingSenderId: '705298664268'
}
firebase.initializeApp(config)

const store = new Vuex.Store({
  state: {
    tab: 1,
    modal: false,
    
    bitbank: null,
    bitbankPrice: 0,
    poloniex: null,
    poloniexPrice: null,
    poloniexBTC: null,

    bittrex: null,
    bittrexPrice: null,

    USD: null,
    EUR: null,

    timestampNow: 0,
    timestampDb: 0,

    moons: []
  },
  mutations: {
    setTab (state, payload) { state.tab = payload },
    setModal (state, payload) { state.modal = payload },

    setBitbank (state, payload) { state.bitbank = payload },
    setBitbankPrice (state, payload) { state.bitbankPrice = payload },
    setPoloniex (state, payload) { state.poloniex = payload },
    setPoloniexPrice (state, payload) { state.poloniexPrice = payload },
    setPoloniexBTC (state, payload) { state.poloniexBTC = payload },

    setBittrex (state, payload) { state.bittrex = payload },
    setBittrexPrice (state, payload) { state.bittrexPrice = payload },

    setUSD (state, payload) { state.USD = payload },
    setEUR (state, payload) { state.EUR = payload },

    setTimestampNow (state, payload) { state.timestampNow = payload },
    setTimestampDb (state, payload) { state.timestampDb = payload },

    setMoons (state, payload) { state.moons = payload },
  },
  getters: {
    tab(state) { return state.tab },
    modal(state) { return state.modal },

    bitbank(state) { return state.bitbank },
    bitbankPrice(state) { return state.bitbankPrice },
    poloniex(state) { return state.poloniex },
    poloniexPrice(state) { return state.poloniexPrice },
    poloniexBTC(state) { return state.poloniexBTC },
    bittrex(state) { return state.bittrex },
    bittrexPrice(state) { return state.bittrexPrice },

    USD(state) { return state.USD },
    EUR(state) { return state.EUR },

    timestampNow(state) { return state.timestampNow },
    timestampDb(state) { return state.timestampDb },

    moons(state) { return state.moons },
  }
})

const getTab = {
  template: `{{ tab }}`,
  computed: {
    change () {
      return this.$store.state.tab
    }
  }
}
const getModal = {
  template: `{{ modal }}`,
  computed: {
    change () {
      return this.$store.state.modal
    }
  }
}
const getMoons = {
  template: `{{ moons }}`,
  computed: {
    change () {
      return this.$store.state.moons
    }
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n: i18n,
  template: '<App/>',
  components: {
    App,
    getTab,
    getModal,
    getMoons,
  },
  methods: {
  }
})
