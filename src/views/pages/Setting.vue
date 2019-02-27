<template>
  <b-card >
    <b-row>
      <b-col sm="12">
        <h4 class="card-title mb-0" v-t="'message.exchanges'"></h4>
        <div class="float-right text-muted">
          <span class="d-block">JPY/USD: ¥{{ USD }}</span>
          <span class="d-block">JPY/EUR: ¥{{ EUR }}</span>
        </div>
        <div class="small text-muted text-uppercase text-block">Exchanges</div>
      </b-col>
      <b-col sm="12" style="margin-top: 30px;">
        <div class="">
          <div>
            <b-row>
              <b-col md="6" sm="12" v-if="bitbank" class="animated fadeIn">
                <div class="brand-card">
                  <div class="brand-card-header bg-bitbank">
                    <span class="font-lg">Bitbank</span>
                  </div>
                  <div class="brand-card-body">
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(bitbank, 4, 3) }}</div>
                      <span class="diff" :class="bitbankPlusMinus">¥ {{ bitbankDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.rate'"></div>
                    </div>
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(bitbankPrice, 2, 0) }}</div>
                      <span class="diff" :class="bitbankPricePlusMinus">¥ {{ bitbankPriceDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.asset'"></div>
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col md="6" sm="12" v-if="poloniex" class="animated fadeIn">
                <div class="brand-card">
                  <div class="brand-card-header bg-poloniex">
                    <span class="font-lg">Poloniex</span>
                  </div>
                  <div class="brand-card-body">
                    <div>
                      <div class="text-value">{{ poloniex }} BTC</div>
                      <span class="diff" :class="poloniexPlusMinus">{{ poloniexDiff }} BTC</span>
                      <div class="text-uppercase text-muted small" v-t="'message.rate'"></div>
                    </div>
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(poloniexPrice, 2, 0) }}</div>
                      <span class="diff" :class="poloniexPricePlusMinus">¥ {{ poloniexPriceDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.asset'"></div>
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col md="6" sm="12" v-if="bittrex" class="animated fadeIn">
                <div class="brand-card">
                  <div class="brand-card-header bg-bittrex">
                    <span class="font-lg">Bittrex</span>
                  </div>
                  <div class="brand-card-body">
                    <div>
                      <div class="text-value">{{ renderUSDtoJPY(bittrex, 4, 3) }}</div>
                      <span class="diff" :class="bittrexPlusMinus">$ {{ bittrexDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.rate'"></div>
                    </div>
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(bittrexPrice, 2, 0) }}</div>
                      <span class="diff" :class="bittrexPricePlusMinus">¥ {{ bittrexPriceDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.asset'"></div>
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col md="6" sm="12" v-if="coinbase" class="animated fadeIn">
                <div class="brand-card">
                  <div class="brand-card-header bg-coinbase">
                    <span class="font-lg">Coinbase Pro(USD)</span>
                  </div>
                  <div class="brand-card-body">
                    <div>
                      <div class="text-value">{{ renderUSDtoJPY(coinbase, 4, 3) }}</div>
                      <span class="diff" :class="coinbasePlusMinus">$ {{ coinbaseDiff }}</span>
                      <div class="text-uppercase text-muted small" v-t="'message.rate'"></div>
                    </div>
                    <div>
                      <div class="text-value">{{ renderJPYtoUSD(coinbasePrice, 2, 0) }}</div>
                      <span class="diff" :class="coinbasePricePlusMinus">¥ {{ coinbasePriceDiff }}</span>
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
import { mapGetters } from 'vuex'
let format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})

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
      prevCoinbase: 0,
      coinbaseDiff: 0,

      prevBitbankPrice: 0,
      bitbankPriceDiff: 0,
      prevPoloniexPrice: 0,
      poloniexPriceDiff: 0,
      prevBittrexPrice: 0,
      bittrexPriceDiff: 0,
      prevCoinbasePrice: 0,
      coinbasePriceDiff: 0,

      bitbankPlusMinus: 'is-even',
      bitbankPricePlusMinus: 'is-even',
      poloniexPlusMinus: 'is-even',
      poloniexPricePlusMinus: 'is-even',
      bittrexPlusMinus: 'is-even',
      bittrexPricePlusMinus: 'is-even',
      coinbasePlusMinus: 'is-even',
      coinbasePricePlusMinus: 'is-even',

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
  watch: {
    totalBalance: function () {
      this.updateData()
    }
  },
  computed: {
    ...mapGetters([
      'USD',
      'EUR',
      'bitbank',
      'bitbankPrice',
      'poloniex',
      'poloniexBTC',
      'poloniexPrice',
      'bittrex',
      'bittrexPrice',
      'coinbase',
      'coinbasePrice'
    ])
  },
  methods: {
    renderJPYtoUSD (value, d1, d2) {
      let res
      if (this.$i18n.locale === 'en') {
        // EN
        let price = value / this.USD
        BigNumber.config({DECIMAL_PLACES: d1, FORMAT: this.format})
        price = new BigNumber(price, 10).toFormat()
        res = "$ " + price
      } else if (this.$i18n.locale === 'de') {
        // DE
        let price = value / this.EUR
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
        // DE
        let price = value * this.USD / this.EUR
        BigNumber.config({DECIMAL_PLACES: d1, FORMAT: this.format})
        price = new BigNumber(price, 10).toFormat()
        res = "€ " + price
      } else {
        let price = value * this.USD
        BigNumber.config({DECIMAL_PLACES: d2, FORMAT: this.format})
        res = "¥ " + new BigNumber(price, 10).toFormat()
      }
      return res
    },
    updateData () {
      if (this.totalBalance !== null) {
        BigNumber.config({DECIMAL_PLACES: 0, FORMAT: format})
        // 現状のローカル最新データを格納（更新処理が入った場合はコミットされたデータ、入っていない場合はDBデータが入る）
        let price = this.bitbank * this.totalBalance
        if (price === undefined || price === 0 || price === null) {
          price = 0          
        }
        let diff
        if (this.bitbankPriceDiff === 0) {
          diff = 0
        } else {
          diff = price - this.prevBitbankPrice
          if (diff > 0) {
            this.bitbankPricePlusMinus = 'is-plus'
          } else if (diff < 0) {
            this.bitbankPricePlusMinus = 'is-minus'
          } else {
            this.bitbankPricePlusMinus = 'is-even'
          }
        }
        this.bitbankPriceDiff = new BigNumber(diff, 10).toFormat()
        this.$store.commit('setBitbankPrice', price)
        this.prevBitbankPrice = price

        price = this.poloniex * this.poloniexBTC * this.USD * this.totalBalance
        if (price === undefined || price === 0 || price === null) {
          price = 0          
        }
        if (this.poloniexPriceDiff === 0) {
          diff = 0
        } else {
          diff = price - this.prevPoloniexPrice
          if (diff > 0) {
            this.poloniexPricePlusMinus = 'is-plus'
          } else if (diff < 0) {
            this.poloniexPricePlusMinus = 'is-minus'
          } else {
            this.poloniexPricePlusMinus = 'is-even'
          }
        }
        this.poloniexPriceDiff = new BigNumber(diff, 10).toFormat()
        this.$store.commit('setPoloniexPrice', price)
        this.prevPoloniexPrice = price

        price = this.bittrex * this.USD * this.totalBalance
        if (price === undefined || price === 0 || price === null) {
          price = 0          
        }
        if (this.bittrexPriceDiff === 0) {
          diff = 0
        } else {
          diff = price - this.prevBittrexPrice
          if (diff > 0) {
            this.bittrexPricePlusMinus = 'is-plus'
          } else if (diff < 0) {
            this.bittrexPricePlusMinus = 'is-minus'
          } else {
            this.bittrexPricePlusMinus = 'is-even'
          }
        }
        this.bittrexPriceDiff = new BigNumber(diff, 10).toFormat()
        this.$store.commit('setBittrexPrice', price)
        this.prevBittrexPrice = price

        price = this.coinbase * this.USD * this.totalBalance
        if (price === undefined || price === 0 || price === null) {
          price = 0          
        }
        if (this.coinbasePriceDiff === 0) {
          diff = 0
        } else {
          diff = price - this.prevCoinbasePrice
          if (diff > 0) {
            this.coinbasePricePlusMinus = 'is-plus'
          } else if (diff < 0) {
            this.coinbasePricePlusMinus = 'is-minus'
          } else {
            this.coinbasePricePlusMinus = 'is-even'
          }
        }
        this.coinbasePriceDiff = new BigNumber(diff, 10).toFormat()
        this.$store.commit('setCoinbasePrice', price)
        this.prevCoinbasePrice = price

      } else {
        this.$store.commit('setBitbankPrice', 0)
        this.$store.commit('setPoloniexPrice', 0)
        this.$store.commit('setBittrexPrice', 0)
        this.$store.commit('setCoinbasePrice', 0)
      }
    },

    // データベースの最新状態を取得
    getSetting () {
      let database = firebase.database()
      let dbData
      const self = this

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

        if (self.coinbaseDiff === 0) {
          diff = 0
        } else {
          diff = dbData.coinbaseXRPUSD - self.prevCoinbase
          if (diff > 0) {
            self.coinbasePlusMinus = 'is-plus'
          } else if (diff < 0) {
            self.coinbasePlusMinus = 'is-minus'
          } else {
            self.coinbasePlusMinus = 'is-even'
          }
        }
        self.coinbaseDiff = new BigNumber(diff, 10).toFormat()
        self.$store.commit('setCoinbase', dbData.coinbaseXRPUSD)
        self.prevCoinbase = dbData.coinbaseXRPUSD

        self.updateData()
      })
    }
  },
  created () {
    this.getSetting()
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
.bg-coinbase {
  background: #2b71b1;
}
.bg-bitbank span,
.bg-poloniex span,
.bg-bittrex span,
.bg-coinbase span {
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
