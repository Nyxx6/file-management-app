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
    const { user_id, code } = await request.json()

    const connection = await pool.getConnection()
    const [sessions] = await connection.execute(
      "SELECT * FROM two_fa_sessions WHERE user_id = ? AND code = ? AND expires_at > NOW() AND is_used = FALSE",
      [user_id, code],
    )

    if (!sessions || sessions.length === 0) {
      connection.release()
      return NextResponse.json({ error: "Code 2FA invalide ou expiré" }, { status: 401 })
    }

    // Marquer le code comme utilisé
    await connection.execute("UPDATE two_fa_sessions SET is_used = TRUE WHERE id = ?", [sessions[0].id])

    // Récupérer les infos utilisateur
    const [users] = await connection.execute("SELECT * FROM users WHERE id = ?", [user_id])
    connection.release()

    const user = users[0]

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
