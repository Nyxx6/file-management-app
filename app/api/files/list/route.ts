import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sonatrach_files",
})

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    const connection = await pool.getConnection()
    const [files] = await connection.execute("SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC", [userId])
    connection.release()

    return NextResponse.json({ success: true, files })
  } catch (error) {
    console.error("List files error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des fichiers" }, { status: 500 })
  }
}
