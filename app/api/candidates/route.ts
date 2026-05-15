import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET all candidates (public)
export async function GET() {
  const supabase = await createClient()
  
  const { data: candidates, error } = await supabase
    .from('candidates')
    .select('*')
    .order('votes', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ candidates })
}

// POST create candidate (admin only)
export async function POST(request: Request) {
  const supabase = await createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: dbUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!dbUser || dbUser.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await request.json()
  const { name, candidate_number, category, image_url, bio } = body

  if (!name || !candidate_number || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: candidate, error } = await supabase
    .from('candidates')
    .insert({
      name,
      candidate_number,
      category,
      image_url: image_url || null,
      bio: bio || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Candidate number already exists for this category' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ candidate }, { status: 201 })
}
