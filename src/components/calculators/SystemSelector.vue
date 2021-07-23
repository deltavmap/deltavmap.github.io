<template>
  <v-autocomplete label="select system"
              v-model="systemName"
              :items="systemNameObjects"
              outlined dense clearable
  ></v-autocomplete>
</template>
<script>
export default {
  props: ['label', 'initialSystemName', 'systems'],
  data () {
    return {
      systemName: this.createItem(this.initialSystemName)
    }
  },
  methods: {
    createItem: function (name = '') {
      return { header: '', text: name, value: name }
    }
  },
  watch: {
    initialSystemName: function (newValue) {
      this.systemName = newValue
    },
    systemName: function (newValue, oldValue) {
      // ensure that a change event only happens
      // if the systemName is changed internally
      if (this.initialSystemName !== newValue) {
        this.$emit('system-name-change', newValue)
      }
    }
  },
  computed: {
    systemNameObjects: function () {
      if (this.systems) {
        return Object.keys(this.systems).map(id => {
          return {
            text: this.systems[id].label,
            value: id
          }
        })
      } else {
        return [this.createItem()]
      }
    }
  }
}
</script>
