'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Admin emails that have full access
const ADMIN_EMAILS = ['e24417@eng.pdn.ac.lk']

// Valid email pattern: e24XXX@eng.pdn.ac.lk
const VALID_EMAIL_PATTERN = /^e24\d{3}@eng\.pdn\.ac\.lk$/

export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[v0] Sign in error:', error)
      return { error: error.message || 'Failed to sign in' }
    }

    if (data.user) {
      redirect('/app')
    }
  } catch (err) {
    console.error('[v0] Sign in error:', err)
    return { error: 'Authentication failed' }
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    // Validate email format
    if (!VALID_EMAIL_PATTERN.test(email) && !ADMIN_EMAILS.includes(email)) {
      return { error: 'Invalid email. Must be e24XXX@eng.pdn.ac.lk format.' }
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      console.error('[v0] Sign up error:', error)
      return { error: error.message || 'Failed to create account' }
    }

    return { data, message: 'Account created! Check your email to confirm.' }
  } catch (err) {
    console.error('[v0] Sign up error:', err)
    return { error: 'Failed to create account' }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const email = user.email || ''
  const isValidEmail = VALID_EMAIL_PATTERN.test(email)
  const isAdmin = ADMIN_EMAILS.includes(email)

  // Determine role
  let role: 'admin' | 'voter' | 'viewer' = 'viewer'
  if (isAdmin) {
    role = 'admin'
  } else if (isValidEmail) {
    role = 'voter'
  }

  // Upsert user in our users table
  if (isValidEmail || isAdmin) {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      email: email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      role: isAdmin ? 'admin' : 'voter',
    }, {
      onConflict: 'id',
    })

    if (error) {
      console.error('Error upserting user:', error)
    }
  }

  return {
    id: user.id,
    email: email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0],
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    role,
    canVote: role === 'admin' || role === 'voter',
    isAdmin: role === 'admin',
  }
}

export async function getUserVotes() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { femaleVotes: [], maleVotes: [] }
  }

  const { data: votes, error } = await supabase
    .from('votes')
    .select('candidate_id, category')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching votes:', error)
    return { femaleVotes: [], maleVotes: [] }
  }

  const femaleVotes = votes?.filter(v => v.category === 'female').map(v => v.candidate_id) || []
  const maleVotes = votes?.filter(v => v.category === 'male').map(v => v.candidate_id) || []

  return { femaleVotes, maleVotes }
}
