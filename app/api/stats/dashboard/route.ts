import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sonatrach_files",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function GET(request: NextRequest) {
  try {
    const userRole = request.nextUrl.searchParams.get("role")

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const connection = await pool.getConnection()

    // Récupérer les statistiques
    const [totalUsers] = await connection.execute("SELECT COUNT(*) as count FROM users")
    const [totalFiles] = await connection.execute("SELECT COUNT(*) as count FROM files")
    const [totalReports] = await connection.execute("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'")
    const [recentActivity] = await connection.execute("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10")

    connection.release()

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalUsers[0].count,
        totalFiles: totalFiles[0].count,
        pendingReports: totalReports[0].count,
        recentActivity,
      },
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des statistiques" }, { status: 500 })
  }
}
