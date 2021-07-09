<template>
  <g class="location__icon location__icon--orbit-l1 fadable">
    <icon-border :xPos="xPos" :yPos="yPos" :radius="radius"
    ></icon-border>
    <g v-if="$parent.userSettings.showIcons.value">
      <circle :cx="xPos"
              :cy="yPos + 25"
              :r="12"
              fill="none"
              class=""
      ></circle>
      <circle :cx="xPos"
              :cy="yPos - 4"
              :r="2"
              fill="none"
              class=""
      ></circle>
      <circle :cx="xPos"
              :cy="yPos - 24"
              :r="8"
              fill="none"
              class=""
      ></circle>
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
  ]
}
</script>
