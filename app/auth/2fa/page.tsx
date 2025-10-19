"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TwoFAPage() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const id = sessionStorage.getItem("pending_user_id")
    if (!id) {
      router.push("/")
      return
    }
    setUserId(Number(id))
  }, [router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Code invalide")
        return
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      sessionStorage.removeItem("pending_user_id")
      router.push("/dashboard")
    } catch (err) {
      setError("Erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Vérification 2FA</h1>
        <p className="text-center text-gray-600 mb-8">Entrez le code reçu par email</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code 2FA</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="000000"
              required
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Vérification..." : "Vérifier"}
          </button>
        </form>
      </div>
    </div>
  )
}
