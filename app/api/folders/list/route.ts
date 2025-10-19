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
    const parentId = request.nextUrl.searchParams.get("parentId")

    const connection = await pool.getConnection()
    const [folders] = await connection.execute("SELECT * FROM folders WHERE parent_id = ? ORDER BY name ASC", [
      parentId || null,
    ])
    connection.release()

    return NextResponse.json({ success: true, folders })
  } catch (error) {
    console.error("List folders error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des dossiers" }, { status: 500 })
  }
}
