<template>
  <div class="modal animated" v-show="modal" @click.self="close">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ txDetail.hash }}</h5>
          <button type="button" class="close" v-on:click="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <h4 for="recipient-name" class="col-form-label">Tx detail:</h4>
            <pre v-if="txDetail.detail">{{ txDetail.detail }}</pre>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="close">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'modal',
  props: ["txDetail"],
  data () {
    return {
      
    }
  },
  computed: {
    modal () {
      return this.$store.state.modal
    }
  },
  methods: {
    close: function() {
      this.$store.commit('setModal', false)
    },
  }
}
</script>

<style scoped>
.modal {
  display: block;
  background: rgba(0,0,0,0.75);
}
.modal-transaction {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 10;
  background: rgba(0, 0, 0, .7);
  transform: translate3d(0, 0, 0);
}

.modal__close {
  position: absolute; top: 4px; right: 16px;
  color: #fff;
  cursor: pointer;
  font: bold 40px sans-serif;
  line-height: 1;
}
.modal__content {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
.modal__content > p {
  margin: 0;
  width: 60%;
  max-width: 90%;
  vertical-align: middle;
  text-align: center;
  font: bold 12px/100px sans-serif;
  letter-spacing: .1em;
  color: #aaa;
  background: #fff;
}
.modal-content {
  height: calc(100vh - 100px);
}
.modal-dialog {
  width: 70%;
  max-width: 70%;
}
.modal-body {
  overflow: auto;
  overflow-y: scroll;
}

</style>
