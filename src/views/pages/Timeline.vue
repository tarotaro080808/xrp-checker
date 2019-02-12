<template>
  <div class="animated fadeIn">
    <b-card>
      <b-row>
        <b-col sm="12">
          <h4 class="card-title mb-0" v-t="'timeline.title'"></h4>
          <div class="small text-muted text-uppercase">Chart Timeline</div>
          <p class="mt-3" v-t="'timeline.description'"></p>
        </b-col>

        <b-col sm="4">
          <div class="clearfix mt-2">
            <span class="">{{bitbank.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(bitbank.hidden)" v-on:click="changeToggle(bitbank)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-2">
            <span class="">{{bittrex.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(bittrex.hidden)" v-on:click="changeToggle(bittrex)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-2">
            <span class="">{{coincheck.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(coincheck.hidden)" v-on:click="changeToggle(coincheck)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
        </b-col>

        <b-col sm="4">
          <div class="clearfix mt-2">
            <span class="">{{poloniex.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(poloniex.hidden)" v-on:click="changeToggle(poloniex)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-2">
            <span class="">{{binance.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(binance.hidden)" v-on:click="changeToggle(binance)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-2">
            <span class="">{{bitfinex.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(bitfinex.hidden)" v-on:click="changeToggle(bitfinex)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
        </b-col>

        <b-col sm="4">
          <div class="clearfix mt-2">
            <span class="">{{poloniexBTC.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(poloniexBTC.hidden)" v-on:click="changeToggle(poloniexBTC)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-2">
            <span class="">{{bitfinexBTC.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(bitfinexBTC.hidden)" v-on:click="changeToggle(bitfinexBTC)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-2">
            <span class="">{{coincheckBTC.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="checkHidden(coincheckBTC.hidden)" v-on:click="changeToggle(coincheckBTC)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
        </b-col>

        <b-col sm="12" style="margin-top: 30px;">
          <canvas id="myTimelineChart" width="800" height="400"></canvas>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import BigNumber from 'bignumber.js'
import { hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import Chart from 'chart.js'
import { Switch as cSwitch } from '@coreui/vue'

export default {
  name: 'timeline',
  components: {
    hexToRgba,
    cSwitch
  },
  data: function () {
    return {
      bitbank: {
        label: "Bitbank(XRP/JPY)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#1ac2a6",
        hidden: false
      },
      poloniex: {
        label: "Poloniex(XRP/BTC)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#f86c6b",
        hidden: false
      },
      poloniexBTC: {
        label: "Poloniex(BTC/USDT)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#e83e8c",
        hidden: false
      },
      bittrex: {
        label: "Bittrex(XRP/USD)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#0084D4",
        hidden: false
      },
      bitfinexBTC: {
        label: "Bitfinex(BTC/USD)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#4d93c1",
        hidden: false
      },
      coincheckBTC: {
        label: "Coincheck(BTC/JPY)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#20C2D3",
        hidden: false
      },
      coincheck: {
        label: "Coincheck(XRP/JPY)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#0a818d",
        hidden: false
      },
      binance: {
        label: "Binance(XRP/BTC)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#e8b342",
        hidden: false
      },
      bitfinex: {
        label: "Bitfinex(XRP/BTC)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#21608a",
        hidden: false
      },

      label: [],
      flg: [],
      initFlg: {
        'bitbank': false,
        'poloniex': false,
        'poloniexBTC': false,
        'bittrex': false,
        'bitfinexBTC': false,
        'coincheckBTC': false,
        'coincheck': false,
        'binance': false,
        'bitfinex': false,
      },
      myTimelineChart: null,
      init: true,
      initDb: true,
      intervalId: undefined,
    }
  },

  created() {
    this.flg = JSON.parse(localStorage.getItem('flg')) || this.initFlg;

    for (let i=0; i<100; i++) {
      this.bitbank.diffTable[i] = "0"
      this.poloniex.diffTable[i] = "0"
      this.poloniexBTC.diffTable[i] = "0"
      this.bittrex.diffTable[i] = "0"
      this.bitfinexBTC.diffTable[i] = "0"
      this.coincheckBTC.diffTable[i] = "0"
      this.coincheck.diffTable[i] = "0"
      this.binance.diffTable[i] = "0"
      this.bitfinex.diffTable[i] = "0"

      this.bitbank.hidden = this.flg.bitbank
      this.poloniex.hidden = this.flg.poloniex
      this.poloniexBTC.hidden = this.flg.poloniexBTC
      this.bittrex.hidden = this.flg.bittrex
      this.bitfinexBTC.hidden = this.flg.bitfinexBTC
      this.coincheckBTC.hidden = this.flg.coincheckBTC
      this.coincheck.hidden = this.flg.coincheck
      this.binance.hidden = this.flg.binance
      this.bitfinex.hidden = this.flg.bitfinex
      
      this.label[i] = 100 - i
    }

    // this.bitbank.flg = this.flg.bitbank ? this.flg.bitbank : 1;
  },
  
  methods: {
    setFlg: function () {
      this.flg = {
        'bitbank': this.bitbank.hidden,
        'poloniex': this.poloniex.hidden,
        'poloniexBTC': this.poloniexBTC.hidden,
        'bittrex': this.bittrex.hidden,
        'bitfinexBTC': this.bitfinexBTC.hidden,
        'coincheckBTC': this.coincheckBTC.hidden,
        'coincheck': this.coincheck.hidden,
        'binance': this.binance.hidden,
        'bitfinex': this.bitfinex.hidden,
      }
      localStorage.setItem('flg', JSON.stringify(this.flg));
    },
    checkHidden: function (data) {
      if (data === true) {
        return false
      } else {
        return true
      }
    },
    changeToggle: function (data) {
      if (data.hidden) {
        data.hidden = false
      } else {
        data.hidden = true
      }
      this.setFlg()
      this.calcChart(true)
    },

    getDatabase: function (target, value) {
      const self = this
      if (self.initDb === true) {
        target.initVal = value
      }
      target.now = value
    },

    getData: function () {
      const self = this
      firebase.database().ref('ticker/').on('value', function(snapshot) {
        let dbData = snapshot.val()

        self.getDatabase(self.bitbank, dbData.bitbank)
        self.getDatabase(self.poloniex, dbData.poloniex)
        self.getDatabase(self.poloniexBTC, dbData.poloniexBTC)
        self.getDatabase(self.bittrex, dbData.bittrex)
        self.getDatabase(self.bitfinexBTC, dbData.bitfinexBTC)
        self.getDatabase(self.coincheckBTC, dbData.coincheckBTC)
        self.getDatabase(self.coincheck, dbData.coincheck)
        self.getDatabase(self.binance, dbData.binance)
        self.getDatabase(self.bitfinex, dbData.bitfinex)

        if (self.initDb === true) {
          self.initDb = false
        }
      })
    },

    setData: function (target) {
      const self = this
      if (target.initVal === 0 || self.init === true) {
        target.diff = 0
      } else {
        target.diff = target.now / target.initVal * 100 - 100
      }
      target.diffTable.push(target.diff)
      target.diffTable.shift()
    },

    setChart: function (target, num) {
      const self = this
      self.myTimelineChart.data.datasets[num].data = target.diffTable
      self.myTimelineChart.data.datasets[num].hidden = target.hidden
    },

    calcChart: function (update) {
      const self = this
      if (update === false) {
        self.setData(self.bitbank)
        self.setData(self.poloniex)
        self.setData(self.poloniexBTC)
        self.setData(self.bittrex)
        self.setData(self.bitfinexBTC)
        self.setData(self.coincheckBTC)
        self.setData(self.coincheck)
        self.setData(self.binance)
        self.setData(self.bitfinex)
        if (self.init === true) {
          self.init = false
        }
      }

      // DataのUpdate

      self.setChart(self.bitbank, 0)
      self.setChart(self.poloniex, 1)
      self.setChart(self.poloniexBTC, 2)
      self.setChart(self.bittrex, 3)
      self.setChart(self.bitfinexBTC, 4)
      self.setChart(self.coincheckBTC, 5)
      self.setChart(self.coincheck, 6)
      self.setChart(self.binance, 7)
      self.setChart(self.bitfinex, 8)

      self.myTimelineChart.options.scales.yAxes[0].ticks.callback = function(value, index, values) {
        return value + '%'
      }
      self.myTimelineChart.update() // チャートの更新

      return true
    },
  },

  mounted() {
    const self = this
    const format = {
      decimalSeparator: '.',
      groupSeparator: '',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: ' ',
      fractionGroupSize: 0
    }
    BigNumber.config({DECIMAL_PLACES: 4}) // 小数点2桁
    BigNumber.config({FORMAT: format})


    let ctx = document.getElementById("myTimelineChart").getContext('2d')
    self.myTimelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: self.bitbank.label,
            data: self.bitbank.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.bitbank.color, 0),
            borderColor: hexToRgba(self.bitbank.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.bitbank.hidden
          },
          {
            label: self.poloniex.label,
            data: self.poloniex.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.poloniex.color, 0),
            borderColor: hexToRgba(self.poloniex.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.poloniex.hidden
          },
          {
            label: self.poloniexBTC.label,
            data: self.poloniexBTC.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.poloniexBTC.color, 0),
            borderColor: hexToRgba(self.poloniexBTC.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.poloniexBTC.hidden
          },
          {
            label: self.bittrex.label,
            data: self.bittrex.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.bittrex.color, 0),
            borderColor: hexToRgba(self.bittrex.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.bittrex.hidden
          },
          {
            label: self.bitfinexBTC.label,
            data: self.bitfinexBTC.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.bitfinexBTC.color, 0),
            borderColor: hexToRgba(self.bitfinexBTC.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.bitfinexBTC.hidden
          },
          {
            label: self.coincheckBTC.label,
            data: self.coincheckBTC.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.coincheckBTC.color, 0),
            borderColor: hexToRgba(self.coincheckBTC.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.coincheckBTC.hidden
          },
          {
            label: self.coincheck.label,
            data: self.coincheck.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.coincheck.color, 0),
            borderColor: hexToRgba(self.coincheck.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.coincheck.hidden
          },
          {
            label: self.binance.label,
            data: self.binance.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.binance.color, 0),
            borderColor: hexToRgba(self.binance.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.binance.hidden
          },
          {
            label: self.bitfinex.label,
            data: self.bitfinex.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(self.bitfinex.color, 0),
            borderColor: hexToRgba(self.bitfinex.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            hidden: self.bitfinex.hidden
          },

        ],
        labels: self.label,
        borderWidth: 0.5,
      },
      options: {
        scales: {
          yAxes: [{
            id: 'left-y-axis',
            type: 'linear',
            position: 'left',
            ticks: {
              callback: function(value, index, values) {
                return value + '%'
              }
            }
          }]
        },
        elements: {
          point: {
            radius: 1
          },
          line: {
            tension: 0, // ベジェ曲線を無効にする
          }
        },
        maintainAspectRatio: false,
      }
    })

    function getChart () {
      if (self.init) {
        self.getData()
        self.calcChart(false)
      } else {
        self.calcChart(false)
      }
    }


    getChart()
    this.intervalId = setInterval(() => {
      getChart()
    }, 1000 * 5)
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  }
}
</script>
