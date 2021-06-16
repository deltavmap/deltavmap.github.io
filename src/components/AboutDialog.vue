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
      <v-container class="px-8 py-8">
        <h2 class="mb-4">About <span class="text-uppercase">delta v map</span></h2>
        <p class="font-weight-medium">This app calculates the speed required to change orbits
        </p>
        <p class="px-4 py-3 grey lighten-3">
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
          <p>Latest changes are <a href="https://github.com/deltavmap/deltavmap.github.io/commits/main">here</a> (commits log).</p>
          <h4>Some known issues</h4>
          <ul>
            <li>The high DeltaV for Venus is confusing</li>
            <li>The NRHO values are unsubstantiated</li>
            <li>No Earth transfer orbit</li>
          </ul>
        </div>
        <div>
          <h3>Credits</h3>
          <p>The values used for this map are based on the values from this map:
            <a href="https://imgur.com/a/6bb3a">KSP Delta-v map for Real Solar System</a>.
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
          <p>If you would like to help support this project,
            you can buy me a coffee using the widget below.</p>
          <p>Or you can help me by <span class="font-weight-bold">sharing</span> this app/site/whatever with someone you think might appreciate it.</p>
          <p>Many thanks :)</p>
          <iframe src='https://ko-fi.com/deltavmap/?hidefeed=true&widget=true&embed=true&preview=true' style='border:none;width:100%;padding:4px;background:#f9f9f9;' height='712' title='deltavmap'></iframe>
        </div>
      </v-container>
      <v-divider></v-divider>

      <v-card-actions>
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
@import '@/sass/variables'
@import '@/sass/utils/button'
.u-button
  font-size: 12px

.v-dialog
  a
    color: lighten($color-purpley, 20%)
  .v-btn__content
    color: $color-purpley !important
  p
    margin-bottom: 1em
  // h2,
  h3, h4
    margin: 1.75em 0 .25em
    text-transform: uppercase
</style>
<script>
export default {
  data () {
    return {
      dialogOpen: false
    }
  }
}
</script>
