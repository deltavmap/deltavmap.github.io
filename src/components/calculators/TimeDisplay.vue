<template>
  <div class="time">
    <div class="time__label" v-if="label">{{ label }}</div>
    <v-row>
      <v-col><v-text-field readonly v-model="seconds" label="secs"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="days" label="days"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="years" label="years"></v-text-field></v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: [
    'seconds',
    'label'
  ],
  computed: {
    days: function () { return this.seconds.div(86400).toFixed(1) },
    years: function () { return this.seconds.div(86400).div(365).toFixed(1) }
  }
}
</script>
<style lang="sass">
.time
  &__label
    font-size: x-small
    opacity: .7
    text-transform: uppercase
    letter-spacing: .1em
</style>
