'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoginView } from '@/components/login-view'
import { HomeView } from '@/components/home-view'
import { AboutView } from '@/components/about-view'
import { AdminView } from '@/components/admin-view'
import type { Candidate, User } from '@/lib/types'

type Page = 'login' | 'home' | 'about' | 'admin'

interface PageantAppProps {
  initialCandidates: Candidate[]
  initialUser: User | null
  initialVotes: { femaleVotes: string[]; maleVotes: string[] }
}

export function PageantApp({ initialCandidates, initialUser, initialVotes }: PageantAppProps) {
  const [currentPage, setCurrentPage] = useState<Page>(initialUser ? 'home' : 'login')
  const [user, setUser] = useState<User | null>(initialUser)
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [userVotes, setUserVotes] = useState(initialVotes)

  // Update state when initial props change (e.g., after auth callback)
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
      setCurrentPage('home')
    }
  }, [initialUser])

  useEffect(() => {
    setCandidates(initialCandidates)
  }, [initialCandidates])

  useEffect(() => {
    setUserVotes(initialVotes)
  }, [initialVotes])

  const handleNavigate = (page: 'home' | 'about' | 'admin') => {
    setCurrentPage(page)
  }

  const handleCandidatesUpdate = (updatedCandidates: Candidate[]) => {
    setCandidates(updatedCandidates)
  }

  const handleVotesUpdate = (newVotes: { femaleVotes: string[]; maleVotes: string[] }) => {
    setUserVotes(newVotes)
  }

  // Create a user object for components (for non-logged in viewing)
  const viewerUser: User = user || {
    id: '',
    email: '',
    name: 'Guest',
    avatar_url: null,
    role: 'viewer',
    canVote: false,
    isAdmin: false,
  }

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'login' && !user && (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoginView 
            onViewCandidates={() => setCurrentPage('home')}
          />
        </motion.div>
      )}

      {currentPage === 'home' && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HomeView
            candidates={candidates}
            user={viewerUser}
            userVotes={userVotes}
            onVotesUpdate={handleVotesUpdate}
            onNavigate={handleNavigate}
            onLoginRequired={() => setCurrentPage('login')}
          />
        </motion.div>
      )}

      {currentPage === 'about' && (
        <motion.div
          key="about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AboutView
            user={viewerUser}
            onNavigate={handleNavigate}
          />
        </motion.div>
      )}

      {currentPage === 'admin' && user?.isAdmin && (
        <motion.div
          key="admin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AdminView
            candidates={candidates}
            user={user}
            onCandidatesUpdate={handleCandidatesUpdate}
            onNavigate={handleNavigate}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
