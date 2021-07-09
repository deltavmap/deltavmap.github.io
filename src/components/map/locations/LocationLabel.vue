<template>
  <foreignObject :x="xPos - 75"
                 :y="(yPos + 65)"
                 width="150"
                 height="100"
  >
    <body xmlns="http://www.w3.org/1999/xhtml"
          style="padding: 5px;"
    >
    <div class="underlay-html-container">
      <p class="location__label fadable">
        <slot></slot>
      </p>
      <div class="click-target" @click="clickHandler"></div>
    </div>
    </body>
  </foreignObject>
</template>
<script>

export default {
  props: [
    'xPos',
    'yPos',
    'clickHandler'
  ]
}
</script>
<style lang="sass">
@import '../../../sass/variables'
$border-radius: 4px

.location__label
  border-radius: $border-radius
  padding: .5em 1em
  text-align: center
  transition: background-color $transition-standard, color $transition-standard // , stroke $transition-standard

  .path-selected .node-on-path:not(.origin-node, .destination-node) &
    transition: background-color $transition-standard, color $transition-standard

.underlay-html-container
  background-color: inherit
  position: relative
  &:before
    background-color: $color-map-background
    border-radius: $border-radius
    bottom: 0
    content: ' '
    left: 0
    position: absolute
    right: 0
    top: 0
    z-index: -1
  & > *
    z-index: 1

  .click-target
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    opacity: 0 !important
</style>
