import { createClient } from '@supabase/supabase-js'

import useAuthUser from './useAuthUser'

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseURL, supabaseAnonKey)

supabase.auth.onAuthStateChange(async (_, session) => {
  const { isAuthorized, user, userName } = useAuthUser()

  if (session) {
    user.value = session.user

    localStorage.setItem('refreshToken', session.refresh_token)

    const { data, error } = await supabase.from('profiles').select('approved, full_name').eq('id', user.value.id).single()
    if (error) console.log(error)

    isAuthorized.value = data?.approved as boolean || false
    userName.value = data?.full_name as string || 'N/A'
  } else {
    isAuthorized.value = false
    user.value = null
    userName.value = ''

    localStorage.removeItem('refreshToken')
  }
})

export default () => { return { supabase } }
