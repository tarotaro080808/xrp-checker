<template>
  <b-card>
    <b-row>
      <b-col sm="6">
        <h4 class="card-title mb-0" v-t="'message.assetManagement'"></h4>
        <div class="small text-muted text-uppercase">Asset Management</div>
      </b-col>
      <b-col sm="12" style="margin-top: 30px;">
        <canvas id="myChart" width="800" height="400"></canvas>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  components: {
  },
  name: 'chart',
  // 以下のデータが揃ったタイミングを待ち合わせて処理開始
  // totalBalance: 合計Balance
  // transactionChart: 月毎の取引数量
  props: ["diff", "timestamp"],
  data: function () {
    return {
      d: this.diff
    }
  },
  mounted() {
    let ts = this.timestamp
    console.log(this.timestamp)
    console.log("DIFF: ", this.d)
  },
}
</script>

<style scoped>

</style>
