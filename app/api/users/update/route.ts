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

export async function POST(request: NextRequest) {
  try {
    const { userId, full_name, role, department, userRole } = await request.json()

    if (userRole !== "admin" && userRole !== "secretaire") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const connection = await pool.getConnection()
    await connection.execute("UPDATE users SET full_name = ?, role = ?, department = ? WHERE id = ?", [
      full_name,
      role,
      department,
      userId,
    ])
    connection.release()

    return NextResponse.json({ success: true, message: "Utilisateur mis à jour" })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}
