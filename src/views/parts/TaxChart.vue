<template>
    <b-row v-bind="moons">
      <b-col sm="12" style="margin-top: 30px;">
        <canvas id="myChart2" width="800" height="400"></canvas>
      </b-col>
    </b-row>
</template>

<script>
import BigNumber from 'bignumber.js'
import Chart from 'chart.js'
import { hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

export default {
  components: {
    hexToRgba,
  },
  name: 'taxchart',
  // 以下のデータが揃ったタイミングを待ち合わせて処理開始
  // totalBalance: 合計Balance
  // transactionChart: 月毎の取引数量
  props: ["value", "update"],
  data: function () {
    return {
      updateMoon: this.update,
      myChart: null,
      moonLabel: [],
      moonPrice: [],
      moonTax: [],
    }
  },
  computed: {
    moons () {
      return this.$store.state.moons
    }
  },

  watch: {
    moons: function () {
      let format = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      }
      this.calcMoonList()
      this.myChart.data.datasets[0].data = this.moonTax
      this.myChart.data.datasets[1].data = this.moonPrice
      this.myChart.options.scales.yAxes[0].ticks.callback = function(value, index, values) {
        BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})
        return '¥' + new BigNumber(value, 10).toFormat()
      }
      this.myChart.update() // チャートの更新
    },
  },
  methods: {
    calcMoonList: function () {
      const self = this
      let colA = []
      let colB = []
      this.moonLabel = []
      this.moonPrice = []
      this.moonTax = []
      this.$store.state.moons.forEach(function (value, key, array) {
        self.moonLabel.push(value.balance)
        self.moonTax.push(value.totalTax)
        self.moonPrice.push(value.profits)
      })
    },
    renderChart: function () {
      const format = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      }
      const format2 = {
        decimalSeparator: '.',
        groupSeparator: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: '',
        fractionGroupSize: 0
      }
      // 小数点4桁、カンマ区切り無し
      BigNumber.config({DECIMAL_PLACES: 4, FORMAT: format2})

      const self = this

      this.calcMoonList()

      var ctx = document.getElementById("myChart2").getContext('2d')
      this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: [
            {
              label: self.$t("tax.tax"),
              data: self.moonTax,
              backgroundColor: hexToRgba('#39a3ec', 20),
              borderColor: hexToRgba('#39a3ec', 100),
              borderWidth: 0.8,
              type: 'bar',
              yAxisID: 'right-y-axis',
            },
            {
              label: self.$t("tax.profit"),
              data: self.moonPrice,
              backgroundColor: hexToRgba('#ff9f40', 20),
              borderColor: hexToRgba('#ff9f40', 100),
              borderWidth: 0.8,
              type: 'bar',
              yAxisID: 'right-y-axis',
            },
          ],
          labels: self.moonLabel,
          borderWidth: 1
        },
        options: {
          scales: {
            xAxes: [{
              stacked: true, //積み上げ棒グラフにする設定
              categoryPercentage:0.4 //棒グラフの太さ
            }],
            yAxes: [{
              stacked: true,
              id: 'right-y-axis',
              type: 'linear',
              position: 'right',
              ticks: {
                min: 0,
                callback: function(value, index, values) {
                  BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})
                  return '¥' + new BigNumber(value, 10).toFormat()
                }
              },
            }]
          },
          elements: {
            line: {
              tension: 0, // ベジェ曲線を無効にする
            }
          }
        }
      })
    }
  },
  mounted () {
    this.renderChart()
  },

}
</script>

<style scoped>
</style>
