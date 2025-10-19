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
    const { fileId, userId, reason, description } = await request.json()

    const connection = await pool.getConnection()

    await connection.execute("INSERT INTO reports (file_id, reported_by, reason, description) VALUES (?, ?, ?, ?)", [
      fileId,
      userId,
      reason,
      description,
    ])

    connection.release()

    return NextResponse.json({ success: true, message: "Signalement enregistré" })
  } catch (error) {
    console.error("Report error:", error)
    return NextResponse.json({ error: "Erreur lors du signalement" }, { status: 500 })
  }
}
