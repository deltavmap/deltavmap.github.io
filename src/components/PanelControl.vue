<template>
  <div class="control"
       :class="[
         'control--' + type,
         (active) ? 'control--active' : '',
         (positive) ? 'control--is-positive' : 'control--is-negative'
       ]"
       v-show="show">

    <panel-label>{{ labelText }}</panel-label>

    <div class="control__value"
         :class="[
           (isSurface) ? 'control__value--is-surface' : '',
         ]"
         @click="$emit('controls-' + type + '-click')"
    >
      {{ valueText }}
    </div>
  </div>
</template>
<script>
import PanelLabel from './PanelLabel'
export default {
  components: {
    PanelLabel
  },
  props: {
    active: {
      default: true,
      type: Boolean
    },
    hasColorIndicator: Boolean,
    labelText: String,
    isSurface: Boolean,
    placeholderText: String,
    positive: {
      default: true,
      type: Boolean
    },
    valueClasses: Object,
    valueText: String,
    show: {
      default: true,
      type: Boolean
    },
    type: String
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '../sass/variables'
@import '../sass/utils/shadow-box.sass'
@import '../sass/utils/border.sass'

$color-controls-light: lighten($color-purpley-red, 60%)

.control
  $control: &

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    justify-content: center
    display: flex
    margin: .5rem 1rem
    padding-left: 0

  @media #{map-get($display-breakpoints, 'md-and-up')}
    margin-top: .5rem

  //&__label
  //  font-size: .9em
  //  font-weight: 400
  //  letter-spacing: .1em
  //  text-transform: uppercase
  //
  //  @media #{map-get($display-breakpoints, 'sm-and-down')}
  //    display: flex
  //    flex-direction: column
  //    justify-content: center
  //    margin: 0 .5rem
  //
  //  @media #{map-get($display-breakpoints, 'md-and-up')}
  //    min-width: 6rem

  &__value
    $control-value: &
    //border: 1px solid darken($color-panel-background, 2%)
    //border-radius: .15rem
    @extend .u-border-subtle
    align-items: center
    color: $color-light
    display: flex
    justify-content: center
    min-width: 8rem
    overflow: hidden
    padding: .25rem .5rem .19em
    position: relative
    text-align: center
    height: 2em

    @media #{map-get($display-breakpoints, 'sm-and-down')}
      border-radius: .5rem
      font-size: .9em
      margin: 0 .5rem

    &:before
      display: none
      content: ''
      position: absolute
      width: 5px
      left: 0
      top: 0
      bottom: 0
      background-color: $color-panel-background

      .control--origin.control--active &
        background-color: $color-origin
        display: inline-block

      .control--destination.control--active &
        background-color: $color-destination
        display: inline-block

    .control--active &
      background-color: $color-dark
      color: $color-light
      overflow: hidden
      position: relative

    &--is-surface
      text-transform: uppercase
      letter-spacing: .15em

    .control--is-negative &
      background-color: $color-panel-background
      color: darken($color-panel-font-light, 10%)

  &--aerobraking
    text-transform: uppercase
    .control__value
      letter-spacing: .1em
  &--delta-v
    .control__value
      font-family: monospace
</style>
