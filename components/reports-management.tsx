"use client"

import { useState, useEffect } from "react"

interface ReportsManagementProps {
  userRole: string
}

export default function ReportsManagement({ userRole }: ReportsManagementProps) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [status, setStatus] = useState("pending")
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      const response = await fetch(`/api/reports/list?role=${userRole}`)
      const data = await response.json()
      if (data.success) {
        setReports(data.reports)
      }
    } catch (error) {
      console.error("Error loading reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateReport = async () => {
    if (!selectedReport) return

    try {
      const response = await fetch("/api/reports/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: selectedReport.id,
          status,
          adminNotes,
          userRole,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSelectedReport(null)
        loadReports()
      }
    } catch (error) {
      console.error("Error updating report:", error)
    }
  }

  if (loading) return <div className="text-gray-600">Chargement...</div>

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {reports.filter((r: any) => r.status === "pending").length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Examinés</p>
          <p className="text-2xl font-bold text-blue-600">
            {reports.filter((r: any) => r.status === "reviewed").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Résolus</p>
          <p className="text-2xl font-bold text-green-600">
            {reports.filter((r: any) => r.status === "resolved").length}
          </p>
        </div>
      </div>

      {selectedReport ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Détails du signalement</h3>
          <div className="space-y-3 mb-4">
            <p>
              <strong>Fichier:</strong> {selectedReport.file_name}
            </p>
            <p>
              <strong>Signalé par:</strong> {selectedReport.full_name}
            </p>
            <p>
              <strong>Raison:</strong> {selectedReport.reason}
            </p>
            <p>
              <strong>Description:</strong> {selectedReport.description}
            </p>
          </div>

          <div className="space-y-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="pending">En attente</option>
              <option value="reviewed">Examiné</option>
              <option value="resolved">Résolu</option>
            </select>

            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Notes de l'administrateur"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={4}
            />

            <div className="flex gap-2">
              <button
                onClick={handleUpdateReport}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Mettre à jour
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Fichier</th>
                <th className="px-4 py-2 text-left">Signalé par</th>
                <th className="px-4 py-2 text-left">Raison</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report: any) => (
                <tr key={report.id} className="border-b">
                  <td className="px-4 py-2">{report.file_name}</td>
                  <td className="px-4 py-2">{report.full_name}</td>
                  <td className="px-4 py-2">{report.reason}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "reviewed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedReport(report)
                        setStatus(report.status)
                        setAdminNotes(report.admin_notes || "")
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Examiner
                    </button>
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
