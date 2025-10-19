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
    const [reports] = await connection.execute(
      "SELECT r.*, f.file_name, u.full_name FROM reports r JOIN files f ON r.file_id = f.id JOIN users u ON r.reported_by = u.id ORDER BY r.created_at DESC",
    )
    connection.release()

    return NextResponse.json({ success: true, reports })
  } catch (error) {
    console.error("List reports error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des signalements" }, { status: 500 })
  }
}
