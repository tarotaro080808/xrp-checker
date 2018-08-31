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
          <div class="clearfix mt-3">
            <span class="">{{bitbank.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="bitbank.flg" v-on:click="changeToggle(bitbank)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-3">
            <span class="">{{poloniex.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="poloniex.flg" v-on:click="changeToggle(poloniex)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-3">
            <span class="">{{bittrex.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="bittrex.flg" v-on:click="changeToggle(bittrex)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
        </b-col>

        <b-col sm="4">
          <div class="clearfix mt-3">
            <span class="">{{poloniexBTC.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="poloniexBTC.flg" v-on:click="changeToggle(poloniexBTC)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-3">
            <span class="">{{bitfinexBTC.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="bitfinexBTC.flg" v-on:click="changeToggle(bitfinexBTC)">
              <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
            </label>
          </div>
          <div class="clearfix mt-3">
            <span class="">{{coincheckBTC.label}}</span>
            <label class="float-right switch switch-sm switch-pill switch-label switch-success mr-2">
              <input type="checkbox" class="switch-input" :checked="coincheckBTC.flg" v-on:click="changeToggle(coincheckBTC)">
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
        flg: 1
      },
      poloniex: {
        label: "Poloniex(XRP/BTC)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#f86c6b",
        flg: 1
      },
      poloniexBTC: {
        label: "Poloniex(BTC/USDT)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#e83e8c",
        flg: 1
      },
      bittrex: {
        label: "Bittrex(XRP/USD)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#0084D4",
        flg: 1
      },
      bitfinexBTC: {
        label: "Bitfinex(BTC/USD)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#4d93c1",
        flg: 1
      },
      coincheckBTC: {
        label: "Coincheck(BTC/JPY)",
        now: 0,
        diff: 0,
        diffTable: [],
        initVal: 0,
        color: "#20C2D3",
        flg: 1
      },

      label: [],
      flg: [],
      initFlg: {
        'bitbank': 1,
        'poloniex': 1,
        'poloniexBTC': 1,
        'bittrex': 1,
        'bitfinexBTC': 1,
        'coincheckBTC': 1,
      },
      myTimelineChart: null,
      init: true,
      initDb: true,
      intervalId: undefined,
    }
  },

  created() {
    this.flg = JSON.parse(localStorage.getItem('flg')) || this.initFlg;
    console.log(this.flg)

    for (let i=0; i<100; i++) {
      this.bitbank.diffTable[i] = "0"
      this.poloniex.diffTable[i] = "0"
      this.poloniexBTC.diffTable[i] = "0"
      this.bittrex.diffTable[i] = "0"
      this.bitfinexBTC.diffTable[i] = "0"
      this.coincheckBTC.diffTable[i] = "0"

      this.bitbank.flg = this.flg.bitbank
      this.poloniex.flg = this.flg.poloniex
      this.poloniexBTC.flg = this.flg.poloniexBTC
      this.bittrex.flg = this.flg.bittrex
      this.bitfinexBTC.flg = this.flg.bitfinexBTC
      this.coincheckBTC.flg = this.flg.coincheckBTC
      
      this.label[i] = 100 - i
    }

    // this.bitbank.flg = this.flg.bitbank ? this.flg.bitbank : 1;
  },
  
  methods: {
    setFlg: function () {
      this.flg = {
        'bitbank': this.bitbank.flg,
        'poloniex': this.poloniex.flg,
        'poloniexBTC': this.poloniexBTC.flg,
        'bittrex': this.bittrex.flg,
        'bitfinexBTC': this.bitfinexBTC.flg,
        'coincheckBTC': this.coincheckBTC.flg,
      }
      localStorage.setItem('flg', JSON.stringify(this.flg));
    },
    changeToggle: function (data) {
      if (data.flg) {
        data.flg = 0
      } else {
        data.flg = 1
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

    setChart: function (target) {
      const self = this
      if (target.flg === 1) {
        self.myTimelineChart.data.datasets.push(
          {
            label: target.label,
            data: target.diffTable,
            type: 'line',
            backgroundColor: hexToRgba(target.color, 0),
            borderColor: hexToRgba(target.color, 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis'
          }
        )
      }
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
        if (self.init === true) {
          self.init = false
        }
      }

      // DataのUpdate
      self.myTimelineChart.data.datasets = []

      self.setChart(self.bitbank)
      self.setChart(self.poloniex)
      self.setChart(self.poloniexBTC)
      self.setChart(self.bittrex)
      self.setChart(self.bitfinexBTC)
      self.setChart(self.coincheckBTC)

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
        datasets: [],
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
        }
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
