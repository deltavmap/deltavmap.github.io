<template>
  <v-combobox
      v-model="value"
      :items="items"
      :label="label"
      outlined
      dense
      clearable
    ></v-combobox>
</template>
<script>
export default {
  props: [
    'initialValue',
    'items',
    'label',
    'changeHandler'
  ],
  data () {
    return { value: this.initialValue }
  },
  watch: {
    value: function (newValue) {
      this.changeHandler(newValue.value)
    }
  }
}
</script>
