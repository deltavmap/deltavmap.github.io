<template>
  <div class="controls text-left fade-in">
    <panel-control :type="'origin'"
                   :labelText="'origin'"
                   :valueText="originText"
                   :active="!!path.origin"
                   :show="!!$vuetify.breakpoint.mdAndUp"
                   :isSurface="originIsSurface"
                   :hasColorIndicator="true"
    ></panel-control>
    <panel-control :type="'destination'"
                   :labelText="'destination'"
                   :valueText="destinationText"
                   :active="!!path.destination"
                   :show="!!$vuetify.breakpoint.mdAndUp"
                   :isSurface="destinationIsSurface"
                   :hasColorIndicator="true"
    ></panel-control>
    <panel-control :type="'delta-v'"
                   :labelText="'delta v'"
                   :valueText="deltaVText"
                   :active="!!path.deltaV"
                   :show="!!($vuetify.breakpoint.mdAndUp || (path.origin && path.destination))"
    ></panel-control>
    <panel-control :type="'aerobraking'"
                   :labelText="'aerobraking'"
                   :valueText="(path.origin && path.destination) ? ((path.aerobrakingAvailable) ? 'available' : 'unavailable') : ''"
                   :active="!!(path.origin && path.destination)"
                   :show="!!($vuetify.breakpoint.mdAndUp || (path.origin && path.destination))"
                   :positive="!!path.aerobrakingAvailable"
    ></panel-control>
    <prompt v-show="!path.origin"
            type="origin"
    >Select origin</prompt>
    <prompt v-show="path.origin && !path.destination"
            type="destination"
    >Select destination</prompt>
    <div class="controls__buttons">
      <div>
        <v-btn small
                  :disabled="!path.origin || !path.destination"
                  @click="$emit('controls-reverse-selected-nodes')"
        >reverse</v-btn>
      </div>
      <div>
        <v-btn small
               :disabled="!path.origin && !path.destination"
               @click="$emit('controls-clear-path')"
        >clear</v-btn>
      </div>
      <div>
        <about-dialog :local-version-number="$parent.localVersionNumber"
                      :update-available="$parent.$parent.$parent.updateExists"
                      v-on:refresh-button-click="$emit('refresh-button-click')"
        />
      </div>
    </div>
<!--    <div class="controls__footer">-->
<!--      <a id="kofi-button" href='https://ko-fi.com/N4N14ZTHI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi5.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>-->
<!--    </div>-->
  </div>
</template>
<script>
import Utils from './utils'

import AboutDialog from './AboutDialog'
import PanelControl from './PanelControl'
import Prompt from './Prompt'

export default {
  props: [
    'path'
  ],
  components: {
    AboutDialog,
    PanelControl,
    Prompt
  },
  methods: {
    selectedIsSurface: function (nodeData) {
      return (nodeData && Utils.isDefined(nodeData.nodeType) && nodeData.nodeType === 'surface')
    }
  },
  computed: {
    originText: function () {
      return (this.path.origin) ? this.path.origin.label : ''
    },
    destinationText: function () {
      return (this.path.destination) ? this.path.destination.label : ''
    },
    originIsSurface: function () {
      return this.selectedIsSurface(this.path.origin)
    },
    destinationIsSurface: function () {
      return this.selectedIsSurface(this.path.destination)
    },
    deltaVText: function () {
      return (this.path.deltaV) ? this.path.deltaV.toFixed(3) + ' km/s' : ''
    }
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '@/sass/variables'
@import '@/sass/utils/shadow-box.sass'

$color-controls-light: lighten($color-purpley-red, 60%)

.controls
  @extend .u-shadow
  $shadow: 2px
  background-color: $color-panel-background
  color: $color-panel-font-light
  display: flex
  position: relative
  z-index: 2

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    display: grid
    grid-template-columns: 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5%
    padding: .5rem
    width: 100%
    position: fixed
    bottom: 0

  @media #{map-get($display-breakpoints, 'xs-only')}
    // grid: 100% / auto
    display: flex
    flex-direction: column
    justify-content: space-around
    .prompt
      max-width: 300px
      min-width: 200px
      align-self: center

  @media #{map-get($display-breakpoints, 'sm-only')}
    // .control--origin
    //   grid-row: 1
    //   grid-column: 5 / span 4
    // .control--destination
    //   grid-row: 1
    //   grid-column: 5 / span 4
    .control--delta-v
      display: flex
      grid-row: 1
      grid-column: 1 / span 6
      justify-content: flex-end
    .control--aerobraking
      display: flex
      flex-direction: row-reverse
      justify-content: flex-end
      grid-row: 1
      grid-column: 7 / span 6
      .control__label
        display: flex
        flex-direction: column
    .controls__buttons
      grid-row: 2
      grid-column: 5 / span 4
    .prompt
      grid-row: 1
      grid-column: 5 / span 4

  @media #{map-get($display-breakpoints, 'md-and-up')}
    box-shadow: none
    flex-direction: column
    grid-column: 1
    grid-row: 2
    padding: 0 1rem
    width: $controls-width

  > *
    margin: .25rem 0

  &__buttons
    display: flex
    // grid-row: 3
    flex-direction: row
    margin-top: .5rem
    padding: 0

    @media #{map-get($display-breakpoints, 'sm-and-down')}

    @media #{map-get($display-breakpoints, 'xs-only')}
      justify-content: space-around
    @media #{map-get($display-breakpoints, 'sm-only')}
      justify-content: center
      > *
        margin: 0 .5rem
    @media #{map-get($display-breakpoints, 'md-and-up')}
      justify-content: space-between

    button.v-btn
      background-color: darken($color-panel-font-light, 5%) !important
      .v-btn__content
        color: darken($color-panel-font-dark, 5%)
        font-weight: 400
      &--disabled
        .v-btn__content
          color: darken($color-panel-font-light, 10%) !important

.controls__footer
  bottom: 0
  display: flex
  justify-content: center
  left: 0
  position: absolute

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    display: none
    justify-content: flex-start
    margin-left: 1rem
  @media #{map-get($display-breakpoints, 'md-and-up')}
    width: 100%
  #kofi-button
    opacity: 0.2
    &:hover
      opacity: 1
</style>
