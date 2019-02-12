<template>
  <div class="animated fadeIn">
    <div v-if="tab === 1 || tab === 2">
      <b-card>
        <b-row>
          <b-col sm="6">
            <h4 class="card-title mb-0" v-t="'message.walletSetting'"></h4>
            <div class="small text-muted text-uppercase">Wallet Settings</div>
          </b-col>
          <b-col sm="12" style="margin-top: 30px;">
            <form @submit.prevent="setWallet">
              <div class="input-group mb-3">
                <i18n path="message.walletSettingDesctiption" tag="label" class="input-label-wallet text-muted">
                  <mark place="mark" v-t="'message.mark'"></mark>
                  <br place="br">
                </i18n>
                <input v-model="address" type="text" class="form-control form-control-lg" name="q" placeholder="Enter your address" aria-label="Enter your address" aria-describedby="">
                <div class="input-group-append">
                  <button class="btn btn-primary btn-lg" type="submit" id="" v-t="'message.btnLabelSubmit'" v-on:click="setWallet"></button>
                </div>
              </div>
              <b-alert :show="dismissCountDown"
                dismissible
                variant="primary"
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged"
                class="animate fadeIn">
                <span v-t="'message.adding'"></span>
              </b-alert>

            </form>
          </b-col>
        </b-row>
      </b-card>
    </div><!-- tab1 or tab2 -->

    <!-- Progress Bar -->
    <div v-if="loadingProgress == true">
      <ProgressBar v-bind:counter="loadCounter" />
    </div>


    <div v-if="connection !== null">

      <div v-if="tab === 1" class="animated fadeIn">
        <div class="waiting" v-if="balance === null" v-t="'message.gettingWalletBalance'"></div>
        <b-row>
          <b-col sm="12" v-if="totalBalance">
            <b-card>
              <b-row>
                <b-col sm="12">
                  <h4 class="card-title mb-0" v-t="'message.totalBalance'"></h4>
                  <div class="small text-muted text-uppercase">Total Balance</div>
                </b-col>
                <b-col sm="12" style="margin-top: 20px;">
                  <img class="font-2xl mr-3 float-left logo" src="/img/logo.png">
                  <div class="h2 mt-2 mb-0">{{ totalBalance | totalBalanceFormat }}<small class="text-muted font-sm ml-2 text-uppercase font-weight-bold">XRP</small></div>
                  
                </b-col>
              </b-row>
            </b-card>
          </b-col>
          <b-col sm="12">
            <b-card v-if="walletAddress">
              <b-row>
                <b-col sm="6">
                  <h4 class="card-title mb-0" v-t="'message.walletList'"></h4>
                  <div class="small text-muted text-uppercase">Wallet Lists</div>
                </b-col>
                <b-col sm="12" style="margin-top: 30px;">
                  <b-row v-if="loadCounter == 100">
                    <template v-for="(value, index) in walletAddress">
                      <b-col cols="12" sm="6" lg="4" :key="value">
                        <b-card :no-body="true">
                          <b-card-body class="p-3 clearfix">
                            <div class="alert-dismissible">
                              <button v-if="inLocalStorage(value)" v-on:click="deleteItem(index)" class="close">×</button>
                            </div>
                            <i class="icon-wallet icons p-3 font-2xl mr-3 float-left" :class="'bg-'+selectColor(index)"></i>
                            <div class="h5 mb-1" :class="'text-'+selectColor(index)">{{ balance[index] }} XRP</div>
                            <div class="text-muted font-weight-bold font-xs text-balance-address">{{ value }}</div>
                          </b-card-body>
                        </b-card>
                      </b-col>
                    </template>
                  </b-row>
                  <b-row v-else >
                    <div class="con-vs-loading">
                      <div class="vs-loading border"><div class="effect-1 effects"></div><div class="effect-2 effects"></div><div class="effect-3 effects"></div><img src=""><!----></div>
                    </div>
                  </b-row>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </div><!-- tab1 or tab2 -->


      <div v-if="tab === 1" class="animated fadeIn">
        <Setting v-bind:totalBalance="totalBalance" />
        <keep-alive>
          <Chart v-if="transactionChartFin && getBalanceFin" :transactionChart="transactionChart" :totalBalance="totalBalance" />
        </keep-alive>
      </div><!-- tab1 -->

      <div v-if="tab === 2">
        <div v-if="transactionList" class="animated fadeIn">
          <b-row>
            <b-col cols="12" md="6" lg="6" v-for="(v, i) in transactionList" :key="'list'+i">
              <b-card
                header-tag="header"
                footer-tag="footer">
                <div slot="header">
                  <strong v-t="'message.transactionHistory'"></strong><br>
                  <span class="text-muted">{{ walletAddress[i] }}</span>
                </div>
                <b-list-group>
                  <b-list-group-item  v-for="(value, index) in v" :key="'list'+i+'_'+index" href="#" v-on:click.stop="openModal(value.hash)" class="flex-column align-items-start">
                    <span class="text-index mr-3">{{ index+1 }}.</span>
                    <small class="text-muted mr-3"><i class="fa fa-clock-o fa-md mr-1"></i>{{ value.date }}</small>
                    <span class="text-center text-transaction-type">{{ value.transactionType }}</span>

                    <div class="text-amount-wrap">
                      <span class="text-currency mr-5">{{ value.currency }}</span>
                      <span class="text-amount" :class="value.typeColor">{{ value.amount }}</span>
                      </div>
                    <small class="text-muted">{{ value.hash }}</small>
                  </b-list-group-item>
                </b-list-group>
                <b-button block variant="outline-primary mt-3" v-if="transactionListUpdated[i] === false || transactionListUpdated[i] === undefined" v-on:click="addLoading(i)" v-t="'message.loadAdditional'"></b-button>

              </b-card>
            </b-col>
          </b-row><!--/.row-->
        </div>
      </div><!-- tab2 -->

      <div v-if="tab === 3">
        <Memo />
      </div><!-- tab3 -->

      <div v-if="tab === 4">
        <Info />
      </div><!-- tab4 -->

      <div v-if="tab === 5">
        <Tax v-bind:totalBalance="totalBalance" />
      </div><!-- tab5 -->

      <!-- モーダルウィンドウ（トランザクション詳細用） -->
      <Modal v-bind:txDetail="txDetail" />

    </div><!--/connetion-->

  </div>

