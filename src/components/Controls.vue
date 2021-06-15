<template>
  <div class="controls text-left fade-in">
    <panel-control :type="'origin'"
                   :labelText="'origin'"
                   :valueText="originText"
                   :active="!!origin"
                   :show="$vuetify.breakpoint.mdAndUp"
                   :isSurface="!!originIsSurface"
                   :hasColorIndicator="true"
    ></panel-control>
    <panel-control :type="'destination'"
                   :labelText="'destination'"
                   :valueText="destinationText"
                   :active="!!destination"
                   :show="$vuetify.breakpoint.mdAndUp"
                   :isSurface="!!destinationIsSurface"
                   :hasColorIndicator="true"
    ></panel-control>
    <panel-control :type="'delta-v'"
                   :labelText="'delta v'"
                   :valueText="deltaVText"
                   :active="!!deltaV"
                   :show="$vuetify.breakpoint.mdAndUp || (origin && destination)"
    ></panel-control>
    <panel-control :type="'aerobraking'"
                   :labelText="'aerobraking'"
                   :valueText="(origin && destination) ? ((aerobrakingAvailable) ? 'available' : 'unavailable') : ''"
                   :active="(origin && destination)"
                   :show="$vuetify.breakpoint.mdAndUp || (origin && destination)"
                   :positive="aerobrakingAvailable"
    ></panel-control>
    <prompt v-show="!origin"
            type="origin"
    >Select origin</prompt>
    <prompt v-show="origin && !destination"
            type="destination"
    >Select destination</prompt>
    <div class="controls__buttons">
      <div>
        <v-btn small
                  color="grey lighten-1"
                  :disabled="!origin || !destination"
                  @click="$emit('controls-reverse-selected-nodes')"
        >reverse</v-btn>
      </div>
      <div>
        <v-btn small
               :disabled="!origin && !destination"
               @click="$emit('controls-clear-path')"
        >clear</v-btn>
      </div>
      <div>
        <about-dialog />
      </div>
    </div>
  </div>
</template>
<script>
import AboutDialog from './AboutDialog'
import PanelControl from './PanelControl'
import Prompt from './Prompt'
export default {
  props: [
    'aerobrakingAvailable',
    'deltaV',
    'deltaVText',
    'origin',
    'originText',
    'originIsSurface',
    'destination',
    'destinationText',
    'destinationIsSurface'
  ],
  components: {
    AboutDialog,
    PanelControl,
    Prompt
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
  z-index: 2

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    display: grid
    // grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto
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

</style>
