<template>
    <div class="controls text-left fade-in">
      <div class="controls__section controls__section--origin"
           v-show="$vuetify.breakpoint.mdAndUp || !origin">
        <label class="controls__label">origin</label>
        <div class="controls__value "
             :class="{
               'controls__value--active': origin,
               'controls__value--is-surface': originIsSurface
             }"
             @click="$emit('controls-origin-click')"
        >
          <span v-show="!originText"
                class="controls__placeholder controls__placeholder--origin">
            Select origin
          </span>
          &#8203;{{ originText }}
        </div>
      </div>
      <div class="controls__section controls__section--destination"
           v-show="$vuetify.breakpoint.mdAndUp || (origin && !destination)">
        <label class="controls__label">destination</label>
        <div class="controls__value "
             :class="{
               'controls__value--active': destination,
               'controls__value--is-surface': destinationIsSurface
             }"
             @click="$emit('controls-destination-click')"
        >
          <span v-show="!destinationText"
                class="controls__placeholder controls__placeholder--destination"
          >Select destination</span>
          &#8203;{{ destinationText }}
        </div>
      </div>
      <div class="controls__section"
           v-show="$vuetify.breakpoint.mdAndUp || (origin && destination)">
        <label class="controls__label">delta v</label>
        <div class="controls__value"
             :class="{'controls__value--active': deltaV}"
        >&#8203;{{ deltaVText }}</div>
      </div>
      <div class="controls__section controls__aerobraking"
           :class="{'controls__aerobraking--active': aerobrakingAvailable}"
           v-show="$vuetify.breakpoint.mdAndUp || (origin && destination)"
      >
        <div class="controls__value">
          <span class="controls__aerobraking_check">✓</span>
          <span class="controls__aerobraking_label">Aerobraking
            <span v-show="!aerobrakingAvailable">un</span>available
          </span>
        </div>
      </div>
      <div class="controls__section controls__buttons d-flex justify-space-between">
        <div>
          <v-btn small
                    color="grey lighten-1"
                    :disabled="!origin || !destination"
                    @click="$emit('controls-reverse-selected-nodes')"
          >reverse</v-btn>
        </div>
        <div>
          <v-btn small
                 color="grey lighten-1"
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
    AboutDialog
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '@/sass/variables'
@import '@/sass/utils/shadow-box.sass'

.controls
  @extend .u-shadow
  $shadow: 2px
  background-color: $color-panel-background
  color: $color-dark-text
  display: flex
  z-index: 2
  @media #{map-get($display-breakpoints, 'sm-and-down')}
    display: flex
    flex-wrap: wrap
    grid-row: 3
    justify-content: center
    padding: .5rem 0
    width: 100%
    position: fixed
    bottom: 0
  @media #{map-get($display-breakpoints, 'md-and-up')}
    box-shadow: none
    display: flex
    flex-direction: column
    grid-column: 1
    grid-row: 2
    padding: 0 1rem
    width: $controls-width

  .row
    padding: .5rem

  .controls
    &__section
      @media #{map-get($display-breakpoints, 'sm-and-down')}
        align-items: center
        display: flex
        margin: .5rem 1rem

      @media #{map-get($display-breakpoints, 'md-and-up')}
        margin-top: .5rem

      &--origin, &--destination
        .controls__value
          &--active
            overflow: hidden
            position: relative
            &:before
              content: ''
              position: absolute
              display: inline-block
              width: 5px
              left: 0
              top: 0
              bottom: 0
              background-color: $color-dark
              //border-style: solid
              //border-width: 2px
        @media #{map-get($display-breakpoints, 'sm-and-down')}
          background-color: $color-dark
          border-radius: .5rem
          color: $color-light
          padding-left: .75rem
          position: relative
          &:before
            content: ''
            position: absolute
            display: inline-block
            width: .25rem
            left: 0
            top: 0
            bottom: 0

      &--origin
        .controls__value
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            border: 2px solid $color-origin
            color: $color-white
          &--active
            //border-color: $color-origin
            //color: $color-origin
            &:before
              background-color: $color-origin
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            //&:before
            //  background-color: $color-origin

      &--destination
        .controls__value
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            border: 2px solid $color-destination
            color: $color-white
          &--active
            //border-color: $color-destination
            //color: $color-destination
            &:before
              background-color: $color-destination
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            //&:before
            //  background-color: $color-destination

    &__label
      text-transform: capitalize
      @media #{map-get($display-breakpoints, 'sm-and-down')}
        display: none
        margin-right: 1rem
      @media #{map-get($display-breakpoints, 'md-and-up')}
        min-width: 6rem

    &__value
      border: 1px solid #bbb
      border-radius: .25rem
      min-width: 8rem
      overflow: hidden
      padding: .25rem .5rem
      text-align: center
      &--active
        background-color: $color-dark
        color: $color-light
      &--is-surface
        text-transform: uppercase
        letter-spacing: .2em

    &__placeholder
      opacity: 0.7
      @media #{map-get($display-breakpoints, 'md-and-up')}
        display: none

    &__aerobraking
      opacity: 0.5
      text-align: left

      .controls__value
        border: 0
        padding-left: 0
        text-align: left

      &_check
        color: transparent
        display: inline-block
        margin-right: .5em
        border: 2px solid $color-dark
        border-radius: 2px
        width: 20px
        height: 20px
        line-height: 17px
        padding-left: 2px

      &--active
        opacity: 1
        color: $color-dark
        .controls__aerobraking_check
          color: $color-dark

    &__buttons
      > *
        @media #{map-get($display-breakpoints, 'sm-and-down')}
          margin-right: 1rem

</style>
