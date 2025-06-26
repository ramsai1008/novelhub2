'use client'

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../../lib/useAuth'

export default function RegisterPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) router.push('/')
  }, [user, router])

  const handleGoogleRegister = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google icon"
            className="w-5 h-5"
          />
          Register with Google
        </button>
      </div>
    </div>
  )
}
