<template>
  <g class="location__icon location__icon--orbit-l2 fadable">
    <icon-border :xPos="xPos" :yPos="yPos" :radius="radius"
    ></icon-border>
    <circle :cx="xPos"
            :cy="yPos + 25"
            :r="12"
            fill="none"
            class=""
    ></circle>
    <circle :cx="xPos"
            :cy="yPos - 12"
            :r="8"
            fill="none"
            class=""
    ></circle>
    <circle :cx="xPos"
            :cy="yPos - 30"
            :r="2"
            fill="none"
            class=""
    ></circle>
  </g>
</template>
<script>
import IconBorder from './IconBorder'

export default {
  components: {
    IconBorder
  },
  props: [
    'radius',
    'xPos',
    'yPos'
  ]
}
</script>
