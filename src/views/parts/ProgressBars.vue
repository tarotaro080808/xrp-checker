<template>
  <div>
    <b-progress :value="counter" height="2rem" variant="warning" :max="max" show-progress :animated="animate"></b-progress>
  </div>
</template>

<script>
export default {
  name: 'progress-bars',
  props: ["counter"],
  data () {
    return {
      max: 100,
      timer: null,
      striped: true,
      animate: true,
    }
  },
  methods: {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
</script>

