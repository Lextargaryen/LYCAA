'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Winner {
  id: string
  name: string
  imageUrl: string
  rank: 'Gold' | 'Silver' | 'Bronze'
  category: 'Male' | 'Female'
}

export function VotingEndedPage() {
  // Mock winners data - replace with actual data from database
  const maleWinners: Winner[] = [
    {
      id: '1',
      name: 'Winner Name',
      imageUrl: '/placeholder.svg',
      rank: 'Gold',
      category: 'Male',
    },
    {
      id: '2',
      name: 'Second Place',
      imageUrl: '/placeholder.svg',
      rank: 'Silver',
      category: 'Male',
    },
    {
      id: '3',
      name: 'Third Place',
      imageUrl: '/placeholder.svg',
      rank: 'Bronze',
      category: 'Male',
    },
  ]

  const femaleWinners: Winner[] = [
    {
      id: '4',
      name: 'Winner Name',
      imageUrl: '/placeholder.svg',
      rank: 'Gold',
      category: 'Female',
    },
    {
      id: '5',
      name: 'Second Place',
      imageUrl: '/placeholder.svg',
      rank: 'Silver',
      category: 'Female',
    },
    {
      id: '6',
      name: 'Third Place',
      imageUrl: '/placeholder.svg',
      rank: 'Bronze',
      category: 'Female',
    },
  ]

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Gold':
        return 'from-primary to-primary/80 ring-2 ring-primary/50'
      case 'Silver':
        return 'from-silver/60 to-silver/40 ring-2 ring-silver/30'
      case 'Bronze':
        return 'from-bronze to-bronze/80 ring-2 ring-bronze/50'
      default:
        return ''
    }
  }

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'Gold':
        return 'bg-primary text-primary-foreground'
      case 'Silver':
        return 'bg-silver/80 text-dark-bg'
      case 'Bronze':
        return 'bg-bronze text-foreground'
      default:
        return ''
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header with Title Image Placeholder */}
      <section className="relative w-full h-64 md:h-96 bg-dark-bg border-b border-border overflow-hidden flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-dark-bg to-background">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-card rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Title Image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Voting Ended Title */}
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mb-4 tracking-tight">
            Voting Ended
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-primary via-gold to-primary mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrating the most elegant and outstanding winners of this year&apos;s event
          </p>
        </div>

        {/* Male Category */}
        <section className="mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center text-primary mb-12 uppercase tracking-wide">
            Male Winners
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-12">
            {maleWinners.map((winner, index) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))}
          </div>
        </section>

        {/* Female Category */}
        <section className="mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center text-primary mb-12 uppercase tracking-wide">
            Female Winners
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {femaleWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))}
          </div>
        </section>

        {/* Thank You Section */}
        <section className="mt-24 pt-20 border-t border-border">
          <div className="text-center space-y-8">
            <div>
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-4">
                Thank You
              </h3>
              <div className="h-1 w-32 bg-gradient-to-r from-primary via-gold to-primary mx-auto"></div>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We extend our heartfelt gratitude to all participants, supporters, and voters who made this event truly special. Your enthusiasm and dedication have made this celebration memorable and successful.
            </p>

            <div className="pt-8">
              <p className="text-primary font-serif text-2xl font-semibold">
                Until Next Year
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Event Concluded • Thank You for Being Part of Our Journey
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function WinnerCard({ winner }: { winner: Winner }) {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Gold':
        return 'from-primary/20 to-primary/10 ring-2 ring-primary/40'
      case 'Silver':
        return 'from-silver/15 to-silver/5 ring-2 ring-silver/30'
      case 'Bronze':
        return 'from-bronze/20 to-bronze/10 ring-2 ring-bronze/40'
      default:
        return ''
    }
  }

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'Gold':
        return 'bg-primary text-primary-foreground'
      case 'Silver':
        return 'bg-silver/80 text-charcoal font-semibold'
      case 'Bronze':
        return 'bg-bronze text-foreground font-semibold'
      default:
        return ''
    }
  }

  const getRankNumber = (rank: string) => {
    switch (rank) {
      case 'Gold':
        return '1st'
      case 'Silver':
        return '2nd'
      case 'Bronze':
        return '3rd'
      default:
        return ''
    }
  }

  return (
    <div className="group relative">
      {/* Card Container */}
      <div className={`bg-gradient-to-br ${getRankColor(winner.rank)} backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20`}>
        {/* Image Container */}
        <div className="relative w-full h-80 md:h-96 bg-dark-bg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-dark-bg via-dark-bg to-charcoal flex items-center justify-center">
            <div className="relative w-full h-full border-2 border-dashed border-border/50">
              <p className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Winner Image
              </p>
            </div>
          </div>
        </div>

        {/* Rank Badge */}
        <div className="absolute top-4 right-4">
          <div className={`${getRankBadgeColor(winner.rank)} px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm`}>
            {getRankNumber(winner.rank)} Place
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-cream line-clamp-2">
              {winner.name}
            </h3>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">{winner.category}</span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold">
              {winner.rank === 'Gold' ? '🥇' : winner.rank === 'Silver' ? '🥈' : '🥉'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
