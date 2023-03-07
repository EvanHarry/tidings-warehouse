<template>
  <q-layout>
    <q-page-container>
      <q-page class="row items-center justify-center" padding>
        <q-card
          bordered
          flat
          square
        >
          <q-card-section
            class="items-center justify-center"
            horizontal
          >
            <q-card-section class="flex flex-center">
              <q-img
                fit="scale-down"
                src="~assets/magazzino.svg"
                width="75px"
              />
            </q-card-section>

            <q-card-section>
              <div class="text-h3 text-weight-light text-orange">Tidings Warehouse</div>

              <div class="text-caption text-grey">
                <strong class="text-blue">Made by Evan Harry</strong>
              </div>
            </q-card-section>
          </q-card-section>

          <q-form @submit="handleLogin">
            <q-card-section class="q-pb-sm q-pt-xs row">
              <div class="col-3 text-subtitle2 row items-center">Email</div>

              <div class="col-9">
                <q-input
                  v-model="email"
                  class="col"
                  dense
                  :disable="loading"
                  outlined
                  placeholder="name@example.org"
                  square
                  type="email"
                />
              </div>
            </q-card-section>

            <q-card-section class="q-pt-sm row">
              <div class="col-3 text-subtitle2 row items-center">Password</div>

              <div class="col-9">
                <q-input
                  v-model="password"
                  class="col"
                  dense
                  :disable="loading"
                  outlined
                  placeholder="********"
                  square
                  type="password"
                />
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <div
                class="q-pl-sm text-caption cursor-pointer non-selectable"
                style="text-decoration: underline;"
                @click="$router.push('/register')"
              >
                Register for an account
              </div>

              <q-space />

              <q-btn
                class="q-mx-sm"
                color="blue"
                :disable="!valid"
                :loading="loading"
                :ripple="false"
                style="border-radius: 0; max-width: 150px; width: 100%;"
                type="submit"
                unelevated
              >
                Login
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'AppLogin',

  setup () {
    const $router = useRouter()

    const { login } = useAuthUser()

    const email = ref('')
    const loading = ref(false)
    const password = ref('')
    const valid = computed(() => {
      let valid = true

      if (!email.value) valid = false
      if (!password.value) valid = false

      return valid
    })

    const handleLogin = async () => {
      loading.value = true

      await login(email.value, password.value)
        .then(() => $router.push('/home'))
        .catch((err) => console.log(err))
        .finally(() => { loading.value = false })
    }

    return {
      email,
      handleLogin,
      loading,
      password,
      valid
    }
  }
})
</script>
