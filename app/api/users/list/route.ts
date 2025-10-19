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

    if (userRole !== "admin" && userRole !== "secretaire") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const connection = await pool.getConnection()
    const [users] = await connection.execute(
      "SELECT id, email, full_name, role, department, is_active, created_at FROM users ORDER BY created_at DESC",
    )
    connection.release()

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("List users error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs" }, { status: 500 })
  }
}
