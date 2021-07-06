<template>
  <v-app>
    <transition name="page">
      <router-view/>
    </transition>
  </v-app>
</template>
<script>
import update from './mixins/update'

export default {
  name: 'App',
  mixins: [update]
}
</script>
