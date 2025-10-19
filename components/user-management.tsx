"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface UserManagementProps {
  userRole: string
}

export default function UserManagement({ userRole }: UserManagementProps) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user",
    department: "",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch(`/api/users/list?role=${userRole}`)
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRole }),
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ email: "", password: "", full_name: "", role: "user", department: "" })
        setShowForm(false)
        loadUsers()
      }
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      try {
        const response = await fetch("/api/users/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userRole }),
        })

        const data = await response.json()
        if (data.success) {
          loadUsers()
        }
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  if (loading) return <div className="text-gray-600">Chargement...</div>

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        {showForm ? "Annuler" : "Créer un utilisateur"}
      </button>

      {showForm && (
        <form onSubmit={handleCreateUser} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Nom complet"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="user">Utilisateur</option>
            <option value="secretaire">Secrétaire</option>
            {userRole === "admin" && <option value="admin">Admin</option>}
          </select>
          <input
            type="text"
            placeholder="Département"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
            Créer
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Rôle</th>
              <th className="px-4 py-2 text-left">Département</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.full_name}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{user.role}</span>
                </td>
                <td className="px-4 py-2">{user.department}</td>
                <td className="px-4 py-2">
                  {userRole === "admin" && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
