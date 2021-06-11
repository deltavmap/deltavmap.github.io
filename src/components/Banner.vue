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
  data () {
    const bannerTitle = 'banner-intro-hide'
    const introHide = localStorage.getItem(bannerTitle)
    return {
      bannerTitle,
      fadeAway: false,
      displayBanner: introHide !== 'true'
    }
  },
  methods: {
    handleClose: function () {
      this.fadeAway = true
      localStorage.setItem(this.bannerTitle, 'true')
      setTimeout(_ => {
        this.displayBanner = false
      }, 250)
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
    color: hotpink
    font-size: .8em
    letter-spacing: .12em
    padding: 1em 2em
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

</style>
