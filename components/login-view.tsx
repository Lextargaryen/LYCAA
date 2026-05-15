'use client'

import { motion } from 'framer-motion'
import { Crown, Eye, Mail, ArrowRight } from 'lucide-react'
import { signInWithMagicLink } from '@/lib/auth-actions'
import { useState } from 'react'

interface LoginViewProps {
  onViewCandidates: () => void
}

export function LoginView({ onViewCandidates }: LoginViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await signInWithMagicLink(email)
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.message)
        setEmail('')
      }
    } catch (error) {
      console.error('[v0] Sign in error:', error)
      setError('Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elegant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-champagne via-cream to-gold-light opacity-60" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gold-light/20 rounded-full blur-3xl" />
      
      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 md:p-12 shadow-xl">
          {/* Logo / Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-cream" />
              </div>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">
              Elegance Pageant
            </h1>
            <p className="text-muted-foreground text-sm">
              Cast your vote for excellence
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Sign In</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-sm text-green-700">{success}</p>
            </motion.div>
          )}

          {/* Magic Link Sign In Form */}
          <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e24123@eng.pdn.ac.lk"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white disabled:opacity-50"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-cream font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                  Sending link...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Magic Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Email requirement notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-lg"
          >
            <p className="text-xs text-muted-foreground text-center">
              Voting requires an <span className="font-medium text-charcoal">e24XXX@eng.pdn.ac.lk</span> email address
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>

          {/* View Candidates Link */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={onViewCandidates}
            className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-charcoal transition-colors py-2"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">View candidates without signing in</span>
          </motion.button>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
