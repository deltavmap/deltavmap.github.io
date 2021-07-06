<template>
  <label class="panel-label"><slot></slot></label>
</template>
<script>
</script>
<style lang="sass">
.panel-label
  font-size: .9em
  font-weight: 400
  letter-spacing: .1em
  text-transform: uppercase

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    display: flex
    flex-direction: column
    justify-content: center
    margin: 0 .5rem

  @media #{map-get($display-breakpoints, 'md-and-up')}
    min-width: 6rem
</style>
