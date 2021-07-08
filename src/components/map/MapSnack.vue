<template>
  <div class="map-snack-container"
       :class="[(fadeAway) ? 'fade-away' : '']"
       v-if="displaySnack"
  >
    <div class="map-snack">
      <slot></slot>
      <v-btn
        depressed
        raised
        @click="handleClose"
      >close</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    const snackTitle = 'snack-intro-hide'
    const introHide = localStorage.getItem(snackTitle)
    return {
      snackTitle,
      fadeAway: false,
      displaySnack: introHide !== 'true'
    }
  },
  methods: {
    handleClose: function () {
      this.fadeAway = true
      localStorage.setItem(this.snackTitle, 'true')
      setTimeout(_ => {
        this.displaySnack = false
      }, 250)
    }
  }
}
</script>
<style lang="sass">
@import '@/sass/variables'
.map-snack
  background-color: $color-map-dark
  border-radius: .5em
  color: $color-map-light
  display: flex
  justify-content: space-between
  max-width: 400px
  padding: .5em 1em

  button
    color: hotpink
    font-size: .8em
    letter-spacing: .12em
    margin-left: .5rem
    text-transform: uppercase

  &-container
    box-sizing: border-box
    display: flex
    justify-content: center
    margin: 1rem auto
    padding: 0 1rem
    // position: absolute
    top: 10rem
    left: 0
    right: 0
    z-index: 1
    opacity: 1
    transition: all .25s

    &.fade-away
      opacity: 0

</style>
