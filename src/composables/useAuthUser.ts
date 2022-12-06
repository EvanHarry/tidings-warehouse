import { User } from '@supabase/supabase-js'
import { ref } from 'vue'

import useSupabase from './useSupabase'

const isAuthorized = ref(false)
const user = ref<User | null>(null)
const userName = ref('')

export default () => {
  const { supabase } = useSupabase()

  /**
   * Check if user is logged in
   */
  const isLoggedIn = () => {
    return !!user.value
  }

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  /**
   * Logout
   */
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Register
   */
  const register = async (email: string, name: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) throw error
    return data
  }

  return {
    isAuthorized,
    isLoggedIn,
    login,
    logout,
    register,
    user,
    userName
  }
}
