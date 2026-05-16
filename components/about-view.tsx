'use client'

import { motion } from 'framer-motion'
import { Home, Info, LogOut, User, ChevronDown, Crown, Mail, Phone, MapPin, Calendar, Users, Award, Shield, LogIn } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { User as UserType } from '@/lib/types'
import { AnimatePresence } from 'framer-motion'
import { signOut } from '@/lib/auth-actions'

interface AboutViewProps {
  user: UserType
  onNavigate: (page: 'home' | 'about' | 'admin') => void
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function AboutView({ user, onNavigate }: AboutViewProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const rules = [
    { icon: Users, title: 'Separate Voting Pools', description: 'Each voter can cast up to 3 votes for female candidates and 3 votes for male candidates (6 votes total).' },
    { icon: Shield, title: 'Fair Play', description: 'Voting manipulation or creating multiple accounts will result in disqualification.' },
    { icon: Calendar, title: 'Voting Period', description: 'Votes must be cast during the official voting window. Results are final.' },
    { icon: Award, title: 'Winner Selection', description: 'The top 3 candidates with the most votes in each category will be crowned.' },
  ]

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
              <span className="font-serif text-xl text-charcoal hidden sm:block">Avurudu Wasanthaya</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-charcoal hover:bg-muted font-medium text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-charcoal bg-gold/10 font-medium text-sm transition-colors"
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
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-white font-medium text-sm hover:bg-gold-dark transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-champagne via-cream to-gold-light opacity-50" />
        <div className="absolute top-10 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gold-light/20 rounded-full blur-3xl" />
        
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-full shadow-xl mb-6">
              <Crown className="w-10 h-10 text-cream" />
            </div>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
            About the Pageant
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Celebrating elegance, grace, and inner beauty. Join us in recognizing extraordinary individuals who inspire others through their poise and character.
          </motion.p>
        </motion.div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="font-serif text-3xl text-charcoal mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Elegance Pageant is more than a competition—it&apos;s a celebration of individuality, confidence, and the unique qualities that make each participant special.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe that true elegance comes from within, manifesting through kindness, intelligence, and the courage to be authentically oneself.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform empowers participants to showcase their talents and connect with a community that values substance alongside style.
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop"
                alt="Elegance Pageant"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voting Rules */}
      <section className="py-16 bg-gradient-to-b from-cream to-champagne">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4"></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
          
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold-light/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <rule.icon className="w-6 h-6 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-charcoal mb-2">{rule.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rule.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Email Requirement Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gold/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-charcoal mb-2">Eligible Voters</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Only users with a valid <span className="font-medium text-charcoal">e24XXX@eng.pdn.ac.lk</span> email address can vote. 
                  Sign in with your Google account linked to this email to participate in the voting.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="py-16 bg-charcoal text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-cream" />
                </div>
                <span className="font-serif text-xl">Avurudu Wasanthaya</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Celebrating beauty, grace, and excellence.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-serif text-lg mb-4">Contact Us</h3>
              <div className="space-y-3">
                <a href="mailto:info@elegancepageant.com" className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  
                </a>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors text-sm">
                  <Phone className="w-4 h-4" />
                  +1 (234) 567-890
                </a>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <MapPin className="w-4 h-4" />
                  Faculty of Engineering, Peradeniya
                </div>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-serif text-lg mb-4"></h3>
              <p className="text-white/60 text-sm mb-4">
      
              </p>
              <button className="bg-gradient-to-r from-gold to-gold-dark text-charcoal font-medium px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm">

              </button>
            </div>
          </motion.div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/40 text-sm">
              
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