</template>

<script>
import ProgressBar from '@/views/parts/ProgressBars'
import Memo from '@/views/pages/Memo'
import Modal from '@/views/parts/Modal'
import Setting from '@/views/pages/Setting'
import Chart from '@/views/pages/Chart'
import Info from '@/views/pages/Info'
import Tax from '@/views/pages/Tax'

import RippleClient from 'rippled-ws-client'
import BigNumber from 'bignumber.js'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'dashboard',
  components: {
    ProgressBar,
    Memo,
    Modal,
    Setting,
    Chart,
    Info,
    Tax
  },
  data: function () {
    return {
      // Wallet
      walletAddress: [],
      walletAddressLen: '',
      getBalanceFin: false,
      loopCnt: 0,

      // input field
      address: null,

      // Local Storage
      localStorageWalletAddress: [],
      localStorageWalletAddressLen: 0,

      correctWalletAddress: '',
      connection: null,
      balance: [],
      balanceHistory: [],
      totalBalance: 0,
      accountDetails: null,
      transactionDetails: null,
      connectionState: null,
      transactionList: [],
      transactionListUpdated: [],

      // チャート用Balance
      transactionChart: [],
      transactionChartFin: false,

      // Progress
      loadingProgress: null,
      loadCounter: 0,

      // Modal
      txDetail: {
        hash: null,
        detail: null
      },

      // Alert
      dismissSecs: 1.5,
      dismissCountDown: 0,
      showDismissibleAlert: false,

    }
  },
  computed: {
    tab () {
      return this.$store.state.tab
    }
  },
  filters: {
    // 所有量表示のフォーマット
    totalBalanceFormat: function (value) {
      if (!value) return ''
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
  created () {
    // Local Storageから取得
    this.localStorageWalletAddress = JSON.parse(localStorage.getItem('walletAddress')) || [];
    this.localStorageWalletAddressLen = this.localStorageWalletAddress.length


    // クエリから取得
    var walletList = this.$route.query.q
    if (walletList !== undefined) {
      walletList = this.escape_html(walletList)
      walletList = walletList.replace(/^\s+/,"")
      walletList = walletList.replace(/\s+$/,"")
      var splitWalletList = walletList.split(' ')
      this.walletAddressLen = this.localStorageWalletAddressLen + splitWalletList.length
      // Local Strageのデータと結合
      this.walletAddress = this.localStorageWalletAddress.concat(splitWalletList)
      // inputの初期値として
      this.correctWalletAddress = this.escape_html(walletList)
    } else {
      // クエリが存在しない場合
      this.walletAddressLen = this.localStorageWalletAddressLen
      this.walletAddress = this.localStorageWalletAddress
      this.correctWalletAddress = ''
    }
   
    // Connect to RippleClient
    this.connectRippleClient(this.walletAddress)
  },
  methods: {
    setWallet: function () {
      let ls = JSON.parse(localStorage.getItem('walletAddress')) || [];
      let set = new Set(ls)
      
      if (set.has(this.address) === false && this.address !== null && this.address !== undefined) {
        set.add(this.address) // 重複を無視
        let list = Array.from(set)
        // ls = ls.filter((x, i, self) => self.indexOf(x) === i);
        localStorage.setItem('walletAddress', JSON.stringify(list));

        this.walletAddressLen = this.walletAddressLen + 1
        this.walletAddress.push(this.address)

        this.connectRippleClient(this.walletAddress)
        this.dismissCountDown = this.dismissSecs

      } else {
      }
    },
    // バツボタン押下時
    deleteItem: function (value) {
      let ls = JSON.parse(localStorage.getItem('walletAddress')) || [];
      ls.splice(value, 1)
      localStorage.setItem('walletAddress', JSON.stringify(ls));
   
      this.walletAddress.splice(value, 1)

      // this.balance.splice(value, 1)
      this.connectRippleClient(this.walletAddress)
    },
    // カウントダウン開始
    countDownChanged: function (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },


    // LocalStorageに入っているアドレスかチェック
    inLocalStorage: function (value) {
      let ls = JSON.parse(localStorage.getItem('walletAddress')) || [];
      if (ls.indexOf(value) == -1) {
        // 存在しない
        return false
      }
      // 存在する
      return true
    },



    connectRippleClient: function (arrAddress) {
      const self = this
      if (arrAddress !== undefined) { // クエリ自体がない場合
        // プログレスバー表示
        this.setProgressState(true)
        self.loadCounter = 10
        new RippleClient('wss://s2.ripple.com').then((RippleServerConnection) => {
          self.connection = RippleServerConnection
        }).then( () => {
          self.$data.balance = []
          self.$data.totalBalance = 0
          self.$data.loopCnt = 0;

          arrAddress.forEach(function (value, key) {
            if (value.indexOf('r') === 0) {  // rから始まる場合
              self.loadCounter = self.loadCounter + (100 - parseInt(self.loadCounter))*0.4
              self.getBalance(key)
              self.loadCounter = self.loadCounter + (100 - parseInt(self.loadCounter))*0.4
              self.getTransaction(key, 10, false)
              self.getTransactionChart(key, 100, false)
            } else if (self.isNumber(value)) {
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
              self.$data.balance[key] = new BigNumber(value, 10).toFormat()
              self.$data.totalBalance += parseFloat(value)
              self.$data.loopCnt+=1;
              if (self.loopCnt == self.walletAddressLen) {
                self.$data.getBalanceFin = true
              }
            }
          })
        }).catch((error) => {
          self.loadCounter = 100
          self.walletAddress = ''
          self.correctWalletAddress = ''
        }).finally( () => {
          self.loadCounter = 100
        })
      }

    },

    

    isNumber: function (numVal){
      // チェック条件パターン
      var pattern = /^([1-9]\d*|0)(\.\d+)?$/;
      // 数値チェック
      return pattern.test(numVal);
    },

    // モーダルウィンドウ（トランザクション詳細用）
    openModal: function (hash) {
      this.txDetail.hash = hash
      if (hash !== null) {
        this.getTransactionDetail(hash)
          .then(() => {
            this.$store.commit('setModal', true)
          }).catch(() => {
            this.$store.commit('setModal', false)
          })
      }
    },

    // トランザクション追加ロード
    addLoading: function (index) {
      this.getTransaction(index, 200, true)
      this.transactionList[index].updateBtn = false
    },

    // 残高取得
    getBalance: function (index) {
      let balance
      var resultData = []
      var self = this
      this.connection.send({
        command: 'account_info',
        account: self.walletAddress[index]
      }).then((response) => {
        balance = parseInt(response.account_data.Balance) / 1000 / 1000
        if (isNaN(balance)) {
          balance = 0
        }
      }).catch((error) => {
        balance = 0
      }).finally( () => {
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
        
        // self.$data.balance.push(new BigNumber(balance, 10).toFormat())
        self.$data.balance[index] = new BigNumber(balance, 10).toFormat()
        self.$data.totalBalance += balance
        self.$data.loopCnt+=1;
        if (self.loopCnt == self.walletAddressLen) {
          self.$data.getBalanceFin = true
        }
      })
    },
    getTransactionDetail: function () {
      var txHash = this.txDetail.hash
      var result = null
      return this.connection.send({
        command: 'tx',
        transaction: txHash
      }).then((response) => {
        this.txDetail.detail = response
      }).catch((error) => {
        this.txDetail.detail = null
      })

    },
    getTransactionChart: function (index, limit, update) {
      var self = this
      var txDetails

      // 月の配列化
      var monthList = []
      var today = new Date();
      today.setDate(1);
      for (var i=0; i<12; i++) {
        var year  = today.getFullYear();      
        var month = ("0"+(today.getMonth() + 1)).slice(-2)
        var target = year + month
        monthList.push(target)
        this.transactionChart[target] = 0 // ゼロ初期化

        today.setMonth(today.getMonth() - 1)
      }

      this.connection.send({
        command: 'account_tx',
        account: self.walletAddress[index],
        limit: limit,
        ledger_index_min: -1,
        ledger_index_max: -1,
      }).then((response) => {
        // `account_data` contains the information
        txDetails = response.transactions
        return txDetails
      }).then( (response) => {
        var resultData = []
        response.forEach(function (value, key) {
          var tx = value.tx

          // トランザクションタイプ(Payment, TrustSet, etc..)
          var transactionType = tx.TransactionType

          // 日付の取得
          var d = new Date((tx.date + 946684800 ) * 1000)
          var year  = d.getFullYear();      
          var month = ("0"+(d.getMonth() + 1)).slice(-2)
          var target = year+month

          var amount
          if (!tx.LimitAmount && !tx.SendMax && transactionType == 'Payment' && typeof tx.Amount != "object" && tx.Amount ) {
            if (tx.Destination == self.walletAddress[index]) {
              // 入金
              amount = (self.transactionChart[target]) + (tx.Amount / 1000 / 1000)
            } else {
              // 出金
              amount = (self.transactionChart[target]) - (tx.Amount / 1000 / 1000)
            }
            self.transactionChart.splice(target, 1, amount)
          }
        })
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        self.transactionChartFin = true
      })
    },
    getTransaction: function (index, limit, update) {
      var self = this
      var txDetails
      this.connection.send({
        command: 'account_tx',
        account: self.walletAddress[index],
        limit: limit,
        ledger_index_min: -1,
        ledger_index_max: -1,
      }).then((response) => {
        // `account_data` contains the information
        txDetails = response.transactions
        return txDetails
      }).then( (response) => {
        var resultData = []
        var data = txDetails
        response.forEach(function (value, key) {
          var tx = value.tx

          // トランザクションタイプ(Payment, TrustSet, etc..)
          var transactionType = tx.TransactionType
          var typeColor
          if (tx.LimitAmount) {
            typeColor = 'color-default'
          } else if ( tx.SendMax ) {
            typeColor = 'color-default'
          } else if (transactionType == 'OfferCreate') {
            typeColor = 'color-default'
          } else if (transactionType == 'PaymentChannelClaim') {
            typeColor = 'color-default'
          } else if (transactionType == 'OfferCancel') {
            typeColor = 'color-default'
          } else if( typeof tx.Amount == "object") {
            typeColor = 'color-default'
          } else {
            // XRP以外は配列である
            if (tx.Destination == self.walletAddress[index]) {
              typeColor = 'color-income'
            } else {
              typeColor = 'color-outcome'
            }

          }

          // 日付の取得
          var d = new Date((tx.date + 946684800 ) * 1000)
          var year  = d.getFullYear();      
          var month = ("0"+(d.getMonth() + 1)).slice(-2)
          var day   = ("0"+d.getDate()).slice(-2)
          var hour   = ("0"+d.getHours()).slice(-2)
          var min   = ("0"+d.getMinutes()).slice(-2)
          var sec   = ("0"+d.getSeconds()).slice(-2)
          var date = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec

          /***************************
           * 通貨の取得
           ***************************/
          var currency
          if (tx.LimitAmount) {
            currency = tx.LimitAmount.currency
          } else if ( tx.SendMax ) {
            currency = tx.SendMax.currency + ' to ' + 'XRP'
          } else if (transactionType == 'OfferCreate') {
            currency = tx.TakerPays.currency
          } else if (transactionType == 'PaymentChannelClaim') {
            currency = '-'
          } else if (transactionType == 'OfferCancel') {
            currency = '-'
          } else if( typeof tx.Amount == "object") {
            currency = tx.Amount.currency
          } else {
            // XRP以外は配列である
            currency = 'XRP'
          }

          /***************************
           * 数量の取得
           ***************************/
          var amount
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

          if (tx.LimitAmount) {
            amount = new BigNumber(tx.LimitAmount.value, 10).toFormat()
          } else if ( tx.SendMax ) {
            // Exchangeなど
            amount  = 'Detail'
          } else if (transactionType == 'OfferCreate') {
            amount = new BigNumber(tx.TakerPays.value, 10).toFormat()
          } else if (transactionType == 'PaymentChannelClaim') {
            amount = 'Detail'
          } else if (transactionType == 'OfferCancel') {
            amount = 'Detail'
          } else if( typeof tx.Amount != "object") {
            // XRP
            amount = parseInt(tx.Amount) / 1000 / 1000
            amount = new BigNumber(amount, 10).toFormat()
          } else {
            // XRP以外は配列である
            amount = new BigNumber(tx.Amount.value, 10).toFormat()
          }

          /***************************
           * TXIDの取得
           ***************************/
          var hash = tx.hash

          /***************************
           * 配列にプッシュ
           ***************************/
          resultData.push({
            transactionType: transactionType,
            typeColor: typeColor,
            date: date,
            currency: currency,
            amount: amount,
            hash: hash,
          })
        })
        // Data変数に格納
        if (update === false) {
          self.$data.transactionList.push(resultData)
          self.$data.transactionListUpdated.push(false)
        } else {
          // 追加読み込み
          self.$data.transactionList.splice(index, 1) // 一旦要素の削除
          self.$data.transactionList.splice(index, 0, resultData) // 要素の追加
          self.$data.transactionListUpdated.splice(index, 1)
          self.$data.transactionListUpdated.splice(index, 0, true)
        }
      }).catch((error) => {
      })
    },
    setProgressState (state) {
      self.loadingProgress = state
    },
    selectColor (index) {
      var colorClass = 'primary'
      if (index %3 == 0) {
        colorClass = 'primary'
      } else if (index %3 == 1) {
        colorClass = 'warning'
      } else if (index %3 == 2) {
        colorClass = 'danger'
      }
      return colorClass
    },
    escape_html (string) {
      if(typeof string !== 'string') {
        return string;
      }
      return string.replace(/[&'`"<>]/g, function(match) {
        return {
          '&': '&amp;',
          "'": '&#x27;',
          '`': '&#x60;',
          '"': '&quot;',
          '<': '&lt;',
          '>': '&gt;',
        }[match]
      });
    },
  },
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
  .card-title {
    font-size: 1.1rem;
    font-weight: bold;
  }
  .text-index {
    display: inline-block;
    margin-right: 10px;
    font-size: 1.1rem;
  }
  .text-amount-wrap {
    font-size: 1.3rem;
    font-weight: bold;
  }
  .text-value {
    font-size: 1rem;
  }
  .text-amount-wrap::after {
    content: '';
    position: relative;
  }
  .text-amount {
    float: right;
  }
  .text-currency {
    font-weight: normal;
  }
  .text-transaction-type {
    position: absolute;
    top: 0.75rem;
    right: 1.25rem;
  }

  .color-default {
    color: #999999;
  }
  .color-income {
    color: #0d8f38;
  }
  .color-outcome {
    color: #d7300f;
  }
  .logo {
    width: 48px;
  }
  .input-label-wallet {
    width: 100%;
    display: block;
  }
  @media (max-width: 767px) {
    .text-balance-address {
      word-break: break-all;
    }
  }

.con-vs-loading {
  position: relative;
}
  .con-vs-loading .vs-loading.border {
    border: 1px solid #f0f0f0;
  }
  .con-vs-loading .vs-loading {
    position: relative;
    width: 55px;
    height: 55px;
    display: block;
    border-radius: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 3px solid transparent;
}
.con-vs-loading .vs-loading.border .effect-1, .con-vs-loading .vs-loading.border .effect-2, .con-vs-loading .vs-loading.border .effect-3 {
    border: 1px solid transparent;
    border-left: 1px solid #1f74ff;
}
.con-vs-loading .vs-loading.border .effect-1, .con-vs-loading .vs-loading.default .effect-1 {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-left: 3px solid #1f74ff;
    -webkit-animation: rotate 1s ease infinite;
    animation: rotate 1s ease infinite;
    border-radius: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.con-vs-loading .vs-loading.border .effect-2, .con-vs-loading .vs-loading.default .effect-2 {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-left: 3px solid #1f74ff;
    -webkit-animation: rotateOpacity 1s ease infinite .1s;
    animation: rotateOpacity 1s ease infinite .1s;
    border-radius: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.con-vs-loading .vs-loading.border .effect-3, .con-vs-loading .vs-loading.default .effect-3 {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-left: 3px solid #1f74ff;
    -webkit-animation: rotateOpacity 1s ease infinite .2s;
    animation: rotateOpacity 1s ease infinite .2s;
    border-radius: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.con-vs-loading .vs-loading .effects {
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
}
</style>
