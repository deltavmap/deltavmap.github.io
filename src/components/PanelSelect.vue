<template>
  <div class="panel-select"
       :class="'panel-select--' + type">
    <panel-label class="">System</panel-label>
    <v-select :items="['Solar', 'Kerbol']"
              :value="value"
              @change="handleChange"
              :menu-props="{contentClass: 'panel-select__menu panel-select__menu--' + type}"
    ></v-select>
  </div>
</template>
<script>
import PanelLabel from './PanelLabel'

export default {
  components: {
    PanelLabel
  },
  props: [
    'changeEventName',
    'items',
    'type',
    'value'
  ],
  methods: {
    handleChange: function ($event) {
      this.$emit(this.changeEventName, $event)
    }
  }
}
</script>
<style lang="sass">
@import '../sass/utils/border.sass'

.panel-select
  display: block
  text-transform: uppercase
  width: 100%
  .v-input
    @extend .u-border-subtle

  .v-input__control
    height: 2em

  .v-input__slot
    margin-bottom: 0

  .v-select__slot
    padding: 0 .5em 0 1em
    letter-spacing: .1em

  .v-text-field
    padding-top: 0

    &__details
      min-height: 0
  .v-messages
    min-height: 0

  .v-select__slot
    background-color: darken($color-map-background-darker, 7%)

.panel-select .v-text-field > .v-input__control > .v-input__slot:before
  display: none

.panel-select .v-text-field.v-input--is-focused > .v-input__control > .v-input__slot:after
  display: none

.v-list-item .v-list-item__title, .v-list-item .v-list-item__subtitle
  text-transform: uppercase
  letter-spacing: .1em

.theme--dark .mdi-menu-down::before
  color: darken($color-white, 10%)

</style>
