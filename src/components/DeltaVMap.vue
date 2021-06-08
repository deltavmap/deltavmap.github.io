<template>

</template>
<script>


export default {
  props: ['pathSelected'],
  data () {
    return {
      pageLoaded: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.pageLoaded = true
    }, 1000)
  }
}
</script>
