<template>
  <div class="u-page-container">
    <v-container>
      <div class="main-message">system "{{ systemName }}" not recognized</div>
      <div class="mt-4">
        <a href="/" class="home-button">return to home</a>
      </div>
    </v-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      systemName: ''
    }
  },
  mounted () {
    this.systemName = this.$route.params.name
  }
}
</script>
<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/utils/page'
.theme--dark
  .u-page-container
    background-color: $color-map-background
    color: $color-white
    h2
      color: $color-white

.u-page-container

  display: flex
  flex-direction: column
  justify-content: center

.container
  max-width: 450px
  text-align: center

.main-message
  font-weight: bold
</style>
