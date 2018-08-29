<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col sm="12" md="">
          <b-card :header="$t('menu.termsOfService')">
            <ul>
              <i18n path="info.termsOfService1" tag="li">
                <br place="br">
              </i18n>
              <i18n path="info.termsOfService2" tag="li">
                <br place="br">
              </i18n>
              <i18n path="info.termsOfService3" tag="li">
                <br place="br">
             </i18n>
            </ul>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'memo',
  data () {
    return {
    }
  }
}
</script>