  'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Winner {
  rank: 'first' | 'second' | 'third'
  name: string
  imageUrl: string
  category: 'male' | 'female'
}

// ============================================
// EDIT THIS SECTION TO ADD WINNER DATA
// ============================================
const FEMALE_WINNERS: Winner[] = [
  {
    rank: 'first',
    name: 'Navodya Ranasinghe',
    imageUrl: 'https://raw.githubusercontent.com/Lextargaryen/temp/1b11484e92d35052e90817c627216fff16abf434/nawodya.png', // Paste image URL here
    category: 'female',
  },
  {
    rank: 'second',
    name: 'Imasha Minsandi',
    imageUrl: 'https://raw.githubusercontent.com/Lextargaryen/temp/1b11484e92d35052e90817c627216fff16abf434/winnersd.png', // Paste image URL here
    category: 'female',
  },
  {
    rank: 'third',
    name: 'Vishmi  Daniel',
    imageUrl: 'https://raw.githubusercontent.com/Lextargaryen/temp/1b11484e92d35052e90817c627216fff16abf434/vishmi.png', // Paste image URL here
    category: 'female',
  },
]

const MALE_WINNERS: Winner[] = [
  {
    rank: 'first',
    name: 'Rashinda Adithya',
    imageUrl: 'https://raw.githubusercontent.com/Lextargaryen/temp/1b11484e92d35052e90817c627216fff16abf434/rando2.png', // Paste image URL here
    category: 'male',
  },
  {
    rank: 'second',
    name: 'Isuru Jayasinghe',
    imageUrl: 'https://raw.githubusercontent.com/Lextargaryen/temp/1b11484e92d35052e90817c627216fff16abf434/isuru.png', // Paste image URL here
    category: 'male',
  },
  {
    rank: 'third',
    name: 'Nadula Gayan',
    imageUrl: 'https://raw.githubusercontent.com/Lextargaryen/temp/a3788e15a6963968c07c9d9fe43329a0202cb6ff/nadun.png', // Paste image URL here
    category: 'male',
  },
]

const WINNERS: Winner[] = [...FEMALE_WINNERS, ...MALE_WINNERS]
// ============================================

const rankConfig = {
  first: { medal: '🥇', label: 'First Place', color: 'bg-gold/10 border-gold/30' },
  second: { medal: '🥈', label: 'Second Place', color: 'bg-silver/10 border-silver/30' },
  third: { medal: '🥉', label: 'Third Place', color: 'bg-bronze/10 border-bronze/30' },
}

export function VotingEndedPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const femaleWinners = WINNERS.filter(w => w.category === 'female')
  const maleWinners = WINNERS.filter(w => w.category === 'male')

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Event Image */}
      <section className={`pt-12 pb-16 px-4 sm:px-6 lg:px-8 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Title Image Container */}
          <div className="w-full h-64 sm:h-80 lg:h-96 rounded-lg bg-gradient-to-br from-light-gray via-background to-white border border-border flex items-center justify-center overflow-hidden relative">
            <img 
              src="https://raw.githubusercontent.com/Lextargaryen/temp/24bfa08f596545c7dcbc98d5b6702958325452ac/MAIN_TEXT_LOW.png" 
              alt="Event Title" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Voting Ended Title */}
      <section className={`py-12 px-4 sm:px-6 lg:px-8 text-center ${isLoaded ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'}`}>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-foreground mb-4 text-balance">
          Voting has Ended
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
          Celebrating the incredible winners of Avurudu Wasanthaya
        </p>
      </section>

      {/* Female Winners Section */}
      <section className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${isLoaded ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-light text-foreground mb-12 text-center">
            Female Winners
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {femaleWinners.map((winner, idx) => (
              <WinnerCard key={`female-${idx}`} winner={winner} delay={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Male Winners Section */}
      <section className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30 ${isLoaded ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-light text-foreground mb-12 text-center">
            Male Winners
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {maleWinners.map((winner, idx) => (
              <WinnerCard key={`male-${idx}`} winner={winner} delay={idx + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className={`py-20 sm:py-24 px-4 sm:px-6 lg:px-8 ${isLoaded ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 opacity-70">
            <p className="text-6xl">✨</p>
          </div>
          <h2 className="text-5xl sm:text-6xl font-serif font-light text-foreground mb-8 text-balance">
            Thank You
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed mb-8">
            Thank you to all participants, sponsors, and supporters who made Avurudu Wasanthaya an unforgettable celebration of talent, elegance, and community spirit.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground font-light">
            This marks the conclusion of this year&apos;s event. We look forward to seeing you at next year&apos;s celebration.
          </p>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground tracking-widest uppercase">
              Avurudu Wasanthaya 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function WinnerCard({ winner, delay }: { winner: Winner; delay: number }) {
  const config = rankConfig[winner.rank]

  return (
    <div
      className="animate-scale-in"
      style={{
        animationDelay: `${delay * 100}ms`,
      }}
    >
      <div className="relative group h-full">
        {/* Card Container */}
        <div className={`${config.color} border-2 rounded-xl overflow-hidden transition-all duration-500 h-full flex flex-col hover:border-accent/50 hover:shadow-lg`}>
          {/* Image Container */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-light-gray to-background flex items-center justify-center overflow-hidden">
            {winner.imageUrl ? (
              <Image
                src={winner.imageUrl}
                alt={winner.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center z-10">
                <p className="text-muted-foreground text-sm">Image URL not set</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 flex flex-col flex-grow">
            {/* Rank Badge */}
            <div className="mb-6 inline-flex items-center gap-2 w-fit">
              <span className="text-3xl">{config.medal}</span>
              <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
                {config.label}
              </span>
            </div>

            {/* Winner Name */}
            <h3 className="text-2xl sm:text-3xl font-serif font-light text-foreground mb-3 text-balance">
              {winner.name}
            </h3>

            {/* Category */}
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-light">
              {winner.category === 'female' ? 'Female' : 'Male'} Winner
            </p>
          </div>
        </div> )

        {/* Subtle hover effect for first place */}
        {winner.rank === 'first' && (
          <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
      </div>
    </div>
  )
}
