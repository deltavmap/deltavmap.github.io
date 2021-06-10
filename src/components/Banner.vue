<template>
  <div class="map-banner-container"
       :class="[(fadeAway) ? 'fade-away' : '']"
       v-if="displayBanner"
  >
    <div class="map-banner">
      <slot></slot>
<!--      <hr>-->
<!--      <p>-->
<!--        Is iPhone: {{ isIPhoneOs }}-->
<!--      </p>-->
<!--      <hr>-->
<!--      <p>-->
<!--        Is Safari: {{ isSafari }}-->
<!--      </p>-->
<!--      <hr>-->
<!--      <p>-->
<!--        {{ userOs }}-->
<!--      </p>-->
      <div v-if="notCompatible">This App is not compatible with Safari on iPhone OS</div>

      <p class="text-center pb-0 mb-0">
      <button type="button"
              @click="handleClose"
      >close</button>
      </p>

    </div>
  </div>
</template>
<script>
/**
 * Firefox/Linux - Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0
 * Brave/Linux - Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36
 */
export default {
  data () {
    const bannerTitle = 'banner-intro-hide'
    const introHide = localStorage.getItem(bannerTitle)
    return {
      bannerTitle,
      fadeAway: false,
      displayBanner: introHide !== 'true',
      userOs: navigator.userAgent || 'no userAgent'
    }
  },
  computed: {
    isIPhoneOs: function () {
      return (this.userOs.search('iPhone OS') >= 0)
    },
    isSafari: function () {
      // return (this.userOs.search('Safari') >= 0)
      return this.$browserDetect.isSafari
    },
    notCompatible: function () {
      return (this.isIPhoneOs && this.isSafari)
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
@import '@/sass/variables'
.map-banner
  background-color: $color-map-dark
  border-radius: .5em
  color: $color-map-light
  max-width: 400px
  margin: 1rem
  padding: .5em 1em

  p,div
    padding: 0 0 1rem

  button
    color: hotpink
    font-size: .8em
    letter-spacing: .12em
    margin-left: .5rem
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
