'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Info, LogOut, User, ChevronDown, Crown, Vote, Search, X, Shield, LogIn } from 'lucide-react'
import Image from 'next/image'
import { CandidateCard } from './candidate-card'
import { signOut } from '@/lib/auth-actions'
import type { Candidate, User as UserType } from '@/lib/types'

interface HomeViewProps {
  candidates: Candidate[]
  user: UserType
  userVotes: { femaleVotes: string[]; maleVotes: string[] }
  onVotesUpdate: (votes: { femaleVotes: string[]; maleVotes: string[] }) => void
  onNavigate: (page: 'home' | 'about' | 'admin') => void
  onLoginRequired: () => void
}

export function HomeView({ candidates, user, userVotes, onVotesUpdate, onNavigate, onLoginRequired }: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'female' | 'male'>('female')
  const [votedFemale, setVotedFemale] = useState<string[]>(userVotes.femaleVotes)
  const [votedMale, setVotedMale] = useState<string[]>(userVotes.maleVotes)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isVoting, setIsVoting] = useState(false)

  const maxVotesPerCategory = 3
  const currentVotes = selectedCategory === 'female' ? votedFemale : votedMale
  const votesRemaining = maxVotesPerCategory - currentVotes.length
  const totalVotesUsed = votedFemale.length + votedMale.length

  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(c => c.category === selectedCategory)
    if (searchQuery.trim()) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [candidates, selectedCategory, searchQuery])

  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => b.votes - a.votes)
  }, [filteredCandidates])

  const winners = sortedCandidates.slice(0, 3)
  const contenders = sortedCandidates.slice(3)

  const handleVote = async (candidateId: string, category: 'male' | 'female') => {
    // Check if user can vote
    if (!user.canVote) {
      onLoginRequired()
      return
    }

    const currentCategoryVotes = category === 'female' ? votedFemale : votedMale
    const isUnvoting = currentCategoryVotes.includes(candidateId)

    setIsVoting(true)
    try {
      const response = await fetch('/api/votes', {
        method: isUnvoting ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId, category }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to vote')
      }

      // Update local state
      if (category === 'female') {
        const newVotes = isUnvoting 
          ? votedFemale.filter(id => id !== candidateId)
          : [...votedFemale, candidateId]
        setVotedFemale(newVotes)
        onVotesUpdate({ femaleVotes: newVotes, maleVotes: votedMale })
      } else {
        const newVotes = isUnvoting 
          ? votedMale.filter(id => id !== candidateId)
          : [...votedMale, candidateId]
        setVotedMale(newVotes)
        onVotesUpdate({ femaleVotes: votedFemale, maleVotes: newVotes })
      }
    } catch (error) {
      console.error('Vote error:', error)
      alert(error instanceof Error ? error.message : 'Failed to vote')
    } finally {
      setIsVoting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-cream" />
              </div>
              <span className="font-serif text-xl text-charcoal hidden sm:block">Elegance Pageant</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-charcoal bg-gold/10 font-medium text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-charcoal hover:bg-muted font-medium text-sm transition-colors"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </button>
              {user.isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-charcoal hover:bg-muted font-medium text-sm transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
            </div>

            {/* Profile Dropdown or Login Button */}
            {user.id ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gold/30 bg-gold/20 flex items-center justify-center">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gold-dark" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      <div className="p-4 border-b border-border">
                        <p className="font-medium text-charcoal">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.isAdmin 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.canVote 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isAdmin ? 'Admin' : user.canVote ? 'Voter' : 'Viewer'}
                          </span>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-destructive" />
                          <span className="text-sm text-destructive">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={onLoginRequired}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-white font-medium text-sm hover:bg-gold-dark transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Votes Counter */}
      {user.canVote && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="sticky top-16 z-40 bg-gradient-to-r from-gold/10 via-champagne to-gold/10 border-b border-gold/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-gold-dark" />
                <span className="text-sm font-medium text-charcoal">
                  {selectedCategory === 'female' ? 'Female' : 'Male'} Votes: <span className="text-gold-dark font-bold">{votesRemaining}</span> / {maxVotesPerCategory}
                </span>
                <div className="flex gap-1.5 ml-1">
                  {[...Array(maxVotesPerCategory)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        i < currentVotes.length ? 'bg-gold scale-110' : 'bg-gold/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="hidden sm:block w-px h-5 bg-gold/30" />
              <span className="text-xs text-muted-foreground">
                Total: {totalVotesUsed} / 6 votes used
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Guest Banner */}
      {!user.canVote && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="sticky top-16 z-40 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 border-b border-amber-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-amber-800">
                Sign in with your <span className="font-medium">e24XXX@eng.pdn.ac.lk</span> email to vote
              </span>
              <button
                onClick={onLoginRequired}
                className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Toggle and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <div className="inline-flex bg-secondary rounded-xl p-1.5 border border-border">
            {(['female', 'male'] as const).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setSearchQuery('')
                  setIsSearchOpen(false)
                }}
                className={`
                  relative px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300
                  ${selectedCategory === category 
                    ? 'text-white' 
                    : 'text-muted-foreground hover:text-charcoal'
                  }
                `}
              >
                {selectedCategory === category && (
                  <motion.div
                    layoutId="categoryTab"
                    className="absolute inset-0 bg-gradient-to-r from-gold to-gold-dark rounded-lg shadow-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 capitalize">{category} Candidates</span>
              </button>
            ))}
          </div>

          {/* Expandable Search */}
          <div className="relative">
            <motion.div
              initial={false}
              animate={{ 
                width: isSearchOpen ? 220 : 40,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="flex items-center h-10 bg-secondary rounded-full border border-border overflow-hidden"
            >
              <button
                onClick={() => {
                  if (isSearchOpen && searchQuery) {
                    setSearchQuery('')
                  } else {
                    setIsSearchOpen(!isSearchOpen)
                  }
                }}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-charcoal transition-colors"
              >
                {isSearchOpen && searchQuery ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) {
                        setIsSearchOpen(false)
                      }
                    }}
                    autoFocus
                    className="flex-1 h-full pr-4 bg-transparent text-sm text-charcoal placeholder:text-muted-foreground focus:outline-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Empty State */}
        {sortedCandidates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Crown className="w-16 h-16 text-gold/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-charcoal mb-2">No Candidates Yet</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No candidates found matching "${searchQuery}"`
                : `No ${selectedCategory} candidates have been added yet.`
              }
            </p>
          </motion.div>
        )}

        {/* Winners Circle */}
        {winners.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">The Winners Circle</h2>
              <p className="text-muted-foreground text-sm">Current top candidates based on votes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="order-2 md:order-1 md:mt-8">
                {winners[1] && (
                  <CandidateCard
                    candidate={winners[1]}
                    isSelected={currentVotes.includes(winners[1].id)}
                    isDisabled={!user.canVote || isVoting || (votesRemaining === 0 && !currentVotes.includes(winners[1].id))}
                    onVote={() => handleVote(winners[1].id, selectedCategory)}
                    rank={2}
                    isWinner
                    showVoteButton={user.canVote}
                  />
                )}
              </div>

              {/* 1st Place */}
              <div className="order-1 md:order-2">
                {winners[0] && (
                  <CandidateCard
                    candidate={winners[0]}
                    isSelected={currentVotes.includes(winners[0].id)}
                    isDisabled={!user.canVote || isVoting || (votesRemaining === 0 && !currentVotes.includes(winners[0].id))}
                    onVote={() => handleVote(winners[0].id, selectedCategory)}
                    rank={1}
                    isWinner
                    showVoteButton={user.canVote}
                  />
                )}
              </div>

              {/* 3rd Place */}
              <div className="order-3 md:mt-12">
                {winners[2] && (
                  <CandidateCard
                    candidate={winners[2]}
                    isSelected={currentVotes.includes(winners[2].id)}
                    isDisabled={!user.canVote || isVoting || (votesRemaining === 0 && !currentVotes.includes(winners[2].id))}
                    onVote={() => handleVote(winners[2].id, selectedCategory)}
                    rank={3}
                    isWinner
                    showVoteButton={user.canVote}
                  />
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Contenders */}
        {contenders.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">The Contenders</h2>
              <p className="text-muted-foreground text-sm">Support your favorite rising stars</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contenders.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <CandidateCard
                    candidate={candidate}
                    isSelected={currentVotes.includes(candidate.id)}
                    isDisabled={!user.canVote || isVoting || (votesRemaining === 0 && !currentVotes.includes(candidate.id))}
                    onVote={() => handleVote(candidate.id, selectedCategory)}
                    showVoteButton={user.canVote}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  )
}
