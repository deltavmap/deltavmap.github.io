<template>
  <h1 class="site-title fade-in">
    <span class="site-icon" style="">
      <slot></slot>
    </span>
  </h1>
</template>
<script>

</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '@/sass/variables'
@import '@/sass/utils/shadow-box.sass'

.site-title
  @extend .u-shadow
  color: $color-panel-font-dark
  background-color: $color-panel-background
  position: relative
  text-transform: uppercase
  z-index: 2

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    grid-row-start: 1
    grid-row-end: 1
    grid-column-start: 1
    grid-column-end: 1

  &-container
    background-color: $color-light
    display: flex
    align-items: center
    justify-content: space-between
    z-index: 3

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    font-size: 1.25rem
    line-height: 2.25rem
    padding: .5rem 1rem
    text-align: left

  @media #{map-get($display-breakpoints, 'md-and-up')}
    box-shadow: none
    font-size: 1.5rem
    grid-column-start: 1
    grid-column-end: 1
    padding: 1rem 0
    text-align: center
    width: $controls-width

.site-icon
  color: $color-panel-font-light
  display: inline-block
  position: relative
  font-weight: 500
  letter-spacing: .05em
  &:before
    content: ' '
    width: 1.4em
    height: 1.4em
    background-image: url(/img/icons/mstile-70x70.png)
    background-position: center
    background-size: cover
    display: block
    float: left
    position: relative
    top: .15em

    @media #{map-get($display-breakpoints, 'sm-and-down')}
      margin-left: -0.4em

    @media #{map-get($display-breakpoints, 'md-and-up')}
      top: 0
      display: inline-block
      position: absolute
      left: -1.6em
</style>
