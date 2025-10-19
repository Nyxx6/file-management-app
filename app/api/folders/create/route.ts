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
    const { name, parentId, userId, description } = await request.json()

    const connection = await pool.getConnection()
    await connection.execute("INSERT INTO folders (name, parent_id, created_by, description) VALUES (?, ?, ?, ?)", [
      name,
      parentId || null,
      userId,
      description,
    ])
    connection.release()

    return NextResponse.json({ success: true, message: "Dossier créé" })
  } catch (error) {
    console.error("Create folder error:", error)
    return NextResponse.json({ error: "Erreur lors de la création du dossier" }, { status: 500 })
  }
}
