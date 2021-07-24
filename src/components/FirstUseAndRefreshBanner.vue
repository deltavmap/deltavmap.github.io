<template>
  <banner class="fade-in"
            :display-banner="displayBanner"
            v-on:close-banner="handleBannerClose"
    >
    <div class="px-4 mb-4 py-4 rounded u-bg-color-main">
      <div class="d-flex justify-start align-center">
        <div class="mr-1 banner__icon banner__icon--warn"><div>⚠</div></div>
        <span class="text-center">
          This is app is still in active development.
        </span>
        <div class="ml-1 banner__icon banner__icon--warn"><div>⚠</div></div>
      </div>
    </div>
    <div v-if="updateExists"
         class="mb-4 pa-4 rounded u-bg-color-warn"
         style="letter-spacing: .05em"
    >
      <div class="d-flex justify-center align-center">

        <div class="text-left d-flex flex-column justify-center text-center">
          <p>UPDATE AVAILABLE, PLEASE:</p>
          <button type="button"
                  @click="hardRefresh()"
                  class="d-flex align-center justify-space-between px-3"
          >
            <span class="mr-4 banner__icon banner__icon--refresh"><div>↺</div></span>
            HARD REFRESH
            <span class="ml-4 banner__icon banner__icon--refresh"><div>↺</div></span>
          </button>
          <div class="mt-4" style="font-size: .8em">
            <a href="https://www.documate.org/automation/what-is-a-hard-refresh-how-to-do-a-hard-refresh-in-any-browser/"
            >learn more</a>
          </div>
        </div>
      </div>
    </div>
    <p>
      Please view the ABOUT page for more information.
    </p>
  </banner>
</template>
<script>
import Banner from '../components/Banner'
export default {
  components: {
    Banner
  },
  props: [
    'displayBanner',
    'handleBannerClose',
    'updateExists',
    'hardRefresh'
  ]
}
</script>
<style>

</style>
