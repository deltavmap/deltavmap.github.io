<template>
  <div class="site-title__container">
    <h1 class="site-title">
      <a href="/">
        <span class="site-icon" style="">
          <slot></slot>
        </span>
      </a>
    </h1>
    <v-app-bar-nav-icon @click.stop="$parent.handleSettingButtonClick"></v-app-bar-nav-icon>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'
@import '@/sass/variables'
@import '@/sass/utils/shadow-box.sass'

.site-title__container
  align-items: center
  background-color: $color-panel-background
  @extend .u-shadow
  display: flex
  grid-row-start: 1
  grid-row-end: 1
  grid-column-start: 1
  grid-column-end: 1
  justify-content: space-between
  padding: 0 1rem
  z-index: 2

  @media #{map-get($display-breakpoints, 'md-and-up')}
    box-shadow: none

.site-title
  color: $color-panel-font-dark
  position: relative
  text-transform: uppercase

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    font-size: 1.25rem
    line-height: 2.25rem
    text-align: left

  @media #{map-get($display-breakpoints, 'xs-only')}
    padding: .5rem 1rem

  @media #{map-get($display-breakpoints, 'sm-only')}
    padding: .5rem 1.5rem

  @media #{map-get($display-breakpoints, 'md-and-up')}
    font-size: 1.5rem
    grid-column-start: 1
    grid-column-end: 1
    padding: 1rem 0
    text-align: center
    width: $controls-width

  a
    display: inline-block
    position: relative
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

.site-icon
  color: $color-panel-font-light
  display: inline-block
  position: relative
  font-weight: 500
  letter-spacing: .05em

  @media #{map-get($display-breakpoints, 'sm-only')}
    margin-left: .1em

.v-app-bar__nav-icon
  @media #{map-get($display-breakpoints, 'md-and-up')}
    position: absolute
    right: 1rem
.theme--dark.v-btn.v-btn--icon
  color: $color-panel-font-light
</style>
