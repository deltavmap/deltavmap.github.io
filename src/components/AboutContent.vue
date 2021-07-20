<template>
  <v-container class="px-8 py-8">
    <h2 class="mb-4">About <span class="text-uppercase">delta v map</span></h2>
    <p class="font-weight-medium">This app calculates the speed required to change orbits</p>
    <p class="px-4 py-3 u-highlight">
      The change in speed is known as <a href="https://en.wikipedia.org/wiki/Delta-v">delta v</a>
      (change in velocity).
      Specifically, this app will calculate the total delta v requirement for a
      <a href="https://en.wikipedia.org/wiki/Hohmann_transfer_orbit">Hohmann transfer orbit</a>,
      which is normally the most efficient route.
    </p>
    <h3>How to use this app</h3>
    <p>
      <ol>
        <li>First click on the origin</li>
        <li>Then click on the destination</li>
        <li>The number shown is the delta v required for that route</li>
      </ol>
    </p>
    <p>
      Press <span class="u-button">reverse</span> to swap the origin and destination.
      This may affect whether <a href="https://en.wikipedia.org/wiki/Aerobraking">aerobraking</a>
      is available.
    </p>
    <p>
      Press <span class="u-button">clear</span> to reset the app.
    </p>
    <div>
      <h3>Issues</h3>
      <p>To report any problems or make feature requests,
        please record them is the issue tracker for this project
        on
        <a href="https://github.com/deltavmap/deltavmap.github.io/issues">
          Github
        </a>.
      </p>
      <p>Latest changes are
        <a href="https://github.com/deltavmap/deltavmap.github.io/commits/main">here</a> (commits log).
      </p>
      <h4>Some known issues</h4>
      <ul>
        <li>The calculations are not accurate as is!
          For every node on the path, the delta-v for a insertion burn is included in the final figure.
          So for now only routes that originate from Earth (or Kerbin) should be considered somewhat accurate.
        </li>
        <li>The high DeltaV for Venus is confusing</li>
        <li>No Earth transfer orbit</li>
      </ul>
    </div>
    <div>
      <h3>Credits</h3>
      <p>The values used for this map are based on the values from this map:
        <a href="https://imgur.com/a/6bb3a">KSP Delta-v map for Real Solar System</a>.
        And <a href="https://i.imgur.com/yO0bQax.png">these</a> <a href="https://i.imgur.com/nuYvn8O.png
">three</a> <a href="https://imgur.com/a/XNswj">maps</a> for the Kerbol System
      </p>
      <p>This app was made with the following software libraries:
        <ul>
          <li><a href="https://vuejs.org/">Vue</a></li>
          <li><a href="https://vuetifyjs.com/en/">Vuetify</a></li>
          <li><a href="https://anvaka.github.io/panzoom/">panzoom.js</a></li>
        </ul>
      </p>
      <p>Icons made by
        <a href="https://creativemarket.com/Becris"
           title="Becris">
          Becris
        </a> from
        <a href="https://www.flaticon.com/"
           title="Flaticon">
          www.flaticon.com
        </a>
      </p>
    </div>
    <div>
      <h3>Support</h3>
      <p>If you would like to learn how to help support this project,
        click this coffee mug => <a style="font-size: 2.4em" @click="kofiClick()">☕</a></p>
      <div v-if="loadKofi">
        <div v-show="showKofi">
          <iframe src='https://ko-fi.com/deltavmap/?hidefeed=true&widget=true&embed=true&preview=true' style='border:none;width:100%;padding:4px;background:#f9f9f9;' height='712' title='deltavmap'></iframe>
        </div>
      </div>
      <p>Or you can help me by <span class="font-weight-bold">sharing</span> this app/site/whatever with someone you think might appreciate it.</p>
      <p>Many thanks :)</p>
    </div>
    <div v-if="updateAvailable">
      <h3>Update available</h3>
      <p>A newer version is available.
        Please <button type="button"
                       class="u-button font-weight-bold"
                       @click="handleHardRefresh">hard refresh</button>
        to get the latest version
      </p>
    </div>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      updateAvailable: false,
      loadKofi: false,
      showKofi: false
    }
  },
  methods: {
    kofiClick: function () {
      if (!this.loadKofi) {
        this.loadKofi = true
      }
      this.showKofi = !this.showKofi
    }
  }
}
</script>
<style lang="sass">
@import '../sass/variables'
@import '../sass/utils/button'

.theme--light
  *
    color: $color-dark

.theme--dark
  p, li
    color: $color-light
  h3, h4
    border-top-color: lighten($color-black, 10%)
  .u-highlight
    background-color: darken($color-black, 1%)
  .u-button
    background-color: #888
    color: darken($color-black, 50%)
  .v-card__actions
    button
      color: lighten($color-purpley, 30%)
.u-button
  font-size: 12px
  margin: .25em
</style>
