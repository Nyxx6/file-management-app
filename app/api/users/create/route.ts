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
    const { email, password, full_name, role, department, userRole } = await request.json()

    if (userRole !== "admin" && userRole !== "secretaire") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const connection = await pool.getConnection()

    try {
      await connection.execute(
        "INSERT INTO users (email, password, full_name, role, department) VALUES (?, ?, ?, ?, ?)",
        [email, password, full_name, role, department],
      )
      connection.release()

      return NextResponse.json({ success: true, message: "Utilisateur créé" })
    } catch (error: any) {
      connection.release()
      if (error.code === "ER_DUP_ENTRY") {
        return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
}
