<template>
  <q-layout class="bg-grey-1">
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
              <div class="text-h3 text-weight-light text-orange">Villastellone Magazzino</div>

              <div class="text-caption text-grey">
                <strong class="text-blue">Adler Pelzer Group</strong>
              </div>
            </q-card-section>
          </q-card-section>

          <q-form @submit="handleRegister">
            <q-card-section class="q-pb-sm q-pt-xs row">
              <div class="col-3 text-subtitle2 row items-center">Email</div>

              <div class="col-9">
                <q-input
                  v-model="email"
                  class="bg-white col"
                  dense
                  :disable="loading"
                  outlined
                  placeholder="example@adlerpelzer.com"
                  square
                  type="email"
                />
              </div>
            </q-card-section>

            <q-card-section class="q-py-sm row">
              <div class="col-3 text-subtitle2 row items-center">Name</div>

              <div class="col-9">
                <q-input
                  v-model="name"
                  class="bg-white col"
                  dense
                  :disable="loading"
                  outlined
                  placeholder="Example"
                  square
                />
              </div>
            </q-card-section>

            <q-card-section class="q-py-sm row">
              <div class="col-3 text-subtitle2 row items-center">Password</div>

              <div class="col-9">
                <q-input
                  v-model="password"
                  class="bg-white col"
                  dense
                  :disable="loading"
                  outlined
                  placeholder="********"
                  square
                  type="password"
                />
              </div>
            </q-card-section>

            <q-card-section class="q-pt-sm row">
              <div class="col-3 text-subtitle2 row items-center">Confirm Password</div>

              <div class="col-9">
                <q-input
                  v-model="passwordConfirm"
                  class="bg-white col"
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
                @click="$router.push('/login')"
              >
                Back to Login
              </div>

              <q-space />

              <q-btn
                class="q-mx-sm"
                color="blue"
                :loading="loading"
                :ripple="false"
                style="border-radius: 0; max-width: 150px; width: 100%;"
                type="submit"
                unelevated
              >
                Register
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'AppRegister',

  setup () {
    const $router = useRouter()

    const { register } = useAuthUser()

    const email = ref('evan.harry@adlerpelzer.com')
    const loading = ref(false)
    const name = ref('Evan Harry')
    const password = ref('Test1234')
    const passwordConfirm = ref('Test1234')

    const handleRegister = async () => {
      loading.value = true

      await register(email.value, name.value, password.value)
        .then(() => $router.push('/home'))
        .catch((err) => console.log(err))
        .finally(() => { loading.value = false })
    }

    return {
      email,
      loading,
      name,
      password,
      passwordConfirm,
      handleRegister
    }
  }
})
</script>
