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
        color="grey lighten-1"
        v-bind="attrs"
        v-on="on"
      >
        About
      </v-btn>
    </template>

    <v-card>
      <v-container class="px-8 py-8">
        <h2 class="mb-4">About <span class="text-uppercase">delta v map</span></h2>
        <p>How to use this app:</p>
        <p>
          <ol>
            <li>Click on the origin</li>
            <li>Click on the destination</li>
          </ol>
        </p>
        <p>
          This will calculate the total delta-v requirement for a Hohman transfer for that particular journey.
        </p>
        <p class="px-4 py-3 grey lighten-3">
          <a href="https://en.wikipedia.org/wiki/Delta-v">Delta-v</a>
          is the change of velocity required to move from one orbit to another
        </p>
        <p class="px-4 py-3 grey lighten-3">
          A <a href="">Hohmann transfer orbit</a>
          is normally the most practical and efficient way to get from A to B
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
        </div>
        <div>
          <h3>Credits</h3>
          <p>The values used in this app are based on the values from this map:
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
      </v-container>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
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
