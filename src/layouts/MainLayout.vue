<template>
  <q-layout view="hHh LpR fFf">
    <main-header v-if="isLoggedIn()" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import MainHeader from 'src/components/MainHeader.vue'
import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'MainLayout',

  components: {
    MainHeader
  },

  setup () {
    const { isLoggedIn } = useAuthUser()

    return { isLoggedIn }
  }
})
</script>
