import { createClient } from '@/lib/supabase/server'
import { ensureDbUser } from '@/lib/ensure-db-user'
import { NextResponse } from 'next/server'
import { isAllowedEmail } from '@/lib/types'

function getCandidateId(request: Request, body?: Record<string, unknown>) {
  const { searchParams } = new URL(request.url)
  const fromQuery = searchParams.get('candidate_id') ?? searchParams.get('candidateId')
  if (fromQuery) return fromQuery

  if (!body) return null
  const fromBody = body.candidate_id ?? body.candidateId
  return typeof fromBody === 'string' ? fromBody : null
}

// GET user's votes
export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ votes: [] })
  }

  const dbUser = await ensureDbUser(supabase, user)
  if (!dbUser) {
    return NextResponse.json({ votes: [] })
  }

  const { data: votes, error } = await supabase
    .from('votes')
    .select('*, candidate:candidates(*)')
    .eq('user_id', dbUser.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ votes })
}

// POST create vote
export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAllowedEmail(user.email || '')) {
    return NextResponse.json({ error: 'Your email is not allowed to vote' }, { status: 403 })
  }

  const dbUser = await ensureDbUser(supabase, user)
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const body = await request.json()
  const candidate_id = getCandidateId(request, body)

  if (!candidate_id) {
    return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 })
  }

  const { data: candidate } = await supabase
    .from('candidates')
    .select('category')
    .eq('id', candidate_id)
    .single()

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
  }

  const { data: existingVotes } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', dbUser.id)
    .eq('category', candidate.category)

  if (existingVotes && existingVotes.length >= 3) {
    return NextResponse.json({ error: `You have already used all 3 votes for ${candidate.category} candidates` }, { status: 400 })
  }

  const { data: vote, error } = await supabase
    .from('votes')
    .insert({
      user_id: dbUser.id,
      candidate_id,
      category: candidate.category,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You have already voted for this candidate' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vote }, { status: 201 })
}

// DELETE remove vote
export async function DELETE(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await ensureDbUser(supabase, user)
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  let body: Record<string, unknown> | undefined
  try {
    body = await request.json()
  } catch {
    body = undefined
  }

  const candidate_id = getCandidateId(request, body)

  if (!candidate_id) {
    return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('user_id', dbUser.id)
    .eq('candidate_id', candidate_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
