<template>
  <q-header
    bordered
    :class="darkMode ? 'bg-dark' : 'bg-white' + ' text-grey-8'"
    :height-hint="58"
  >
    <q-toolbar>
      <q-toolbar-title class="gt-sm q-ml-sm non-selectable">
        <strong class="text-blue">Adler Pelzer Group</strong>

        <span class="text-orange q-pl-xs">Villastellone Magazzino</span>
      </q-toolbar-title>

      <q-img
        class="lt-sm"
        fit="scale-down"
        src="~assets/magazzino.svg"
        width="36px"
      />

      <q-space />

      <div class="q-gutter-sm row items-center no-wrap q-mr-none">
        <div class="q-pr-xs text-caption">Hi, {{ userName }}</div>

        <q-btn
          :color="darkMode ? 'grey-4' : 'grey-8'"
          dense
          flat
          icon="person"
          :ripple="false"
          @click="handleProfile"
        >
          <q-tooltip>Profile</q-tooltip>
        </q-btn>

        <q-btn
          :color="darkMode ? 'grey-4' : 'grey-8'"
          dense
          flat
          :icon="darkMode ? 'dark_mode' : 'light_mode'"
          :ripple="false"
          @click="handleDarkMode"
        >
          <q-tooltip>{{ darkMode ? 'Dark Mode' : 'Light Mode' }}</q-tooltip>
        </q-btn>

        <q-btn
          :color="darkMode ? 'red-4' : 'red-8'"
          dense
          flat
          icon="exit_to_app"
          :ripple="false"
          @click="handleLogout"
        >
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { computed, defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import useAuthUser from 'src/composables/useAuthUser'
import useSupabase from 'src/composables/useSupabase'

export default defineComponent({
  name: 'MainHeader',

  setup () {
    const $quasar = useQuasar()
    const $router = useRouter()

    const { logout, user, userName } = useAuthUser()
    const { supabase } = useSupabase()

    onMounted(() => {
      const darkMode = localStorage.getItem('darkMode')
      if (darkMode) {
        $quasar.dark.set(darkMode === 'true')
      }
    })

    const handleDarkMode = () => {
      $quasar.dark.toggle()
      localStorage.setItem('darkMode', $quasar.dark.isActive)
    }

    const handleLogout = async () => {
      await logout()
        .then(() => $router.push('/login'))
        .catch((err) => console.log(err))
    }

    const handleProfile = () => {
      $quasar.dialog({
        cancel: true,
        focus: 'none',
        persistent: true,
        prompt: {
          isValid: (val: string) => { return !!val },
          model: userName.value,
          type: 'text'
        },
        title: 'Update Profile'
      }).onOk(async (payload: string) => {
        if (!user.value) return

        const { error } = await supabase.from('profiles').upsert({ id: user.value.id, full_name: payload })

        if (error) {
          if (error) console.log(error)

          return
        }

        userName.value = payload
      })
    }

    return {
      darkMode: computed(() => $quasar.dark.isActive),
      handleDarkMode,
      handleLogout,
      handleProfile,
      user,
      userName
    }
  }
})
</script>
