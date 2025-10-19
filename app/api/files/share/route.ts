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
    const { fileId, userId, permissionType } = await request.json()

    const connection = await pool.getConnection()
    await connection.execute(
      "INSERT INTO permissions (file_id, user_id, permission_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE permission_type = ?",
      [fileId, userId, permissionType, permissionType],
    )
    connection.release()

    return NextResponse.json({ success: true, message: "Fichier partagé" })
  } catch (error) {
    console.error("Share file error:", error)
    return NextResponse.json({ error: "Erreur lors du partage" }, { status: 500 })
  }
}
