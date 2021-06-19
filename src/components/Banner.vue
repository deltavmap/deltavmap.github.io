<template>
  <div class="map-banner-container"
       :class="[(fadeAway) ? 'fade-away' : '']"
       v-if="displayBanner"
  >
    <div class="map-banner">
      <slot></slot>
      <p class="text-center pb-0 mb-0" >
        <button @click="handleClose" type="button">
        close
        </button>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['displayBanner'],
  data () {
    return {
      fadeAway: false
    }
  },
  methods: {
    handleClose: function () {
      this.fadeAway = true
      this.$emit('close-banner')
    }
  }
}
</script>
<style lang="sass">
@import '../sass/variables'
@import '../sass/utils/shadow-box'

.map-banner
  @extend .u-shadow--medium
  background-color: $color-map-dark
  border-radius: .5em
  color: $color-map-light
  max-width: 360px
  margin: 1rem
  padding: 1em 1em
  text-align: center

  button[type=button]
    @extend .u-shadow--medium
    border-width: 1px
    border-style: solid
    border-radius: 1em
    color: lighten($color-purpley, 50%)
    font-size: .8em
    letter-spacing: .12em
    padding: .75em 2em
    text-transform: uppercase
    text-align: center

  &-container
    grid-column-start: 2
    grid-column-end: 2
    grid-row-start: 1
    grid-row-end: 1
    box-sizing: border-box
    margin: 0 auto
    position: relative
    height: 0
    top: 0
    z-index: 2
    opacity: 1
    transition: all .25s

    @media #{map-get($display-breakpoints, 'sm-and-down')}
      grid-column-start: 1
      grid-column-end: 1
      grid-row-start: 2
      grid-row-end: 2

    &.fade-away
      opacity: 0
.banner__icon
  $bi: &
  background-color: rgba(0,0,0,.05)
  border-radius: 3rem
  display: flex
  justify-content: center
  align-items: center
  height: 2rem
  width: 2rem !important
  padding: .5rem

  div
    width: 1rem
    height: 1rem
    display: flex
    align-items: center

  &#{$bi}--warn div
    margin-left: 1px

  &#{$bi}--refresh div
    margin-left: 2px
    margin-top: 1px

</style>
