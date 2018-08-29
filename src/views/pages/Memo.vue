<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col sm="12" md="">
          <b-card :header="$t('menu.updatePlan')">
            <table class="table b-table table-striped table-hover table-bordered b-table-fixed">
              <tbody>
                <tr>
                  <th v-t="'memo.task'"></th>
                  <th v-t="'memo.status'"></th>
                </tr>
                <tr>
                  <td v-t="'memo.plan1'"></td>
                  <td v-t="'memo.planFinished'"></td>
                </tr>
                <tr>
                  <td v-t="'memo.plan2'"></td>
                  <td v-t="'memo.planFinished'"></td>
                </tr>
                <tr>
                  <td v-t="'memo.plan3'"></td>
                  <td v-t="'memo.planFinished'"></td>
                </tr>
                <tr>
                  <td v-t="'memo.plan4'"></td>
                  <td v-t="'memo.planFinished'"></td>
                </tr>
                <tr>
                  <td v-t="'memo.plan5'"></td>
                  <td v-t="'memo.planFinished'"></td>
                </tr>
                <tr>
                  <td v-t="'memo.plan6'"></td>
                  <td v-t="'memo.planImperfect'"></td>
                </tr>
                <tr>
                  <td v-t="'memo.plan7'"></td>
                  <td v-t="'memo.planImperfect'"></td>
                </tr>
                <tr>
                  <td v-t="'memo.plan8'"></td>
                  <td v-t="'memo.planImperfect'"></td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'info',
  data () {
    return {
    }
  }
}
</script>
