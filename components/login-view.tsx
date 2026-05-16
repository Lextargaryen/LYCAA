'use client'

import { motion } from 'framer-motion'
import { Crown, Eye } from 'lucide-react'
import { signInWithGoogle } from '@/lib/auth-actions'
import { useState } from 'react'

interface LoginViewProps {
  onViewCandidates: () => void
}

export function LoginView({ onViewCandidates }: LoginViewProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Sign in error:', error)
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
              Avurudu Wasanthaya
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

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-border rounded-xl py-4 px-6 transition-all duration-300 shadow-sm hover:shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="text-charcoal font-medium">
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </motion.button>

          {/* Email requirement notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-lg"
          >
            <p className="text-xs text-muted-foreground text-center">
              Voting requires an <span className="font-medium text-charcoal">eXXXXX@eng.pdn.ac.lk</span> email address
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
