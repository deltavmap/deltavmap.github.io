<template>
  <g class="fadable">
    <icon-border :xPos="xPos" :yPos="yPos"
                 :fillColor="fillColor" :radius="radius"
    ></icon-border>
    <circle class="location__icon location__icon--low-orbit"
            :cx="xPos"
            :cy="yPos"
            :r="radius - 10"
            :fill="fillColor"
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
    'fillColor',
    'radius',
    'xPos',
    'yPos'
  ]
}
</script>
