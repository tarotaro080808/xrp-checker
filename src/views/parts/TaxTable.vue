<template>
  <div>
    <b-card>
      <div class="table-responsive">
        <table class="table b-table table-striped table-bordered">
          <thead>
            <tr>
              <th :class="sortedClass('id')" @click="sortBy('id')">#</th>
              <th :class="sortedClass('balance')" @click="sortBy('balance')" v-t="'tax.amount'"></th>
              <th :class="sortedClass('asset')" @click="sortBy('asset')" v-t="'tax.asset'"></th>
              <th :class="sortedClass('incomeTax')" @click="sortBy('incomeTax')" v-t="'tax.incomeTax'"></th>
              <th :class="sortedClass('residentsTax')" @click="sortBy('residentsTax')" v-t="'tax.residentsTax'"></th>
              <th :class="sortedClass('totalTax')" @click="sortBy('totalTax')" v-t="'tax.totalTax'"></th>
              <th :class="sortedClass('profits')" @click="sortBy('profits')" v-t="'tax.profit'"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.balance | totalBalanceFormat2 }}</td>
              <td>{{ getCurrency() }} {{ item.asset | totalBalanceFormat }}</td>
              <td>{{ getCurrency() }} {{ item.incomeTax | totalBalanceFormat }}</td>
              <td>{{ getCurrency() }} {{ item.residentsTax | totalBalanceFormat }}</td>
              <td>{{ getCurrency() }} {{ item.totalTax | totalBalanceFormat }}</td>
              <td>{{ getCurrency() }} {{ item.profits | totalBalanceFormat }}</td>
            </tr>
          </tbody>
        </table>
        <i18n path="tax.attention" tag="p">
          <a place="a1" :href="$t('tax.url1')" v-t="'tax.urlValue1'" target="_blank"></a>
          <a place="a2" href="https://twitter.com/tarotaro080808" v-t="'tax.urlValue2'" target="_blank"></a>
          <br place="br">
        </i18n>
      </div>
    </b-card>

    <b-card>
      <b-row>
        <b-col sm="12" class="moon-wrap">
          <h4 class="card-title mb-0" v-t="'tax.moonPrice'"></h4>
          <div class="small text-muted text-uppercase">Moon price</div>
        </b-col>
        <b-col sm="12" style="margin-top: 30px;">
          <div class="input-group">
            <label class="input-label-wallet text-muted mb-4" v-t="'tax.moonPriceDesctiption'"></label>
          </div>
          <b-row>
            <b-col sm="4">
              <div class="input-group">
                <input type="number" class="form-control form-control-lg" v-model.number="setBalance" id="add-balance" :placeholder="$t('tax.inputPlaceholder')" :aria-label="$t('tax.inputPlaceholder')" aria-describedby="">
                <button class="btn btn-primary btn-md resister-btn mt-2 mb-3" type="button" id="" v-on:click="addBalance" v-t="'tax.set'"></button>
              </div>
            </b-col>
            <b-col sm="4">
              <div class="card card-set-amount">
                <div class="card-body">
                  <i class="cui-speedometer icons font-5xl d-block mt-1 float-right text-muted"></i>
                  <small class="text-uppercase font-weight-bold" v-t="'tax.setAmount'"></small>
                  <div class="h4 mb-0">{{ balance | totalBalanceFormat2 }}</div>
                  <div class="progress-xs mt-3 mb-0 progress">
                    <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" class="progress-bar bg-danger" style="width: 25%;"><!----></div>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <table class="table b-table table-striped table-bordered">
                <thead>
                  <tr>
                    <th v-t="'tax.xrp'"></th>
                    <th v-t="'tax.asset'"></th>
                    <th v-t="'tax.tax'"></th>
                    <th v-t="'tax.profit'"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="moon in moons" :key="moon.balance">
                    <td>{{ getCurrency() }} {{ moon.balance | totalBalanceFormat3 }}</td>
                    <td>{{ getCurrency() }} {{ moon.asset | totalBalanceFormat }}</td>
                    <td>{{ getCurrency() }} {{ moon.totalTax | totalBalanceFormat }}</td>
                    <td>{{ getCurrency() }} {{ moon.profits | totalBalanceFormat }}</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
            <b-col sm="12">
              <TaxChart v-if="updateMoon" :update="updateMoon" :value="moons" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </div>

</template>
<script>
import BigNumber from 'bignumber.js'
import TaxChart from '@/views/parts/TaxChart'

