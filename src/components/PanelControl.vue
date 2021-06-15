<template>
  <div class="control"
       :class="[
         'control--' + type,
         (active) ? 'control--active' : '',
         (positive) ? 'control--is-positive' : 'control--is-negative'
       ]"
       v-show="show">

    <label class="control__label">{{ labelText }}</label>

    <div class="control__value"
         :class="[
           (isSurface) ? 'control__value--is-surface' : '',
         ]"
         @click="$emit('controls-' + type + '-click')"
    >
      &#8203;{{ valueText }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    active: Boolean,
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
    show: Boolean,
    type: String
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '@/sass/variables'
@import '@/sass/utils/shadow-box.sass'

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

  &__label
    font-size: .9em
    font-weight: 400
    letter-spacing: .1em
    text-transform: uppercase

    @media #{map-get($display-breakpoints, 'sm-and-down')}
      display: flex
      flex-direction: column
      justify-content: center
      margin: 0 .5rem

    @media #{map-get($display-breakpoints, 'md-and-up')}
      min-width: 6rem

  &__value
    $control-value: &
    border: 1px solid darken($color-panel-background, 5%)
    border-radius: .15rem
    color: $color-light
    min-width: 8rem
    overflow: hidden
    padding: .25rem .5rem
    position: relative
    text-align: center

    @media #{map-get($display-breakpoints, 'sm-and-down')}
      border-radius: .5rem
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
      letter-spacing: .2em

    .control--is-negative &
      background-color: $color-panel-background
      color: darken($color-panel-font-light, 10%)

  &--aerobraking
    text-transform: uppercase
    .control__value
      letter-spacing: .05em

</style>
