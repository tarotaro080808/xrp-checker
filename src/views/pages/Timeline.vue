<template>
  <div class="animated fadeIn">
    <b-card>
      <b-row>
        <b-col sm="12">
          <h4 class="card-title mb-0" v-t="'timeline.title'"></h4>
          <div class="small text-muted text-uppercase">Chart Timeline</div>
          <p class="mt-3" v-t="'timeline.description'"></p>
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

export default {
  name: 'timeline',
  components: {
    hexToRgba,
  },
  data: function () {
    return {
      bitbank: 0,
      poloniex: 0,
      poloniexBtc: 0,
      bittrex: 0,

      diff: {
        bitbank: 0,
        poloniex: 0,
        poloniexBtc: 0,
        bittrex: 0
      },
      diffTable: {
        bitbank: [],
        poloniex: [],
        poloniexBtc: [],
        bittrex: []
      },
      initVal: {
        bitbank: 0,
        poloniex: 0,
        poloniexBtc: 0,
        bittrex: 0
      },
      label: [],

      myTimelineChart: null,

      init: true,
      initDb: true,

      intervalId: undefined
    }
  },
  methods: {
    
  },
  created() {
    for (let i=0; i<100; i++) {
      this.diffTable.bitbank[i] = "0"
      this.diffTable.poloniex[i] = "0"
      this.diffTable.poloniexBtc[i] = "0"
      this.diffTable.bittrex[i] = "0"
      this.label[i] = 100 - i
    }
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

    function getData () {
      firebase.database().ref('ticker/').on('value', function(snapshot) {
        let dbData = snapshot.val()
        // 初回値の保存
        if (self.initDb === true) {
          self.initVal.bitbank = dbData.bitbank
          self.initVal.poloniex = dbData.poloniex
          self.initVal.poloniexBtc = dbData.poloniexBTC
          self.initVal.bittrex = dbData.bittrex
          self.initDb = false
        }

        // 今回値の保存
        self.bitbank = dbData.bitbank
        self.poloniex = dbData.poloniex
        self.poloniexBtc = dbData.poloniexBTC
        self.bittrex = dbData.bittrex
      })
    }
    function calcChart () {
      if (self.init === false) {
        // 2回目以降
        if (self.initVal.bitbank === 0) {
          self.diff.bitbank = 0
        } else {
          self.diff.bitbank = self.bitbank / self.initVal.bitbank * 100 - 100
        }

        if (self.initVal.poloniex === 0) {
          self.diff.poloniex = 0
        } else {
          self.diff.poloniex = self.poloniex / self.initVal.poloniex * 100 - 100
        }

        if (self.initVal.poloniexBtc === 0) {
          self.diff.poloniexBtc = 0
        } else {
          self.diff.poloniexBtc = self.poloniexBtc / self.initVal.poloniexBtc * 100 - 100
        }

        if (self.initVal.bittrex === 0) {
          self.diff.bittrex = 0
        } else {
          self.diff.bittrex = self.bittrex / self.initVal.bittrex * 100 - 100
        }
      } else {

        // 初回は0を代入
        self.diff.bitbank = 0
        self.diff.poloniex = 0
        self.diff.poloniexBtc = 0
        self.diff.bittrex = 0
        self.init = false
      }

      self.diffTable.bitbank.push(self.diff.bitbank)
      self.diffTable.bitbank.shift()
      self.diffTable.poloniex.push(self.diff.poloniex)
      self.diffTable.poloniex.shift()
      self.diffTable.poloniexBtc.push(self.diff.poloniexBtc)
      self.diffTable.poloniexBtc.shift()
      self.diffTable.bittrex.push(self.diff.bittrex)
      self.diffTable.bittrex.shift()

      // DataのUpdate
      self.myTimelineChart.data.datasets[0].data = self.diffTable.bitbank
      self.myTimelineChart.data.datasets[1].data = self.diffTable.poloniex
      self.myTimelineChart.data.datasets[2].data = self.diffTable.poloniexBtc
      self.myTimelineChart.data.datasets[3].data = self.diffTable.bittrex
      self.myTimelineChart.options.scales.yAxes[0].ticks.callback = function(value, index, values) {
        return value + '%'
      }
      self.myTimelineChart.update() // チャートの更新

      return true
    }

    function getChart () {
      if (self.init) {
        getData()
        calcChart()
      } else {
        calcChart()
      }
    }

    let ctx = document.getElementById("myTimelineChart").getContext('2d')
    self.myTimelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Bitbank(XRP/JPY)',
            data: self.diffTable.bitbank,
            type: 'line',
            backgroundColor: hexToRgba('#1ac2a6', 0),
            borderColor: hexToRgba('#1ac2a6', 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis'
          },
          {
            label: 'Poloniex(XRP/BTC)',
            data: self.diffTable.poloniex,
            type: 'line',
            backgroundColor: hexToRgba('#f86c6b', 0),
            borderColor: hexToRgba('#f86c6b', 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
            },
          {
            label: 'Poloniex(BTC/USDT)',
            data: self.diffTable.poloniexBtc,
            type: 'line',
            backgroundColor: hexToRgba('#e83e8c', 0),
            borderColor: hexToRgba('#e83e8c', 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
          },
          {
            label: 'Bittrex(XRP/USD)',
            data: self.diffTable.bittrex,
            type: 'line',
            backgroundColor: hexToRgba('#0084D4', 0),
            borderColor: hexToRgba('#0084D4', 70),
            borderWidth: 2,
            yAxisID: 'left-y-axis',
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
        }
      }
    })
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