export default {
  name: 'taxTable',
  props: ["value", "totalBalanceLocal"],
  components: {
    TaxChart,
  },
  data () {
    return {
      // data
      lists: this.value,
      totalBalance: this.totalBalanceLocal,
      // 税金テーブル
      sort: {
        key: '',
        isAsc: false
      },
      items: [],
      incomeTax: [
        { taxRate: 0.05, deduction: 0},
        { taxRate: 0.1, deduction: 97500},
        { taxRate: 0.2, deduction: 427500},
        { taxRate: 0.23, deduction: 636000},
        { taxRate: 0.33, deduction: 1536000},
        { taxRate: 0.40, deduction: 2796000},
        { taxRate: 0.45, deduction: 4796000}
      ],

      setBalance: '',
      balance: null,
      moons: [],
      updateMoon: 0,
      moonXRP: [
        { price: 50 },
        { price: 100 },
        { price: 200 },
        { price: 400 },
        { price: 1000 },
        { price: 2000 },
        { price: 5000 },
        { price: 10000 },
        { price: 20000 },
      ],
      moonXRPUSD: [
        { price: 0.5 },
        { price: 1 },
        { price: 2 },
        { price: 4 },
        { price: 10 },
        { price: 20 },
        { price: 50 },
        { price: 100 },
        { price: 200 },
      ],
      moonXRPEUR: [
        { price: 0.5 },
        { price: 1 },
        { price: 2 },
        { price: 4 },
        { price: 10 },
        { price: 20 },
        { price: 50 },
        { price: 100 },
        { price: 200 },
      ],
      
    }
  },
  filters: {
    // 所有量表示のフォーマット
    totalBalanceFormat: function (value) {
      if (!value) return 0
      BigNumber.config({DECIMAL_PLACES: 0}) // 小数点2桁
      var format = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      }
      BigNumber.config({FORMAT: format})
      return new BigNumber(value, 10).toFormat()
    },
    totalBalanceFormat2: function (value) {
      if (!value) return 0
      BigNumber.config({DECIMAL_PLACES: 2}) // 小数点2桁
      var format = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      }
      BigNumber.config({FORMAT: format})
      return new BigNumber(value, 10).toFormat() + ' XRP'
    },
    totalBalanceFormat3: function (value) {
      if (!value) return 0
      BigNumber.config({DECIMAL_PLACES: 1}) // 小数点2桁
      var format = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      }
      BigNumber.config({FORMAT: format})
      return new BigNumber(value, 10).toFormat()
    }


  },

  mounted () {
    this.balance = JSON.parse(localStorage.getItem('balance')) || 0;

    this.lists = this.value
    this.totalBalance = this.totalBalanceLocal
    this.update()

    this.moonUpdate()

  },
  computed: {
    sortedItems () {
      const list = this.items.slice();  // ソート時でdataの順序を書き換えないため
      if (!!this.sort.key) {
        list.sort((a, b) => {
          a = a[this.sort.key]
          b = b[this.sort.key]
          return (a === b ? 0 : a > b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
        });
      } 
      return list;
    },
  },
  watch: {
    totalBalance: function () {
      this.update()
    },
    value: function () {
      this.update()
    },
    balance: function () {
      this.moonUpdate()
    }
  },
  methods: {
    getCurrency: function () {
      if (this.$i18n.locale === 'en') {
        return "$"
      } else if (this.$i18n.locale === 'de') {
        return "€"
      } else {
        return "¥"
      }
    },
    // 保有XRPの数量入力ボタン押下時
    addBalance: function () {
      this.balance = this.setBalance
      localStorage.setItem('balance', JSON.stringify(this.balance));

    },
    moonUpdate: function () {
      const self = this
      this.moons = []
      if (this.$i18n.locale == 'en') {
        this.moonXRPUSD.forEach(function (value, key, array) {
          self.calcMoonTax(value.price, self.$i18n.locale)
        })
      } else if (this.$i18n.locale == 'de') {
        this.moonXRPEUR.forEach(function (value, key, array) {
          self.calcMoonTax(value.price, self.$i18n.locale)
        })
      } else {
        this.moonXRP.forEach(function (value, key, array) {
          self.calcMoonTax(value.price, self.$i18n.locale)
        })
      }
      this.$store.commit('setMoons', this.moons)
      this.updateMoon = 1
    },


    // 追加削除ボタンを押すとこのメソッドがコールされる。
    update: function () {
      this.lists = this.value
      
      // 税金計算
      this.calcTax(this.lists, this.$i18n.locale)

      // 利益目標
    },
    sortedClass (key) {
      return this.sort.key === key ? `sorted ${this.sort.isAsc ? 'asc' : 'desc' }` : '';
    },
    sortBy (key) {
      this.sort.isAsc = this.sort.key === key ? !this.sort.isAsc : false;
      this.sort.key = key;
    },

    calcTax: function (data, lang) {
      let self = this
      let num
      let balance
      let asset
      let incomeTax
      let residentsTax
      let totalTax
      let profits

      this.items = [] // 初期化
      if (this.totalBalance !== 0 && this.totalBalance !== null && this.totalBalance !== undefined ) {
        if (lang == "en") {
          balance = this.totalBalance
          asset = this.totalBalance * this.$store.getters.bitbank / this.$store.getters.USD
          incomeTax = 0
          residentsTax = 0
          totalTax = 0
          profits = asset
        } else if (lang == "de") {
          balance = this.totalBalance
          asset = this.totalBalance * this.$store.getters.bitbank / this.$store.getters.EUR
          incomeTax = 0
          residentsTax = 0
          totalTax = 0
          profits = asset
        } else {
          balance = this.totalBalance
          asset = this.totalBalance * this.$store.getters.bitbank
          incomeTax = self.calcIncomeTax(this.totalBalance, this.$store.getters.bitbank)
          residentsTax = self.calcResidentsTax(this.totalBalance, this.$store.getters.bitbank)
          totalTax = incomeTax + residentsTax
          profits = asset - totalTax
        }
        self.items.push({id: 0, balance: balance, asset: asset, incomeTax: incomeTax, residentsTax: residentsTax, totalTax: totalTax, profits: profits})
      }

      data.forEach(function (value, key, array) {
        num = key + 1
        if (lang == "en") {
          balance = value
          asset = value * self.$store.getters.bitbank / self.$store.getters.USD
          incomeTax = 0
          residentsTax = 0
          totalTax = 0
          profits = asset
        } else if (lang == "de") {
          balance = value
          asset = value * self.$store.getters.bitbank / self.$store.getters.EUR
          incomeTax = 0
          residentsTax = 0
          totalTax = 0
          profits = asset
        } else {
          balance = value
          asset = value * self.$store.getters.bitbank
          incomeTax = self.calcIncomeTax(value, self.$store.getters.bitbank)
          residentsTax = self.calcResidentsTax(value, self.$store.getters.bitbank)
          totalTax = incomeTax + residentsTax
          profits = asset - totalTax
        }
        self.items.push({id: num, balance: balance, asset: asset, incomeTax: incomeTax, residentsTax: residentsTax, totalTax: totalTax, profits: profits})
      })
    },
    calcMoonTax: function (price, lang) {
      let self = this
      let asset
      let incomeTax
      let residentsTax
      let totalTax
      let profits

      if (lang == "en") {
        asset = this.balance * price
        incomeTax = 0
        residentsTax = 0
        totalTax = 0
        profits = asset
      } else if (lang == "de") {
        asset = this.balance * price
        incomeTax = 0
        residentsTax = 0
        totalTax = 0
        profits = asset
      } else {
        asset = this.balance * price
        incomeTax = self.calcIncomeTax(this.balance, price)
        residentsTax = self.calcResidentsTax(this.balance, price)
        totalTax = incomeTax + residentsTax
        profits = asset - totalTax
      }
      this.moons.push({balance: price, asset: asset, totalTax: totalTax, profits: profits})
    },

    // 所得税計算
    calcIncomeTax: function (value, price) {
      let incomeTaxCalc = 0
      let taxRate = ''
      let deduction = ''
      let ptn = 0

      BigNumber.config({DECIMAL_PLACES: 0, ROUNDING_MODE: 1}) // 小数点無し
      const format = {
        decimalSeparator: '.',
        groupSeparator: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      }
      BigNumber.config({FORMAT: format})

      value = value * price / 100 // 100の位まで切り捨て
      value = new BigNumber(value, 10).toFormat()
      value = value * 100

      if (value <= 1950000) {
        ptn = 0
      } else if (1950000 < value && value <= 3300000) {
        ptn = 1
      } else if (3300000 < value && value <= 6950000) {
        ptn = 2
      } else if (6950000 < value && value <= 9000000) {
        ptn = 3
      } else if (9000000 < value && value <= 18000000) {
        ptn = 4
      } else if (18000000 < value && value <= 40000000) {
        ptn = 5
      } else {
        ptn = 6
      }
      incomeTaxCalc = (value * this.incomeTax[ptn].taxRate) - this.incomeTax[ptn].deduction
      if (value < 200000) {
        incomeTaxCalc = 0 // 雑所得控除
      }
      return incomeTaxCalc
    },

    // 住民税計算
    calcResidentsTax: function (value, price) {
      BigNumber.config({DECIMAL_PLACES: 0, ROUNDING_MODE: 1}) // 小数点無し
      const format = {
        decimalSeparator: '.',
        groupSeparator: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
      }
      BigNumber.config({FORMAT: format})
      value = value * price / 100 // 100の位まで切り捨て
      value = new BigNumber(value, 10).toFormat()
      value = value * 100
      let residentsTaxCalc = value * 0.1
      // if (value < 200000) {
      //   residentsTaxCalc = 0 // 雑所得控除
      // }
      return residentsTaxCalc
    }
  }

}
</script>
<style scoped>
.table thead th {
  cursor: pointer;
  text-align: center;
}
.table tbody td {
  text-align: right;
}
.table tbody td:first-child {
  text-align: center;
}
@media (max-width: 767px) {
  .table th, .table td {
    padding: 0.5rem;
  }
}
.resister-btn {
  width: 100%;
}
.card-set-amount .card-body {
  padding: 0.75rem;
}

</style>
