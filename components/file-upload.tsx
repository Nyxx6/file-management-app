"use client"

import type React from "react"

import { useState } from "react"

interface FileUploadProps {
  userId: number
  onUploadSuccess: () => void
}

export default function FileUpload({ userId, onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState("documents")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", userId.toString())
    formData.append("category", category)

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        setMessage("Fichier uploadé avec succès")
        setFile(null)
        onUploadSuccess()
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Erreur lors de l'upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Uploader un fichier</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="documents">Documents</option>
            <option value="rapports">Rapports</option>
            <option value="contrats">Contrats</option>
            <option value="autres">Autres</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fichier</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Upload en cours..." : "Uploader"}
        </button>
      </form>
    </div>
  )
}
