import type { User } from '@supabase/supabase-js'
import type { createClient } from '@/lib/supabase/server'
import { getUserRole, isAllowedEmail } from '@/lib/types'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export async function ensureDbUser(supabase: SupabaseClient, user: User) {
  const { data: existing } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle()

  if (existing) {
    return existing
  }

  const email = user.email || ''
  if (!isAllowedEmail(email) && getUserRole(email) !== 'admin') {
    return null
  }

  const { data: created, error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      role: getUserRole(email),
    })
    .select('id, role')
    .single()

  if (error) {
    console.error('Error ensuring user record:', error)
    return null
  }

  return created
}
