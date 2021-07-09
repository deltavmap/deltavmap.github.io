<template>
  <g class="location__icon location__icon--orbit-transfer fadable">
    <icon-border :xPos="xPos" :yPos="yPos" :radius="radius"
    ></icon-border>
    <g v-if="$parent.userSettings.showIcons.value">
      <circle :cx="xPos"
              :cy="yPos"
              :r="smallRadius"
              fill="none"
      ></circle>
      <ellipse :cx="xPos + 12" :cy="yPos" rx="25" ry="20" fill="none"
               :transform="'rotate(0,' + xPos + ',' + yPos + ')'"
      ></ellipse>
    </g>
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
  ],
  computed: {
    smallRadius: function () {
      return this.radius / 4
    }
  }
}
</script>
