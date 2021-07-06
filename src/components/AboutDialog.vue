<template>
  <v-dialog
    class="about-dialog"
    v-model="dialogOpen"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        small
        class="about-dialog__button"
        v-bind="attrs"
        v-on="on"
      >
        About
      </v-btn>
    </template>

    <v-card>
      <about-content></about-content>
      <v-divider></v-divider>
      <v-card-actions class="text-center">
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="dialogOpen = false"
        >
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style lang="sass" scoped>
.v-dialog
  a
    color: lighten($color-purpley, 20%)
  .v-btn__content
    color: $color-purpley !important
  p
    margin-bottom: 1rem
  h3, h4
    border-top-width: .5px
    border-top-style: solid
    margin: 3rem 0 .5rem
    padding-top: 1rem
    text-transform: uppercase

  .version-number
    color: $color-light
    padding-left: 8px
</style>
<script>
import AboutContent from './AboutContent'

export default {
  components: {
    AboutContent
  },
  props: ['localVersionNumber', 'updateAvailable'],
  data () {
    return {
      dialogOpen: false
    }
  },
  methods: {
    handleHardRefresh: function () {
      this.$emit('refresh-button-click')
    }
  }
}
</script>
