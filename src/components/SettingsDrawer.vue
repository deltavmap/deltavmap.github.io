<template>
    <v-navigation-drawer v-model="navDrawerOpen"
                         right temporary absolute
                         :width="325"
    >
      <user-settings :user-settings="userSettings"></user-settings>
      <v-btn style="position: absolute; top: 1rem; right: 1rem;"
             class=""
             small fab depressed plain
             @click.stop="handleSettingsButtonClick"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-navigation-drawer>
</template>
<script>
import UserSettings from '../components/UserSettings'

export default {
  components: {
    UserSettings
  },
  props: [
    'navDrawerOpen',
    'userSettings',
    'handleSettingsButtonClick'
  ]
}
</script>
