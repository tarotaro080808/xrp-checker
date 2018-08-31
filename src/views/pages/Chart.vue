<template>
  <b-card>
    <b-row>
      <b-col sm="6">
        <h4 class="card-title mb-0" v-t="'message.assetManagement'"></h4>
        <div class="small text-muted text-uppercase">Asset Management</div>
      </b-col>
      <b-col sm="6">
        <b-button-toolbar class="float-right" aria-label="Toolbar with buttons group">
          <b-form-radio-group id="radiosBtn" buttons button-variant="outline-danger" v-model="selected" name="radiosBtn">
            <b-form-radio class="mx-0" value="Amount">{{ $t('message.amount') }}</b-form-radio>
            <b-form-radio class="mx-0" value="Asset">{{ $t('message.asset') }}</b-form-radio>
          </b-form-radio-group>
        </b-button-toolbar>
      </b-col>
      <b-col sm="12" style="margin-top: 30px;">
        <canvas id="myChart" width="800" height="400"></canvas>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/database'
import BigNumber from 'bignumber.js'
import Chart from 'chart.js'
import { hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

export default {
  components: {
    hexToRgba,
  },
  name: 'chart',
  // 以下のデータが揃ったタイミングを待ち合わせて処理開始
  // totalBalance: 合計Balance
  // transactionChart: 月毎の取引数量
  props: ["totalBalance", "transactionChart"],
  data: function () {
    return {
      selected: 'Amount',
      myChart: null,
      monthLabel: [],
      monthDataTotal: [],
      monthDataAsset: [],
      monthDataBitbank: []
    }
  },
  watch: {
    selected: function (val) {
      var format = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      }
      if (val == 'Asset') {
        // 資産管理
        this.myChart.data.datasets[1].data = this.monthDataAsset
        this.myChart.options.scales.yAxes[1].ticks.callback = function(value, index, values) {
          BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})
          return '¥' + new BigNumber(value, 10).toFormat()
        }
      } else {
        // 数量管理
        this.myChart.data.datasets[1].data = this.monthDataTotal
        this.myChart.options.scales.yAxes[1].ticks.callback = function(value, index, values) {
          BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})
          return new BigNumber(value, 10).toFormat()
        }
      }
      this.myChart.update() // チャートの更新
    }
  },
  mounted () {
    var format = {
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: ' ',
      fractionGroupSize: 0
    }
    var format2 = {
      decimalSeparator: '.',
      groupSeparator: '',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: '',
      fractionGroupSize: 0
    }
    // 小数点4桁、カンマ区切り無し
    BigNumber.config({DECIMAL_PLACES: 4, FORMAT: format2})

    // 現在の月を取得
    var currentBalance
    var monthData = []
    var self = this

    // 月ラベルを取得
    this.transactionChart.forEach(function (value, key, array) {
      self.monthLabel.push(key)
    })

    // 逆順に並び替え（直近の月から処理するため）
    var j=11
    for (var i=0; i<12; i++) {
      var num = self.monthLabel[j]
      monthData[i] = self.transactionChart[num]
      j--
    }

    // 直近の月から当該月の取引数量を加減する
    currentBalance = new BigNumber(this.totalBalance, 10).toFormat()
    monthData.forEach(function (value, key, array) {
      currentBalance -= value
      self.monthDataTotal.push(currentBalance)
    })

    // 差し引き位置の調整
    self.monthDataTotal.reverse()
    self.monthDataTotal.splice(0, 1) // 要素の削除（1ヵ月ずれるため）
    self.monthDataTotal.splice(11, 0, this.totalBalance) // 要素の追加

    firebase.database().ref('history/').once('value').then(function(snapshot) {
      var dbData = snapshot.val()
      BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format2})
      self.monthLabel.forEach(function (value, key, array) {
        var tmp = dbData[value] * self.monthDataTotal[key] // 月の最終値*総量
        tmp = new BigNumber(tmp, 10).toFormat() // 整数、カンマ無し
        self.monthDataAsset.push(tmp)
        self.monthDataBitbank.push(dbData[value])
      })

    }).finally(() => {
      var ctx = document.getElementById("myChart").getContext('2d')
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Bitbank XRP/JPY',
              data: self.monthDataBitbank,
              type: 'line',
              backgroundColor: hexToRgba('#1ac2a6', 0),
              borderColor: hexToRgba('#1ac2a6', 70),
              yAxisID: 'left-y-axis'
            },
            {
              label: 'Balance',
              data: self.monthDataTotal,
              backgroundColor: hexToRgba('#ff9f40', 20),
              borderColor: hexToRgba('#ff9f40', 100),
              borderWidth: 0.8,
              type: 'line',
              yAxisID: 'right-y-axis',
            },
          ],
          labels: self.monthLabel,
          borderWidth: 1
        },
        options: {
          scales: {
            yAxes: [{
              id: 'left-y-axis',
              type: 'linear',
              position: 'left',
              ticks: {
                min: 0
              }
            }, {
              id: 'right-y-axis',
              type: 'linear',
              position: 'right',
              ticks: {
                min: 0,
                callback: function(value, index, values) {
                  BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})
                  return new BigNumber(value, 10).toFormat()
                }
              }
            }]
          },
          elements: {
            line: {
              tension: 0, // ベジェ曲線を無効にする
            }
          },
          maintainAspectRatio: false,
        }
      })
    })

  },

}
</script>

<style scoped>
</style>
