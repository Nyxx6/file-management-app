"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FileUpload from "@/components/file-upload"
import FileList from "@/components/file-list"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    if (parsedUser.role === "admin") {
      router.push("/dashboard/admin")
      return
    } else if (parsedUser.role === "secretaire") {
      router.push("/dashboard/secretaire")
      return
    }

    loadFiles(parsedUser.id)
  }, [router])

  const loadFiles = async (userId: number) => {
    try {
      const response = await fetch(`/api/files/list?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error("Error loading files:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Fichiers</h1>
            <p className="text-gray-600">Bienvenue, {user.full_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{user.role}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <FileUpload userId={user.id} onUploadSuccess={() => loadFiles(user.id)} />
          </div>

          {/* Files List */}
          <div className="lg:col-span-2">
            <FileList files={files} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  )
}
