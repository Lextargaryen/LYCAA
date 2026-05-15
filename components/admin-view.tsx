'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Info, Shield, Crown, Plus, Trash2, Edit2, Save, X, 
  Upload, User, ChevronDown, LogOut, ImageIcon
} from 'lucide-react'
import Image from 'next/image'
import { signOut } from '@/lib/auth-actions'
import type { Candidate, User as UserType } from '@/lib/types'

interface AdminViewProps {
  candidates: Candidate[]
  user: UserType
  onCandidatesUpdate: (candidates: Candidate[]) => void
  onNavigate: (page: 'home' | 'about' | 'admin') => void
}

interface CandidateFormData {
  name: string
  candidateNumber: string
  category: 'male' | 'female'
  bio: string
  imageUrl: string
}

const initialFormData: CandidateFormData = {
  name: '',
  candidateNumber: '',
  category: 'female',
  bio: '',
  imageUrl: '',
}

export function AdminView({ candidates, user, onCandidatesUpdate, onNavigate }: AdminViewProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAddingCandidate, setIsAddingCandidate] = useState(false)
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CandidateFormData>(initialFormData)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'female' | 'male'>('female')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredCandidates = candidates.filter(c => c.category === selectedCategory)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { url } = await response.json()
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.candidateNumber) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: formData.name,
        candidate_number: parseInt(formData.candidateNumber),
        category: formData.category,
        bio: formData.bio || null,
        image_url: formData.imageUrl || null,
      }

      let response: Response
      if (editingCandidateId) {
        response = await fetch(`/api/candidates/${editingCandidateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save candidate')
      }

      const { candidate: savedCandidate } = await response.json()
      if (!savedCandidate) {
        throw new Error('Invalid response from server')
      }

      // Update local state
      if (editingCandidateId) {
        onCandidatesUpdate(candidates.map(c => 
          c.id === editingCandidateId 
            ? {
                ...c,
                name: savedCandidate.name,
                candidateNumber: savedCandidate.candidate_number,
                category: savedCandidate.category,
                bio: savedCandidate.bio || '',
                imageUrl: savedCandidate.image_url || '/placeholder.svg',
              }
            : c
        ))
      } else {
        onCandidatesUpdate([...candidates, {
          id: savedCandidate.id,
          name: savedCandidate.name,
          candidateNumber: savedCandidate.candidate_number,
          category: savedCandidate.category,
          bio: savedCandidate.bio || '',
          imageUrl: savedCandidate.image_url || '/placeholder.svg',
          votes: savedCandidate.votes ?? 0,
        }])
      }

      resetForm()
    } catch (error) {
      console.error('Save error:', error)
      alert(error instanceof Error ? error.message : 'Failed to save candidate')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete candidate')
      }

      onCandidatesUpdate(candidates.filter(c => c.id !== candidateId))
    } catch (error) {
      console.error('Delete error:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete candidate')
    }
  }

  const handleEdit = (candidate: Candidate) => {
    setFormData({
      name: candidate.name,
      candidateNumber: candidate.candidateNumber.toString(),
      category: candidate.category,
      bio: candidate.bio || '',
      imageUrl: candidate.imageUrl || '',
    })
    setEditingCandidateId(candidate.id)
    setIsAddingCandidate(true)
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingCandidateId(null)
    setIsAddingCandidate(false)
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
              <span className="font-serif text-xl text-charcoal hidden sm:block">Admin Panel</span>
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-charcoal hover:bg-muted font-medium text-sm transition-colors"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-charcoal bg-gold/10 font-medium text-sm transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-400/50 bg-purple-100 flex items-center justify-center">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <Shield className="w-4 h-4 text-purple-600" />
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
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                        Admin
                      </span>
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
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-serif text-3xl text-charcoal">Manage Candidates</h1>
            <p className="text-muted-foreground mt-1">Add, edit, or remove candidates from the pageant</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setIsAddingCandidate(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Candidate
          </button>
        </motion.div>

        {/* Category Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-secondary rounded-xl p-1.5 border border-border">
            {(['female', 'male'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
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
                    layoutId="adminCategoryTab"
                    className="absolute inset-0 bg-gradient-to-r from-gold to-gold-dark rounded-lg shadow-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 capitalize">{category} ({candidates.filter(c => c.category === category).length})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {isAddingCandidate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={(e) => e.target === e.currentTarget && resetForm()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl text-charcoal">
                      {editingCandidateId ? 'Edit Candidate' : 'Add New Candidate'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Candidate Photo
                    </label>
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-32 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                        {formData.imageUrl ? (
                          <Image
                            src={formData.imageUrl}
                            alt="Preview"
                            width={96}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Upload Image
                            </>
                          )}
                        </button>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPEG, PNG, WebP or GIF. Max 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter candidate name"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      required
                    />
                  </div>

                  {/* Candidate Number and Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Candidate # <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.candidateNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, candidateNumber: e.target.value }))}
                        placeholder="e.g. 1"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Category <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'male' | 'female' }))}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Bio (Optional)
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Write a short bio for the candidate..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-3 rounded-xl border border-border text-charcoal font-medium hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editingCandidateId ? 'Update' : 'Add'} Candidate
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Candidates List */}
        {filteredCandidates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <User className="w-16 h-16 text-gold/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-charcoal mb-2">No {selectedCategory} candidates yet</h3>
            <p className="text-muted-foreground mb-6">Add your first candidate to get started</p>
            <button
              onClick={() => {
                resetForm()
                setFormData(prev => ({ ...prev, category: selectedCategory }))
                setIsAddingCandidate(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-white font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add {selectedCategory} Candidate
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCandidates
              .sort((a, b) => a.candidateNumber - b.candidateNumber)
              .map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={candidate.imageUrl || '/placeholder.svg'}
                    alt={candidate.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    #{candidate.candidateNumber}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {candidate.votes} votes
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-charcoal">{candidate.name}</h3>
                  {candidate.bio && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{candidate.bio}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(candidate)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-muted transition-colors text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(candidate.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
