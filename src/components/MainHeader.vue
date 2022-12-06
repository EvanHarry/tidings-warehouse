<template>
  <q-header
    bordered
    class="bg-white text-grey-8"
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
          color="grey-8"
          dense
          flat
          icon="person"
          :ripple="false"
          @click="handleProfile"
        >
          <q-tooltip>Profile</q-tooltip>
        </q-btn>

        <q-btn
          color="red-8"
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
import { defineComponent } from 'vue'
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

    return { handleLogout, handleProfile, user, userName }
  }
})
</script>
