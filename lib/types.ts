export interface User {
  id: string
  email: string
  name: string
  avatar_url: string | null
  role: 'voter' | 'admin' | 'viewer'
  canVote: boolean
  isAdmin: boolean
}

export interface Candidate {
  id: string
  name: string
  candidateNumber: number
  category: 'male' | 'female'
  imageUrl: string
  bio: string
  votes: number
}

export interface Vote {
  id: string
  user_id: string
  candidate_id: string
  category: 'male' | 'female'
  created_at: string
}

// Admin emails list - these get admin role
export const ADMIN_EMAILS = [
  'e24417@eng.pdn.ac.lk',
  // Add more admin emails here
]

// Email domain pattern for voting access
export const ALLOWED_EMAIL_PATTERN = /^e24\d{3}@eng\.pdn\.ac\.lk$/

export function isAllowedEmail(email: string): boolean {
  return ALLOWED_EMAIL_PATTERN.test(email)
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function getUserRole(email: string): 'voter' | 'admin' {
  return isAdminEmail(email) ? 'admin' : 'voter'
}
