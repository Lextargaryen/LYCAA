import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, getUserVotes } from '@/lib/auth-actions'
import { PageantApp } from '@/components/pageant-app'
import type { Candidate } from '@/lib/types'

export default async function Page() {
  const supabase = await createClient()
  
  let candidatesData = null
  let user = null
  let userVotes = { femaleVotes: [], maleVotes: [] }

  // Fetch candidates from database if Supabase is configured
  if (supabase) {
    const result = await supabase
      .from('candidates')
      .select('*')
      .order('votes', { ascending: false })
    candidatesData = result.data
    
    // Get current user (if logged in)
    user = await getCurrentUser()
    
    // Get user's votes (if logged in)
    userVotes = user ? await getUserVotes() : { femaleVotes: [], maleVotes: [] }
  }

  const candidates: Candidate[] = (candidatesData || []).map(c => ({
    id: c.id,
    name: c.name,
    candidateNumber: c.candidate_number,
    category: c.category as 'male' | 'female',
    imageUrl: c.image_url || '/placeholder.svg',
    bio: c.bio || '',
    votes: c.votes || 0,
  }))

  return (
    <PageantApp 
      initialCandidates={candidates}
      initialUser={user}
      initialVotes={userVotes}
    />
  )
}
