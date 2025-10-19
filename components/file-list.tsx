"use client"

import { useState } from "react"

interface FileListProps {
  files: any[]
  loading: boolean
  onDelete?: (fileId: number) => void
  onReport?: (fileId: number) => void
}

export default function FileList({ files, loading, onDelete, onReport }: FileListProps) {
  const [expandedFile, setExpandedFile] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Chargement des fichiers...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Mes fichiers</h2>
      </div>

      {files.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-600">Aucun fichier uploadé</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nom du fichier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Taille</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{file.file_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{file.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{(file.file_size / 1024).toFixed(2)} KB</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(file.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <a href={file.file_path} download className="text-blue-600 hover:text-blue-800 font-medium">
                      Télécharger
                    </a>
                    {onDelete && (
                      <button onClick={() => onDelete(file.id)} className="text-red-600 hover:text-red-800 font-medium">
                        Supprimer
                      </button>
                    )}
                    {onReport && (
                      <button
                        onClick={() => onReport(file.id)}
                        className="text-orange-600 hover:text-orange-800 font-medium"
                      >
                        Signaler
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
