<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card>
        <b-row>
          <b-col sm="6">
            <h4 class="card-title mb-0" v-t="'tax.title'"></h4>
            <div class="small text-muted text-uppercase">Asset value</div>
          </b-col>
          <b-col sm="12" style="margin-top: 30px;">
            <div class="input-group">
              <i18n path="tax.description" tag="label" class="input-label-wallet text-muted mb-4">
                <span place="green" v-t="'tax.descriptionSpan'"></span>
                <br place="br">
                <span place="d1" v-t="'tax.description1'"></span>
                <span place="d2" v-t="'tax.description2'"></span>
                <span place="d3" v-t="'tax.description3'"></span>
              </i18n>
            </div>
            <b-row>
              <b-col sm="4">
                <input type="number" class="form-control form-control-lg" v-model.number="balance" id="add-balance" :placeholder="$t('tax.inputPlaceholder')" :aria-label="$t('tax.inputPlaceholder')" aria-describedby="">
                <button class="btn btn-primary btn-md resister-btn mt-2 mb-3" type="button" id="" v-on:click="addBalance" v-t="'tax.set'"></button>
                <b-alert :show="dismissCountDown"
                  dismissible
                  variant="danger"
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  class="animate fadeIn">
                  <span v-t="'tax.validation'"></span>
                </b-alert>
              </b-col>
              <b-col sm="8">
                <ul id="balance-lists">
                  <li><button v-if="totalBalance" class="btn btn-outline-success mb-3">{{ totalBalanceLocal | totalBalanceFormat }}</button></li>
                  <li v-for="(list, index) in lists" v-bind:key="list" class="list-inline">
                    <button v-on:click="deleteItem(index)" class="btn multiselect__tag mb-3">{{ list | totalBalanceFormat }}<i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i></button>
                  </li>
                  <li>
                    <button v-on:click="deleteAllItems" class="btn btn-light mb-3" v-t="'tax.reset'"></button>
                  </li>
                </ul>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card>

      <TaxTable v-if="lists.length || totalBalanceLocal" :value="lists" :totalBalanceLocal="totalBalanceLocal" ref="taxtable1" />

    </div>
  </div>
</template>

<script>
import TaxTable from '@/views/parts/TaxTable'
import BigNumber from 'bignumber.js'

export default {
  name: 'tax',
  props: ["totalBalance"],
    components: {
    TaxTable
  },
  data () {
    return {
      balance: null,
      totalBalanceLocal: null,
      lists: [],

      dismissSecs: 1.5,
      dismissCountDown: 0,
      showDismissibleAlert: false,

    }
  },
  filters: {
    // 所有量表示のフォーマット
    totalBalanceFormat: function (value) {
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
      return new BigNumber(value, 10).toFormat()
    }
  },
  created() {
    this.lists = JSON.parse(localStorage.getItem('lists')) || [];
  },
  mounted() {
    // ロード時にlocalstrageからlistsに値を挿入する
    // 保存ボタンを押すと、listsの結果をlocalstrageに格納する。
    // リセットボタンを押すと、listsの結果をクリアするとともに、localstrageからもデータを削除する
    // https://qiita.com/shingorow/items/97c265d4cab33cb13b6c

    this.lists = JSON.parse(localStorage.getItem('lists')) || [];

    BigNumber.config({DECIMAL_PLACES: 2}) // 小数点2桁
    const format = {
      decimalSeparator: '.',
      groupSeparator: '',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: ' ',
      fractionGroupSize: 0
    }
    BigNumber.config({FORMAT: format})
    this.totalBalanceLocal = new BigNumber(this.totalBalance, 10).toFormat()
  },

  methods: {
    checkLists: function () {
      if (this.lists.length) {
        return true
      } else {
        return false
      }
    },
    isNumber: function (numVal){
      // チェック条件パターン
      var pattern = /^([1-9]\d*|0)(\.\d+)?$/;
      // 数値チェック
      return pattern.test(numVal);
    },
    addBalance: function () {
      if (this.lists.indexOf(this.balance) == -1 && this.isNumber(this.balance)) {
        // 配列にプッシュ
        this.lists.push(this.balance)
        // LocalStrageに保存
        this.setItems()
      } else {
        this.dismissCountDown = this.dismissSecs
      }
      // inputの値を空に
      this.balance = ''
    },
    deleteAllItems: function () {
      this.lists = [];
      this.setItems();
    },
    setItems: function () {
      localStorage.setItem('lists', JSON.stringify(this.lists));
    },
    // バツボタン押下時
    deleteItem: function (value) {
      this.lists.splice(value, 1)
      localStorage.setItem('lists', JSON.stringify(this.lists));
    },
    // カウントダウン開始
    countDownChanged: function (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
  }
}
</script>
<style scoped>
#balance-lists {
  display: block;
  margin: 0;
  padding: 0;
}
#balance-lists li {
  display: inline-block;
  margin-right: 10px;
}
.multiselect__tag {
  position: relative;
  padding-right: 26px;
  background: #ffffff;
  border: 1px solid #20a8d8;
  color: #20a8d8;
}
.multiselect__tag-icon {
  cursor: pointer;
  margin-left: 7px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 700;
  font-style: normal;
  width: 22px;
  text-align: center;
  line-height: 32px;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  border-radius: 0px;
}
.multiselect__tag-icon:hover {
  background: #20a8d8;
}
.multiselect__tag-icon:after {
  content: "\D7";
  color: #20a8d8;
  font-size: 14px;
}
.multiselect__tag-icon:hover::after {
  color: #ffffff;
}
.resister-btn {
  width: 100%;
}
</style>
