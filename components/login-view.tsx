'use client'

import { motion } from 'framer-motion'
import { Crown, Eye } from 'lucide-react'
import { signInWithEmail, signUpWithEmail } from '@/lib/auth-actions'
import { useState } from 'react'

interface LoginViewProps {
  onViewCandidates: () => void
}

export function LoginView({ onViewCandidates }: LoginViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const result = await signInWithEmail(email, password)
      if (result?.error) {
        setError(result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const result = await signUpWithEmail(email, password)
      if (result?.error) {
        setError(result.error)
      } else if (result?.message) {
        setSuccess(result.message)
        setEmail('')
        setPassword('')
        setIsSignUp(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = isSignUp ? handleSignUp : handleSignIn

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
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </span>
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

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e24123@eng.pdn.ac.lk"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-dark text-cream font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </motion.button>
          </form>

          {/* Toggle between sign in and sign up */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setSuccess('')
              }}
              className="text-sm text-muted-foreground hover:text-charcoal transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Don&apos;t have an account? Sign up'}
            </button>
          </div>

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

          {/* View Candidates Link */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={onViewCandidates}
            className="w-full mt-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-charcoal transition-colors py-2"
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
