<template>
  <g class="fadable">
    <circle class="location__icon-atmosphere"
            :cx="xPos"
            :cy="yPos"
            r="400"
            fill="url('#gradient-star-corona')"
            v-if="$parent.userSettings.showAtmosphere.value"
    />
    <circle class="location__icon"
            :cx="xPos" :cy="yPos"
            :fill="fillColor"
            :r="radius"
    />
    <circle class="location__icon-surface-shadow"
            :cx="xPos"
            :cy="yPos"
            :r="(this.radius - 2) + 'px'"
            stroke-width="0"
            fill="url('#gradient-star')"
            v-if="$parent.userSettings.showBodyShadows.value"
    />

  </g>
</template>
<script>
export default {
  props: [
    'diameter',
    'fillColor',
    'radius',
    'starX',
    'starY',
    'xPos',
    'yPos'
  ]
}
</script>
