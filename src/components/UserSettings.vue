<template>
  <v-sheet class="pa-4" dense>
    <v-list>
      <v-list-item v-for="(setting, index) in userSettings"
                   :key="index">
        <v-switch dense
                  class="px-2"
                  v-model="setting.value"
                  inset
                  :label="setting.label"
        ></v-switch>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>
<script>
export default {
  props: [
    'userSettings'
  ]
}
</script>
<style lang="sass">
.v-input .v-label
  font-size: smaller
  text-transform: uppercase
  letter-spacing: 1px
</style>
