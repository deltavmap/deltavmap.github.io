<template>
  <v-combobox label="select system"
              v-model="systemName"
              :items="systemNameObjects"
              outlined dense clearable
  ></v-combobox>
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
    systemName: function (newValue, oldValue) {
      this.$emit('system-name-change', (newValue) ? newValue.value : '')
    }
  },
  computed: {
    systemNameObjects: function () {
      if (this.systems) {
        return Object.keys(this.systems).map(name => {
          return this.createItem(name)
        })
      } else {
        return [this.createItem()]
      }
    }
  }
}
</script>
