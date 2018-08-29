<template>
  <b-card >
    <b-row>
      <b-col sm="12">
        <h4 class="card-title mb-0" v-t="'message.exchanges'"></h4>
        <div class="float-right text-muted">
          <span class="d-block">JPY/USD: ¥{{ this.$store.getters.USD }}</span>
          <span class="d-block">JPY/EUR: ¥{{ this.$store.getters.EUR }}</span>
        </div>
        <div class="small text-muted text-uppercase text-block">Exchanges</div>
      </b-col>
      <b-col sm="12" style="margin-top: 30px;">
        <div class="">
          <div>
            <b-row>
              <b-col md="6" sm="12" v-if="this.$store.getters.bitbank" class="animated fadeIn">
                <div class="brand-card">
                  <div class="brand-card-header bg-bitbank">
                    <span class="font-lg">Bitbank</span>
                  </div>
                  <div class="brand-card-body">
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(this.$store.getters.bitbank, 4, 3) }}</div>
                      <span class="diff" :class="bitbankPlusMinus">¥ {{ bitbankDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.rate'"></div>
                    </div>
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(this.$store.getters.bitbankPrice, 2, 0) }}</div>
                      <span class="diff" :class="bitbankPricePlusMinus">¥ {{ bitbankPriceDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.asset'"></div>
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col md="6" sm="12" v-if="this.$store.getters.poloniex" class="animated fadeIn">
                <div class="brand-card">
                  <div class="brand-card-header bg-poloniex">
                    <span class="font-lg">Poloniex</span>
                  </div>
                  <div class="brand-card-body">
                    <div>
                      <div class="text-value">{{ this.$store.getters.poloniex }} BTC</div>
                      <span class="diff" :class="poloniexPlusMinus">{{ poloniexDiff }} BTC</span>
                      <div class="text-uppercase text-muted small" v-t="'message.rate'"></div>
                    </div>
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(this.$store.getters.poloniexPrice, 2, 0) }}</div>
                      <span class="diff" :class="poloniexPricePlusMinus">¥ {{ poloniexPriceDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.asset'"></div>
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col md="6" sm="12" v-if="this.$store.getters.bittrex" class="animated fadeIn">
                <div class="brand-card">
                  <div class="brand-card-header bg-bittrex">
                    <span class="font-lg">Bittrex</span>
                  </div>
                  <div class="brand-card-body">
                    <div>
                      <div class="text-value">{{ renderUSDtoJPY(this.$store.getters.bittrex, 4, 3) }}</div>
                      <span class="diff" :class="bittrexPlusMinus">$ {{ bittrexDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.rate'"></div>
                    </div>
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(this.$store.getters.bittrexPrice, 2, 0) }}</div>
                      <span class="diff" :class="bittrexPricePlusMinus">¥ {{ bittrexPriceDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.asset'"></div>
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row><!--/.row-->
          </div>
        </div>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/database'
import BigNumber from 'bignumber.js'

export default {
  name: 'setting',
  props: ["totalBalance"],
  data: function () {
    return {
      prevBitbank: 0,
      bitbankDiff: 0,
      prevPoloniex: 0,
      poloniexDiff: 0,
      prevBittrex: 0,
      bittrexDiff: 0,


      prevBitbankPrice: 0,
      bitbankPriceDiff: 0,
      prevPoloniexPrice: 0,
      poloniexPriceDiff: 0,
      prevBittrexPrice: 0,
      bittrexPriceDiff: 0,

      bitbankPlusMinus: 'is-even',
      bitbankPricePlusMinus: 'is-even',
      poloniexPlusMinus: 'is-even',
      poloniexPricePlusMinus: 'is-even',
      bittrexPlusMinus: 'is-even',
      bittrexPricePlusMinus: 'is-even',

      format: {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      },
    }
  },
  filters: {
  },
  methods: {
    renderJPYtoUSD (value, d1, d2) {
      let res
      if (this.$i18n.locale === 'en') {
        // EN
        let price = value / this.$store.getters.USD
        BigNumber.config({DECIMAL_PLACES: d1, FORMAT: this.format})
        price = new BigNumber(price, 10).toFormat()
        res = "$ " + price
      } else if (this.$i18n.locale === 'de') {
        // DE
        let price = value / this.$store.getters.EUR
        BigNumber.config({DECIMAL_PLACES: d1, FORMAT: this.format})
        price = new BigNumber(price, 10).toFormat()
        res = "€ " + price
      } else {
        // JA
        BigNumber.config({DECIMAL_PLACES: d2, FORMAT: this.format})
        res = "¥ " + new BigNumber(value, 10).toFormat()
      }
      return res
    },
    renderUSDtoJPY (value, d1, d2) {
      let res
      if (this.$i18n.locale === 'en') {
        // EN
        let price = value
        BigNumber.config({DECIMAL_PLACES: d1, FORMAT: this.format})
        price = new BigNumber(price, 10).toFormat()
        res = "$ " + price
      } else if (this.$i18n.locale === 'de') {
        // EN
        let price = value * this.$store.getters.USD / this.$store.getters.EUR
        BigNumber.config({DECIMAL_PLACES: d1, FORMAT: this.format})
        price = new BigNumber(price, 10).toFormat()
        res = "€ " + price
      } else {
        let price = value * this.$store.getters.USD
        BigNumber.config({DECIMAL_PLACES: d2, FORMAT: this.format})
        res = "¥ " + new BigNumber(price, 10).toFormat()
      }
      return res
    }
  },
  mounted () {
    let database = firebase.database()
    let dbData
    let self = this

    let format = {
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: ' ',
      fractionGroupSize: 0
    }
    BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})

    function updateData () {
      if (self.totalBalance !== null) {
        BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})
        // 現状のローカル最新データを格納（更新処理が入った場合はコミットされたデータ、入っていない場合はDBデータが入る）
        let price = self.$store.getters.bitbank * self.totalBalance
        if (price === undefined || price === 0 || price === null) {
          price = 0          
        }
        let diff
        if (self.bitbankPriceDiff === 0) {
          diff = 0
        } else {
          diff = price - self.prevBitbankPrice
          if (diff > 0) {
            self.bitbankPricePlusMinus = 'is-plus'
          } else if (diff < 0) {
            self.bitbankPricePlusMinus = 'is-minus'
          } else {
            self.bitbankPricePlusMinus = 'is-even'
          }
        }
        self.bitbankPriceDiff = new BigNumber(diff, 10).toFormat()
        self.$store.commit('setBitbankPrice', price)
        self.prevBitbankPrice = price

        price = self.$store.getters.poloniex * self.$store.getters.poloniexBTC * self.$store.getters.USD * self.totalBalance
        if (price === undefined || price === 0 || price === null) {
          price = 0          
        }
        if (self.poloniexPriceDiff === 0) {
          diff = 0
        } else {
          diff = price - self.prevPoloniexPrice
          if (diff > 0) {
            self.poloniexPricePlusMinus = 'is-plus'
          } else if (diff < 0) {
            self.poloniexPricePlusMinus = 'is-minus'
          } else {
            self.poloniexPricePlusMinus = 'is-even'
          }
        }
        self.poloniexPriceDiff = new BigNumber(diff, 10).toFormat()
        self.$store.commit('setPoloniexPrice', price)
        self.prevPoloniexPrice = price

        price = self.$store.getters.bittrex * self.$store.getters.USD * self.totalBalance
        if (price === undefined || price === 0 || price === null) {
          price = 0          
        }
        if (self.bittrexPriceDiff === 0) {
          diff = 0
        } else {
          diff = price - self.prevBittrexPrice
          if (diff > 0) {
            self.bittrexPricePlusMinus = 'is-plus'
          } else if (diff < 0) {
            self.bittrexPricePlusMinus = 'is-minus'
          } else {
            self.bittrexPricePlusMinus = 'is-even'
          }
        }
        self.bittrexPriceDiff = new BigNumber(diff, 10).toFormat()
        self.$store.commit('setBittrexPrice', price)
        self.prevBittrexPrice = price

      } else {
        self.$store.commit('setBitbankPrice', 0)
        self.$store.commit('setPoloniexPrice', 0)
        self.$store.commit('setBittrexPrice', 0)
      }
    }

    // データベースの最新状態を取得
    var getSetting = function () {
      firebase.database().ref('ticker/').on('value', function(snapshot) {
        dbData = snapshot.val()
        // USDデータをVUEXに格納
        self.$store.commit('setUSD', dbData.USD)
        self.$store.commit('setEUR', dbData.EUR)

        // DBからデータ取得
        let diff
        if (self.bitbankDiff === 0) {
          diff = 0
        } else {
          diff = dbData.bitbank - self.prevBitbank
          if (diff > 0) {
            self.bitbankPlusMinus = 'is-plus'
          } else if (diff < 0) {
            self.bitbankPlusMinus = 'is-minus'
          } else {
            self.bitbankPlusMinus = 'is-even'
          }
        }
        BigNumber.config({DECIMAL_PLACES: 3, FORMAT: format})
        self.bitbankDiff = new BigNumber(diff, 10).toFormat()
        self.$store.commit('setBitbank', dbData.bitbank)
        self.prevBitbank = dbData.bitbank

        if (self.poloniexDiff === 0) {
          diff = 0
        } else {
          diff = dbData.poloniex - self.prevPoloniex
          if (diff > 0) {
            self.poloniexPlusMinus = 'is-plus'
          } else if (diff < 0) {
            self.poloniexPlusMinus = 'is-minus'
          } else {
            self.poloniexPlusMinus = 'is-even'
          }
        }
        self.poloniexDiff = new BigNumber(diff, 10).toFormat()
        self.$store.commit('setPoloniex', dbData.poloniex)
        self.prevPoloniex = dbData.poloniex
        self.$store.commit('setPoloniexBTC', dbData.poloniexBTC)

        if (self.bittrexDiff === 0) {
          diff = 0
        } else {
          diff = dbData.bittrex - self.prevBittrex
          if (diff > 0) {
            self.bittrexPlusMinus = 'is-plus'
          } else if (diff < 0) {
            self.bittrexPlusMinus = 'is-minus'
          } else {
            self.bittrexPlusMinus = 'is-even'
          }
        }
        self.bittrexDiff = new BigNumber(diff, 10).toFormat()
        self.$store.commit('setBittrex', dbData.bittrex)
        self.prevBittrex = dbData.bittrex

        updateData()
      })
    }
    getSetting()
  }
}
</script>

<style scoped>
.diff {
  font-size: 0.8rem;
}
.is-plus {
  color: green;
}
.is-minus {
  color: red;
}
.bg-bitbank {
  background: #029688;
}
.bg-poloniex {
  background: #0b7076;
}
.bg-bittrex {
  background: #0084D4;
}
.bg-bitbank span,
.bg-poloniex span,
.bg-bittrex span {
  color: #ffffff;
  font-weight: 500;
  letter-spacing: .4em
}
.text-value {
  font-size: 1.0rem;
}
.brand-card-header {
  height: 5rem;
}
@media (max-width: 767px) {
  .brand-card-header {
    height: 4rem;
  }
}
</style>
