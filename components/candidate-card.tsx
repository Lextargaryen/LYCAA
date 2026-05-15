'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Lock, Star } from 'lucide-react'
import Image from 'next/image'
import type { Candidate } from '@/lib/types'

interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  isDisabled: boolean
  onVote: () => void
  rank?: number
  isWinner?: boolean
  showVoteButton?: boolean
}

const rankColors = {
  1: { bg: 'from-yellow-400 to-yellow-600', border: 'border-yellow-400', text: 'text-yellow-600', label: '1st Place' },
  2: { bg: 'from-gray-300 to-gray-500', border: 'border-gray-400', text: 'text-gray-500', label: '2nd Place' },
  3: { bg: 'from-amber-600 to-amber-800', border: 'border-amber-600', text: 'text-amber-700', label: '3rd Place' },
}

export function CandidateCard({ candidate, isSelected, isDisabled, onVote, rank, isWinner, showVoteButton = true }: CandidateCardProps) {
  const rankStyle = rank ? rankColors[rank as keyof typeof rankColors] : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`
        relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300
        ${isWinner ? 'ring-2 ring-offset-2 ' + (rankStyle?.border || '') : ''}
        ${isSelected ? 'ring-2 ring-gold ring-offset-2' : ''}
      `}
    >
      {/* Rank Badge for Winners */}
      {isWinner && rank && rankStyle && (
        <div className={`absolute top-3 left-3 z-20 bg-gradient-to-r ${rankStyle.bg} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1`}>
          <Star className="w-3 h-3 fill-current" />
          {rankStyle.label}
        </div>
      )}

      {/* Selected Badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-3 right-3 z-20 w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={candidate.imageUrl || '/placeholder.svg'}
          alt={candidate.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Vote Count Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {candidate.votes} {candidate.votes === 1 ? 'vote' : 'votes'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-serif text-lg text-charcoal leading-tight">{candidate.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Candidate #{candidate.candidateNumber}</p>
          </div>
        </div>

        {/* Vote Button */}
        {showVoteButton && (
          <motion.button
            whileHover={!isDisabled && !isSelected ? { scale: 1.02 } : {}}
            whileTap={!isDisabled && !isSelected ? { scale: 0.98 } : {}}
            onClick={onVote}
            disabled={isDisabled && !isSelected}
            className={`
              w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2
              ${isSelected 
                ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-md' 
                : isDisabled 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-secondary hover:bg-gold/10 text-charcoal hover:text-gold-dark border border-border hover:border-gold/30'
              }
            `}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                Voted
              </>
            ) : isDisabled ? (
              <>
                <Lock className="w-4 h-4" />
                Locked
              </>
            ) : (
              'Vote'
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
